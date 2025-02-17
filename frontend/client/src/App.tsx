import { createContext, useEffect, useState } from "react";
import { Conversation } from "./core/types/Conversation";
import { ConversationService } from "./core/services/ConversationService";
import { NoConversationPage } from "./pages/NoConversation";
import { MantineProvider } from "@mantine/core";
import { LCSocket } from "./core/Socket";
import { ConversationPanel } from "./pages/ConversationPanel";
import { Message } from "./core/types/Message";

type AppContextType = {
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation) => void;
  pushMessage: (message: Message) => void;
}

export const AppContext = createContext<AppContextType>({ currentConversation: null, setCurrentConversation: () => { }, pushMessage: () => { } });

function App() {
  const [currentConversation, setCurrentConversation] = useState<Conversation>();
  const [socketConnected, setSocketConnected] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);

  async function loadLatestConversation() {
    const lastConversation = localStorage.getItem("last-conversation");

    if (lastConversation) {
      const conv = await ConversationService.GetConversation(lastConversation);
      setCurrentConversation(conv);
      return conv;
    }
  }

  function pushMessage(message: Message) {
    if (!currentConversation) return;

    setCurrentConversation(o => {
      if (!o) return o;

      const conv = structuredClone(o);

      conv.messages.push(message);

      return conv;
    })
  }

  function OnSocketConnected() {
    setSocketConnected(true);
  }

  useEffect(() => {
    LCSocket.Initialize();
    LCSocket.GetInstance().connect();
    LCSocket.GetInstance().on("connect", OnSocketConnected);

    return () => {
      LCSocket.GetInstance().off("connect", OnSocketConnected);
    }
  }, []);

  useEffect(() => {
    loadLatestConversation()
      .then((conv) => {
        if (conv) {
          LCSocket.GetInstance().emit("open-conversation", {
            conversation: conv.id
          });

          console.log("Open conv")
        }
      })
      .finally(() => setAppLoaded(true))
  }, [socketConnected])

  if (!socketConnected) return null;
  if (!appLoaded) return null;

  return (
    <MantineProvider>
      <AppContext.Provider value={{ currentConversation: currentConversation ?? null, setCurrentConversation, pushMessage }}>
        <main className="w-screen h-screen bg-gray-100 p-2">
          <section className="rounded-lg bg-white shadow h-full flex justify-center items-center overflow-hidden">
            {
              !currentConversation ?
              <NoConversationPage /> :
              <ConversationPanel />
            }
          </section>
        </main>
      </AppContext.Provider>
    </MantineProvider>
  )
}

export default App
