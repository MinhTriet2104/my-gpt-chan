"use client";

import { useRef, useState } from "react";
import Chat from "../../../components/Chat";
import ChatInput from "../../../components/ChatInput";
import { inter } from "../../../lib/fonts";

type Props = {
  params: {
    id: string;
  };
};

function ChatPage({ params: { id } }: Props) {
  const [isStreaming, setStreaming] = useState<boolean>(false);
  const answerNode = useRef<HTMLTextAreaElement>(null);
  const htmlRenderNode = useRef<HTMLParagraphElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const [messageStream, setMessageStream] = useState("");

  return (
    <div
      className={"flex flex-col h-screen overflow-hidden " + inter.className}
    >
      <Chat
        chatId={id}
        isStreaming={isStreaming}
        answerNode={answerNode}
        htmlRenderNode={htmlRenderNode}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput
        chatId={id}
        isStreaming={isStreaming}
        setStreaming={setStreaming}
        answerNode={answerNode}
        htmlRenderNode={htmlRenderNode}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}

export default ChatPage;
