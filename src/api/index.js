import axios from 'axios'
import Qs from 'qs'
import store from 'STORE/index'

import {
  getAccessToken,
  removeAccessToken,
  cachedAdminInfo
} from 'API/cacheService'

import {
  IS_LOGIN,
  SHOW_TOKEN_ERROR
} from 'STORE/mutation-types'

/* eslint-disable */
const API_ROOT = 'http://localhost:8080'
const API_ROOT_DEV = 'http://localhost:8080'

/* eslint-enable */
axios.defaults.baseURL = (process.env.NODE_ENV === 'production' ? API_ROOT : API_ROOT_DEV)

axios.defaults.headers.Accept = 'application/json'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  if (config.url.indexOf('admin/') === 0) {
    if (getAccessToken()) {
      config.headers['accessToken'] = getAccessToken()
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  if (response.data.code < 0) {
    if (response.data.code === -4001) {
      // 清空登录信息
      removeAccessToken()
      cachedAdminInfo.delete()
      // // 弹出提示信息
      store.commit(SHOW_TOKEN_ERROR, true)
      // // 弹出登录窗口
      store.commit(IS_LOGIN, false)
    }
    let error = {
      msg: response.data.msg
    }
    return Promise.reject(error)
  }
  return response.data
}, function (error) {
  error = {
    msg: '请求出错'
  }
  return Promise.reject(error)
})

export default {
  /**
   * 管理员登录
   */
  adminLogin (params) {
    return axios.post('admin/login', Qs.stringify(params))
  },
  /**
   * 获取七牛token
   */
  getQiniuToken (withWater) {
    return axios.get('admin/qiniu/token', {
      params: {
        bucket: 'blogimg',
        withWater: withWater
      }
    })
  },
  /**
   * 上传图片到七牛
   */
  uploadToQiniu (params) {
    return axios.post('http://up-z2.qiniu.com', params, {
      headers: {
        'content-type': 'multipart/form-data'
      },
      withCredentials: false
    })
  },
  /**
   * 获取博客配置
   */
  getBlogConfig () {
    return axios.get('admin/webConfig')
  },
  /**
   * 修改博客配置
   */
  modifyBlogConfig (params) {
    return axios.post('admin/webConfig/modify', Qs.stringify(params))
  },
  /**
   * 获取 关于我 页面
   */
  getAboutMe () {
    return axios.get('admin/webConfig/getAbout')
  },
  /**
   * 修改 关于我 页面
   */
  modifyAboutMe (params) {
    return axios.post('admin/webConfig/modifyAbout', Qs.stringify(params))
  },
  /**
   * 获取首页面板显示的统计信息
   */
  getHomeStatistics () {
    return axios.get('admin/statistics/home')
  },
  /**
   * 获取系统日志
   */
  getSysLog (params) {
    return axios.get('admin/sys/log', {params: params})
  },
  /**
   * 添加分类
   */
  addCategory (categoryName) {
    return axios.post('admin/category/add', Qs.stringify({categoryName: categoryName}))
  },
  /**
   * 添加标签
   */
  addTag (tagName) {
    return axios.post('admin/tag/add', Qs.stringify({tagName: tagName}))
  },
  /**
   * 修改分类
   */
  modifyCategory (params) {
    return axios.post('admin/category/modify', Qs.stringify(params))
  },
  /**
   * 修改标签
   */
  modifyTag (params) {
    return axios.post('admin/tag/modify', Qs.stringify(params))
  },
  /**
   * 删除分类
   */
  deleteCategory (categoryId) {
    return axios.post('admin/category/delete', Qs.stringify({categoryId: categoryId}))
  },
  /**
   * 删除标签
   */
  deleteTag (tagId) {
    return axios.post('admin/tag/delete', Qs.stringify({tagId: tagId}))
  },
  /**
   * 获取分类列表
   */
  getCategoryList (params) {
    return axios.get('admin/category/list', {
      params: params
    })
  },
  /**
   * 获取标签列表
   */
  getTagList (params) {
    return axios.get('admin/tag/list', {
      params: params
    })
  },
  /**
   * 获取分类
   */
  getCategory (categoryId) {
    return axios.get('admin/category', {
      params: {
        categoryId: categoryId
      }
    })
  },
  /**
   * 获取标签
   */
  getTag (tagId) {
    return axios.get('admin/tag', {
      params: {
        tagId: tagId
      }
    })
  },
  /**
   * 保存文章
   */
  saveArticle (params) {
    return axios.post('admin/article/save', Qs.stringify(params))
  },
  /**
   * 发布文章
   */
  publishArticle (params) {
    return axios.post('admin/article/publish', Qs.stringify(params))
  },
  /**
   * 编辑文章
   */
  modifyArticle (params) {
    return axios.post('admin/article/modify', Qs.stringify(params))
  },
  /**
   * 删除文章
   */
  deleteArticle (articleId) {
    return axios.post('admin/article/delete', Qs.stringify({id: articleId}))
  },
  /**
   * 获取文章信息
   */
  getArticle (articleId) {
    return axios.get('admin/article/info', {
      params: {
        id: articleId
      }
    })
  },
  /**
   * 获取文章列表
   */
  getArticleList (params) {
    return axios.get('admin/article/list', {
      params: params
    })
  },
  /**
   * 获取友链列表
   */
  getFriendsList (params) {
    return axios.get('admin/friends/list', {
      params: params
    })
  },
  /**
   * 添加友链
   */
  addFriend (params) {
    return axios.post('admin/friends/add', Qs.stringify(params))
  },
  /**
   * 编辑友链
   */
  modifyFriend (params) {
    return axios.post('admin/friends/modify', Qs.stringify(params))
  },
  /**
   * 删除友链
   */
  deleteFriend (friendId) {
    return axios.post('admin/friends/delete', Qs.stringify({friendId: friendId}))
  },
  /**
   * 获取友链类型列表
   */
  getFriendTypeList () {
    return axios.get('admin/friends/typeList')
  },
  /**
   * 获取所有评论列表
   */
  getAllCommentsList (params) {
    return axios.get('admin/comments/alllist', {
      params: params
    })
  },
  /**
   * 获取文章评论列表
   */
  getComments (articleId) {
    return axios.get('admin/comments/list', {
      params: {
        articleId: articleId
      }
    })
  },
  /**
   * 添加评论
   */
  adminReplyComments (params) {
    return axios.post('admin/comments/add', Qs.stringify(params))
  },
  /**
   * 删除评论
   */
  deleteComments (id) {
    return axios.post('admin/comments/delete', Qs.stringify({commentsId: id}))
  },
  /**
   * 获取 我的简历 页面
   */
  getResume () {
    return axios.get('admin/webConfig/getResume')
  },
  /**
   * 修改 我的简历 页面
   */
  modifyResume (params) {
    return axios.post('admin/webConfig/modifyResume', Qs.stringify(params))
  },
  // ---------------------------------------------以下是博客页面使用的接口---------------------------------------------,
  /**
   * 获取 关于我 页面
   */
  getBlogAboutMe () {
    return axios.get('w/getAbout')
  },
  /**
   * 获取博客信息
   */
  getBlogInfo () {
    return axios.get('w/blogInfo')
  },
  /**
   * 获取文章列表
   */
  getBlogArticleList (params) {
    return axios.get('w/article/list', {
      params: params
    })
  },
  /**
   * 获取文章归档列表
   */
  getBlogArticleArchives (params) {
    return axios.get('w/article/archives', {
      params: params
    })
  },
  /**
   * 获取文章信息
   */
  getBlogArticle (articleId) {
    return axios.get('w/article', {
      params: {
        id: articleId
      }
    })
  },
  /**
   * 获取分类列表
   */
  getBlogCategoryList () {
    return axios.get('w/category/list')
  },
  /**
   * 获取标签列表
   */
  getBlogTagList () {
    return axios.get('w/tag/list')
  },
  /**
   * 获取友链列表
   */
  getBlogFriendsList () {
    return axios.get('w/friends/list')
  },
  /**
   * 获取文章评论列表
   */
  getBlogComments (articleId) {
    return axios.get('w/comments/list', {
      params: {
        articleId: articleId
      }
    })
  },
  /**
   * 添加评论
   */
  replyComments (params) {
    return axios.post('w/comments/add', Qs.stringify(params))
  },
  /**
   * 获取 我的简历 页面
   */
  getBlogResume () {
    return axios.get('w/getResume')
  },
  /**
   * 按文章标题和简介搜索
   */
  searchArticle (params) {
    return axios.get('w/article/search', {
      params: params
    })
  }
}
