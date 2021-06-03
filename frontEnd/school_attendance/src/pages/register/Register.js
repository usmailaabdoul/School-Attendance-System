import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { Form } from 'react-bootstrap';
import { TrashFill } from 'react-bootstrap-icons';

import { setUser, setToken } from '../../redux/actions/authActions'
import styles from './register.module.css'
import authApi from '../../apis/auth'
import courseApi from '../../apis/courses';

const Register = (props) => {
  const { history } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('')
  const [roles, setRoles] = useState([])
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourse = async () => {
      try {
        let res = await courseApi.getCourses()

        console.log(res)
        setCourses(res);
      } catch (error) {
        
      }
    }

    getCourse();
  }, [])

  const register = async (event) => {

    setIsLoading(true)
    event.preventDefault()
    try {
      await authApi.register({
        name,
        email,
        password,
        courses: roles
      })

      setIsLoading(false)
      history.push("/login")

    } catch (e) {
      console.log({ e })
      setIsLoading(false)
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: 'Unable to Register'
      })
    }
  }

  const addToRoles = () => {
    let _roles = roles;
    let newRole = courses.find((course) => course.courseName === role);
    newRole._id = newRole._id.$oid

    _roles.push(newRole);

    setRoles([..._roles]);
  }

  const deleteRole = (course) => {
    let index = roles.findIndex((r) => r.courseCode === course.courseCode);
    console.log({index, roles, role})
    if (index >= 0) {
      roles.splice(index, 1);
    }

    setRoles([...roles])
  }


  const checkDisabled = () => {
    return (password === '' || email === '');
  }

  console.log({roles})
  return (
    <div className={`${styles.loginContainer}`}>
      <div className={`${styles.loginInnerContainer}`}>
        <h1 className={`${styles.heading}`}>Register</h1>
        <div>
          <input placeholder="Name" className={`${styles.loginInput} mt-3`} type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Email" className={`${styles.loginInput} mt-3`} type="text" onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <input placeholder="Password" className={`${styles.loginInput} mt-3`} type="password" onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <Form.Group className={`w-75 m-0`}>
          <Form.Control onChange={(event) =>  setRole(event.target.value)} as="select" className={"form-control input align-self-center m-0"}>
            <option className={`${styles.loginInput}`} sty>Select courses</option>
            {courses.map((course, key) => {
              return <option key={key}>{course.courseName}</option>
            })}
          </Form.Control>
        </Form.Group>
        <button onClick={() => addToRoles()} className="btn btn-primary text-center w-25 ml-2"><span
              className="h6">Add</span></button>
        </div>

        <div className="row ml-1" style={{color: '#fff'}}>
          <table className="table table-striped" style={{ height: '5px' }}>
            <thead className="items-table-header custom-table">
              <tr>
                <th className="text-center" style={{color: '#fff'}}>No#</th>
                <th className="text-center" style={{color: '#fff'}}>Course Name</th>
                <th className="text-center"style={{color: '#fff'}}>Course Code</th>
                <th className="text-center"style={{color: '#fff'}}>Action</th>
              </tr>
            </thead>
            <tbody style={{ height: '10px' }}>
              {roles.map((course, index) => {
                return (
                  <tr key={index} className="custom-table">
                    <td className="text-center text" style={{color: '#fff'}}>{index + 1}</td>
                    <td className="text-center text" style={{color: '#fff'}}>{course.courseName}</td>
                    <td className="text-center text" style={{color: '#fff'}}>{course.courseCode}</td>
                    <td>
                      <button onClick={() => deleteRole(course)} style={{backgroundColor: 'transparent', border: 'none'}}>
                        <TrashFill style={{ fontSize: 20 }} color="#f73100" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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
