import React,{useState, useEffect} from 'react';
import styles from './styles.module.scss';
interface CurrentRankingProps {
    modalIsOpen: boolean;
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const CurrentRanking = ({modalIsOpen, setModalIsOpen}:CurrentRankingProps)=>{

    return(
        modalIsOpen && 
        <div className={styles.container}>
            <div style={{fontSize:30, fontWeight: 700}}>RANKING</div>
            <img 
                src='/src/assets/ingame/xButton.png'
                onClick={()=>setModalIsOpen(false)}
                className={styles.xButton}
            />
            <div className={styles.currentRankingContainer}>
                <div className={styles.currentRanking}>
                    <div>
                        #21
                    </div>
                    <img 
                        src='/src/assets/ingame/profile.png'
                        onClick={()=>setModalIsOpen(false)}
                    />  
                    <div>
                        박시연
                    </div>
                    <div>
                        248점
                    </div>
                </div>
            </div>
            <div className={styles.remainingTime}>
                <span>10초</span> 뒤에 다음게임이 시작됩니다.
            </div>
        </div>
    )
}
