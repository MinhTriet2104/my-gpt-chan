import { markdownToHtml } from "./ShowdownWrapper";
import { LegacyRef } from "react";

type Props = {
  message: String;
  hidden: Boolean;
  ref: LegacyRef<HTMLTextAreaElement>
};

function MessageBot(
  { message, hidden, ref }: Props
) {
  const isChatGPT = true;
  // const messageText = message.text.replace(/\n/g, "<br>");
  const messageText = markdownToHtml("" + message);

  return (
    <div
      className={`${hidden ? "hidden" : "block"} py-5 text-white ${
        isChatGPT && "bg-[#343541]"
      }`}
    >
      <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
        <img
          src="https://i.pinimg.com/1200x/06/19/c7/0619c75193b55bec40a1b6161ed1672b.jpg"
          alt=""
          className="h-9 w-9 rounded-full"
        />
        {/* <article className="prose lg:prose-md prose-slate dark:prose-invert" dangerouslySetInnerHTML={{ __html: messageText }} /> */}
        <article
          ref={ref}
          className={ref && !hidden ? `prose lg:prose-md prose-invert` : ""}
          dangerouslySetInnerHTML={{ __html: messageText }}
        />
      </div>
    </div>
  );
}

export default MessageBot;
