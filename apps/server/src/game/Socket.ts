import WebSocket from "ws";
import http from "node:http";
import { serverEventEmitter, userEventEmitter } from "./userEventEmitter";
import { TGameStageState } from "@wits/types";

let lastSentState: TGameStageState | undefined = undefined;

export default (
  wss: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>
) => {
  const connections: WebSocket[] = [];

  const onUserConnected = (
    ws: WebSocket,
    req: http.IncomingMessage<unknown>
  ) => {
    req.session = {
      userId: Math.floor(Math.random() * 1000000),
    };

    console.log("request.session: ", req.session);

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
      console.log("exit ", req.session);
      const index = connections.indexOf(ws);
      if (index !== -1) {
        connections.splice(index, 1);
      }
      userEventEmitter.emit("disconnected", userId);
    };

    if (lastSentState !== undefined) {
      ws.send(JSON.stringify({ type: "stateUpdated", state: lastSentState }));
    }
  };

  wss.on("connection", onUserConnected);

  serverEventEmitter.on("stateUpdated", (state) => {
    lastSentState = state;

    for (const ws of connections) {
      ws.send(
        JSON.stringify({
          type: "stateUpdated",
          state,
        })
      );
    }
  });
};
