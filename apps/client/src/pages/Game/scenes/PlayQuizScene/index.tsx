import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useAnimate, useMotionValue } from "framer-motion";
import { LuVolume2 } from "react-icons/lu";
import { LuVolumeX } from "react-icons/lu";
import { TPlayStageState } from "@wits/types";
import { useUserInteract } from "../../../../UserInteractContextProvider";
import InRanking from "../../../../components/scenes/InRanking";
import { AnswerButtonContainer } from "./components/AnswerButtonContainer";
import { PrepareRound } from "./PrepareRound";
import styles from './styles.module.scss'
export const AnswerCard: React.FC<{
  albumUrl: string;
  showAnswer: boolean;
}> = ({ showAnswer, albumUrl }) => {
  return (
    <>
      {showAnswer === false ? (
        <div className="flex-1 w-full animate-pulse flex flex-row items-center justify-center gap-2 p-2">
          <div className="text-xl font-bold h-36 w-36 rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none flex items-center justify-center">
            ?
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-row items-center justify-center gap-2 p-2">
          <img
            className="h-36 w-36 rounded-2xl bg-slate-500 drop-shadow-md pointer-events-none"
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
  const [volumeValue, setVolumeValue] = useState(0.3);

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

  useEffect(()=>{
    audioRef.current.volume =volumeValue/100;
  },[volumeValue])

  const fixedMaxValue = 100;
  const rangeToPercent = useMemo(() => ((fixedMaxValue-volumeValue)), [volumeValue, fixedMaxValue]);
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

    const waitRoundResultTimeout = setTimeout(() => {
      setRoundState(ERoundState.RESULT);
    }, state.data.currentRound.roundEndAt + 3000);

    return () => {
      clearTimeout(waitRoundStartTimeout);
      clearTimeout(waitRoundFinishTimeout);
      clearTimeout(waitRoundResultTimeout);
    };
  }, [state.data.currentRound.roundNo]);

  if (roundState === ERoundState.PREPARING) {
    return (
      <PrepareRound
        roundNo={state.data.currentRound.roundNo}
        baseScore={300}
        speedScore={300}
      />
    );
  }
  return (
    <>
      {isUserInteracted === false && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-black"
            style={{ padding: "5px 10px", borderRadius: 5 }}
          >
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
        className="h-full w-full flex flex-col p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="overflow-x-auto ">
          <div className="flex flex-row gap-2 w-fit">
            <div className="relative h-14 w-20 rounded shadow-md bg-slate-500 border-b-4 border-slate-700">
              <div className="absolute left-1 top-1 text-sm font-bold text-white">
                #1
              </div>
              <div className="absolute inset-x-0 bottom-0 text-sm text-center font-bold text-white">
                1,234
              </div>
            </div>
            <div className="relative h-14 w-20 rounded shadow-md bg-slate-500 border-b-4 border-slate-700">
              <div className="absolute left-1 top-1 text-sm font-bold text-white">
                #2
              </div>
              <div className="absolute inset-x-0 bottom-0 text-sm text-center font-bold text-white">
                1,234
              </div>
            </div>
            <div className="relative h-14 w-20 rounded shadow-md bg-slate-500 border-b-4 border-slate-700">
              <div className="absolute left-1 top-1 text-sm font-bold text-white">
                #3
              </div>
              <div className="absolute inset-x-0 bottom-0 text-sm text-center font-bold text-white">
                1,234
              </div>
            </div>
            <div className="relative h-14 w-20 rounded shadow-md bg-slate-500 border-b-4 border-slate-700">
              <div className="absolute left-1 top-1 text-sm font-bold text-white">
                #4
              </div>
              <div className="absolute inset-x-0 bottom-0 text-sm text-center font-bold text-white">
                1,234
              </div>
            </div>
            <div className="relative h-14 w-20 rounded shadow-md bg-slate-500 border-b-4 border-slate-700">
              <div className="absolute left-1 top-1 text-sm font-bold text-white">
                #5
              </div>
              <div className="absolute inset-x-0 bottom-0 text-sm text-center font-bold text-white">
                1,234
              </div>
            </div>
            <div className="relative h-14 w-20 rounded shadow-md bg-slate-500 border-b-4 border-slate-700">
              <div className="absolute left-1 top-1 text-sm font-bold text-white">
                #6
              </div>
              <div className="absolute inset-x-0 bottom-0 text-sm text-center font-bold text-white">
                1,234
              </div>
            </div>
          </div>
        </div>
        {/* 퀴즈 영역 */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-2">
          <div className="absolute right-2 top-2 rounded-full bg-blue-300 px-4 text-sm font-bold">
            {state.data.theme}
          </div>

          <div className="font-bold text-xl text-center">
            {state.data.currentRound.roundNo} / {state.data.maxRound} 라운드
          </div>

          <div className="flex-1 items-center justify-center flex flex-col">
            <div className="font-bold mb-4" style={{ fontSize: 20 }}>
              다음 노래의 제목은 무엇일까요?
            </div>
          </div>
        </div>

        {/* 컨트롤 영역 */}
        <div style={{display:'flex'}}>
          <button onClick={toggleMute}>
            {isMuted ? (
              <LuVolumeX style={{ width: 30, height: 30 }} />
            ) : (
              <LuVolume2 style={{ width: 30, height: 30 }} />
            )}
          </button>
          {!isMuted ? ( 
          <div className={styles.volumeSlide}>
              <div 
                  className={styles.volumeSlideInner}
                  style={{left: 0, right: `${rangeToPercent}%`}}
                >
              </div>
              <div className={styles.volumeRangeWrap}>
                <input 
                    className={styles.volumeRangeActive} 
                    type="range"
                    min={0}
                    max={fixedMaxValue}
                    step="1"
                    value={volumeValue}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                      setVolumeValue(Number(e.target.value))
                    }}
    
                />
              </div>
        </div>):null}
        </div>

        <div
          className="bg-slate-300 rounded-full overflow-hidden my-2"
          style={{ height: "10px" }}
        >
          <motion.div
            ref={scope}
            className="origin-left h-full w-full bg-[#6804FD]"
            initial="idle"
            animate={"animate"}
            variants={{
              idle: {
                scaleX: 1,
                transition: { duration: 0 },
              },
              animate: {
                scaleX: 0,
                transition: { duration: 15, ease: "linear" },
              },
            }}
          />
        </div>
        {/* 답변 영역 */}
        <AnswerButtonContainer
          answerList={state.data.currentRound.answerList}
          answerIndex={state.data.currentRound.answerIndex}
        />
      </motion.div>
      {roundState === ERoundState.RESULT && (
        <InRanking quickAnsweredPlayers={["1", "2", "3"]} />
      )}
      {/* <RoundRanking modalIsOpen={roundState === ERoundState.FINISHED} /> */}
    </>
  );
};
