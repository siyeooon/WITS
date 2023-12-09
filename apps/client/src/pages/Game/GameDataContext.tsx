import { createContext } from "react";
import { TGameStageState } from "@wits/types";

export const GameDataContext = createContext<TGameStageState | null>(null);
