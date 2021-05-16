const baseUrl = '/auth'
export default class AuthApi {
  constructor(api) {
    this.api = api
  }
  /**
   * perfoms a user login to the api with the object
   *
   * @param {*} obj
   * @return {*} 
   * @memberof AuthApi
   */
  async login(obj) {
    try {
      let res = await this.api.post(`${baseUrl}/login`, obj)
      return res.data
    } catch (e) {
      throw e
    }
  }
  
  /**
   * perfoms a user registration process to the api with their information
   *
   * @param {*} obj
   * @return {*} 
   * @memberof AuthApi
   */
  async register(obj) {
    try {
      let res = await this.api.post(`${baseUrl}/register`, obj)
      return res.data
    } catch (e) {
      throw e
    }
  }
}