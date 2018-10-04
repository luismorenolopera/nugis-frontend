import axios from 'axios'

var token = null
if (localStorage.token) {
  token = `Token ${localStorage.token}`
}

export const HTTP = axios.create({
  baseURL: `http://nugis.ddns.net/`,
  headers: {
    Authorization: token
  }
})
