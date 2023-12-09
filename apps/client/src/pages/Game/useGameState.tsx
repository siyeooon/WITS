import { useContext } from "react";
import { GameDataContext } from "./GameDataContext";

export const useGameState = () => {
  const gameState = useContext(GameDataContext);

  if (gameState === null) {
    throw new Error("Game state is null");
  }

  return gameState;
};
