import { useEffect, useRef, useState } from "react";
import { TGameData, GameStateContext } from "./TGameData";

export function GameStateContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [gameData, setGameData] = useState<TGameData | null>(null);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/");

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onmessage = (event) => {
      console.log(event.data);
      setGameData(JSON.parse(event.data));
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
