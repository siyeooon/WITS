import express, { Express, Request, Response } from "express";
import http from "http";
import WebSocket from "ws";
import { shuffleArray } from "./utils/shuffleArray";
import { db, schema } from "../database";
import { eq, sql } from "drizzle-orm";

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

async function selectThemeStage() {
  /**
   * 테마 선택
   */
  const MAX_SELECT_THEME = 6;

  const availableThemes = await db
    .select()
    .from(schema.themes)
    .orderBy(sql`RAND()`)
    .limit(MAX_SELECT_THEME);

  // TODO: 랜덤 테마 선택 데이터 전송
  connections.forEach((connection) => {
    connection.send(JSON.stringify({}));
  });

  // 10초간 사용자로부터 테마 수집
  const themeSelectResult = {};

  // TODO: 테마 선택 이벤트 수신 시작

  await new Promise((resolve) => setTimeout(resolve, 10000));

  // TODO: 테마 선택 이벤트 수신 종료

  const themeSelectResultIndex = Math.floor(
    Math.random() * availableThemes.length
  );

  const selectedThemeId = 1;

  return selectedThemeId;
}

async function gameLoop() {
  const selectedThemeId = await selectThemeStage();

  /**
   * 라운드 준비
   */
  const MAX_ROUND = 10;

  // 테마에 맞는 곡 전체 Fetch
  const selectedThemeSongs = await db
    .select()
    .from(schema.songs)
    .leftJoin(
      schema.songsToThemes,
      eq(schema.songs.id, schema.songsToThemes.songId)
    )
    .where(eq(schema.songsToThemes.themeId, selectedThemeId));

  // 랜덤 셔플
  shuffleArray(selectedThemeSongs);

  let roundInfos = selectedThemeSongs.slice(MAX_ROUND).map((_, i) => ({
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
