from bson.json_util import dumps
from bson.json_util import ObjectId

class Lecturers():
  def __init__(self, lecturerCollection):
    self.lecturerCollection = lecturerCollection

  def addNewLecturer(self, obj):
    lecturerId = self.lecturerCollection.insert(obj)
    lecturer = self.lecturerCollection.find_one({'_id': ObjectId(lecturerId)})
    lecturer = dumps(lecturer)

    return lecturer

  def getLecturer(self, id):
    lecturer = self.lecturerCollection.find_one({'_id': ObjectId(id)})
    lecturer = dumps(lecturer)
    # print('lecturer', lecturer)
    
    return lecturer
