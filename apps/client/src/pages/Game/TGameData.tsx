import { createContext } from "react";
import type { TGameState } from "@wits/types";

export const GameStateContext = createContext<TGameState | null>(null);
