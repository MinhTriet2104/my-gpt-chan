"use client";
import useSWR from "swr";
import Select from "react-select";

const fetchModels = () => fetch(`/api/getEngines`).then((res) => res.json());

function ModelSelection() {
	const { data: models, isLoading } = useSWR("models", fetchModels);
	const { data: model, mutate: setModel } = useSWR("model", {
		fallbackData: "gpt-3.5-turbo",
	});

	return (
		<div className="mt-2">
			<Select
				className="mt-2"
				options={models?.modelOptions}
				defaultValue={{
					value: "gpt-3.5-turbo",
					label: "GPT-chan"
				}}
				placeholder="Please select model here..."
				isSearchable
				isLoading={isLoading}
				menuPosition="fixed"
				classNames={{
					control: (state) => "bg-slate-800  border-[#434654]",
				}}
				onChange={(e) => setModel(e?.value)}
			/>
		</div>
	);
}

export default ModelSelection;
