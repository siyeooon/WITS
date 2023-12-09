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

export type TQuestionType = "songName" | "artistName";

export type TPlayGameData = {
  gameStatus: EGameStatus.IN_GAME;

  currentRoundInfo: {
    roundNo: number;
    questionType: TQuestionType;
    title: string;
    artist: string;
    albumUrl: string;
    previewUrl: string;
    startAt: number;
    endAt: number;
  };

  maxRound: number;
};

export type TGameState = TSelectThemeRoundData | TPlayGameData;

export type MusicInfo = {
  songs: {
    id: number;
    title: string;
    artist: string;
    previewUrl: string;
    albumUrl: string;
  }
  songs_to_themes: 
  { songId: number;
    themeId: number; 
  }
}