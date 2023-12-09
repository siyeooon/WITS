import { selectThemeStage } from "./selectThemeStage";
import { playStage } from "./playStage";

export async function gameLoop() {
  console.log("game start");

  console.log("--selectThemeStage start");
  const selectedThemeInfo = await selectThemeStage();
  console.log("============ selected theme ============");
  console.log(selectedThemeInfo);
  console.log("--selectThemeStage end");

  console.log("--playStage start");
  const gameResult = await playStage(selectedThemeInfo);
  console.log("--playStage end");

  console.log("game end");
  setTimeout(gameLoop, 1000);
}
