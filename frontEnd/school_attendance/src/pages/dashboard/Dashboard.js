import React, { useEffect, useState, useRef, createRef } from 'react'
import Webcam from "react-webcam";
import { CameraVideo, CameraVideoOffFill, PauseFill, PlayFill } from 'react-bootstrap-icons';

import faceRecognitionApi from '../../apis/faceRecognition'
import Swal from 'sweetalert2'

import styles from './dashboard.module.css';

const Dashboard = (props) => {
  const webcamRef = useRef(null);
  const [imagesUrls, setImagesUrls] = useState([]);
  const [startAttendance, setStartAttendance] = useState(false);
  const [paused, setPaused] = useState(false);

  let timer = createRef();

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    let formData = new FormData();
    formData.append('image', imageSrc);

    // try {
    //   let res = await faceRecognitionApi.findFaces(formData)

    //   console.log({res});
    // } catch (error) {
    //   console.log({error})
    // }

    let oldImages = []
    oldImages = imagesUrls;
    oldImages.push(imageSrc)

    setImagesUrls([...oldImages]);
  }, [imagesUrls]);

  useEffect(() => {
    if (startAttendance && !paused) {
      timer.current = setTimeout(() => {
        capture()
      }, 3000);
    }
  }, [capture, paused, startAttendance, timer]);

  const closeWebCam = () => {
    Swal.fire({
      title: 'Are you sure you want to close Camera?',
      text: 'This will stop Attendance collection and save data!',
      icon: 'warning',
      cancelButtonColor: '#3085d6',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, close Camera'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = 0
        }
        setStartAttendance(false);
        setPaused(false)
        setImagesUrls([])
      }
    })
  }

  const pauseWebCam = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = 0
    }
    setPaused(true);
  }
  const playWebCam = () => {
    setPaused(false)
  }

  return (
    <div className={`${styles.dashboardContainer} m-3 d-flex flex-column`}>
      <div className="p-2 mb-2">
        <div className="d-flex align-items-center justify-content-between">
          <h3>School Attendance Using Face Recognition</h3>
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
          <div className={`bg-white shadow-sm d-flex align-items-center justify-content-center ${styles.webCamWrapper}`}>
            {startAttendance ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpg"
                height={'100%'}
                style={{ borderRadius: 40 }}
              />
            ) : (
              <div className={`${styles.notRecordingBox}`}>
                <h5>To start Taking Attendance click button below</h5>
                <div className={`mt-1 ${styles.recordBtnIndicator}`}>
                  <CameraVideo size={30} color="#B4B7B5" />
                </div>
              </div>
            )}
          </div>
          {/* <div className={`${styles.bounding_box}`} style={{top: 100, right: 100, bottom: 100, left: 100}}></div> */}
          <div className={`${styles.btnPositions}`}>
            {startAttendance && (
              <>
                <button onClick={() => closeWebCam()} className={`mx-2 ${styles.iconBtnStop} shadow-sm`}><CameraVideoOffFill size={30} color="#ffffff" /></button>
                <button onClick={() => pauseWebCam()} className={`mx-2 ${styles.iconBtnRecord} shadow-sm`} style={paused ? {backgroundColor: '#3fbc3670'} : {backgroundColor: '#3fbc36'}}><PauseFill size={30} color="#ffffff" /></button>
                <button onClick={() => playWebCam()} className={`mx-2 ${styles.iconBtnRecord} shadow-sm`} style={paused ? {backgroundColor: '#3fbc36'} : {backgroundColor: '#3fbc3670'}}><PlayFill size={30} color="#ffffff" /></button>
              </>
            )}
            {!startAttendance && (
              <button onClick={() => setStartAttendance(true)} className={`mx-2 ${styles.iconBtnRecord} shadow-sm`}><CameraVideo size={30} color="#ffffff" /></button>
            )}
          </div>
        </div>
        <div className={`d-flex flex-column ms-4 ${styles.attendanceSection}`}>
          <h5 className="text-success mx-4 mt-4">Students Present</h5>
          <div className={`mx-4 ${styles.studentsPresent}`}>
            <div className="d-flex align-items-center flex-wrap">
              {imagesUrls && (
                imagesUrls.map((img, index) => (
                  <div className={`${styles.studentsImageWrapper}`}>
                    <img
                      key={index}
                      alt="students"
                      className={`${styles.studentsImage}`}
                      src={img}
                    />
                    <h6 className="m-0">usmaila abdoul</h6>
                    <h6 className="m-0">FE17A090</h6>
                  </div>
                ))
              )}
            </div>
          </div>

          <h5 className="text-danger mx-4 my-1">Unknown Students</h5>
          <div className={`mx-4 ${styles.studentsAbsent}`}>
            <div className="d-flex align-items-center flex-wrap">
              {imagesUrls && (
                imagesUrls.map((img, index) => (
                  <div className={`${styles.studentsImageWrapper}`}>
                    <img
                      key={index}
                      alt="students"
                      className={`${styles.studentsImage}`}
                      src={img}
                    />
                    <h6 className="m-0">usmaila abdoul</h6>
                    <h6 className="m-0">FE17A090</h6>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
