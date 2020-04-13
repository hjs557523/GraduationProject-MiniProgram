// miniprogram/pages/addMember/addMember.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    teamid: '',
    show: {
      owner: 1,
      openid: 1,
      teacher: {openid: 5, name: '奥雷卡尔客斯'},
      people: [
        {openid: 1, name: '黄继升'},
        {openid: 2, name: '周润发'},
        {openid: 3, name: '张学友'},
        {openid: 4, name: '马化腾'}
      ]
        
    },
    popbottom: false,
    team: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.teamid = getApp().globalData.teamid;
    if (this.data.show.owner = this.data.show.openid) {
      console.log(true);
    }
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
  onShareAppMessage() {
    return {
      title: '快点击加入我的创新实践团队吧',
      imageUrl: '/images/hdu1.jpg',
      path: '/pages/basics/home/home'
    }
  }
})