import { ActionIcon, Textarea } from "@mantine/core";
import { Conversation } from "../core/types/Conversation";
import { Send } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ClassNames } from "../core/functions/ClassNames";
import { useState } from "react";

type Props = {
  conversation: Conversation;
  onSend?: (text: string) => void;
}

export function ConversationPanel({ conversation, onSend }: Props) {
  const [text, setText] = useState<string>("");

  function SendMessage(): void {
    if (text.trim().length <= 0 || !onSend) return;

    onSend(text);
    setText("");
  }

  function OnKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      SendMessage();
    }
  }

  return (
    <section className="h-full flex flex-col">
      <div className="flex flex-col grow overflow-y-auto p-4 gap-4">
        {
          conversation.messages.map(message => (
            <MessageBubble
              key={ message.id }
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
        <Textarea
          className="w-full"
          placeholder="Your message"
          value={ text }
          onChange={ e => setText(e.currentTarget.value) }
          onKeyDown={ OnKeyDown }
        />
        <ActionIcon
          radius="9999px"
          size="lg"
          disabled={ text.trim().length <= 0 }
          onClick={ SendMessage }
        >
          <Send size={ 16 }/>
        </ActionIcon>
      </div>
    </section>
  );
};
