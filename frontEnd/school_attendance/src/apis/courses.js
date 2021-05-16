const baseUrl = '/course'
export default class CoursesApi {
  constructor(api) {
    this.api = api
  }
  /**
   *
   *
   * @return {*} 
   * @memberof CoursesApi
   */
  async courses() {
    try {
      let res = await this.api.get(`${baseUrl}s/`)
      return res.data
    } catch (e) {
      throw e
    }
  }
  /**
   *
   *
   * @param {*} obj
   * @return {*} 
   * @memberof CoursesApi
   */
  async addCourse(obj) {
    try {
      let res = await this.api.post(`${baseUrl}/`, obj)
      return res.data
    } catch (e) {
      throw e
    }
  }
  /**
   *
   *
   * @param {*} id
   * @return {*} 
   * @memberof CoursesApi
   */
  async deleteCourse(id) {
    try {
      console.log('request', `${baseUrl}/${id}`)
      let res = await this.api.delete(`${baseUrl}/${id}`)
      return res.data
    } catch (e) {
      throw e
    }
  }
  /**
   *
   *
   * @param {*} id
   * @param {*} obj
   * @return {*} 
   * @memberof CoursesApi
   */
  async editCourse(id, obj) {
    try {
      let res = await this.api.put(`${baseUrl}/${id}`, obj)
      return res.data
    } catch (e) {
      throw e
    }
  }

}