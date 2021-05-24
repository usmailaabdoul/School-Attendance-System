import cv2
import numpy as np
import face_recognition
import datetime
import base64

from bson.json_util import loads, dumps

from PIL import Image

def getEncodings(path):
  image = cv2.imread(f'{path}.jpg')
  cvImage = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
  encodings = face_recognition.face_encodings(cvImage)[0]
  
  return encodings

def returnEncodings(currentClassAttendace):
  encodeList = []
  students = currentClassAttendace[0]['classAttendance']['allStudents']

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


def findFaces(path, currentClassAttendanceObj):
  image = cv2.imread(f'{path}.jpg')
  imgS = cv2.resize(image, (0,0), None, 0.25,0.25)
  imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

  facesCurFrame = face_recognition.face_locations(imgS)
  encodeCurFrame = face_recognition.face_encodings(imgS)

  encodeListKnown = returnEncodings(currentClassAttendanceObj)

  foundFaces = []
  students = currentClassAttendanceObj[0]['classAttendance']['allStudents']

  for encodeFace, faceLoc in zip(encodeCurFrame, facesCurFrame):
    matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
    faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)

    matchIndexPosition = np.argmin(faceDis)
    matchIndexValue = min(faceDis)

    if (matchIndexValue < 0.5 ) and (matches[matchIndexPosition]):
      y1, x2, y2, x1 = faceLoc
      y1, x2, y2, x1 =  y1* 4, x2 * 4, y2 * 4, x1 * 4

      students[matchIndexPosition]['present'] = True
      # students[matchIndexPosition]['faceLocation'] = {'y1': y1, 'x2': x2, 'y2': y2, 'x1': x1}
      # found = {"student": studentsObj[matchIndexPosition], "faceLocation": {'y1': y1, 'x2': x2, 'y2': y2, 'x1': x1}}
      # foundFaces.append(found)
      
    else:
      y1, x2, y2, x1 = faceLoc
      y1, x2, y2, x1 =  y1* 4, x2 * 4, y2 * 4, x1 * 4

      # unknown = {"unknownStudent": currentClassAttendanceObj[matchIndexPosition], "faceLocation": {'y1': y1, 'x2': x2, 'y2': y2, 'x1': x1}}
      # foundFaces.append(unknown)

  return students

def getDate():
  date = datetime.datetime.now().date() # Date of today
  date = f'{date}'

  return date

def base64toImg(img_data, path):
  imgdata = base64.b64decode(img_data)

  with open(f'{path}.jpg', 'wb') as f:
    f.write(imgdata)
