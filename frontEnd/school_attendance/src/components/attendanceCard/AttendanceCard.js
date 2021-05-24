import React, { useEffect, useState } from 'react'
import { Square, CheckSquareFill } from 'react-bootstrap-icons';

import styles from './AttendanceCard.module.css'

const AttendanceCard = ({ attendance }) => {
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
        <h6 className={`${styles.profileEmail}`}>{attendance.email}</h6>
      </div>
      <div>
        {present ? (
          <button onClick={() => setPresent(false)} className={`${styles.checkBox}`}>
            <CheckSquareFill size={35} color='#3fbc36' />
          </button>
        ) : (
          <button onClick={() => setPresent(true)} className={`${styles.checkBox}`}>
            <Square size={35} color='#f73100' />
          </button>
        )}
      </div>
    </div>
  )
}

export default AttendanceCard
