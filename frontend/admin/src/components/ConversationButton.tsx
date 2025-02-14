import { UnstyledButton } from "@mantine/core";
import { Conversation } from "../core/types/Conversation"
import { useContext } from "react";
import { AppContext } from "../App";
import { Message } from "../core/types/Message";

type Props = {
  conversation: Conversation;
  onClick?: () => void;
}

export function ConversationButton({ conversation, onClick }: Props) {
  const { user } = useContext(AppContext);

  function GetLastMessage(): Message {
    return conversation.messages[conversation.messages.length - 1];
  }

  function GetMessageSender(): string {
    const message = GetLastMessage();

    if (message.operator) {
      return user!.id === message.operator.id ? "You" : "Operator";
    }

    return "Visitor";
  }

  return (
    <div className="h-18 flex">
      <UnstyledButton onClick={ onClick } className="h-full flex">
        <div className="flex flex-col items-start p-2">
          <p className="line-clamp-1 font-medium">{`Conversation #${conversation.id}`}</p>
          <p className="line-clamp-2 text-xs text-gray-400"><span className="font-medium">{ GetMessageSender() }</span>: { GetLastMessage().text }</p>
        </div>
      </UnstyledButton>
    </div>
  );
};