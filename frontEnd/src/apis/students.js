
let url = `http://127.0.0.1:5000/api/v1`;
let config = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}

class StudentsApi {
  async getStudents(obj) {
    try {
      let res = await fetch(`${url}/students`, {...config, body: JSON.stringify(obj)})

      res = res.json()
      return res
    } catch (e) {
      throw e
    }
  }
}

const studentsApi = new StudentsApi();

export default studentsApi;
