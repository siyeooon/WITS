import { TypedEmitter } from "tiny-typed-emitter";

export interface UserEmitEvents {
  connected: (userId: number) => void;
  disconnected: (userId: number) => void;

  voteTheme: (userId: number, selectedThemeIndex: number) => void;
  selectAnswer: (userId: number, selectedAnswerIndex: number) => void;
}

export const userEventEmitter = new TypedEmitter<UserEmitEvents>();

export interface ServerEmitEvents {
  userConnected: (userId: number) => void;
  userDisconnected: (userId: number) => void;

  stateUpdated: (state: any) => void;
}

export const serverEventEmitter = new TypedEmitter<ServerEmitEvents>();
