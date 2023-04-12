import type { NextApiRequest, NextApiResponse } from "next";
import { Model } from 'openai';
import openai from "../../lib/chatgpt";
import Option from "react-select/dist/declarations/src/components/Option";

type Option = {
	value: string;
	label: string;
};

type Data = {
	modelOptions: Option[];
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const targetModels = ['text-davinci-003', 'gpt-3.5-turbo'];
	const models = await openai.listModels().then((res) => res.data.data);
	const targetModelInfos = models.filter((model) => targetModels.includes(model.id));
	const modelOptions = targetModelInfos.map(model => ({
		value: model.id,
		label: model.id === 'gpt-3.5-turbo' ? 'GPT-chan' : 'GPT-Fast'
	}));

	res.status(200).json({
		modelOptions,
	});
}
