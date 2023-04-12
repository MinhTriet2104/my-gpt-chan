import openai from "./chatgpt";
import { ChatCompletionRequestMessage } from "openai"

const query = async (prompt: string, chatId: string, model: string) => {
	const promptWithMarkdown = prompt + ' *answer with markdown format';
	
	if (model.includes('gpt')) {
		const messages: ChatCompletionRequestMessage[] = [
			{"role": "system", "content": "You are an anime waifu name GPT-chan, your father is Nguyễn Minh Triết. You will always answer gently with cute emoji and support users the same way a wife treats her husband"},
			{"role": "user", "content": promptWithMarkdown}
		];
		const res = await openai
		.createChatCompletion({
			model,
			messages,
		})
		.then((res) => res.data.choices[0].message?.content)
		.catch(
			(err) =>
				`ChatPGT was unable to find an answer for that! (Error : ${err.message})`
		);

		return res;
	} else {
		const res = await openai
			.createCompletion({
				model,
				prompt:promptWithMarkdown,
				temperature: 0.9,
				top_p: 1,
				max_tokens: 1000,
				frequency_penalty: 0,
				presence_penalty: 0,
			})
			.then((res) => res.data.choices[0].text)
			.catch(
				(err) =>
					`ChatPGT was unable to find an answer for that! (Error : ${err.message})`
			);

		return res;
	}
};

export default query;