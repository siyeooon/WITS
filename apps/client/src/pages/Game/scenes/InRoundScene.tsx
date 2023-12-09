import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import albumFiesta from "/Fiesta.jpg";
import styles from "./styles.module.scss";
import { CurrentRanking } from "../../../components/currentRanking";
import { LuVolume2 } from "react-icons/lu";
import { LuVolumeX } from "react-icons/lu";

const dummyData = [
  {
    title: "Perfect Night",
    artist: "LE SSERAFIM",
    albumUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e6/df/10/e6df10ec-20e2-4fc8-51a1-cb923ce992c4/196922680779_Cover.jpg/512x512bb.jpg",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/5a/11/a5/5a11a515-ac8a-b435-a4ba-63b10762a5c0/mzaf_8661977555640103244.plus.aac.ep.m4a",
  },
  {
    title: "Drama",
    artist: "aespa",
    albumUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e6/df/10/e6df10ec-20e2-4fc8-51a1-cb923ce992c4/196922680779_Cover.jpg/512x512bb.jpg",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/5a/11/a5/5a11a515-ac8a-b435-a4ba-63b10762a5c0/mzaf_8661977555640103244.plus.aac.ep.m4a",
  },
  {
    title: "To. X",
    artist: "TAEYEON",
    albumUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e6/df/10/e6df10ec-20e2-4fc8-51a1-cb923ce992c4/196922680779_Cover.jpg/512x512bb.jpg",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/81/94/e7/8194e75d-a406-1a51-f5c5-f9d16dc6770a/mzaf_3864734383388967952.plus.aac.ep.m4a",
  },
  {
    title: "Ditto",
    artist: "NewJeans",
    albumUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e6/df/10/e6df10ec-20e2-4fc8-51a1-cb923ce992c4/196922680779_Cover.jpg/512x512bb.jpg",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/97/47/da/9747daf7-ca2d-36ab-9379-6048398be273/mzaf_4598381608965119730.plus.aac.ep.m4a",
  },
  {
    title: "Seven",
    artist: "Jung Kook, Latto",
    albumUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a5/a6/56/a5a6561a-f570-2fb1-5a3a-95b150c18f18/196922550928_Cover.jpg/512x512bb.jpg",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/1a/0f/b3/1a0fb348-50a7-7007-19be-92dd193bf42b/mzaf_6397353486192641133.plus.aac.ep.m4a",
  },
  {
    title: "Talk Saxy",
    artist: "RIIZE",
    albumUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/96/e2/7f/96e27fed-4864-cfb9-65a4-4f91ba9f9a3c/888735945519.jpg/512x512bb.jpg",
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/97/5c/69/975c6961-9c0d-17fd-2f75-b3952380c3d0/mzaf_5072256935994720930.plus.aac.ep.m4a",
  },
];

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

export const AnswerContainer: React.FC<{ answerList: string[] }> = ({
  answerList,
}) => {
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

export const InRoundScene = () => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [answerList, setAnswerList] = useState([
    "FIESTA",
    "Next Level",
    "Dun Dun Dance",
    "Gee",
  ]);

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : 1;
  }, [isMuted]);

  useEffect(() => {
    const selectedMusic =
      dummyData[Math.floor(Math.random() * dummyData.length)];

    audioRef.current.src = selectedMusic.previewUrl;
    audioRef.current.load();
    audioRef.current.play();

    setTimeout(() => {
      setShowAnswer(true);
    }, 3000);
  }, []);

  return (
    <>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute left-0 top-0">
          <button
            className="bg-white"
            onClick={() => {
              const selectedMusic =
                dummyData[Math.floor(Math.random() * dummyData.length)];
              
              audioRef.current.volume= 0.5;
              audioRef.current.src = selectedMusic.previewUrl;
              audioRef.current.load();
              audioRef.current.play();
            }}
          >
            Change Music
          </button>
          <button
            className="bg-white"
            onClick={() => {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }}
          >
            Start From 0
          </button>
        </div>

        <div className={styles.questionContainer}>
          <AnswerCard showAnswer={showAnswer} />
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
        <AnswerContainer answerList={answerList} />
      </motion.div>
      <CurrentRanking
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
    </>
  );
};
