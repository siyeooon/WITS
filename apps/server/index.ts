import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import WebSocket from "ws";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Index");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
