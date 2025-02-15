import { useEffect, useState } from "react";
import { Conversation } from "../../types/Conversation";
import { Request } from "../Request";
import { notifications } from "@mantine/notifications";
import { Message } from "../../types/Message";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  function fetchData() {
    Request<Conversation[]>("/conversation")
      .then(setConversations)
      .catch(() => {
        notifications.show({
          title: "Error!",
          message: "Failed to fetch conversations. Please contact eKonsilio support.",
          color: "red",
        });
      });
  }

  function pushMessageIntoConversation(message: Message, conversationId: string) {
    setConversations(o => {
      const conv = o.find(i => i.id === conversationId);

      if (!conv) return o;

      conv.messages.push(message);

      return [conv, ...o.filter(i => i.id !== conv.id)];
    })
  }

  useEffect(fetchData, []);

  return { conversations, pushMessageIntoConversation };
}