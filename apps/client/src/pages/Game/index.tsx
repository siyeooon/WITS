import { GameContextProvider, useGameState } from "./GameStateContextProvider";
import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { InRoundScene } from "./scenes/InRoundScene";
import SelectThemeScene from "./scenes/SelectThemeScene";
import { EGameStatus } from "@wits/types";

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

    if (gameData.gameStatus ===  EGameStatus.SELECT_THEME) {
      return <SelectThemeScene gameData={gameData} />;
    } else if (gameData.gameStatus ===  EGameStatus.IN_GAME) {
      return <InRoundScene />;
    }
  }, [gameData]);

  return (
    <AnimatePresence mode="wait">
      <InRoundScene />
    </AnimatePresence>
  );
};
