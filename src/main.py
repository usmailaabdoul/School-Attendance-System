import cv2
import numpy as np
import face_recognition

imgAbdoul = face_recognition.load_image_file('src/images/abdoul.jpg')
imgAbdoul = cv2.cvtColor(imgAbdoul, cv2.COLOR_BGR2RGB)

imgTest = face_recognition.load_image_file('src/imageAttendance/chadwick.jpg')
imgTest = cv2.cvtColor(imgTest, cv2.COLOR_BGR2RGB)

faceLoc = face_recognition.face_locations(imgAbdoul)[0]
encodeAbdoul = face_recognition.face_encodings(imgAbdoul)[0]
cv2.rectangle(imgAbdoul, (faceLoc[3], faceLoc[0]), (faceLoc[1], faceLoc[2]), (255,0,255), 3)

faceLocTest = face_recognition.face_locations(imgTest)[0]
encodeTest = face_recognition.face_encodings(imgTest)[0]
cv2.rectangle(imgTest, (faceLocTest[3], faceLocTest[0]), (faceLocTest[1], faceLocTest[2]), (255,0,255), 3)

results = face_recognition.compare_faces([encodeAbdoul], encodeTest)
faceDist = face_recognition.face_distance([encodeAbdoul], encodeTest)

print(results, faceDist)

cv2.putText(imgTest, f'{results} {round(faceDist[0], 2)}', (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (0,0,255), 2)

cv2.imshow('Abdoul 1', imgAbdoul)
cv2.imshow('test', imgTest)

cv2.waitKey(0)