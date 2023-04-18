"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  getDocs,
  query,
  collection,
  limit,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { db } from "../firebase";
// import ModelSelection from "./ModelSelection";
import useSWR from "swr";
import { ChatCompletionRequestMessage } from "openai";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { markdownToHtml } from "./ShowdownWrapper";
import { setTimeout } from "timers";

type Props = {
  chatId: string;
  setStreaming: Dispatch<SetStateAction<boolean>>;
  answerNode: RefObject<HTMLTextAreaElement>;
  // messageStream: String;
  setMessageStream: Dispatch<SetStateAction<string>>;
};

class RetriableError extends Error {}
class FatalError extends Error {}

const HEADERS_STREAM = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "text/event-stream;charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
};

function ChatInput({ chatId, setStreaming, answerNode, setMessageStream }: Props) {
  const [prompt, setPrompt] = useState<string>("");
  const [isConvertMarkdown, setIsConvertMarkdown] = useState<boolean>(false);
  const { data: session } = useSession();

  const { data: model } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo",
  });

  function onData(data: string) {
    if (!answerNode.current) {
      return;
    }
    try {
      let text = JSON.parse(data).choices[0].delta.content;
      if (text) {
        answerNode.current.value = answerNode.current.value + text;
        if (!isConvertMarkdown) {
          setIsConvertMarkdown(true);
          setTimeout(() => {
            setMessageStream(markdownToHtml(answerNode?.current?.value || ""));
            if (isConvertMarkdown) setIsConvertMarkdown(false);
          }, 200);
        }
      }
    } catch (err) {
      console.log(`Failed to parse data: ${data}`);
      if (data !== "[DONE]") {
        console.log(`Failed to parse the response`);
      }
    }
  }

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt) return;

    setStreaming(true);
    if (answerNode.current) {
      answerNode.current.value = "";
      setMessageStream("");
    }

    const input = prompt.trim();
    setPrompt("");

    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };
    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );
    // Toast notification
    const notification = toast.loading("GPT-chan is thinking...");

    const lastMessages = await getDocs(
      query(
        collection(
          db,
          "users",
          session?.user?.email!,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "desc"),
        limit(7)
      )
    );

    const previousRequestMessages: ChatCompletionRequestMessage[] =
      lastMessages?.docs.map((message) => {
        const messageData = message.data();
        const role =
          messageData.user.name === "GPT-chan" ||
          messageData.user.name === "ChatGPT"
            ? "assistant"
            : "user";
        return {
          role: role,
          content: "" + messageData.text.trim().replace(/\n|\r/g, ""),
        };
      });

    // await fetch("/api/askQuestion", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     prompt: input,
    //     chatId,
    //     model,
    //     session,
    //     previousRequestMessages,
    //   }),
    // }).then(async (res) => {
    //   const data = await res.json();

    //   await fetch("/api/addMessage", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       data: data,
    //       chatId,
    //       session,
    //     }),
    //   });

    //   // Toast notification to say successful...
    //   toast.success("GPT-chan has responded!", {
    //     id: notification,
    //   });
    // });

    const ctrl = new AbortController();
    await fetchEventSource("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
        previousRequestMessages,
      }),
      openWhenHidden: true,
      signal: ctrl.signal,
      async onopen(response) {
        // answerValue.current = ""
        if (answerNode.current) {
          answerNode.current.value = "";
          setMessageStream("");
        }
        console.log("onopen");
        if (
          response.ok &&
          response.headers.get("content-type")?.replace(/ /g, "") ===
            HEADERS_STREAM["Content-Type"]
        ) {
          // all good
          return;
        } else if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          // client-side errors are usually non-retriable:
          throw new FatalError();
        } else {
          throw new RetriableError();
        }
      },
      onmessage(msg) {
        // if the server emits an error message, throw an exception
        // so it gets handled by the onerror callback below:
        if (msg.event === "FatalError") {
          throw new FatalError(msg.data);
        }
        try {
          onData(msg.data);
        } catch (error) {
          console.log("aborting");
          ctrl.abort();
          setStreaming(false);
        }
      },
      async onclose() {
        await fetch("/api/addMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer: answerNode?.current?.value,
            chatId,
            session
          })
        });
        setStreaming(false);
        toast.success("GPT-chan has finished!", {
          id: notification,
        });
      },
      onerror(err) {
        if (err instanceof FatalError) {
          console.log("onerror fatal", err);
          // rethrow to stop the operation
          // setAwaitingFirstToken(false)
          setStreaming(false);
          console.log(`Something went wrong with the request`);
          // throw err
        } else {
          console.log("onerror other", err);
          // do nothing to automatically retry. You can also
          // return a specific retry interval here.
        }
      },
    });

    useEffect(() => {
      if (typeof ResizeObserver === "undefined") {
        return () => {};
      }

      const observer = new ResizeObserver((entries) => {
        // TODO: debounce scroll?
        window.scroll({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });

      if (answerNode.current) {
        observer.observe(answerNode.current);
      }

      return () => {
        if (answerNode.current) {
          observer.unobserve(answerNode.current);
        }
      };
    }, [answerNode.current]);
  };

  return (
    <div className="bg-slate-800 text-gray-400 text-sm focus:outline-none">
      <form onSubmit={sendMessage} className="p-5 space-x-5 flex">
        <input
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={!session}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="Type your message here..."
        />

        <button
          disabled={!prompt || !session}
          type="submit"
          className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-4 w-4 -rotate-45 mf-1" />
        </button>
      </form>

      {/* <div className="md:hidden">
				<ModelSelection />
			</div> */}
    </div>
  );
}

export default ChatInput;
