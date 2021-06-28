import React from 'react'
import { PersonBoundingBox, PersonLinesFill, PeopleFill } from 'react-bootstrap-icons';
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { setUser, setToken } from '../../redux/actions/authActions'
import { NavButton } from '../../components';
import styles from './sideBar.module.css';

const routes = [
  { id: 1, path: 'dashboard', title: 'Dashboard', icon: <PersonBoundingBox size={25} /> },
  { id: 2, path: 'attendance', title: 'Attendance', icon: <PersonLinesFill size={25} /> },
  { id: 3, path: 'students', title: 'Students', icon: <PeopleFill size={25} /> },
];

const SideBar = () => {
  const history = useHistory();
  const [active, setActive] = React.useState(1);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(setToken(''))
    history.push("/login")
    dispatch(setUser({}))
    sessionStorage.removeItem('TOKEN');
    sessionStorage.removeItem('USER');
  }

  return (
    <div className={`d-flex flex-column p-3 pb-5 text-white ${styles.main_sideBar}`} style={{ width: 280, height: '100vh', position: 'fixed' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 mr-md-auto text-dark text-decoration-none">
        {/* <span className="fs-4">CARNA PROJECT</span> */}
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto mt-5">
        {routes.map((route, index) => (
          <NavButton
            key={index}
            Icon={route.icon}
            title={route.title}
            path={route.path}
            active={active === route.id}
            onclick={() => setActive(route.id)}
          />
        ))}
      </ul>
      <hr />
      <div className=''>
        <Link onClick={() => logout()} to={`/login`} className='nav-link h5'>
          <a href="###" className='nav-link logout' style={{ color: '#79b8ec' }}>Log out</a>
        </Link>
      </div>
    </div>
  )
}

export default SideBar;