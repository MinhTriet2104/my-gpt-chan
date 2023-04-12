"use client";

import { collection, orderBy, query } from "firebase/firestore";
import { useSession, signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import ChatRow from "./ChatRow";
import ModelSelection from "./ModelSelection";
import NewChat from "./NewChat";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

function SideBar() {
	const { data: session } = useSession();

	const [chats, loading, error] = useCollection(
		session &&
			query(
				collection(db, "users", session.user?.email!, "chats"),
				orderBy("createdAt", "asc")
			)
	);

	return (
		<div className="hidden md:flex flex-col h-screen p-2">
			<div className="flex-1">
				<div>
					<NewChat />

					<div className="hidden sm:inline">
						<ModelSelection />
					</div>

					<div className="flex flex-col space-y-2 my-2">
						{loading && (
							<div className="animate-pulse text-center text-white">
								<p>Loading Chats...</p>
							</div>
						)}

						{/* Map through the ChatRows */}
						{chats?.docs.map((chat) => (
							<ChatRow key={chat.id} id={chat.id} />
						))}
					</div>
				</div>
			</div>

			{session && (
				<div className="flex justify-between items-center cursor-pointer text-gray-300 transition-all duration-200 ease-out rounded-lg px-2">
					<div className="flex items-center space-x-3">
						<img
							onClick={() => signOut()}
							src={session.user?.image!}
							alt="Profile picture"
							className="h-10 2xl:h-12 w-10 2xl:w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50"
						/>
						<p className="truncate">{session.user?.name}</p>
					</div>
					<ArrowLeftOnRectangleIcon className="h-7 w-7" />
				</div>
			)}
		</div>
	);
}

export default SideBar;
