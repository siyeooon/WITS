import { AnimatePresence } from "framer-motion";
import { createContext, useEffect, useMemo, useState } from "react";
import SelectThemeScene from "../scenes/SelectThemeScene";
import { InRoundScene } from "../scenes/InRoundScene";
import { EGameStatus } from "@wits/types";
import { useGameState } from "../GameStateContextProvider";
export const SceneController = () => {
  const gameData = useGameState();

  const SceneComponent = useMemo(() => {
    if (!gameData) {
      return null;
    }
    if (gameData.gameStatus === EGameStatus.SELECT_THEME) {
      return <SelectThemeScene gameData={gameData} />;
    } else if (gameData.gameStatus === EGameStatus.IN_GAME) {
      return <InRoundScene />;
    }
  }, [gameData]);

  return <AnimatePresence mode="wait">{SceneComponent}</AnimatePresence>;
};
