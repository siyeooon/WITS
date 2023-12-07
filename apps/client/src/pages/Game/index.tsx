import { SceneController } from "./ingame/page";
import { GameStateContextProvider } from "./GameStateContextProvider";

export default function Game() {
  return (
    <GameStateContextProvider>
      <SceneController />
    </GameStateContextProvider>
  );
}
