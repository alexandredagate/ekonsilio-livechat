import { useEffect, useState } from "react";
import { Conversation } from "../../types/Conversation";
import { Request } from "../Request";
import { notifications } from "@mantine/notifications";

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

  useEffect(fetchData, []);

  return { conversations };
}