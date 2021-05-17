import React, { useState } from "react";
import Swal from 'sweetalert2'
// import apis from '../../apis/apis'
import { Link } from 'react-router-dom'
import { connect } from "react-redux";

import { setUser, setToken } from '../../redux/actions/authActions'
import styles from './login.module.css'

const Login = (props) => {
  const {history} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * attempts to log a user in, only if their credentials are correct
   *
   * @param {*} event
   */
  const login = async (event) => {

    setIsLoading(true)
    event.preventDefault()
    try {
      let res;
      // let res = await apis.authApi.login({
      //   email,
      //   password
      // })
      console.log({res})

      props.setToken(res.token)
      props.setUser(res.user)

      sessionStorage.setItem('TOKEN', res.token);
      sessionStorage.setItem('USER', JSON.stringify(res.user));

      setIsLoading(false)
      history.push("/dashboard")

    } catch (e) {
      console.log({e})
      setIsLoading(false)
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: 'Unable to login'
      })
    }
  }

  /**
   *
   *
   * @return {*} 
   */
  const checkDisabled = () => { 
    return  (password === '' || email === '');
  }

  return (
    <div className={`${styles.loginContainer}`}>
      <div className={`${styles.loginInnerContainer}`}>
        <h1 className={`${styles.heading}`}>Login</h1>
        <div>
          <input placeholder="Email" className={`${styles.loginInput} mt-3`} type="text" onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <input placeholder="Password" className={`${styles.loginInput} mt-3`} type="password" onChange={(event) => setPassword(event.target.value)} />
        </div>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center mt-2">
            <div className="spinner-border" style={{ width: '1.5rem', height: '1.5rem', color: '#406df9' }} role="status">
            </div>
          </div>
        ) :
          (
            <button className={`${styles.button} mt-3`} disable={checkDisabled()} onClick={(e) => { !checkDisabled() && login(e) }}>Login</button>
          )}

        <Link to={'/register'}>
          <button className={`${styles.text_button} mt-3`} type="submit">Don't have an account? Register</button>
        </Link>
      </div>
    </div>
  )
}

const mapStatesToProps = () => ({})

export default connect(mapStatesToProps, { setToken, setUser })(Login);
