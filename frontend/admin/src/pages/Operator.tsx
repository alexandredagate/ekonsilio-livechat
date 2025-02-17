import { useEffect, useState } from "react";
import { UserActionMenu } from "../components/UserActionMenu";
import { Conversation } from "../core/types/Conversation";
import { NoActiveConversation } from "../components/NoActiveConversation";
import { useConversations } from "../core/functions/hooks/useConversations";
import { ConversationButton } from "../components/ConversationButton";
import { ConversationPanel } from "../components/ConversationPanel";
import { LCSocket } from "../Socket";
import { Message } from "../core/types/Message";
import { Menu, UnstyledButton } from "@mantine/core";
import { ChevronDown } from "lucide-react";
import { modals } from "@mantine/modals";
import { ConversationService } from "../core/services/ConversationService";

export function OperatorPage() {
  const { conversations, pushConversation, pushMessageIntoConversation, removeConversation } = useConversations();
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

  function CloseConversation(conversation: Conversation) {
    ConversationService
      .CloseConversation(conversation.id)
      .then(conv => {
        removeConversation(conv.id);
        LCSocket.GetInstance().emit("disable-conversation", { conversation: conv.id });

        if (conv.id === activeConversation?.id) setActiveConversation(undefined);
      });
  }

  function onConversationEnded(conversation: string) {
    removeConversation(conversation);
    if (activeConversation?.id === conversation) {
      setActiveConversation(undefined);
    }
  }

  function OnCloseConversation(conversation: Conversation) {
    modals.openConfirmModal({
      title: 'Close conversation',
      children: (
        <span className="text-sm">
          This action cannot be undone. Close a conversation only when this one is done.
          Neither your or the user will be able to send new messages or read old messages.
          Do you really want to close the conversation ?
        </span>
      ),
      confirmProps: { color: 'red' },
      labels: { confirm: 'Close', cancel: 'Cancel' },
      onConfirm: () => CloseConversation(conversation),
    })
  }

  useEffect(() => {
    LCSocket.GetInstance().on("message", onReceiveMessage);
    LCSocket.GetInstance().on("close-conversation", onConversationEnded);
    LCSocket.GetInstance().on("new-conversation", onNewConversationCreated)
    
    return () => {
      LCSocket.GetInstance().off("message", onReceiveMessage);
      LCSocket.GetInstance().off("close-conversation", onConversationEnded);
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
        <nav className="w-full min-h-16 p-2 border-b border-gray-100 flex flex-row items-center gap-4">
          <div className="w-full flex flex-col items-start">
            {
              activeConversation &&
              <Menu position="bottom-end">
                <Menu.Target>
                  <UnstyledButton className="flex flex-row items-center gap-2">
                    <span className="text-sm font-bold">Conversation #{ activeConversation.id }</span>
                    <ChevronDown size={ 11 } />
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item color="red" onClick={ () => OnCloseConversation(activeConversation) }>Close conversation</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            }
          </div>
          <UserActionMenu className="self-end" />
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