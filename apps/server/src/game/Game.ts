import { selectThemeStage } from "./selectThemeStage";
import { playStage } from "./playStage";

export async function gameLoop() {
  const selectedThemeInfo = await selectThemeStage();
  const gameResult = await playStage(selectedThemeInfo);
  setTimeout(gameLoop);
}
