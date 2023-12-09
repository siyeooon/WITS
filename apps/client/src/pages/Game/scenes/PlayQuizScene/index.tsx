import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimate, useMotionValue } from "framer-motion";
import { RoundRanking } from "../../../../components/currentRanking";
import { LuVolume2 } from "react-icons/lu";
import { LuVolumeX } from "react-icons/lu";
import { TPlayStageState } from "@wits/types";
import { useUserInteract } from "../../../../UserInteractContextProvider";
import InRanking from "../../../../components/scenes/InRanking";
import { AnswerButtonContainer } from "./components/AnswerButtonContainer";
import { PrepareRound } from "./PrepareRound";

export const AnswerCard: React.FC<{
  albumUrl: string;
  showAnswer: boolean;
}> = ({ showAnswer, albumUrl }) => {
  return (
    <>
      <div className="font-bold mb-8" style={{ fontSize: 20 }}>
        다음 노래의 제목은 무엇일까요?
      </div>

      {showAnswer === false ? (
        <div className="flex-1 w-full animate-pulse flex flex-row items-center justify-center gap-2 p-2">
          <div className="text-xl font-bold h-48 w-48 rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none flex items-center justify-center">
            ?
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-row items-center justify-center gap-2 p-2">
          <img
            className="h-48 w-48 rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none"
            src={albumUrl}
          />
        </div>
      )}
    </>
  );
};

const enum ERoundState {
  PREPARING,
  PLAYING,
  FINISHED,
  RESULT,
}

export const PlayQuizScene: React.FC<{ state: TPlayStageState }> = ({
  state,
}) => {
  const isUserInteracted = useUserInteract();

  const [scope, animate] = useAnimate();

  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [roundState, setRoundState] = useState<ERoundState>();

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  useEffect(() => {
    return () => {
      audioRef.current.src = "";
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : 1;
  }, [isMuted]);

  useEffect(() => {
    // 미리 prefetch
    audioRef.current.src = state.data.currentRound.previewUrl;
    audioRef.current.load();

    setRoundState(ERoundState.PREPARING);

    // 라운드 시작에 맞춰서 재생 및 결과 오픈
    const waitRoundStartTimeout = setTimeout(async () => {
      setRoundState(ERoundState.PLAYING);
      audioRef.current.play();
    }, state.data.currentRound.roundStartAt - Date.now());

    const waitRoundFinishTimeout = setTimeout(() => {
      setRoundState(ERoundState.FINISHED);
      audioRef.current.pause();
    }, state.data.currentRound.roundEndAt - Date.now());

    return () => {
      clearTimeout(waitRoundStartTimeout);
      clearTimeout(waitRoundFinishTimeout);
    };
  }, [state.data.currentRound.roundNo]);

  if (roundState === ERoundState.PREPARING) {
    return <PrepareRound />;
  }

  return (
    <>
      {isUserInteracted === false && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black">
            <div className="font-bold text-white">
              사운드 재생을 위해서 사용자 입력이 필요합니다
            </div>
            <div className="font-bold text-white">
              정상적인 게임 진행을 위해 화면을 터치 해 주세요!
            </div>
          </div>
        </div>
      )}

      <motion.div
        className="h-full w-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="font-bold text-xl text-center">
          {state.data.currentRound.roundNo} / {state.data.maxRound} 라운드
        </div>
        <div className="flex-1 items-center justify-center flex flex-col">
          <AnswerCard
            showAnswer={roundState === ERoundState.FINISHED}
            albumUrl={state.data.currentRound.albumUrl}
          />
        </div>
        <div>
          {isMuted ? (
            <LuVolumeX
              style={{ width: 30, height: 30, margin: 20, cursor: "pointer" }}
              onClick={toggleMute}
            />
          ) : (
            <LuVolume2
              style={{ width: 30, height: 30, margin: 20, cursor: "pointer" }}
              onClick={toggleMute}
            />
          )}
          <div className="bg-slate-300 rounded-full" style={{ height: "10px" }}>
            <motion.div
              ref={scope}
              className="origin-left h-full w-full bg-[#6804FD]"
              animate={"idle"}
              variants={{
                idle: {
                  scaleX: 1,
                  transition: { duration: 0 },
                },
                animate: {
                  scaleX: 0,
                  transition: { duration: 10, ease: "linear" },
                },
              }}
            />
          </div>
        </div>
        <AnswerButtonContainer
          answerList={state.data.currentRound.answerList}
          answerIndex={state.data.currentRound.answerIndex}
        />
      </motion.div>
      {roundState === ERoundState.FINISHED && (
        <InRanking quickAnsweredPlayers={["1", "2", "3"]} />
      )}
      {/* <RoundRanking modalIsOpen={roundState === ERoundState.FINISHED} /> */}
    </>
  );
};
