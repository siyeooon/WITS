import { TypedEmitter } from "tiny-typed-emitter";

interface UserEmitEvents {
  connected: (userId: number) => void;
  disconnected: (userId: number) => void;

  voteTheme: (userId: number, selectedThemeIndex: number) => void;
  selectAnswer: (userId: number, selectedAnswerIndex: number) => void;
}

export const userEventEmitter = new TypedEmitter<UserEmitEvents>();

interface ServerEmitEvents {
  userConnected: (userId: number) => void;
  userDisconnected: (userId: number) => void;

  voteThemeStarted: (
    themeInfos: {
      id: number;
      name: string;
      themeImageUrl: string;
    }[]
  ) => void;

  userThemeVoted: (themeId: number) => void;
  voteThemeEnded: (themeId: number) => void;

  answerSelected: (userId: number, answerId: number) => void;
  answer: (answerId: number) => void;
}

export const serverEventEmitter = new TypedEmitter<ServerEmitEvents>();
