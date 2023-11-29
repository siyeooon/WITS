import express, { Express, Request, Response } from "express";
import http from "http";
import WebSocket from "ws";
import applySocket from "./game/Socket";

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Index");
});

// TODO: OAuth

app.listen(port, () => {
  console.log(`⚡️[Express]: Server is running at http://localhost:${port}`);
});

const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });

wss.on("listening", () => {
  console.log(`⚡️[Websocket]: Server is running at ws://localhost:${port}`);
});

applySocket(wss);
