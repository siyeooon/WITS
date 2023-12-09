import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { TGameState } from "@wits/types";

export const GameStateContext = createContext<TGameState | null>(null);

export function GameContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [gameData, setGameData] = useState<TGameState | null>(null);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/");

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onmessage = (event) => {
      console.log(event.data);

      const data = JSON.parse(event.data);

      if (data.type === "stateUpdated") {
        setGameData(data.state);
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  return (
    <GameStateContext.Provider value={gameData}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const state = useContext(GameStateContext);

  return state;
}
