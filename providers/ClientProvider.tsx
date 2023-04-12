"use client";

import { Toaster } from "react-hot-toast";

type Props = {};

const ClientProvider: React.FC<Props> = () => {
	return (
		<>
			<Toaster position="top-right" />
			{/*  */}
		</>
	);
};

export default ClientProvider;
