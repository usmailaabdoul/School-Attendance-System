import React, { useEffect, useState } from 'react'
import { Square, CheckSquareFill } from 'react-bootstrap-icons';

import styles from './AttendanceCard.module.css'

const COLORS = [
  '#058ed9',
  '#A39A92', 
  '#D16666',
  '#E9724C',
  '#C5283D',
  '#255F85',
  '#3DCCC7',
  '#9AC2C9',
  '#3423A6',
  '#73BA9B',
  '#3A6EA5',
  '#D2AB99',
  '#56876D',
  '#645E9D',
  '#B7B868',
  '#A9FBC3',
]

const AttendanceCard = ({ attendance, onClick }) => {
  const [present, setPresent] = useState(attendance?.present);
  const [imgHasLoaded, setImgHasLoaded] = useState(false);

  useEffect(() => {
    setPresent(attendance.present)
  }, [attendance])

  const renderNameTag = () => {
    let random = Math.floor(Math.random() * COLORS.length);
    let color = COLORS[random];
    let name = attendance.name
    let letters = name
      .split(' ')
      .slice(0, 2)
      .map((l) => l[0])
      .join('');

    return <div className={`${styles.profileNameTag}`} style={{backgroundColor: `${color}`}}>{letters.toLocaleUpperCase()}</div>
  }

  return (
    <div className={`${styles.profileContainer}`} style={present ? { backgroundColor: '#3fbc3630' } : { backgroundColor: '#f7310030' }}>
      <img 
        style={imgHasLoaded ? {} : { display: 'none' }}
        className={`${styles.profileImage}`} 
        src={attendance.photoUrl} 
        alt="profile" 
        onLoad={() => setImgHasLoaded(true)}
        onError={() => console.log('image has not loaded loaded')}
      />
      {!imgHasLoaded && renderNameTag()}
      <div className={`${styles.profileBody}`}>
        <div>
          <h5 className={`${styles.profileName}`}>{attendance.name}</h5>
          <h6 className={`${styles.profileMatricule}`}>{attendance.matricule}</h6>
        </div>
      </div>
      <div>
        {present ? (
          <button onClick={() => onClick()} className={`${styles.checkBox}`}>
            <CheckSquareFill size={25} color='#3fbc36' />
          </button>
        ) : (
          <button onClick={() => onClick()} className={`${styles.checkBox}`}>
            <Square size={25} color='#f73100' />
          </button>
        )}
      </div>
    </div>
  )
}

export default AttendanceCard
