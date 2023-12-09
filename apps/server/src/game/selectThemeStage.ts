import { db, schema } from "../../database";
import { sql } from "drizzle-orm";
import { serverEventEmitter, userEventEmitter } from "./userEventEmitter";
import { TVoteThemeStageState } from "@wits/types";

/**
 * 테마 선택 스테이지
 */
export async function selectThemeStage() {
  // 테마 목록 추출
  const MAX_SELECT_THEME = 4;

  const availableThemeRows = await db
    .select()
    .from(schema.themes)
    .orderBy(sql`RAND()`)
    .limit(MAX_SELECT_THEME);

  const availableThemesData = availableThemeRows.map((themeInfo, i) => ({
    name: themeInfo.name,
    imageUrl: "",
  }));
  const availableThemeCounts = availableThemeRows.length;

  const gameInfo: TVoteThemeStageState = {
    stage: "voteTheme",
    data: {
      themeList: availableThemesData,
    },
  };
  serverEventEmitter.emit("stateUpdated", gameInfo);

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

  gameInfo.data.selectedThemeIndex = selectedThemeIndex;

  serverEventEmitter.emit("stateUpdated", gameInfo);

  const selectedTheme = availableThemeRows[selectedThemeIndex];

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return selectedTheme;
}
