import { createContext } from "react";

export const enum EGameStatus {
  SELECT_THEME,
  IN_GAME,
  FINISHED,
}
export type TSelectThemeRoundData = {
  gameStatus: EGameStatus.SELECT_THEME;
  availableThemses: {
    id: number;
    name: string;
    themeImageUrl: string;
  }[];
  selectedThemeIndex: number | undefined;
};
export type TPlayGameData = {
  gameStatus: EGameStatus.IN_GAME;
  currentRound: number;
  maxRound: number;
};
export type TGameData = TSelectThemeRoundData | TPlayGameData;

export const GameStateContext = createContext<TGameData | null>(null);
