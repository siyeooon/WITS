import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

const Ranking = () => {
  return (
      <div className={styles.container}>
        <div style={{ fontSize: 30, fontWeight: 700 }}>RANKING</div>
        <div className={styles.currentRankingContainer}>
          <div className={styles.currentRanking}>
            <div>#21</div>
            <img
              src="/src/assets/ingame/profile.png"
            />
            <div>박시연</div>
            <div>248점</div>
          </div>
        </div>
      </div>
  );
};

export default Ranking;