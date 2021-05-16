import React from 'react'
import { PersonBoundingBox, PersonLinesFill, PeopleFill } from 'react-bootstrap-icons';
import { connect } from "react-redux";

import { setUser, setToken } from '../../redux/actions/authActions'
import { NavButton } from '../../components';

const routes = [
  { id: 1, path: 'dashboard', title: 'Dashboard', icon: <PersonBoundingBox size={25} /> },
  { id: 2, path: 'attendance', title: 'Attendance', icon: <PersonLinesFill size={25} /> },
  { id: 3, path: 'students', title: 'Students', icon: <PeopleFill size={25} /> },
];

const SideBar = (props) => {
  const {history} = props;
  const [active, setActive] = React.useState(1);

  const logout = () => {
    sessionStorage.removeItem('TOKEN');
    sessionStorage.removeItem('USER');
    history.push("/login")
  }
  
  return (
    <div class="d-flex flex-column p-3 pb-5 text-white bg-white" style={{ width: 280, height: '100vh', position: 'fixed' }}>
      <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        {/* <span class="fs-4">CARNA PROJECT</span> */}
      </a>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto mt-5">
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
      <div class="dropdown">
        <span onClick={() => logout()}>
          <a href="/login" class="d-flex align-items-center text-dark text-decoration-none">
            <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2" />
            <strong>Log out</strong>
          </a>
        </span>
      </div>
    </div>
  )
}

const mapStatesToProps = () => ({})

export default connect(mapStatesToProps, { setToken, setUser })(SideBar);