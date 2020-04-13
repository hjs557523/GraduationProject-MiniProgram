const BASE_URL = 'http://localhost:8080';
const app = getApp();

function request(method, url, data = {}, loading = true) {
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
      header: app.globalData.header,
      success: function(res) { //连接成功
        if (loading) {
          wx.hideLoading()
        }
        console.log(res.data)
        if (res.data.code == 1001) { //当前用户已退出登录 或 用户session过期
          wx.showToast({
            title: '登录失效',
            icon: "none",
            duration: 2000
          })
          wx.redirectTo({
            url: '../pages/login/login',
          })
          reject()
        } else { //登录有效: 0:数据返回成功; 101:数据返回失败 1111:未绑定账号
          resolve(res.data)
        }
      },

      fail: function(res) { //连接失败
        if (loading) {
          wx.hideLoading()
        }
        wx.showModal({
          title: '提示',
          content: '网络连接失败',
          showCancel: false,
        })
        reject()
      },

      complete: function(res) {},
    })
  })
}


module.exports = {
  request: request,
}