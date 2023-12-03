import WebSocket from "ws";
import { shuffleArray } from "../utils/shuffleArray";
import { db, schema } from "../../database";
import { eq, sql } from "drizzle-orm";
import { serverEventEmitter, userEventEmitter } from "./userEventEmitter";

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

let gameStatus = EGameStatus.SELECT_THEME;
const connections: WebSocket[] = [];

type TSelectThemeRoundData = {
  gameStatus: EGameStatus.SELECT_THEME;
  availableThemses: {
    id: number;
    name: string;
    themeImageUrl: string;
  }[];
  selectedThemeIndex: number | undefined;
};

type TPlayGameData = {
  gameStatus: EGameStatus.IN_GAME;
  currentRound: number;
  maxRound: number;
};

let gameInfo: TSelectThemeRoundData | TPlayGameData;

/**
 * 테마 선택 스테이지
 */
async function selectThemeStage() {
  gameStatus = EGameStatus.SELECT_THEME;

  // 테마 목록 추출
  const MAX_SELECT_THEME = 6;

  const availableThemeRows = await db
    .select()
    .from(schema.themes)
    .orderBy(sql`RAND()`)
    .limit(MAX_SELECT_THEME);

  const availableThemesData = availableThemeRows.map((themeInfo) => ({
    id: themeInfo.id,
    name: themeInfo.name,
    themeImageUrl: "",
  }));
  const availableThemeCounts = availableThemeRows.length;

  serverEventEmitter.emit("voteThemeStarted", availableThemesData);
  gameInfo = {
    gameStatus: EGameStatus.SELECT_THEME,
    availableThemses: availableThemesData,
    selectedThemeIndex: undefined,
  };

  /************************************************************
   *  테마 투표 시작
   ************************************************************/
  const themeVoteMap = new Map<number, number>();

  const onUserVoteTheme = (userId: number, selectedThemeIndex: number) => {
    if (selectedThemeIndex < 0 || selectedThemeIndex >= availableThemeCounts) {
      return;
    }

    themeVoteMap.set(userId, selectedThemeIndex);
  };
  userEventEmitter.on("voteTheme", onUserVoteTheme);

  await new Promise((resolve) => setTimeout(resolve, 10000));

  userEventEmitter.off("voteTheme", onUserVoteTheme);

  /************************************************************
   *  테마 투표 종료
   ************************************************************/

  // 테마 결과 산정
  const voteCounts = new Array(availableThemeCounts).fill(0);
  for (const themeIndex of themeVoteMap.values()) {
    voteCounts[themeIndex] += 1;
  }

  const highestVoteCount = Math.max(...voteCounts);

  const heighestVotedThemes = voteCounts.filter(
    (voteCount) => voteCount === highestVoteCount
  );

  const selectedThemeIndex =
    heighestVotedThemes[Math.floor(Math.random() * heighestVotedThemes.length)];

  serverEventEmitter.emit("voteThemeEnded", selectedThemeIndex);
  gameInfo.selectedThemeIndex = selectedThemeIndex;

  const selectedTheme = availableThemeRows[selectedThemeIndex];

  return selectedTheme;
}

/**
 * 플레이 스테이지
 */
async function playStage(selectedThemeInfo: { id: number; name: string }) {
  /**
   * 상수
   */
  const MAX_ROUND = 10;
  const ROUND_PREPARE_TIME = 1000 * 5;
  const ROUND_DURATION = 1000 * 10;

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
    .where(eq(schema.songsToThemes.themeId, selectedThemeInfo.id));

  const roundCounts = Math.min(MAX_ROUND, selectedThemeSongs.length);
  /**
   * 라운드 진행
   */
  const playerScore = new Map<number, number>();

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
      number,
      {
        answerIndex: number;
        responseTime: number;
      }
    >();

    // TODO: 라운드 준비 데이터 전송 (게임 정보 및 시간)
    // 노래 및 앨범커버를 이 시간 (5초) 동안 prefetch 진행
    // 5초 이후 클라이언트에서 게임 진행
    const roundWillStartAt = Date.now() + ROUND_PREPARE_TIME;
    const roundEndAt = roundWillStartAt + ROUND_DURATION;

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

    const onReceiveAnswer = (userId: number, answerIndex: number) => {
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

    userEventEmitter.on("selectAnswer", onReceiveAnswer);

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
  const selectedThemeInfo = await selectThemeStage();
  const gameResult = await playStage(selectedThemeInfo);
}
