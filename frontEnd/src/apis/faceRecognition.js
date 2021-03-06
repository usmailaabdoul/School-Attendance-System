
let url = `http://127.0.0.1:5000/api/v1`;
let config = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}

class FaceRecognitionApi {
  async addNewStudent(form) {
    try {
      let res = await fetch(`${url}/addNewStudent`, {...config, body: JSON.stringify(form)})
      return res.data
    } catch (e) {
      throw e
    }
  }

  async findFaces(form) {
    try {
      let res = await fetch(`${url}/findFaces`, {...config, body: JSON.stringify(form)})

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

  async getSingleFrame() {
    let url = 'http://127.0.0.1:5000/api/v1/singleFrame'
    try {
    let res = await fetch(url, {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    console.log({ res })
    res = res.json()
  } catch (e) {
    console.log({ e })
  }
    // .then(function(response) {
    //   return response.json();
    // })
    // .then(function(data) {
    //   return data
    // })
    // .catch((e) => {
    //   console.log({e})
    // })
  }
}

const faceRecognitionApi = new FaceRecognitionApi();

export default faceRecognitionApi;
