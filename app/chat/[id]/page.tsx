"use client"

import { useRef, useState } from "react";
import Chat from "../../../components/Chat";
import ChatInput from "../../../components/ChatInput";
import { inter } from "../../../lib/fonts"

type Props = {
	params: {
		id: string;
	};
};

function ChatPage({ params: { id } }: Props) {
	const [isStreaming, setStreaming] = useState<boolean>(false);
	const answerNode = useRef<HTMLTextAreaElement>(null);
	const [messageStream, setMessageStream] = useState("");

	return (
		<div className={"flex flex-col h-screen overflow-hidden " + inter.className}>
			<Chat chatId={id} isStreaming={isStreaming} answerNode={answerNode} messageStream={messageStream} />
			<ChatInput chatId={id} setStreaming={setStreaming} answerNode={answerNode} setMessageStream={setMessageStream} />
		</div>
	);
}

export default ChatPage;
