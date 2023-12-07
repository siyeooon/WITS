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

  currentRoundInfo: {
    roundNo: number;
    questionType: "songName" | "artistName";
    songName?: string;
    artistName?: string;
    albumImageUrl: string;
    previewMusicUrl: string;
    startAt: number;
    endAt: number;
  };

  maxRound: number;
};

export type TGameState = TSelectThemeRoundData | TPlayGameData;
