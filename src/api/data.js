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
    data: getData
  })
}

export const releaseArticle = data => {
  return axios.request({
    url: '/api/backend/article/release.json',
    method: 'post',
    data: data
  })
}

export const findArticles = data => {
  return axios.request({
    url: '/api/backend/article/findArticlesColumnListByCondition.json',
    method: 'post',
    data: data
  })
}

export const findGoodsPage = data => {
  return axios.request({
    url: '/api/backend/good/findBackEndGoodsPageResult.json',
    method: 'post',
    data: data
  })
}

export const goodsGrounding = data => {
  return axios.request({
    url: '/api/backend/good/goodsGrounding.json',
    method: 'post',
    data: data
  })
}

export const deleteGoods = data => {
  return axios.request({
    url: '/api/backend/good/deleteGoods.json',
    method: 'post',
    data: data
  })
}

export const findIntegral = data => {
  return axios.request({
    url: '/api/backend/member/findBackEndIntegralRecordPage.json',
    method: 'post',
    data: data
  })
}

export const findIntegralDetailed = data => {
  return axios.request({
    url: '/api/backend/member/findBackEndIntegralDetailed.json',
    method: 'post',
    data: data
  })
}

export const findArticlesResult = data => {
  return axios.request({
    url: '/api/backend/article/findArticlesBackEndResult.json',
    method: 'post',
    data: data
  })
}

export const setGroundingType = data => {
  return axios.request({
    url: '/api/backend/article/setGroundingType.json',
    method: 'post',
    data: data
  })
}

export const deleteArticles = data => {
  return axios.request({
    url: '/api/backend/article/deleteBackEndArticle.json',
    method: 'post',
    data: data
  })
}
// /api/backend/article/findArticlesColumnListByCondition.json
// export const 

export const findBackEndGoods = data => {
  return axios.request({
    url: '/api/backend/good/findBackEndGoodsById.json',
    method: 'post',
    data: data
  })
}

export const updateGoods = data => {
  return axios.request({
    url: '/api/backend/good/updateGoods.json',
    method: 'post',
    data: data
  })
}

export const labelReviewPage = data => {
  return axios.request({
    url: '/api/backend/member/findMemberLabelReviewPage.json',
    method: 'post',
    data: data
  })
}

export const upload = data => {
  return axios.request({
    url: '/api/obs/upload.json',
    method: 'post',
    data: data
  })
}

export const getChartBackEndRoom = data => {
  return axios.request({
    url: '/api/backend/message/getChartBackEndRoom.json',
    method: 'post',
    data: data
  })
}

export const findSystemMessage = data => {
  return axios.request({
    url: '/api/backend/message/findSystemMessagePageByCondition.json',
    method: 'post',
    data: data
  })
}

export const findArticlesDetails = data => {
  return axios.request({
    url: '/api/backend/article/findBackEndArticlesDetails.json',
    method: 'post',
    data: data
  })
}

export const findBackEndComment = data => {
  return axios.request({
    url: '/api/backend/article/findBackEndCommentList.json',
    method: 'post',
    data: data
  })
}

export const findBackEndArticle = data => {
  return axios.request({
    url: '/api/backend/article/findBackEndArticleList.json',
    method: 'post',
    data: data
  })
}

export const findBackEndOrder = data => {
  return axios.request({
    url: '/api/backend/good/findBackEndOrderPage.json',
    method: 'post',
    data: data
  })
}
// 审核领域标签是否通过
export const passOrNot = data => {
  return axios.request({
    url: '/api/backend/member/passOrNot.json',
    method: 'post',
    data: data
  })
}
// 用户查询列表
export const findPageByCondition = data => {
  return axios.request({
    url: '/api/backend/member/findPageByCondition.json',
    method: 'post',
    data: data
  })
}

// 领域标签详情头部
export const findMemberLabelReviewById = data => {
  return axios.request({
    url: '/api/backend/member/findMemberLabelReviewById.json',
    method: 'post',
    data: data
  })
}
// 领域标签详情根据用户id 查询用户发布文章列表
export const findBackEndArticlesPageByCondition = data => {
  return axios.request({
    url: '/api/backend/article/findBackEndArticlesPageByCondition.json',
    method: 'post',
    data: data
  })
}
//修改用户资料
export const userUpdate = data => {
  return axios.request({
    url: '/api/backend/member/update.json',
    method: 'post',
    data: data
  })
}
// 是否禁用账户
export const setMemberDisable = data => {
  return axios.request({
    url: '/api/backend/member/setMemberDisable.json',
    method: 'post',
    data: data
  })
}
// 积分获取
export const findBackEndIntegralAcquisition = data => {
  return axios.request({
    url: '/api/backend/member/findBackEndIntegralAcquisition.json',
    method: 'post',
    data: data
  })
}
// 用户反馈列表
export const findByNickName = data => {
  return axios.request({
    url: '/api/backend/help/findByNickName.json',
    method: 'post',
    data: data
  })
}
// 爆料审核
export const informationExamine = data => {
  return axios.request({
    url: '/api/backend/article/informationExamine.json',
    method: 'post',
    data: data
  })
}
// 举报列表
export const findReportBackEndList = data => {
  return axios.request({
    url: '/api/backend/article/findReportBackEndList.json',
    method: 'post',
    data: data
  })
}
// 订单详情
export const findBackEndOrderById = data => {
  return axios.request({
    url: '/api/backend/good/findBackEndOrderById.json',
    method: 'post',
    data: data
  })
}