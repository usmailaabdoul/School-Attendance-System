
let url = `http://127.0.0.1:5000/api/v1`;
let config = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}

class AttendanceApi {
  async getAttendance(obj) {
    try {
      let res = await fetch(`${url}/attendance`, {...config, body: JSON.stringify(obj)})

      res = res.json()
      return res
    } catch (e) {
      throw e
    }
  }

  async startAttendance(obj) {
    try {
      let res = await fetch(`${url}/startAttendance`, {...config, body: JSON.stringify(obj)})

      res = res.json()
      return res
    } catch (e) {
      throw e
    }
  }
}

const attendanceApi = new AttendanceApi();

export default attendanceApi;
