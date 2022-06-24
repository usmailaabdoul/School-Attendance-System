import React from 'react'
import {
  Link,
  useLocation,
} from "react-router-dom";

export default function NavButton(props) {
  const { Icon, title, path, active, onclick } = props;
  
  const location = useLocation();

  return (
    <>
    <Link onClick={() => onclick()} to={title === 'Attendance' ? `/${path}/today` : `/${path}/`} className='nav-link m-0 p-0 pt-2' style={ active ? styles.buttonStyle : {backgroundColor: ''}}>
      <li className="nav-item">
        <a href="###" className={`nav-link d-flex align-items-center h5`} style={active ? { color: '#fff' } : { color: '#79b8ec' }}>
          <div className="mr-3">
            {Icon}
          </div>
          {title}
        </a>
      </li>
    </Link>
    {title === 'Attendance' && (
      <div className="d-flex flex-column h6 ml-4">
        <Link onClick={() => onclick()} to={`/${path}/today`} className='nav-link'>
          <a href="###" className='nav-link' style={location.pathname === '/attendance/today' ? { color: '#fff' } : { color: '#79b8ec' }}>Todays Attendance</a>
        </Link>
        <Link onClick={() => onclick()} to={`/${path}/all`} className='nav-link'>
          <a href="###" className='nav-link' style={location.pathname === '/attendance/all' ? { color: '#fff' } : { color: '#79b8ec' }}>All Attendance</a>
        </Link>
      </div>
    )}
    </>
  )
}

const styles ={
  buttonStyle: {
    backgroundColor: '#1d7ac9',
    borderRadius: '10px'
    // height: '50px'
  }
}