import { SessionProvider } from "../components/SessionProvider";
import SideBar from "../components/SideBar";
import { getServerSession } from "next-auth";
import "../styles/globals.css";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Login from "../components/Login";
import ClientProvider from "../components/ClientProvider";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);

	console.log(session);
	return (
		<html lang="en">
			<head />
			<body>
				<SessionProvider session={session}>
					{!session ? (
						<Login />
					) : (
						<>
							<div className="flex md:flex">
								<div className="bg-slate-800 max-w-xs h-screen md:overflow-y-auto md:min-w-[20rem] lg:max-w-[25rem]">
									<SideBar />
								</div>

								<ClientProvider />
								<div className="bg-slate-700 flex-1">
									{children}
								</div>
							</div>
						</>
					)}
				</SessionProvider>
			</body>
		</html>
	);
}
