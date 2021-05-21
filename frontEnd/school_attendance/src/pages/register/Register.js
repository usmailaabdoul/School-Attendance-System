import React, { useState } from "react";
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { connect } from "react-redux";

import { setUser, setToken } from '../../redux/actions/authActions'
import styles from './register.module.css'

const Register = (props) => {
  const {history} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [address, setAddress] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   *attempts to register a user if all the provided information is available
   *
   * @param {*} event
   */
  const register = async (event) => {

    setIsLoading(true)
    event.preventDefault()
    try {
      let res;
      // let res = await apis.authApi.register({
      //   name,
      //   email,
      //   password,
      //   address,
      //   phoneNumber
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
        text: 'Unable to Register'
      })
    }
  }

  const checkDisabled = () => { 
    return  (password === '' || email === '');
  }

  return (
    <div className={`${styles.loginContainer}`}>
      <div className={`${styles.loginInnerContainer}`}>
        <h1 className={`${styles.heading}`}>Register</h1>
        <div>
          {/* <input placeholder="Name" className={`${styles.loginInput} mt-3`} type="text" onChange={(event) => setName(event.target.value)} /> */}
        </div>
        <div>
          <input placeholder="Email" className={`${styles.loginInput} mt-3`} type="text" onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          {/* <input placeholder="Address" className={`${styles.loginInput} mt-3`} type="text" onChange={(event) => setAddress(event.target.value)} /> */}
        </div>
        <div>
          {/* <input placeholder="Phone number" className={`${styles.loginInput} mt-3`} type="number" onChange={(event) => setPhoneNumber(event.target.value)} /> */}
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
            <button className={`${styles.button} mt-3`} disable={checkDisabled()} onClick={(e) => { !checkDisabled() && register(e) }}>Register</button>
          )}

        <Link to={'/login'}>
          <button className={`${styles.text_button} mt-3`} type="submit">Already have an account? Login</button>
        </Link>
      </div>
    </div>
  )
}

const mapStatesToProps = () => ({})

export default connect(mapStatesToProps, { setToken, setUser })(Register);
