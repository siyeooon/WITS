import { GameContextProvider, useGameState } from "./GameStateContextProvider";
import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { InRoundScene } from "./scenes/InRoundScene";
import SelectThemeScene from "./scenes/SelectThemeScene";
import { EGameStatus } from "@wits/types";

export default function Game() {
  return <SceneController />;
}

const SceneController = () => {
  const [isConnected, setIsConnected] = useState(false);

  const [gameStage, setGameStage] = useState<"voteTheme" | "playQuiz">();
  const [selectThemeStageState, setSelectThemeStageState] = useState();
  const [playQuizStageState, setPlayQuizStageState] = useState();

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/");

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onmessage = (event) => {
      console.log(event.data);

      const data = JSON.parse(event.data);

      if (data.type === "stageChanged") {
        setGameStage(data.state);
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const SceneComponent = useMemo(() => {
    if (gameStage === undefined) {
      return null;
    }

    if (gameData.gameStatus ===  EGameStatus.SELECT_THEME) {
      return <SelectThemeScene gameData={gameData} />;
    } else if (gameData.gameStatus ===  EGameStatus.IN_GAME) {
      return <InRoundScene />;
    }
  }, [gameStage]);

  return (
    <div className="w-[100dvw] h-[100dvh] flex flex-col">
      <Header />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <SelectThemeScene />
        </AnimatePresence>
      </div>
    </div>
  );
};
