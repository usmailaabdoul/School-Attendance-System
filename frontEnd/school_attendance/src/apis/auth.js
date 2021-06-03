
let url = `http://127.0.0.1:5000/api/v1`;
let config = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}

class StudentsApi {
  async login(obj) {
    try {
      let res = await fetch(`${url}/lecturer/login`, {...config, body: JSON.stringify(obj)})

      res = res.json()
      return res
    } catch (e) {
      throw e
    }
  }

  async register(obj) {
    try {
      let res = await fetch(`${url}/lecturer/signup`, {...config, body: JSON.stringify(obj)})

      res = res.json()
      return res
    } catch (e) {
      throw e
    }
  }
}

const studentsApi = new StudentsApi();

export default studentsApi;
