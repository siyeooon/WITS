import { AnimatePresence } from "framer-motion";
import { SceneController } from "./ingame/page";

export default function Game() {
  return (
    <AnimatePresence>
        <SceneController />
     </AnimatePresence>
  );
}