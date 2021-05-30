import React, { useEffect, useState } from 'react'
import { Square, CheckSquareFill } from 'react-bootstrap-icons';

import styles from './AttendanceCard.module.css'

const AttendanceCard = ({ attendance, onClick }) => {
  const [present, setPresent] = useState(attendance.present);

  useEffect(() => {
    setPresent(attendance.present)
  }, [attendance])

  return (
    <div className={`${styles.profileContainer}`} style={present ? { backgroundColor: '#3fbc3630' } : { backgroundColor: '#f7310030' }}>
      <img className={`${styles.profileImage}`} src={attendance.photoUrl} alt="profile" />
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
