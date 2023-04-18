"use client";

import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import {
  collection,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { forwardRef, LegacyRef, useState, useEffect, useRef, RefObject } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Message from "./Message";
// import MessageBot from "./MessageBot";
import { markdownToHtml } from "./ShowdownWrapper";

type Props = {
  chatId: string;
  isStreaming: Boolean;
  answerNode: RefObject<HTMLTextAreaElement>;
  messageStream: String;
};

const MessageGptChan = forwardRef(
  (
    { message, hidden }: { message: String; hidden?: Boolean },
    ref?: LegacyRef<HTMLTextAreaElement>
  ) => {
    const isChatGPT = true;
    // const messageText = message.text.replace(/\n/g, "<br>");
    const messageText = markdownToHtml("" + message);

    return (
      <div
        className={`${hidden ? "hidden" : "block"} py-5 text-white ${
          isChatGPT && "bg-[#343541]"
        }`}
      >
        <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
          <img
            src="https://i.pinimg.com/1200x/06/19/c7/0619c75193b55bec40a1b6161ed1672b.jpg"
            alt=""
            className="h-9 w-9 rounded-full"
          />
          {/* <article className="prose lg:prose-md prose-slate dark:prose-invert" dangerouslySetInnerHTML={{ __html: messageText }} /> */}
          <article
            className={ref && !hidden ? `prose lg:prose-md prose-invert` : ""}
            dangerouslySetInnerHTML={{ __html: messageText }}
          />
          <textarea ref={ref} className="hidden"></textarea>
        </div>
      </div>
    );
  }
);

function Chat({ chatId, isStreaming, answerNode, messageStream }: Props) {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
      <MessageGptChan message={messageStream} ref={answerNode} hidden={!isStreaming} />
      <div ref={messagesEndRef} />
    </div>
  );
}

export default Chat;
