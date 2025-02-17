import { Loader, MantineProvider } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { useState } from "react";

type Props = {
  socket: boolean;
}

export function LoadingScreen(props: Props) {
  const [showText, setShowTewt] = useState(false);

  useTimeout(() => {
    if (!props.socket) {
      setShowTewt(true);
    }
  }, 5000, { autoInvoke: true });

  return (
    <MantineProvider>
      <main className="w-screen h-screen bg-white flex flex-col justify-center items-center gap-3">
        <Loader />
        {
          showText &&
          <>
            <span className="block text-center text-sm">Il semblerait que nous rencontrions actuellement des difficultés pour vous connecter à nos serveurs.</span>
            <span className="block text-center text-sm">Nous mettons tout en oeuvre pour corriger cela, réessayez dans quelques minutes.</span>
          </>
        }
      </main>
    </MantineProvider>
  )
}