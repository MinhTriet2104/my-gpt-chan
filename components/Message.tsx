import { DocumentData } from "firebase/firestore";
import { markdownToHtml } from "./ShowdownWrapper";
import Image from "next/image";
import GptChanAvatar from "../images/gpt-chan-avatar.png";

type Props = {
  message: DocumentData;
};

function Message({ message }: Props) {
  const isChatGPT =
    message.user.name === "GPT-chan" || message.user.name === "ChatGPT";
  // const messageText = message.text.replace(/\n/g, "<br>");
  const messageText = markdownToHtml(message.text);

  return (
    <div className={`py-5 text-white ${isChatGPT && "bg-[#343541]"}`}>
      <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
        {isChatGPT ? (
          <Image className="h-9 w-9 rounded-full" src={GptChanAvatar} alt="GPT-chan" />
        ) : (
          <img
            className="h-9 w-9 rounded-full"
            src={message.user.avatar}
            alt={message.user.name}
          />
        )}
        {/* <article className="prose lg:prose-md prose-slate dark:prose-invert" dangerouslySetInnerHTML={{ __html: messageText }} /> */}
        <article
          className="prose lg:prose-md prose-invert"
          dangerouslySetInnerHTML={{ __html: messageText }}
        />
      </div>
    </div>
  );
}

export default Message;
