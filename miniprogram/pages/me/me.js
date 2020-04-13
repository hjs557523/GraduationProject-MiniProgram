// miniprogram/pages/me/me.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    isFlag: false,
    isFlag2: false,
    isFlag3: false,
    username: '',
    password: '',
    confirmPassword: '',

  },


  checkUsername: function(e) {
    var that = this;
    var patt = /^\d+$/;
    var flag = patt.test(e.detail.value);
    console.log(flag);
    if (flag) {
      this.data.username = e.detail.value;
      this.setData({
        isFlag : false
      })
    } else {
      this.setData({
        isFlag : true
      })
    }
  },

  checkPassword(e) {
    var patt = /^[a-zA-Z0-9]+$/
    var flag = patt.test(e.detail.value);
    console.log(flag); 
    if (flag) {
      this.data.password = e.detail.value;
      this.setData({
        isFlag2: false
      })
    } else {
      this.setData({
        isFlag2: true
      })
    }

  },


  checkconfirmPassword(e) {
    if(e.detail.value != this.data.password) 
    {
      this.setData({
        isFlag3 : true
      })
    } else {
      this.setData({
        isFlag3: false,
        confirmPassword : e.detail.value
      })
    }

  },


  bindAccount() {
    if (util.strIsEmpty(this.data.username)){
      this.setData({
        isFlag:true,
      })
    } else if (util.strIsEmpty(this.data.password)) {
      this.setData({
        isFlag2:true,
      })
    } else if (util.strIsEmpty(this.data.confirmPassword)) {
      this.setData({
        isFlag3:true
      })
    } else if (this.data.confirmPassword != this.data.password) {
      this.setData({
        isFlag3:true
      })
    } else {
      //注册
      
    }
  },


  returnLogin() {
    wx.redirectTo({
      url: '/pages/login/login',
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