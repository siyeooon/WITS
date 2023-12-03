import WebSocket from "ws";
import http from "http";
import events from "events";

interface UserEmitEvents {
  connection: (userId: string) => void;
  selectTheme: (userId: string, selectedThemeIndex: number) => void;
  selectAnswer: (userId: string, selectedAnswerIndex: number) => void;
}

declare interface UserEventEmitter {
  on<U extends keyof UserEmitEvents>(
    event: U,
    listener: UserEmitEvents[U]
  ): this;

  emit<U extends keyof UserEmitEvents>(
    event: U,
    ...args: Parameters<UserEmitEvents[U]>
  ): boolean;
}

class UserEventEmitter extends events.EventEmitter {
  constructor() {
    super();
  }
}

const userEventEmitter = new UserEventEmitter();

export default (
  wss: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>
) => {
  const connections: WebSocket[] = [];

  const onUserConnected = (ws: WebSocket) => {
    connections.push(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data.toString());

      switch (data.type) {
        case "connection":
          userEventEmitter.emit("connection", data.userId);
          break;

        case "selectTheme":
          userEventEmitter.emit(
            "selectTheme",
            data.userId,
            data.selectedThemeIndex
          );
          break;

        case "selectAnswer":
          userEventEmitter.emit(
            "selectAnswer",
            data.userId,
            data.selectedAnswerIndex
          );
          break;
      }
    };
  };

  wss.on("connection", onUserConnected);
};
