import { useContext } from "react";
import { GameStateContext } from "./TGameData";

export function useGameState() {
  const state = useContext(GameStateContext);

  return state;
}
