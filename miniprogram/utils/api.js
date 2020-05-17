const BASE_URL = 'http://localhost:8080';
const app = getApp();

import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';

function request(method, url, header, data = {},  loading = true) {
  return new Promise(function(resolve, reject) {
    if (loading) {
      wx.showLoading({
        title: '请求中',
        mask: true,
      })
    }

    wx.request({
      url: BASE_URL + url,
      data: data,
      method: method,
      header: header,
      success: function(res) { //连接成功
        if (loading) {
          wx.hideLoading()
        }
        //console.log(res.data)
        if (res.data.code == 1001) { //当前用户已退出登录 或 用户session过期
          wx.showToast({
            title: '登录失效/未登录',
            icon: "none",
            duration: 3000
          })
          console.log("登录失效")
          wx.redirectTo({
            url: '/pages/login/login',
          })
          reject()
        } else { //登录状态有效: 0:数据返回成功; 101:数据返回失败 1111:未绑定账号
          resolve(res.data)
        }
      },

      fail: function(res) { //连接失败
        console.log("网络出错")
        if (loading) {
          wx.hideLoading()
        }
        wx.showModal({
          title: '提示',
          content: '请求失败，请重试',
          showCancel: false,
        })
        reject()
        wx.hideLoading();
        // wx.redirectTo({
        //   url: '/pages/login/login',
        // })
        Toast.clear()
      },

      complete: function(res) {
      },
    })
  })
}


module.exports = {
  request: request,
}