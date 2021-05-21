from bson.json_util import dumps
from bson.json_util import ObjectId

class Courses():
  def __init__(self, courseCollection):
    self.courseCollection = courseCollection

  def addNewCourse(self, obj):
    courseId = self.courseCollection.insert(obj)
    course = self.courseCollection.find_one({'_id': ObjectId(courseId)})
    course = dumps(course)

    return course

  def getCourse(self, id):
    course = self.courseCollection.find_one({'_id': ObjectId(id)})
    course = dumps(course)
    # print('course', course)
    
    return course
