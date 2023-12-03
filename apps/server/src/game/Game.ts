import WebSocket from "ws";
import { shuffleArray } from "../utils/shuffleArray";
import { db, schema } from "../../database";
import { eq, sql } from "drizzle-orm";
import { wss } from "..";

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
let gameTheme = null;
let currentRound = 0;
let currentRoundInfo = {};
const connections: WebSocket[] = [];
type TGameInfo = {
  gameStatus: EGameStatus;
  playerCount: number;
  gameTheme: null | any;
  prevRound: any[]; // 이전 라운드 기록
  currentRound: any; // 현재 진행 라운드 정보
};
const getGameInfo = (): TGameInfo => {
  const commonGameResponse: TGameInfo = {
    gameStatus: gameStatus,
    playerCount: connections.length,
    gameTheme: {},
    prevRound: [
      {
        roundNo: 1,
        roundInfo: {
          song: {
            albumUrl: "",
            previewUrl: "",
          },
        },
      },
      {
        roundNo: 2,
        roundInfo: {
          song: {
            albumUrl: "",
            previewUrl: "",
          },
        },
      },
    ],
    currentRound: {
      roundNo: 3,
      roundInfo: {
        song: {
          albumUrl: "",
          previewUrl: "",
        },
      },
    },
  };

  return commonGameResponse;
};
const onUserConnected = (ws: WebSocket) => {
  connections.push(ws);
};
wss.on("connection", onUserConnected);
/**
 * 현재 접속한 유저 수 전송
 */
const broadcastUserStatus = () => {
  const totalConnectedUserCount = connections.length;

  connections.forEach((connection) => {
    connection.send(
      JSON.stringify({
        type: "connectedUserCount",
        data: totalConnectedUserCount,
      })
    );
  });

  setTimeout(broadcastUserStatus, 2000);
};
const broadcastTimer = setTimeout(broadcastUserStatus, 5000);
/**
 * 테마 선택 스테이지
 */

async function selectThemeStage() {
  gameStatus = EGameStatus.SELECT_THEME;

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
  const playerScore = new Map<string, number>();

  // TODO: 테마 선택 이벤트 수신 시작
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // TODO: 테마 선택 이벤트 수신 종료
  const themeSelectResultIndex = Math.floor(
    Math.random() * availableThemes.length
  );

  const selectedThemeId = 1;

  return selectedThemeId;
}
/**
 * 플레이 스테이지
 */

async function playStage(selectedThemeId: number) {
  gameStatus = EGameStatus.IN_GAME;

  /**
   * 상수
   */
  const MAX_ROUND = 10;

  const roundPrepareTime = 1000 * 5;
  const roundDuration = 1000 * 10;

  /**
   * 라운드 준비
   */
  const selectedThemeSongs = await db
    .select()
    .from(schema.songs)
    .leftJoin(
      schema.songsToThemes,
      eq(schema.songs.id, schema.songsToThemes.songId)
    )
    .where(eq(schema.songsToThemes.themeId, selectedThemeId));

  const roundCounts = Math.min(MAX_ROUND, selectedThemeSongs.length);
  /**
   * 라운드 진행
   */
  const playerScore = new Map<string, number>();

  for (let i = 0; i < roundCounts; i++) {
    const roundNo = i + 1;

    shuffleArray(selectedThemeSongs);
    // 1. 문제 선정 (제목 or 가수)
    // 2. 답변 목록 선정 (정답 외 3개, 총 4개)
    const correctAnswer = selectedThemeSongs.shift()!;

    const answerList = [correctAnswer, ...selectedThemeSongs.slice(0, 3)];

    shuffleArray(answerList);

    const correctAnswerIndex = answerList.findIndex(
      (answer) => answer === correctAnswer
    );

    const userResponseMap = new Map<
      string,
      {
        answerIndex: number;
        responseTime: number;
      }
    >();

    // TODO: 라운드 준비 데이터 전송 (게임 정보 및 시간)
    // 노래 및 앨범커버를 이 시간 (5초) 동안 prefetch 진행
    // 5초 이후 클라이언트에서 게임 진행
    const roundWillStartAt = Date.now() + roundPrepareTime;
    const roundEndAt = roundWillStartAt + roundDuration;

    const roundInfoData = JSON.stringify({
      type: "roundInfo",
      data: {
        roundNo: roundNo,
        roundInfo: {
          song: {
            albumUrl: correctAnswer.songs.albumUrl,
            previewUrl: correctAnswer.songs.previewUrl,
          },
          answerList: answerList.map((answer) => answer.songs.title),
        },
        startAt: roundWillStartAt,
      },
    });

    connections.forEach((connection) => {
      connection.send(roundInfoData);
    });

    const onReceiveAnswer = (userId: string, answerIndex: number) => {
      const receivedAt = Date.now();

      // 게임 시작 내 응답이 아니라면 무시
      if (receivedAt < roundWillStartAt || receivedAt > roundEndAt) {
        return;
      }

      // 이미 응답 했을 경우 무시
      if (userResponseMap.has(userId)) {
        return;
      }

      const diff = receivedAt - roundWillStartAt;

      userResponseMap.set(userId, {
        answerIndex: answerIndex,
        responseTime: diff,
      });
    };

    // 이벤트 수신 종료 대기
    await new Promise((resolve) =>
      setTimeout(resolve, roundEndAt - Date.now())
    );

    // TODO: 답변 이벤트 수신 종료
    // 답변 취합
    const userResponseArray = Array.from(userResponseMap.entries());

    // 정답자
    const correctUserResponses = userResponseArray
      .filter(
        ([userId, userResponse]) =>
          userResponse.answerIndex === correctAnswerIndex
      )
      .sort(
        ([userAId, userAResponse], [userBId, userBResponse]) =>
          userAResponse.responseTime - userBResponse.responseTime
      );

    // TODO: 응답 시간에 따른 차등 지급
    correctUserResponses.forEach(([userId, userResponse]) => {
      const prevScore = playerScore.get(userId) || 0;
      playerScore.set(userId, prevScore + 1);
    });
  }
}

async function gameLoop() {
  const selectedThemeId = await selectThemeStage();
  const gameResult = await playStage(selectedThemeId);
}
