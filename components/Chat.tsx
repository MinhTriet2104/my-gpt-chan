"use client";

import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import {
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { LegacyRef, useEffect, RefObject } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Message from "./Message";
import Image from 'next/image';
import GptChanAvatar from "../images/gpt-chan-avatar.png"
// import MessageBot from "./MessageBot";
// import { markdownToHtml } from "./ShowdownWrapper";

type Props = {
  chatId: string;
  isStreaming: Boolean;
  answerNode: RefObject<HTMLTextAreaElement>;
  htmlRenderNode: RefObject<HTMLParagraphElement>;
  messagesEndRef: RefObject<HTMLDivElement>;
  // messageStream: String;
};

const MessageGptChan = (
  (
    { message, hidden, refText, refHtml }: { message: String; hidden?: Boolean, refText?: LegacyRef<HTMLTextAreaElement>, refHtml?: LegacyRef<HTMLParagraphElement>},
    // ref?: LegacyRef<HTMLTextAreaElement>, refHtml?: LegacyRef<HTMLParagraphElement>
  ) => {
    const isChatGPT = true;
    // const messageText = message.text.replace(/\n/g, "<br>");
    // const messageText = markdownToHtml("" + message);

    return (
      <div
        className={`${hidden ? "hidden" : "block"} py-5 text-white ${
          isChatGPT && "bg-[#343541]"
        }`}
      >
        <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
          <Image
            src={GptChanAvatar}
            alt="GPT-chan"
            className="h-9 w-9 rounded-full"
          />
          {/* <article className="prose lg:prose-md prose-slate dark:prose-invert" dangerouslySetInnerHTML={{ __html: messageText }} /> */}
          <article
            ref={refHtml}
            className={refHtml && !hidden ? `prose lg:prose-md prose-invert after:-mb-1 after:inline-block after:h-5 after:w-2 after:animate-blink after:bg-gray-600 after:content-[''] after:dark:bg-gray-400` : ""}
            // dangerouslySetInnerHTML={{ __html: messageText }}
          />
          <textarea ref={refText} className="hidden"></textarea>
        </div>
      </div>
    );
  }
);

function Chat({ chatId, isStreaming, answerNode, htmlRenderNode, messagesEndRef }: Props) {
  const { data: session } = useSession();
  // const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session?.user?.email!,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // console.log("Scroll to bot")
  }, [messages?.docs.length]);

  return (
    <div id="messagesWrapper" className="flex-1 overflow-y-auto overflow-x-hidden">
      {messages?.empty && (
        <>
          <p className="=mt-10 text-center text-white">
            Type a message below to get started!
          </p>
          <ArrowDownCircleIcon className="h-10 w-10 mx-auto mt-5 text-white animate-bounce" />
        </>
      )}
      {messages?.docs.map((message) => (
        <Message key={message.id} message={message.data()} />
      ))}
      <MessageGptChan message="" refText={answerNode} refHtml={htmlRenderNode} hidden={!isStreaming} />
      <div ref={messagesEndRef} />
    </div>
  );
}

export default Chat;
