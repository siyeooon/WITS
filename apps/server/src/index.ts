import express, { Express, Request, Response } from "express";
import http, { createServer } from "http";
import WebSocket from "ws";
import applySocket from "./game/Socket";
import cookie from "cookie";

const app: Express = express();
const server = createServer(app);
export const wss = new WebSocket.Server({ server });

const port = process.env.PORT;

app.get("/oauth/google/callback", (req: Request, res: Response) => {
  res.json("/oauth/google");
});

app.get("/oauth/apple/callback", (req: Request, res: Response) => {
  // TODO: Require Apple Developer ID
  res.json("/oauth/apple");
});

server.listen(port, () => {
  console.log(`⚡️Server is running at http://localhost:${port}`);
});

server.on("upgrade", (request, socket, head) => {
  console.log("to do auth ", request, socket, head);

  const cookies = cookie.parse(request.headers.cookie || "");

  const sessionId = cookies["connect.sid"];

  if (!sessionId) {
    socket.destroy();
    return;
  }

  request.session = {
    userId: Math.floor(Math.random() * 1000000),
  };

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

applySocket(wss);
// startGame();
