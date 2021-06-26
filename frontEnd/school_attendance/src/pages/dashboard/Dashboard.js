import React, { useEffect, useState, useRef } from 'react'
import Webcam from "react-webcam";
import { CameraVideo, CameraVideoOffFill, PauseFill, PlayFill, ChevronUp, ChevronDown } from 'react-bootstrap-icons';
import { connect } from "react-redux";
import { imgSrcToBlob, createObjectURL } from 'blob-util'

import { AttendanceCard, SortButton } from '../../components';

import faceRecognitionApi from '../../apis/faceRecognition'
import attendanceApi from '../../apis/attendance'
import Swal from 'sweetalert2'

import styles from './dashboard.module.css';

const Dashboard = ({ user }) => {
  const webcamRef = useRef(null);
  const [startAttendance, setStartAttendance] = useState(false);
  const [paused, setPaused] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [sortBy, setSortBy] = useState('present');
  const [sortedAttendance, setSortedAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [attendanceInfo, setAttendanceInfo] = useState({});
  const [devices, setDevices] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [unknownStudents, setUnknownStudents] = useState([]);
  const [dataUrl, setDataUrl] = useState('');

  let timer = useRef();

  useEffect(() => {
    if (sortBy === 'present') {
      attendance.sort((x, y) => { return y.present - x.present });
      setSortedAttendance([...attendance])
    } else if (sortBy === 'absent') {
      attendance.sort((x, y) => { return x.present - y.present });
      setSortedAttendance([...attendance])
    }

  }, [attendance, sortBy])

  const capture = React.useCallback(async () => {
    // const imageSrc = webcamRef.current.getScreenshot();
    getBase64FromImageUrl('http://127.0.0.1:5000/api/v1/videoFeed')

    try {
      let obj = { courseCode: user.courses[0].courseCode, image: dataUrl }
      let res = await faceRecognitionApi.findFaces(obj)
      console.log({ res });
      setAttendance(res.classAttendance.allStudents)
      setUnknownStudents(res.classAttendance.unknownStudents)
      setAttendanceInfo(res)
    } catch (error) {
      console.log({ error })
    }
  }, [dataUrl, user.courses]);

  const getBase64FromImageUrl = url => {
    const img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0);

      const dataURL = canvas.toDataURL('image/png');

      console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ''));
      setDataUrl(dataURL.replace(/^data:image\/(png|jpg);base64,/, ''))
    };

    img.src = url;
  };

  useEffect(() => {
    if (startAttendance && !paused) {
      let t = setInterval(() => {
        console.log('its been 3secs')
        capture()
      }, 3000);
      timer.current = t;
    }
  }, [capture, paused, startAttendance]);

  const handleDevices = React.useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(
    () => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },
    [handleDevices]
  );

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
          clearInterval(timer.current)
          timer.current = 0
        }
        setStartAttendance(false);
        setPaused(false)
      }
    })
  }

  const pauseWebCam = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = 0
    }
    setPaused(true);
  }
  const playWebCam = () => {
    setPaused(false)
  }

  const startTakingAttendance = async () => {
    setIsLoading(true)
    let obj = { courseCode: user.courses[0].courseCode }
    try {
      let res = await faceRecognitionApi.startAttendance(obj)
      console.log({ res });
      setIsLoading(false)
      setStartAttendance(true)
    } catch (error) {
      setIsLoading(false)
      console.log({ error })
    }
  }

  const searchStudents = (e) => {
    let text = e.target.value;
    setSearchText(text)

    let filteredAttendance = attendance.filter((att) => {
      let _att = `${att.matricule.toLowerCase()}`;
      let _text = text.toLowerCase();

      return _att.indexOf(_text) > -1;
    });
    setSortedAttendance(filteredAttendance);
  }

  const updateAttendance = async (att) => {
    try {
      let obj = { courseCode: user.courses[0].courseCode, studentId: att._id.$oid, attendanceId: attendanceInfo._id.$oid }
      let res = await attendanceApi.updateStudentAttendance(obj)
      console.log({ res });
      setAttendance(res[0].classAttendance.allStudents)
    } catch (error) {
      console.log({ error })
    }
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
          <div className={`bg-white shadow-sm d-flex align-items-center justify-content-center ${styles.webCamWrapper}`}>
            {startAttendance ? (
              // <Webcam
              //   audio={false}
              //   ref={webcamRef}
              //   screenshotFormat="image/jpg"
              //   height={'98%'}
              //   style={{ borderRadius: 20 }}
              // // videoConstraints={{ deviceId: devices[1].deviceId }}
              // />
              <div style={{ flex: 1, height: '800px' }}>
                <img id='video_feed' src="http://127.0.0.1:5000/api/v1/videoFeed" alt="videofeed" height='100%' width='100%' />
              </div>
            ) : (
              <div className={`${styles.notRecordingBox}`}>
                {isLoading ? (
                  <div className="d-flex justify-content-center align-items-center mt-2">
                    <div className="spinner-border" style={{ width: '2rem', height: '2rem', color: '#406df9' }} role="status">
                    </div>
                  </div>
                ) : (
                  <>
                    <h5>To start Taking Attendance click button below</h5>
                    <div className={`mt-1 ${styles.recordBtnIndicator}`}>
                      <CameraVideo size={30} color="#B4B7B5" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {/* <div className={`${styles.bounding_box}`} style={{top: 100, right: 100, bottom: 100, left: 100}}></div> */}
          <div className={`${styles.btnPositions}`}>
            {startAttendance && (
              <>
                <button onClick={() => closeWebCam()} className={`mx-2 ${styles.iconBtnStop} shadow-sm`}><CameraVideoOffFill size={30} color="#ffffff" /></button>
                <button onClick={() => pauseWebCam()} className={`mx-2 ${styles.iconBtnRecord} shadow-sm`} style={paused ? { backgroundColor: '#3fbc3670' } : { backgroundColor: '#3fbc36' }}><PauseFill size={30} color="#ffffff" /></button>
                <button onClick={() => playWebCam()} className={`mx-2 ${styles.iconBtnRecord} shadow-sm`} style={paused ? { backgroundColor: '#3fbc36' } : { backgroundColor: '#3fbc3670' }}><PlayFill size={30} color="#ffffff" /></button>
              </>
            )}
            {!startAttendance && (
              <button onClick={() => startTakingAttendance()} className={`mx-2 ${styles.iconBtnRecord} shadow-sm`}><CameraVideo size={30} color="#ffffff" /></button>
            )}
          </div>
        </div>
        <div className={`d-flex flex-column ml-4 ${styles.attendanceSection}`}>
          <div className='d-flex align-items-center justify-content-between  ml-4 mx-2 mt-3 mb-1'>
            <h5 className="text-success ">Attendance</h5>
            <input placeholder='Search by Matrciule' className={`input ${styles.searchInput}`} type="text" value={searchText} onChange={(e) => searchStudents(e)} />
            <SortButton
              sortBy={sortBy}
              onClick={(value) => setSortBy(value)}
            />
          </div>
          <div className={`mx-4 ${styles.studentsPresent}`} style={expanded ? { height: '620px' } : { height: '850px' }}>
            <div className="d-flex align-items-center flex-wrap">
              {sortedAttendance.map((att, index) => (
                <AttendanceCard
                  key={index}
                  attendance={att}
                  onClick={() => updateAttendance(att)}
                />
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mx-4 my-2">
            <h5 className="text-danger m-0">Unknown Students</h5>
            <div onClick={() => setExpanded(!expanded)} className="m-0">
              {expanded ? <ChevronDown /> : <ChevronUp />}
            </div>
          </div>
          <div className={`mx-4 ${styles.studentsAbsent}`} style={expanded ? { height: '250px' } : { height: '20px' }}>
            <div className="d-flex align-items-center flex-wrap">
              {unknownStudents.map((img, index) => (
                <div key={index} className={`${styles.studentsImageWrapper}`}>
                  <img
                    alt="students"
                    className={`${styles.studentsImage}`}
                    src={img.url}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStatesToProps = ({ auth }) => ({
  user: auth.user
})

export default connect(mapStatesToProps, null)(Dashboard);
