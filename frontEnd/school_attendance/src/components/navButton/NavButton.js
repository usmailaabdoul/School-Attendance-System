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
    <Link onClick={() => onclick()} to={title === 'Attendance' ? `/${path}/today` : `/${path}/`} className='nav-link'>
      <li className="nav-item">
        <a href="###" className={`nav-link d-flex align-items-center h5`} style={active ? { color: '#1D1511' } : { color: '#B4B7B5' }}>
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
          <a href="###" className='nav-link' style={location.pathname === '/attendance/today' ? { color: '#1D1511' } : { color: '#B4B7B5' }}>Todays Attendance</a>
        </Link>
        <Link onClick={() => onclick()} to={`/${path}/all`} className='nav-link'>
          <a href="###" className='nav-link' style={location.pathname === '/attendance/all' ? { color: '#1D1511' } : { color: '#B4B7B5' }}>All Attendance</a>
        </Link>
      </div>
    )}
    </>
  )
}
