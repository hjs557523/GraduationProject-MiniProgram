// miniprogram/pages/share/share.js
const app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEscape: getApp().globalData.isEscape,
    inviteInfo: {},
    loading: false,
    theme: 'white-skin'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (!getApp().globalData.isEscape) {
      wx.redirectTo({
        url: '/pages/group2/group2',
      })
    }
    if (options.hasOwnProperty('groupId')) {
      this.setData({
        inviteInfo: options
      })
    } else if (app.globalData.shareParam) {
      this.setData({
        inviteInfo: app.globalData.shareParam
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },


  joinGroup() {
    const { inviteInfo } = this.data
    const self = this
    self.setData({
      loading: true
    })
    api.request('GET', '/student/group/join', app.globalData.header, {
      gid: inviteInfo.groupId
    }, false).then(res => {
      if (res.code == 0) {
        // 加入提示
        Notify({
          text: `${res.msg}`,
          duration: 1500,
          selector: '#join-tips',
          backgroundColor: '#28a745'
        });
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/group2/group2',
          })
        }, 2000)
        self.setData({
          loading: false
        })
      } else {
        Notify({
          text: `${res.msg}`,
          duration: 1500,
          selector: '#join-tips',
          backgroundColor: '#dc3545'
        });
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/group2/group2',
          })
        }, 2000)
        self.setData({
          loading: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().setTheme(this)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})