import axios from 'axios'

// axios 配置 - 主机域名
const HOST_LOCAL = 'http://127.0.0.1:8080'
const HOST_PRODUCTION = 'https://api.liu.pelab.link'
const HOST_CAI = 'https://api.cai.pelab.link'

// 依据条件判断主机域名
export function get_host() {
  if (location.href.indexOf('liu') > 0) {
    return HOST_PRODUCTION
  }
  if (location.href.indexOf('cai') > 0) {
    return HOST_CAI
  }
  return HOST_LOCAL
}

// get请求
export function get(url: string, params?: any, config?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get(get_host() + url, { params, ...config })
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data)
        } else {
          reject(response)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// post请求
export function post(url: string, data?: any, config?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(get_host() + url, data, config)
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data)
        } else {
          reject(response)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
