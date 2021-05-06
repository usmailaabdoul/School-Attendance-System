import cv2
import numpy as np
import face_recognition
import os

path = 'src/family'
images = []
classNames = []
myList = os.listdir(path)

print(myList) 

for cl in  myList:
  curImg = cv2.imread(f'{path}/{cl}')
  images.append(curImg)
  classNames.append(os.path.splitext(cl)[0])

print(classNames)

def findEncodings(images):
  encodeList = []
  count = 1
  for img in images:
    print('something', count)
    count = count + 1
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encode = face_recognition.face_encodings(img)[0]
    encodeList.append(encode)
  return encodeList

encodeListKnown = findEncodings(images)

print('Encoding complete!!!')

cap = cv2.VideoCapture(0)

while True:
  success, img = cap.read()
  print('success', success)
  imgS = cv2.resize(img, (0,0), None, 0.25,0.25)
  imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

  print('about to get encodings')
  facesCurFrame = face_recognition.face_locations(imgS)
  encodeCurFrame = face_recognition.face_encodings(imgS)
  print('finished getting encodings')

  for encodeFace, faceLoc in zip(encodeCurFrame, facesCurFrame):
    matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
    faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
    # print(faceDis)
    matchIndexPosition = np.argmin(faceDis)
    matchIndexValue = min(faceDis)
    print('min ele', matchIndexValue, matchIndexPosition)

    if (matchIndexValue < 0.5 ) and (matches[matchIndexPosition]):
      name = classNames[matchIndexPosition].upper()
      print(name)
      y1, x2, y2, x1 = faceLoc
      y1, x2, y2, x1 =  y1* 4, x2 * 4, y2 * 4, x1 * 4

      cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
      cv2.rectangle(img, (x1, y2-35), (x2, y2), (0, 255, 0), cv2.FILLED)
      cv2.putText(img, name, (x1+6, y2-6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
    else:
      y1, x2, y2, x1 = faceLoc
      y1, x2, y2, x1 =  y1* 4, x2 * 4, y2 * 4, x1 * 4

      cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 2)
      cv2.rectangle(img, (x1, y2-35), (x2, y2), (0, 0, 255), cv2.FILLED)
      cv2.putText(img, 'Unknown', (x1+6, y2-6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

  cv2.imshow('Webcam', img)
  cv2.waitKey(1)
