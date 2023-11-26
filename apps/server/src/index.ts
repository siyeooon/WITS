import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import WebSocket from "ws";
import { shuffleArray } from "./utils/shuffleArray";

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

/**
 * 게임 상태를 나타내는 ENUM
 * 해당 값에 따라서 VIEW 렌더링을 다르게 한다.
 *
 * SELECT_THEME: 테마 선택
 * IN_GAME: 게임 진행
 * FINISHED: 게임 결과 표시
 */
const enum EGameStatus {
  SELECT_THEME,
  IN_GAME,
  FINISHED,
}

type ESelectThemeStatus = {
  status: EGameStatus.SELECT_THEME;
  themeList: string[];
  selectedThemeIndex: number | undefined;
};

let gameStatus = EGameStatus.SELECT_THEME;

const connections: WebSocket[] = [];

async function gameLoop() {
  /**
   * 테마 선택
   */
  // TODO: 랜덤 테마 선택
  let availableThemes = ["A", "B", "C", "D", "E", "F"];

  // TODO: 랜덤 테마 선택 데이터 전송
  connections.forEach((connection) => {
    connection.send(JSON.stringify({}));
  });

  // 10초간 사용자로부터 테마 수집
  const themeSelectResult = {};

  // TODO: 테마 선택 이벤트 수신
  await new Promise((resolve) => setTimeout(resolve, 10000));

  const themeSelectResultIndex = Math.floor(
    Math.random() * availableThemes.length
  );

  const MAX_ROUND = 10;

  // TODO: 테마에 맞는 곡 전체 Fetch
  const songList = new Array(1000).fill(0);
  shuffleArray(songList);

  let roundInfos = songList.slice(MAX_ROUND).map((_, i) => ({
    musicName: `SONG_${i + 1}`,
  }));

  /**
   * 라운드 진행
   */
  const playerScore = new Map<string, number>();

  const newUserDuringRound = (ws: WebSocket) => {};
  wss.on("connection", newUserDuringRound);

  for (let i = 0; i < roundInfos.length; i++) {
    // TODO: 라운드 시작 데이터 전송

    const startAt = Date.now();
    // TODO: 라운드 시작 이벤트 수신

    const receivedAt = Date.now();
    const diff = receivedAt - startAt;

    //
  }
  wss.off("connection", newUserDuringRound);
}
