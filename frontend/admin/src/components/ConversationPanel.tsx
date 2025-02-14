import { ActionIcon, Textarea } from "@mantine/core";
import { Conversation } from "../core/types/Conversation";
import { Send } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ClassNames } from "../core/functions/ClassNames";

type Props = {
  conversation: Conversation;
}

export function ConversationPanel({ conversation }: Props) {
  return (
    <section className="h-full flex flex-col">
      <div className="flex flex-col grow overflow-y-auto p-4 gap-4">
        {
          conversation.messages.map(message => (
            <MessageBubble
              className={
                ClassNames(
                  message.operator ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"
                )
              }
              message={ message }
            />
          ))
        }
      </div>
      <div className="min-h-16 flex items-end gap-2">
        <Textarea className="w-full" placeholder="Your message"/>
        <ActionIcon radius="9999px" size="lg"><Send size={ 16 }/></ActionIcon>
      </div>
    </section>
  );
};
