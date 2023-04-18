// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from 'next'
import queryApi from '../../lib/queryApi';
// import admin from 'firebase-admin';
// import { adminDb } from '../../firebaseAdmin';
// import { ChatCompletionRequestMessage } from "openai"

import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
 
export const config = {
  runtime: 'edge',
};
 
// export default function MyEdgeFunction(
//   request: NextRequest,
//   context: NextFetchEvent,
// ) {
//   return NextResponse.json({
//     name: `Hello, from ${request.url} I'm an Edge Function!`,
//   });
// }

export default async function handler(
	req: NextRequest,
	event: NextFetchEvent
) {
	const { prompt, chatId, model, session, previousRequestMessages } = await req.json();

	// if (!prompt) {
	// 	res.status(400).json({ answer: "Please provide a prompt!" });
	// 	return;
	// }

	// if (!chatId) {
	// 	res.status(400).json({ answer: "Please provide a valid chat ID!" });
	// 	return;
	// }

	// ChatGPT Query
	// const lastMessages = await adminDb
	// 			.collection('users')
	// 			.doc(session?.user?.email)
	// 			.collection('chats')
	// 			.doc(chatId)
	// 			.collection('messages')
	// 			.orderBy('createdAt', 'desc')
	// 			.limit(6)
	// 			.get()
			
	// const previousRequestMessages: ChatCompletionRequestMessage[] = lastMessages?.docs.map((message) => {
	// 	const messageData = message.data();
	// 	const role = messageData.user.name === 'GPT-chan' || messageData.user.name === 'ChatGPT' ? 'assistant' : 'user';
	// 	return {
	// 		"role": role,
	// 		"content": '' + messageData.text.trim().replace(/\n|\r/g, "")
	// 	}
	// });

	const response = await queryApi(prompt, previousRequestMessages, chatId, model);

	// const message: Message = {
	// 	text: response || "GPT-chan was unable to find an answer for that!",
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

	return NextResponse.json({ answer: response });
}
