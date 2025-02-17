import { createRef, useContext, useEffect, useRef } from "react";
import { AppContext } from "../App";
import { ActionIcon, Textarea } from "@mantine/core";
import { Send } from "lucide-react";
import { MessageBubble } from "../components/MessageBubble";
import { ClassNames } from "../core/functions/ClassNames";
import { LCSocket } from "../core/Socket";
import { Message } from "../core/types/Message";

export function ConversationPanel() {
  const { currentConversation, pushMessage } = useContext(AppContext);
  const form = createRef<HTMLFormElement>();
  const messageContainer = createRef<HTMLDivElement>();

  function OnSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const { message: { value: text } } = event.currentTarget;

    if (text.trim().length <= 0) return;
    
    event.currentTarget.reset();
    
    if (!currentConversation) return;

    LCSocket.GetInstance().emit("message", {
      text,
      conversation: currentConversation.id
    });
  }

  function onReceiveMessage(message: Message) {
    if (currentConversation && message.conversationId === currentConversation.id) {
      pushMessage(message);
    }
  }

  function OnKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.current?.requestSubmit();
    }
  }

  useEffect(() => {
    LCSocket.GetInstance().on("message", onReceiveMessage);

    return () => {
    LCSocket.GetInstance().off("message", onReceiveMessage);
    }
  }, [onReceiveMessage]);

  useEffect(() => {
    messageContainer.current?.scrollTo(0, messageContainer.current.scrollHeight);
  }, [currentConversation?.messages, messageContainer]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col grow overflow-y-auto p-4 gap-4" ref={ messageContainer }>
        {
          currentConversation?.messages.map(message => (
            <MessageBubble
              key={ message.id }
              className={
                ClassNames(
                  !message.operator ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"
                )
              }
              message={ message }
            />
          ))
        }
      </div>
      <div className="p-2">
        <form ref={ form } className="flex flex-row items-end gap-2 h-full" onSubmit={ OnSubmit }>
          <Textarea name="message" className="w-full" placeholder="Votre message" onKeyDown={ OnKeyDown } minLength={ 1 } required />
          <ActionIcon
            radius="9999px"
            size="lg"
            type="submit"
          >
            <Send size={ 16 }/>
          </ActionIcon>
        </form>
      </div>
    </div>
  );
}