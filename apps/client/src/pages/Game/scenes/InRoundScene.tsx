import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import albumFiesta from "/Fiesta.jpg";
import styles from "./styles.module.scss";
import { RoundRanking } from "../../../components/currentRanking";
import { LuVolume2 } from "react-icons/lu";
import { LuVolumeX } from "react-icons/lu";
import { TPlayStageState } from "@wits/types";
import { useUserInteract } from "../../../UserInteractContextProvider";
import InRanking from "../../../components/scenes/InRanking";

const AnswerButton: React.FC<{
  isDisabled: boolean;
  isSelected?: boolean;
  isAnswer?: boolean;
  text: string;
  onClick?: () => void;
}> = ({ isSelected, isAnswer, text, onClick }) => {
  return (
    <button
      className={`${styles.button} ${isSelected ? styles.selectedButton : ""} ${
        isAnswer ? styles.answerButton : ""
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export const AnswerContainer: React.FC<{
  answerList?: string[];
  answerIndex?: number;
}> = ({ answerIndex, answerList }) => {
  const [isAnswerable, setIsAnswerable] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  return (
    <div className={styles.buttonContainer}>
      {answerList?.map((answer, index) => (
        <AnswerButton
          text={answer}
          isDisabled={!isAnswerable}
          isSelected={index === selectedIndex}
          isAnswer={index === answerIndex}
          onClick={() => {
            setSelectedIndex(index);
          }}
        />
      ))}
    </div>
  );
};

export const AnswerCard: React.FC<{ showAnswer: boolean }> = ({
  showAnswer,
}) => {
  return (
    <>
      <div className="font-bold mb-8" style={{ fontSize: 20 }}>
        다음 노래의 제목은 무엇일까요?
      </div>

      {showAnswer === false ? (
        <div className="animate-pulse flex flex-row gap-2">
          <div className="w-48 aspect-square rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none" />
          <div className="flex flex-col justify-center gap-4">
            <div className="w-36 h-4 animate-pulse font-bold bg-slate-500 rounded-full" />
            <div className="w-24 h-4 animate-pulse text-xl font-bold bg-slate-500 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <img
            src={albumFiesta}
            className="w-48 aspect-square rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none"
          />
          <div className="flex flex-col justify-center">
            <div className="text-3xl font-bold">FIESTA</div>
            <div className="text-xl font-bold">IZ*ONE</div>
          </div>
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

export const InRoundScene: React.FC<{ state: TPlayStageState }> = ({
  state,
}) => {
  const isUserInteracted = useUserInteract();

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const albumRef = useRef<HTMLImageElement>(new Image());

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
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
    albumRef.current.src = state.data.currentRound.albumUrl;
    audioRef.current.src = state.data.currentRound.previewUrl;
    audioRef.current.load();

    setRoundState(ERoundState.PREPARING);

    // 라운드 시작에 맞춰서 재생 및 결과 오픈
    const waitRoundStartTimeout = setTimeout(() => {
      setRoundState(ERoundState.PLAYING);
      audioRef.current.play();
    }, state.data.currentRound.roundStartAt - Date.now());

    return () => {
      clearTimeout(waitRoundStartTimeout);
    };
  }, [
    state.data.currentRound.albumUrl,
    state.data.currentRound.previewUrl,
    state.data.currentRound.roundStartAt,
  ]);

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
      <InRanking quickAnsweredPlayers={["1", "2", "3"]} />

      <motion.div
        className="h-full w-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={styles.questionContainer}>
          <AnswerCard showAnswer={roundState === ERoundState.FINISHED} />
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
              className="origin-left"
              style={{
                backgroundColor: "#6804FD",
                height: 10,
                width: "100%",
                borderRadius: 50,
              }}
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
        <AnswerContainer
          answerList={state.data.currentRound.answerList}
          answerIndex={state.data.currentRound.answerIndex}
        />
      </motion.div>
      <RoundRanking modalIsOpen={true} />
    </>
  );
};
