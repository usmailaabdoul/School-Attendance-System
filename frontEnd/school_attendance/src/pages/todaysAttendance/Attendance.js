import React, { useEffect, useState } from 'react'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import html2pdf from "html2pdf.js";
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import { connect } from "react-redux";

import attendanceApi from '../../apis/attendance'

import styles from './attendance.module.css';

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "60%",
    height: "90%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px"
  }
};

const Attendance = ({ user }) => {
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrintModalOpen, setPrintModalOpen] = useState(false)

  useEffect(() => {
    getAttendance()
  }, [])

  const getAttendance = async () => {
    setIsLoading(true)
    try {
      let obj = { courseCode: 'CEF304' }
      let res = await attendanceApi.getAttendance(obj)

      setAttendance(res)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log({ error })
    }
  }

  const downloadClick = () => {
    const opt = {
      margin: 1,
      filename: `student_attendace_${attendance[attendance.length - 1]?.courseCode}_${attendance[attendance.length - 1]?.date}`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "cm", format: "A4", orientation: "portrait" }
    };
    const element = document.getElementById("print");
    html2pdf()
      .set(opt)
      .from(element)
      .save();
    Swal.fire(
      'Download!',
      `Attendance downloaded successfully`,
      'success'
    )
    setPrintModalOpen(false)
  };

  return (
    <div className={`${styles.attendanceContainer} m-3 d-flex flex-column`}>
      <div className="p-2 mb-2">
        <div className="d-flex align-items-center justify-content-between">
          <h3>Class Attendance</h3>
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
                  <div className="d-flex justify-content-between align-items-center my-2 mx-5 mt-3">
                    <h4>
                      Attendance for {user.courses[0].courseName}: {user.courses[0].courseCode}
                    </h4>
                    <button onClick={() => setPrintModalOpen(true)} className="btn btn-primary">Download Attendance</button>
                  </div>
                  <div className={`shadow-sm ${styles.attendanceTable}`}>
                    <ReactTable
                      data={attendance[attendance.length - 1]?.classAttendance.allStudents ?? []}
                      showPagination={true}
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
                      defaultPageSize={20}
                      style={{ textAlign: 'center', alignItems: 'center', height: '930px' }}
                      loadingText='Loading Products ...'
                      noDataText='No products found'
                      className="-highlight -striped rt-rows-height ReactTable"
                    />
                  </div>
                </>
              )}
        </div>
      </div>

      <Modal
        isOpen={isPrintModalOpen}
        contentLabel="Dashboard"
        style={customStyles}>
        <div>
          <div className="text-cent mt-3">
            <button onClick={() => setPrintModalOpen(false)} className="btn btn-danger">Close</button> &nbsp; &nbsp;
            <button onClick={() => downloadClick()} className="btn btn-primary">Download</button>
          </div>
          <div id="print">
            <div className="d-flex flex-column align-items-end">
              <h6>Date: {attendance[attendance.length - 1]?.date}</h6>
            </div>
            <div className="text-center mb-2">
              <h3>Attendance Sheet</h3>
              <h5>Course: {user.courses[0].courseName}, {user.courses[0].courseCode}</h5>
            </div>
            <table className="table table-bordered table-sm">
              <thead>
                <th>#</th>
                <th>Name</th>
                <th>Matricule</th>
                <th>Email</th>
                <th>Present</th>
              </thead>
              <tbody>
                {attendance[attendance.length - 1]?.classAttendance.allStudents.map((customer, i) => {
                  return <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{customer.name}</td>
                    <td>{customer.matricule}</td>
                    <td>{customer.email}</td>
                    <td>
                      <div style={customer.present ? { color: '#3fbc36' } : { color: '#f73100' }}>
                        {customer.present ? 'Present' : 'Absent'}
                      </div>
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const mapStatesToProps = ({ auth }) => ({
  user: auth.user
})

export default connect(mapStatesToProps, null)(Attendance);