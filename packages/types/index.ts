export type TVoteThemeStageState = {
  stage: "voteTheme";
  data: {
    themeList: {
      name: string;
      imageUrl: string;
    }[];
    selectedThemeIndex?: number;
  };
};

export type TPlayStageState = {
  stage: "playQuiz";
  data: {
    theme: string;
    currentRound: {
      roundNo: number;
      previewUrl: string;
      albumUrl: string;
      roundStartAt: number;
      roundEndAt: number;
      answerList?: string[];
      answerIndex?: number;
      gameResult?: {
        username: string;
        responseTime: number;
      }[];
    };
    maxRound: number;
  };
};

export type TGameStageState = TVoteThemeStageState | TPlayStageState;
