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
// 获取客服消息列表
export const getChartBackEndRoom = data => {
  return axios.request({
    url: '/api/backend/message/findChatRoomAll.json',
    method: 'post',
    data: data
  })
}

export const findSystemMessage = data => {
  return axios.request({
    url: '/api/backend/message/findBackEndSystemMessagePageByCondition.json',
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
// 评论列表一级评论
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
// 添加修改栏目
export const addArticlesColumn = data => {
  return axios.request({
    url: '/api/backend/article/addArticlesColumn.json',
    method: 'post',
    data: data
  })
}
// 回复评论或子评论
export const articlesCommentOrReplay = data => {
  return axios.request({
    url: '/api/backend/article/articlesCommentOrReplay.json',
    method: 'post',
    data: data
  })
}
// 查询子评论
export const findBackEndReplyList = data => {
  return axios.request({
    url: '/api/backend/article/findBackEndReplyList.json',
    method: 'post',
    data: data
  })
}
// 删除系统通知
export const deleteComment = data => {
  return axios.request({
    url: '/api/backend/article/deleteComment.json',
    method: 'post',
    data: data
  })
}
// 发货
export const deliverGoods = data => {
  return axios.request({
    url: '/api/backend/good/deliverGoods.json',
    method: 'post',
    data: data
  })
}
// 取消发货
export const cancelGoods = data => {
  return axios.request({
    url: '/api/backend/good/cancelGoods.json',
    method: 'post',
    data: data
  })
}
// 积分规则设置
export const updateSchedule = data => {
  return axios.request({
    url: '/api/backend/schedule/updateSchedule.json',
    method: 'post',
    data: data
  })
}
// 积分规则设置页面查询
export const findSchedule = data => {
  return axios.request({
    url: '/api/backend/schedule/findSchedule.json',
    method: 'post',
    data: data
  })
}
// 查询客服列表
export const findCustomerListByCondition = data => {
  return axios.request({
    url: '/api/backend/message/findCustomerListByCondition.json',
    method: 'post',
    data: data
  })
}
// 修改客服信息
export const updateCustomer = data => {
  return axios.request({
    url: '/api/backend/message/updateCustomer.json',
    method: 'post',
    data: data
  })
}
// 添加系统通知
export const createSystemMessage = data => {
  return axios.request({
    url: '/api/backend/message/createSystemMessage.json',
    method: 'post',
    data: data
  })
}
// 删除被举报评论 
export const commentDetelePushSystemMessage = data => {
  return axios.request({
    url: '/api/backend/article/commentDetelePushSystemMessage.json',
    method: 'post',
    data: data
  })
}
// 获取聊天记录
export const findChatRecordPageByCondition = data => {
  return axios.request({
    url: '/api/backend/message/findChatRecordPageByCondition.json',
    method: 'post',
    data: data
  })
}
// 获取帮助详情
export const findHelpBackEndResultPage = data => {
  return axios.request({
    url: '/api/backend/help/findHelpBackEndResultPage.json',
    method: 'post',
    data: data
  })
}
// 获取帮助详情
export const findHelpById = data => {
  return axios.request({
    url: '/api/backend/help/findHelpById.json',
    method: 'post',
    data: data
  })
}
// 新增/修改帮助
export const createOrUpdateHelp = data => {
  return axios.request({
    url: '/api/backend/help/createOrUpdateHelp.json',
    method: 'post',
    data: data
  })
}
// 查询问题分类
export const findProblemTypeListByCondition = data => {
  return axios.request({
    url: '/api/backend/help/findProblemTypeListByCondition.json',
    method: 'post',
    data: data
  })
}
// 新增修改问题分类
export const createOrUpdateProblem = data => {
  return axios.request({
    url: '/api/backend/help/createOrUpdateProblem.json',
    method: 'post',
    data: data
  })
}
// 添加物流信息
export const createLogistics = data => {
  return axios.request({
    url: '/api/backend/good/createLogistics.json',
    method: 'post',
    data: data
  })
}
// 举报列表上下架文章
export const articlesGroundingPushSystemMessage = data => {
  return axios.request({
    url: '/api/backend/article/articlesGroundingPushSystemMessage.json',
    method: 'post',
    data: data
  })
}
// 反馈详情
export const findById = data => {
  return axios.request({
    url: '/api/backend/help/findById.json',
    method: 'post',
    data: data
  })
}
// 获取私信未读数量
export const getChartUnReadCount = data => {
  return axios.request({
    url: '/api/backend/message/getChartUnReadCount.json',
    method: 'post',
    data: data
  })
}
// 获取客服列表
export const getBackEndCustomer = data => {
  return axios.request({
    url: '/api/backend/member/getBackEndCustomer.json',
    method: 'post',
    data: data
  })
}
// 退出登录
export const loginOut = data => {
  return axios.request({
    url: '/api/front/member/loginOut.json',
    method: 'post',
    data: data
  })
}
// 设置置顶
export const setArticlesTop = data => {
  return axios.request({
    url: '/api/backend/article/setArticlesTop.json',
    method: 'post',
    data: data
  })
}
// 取消置顶
export const cancelArticlesTop = data => {
  return axios.request({
    url: '/api/backend/article/cancelArticlesTop.json',
    method: 'post',
    data: data
  })
}