// miniprogram/pages/myTask/myTask.js

import { parseTime } from '../../utils/parseTime.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog.js'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js'

const app = getApp();
const base64 = require("../../utils/base64");
const api = require("../../utils/api");
const util = require("../../utils/util");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEscape: getApp().globalData.isEscape,
    theme: 'white-skin',
    active: 0,
    loadingEnd: false,
    isLoadingProject: false,
    showAddProjectSheet: false,
    isEscape: getApp().globalData.isEscape,
    showMyPaid: false,
    isEditProject: false,
    myDoProcessList: [],
    myFinishedProcessList: [],
    userId:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    wx.showNavigationBarLoading();
    self.getMyProcess();
    self.setData({
      userId: app.globalData.userId || wx.getStorageSync('userId')
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

  },

  getMyProcess() {
    const self = this;
    var arr = [];
    self.setData({
      isLoadingProject: true
    })
    getApp().showLoading(self);
    api.request('GET', '/student/process/getAllMyProcesses', app.globalData.header, null,
    true).then(res=> {
      if (res.code == 0) {
        let tempList = res.data.undo;
        let tempList2 = res.data.finished;
        tempList.forEach(item=> {
          // 转换时间
          item.process.createTime = parseTime(new Date(item.process.createTime), '{y}-{m}-{d} {h}:{i}')
          item.process.endTime = parseTime(new Date(item.process.endTime), '{y}-{m}-{d} {h}:{i}')
        })

        tempList2.forEach(item => {
          // 转换时间
          item.process.createTime = parseTime(new Date(item.process.createTime), '{y}-{m}-{d} {h}:{i}')
          item.process.endTime = parseTime(new Date(item.process.endTime), '{y}-{m}-{d} {h}:{i}')
        })
        self.setData({
          myDoProcessList: tempList,
          myFinishedProcessList: tempList2,
          showMyPaid: true,
          isLoadingProject: false
        })
      } else {
        console.log("error")
      }
    })
  },

  onCollapseChange(event) {
    this.setData({
      activeCollapse: event.detail
    })
  },
})