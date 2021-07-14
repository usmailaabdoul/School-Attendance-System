import cv2
import numpy as np
import face_recognition
import datetime
import base64

from bson.json_util import loads

source = "rtsp://admin:1234@192.168.1.217:554/stream1"
cap = cv2.VideoCapture(source)

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
  # imgS = cv2.resize(image, (0,0), None, 0,0.25)
  imgS = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

  facesCurFrame = face_recognition.face_locations(imgS)
  encodeCurFrame = face_recognition.face_encodings(imgS)

  encodeListKnown = returnEncodings(currentClassAttendanceObj)

  students = currentClassAttendanceObj[0]['classAttendance']['allStudents']
  unknownStudents = currentClassAttendanceObj[0]['classAttendance']['unknownStudents']

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

      # crop_img = image[y1:y2,x1:x2]
      # path = f'api/unknownStudents/tempImg.jpg'

      # cv2.imwrite(path, crop_img)
      # url = firebase.uploadUnknownStudents(path)
      # std = {'url': url}
      # unknownStudents.append(std)
      
      # print(url)
      # unknown = {"unknownStudent": currentClassAttendanceObj[matchIndexPosition], "faceLocation": {'y1': y1, 'x2': x2, 'y2': y2, 'x1': x1}}
      # foundFaces.append(unknown)

  attendance = {'allStudents': students, 'unknownStudents': unknownStudents}
  return attendance

def getDate():
  date = datetime.datetime.now().date() # Date of today
  date = f'{date}'

  return date

def base64toImg(img_data, path):
  imgdata = base64.b64decode(img_data)

  with open(f'{path}.jpg', 'wb') as f:
    f.write(imgdata)

def gen_frames():
  while True:
    success, frame = cap.read()

    if not success:
        break
    else:
      if frame.shape:
        frame = cv2.resize(frame, (760,480))

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def single_frame(path):
  source2 = "rtsp://admin:1234@192.168.1.217:554/stream2"
  cap2 = cv2.VideoCapture(source2)
  # dataUrl = ''
  while cap2.isOpened():
    ret, frame = cap2.read()

    if (ret != True):
        break
    else:
      filename = f'{path}.jpg'
      cv2.imwrite(filename, frame)

      # with open(filename, "rb") as img_file:
      #   dataUrl = base64.b64encode(img_file.read())
    cap2.release()
    # dataUrl.decode('utf-8')
    return 