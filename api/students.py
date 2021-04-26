from bson.json_util import dumps
from bson.json_util import ObjectId

class Students():
  def __init__(self, studentCollection):
    self.studentCollection = studentCollection

  def addNewStudent(self, obj):
    studentId = self.studentCollection.insert(obj)
    student = self.studentCollection.find_one({'_id': ObjectId(studentId)})
    student = dumps(student)

    return student

  def getStudent(self, id):
    student = self.studentCollection.find_one({'_id': ObjectId(id)})
    student = dumps(student)
    print('student', student)
    
    return student
