from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from PIL import Image

import os
import cv2
import numpy as np

import cv2
import face_recognition

from students import Students
import helpers

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

    convert = encodingsStr.split(',') #convert encodings to arrays
    val = [float(string) for string in convert] #convert encodings to arrays

    # return jsonify({'msg': 'success', 'size': [img.width, img.height], 'name': name, 'matricule': matricule})
    obj = {'name': name, 'matricule': matricule, 'encodings': encodingsStr}
    student = student.addNewStudent(obj)

    res = jsonify('New student added succesfully')
    res.status_code = 200
    res.student = student

    return res

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)