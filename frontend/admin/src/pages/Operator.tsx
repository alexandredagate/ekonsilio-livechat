import { useState } from "react";
import { UserActionMenu } from "../components/UserActionMenu";
import { Conversation } from "../core/types/Conversation";
import { NoActiveConversation } from "../components/NoActiveConversation";
import { useConversations } from "../core/functions/hooks/useConversations";
import { ConversationButton } from "../components/ConversationButton";
import { ConversationPanel } from "../components/ConversationPanel";

export function OperatorPage() {
  const { conversations } = useConversations();
  const [activeConversation, setActiveConversation] = useState<Conversation>();

  function OnClickConversation(conversation: Conversation) {
    setActiveConversation(conversation);
  }

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
            <ConversationPanel conversation={ activeConversation } />
          }
        </div>
      </section>
    </section>
  )
}