import { createRef, useContext, useEffect, useRef } from "react";
import { AppContext } from "../App";
import { ActionIcon, Button, Textarea } from "@mantine/core";
import { Send } from "lucide-react";
import { MessageBubble } from "../components/MessageBubble";
import { ClassNames } from "../core/functions/ClassNames";
import { LCSocket } from "../core/Socket";
import { Message } from "../core/types/Message";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { ConversationService } from "../core/services/ConversationService";

export function ConversationPanel() {
  const { currentConversation, pushMessage, resetCurrentConversation } = useContext(AppContext);
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

  function onConversationEnded(conversation: string) {
    if (conversation === currentConversation?.id) {
      resetCurrentConversation();
      notifications.show({
        title: "Conversation terminée!",
        message: "La conversation a été cloturée",
        color: 'blue'
      })
    }
  }

  function CloseConversation() {
    if (!currentConversation) return;

    ConversationService.CloseConversation(currentConversation.id)
      .then((conv) => {
        LCSocket.GetInstance().emit("disable-conversation", { conversation: conv.id });
      });
  }

  function onClickNewConversation() {
    modals.openConfirmModal({
      title: "Nouvelle conversation",
      children: (
        <span>
          Démarrer une nouvelle conversation mettra fin à celle-ci. Ni vous, ni nos Genius ne pourrez envoyer de nouveaux messages ou consulter l'historique de la conversation.
          Êtes-vous certains de vouloir démarrer une nouvelle conversation ?
        </span>
      ),
      labels: { confirm: "Oui", cancel: "Annuler" },
      onConfirm: CloseConversation
    })
  }

  useEffect(() => {
    LCSocket.GetInstance().on("message", onReceiveMessage);
    LCSocket.GetInstance().on("close-conversation", onConversationEnded);

    return () => {
    LCSocket.GetInstance().off("message", onReceiveMessage);
    LCSocket.GetInstance().off("close-conversation", onConversationEnded);
    }
  }, [onReceiveMessage, onConversationEnded]);

  useEffect(() => {
    messageContainer.current?.scrollTo(0, messageContainer.current.scrollHeight);
  }, [currentConversation?.messages, messageContainer]);

  return (
    <div className="flex flex-col w-full h-full">
      <nav className="p-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-lg font-medium">Conversation</span>
        <Button onClick={ onClickNewConversation }>Nouvelle conversation</Button>
      </nav>
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