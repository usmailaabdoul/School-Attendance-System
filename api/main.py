from cv2 import data
from flask import Flask, Response, request, jsonify
from bson.json_util import dumps, loads
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo

import os

from lecturers import Lecturers
from courses import Courses
from students import Students
from attendance import Attendance
import helpers
import firebase

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/university"
app.config["CORS_HEADERS"] = "Content-Type"

mongo = PyMongo(app)

studentCollection = mongo.db.students
lecturerCollection = mongo.db.lecturers
courseCollection = mongo.db.courses
attendanceCollection = mongo.db.attendance

@app.route('/api/v1/test', methods=["GET", "OPTIONS"])
@cross_origin(headers='Content-Type')
def test():
  res = jsonify('You are able to connect to the server')
  return res

@app.route('/api/v1/videoFeed')
def video_feed():
  #Video streaming route. Put this in the src attribute of an img tag
  return Response(helpers.gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/v1/singleFrame', methods=["GET", "OPTIONS"])
@cross_origin(headers='Content-Type')
def single_frame():
  data = helpers.single_frame()

  res = jsonify(f'{data}')
  return res

@app.route('/api/v1/addNewStudent', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def addNewStudent():
  if request.method == 'POST':
    student = Students(studentCollection)

    data = request.get_json()
    name  = data['name']
    matricule  = data['matricule']
    email  = data['email']
    courses = data['courses']
    faculty = data['faculty']
    img_data = data['image']

    path = f'api/images/{matricule}'
    helpers.base64toImg(img_data, path)
    
    encodings = helpers.getEncodings(path)

    string_ints = [str(int) for int in encodings]
    encodingsStr = ",".join(string_ints)

    url = firebase.uploadImage(path)
    obj = {'name': name, 'photoUrl': url, 'matricule': matricule, 'email': email, 'encodings': encodingsStr, 'courses': courses, 'faculty': faculty}
    student.addNewStudent(obj)

    if os.path.exists(f'{path}.jpg'):
      os.remove(f'{path}.jpg')
    else:
      print("The file does not exist")

    res = jsonify('New student added succesfully')
    return res

@app.route('/api/v1/startAttendance', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def startNewAttendance():
  if request.method == 'POST':
    attendance = Attendance(attendanceCollection)

    data = request.get_json()
    courseCode = data['courseCode']

    date = helpers.getDate()

    attendanceExits = attendance.getAttendance(date, courseCode)
    attendanceExits = loads(attendanceExits)

    if (len(attendanceExits) > 0):
      res = jsonify('Attendace has already been taken for today')
      return res

    student = Students(studentCollection)
    students = student.getStudentsForParticleCourse(courseCode)

    stdAttendance = loads(students)
    for student in stdAttendance:
      student['present'] = False

    classAttendance = {'allStudents': stdAttendance, 'unknownStudents': []}
    obj = {'courseCode': courseCode, 'date': date, 'classAttendance': classAttendance}

    att = attendance.addNewAttendance(obj)

    res = jsonify('New Attendance started.')
    return res

@app.route('/api/v1/findFaces', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def findFaces():
  if request.method == 'POST':
    attendance = Attendance(attendanceCollection)

    data = request.get_json()

    # img_data = data['image']
    courseCode = data['courseCode']

    path = f'api/currentFrame/imageFrame'
    # helpers.base64toImg(img_data, path)

    helpers.single_frame(path)
    # print(d)
    
    date = helpers.getDate() # Date of today
    currentClassAttendace = attendance.getAttendance(date, courseCode)
    currentClassAttendanceObj = loads(currentClassAttendace)

    markedAttendace =  helpers.findFaces(path, currentClassAttendanceObj)
    attendance.updateStudentAttendance(currentClassAttendanceObj[0]['_id'], markedAttendace)

    if os.path.exists(f'{path}.jpg'):
      os.remove(f'{path}.jpg')
    else:
      print("The file does not exist")

    completeAttendace = attendance.getAttendanceById(currentClassAttendanceObj[0]['_id'])
    completeAttendaceObj = loads(completeAttendace)
  
    for student in completeAttendaceObj['classAttendance']['allStudents']:
      student.pop('encodings')

    return dumps(completeAttendaceObj)

@app.route('/api/v1/attendance', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def getAttendance():
  if request.method == 'POST':
    attendance = Attendance(attendanceCollection)

    data = request.get_json()
    courseCode = data['courseCode']

    res = attendance.getAttendanceByCourseCode(courseCode)
    attendanceObj = loads(res)

    for att in attendanceObj:
      for student in att['classAttendance']['allStudents']:
        student.pop('encodings')

    return dumps(attendanceObj)

@app.route('/api/v1/attendance/update', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def getUpdateAttendance():
  if request.method == 'POST':
    attendance = Attendance(attendanceCollection)

    data = request.get_json()
    studentId = data['studentId']
    courseCode = data['courseCode']
    attendanceId = data['attendanceId']

    date = helpers.getDate()
    res = attendance.updateOne(courseCode, attendanceId, studentId, date)
    resObj = loads(res)
    
    for student in resObj[0]['classAttendance']['allStudents']:
      student.pop('encodings')

    return dumps(resObj)

@app.route('/api/v1/students', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def getStudents():
  if request.method == 'POST':
    student = Students(studentCollection)

    data = request.get_json()
    courseCode = data['courseCode']

    students = student.getStudentsForParticleCourse(courseCode)
    studentsObj = loads(students)
    for student in studentsObj:
      student.pop('encodings')

    return dumps(studentsObj)

@app.route('/api/v1/lecturer/signup', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def addNewLecturer():
  if request.method == 'POST':
    lecturer = Lecturers(lecturerCollection)

    data = request.get_json()
    name  = data['name']
    email  = data['email']
    courses = data['courses']
    password = data['password']

    firebase.createUser(email, password)
    obj = {'name': name, 'email': email, 'courses': courses}
    lecturer.addNewLecturer(obj)

    res = jsonify('New Lecturer added succesfully')
    return res

@app.route('/api/v1/lecturer/login', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def loginLecturer():
  if request.method == 'POST':
    lecturer = Lecturers(lecturerCollection)

    data = request.get_json()
    email  = data['email']
    password = data['password']

    user = firebase.login(email, password)
    lecturer = lecturer.getLecturerByEmail(email)
    res = {}
    res['user'] = lecturer
    res['token'] = user['idToken']
    return dumps(res)

@app.route('/api/v1/course', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def addNewCourse():
  if request.method == 'POST':
    course = Courses(courseCollection)

    data = request.get_json()
    courseName = data['courseName']
    courseCode = data['courseCode']

    obj = {'courseName': courseName, 'courseCode': courseCode}
    course.addNewCourse(obj)

    res = jsonify('New course added succesfully')
    return res

@app.route('/api/v1/courses', methods=["GET", "OPTIONS"])
@cross_origin(headers='Content-Type')
def getAllCourses():
  if request.method == 'GET':
    course = Courses(courseCollection)

    courses = course.getAllCourses()

    return courses

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)