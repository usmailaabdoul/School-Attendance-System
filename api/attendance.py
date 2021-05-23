from bson.json_util import dumps, loads
from bson.json_util import ObjectId

class Attendance():
  def __init__(self, attendanceCollection):
    self.attendanceCollection = attendanceCollection

  def addNewAttendance(self, obj):
    attendanceId = self.attendanceCollection.insert(obj)
    attendance = self.attendanceCollection.find_one({'_id': ObjectId(attendanceId)})
    attendance = dumps(attendance)

    return attendance

  def getAttendanceById(self, id):
    attendance = self.attendanceCollection.find_one({'_id': ObjectId(id)})
    attendance = dumps(attendance)
    
    return attendance

  def getAttendance(self, date, courseCode):
    attendance = self.attendanceCollection.find({'$and': [{'date': {'$eq': date}}, {'courseCode': {'$eq': courseCode}}] })
    attendance = dumps(attendance)
    
    return attendance
  
  def updateStudentAttendance(self, id, obj):
    classAttendance = {'allStudents': obj, 'unknownStudents': []}
    query = {'_id': ObjectId(id)}
    newValues = { "$set": { "classAttendance": classAttendance } }

    attendance = self.attendanceCollection.update_one(query, newValues)
    
    return attendance
