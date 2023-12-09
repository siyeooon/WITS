import { useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'
export const Header = ()=>{
  const navigate = useNavigate();
    return(       
    <div className={styles.header}>
        <div className={styles.logo}>WITS</div>
        <div style={{display:'flex'}}>
            <img 
              src='/src/assets/ingame/ranking.png'
              style={{width:50, height: 50, margin:5}}
              onClick={()=>navigate('/ranking')}
            />
            <img 
                src='/src/assets/ingame/profile.png'
                style={{width:50, height: 50, margin: 5}}
            />
        </div>
      </div>)
}