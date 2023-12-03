import WebSocket from "ws";
import http from "node:http";
import { userEventEmitter } from "./userEventEmitter";

export default (
  wss: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>
) => {
  const connections: WebSocket[] = [];

  const onUserConnected = (
    ws: WebSocket,
    req: http.IncomingMessage<unknown>
  ) => {
    connections.push(ws);

    const reqSession = req.session!;

    console.log(reqSession);

    const userId = reqSession.userId;

    userEventEmitter.emit("connected", userId);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data.toString());

      switch (data.type) {
        case "voteTheme":
          userEventEmitter.emit("voteTheme", userId, data.selectedThemeIndex);
          break;

        case "selectAnswer":
          userEventEmitter.emit(
            "selectAnswer",
            userId,
            data.selectedAnswerIndex
          );
          break;
      }
    };
    ws.onclose = () => {
      const index = connections.indexOf(ws);
      if (index !== -1) {
        connections.splice(index, 1);
      }
      userEventEmitter.emit("disconnected", userId);
    };
  };

  wss.on("connection", onUserConnected);
};
