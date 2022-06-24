import React, { useEffect, useState } from 'react'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css';
import { connect } from "react-redux";

import attendanceApi from '../../apis/attendance'

import styles from './attendance.module.css';

const Attendance = ({user}) => {
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
          <h3>Attendance for {user.courses[0].courseName}: {user.courses[0].courseCode}</h3>
        </div>
      </div>
      <div className={'d-flex'} style={{ flex: '1' }}>
        <div className={`d-flex flex-column ml-3 ${styles.webCamContainer}`}>

          {
            isLoading ?
              <div className={'d-flex justify-content-center align-items-center h-100'}>
                <div class="d-flex justify-content-center align-items-center">
                  <div class="spinner-border" style={{ width: "3rem", height: "3rem", color: '#165f9c' }} role="status">
                  </div>
                </div>
              </div>
              : (
                <>
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
                          className: 'text-center',
                          maxWidth: 400,
                        },
                        {
                          Header: "Attendance",
                          id: "name",
                          Cell: row => {
                            return (
                              <ReactTable
                                data={row.original.classAttendance.allStudents}
                                showPagination={true}
                                showPageSizeOptions={false}
                                minRows={0}
                                defaultPageSize={10}
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
                      defaultPageSize={5}
                      style={{ textAlign: 'center', height: '995px', alignItems: 'center' }}
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

export default connect(mapStatesToProps, null)(Attendance);