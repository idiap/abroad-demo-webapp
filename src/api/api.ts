// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import axios, { AxiosInstance } from 'axios'

const engineUrl = 'http://localhost:8890/sparql/'

const api: AxiosInstance = axios.create({
  baseURL: engineUrl
})

api.interceptors.request.use(async config => {
  config.headers['Access-Control-Allow-Origin'] = '*'
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  config.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401 || error.response.status === 403) {
      window.location.href = '/';
    } else {
      return Promise.reject(error)
    }
  }
)

export default api
