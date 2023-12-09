import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import albumFiesta from "/Fiesta.jpg";
import styles from "./styles.module.scss";
import { CurrentRanking } from "../currentRanking";
import { Header } from "../header";
import { LuVolume2 } from "react-icons/lu";
import { LuVolumeX } from "react-icons/lu";
import { MusicInfo } from "@wits/types";

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

export const AnswerContainer: React.FC = () => {
  const [answerList, setAnswerList] = useState([
    "FIESTA",
    "Next Level",
    "Dun Dun Dance",
    "Gee",
  ]);
  const [isAnswerable, setIsAnswerable] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [answerIndex, setAnswerIndex] = useState<number>();

  useEffect(() => {
    const tempAnswerTimeout = setTimeout(() => {
      setAnswerIndex(Math.floor(Math.random() * 4));
    }, 1000);

    return () => {
      clearTimeout(tempAnswerTimeout);
    };
  }, []);

  return (
    <div className={styles.buttonContainer}>
      {answerList.map((answer, index) => (
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

export const AnswerCard: React.FC = () => {
  return (
    <div className="flex flex-row gap-2">
      <img
        src={albumFiesta}
        className="w-1/2 aspect-square rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none"
      />
      <div className="flex flex-col justify-center">
        <div className="text-3xl font-bold">FIESTA</div>
        <div className="text-xl font-bold">IZ*ONE</div>
      </div>
    </div>
  );
};


export const InRoundScene: React.FC<{ gameData:MusicInfo }>= ({gameData}) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  return (
    <>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        exit={{ opacity: 0 }}
      >
        <Header />
        <div className={styles.questionContainer}>
          <div className="font-bold" style={{ fontSize: 20 }}>
            다음 노래의 제목은 무엇일까요?
          </div>
          {showAnswer ? (
            <AnswerCard />
          ) : (
            <div className={styles.questionBox}>?</div>
          )}
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
          <motion.div
            className="origin-left"
            style={{
              backgroundColor: "#6804FD",
              height: 10,
              width: "100%",
              margin: "20px 0",
              borderRadius: 50,
            }}
            initial={{
              scaleX: 1,
            }}
            animate={{
              scaleX: 0,
            }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </div>
        <AnswerContainer />
      </motion.div>
      <CurrentRanking
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      <div style={{width: 0, height: 0, backgroundColor:'transparent', zIndex: 0}}>
        <audio 
          controls
          autoPlay
          muted={isMuted}
        >
          <source 
            src={gameData.songs.previewUrl}
            type="audio/mpeg"
          />
      </audio>
      </div>
    </>
  );
};
