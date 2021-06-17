import pyrebase
import pathlib
import datetime
import os

config =  {
    "apiKey": "AIzaSyBjSeDK_QDuJa9KNN-KFC08BzpaqHBMvvQ",
    "authDomain": "schoolattendance-b61bf.firebaseapp.com",
    "databaseURL": "https://schoolattendance-b61bf-default-rtdb.firebaseio.com",
    "projectId": "schoolattendance-b61bf",
    "storageBucket": "schoolattendance-b61bf.appspot.com",
    "messagingSenderId": "702337597143",
    "appId": "1:702337597143:web:0b03a5080effb5ce233a92"
  }

def createUser(email, password):
  firebase = pyrebase.initialize_app(config)
  auth = firebase.auth()
  auth.create_user_with_email_and_password(email, password)

def login(email, password):
  firebase = pyrebase.initialize_app(config)
  auth = firebase.auth()
  user = auth.sign_in_with_email_and_password(email, password)
  
  return user

def uploadImage(path):
  firebase = pyrebase.initialize_app(config)
  storage = firebase.storage()
  
  name = pathlib.PurePath(f'{path}')
  image = f'{path}.jpg' 
  storage.child(f'profileImages/{name.name}').put(image)

  email = 'ismaelabdul77@gmail.com'
  password = 'password123'
  user = login(email, password)
  url = storage.child(f'profileImages/{name.name}').get_url(user['idToken'])
  
  return url

def uploadUnknownStudents(path):
  firebase = pyrebase.initialize_app(config)
  storage = firebase.storage()
  
  name = datetime.datetime.now()
  storage.child(f'unknownStudents/{name}').put(path)

  email = 'ismaelabdul77@gmail.com'
  password = 'password123'
  user = login(email, password)
  url = storage.child(f'unknownStudents/{name}').get_url(user['idToken'])
  
  if os.path.exists(f'{path}'):
    os.remove(f'{path}')
  else:
    print("The file does not exist")

  return url