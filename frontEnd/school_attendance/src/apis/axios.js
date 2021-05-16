import axios from 'axios';

let instance = null;
const baseURL = 'https://carnaproject-api.herokuapp.com/api/v1/'

/**
 *
 *
 * @export
 * @param {*} token
 * @return {*} 
 */
export function getApi(token) {
  instance = axios.create({
    baseURL: baseURL,
    timeout: 0,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return instance;
}
