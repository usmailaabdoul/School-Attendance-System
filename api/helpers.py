import cv2
import numpy as np
import face_recognition

from flask import jsonify
from bson.json_util import loads, dumps
from collections import OrderedDict
from students import Students
from PIL import Image

def getEncodings(path):
  image = cv2.imread(f'{path}.jpg')
  cvImage = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
  encodings = face_recognition.face_encodings(cvImage)[0]
  
  return encodings

def returnEncodings(students):
  encodeList = []
  for student in students:
    convert = student['encodings'].split(',')
    encodings = [float(string) for string in convert]
    arr = np.array(encodings)
    encodeList.append(arr)

  return encodeList

def returnSingleEncoding(student):
  studentObj = loads(student)

  convert = studentObj['encodings'].split(',')
  encodings = [float(string) for string in convert]
  arr = np.array(encodings)
  return arr


def findFaces(path, students):
  image = cv2.imread(f'{path}.jpg')
  imgS = cv2.resize(image, (0,0), None, 0.25,0.25)
  # imgS = cv2.resize(np.array(path), (0,0), None, 0.25,0.25)
  imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

  facesCurFrame = face_recognition.face_locations(imgS)
  encodeCurFrame = face_recognition.face_encodings(imgS)

  studentsObj = loads(students)
  encodeListKnown = returnEncodings(studentsObj)

  foundFaces = []

  for encodeFace, faceLoc in zip(encodeCurFrame, facesCurFrame):
    matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
    faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
    print(faceDis)
    matchIndexPosition = np.argmin(faceDis)
    matchIndexValue = min(faceDis)
    print('min ele', matchIndexValue, matchIndexPosition)
    print('matches', matches[matchIndexPosition])

    if (matchIndexValue < 0.5 ) and (matches[matchIndexPosition]):
      foundFaces.append(studentsObj[matchIndexPosition])
      # print('found person', studentsObj[matchIndexPosition])
      y1, x2, y2, x1 = faceLoc
      y1, x2, y2, x1 =  y1* 4, x2 * 4, y2 * 4, x1 * 4

      print('found faces', {y1, x2, y2, x1})
      
    else:
      y1, x2, y2, x1 = faceLoc
      y1, x2, y2, x1 =  y1* 4, x2 * 4, y2 * 4, x1 * 4

      print('not found faces', {y1, x2, y2, x1})

  # message = [{'message': 'no students where adjust camera angle of bring camera closer'}]
  return dumps(foundFaces)
