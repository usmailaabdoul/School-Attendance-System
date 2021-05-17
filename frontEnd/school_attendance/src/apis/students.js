const baseUrl = '/user'
export default class StudentsApi {
  constructor(api) {
    this.api = api
  }
  /**
   *
   *
   * @return {*} 
   * @memberof UserApi
   */
  async users() {
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
   * @param {*} id
   * @return {*} 
   * @memberof UserApi
   */
  async deleteUser(id) {
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
   * @memberof UserApi
   */
  async editUser(id, obj) {
    try {
      let res = await this.api.put(`${baseUrl}/${id}`, obj)
      return res.data
    } catch (e) {
      throw e
    }
  }

}