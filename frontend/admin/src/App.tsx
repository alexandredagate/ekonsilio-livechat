import { LoginPage } from "./pages/Login"
import { createContext, useEffect, useState } from "react"
import { User } from "./core/types/User";
import { OperatorPage } from "./pages/Operator";
import { AuthService } from "./core/services/AuthService";
import { LoadingPage } from "./pages/Loading";
import { notifications } from "@mantine/notifications";
import { LCSocket } from "./Socket";

type AppContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  login: () => { },
  logout: () => { },
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function login(token: string): void {
    localStorage.setItem('token', token);
    AuthService.Me()
      .then((_user) => {
        setUser(_user);
        LCSocket.Initialize();
        notifications.show({
          title: "Welcome back!",
          message: `Hello, ${_user.username}. Enjoy your session 💪`,
          color: "green",
        });
      })
      .catch(() => {
        setUser(null);
        LCSocket.Close();
        localStorage.removeItem('token');
      });
  }

  function logout(): void {
    notifications.show({
      title: "Session ended!",
      message: `Thank you ${user?.username}. See you soon 👋`,
      color: "green",
    });
    LCSocket.Close();
    localStorage.removeItem('token');
    setUser(null);
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      setUser(null);
    } else {
      AuthService.Me()
        .then(user => {
          setUser(user);
          LCSocket.Initialize();
        })
        .catch(() => {
          setUser(null);
          LCSocket.Close();
          notifications.show({
            title: "Session expired!",
            message: "Your session has expired"
          })
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <LoadingPage />; // Loading screen during server is checking for token validity

  return (
    <AppContext.Provider value={{ user, login, logout }}>
      <main className="bg-gray-100 w-screen h-screen p-2 flex flex-col items-stretch">
        <section className="bg-white h-full rounded-xl shadow flex justify-center items-center overflow-hidden">
          {
            !user ?
            <LoginPage /> :
            <OperatorPage />
          }
        </section>
      </main>
    </AppContext.Provider>
  )
}

export default App
