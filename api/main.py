from cv2 import data
from flask import Flask, request, jsonify
from bson.json_util import dumps, loads
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo

import base64
import os

from students import Students
import helpers

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/university"
app.config["CORS_HEADERS"] = "Content-Type"

mongo = PyMongo(app)

studentCollection = mongo.db.students

@app.route('/api/v1/test', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def test():
  res = jsonify('You are able to connect to the server')
  return res

@app.route('/api/v1/addNewStudent', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
@cross_origin()
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

    imgdata = base64.b64decode(img_data)
    path = f'api/images/{matricule}'

    with open(f'{path}.jpg', 'wb') as f:
      f.write(imgdata)
    
    encodings = helpers.getEncodings(path)

    string_ints = [str(int) for int in encodings]
    encodingsStr = ",".join(string_ints)

    obj = {'name': name, 'matricule': matricule, 'email': email, 'encodings': encodingsStr, 'courses': courses, 'faculty': faculty}
    student = student.addNewStudent(obj)

    res = jsonify('New student added succesfully')
    return res

@app.route('/api/v1/findFaces', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
def findFaces():
  if request.method == 'POST':
    data = request.get_json()

    img_data = data['image']

    imgdata = base64.b64decode(img_data)
    path = f'api/currentFrame/imageFrame'

    with open(f'{path}.jpg', 'wb') as f:
      f.write(imgdata)
    
    student = Students(studentCollection)
    students = student.getStudentsForParticleCourse({id: 1}) # get students for a particlelar course

    # singleStudent = student.getStudent('6086e2dc9f746c11e3573b3b')
    # singleStudentEncodings = helpers.returnSingleEncoding(singleStudent)

    foundFaces = helpers.findFaces(path, students)

    if os.path.exists(f'{path}.jpg'):
      os.remove(f'{path}.jpg')
    else:
      print("The file does not exist")
    return foundFaces

@app.route('/api/v1/addLecturer', methods=["POST", "OPTIONS"])
@cross_origin(headers='Content-Type')
@cross_origin()
def addNewStudent():
  if request.method == 'POST':
    student = Students(studentCollection)

    data = request.get_json()
    name  = data['name']
    email  = data['email']
    courseName = data['courseName']
    courseCode = data['courseCode']

    obj = {'name': name, 'email': email, 'courseName': courseName, 'courseCode': courseCode}
    student = student.addNewStudent(obj)

    res = jsonify('New Lecturer added succesfully')
    return res

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)