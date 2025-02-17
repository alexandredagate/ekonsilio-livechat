import { Button, Textarea } from "@mantine/core";
import { createRef, useContext, useEffect } from "react";
import { AppContext } from "../App";
import { Conversation } from "../core/types/Conversation";
import { LCSocket } from "../core/Socket";

export function NoConversationPage() {
  const formRef = createRef<HTMLFormElement>();
  const { setCurrentConversation } = useContext(AppContext);

  function OnKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function OnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { message: { value: message } } = event.currentTarget;

    if (message.trim().length <= 0) return;

    LCSocket.GetInstance().emit("create-conversation", { message });
  }

  function JoinConversation(conversation: Conversation) {
    setCurrentConversation(conversation);
    localStorage.setItem("last-conversation", conversation.id);
  }

  useEffect(() => {
    LCSocket.GetInstance().on("join", JoinConversation);

    return () => {
      LCSocket.GetInstance().off("join", JoinConversation);
    }
  }, [JoinConversation])
  
  return (
    <div className="w-2xl">
      <span className="block text-center w-full text-2xl font-bold mb-6">En quoi puis-je vous être utile ?</span>
      <form ref={ formRef } className="flex flex-col items-end gap-2" onSubmit={ OnSubmit }>
        <Textarea minLength={ 1 } required className="w-full" name="message" placeholder="Posez votre question à un Genius" onKeyDown={ OnKeyDown } />
        <Button type="submit">Envoyer</Button>
      </form>
    </div>
  )
}