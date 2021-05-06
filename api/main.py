from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from PIL import Image

from students import Students
import helpers

import cv2
import numpy as np
import face_recognition

app = Flask(__name__)
CORS(app, support_credentials=True)

app.config["MONGO_URI"] = "mongodb://localhost:27017/university"
mongo = PyMongo(app)

studentCollection = mongo.db.students

@app.route('/addNewStudent', methods=["POST"])
def addNewStudent():
  if request.method == 'POST':
    student = Students(studentCollection)

    name  = request.args.get('name', None)
    matricule  = request.args.get('matricule', None)

    path = f'api/images/{name}'

    file = request.files['image']
    file.save(f'{path}.jpg')
    
    encodings = helpers.getEncodings(path)

    string_ints = [str(int) for int in encodings]
    encodingsStr = ",".join(string_ints)

    obj = {'name': name, 'matricule': matricule, 'encodings': encodingsStr}
    student = student.addNewStudent(obj)

    res = jsonify('New student added succesfully')
    res.status_code = 200
    res.student = student

    return res

@app.route('/findFaces', methods=["POST"])
def findFaces():
  if request.method == 'POST':

    file = request.files['image']
    img = Image.open(file)
    
    student = Students(studentCollection)
    students = student.getStudentsForParticleCourse({id: 1}) # get students for a particlelar course

    # singleStudent = student.getStudent('6086e2dc9f746c11e3573b3b')
    # singleStudentEncodings = helpers.returnSingleEncoding(singleStudent)

    foundFaces = helpers.findFaces(img, students)

    return foundFaces

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)