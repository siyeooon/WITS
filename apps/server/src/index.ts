import express, { Express, Request, Response } from "express";
import http, { createServer } from "http";
import WebSocket from "ws";
import applySocket from "./game/Socket";
import cookie from "cookie";
import { gameLoop } from "./game/Game";

const app: Express = express();
const server = createServer(app);
export const wss = new WebSocket.Server({ server });

const port = 3000;

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
applySocket(wss);
gameLoop();
