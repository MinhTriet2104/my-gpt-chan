import openai from "./chatgpt";
import { ChatCompletionRequestMessage } from "openai"

const query = async (prompt: string, previousRequestMessages: ChatCompletionRequestMessage[], chatId: string, model: string) => {
	const promptWithMarkdown = prompt + ' *answer with markdown format';
	
	previousRequestMessages.reverse();
	if (model.includes('gpt')) {
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
				// stream: true,
			})

			const data = await completion.json();

			return data.choices[0].text;
		} catch (error: any) {
			console.error(error)
		
			return `ChatPGT was unable to find an answer for that! (Error : ${error.message})`
		  }

		// return res;
	} else {
		// const res = await openai
		// 	.createCompletion({
		// 		model,
		// 		prompt:promptWithMarkdown,
		// 		temperature: 0.9,
		// 		top_p: 1,
		// 		max_tokens: 1000,
		// 		frequency_penalty: 0,
		// 		presence_penalty: 0,
		// 	})
		// 	.then((res) => res.data.choices[0].text)
		// 	.catch(
		// 		(err) =>
		// 			`ChatPGT was unable to find an answer for that! (Error : ${err.message})`
		// 	);

		// return res;
	}
};

export default query;