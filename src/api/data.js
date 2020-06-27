import axios from '@/libs/api.request'
import $store from '@/store/module/user'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}

export const createGoods = getData => {
  return axios.request({
    url: '/api/backend/good/createGoods.json',
    method: 'post',
    headers: {
      Authorization: $store.state.tokenType + ' ' + $store.state.token
    },
    data: getData
  })
}

export const releaseArticle = data => {
  return axios.request({
    url: '/api/backend/article/release.json',
    method: 'post',
    headers: {
      Authorization: $store.state.tokenType + ' ' + $store.state.token
    },
    data: data
  })
}

export const findArticles = data => {
  return axios.request({
    url: '/api/backend/article/findArticlesColumnListByCondition.json',
    method: 'post',
    headers: {
      Authorization: $store.state.tokenType + ' ' + $store.state.token
    },
    data: data
  })
}
