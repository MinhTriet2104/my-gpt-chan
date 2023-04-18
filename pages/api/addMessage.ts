import type { NextApiRequest, NextApiResponse } from "next";
import admin from 'firebase-admin';
import { adminDb } from '../../firebaseAdmin';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
    const { answer, session, chatId } = req.body;

    const messageObj: Message = {
    	text: answer || "GPT-chan was unable to find an answer for that!",
    	createdAt: admin.firestore.Timestamp.now(),
    	user: {
    		_id: 'GPT-chan',
    		name: 'GPT-chan',
    		avatar: "https://i.pinimg.com/1200x/06/19/c7/0619c75193b55bec40a1b6161ed1672b.jpg",
    	},
    };
    
    await adminDb
    	.collection('users')
    	.doc(session?.user?.email!)
    	.collection('chats')
    	.doc(chatId)
    	.collection('messages')
    	.add(messageObj);

	res.status(200).json({ status: 'ok' });
}
