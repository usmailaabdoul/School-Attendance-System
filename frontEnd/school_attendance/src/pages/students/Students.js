import React, { useEffect, useState } from 'react'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { connect } from "react-redux";

import studentsApi from '../../apis/students'

import styles from './students.module.css';


const Students = ({user}) => {
  console.log({user})
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getStudents()
  }, [])

  const getStudents = async () => {
    setIsLoading(true)
    try {
      let obj = { courseCode: 'CEF304' }
      let res = await studentsApi.getStudents(obj)
      setStudents(res)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log({ error })
    }
  }

  return (
    <div className={`${styles.attendanceContainer} m-3 d-flex flex-column`}>
      <div className="p-2 mb-2">
        <div className="d-flex align-items-center justify-content-between">
          <h3>Students</h3>
          <div>
            <div class="dropdown">
              <span>
                <a href="###" class="d-flex align-items-center text-dark text-decoration-none">
                  {/* <img src="https://github.com/mdo.png" alt="" width="40" height="40" class="rounded-circle me-2" /> */}
                  <h4>{user.name}</h4>
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={'d-flex'} style={{ flex: '1' }}>
        <div className={`d-flex flex-column ${styles.webCamContainer}`}>

          {
            isLoading ?
              <div className={'d-flex justify-content-center align-items-center h-100'}>
                <div class="d-flex justify-content-center align-items-center">
                  <div class="spinner-border" style={{ width: "3rem", height: "3rem", color: '#406df9' }} role="status">
                  </div>
                </div>
              </div>
              : (
                <>
                  <div className="d-flex justify-content-center align-items-center my-2 h4">
                    Students Offering {user.courses[0].courseName}: {user.courses[0].courseCode}
                    </div>
                  <div className={`shadow-sm ${styles.attendanceTable}`}>
                    <ReactTable
                      showPagination={true}
                      showPageSizeOptions={false}
                      minRows={0}
                      data={students}
                      columns={[
                        {
                          Header: "Image",
                          id: "profileImage",
                          Cell: row => {
                            return (
                              <div>
                                <img src={row.original.photoUrl} alt='profile' style={{width: '55px', height: '55px', borderRadius: '10px'}}/>
                              </div>
                            )
                          }
                        },
                        {
                          Header: "Name",
                          accessor: "name",
                          className: 'text-center'
                        },
                        {
                          Header: "Matricule",
                          accessor: "matricule",
                          className: 'text-center'
                        },
                        {
                          Header: "Email",
                          accessor: "email",
                          className: 'text-center'
                        },
                        {
                          Header: "Faculty",
                          accessor: "faculty",
                          className: 'text-center'
                        },
                      ]}
                      defaultPageSize={20}
                      style={{ textAlign: 'center', alignItems: 'center', height: '950px' }}
                      loadingText='Loading Products ...'
                      noDataText='No products found'
                      className="-highlight -striped rt-rows-height ReactTable"
                    />
                  </div>
                </>
              )}
        </div>
      </div>
    </div>
  )
}

const mapStatesToProps = ({ auth }) => ({
  user: auth.user
})

export default connect(mapStatesToProps, null)(Students);