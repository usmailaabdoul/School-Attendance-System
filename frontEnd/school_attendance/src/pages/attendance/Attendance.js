import React, { useEffect, useState } from 'react'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'

import { } from '../../components';

import attendanceApi from '../../apis/attendance'

import styles from './attendance.module.css';


const Attendance = (props) => {
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAttendance()
  }, [])

  const getAttendance = async () => {
    setIsLoading(true)
    try {
      let obj = { courseCode: 'CEF304' }
      let res = await attendanceApi.getAttendance(obj)
      console.log({ res });
      res = res.reverse()
      setAttendance(res)
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
          <h3>Class Attendance</h3>
          <div>
            <div class="dropdown">
              <span>
                <a href="###" class="d-flex align-items-center text-dark text-decoration-none">
                  <img src="https://github.com/mdo.png" alt="" width="40" height="40" class="rounded-circle me-2" />
                  <strong>Abdoul ila</strong>
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
                    Attendance for CEF304
                    </div>
                  <div className={`shadow-sm ${styles.attendanceTable}`}>
                    <ReactTable
                      showPagination={true}
                      showPageSizeOptions={false}
                      minRows={0}
                      data={attendance}
                      columns={[
                        {
                          Header: "Date",
                          accessor: "date",
                          className: 'text-center'
                        },
                        {
                          Header: "Attendance",
                          id: "name",
                          Cell: row => {
                            return (
                              <ReactTable
                                data={row.original.classAttendance.allStudents}
                                showPagination={false}
                                showPageSizeOptions={false}
                                minRows={0}
                                columns={[
                                  {
                                    Header: "Name",
                                    accessor: "name",
                                    className: 'text-center'
                                  },
                                  {
                                    Header: "Matrciule",
                                    accessor: "matricule",
                                    className: 'text-center'
                                  },
                                  {
                                    Header: "Email",
                                    accessor: "email",
                                    className: 'text-center'
                                  },
                                  {
                                    Header: 'Present',
                                    accessor: "present",
                                    id: "present",
                                    Cell: row => {
                                      return (
                                        <div style={row.original.present ? { color: '#3fbc36' } : { color: '#f73100' }}>
                                          {row.original.present ? 'Present' : 'Absent'}
                                        </div>
                                      )
                                    }
                                  }
                                ]}
                              />
                            )
                          }
                        }
                      ]}
                      defaultPageSize={10}
                      style={{ textAlign: 'center', height: '830px' }}
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

export default Attendance
