import cv2
import face_recognition

def getEncodings(path):
  image = cv2.imread(f'{path}.jpg')
  cvImage = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
  encode = face_recognition.face_encodings(cvImage)[0]
  
  return encode

