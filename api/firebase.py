import pyrebase
import pathlib

config =  {
    "apiKey": "AIzaSyBjSeDK_QDuJa9KNN-KFC08BzpaqHBMvvQ",
    "authDomain": "schoolattendance-b61bf.firebaseapp.com",
    "databaseURL": "https://schoolattendance-b61bf-default-rtdb.firebaseio.com",
    "projectId": "schoolattendance-b61bf",
    "storageBucket": "schoolattendance-b61bf.appspot.com",
    "messagingSenderId": "702337597143",
    "appId": "1:702337597143:web:0b03a5080effb5ce233a92"
  }

def createUser():
  email = 'ismaelabdul77@gmail.com'
  password = 'password123'

  firebase = pyrebase.initialize_app(config)
  auth = firebase.auth()
  auth.create_user_with_email_and_password(email, password)

def login():
  email = 'ismaelabdul77@gmail.com'
  password = 'password123'

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

  user = login()
  url = storage.child(f'profileImages/{name.name}').get_url(user['idToken'])
  
  return url

url = uploadImage('api/images/abdoul')
print(url)