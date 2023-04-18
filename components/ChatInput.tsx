"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { addDoc, getDocs, query, collection, limit, orderBy, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../firebase";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";
import { ChatCompletionRequestMessage } from "openai"
import admin from 'firebase-admin';
import { adminDb } from '../firebaseAdmin';

type Props = {
	chatId: string;
};

function ChatInput({ chatId }: Props) {
	const [prompt, setPrompt] = useState<string>("");
	const { data: session } = useSession();

	const { data: model } = useSWR("model", {
		fallbackData: "gpt-3.5-turbo",
	});

	const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!prompt) return;

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
				orderBy('createdAt', 'desc'),
				limit(7)
			)
		);
			
		const previousRequestMessages: ChatCompletionRequestMessage[] = lastMessages?.docs.map((message) => {
			const messageData = message.data();
			const role = messageData.user.name === 'GPT-chan' || messageData.user.name === 'ChatGPT' ? 'assistant' : 'user';
			return {
				"role": role,
				"content": '' + messageData.text.trim().replace(/\n|\r/g, "")
			}
		});

		await fetch("/api/askQuestion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				prompt: input,
				chatId,
				model,
				session,
				previousRequestMessages
			}),
		}).then((res) => {
			console.log(res);

			// const message: Message = {
			// 	text: answer || "GPT-chan was unable to find an answer for that!",
			// 	createdAt: admin.firestore.Timestamp.now(),
			// 	user: {
			// 		_id: 'GPT-chan',
			// 		name: 'GPT-chan',
			// 		avatar: "https://i.pinimg.com/1200x/06/19/c7/0619c75193b55bec40a1b6161ed1672b.jpg",
			// 	},
			// };

			// await adminDb
			// 	.collection('users')
			// 	.doc(session?.user?.email)
			// 	.collection('chats')
			// 	.doc(chatId)
			// 	.collection('messages')
			// 	.add(message);
			// Toast notification to say successful...
			toast.success("GPT-chan has responded!", {
				id: notification,
			});
		});
	};

	return (
		<div
			className="bg-slate-800 text-gray-400 text-sm focus:outline-none">
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
					className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed">
					<PaperAirplaneIcon className="h-4 w-4 -rotate-45 mf-1" />
				</button>
			</form>

			<div className="md:hidden">
				<ModelSelection />
			</div>
		</div>
	);
}

export default ChatInput;
