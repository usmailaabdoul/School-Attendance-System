
let url = `http://127.0.0.1:5000/api/v1`;
let config = {
  method: 'POST',
  headers: {
    // 'Content-Type': 'multipart/form-data',
    'Content-Type': 'application/json',
  }
}

class FaceRecognitionApi {
  async addNewStudent() {
    try {
      let res = await this.api.get(`addNewStudent`)
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
}

const faceRecognitionApi = new FaceRecognitionApi();

export default faceRecognitionApi;
