import axios from '@/libs/api.request'

export const login = ({ account, passWord, loginType }) => {
  const data = {
    account,
    passWord,
    loginType
  }
  return axios.request({
    url: '/api/front/member/login.json',
    headers: {
      Authorization: 'Basic TW9iaWxlOkFuZHJvaWQtSU9T',
      'Content-Type': 'application/json'
    },
    data,
    method: 'post'
  })
}

export const getUserInfo = (tokenType, token) => {
  return axios.request({
    url: '/api/front/member/findMember.json', // /api/front/member/findMember.json
    headers: {
      Authorization: tokenType + ' ' + token
    },
    method: 'POST'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
