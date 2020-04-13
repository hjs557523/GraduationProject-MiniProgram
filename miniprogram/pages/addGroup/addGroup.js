// miniprogram/pages/addGroup/addGroup.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    picker: ['A老师-健康打卡微信小程序开发', 'B老师-用户到店外卖支付系统开发', 'C老师-协同过滤推荐算法的研究', 'D老师-智能网联驾驶健康伙伴系统开发'],
    index: null,
    hidden: true,
    multiIndex: [0, 0, 0],
    time: '12:01',
    startDate: '2020-01-01',
    endDate: '2020-05-31',
  

  },

  bindjoin() {
    wx: wx.showModal({
      title: '加入团队',
      content: '点击微信群中分享的小程序卡片即可加入相应团队',
      showCancel: false,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  DateChange1(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  DateChange2(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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