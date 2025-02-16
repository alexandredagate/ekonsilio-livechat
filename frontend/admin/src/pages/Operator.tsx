import { useEffect, useState } from "react";
import { UserActionMenu } from "../components/UserActionMenu";
import { Conversation } from "../core/types/Conversation";
import { NoActiveConversation } from "../components/NoActiveConversation";
import { useConversations } from "../core/functions/hooks/useConversations";
import { ConversationButton } from "../components/ConversationButton";
import { ConversationPanel } from "../components/ConversationPanel";
import { LCSocket } from "../Socket";
import { Message } from "../core/types/Message";

export function OperatorPage() {
  const { conversations, pushConversation, pushMessageIntoConversation } = useConversations();
  const [activeConversation, setActiveConversation] = useState<Conversation>();

  function OnClickConversation(conversation: Conversation) {
    if (activeConversation) { // if user was in a previous conversation then left it first
      LCSocket.GetInstance().emit("close-conversation", { conversation: activeConversation.id });
    }

    LCSocket.GetInstance().emit("open-conversation", { conversation: conversation.id });
    setActiveConversation(conversation);
  }

  function OnSend(text: string): void {
    if (activeConversation) {
      LCSocket.GetInstance().emit("message", {
        text,
        conversation: activeConversation.id
      });
    }
  }

  function onReceiveMessage(message: Message) {
    console.log(message);
    if (activeConversation && message.conversationId === activeConversation.id) {
      setActiveConversation(o => {
        if (!o) return o;

        const temp = structuredClone(o);
        temp.messages.push(message);
        return temp;
      });
    }

    pushMessageIntoConversation(message, message.conversationId);
  }

  function onNewConversationCreated(conversation: Conversation) {
    pushConversation(conversation);
  }

  useEffect(() => {
    LCSocket.GetInstance().on("message", onReceiveMessage);
    LCSocket.GetInstance().on("new-conversation", onNewConversationCreated)

    return () => {
      LCSocket.GetInstance().off("message", onReceiveMessage);
      LCSocket.GetInstance().off("new-conversation", onNewConversationCreated);
    }
  }, [onReceiveMessage, pushConversation]);

  return (
    <section className="w-full h-full flex flex-row items-start">
      <aside className="border-r border-gray-100 w-96 h-full">
        <div className="h-16 p-2 border-b border-gray-100 flex items-center">
          <span className="text-xl font-semibold">Conversations</span>
        </div>
        <div className="divide-y divide-gray-100">
          {
            conversations.map(conversation => (
              <ConversationButton key={ conversation.id } conversation={ conversation } onClick={ () => OnClickConversation(conversation) }/>
            ))
          }
        </div>
      </aside>
      <section className="flex flex-col w-full h-full">
        <nav className="w-full min-h-16 p-2 border-b border-gray-100 flex items-center justify-end">
          <UserActionMenu />
        </nav>
        <div className="h-full w-full overflow-auto p-2">
          {
            !activeConversation ?
            <NoActiveConversation /> :
            <ConversationPanel conversation={ activeConversation } onSend={ OnSend } />
          }
        </div>
      </section>
    </section>
  )
}