import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from "react-redux";

import { Dashboard, Login, Register, Attendance, Students } from '../pages';
import { SideBar } from "../sections";

import styles from './Navigation.module.css';

const Navigation = ({ token }) => {
  return (
    <Router>
      {!token.length > 0 ? ( // if the admin is not logged routes shouldn't be available.
        <div className={styles.homeContainer}>
          <div className={styles.homeSidebar}>
            <SideBar />
          </div>
          <div className={styles.mainSection}>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/attendance" component={Attendance} />
            <Route path="/students" component={Students} />
          </div>
        </div>
      ) : (
        <>
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </>
      )}
    </Router>
  )
}

const mapStatesToProps = ({ auth }) => ({
  token: auth.token
})

export default connect(mapStatesToProps, null)(Navigation);