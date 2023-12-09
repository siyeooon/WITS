import { GameContextProvider, useGameState } from "./GameStateContextProvider";
import { useEffect, useMemo, useRef } from "react";
import { EGameStatus } from "@wits/types";
import { AnimatePresence } from "framer-motion";
import { InRoundScene } from "./scenes/InRoundScene";
import SelectThemeScene from "./scenes/SelectThemeScene";

export default function Game() {
  return (
    <GameContextProvider>
      <SceneController />
    </GameContextProvider>
  );
}

const SceneController = () => {
  const gameData = useGameState();

  const SceneComponent = useMemo(() => {
    if (!gameData) {
      return null;
    }

    if (gameData.stage === "voteTheme") {
      return <SelectThemeScene gameData={gameData} />;
    } else if (gameData.stage === "playQuiz") {
      return <InRoundScene />;
    }
  }, [gameData]);

  return (
    <AnimatePresence mode="wait">
      <InRoundScene />
    </AnimatePresence>
  );
};
