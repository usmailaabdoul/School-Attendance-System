import React from 'react'
import {
  Link
} from "react-router-dom";

export default function NavButton(props) {
  const { Icon, title, path, active, onclick } = props;

  return (
    <Link onClick={() => onclick()} to={`/${path}`} className='nav-link'>
      <li className="nav-item">
        <a href="###" className={`nav-link d-flex align-items-center h5`} style={active ? { color: '#1D1511' } : { color: '#B4B7B5' }}>
          <div className="me-3">
            {Icon}
          </div>
          {title}
        </a>
      </li>
    </Link>
  )
}
