import { useEffect, useMemo, useRef, useState } from "react";
import { TGameStageState } from "@wits/types";
import { AnimatePresence } from "framer-motion";
import { PlayQuizScene } from "./scenes/PlayQuizScene";
import SelectThemeScene from "./scenes/SelectThemeScene";
import { Header } from "../../components/header";
import { GameDataContext } from "./GameDataContext";

export default function Game() {
  const [isConnected, setIsConnected] = useState(false);

  const [gameState, setGameState] = useState<TGameStageState>();

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const host = window.location.host;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    const socket = new WebSocket(`${protocol}://${host}/api`);

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onmessage = (event) => {
      console.log(event.data);

      const data = JSON.parse(event.data);

      if (data.type === "stateUpdated") {
        setGameState(data.state);
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const SceneComponent = useMemo(() => {
    if (gameState === undefined) {
      return null;
    }

    if (gameState.stage === "voteTheme") {
      return <SelectThemeScene state={gameState} />;
    }

    if (gameState.stage === "playQuiz") {
      return <PlayQuizScene state={gameState} />;
    }
  }, [gameState]);

  if (gameState === undefined) {
    return null;
  }

  return (
    <GameDataContext.Provider value={gameState}>
      <div className="w-[100dvw] h-[100dvh] flex flex-col">
        <Header />
        <div className="flex-1">
          <AnimatePresence mode="wait">{SceneComponent}</AnimatePresence>
        </div>
      </div>
    </GameDataContext.Provider>
  );
}
