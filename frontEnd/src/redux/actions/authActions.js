import {SET_TOKEN, SET_USER} from '../types';

export /**
 *
 *
 * @param {*} token
 * @return {*} 
 */
const setToken = (token) => {
  return {
      type: SET_TOKEN,
      payload: token,
  }
}

export /**
 *
 *
 * @param {*} user
 * @return {*} 
 */
const setUser = (user) => {
  return {
      type: SET_USER,
      payload: user,
  }
}