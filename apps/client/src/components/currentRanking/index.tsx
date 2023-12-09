import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

interface CurrentRankingProps {
  modalIsOpen: boolean;
}

/**
 * 모든 라운드 종료 후 랭킹을 보여주는 컴포넌트
 * @param param0
 * @returns
 */
export const RoundRanking = ({ modalIsOpen }: CurrentRankingProps) => {
  return (
    modalIsOpen && (
      <div className={styles.container}>
        <div style={{ fontSize: 30, fontWeight: 700 }}>RANKING</div>

        <div className={styles.currentRankingContainer}>
          <div className={styles.currentRanking}>
            <div>#21</div>
            <img src="/src/assets/ingame/profile.png" />
            <div>박시연</div>
            <div>248점</div>
          </div>
          {new Array(10).fill(0).map((_, index) => (
            <div
              key={index}
              className="flex flex-row justify-between rounded-md bg-slate-800 items-center px-4 py-1"
            >
              <div>#1</div>
              <img src="/src/assets/ingame/profile.png" />
              <div>박시연</div>
              <div>248점</div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
