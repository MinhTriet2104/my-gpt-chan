"use client";

import { Session } from "next-auth";
import { SessionProvider as Provider } from "next-auth/react";

type Props = {
	children: React.ReactNode;
	session: Session | null;
};
const SessionProvider: React.FC<Props> = ({ children, session }) => {
	return (
		<>
			<Provider session={session}>{children}</Provider>
		</>
	);
};

export default SessionProvider;
