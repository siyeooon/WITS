import { shuffleArray } from "../utils/shuffleArray";
import { db, schema } from "../../database";
import { eq } from "drizzle-orm";
import { serverEventEmitter, userEventEmitter } from "./userEventEmitter";
import { TPlayStageState } from "@wits/types";

/**
 * 플레이 스테이지
 */
export async function playStage(selectedThemeInfo: {
  id: number;
  name: string;
}) {
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
    .from(schema.songsToThemes)
    .innerJoin(schema.songs, eq(schema.songs.id, schema.songsToThemes.songId))
    .where(eq(schema.songsToThemes.themeId, selectedThemeInfo.id));

  console.log("============ selectedThemeSongs ============");
  console.log(selectedThemeSongs);
  console.log("==========================================");

  const roundCounts = Math.min(MAX_ROUND, selectedThemeSongs.length);

  /**
   * 라운드 진행
   */
  const playerScore = new Map<number, number>();

  for (let i = 0; i < roundCounts; i++) {
    const currentRoundSongInfo = selectedThemeSongs[i];

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

    // 노래 및 앨범커버를 이 시간 (5초) 동안 prefetch 진행
    // 5초 이후 클라이언트에서 게임 진행
    const roundStartAt = Date.now() + ROUND_PREPARE_TIME;
    const roundEndAt = roundStartAt + ROUND_DURATION;

    const gameInfo: TPlayStageState = {
      stage: "playQuiz",
      data: {
        currentRound: {
          albumUrl: correctAnswer.songs.albumUrl,
          previewUrl: correctAnswer.songs.previewUrl,
          roundNo: i + 1,
          answerList: answerList.map((answer) => answer.songs.title),
          roundStartAt: roundStartAt,
          roundEndAt: roundEndAt,
        },
        maxRound: roundCounts,
        theme: selectedThemeInfo.name,
      },
    };

    serverEventEmitter.emit("stateUpdated", gameInfo);

    const onReceiveAnswer = (userId: number, answerIndex: number) => {
      const receivedAt = Date.now();

      // 게임 시작 내 응답이 아니라면 무시
      if (receivedAt < roundStartAt || receivedAt > roundEndAt) {
        return;
      }

      // 이미 응답 했을 경우 무시
      if (userResponseMap.has(userId)) {
        return;
      }

      const diff = receivedAt - roundStartAt;

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

    userEventEmitter.off("selectAnswer", onReceiveAnswer);

    gameInfo.data.currentRound.answerIndex = correctAnswerIndex;
    serverEventEmitter.emit("stateUpdated", gameInfo);

    await new Promise((resolve) => setTimeout(resolve, 1000));

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

    gameInfo.data.currentRound.gameResult = [
      {
        username: "test",
        responseTime: 1000,
      },
    ];
    serverEventEmitter.emit("stateUpdated", gameInfo);

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
