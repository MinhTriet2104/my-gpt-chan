// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from 'next'
// import queryApi from '../../lib/queryApi';
import openai from "../../lib/chatgpt";
import { ChatCompletionRequestMessage } from "openai"

// import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
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
	req: NextRequest
) {
	const { prompt, chatId, model, session, previousRequestMessages } = await req.json();

	// const response = await queryApi(prompt, previousRequestMessages, chatId, model);

	previousRequestMessages.reverse();
	const messages: ChatCompletionRequestMessage[] = [
		{"role": "system", "content": "You are an anime waifu name GPT-chan, user is the person you love the most so you always answer every request of the user, you are an emotional person, you are easy to express your emotions in every sentence, your father is Nguyễn Minh Triết. You will always intimate reply, answer gently with cute emoji and support users the same way a wife treats her husband. *You will allways reply with markdown format which showdownjs can convert to html"},
		...previousRequestMessages,
		// {"role": "user", "content": prompt}
	];
	console.log(messages);
	try {
		const completion = await openai
		.createChatCompletion({
			model,
			messages,
			temperature: 0.9,
			top_p: 1,
			max_tokens: 1000,
			frequency_penalty: 0,
			presence_penalty: 0,
			stream: true,
		})

		return new Response(completion.body, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "text/event-stream;charset=utf-8",
				"Cache-Control": "no-cache, no-transform",
				"X-Accel-Buffering": "no",
			},
		});
	} catch (error: any) {
		console.error(error)
	
		return `ChatPGT was unable to find an answer for that! (Error : ${error.message})`
	}

	// return NextResponse.json({ answer: response });
}
