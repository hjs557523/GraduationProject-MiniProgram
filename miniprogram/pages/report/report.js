// miniprogram/pages/report/report.js

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
    thisWeekContent: '',
    nextWeekContent: '',
    isEscape: getApp().globalData.isEscape,
    theme: 'white-skin',
    loadingEnd: false,
    isLoadingProject: false,
    isEscape: getApp().globalData.isEscape,
    showMyPaid: false,
    isEditProject: false,
    userId: null,
    fileList: [],
    show: false,
    teacher: null,
    actions: [
      {
        name: '罗大佑',
        tid: 1
      },
      {
        name: '李连杰',
        tid: 2
      },
      {
        name: '孙星宇',
        tid: 3
      }
    ]
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
    const self = this;
    self.getMyTutor();
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

  afterRead(event) {
    console.log(event.detail.file)
    const self = this;
    var fileList = self.data.fileList;
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    fileList.push({
      name: file.name,
      url: file.path,
      path: file.path
    })
    self.setData({
      fileList: fileList
    })
   
    
  },

  deleteTempFile(event) {
    var self = this;
    var fileList = self.data.fileList;
    fileList.splice(event.detail.index, 1);
    this.setData({
      fileList: fileList
    })
  },

  showActionSheet() {
    this.setData({
      show: true
    })
  },

  onClose() {
    this.setData({ 
      show: false 
    });
  },

  onSelect(event) {
    console.log(event.detail);
    this.setData({
      teacher: {
        name: event.detail.name,
        sid: event.detail.tid
      }
    })
  },

  getThisWeek(event) {
    this.setData({
      thisWeekContent: event.detail.value
    })
  },

  getNextWeek(event) {
    this.setData({
      nextWeekContent: event.detail.value
    })
  },

  addWeekPaper() {
    const self = this;
    if (self.data.thisWeekContent === '') {
      Toast('请填写本周工作内容');
      return;
    }
    else if(self.data.nextWeekContent === '') {
      Toast('请填写下周工作计划');
      return;
    } 
    else if (self.data.teacher === null) {
      Toast('请选择汇报对象');
      return;
    }

    if (self.data.fileList.length > 0) {
      wx.uploadFile({
        url: 'http://localhost:8080/student/weekPaper/addWeekPaper',
        filePath: self.data.fileList[0].path,
        name: 'file',
        header: app.globalData.header3,
        formData: {
          "thisWeekContent": self.data.thisWeekContent,
          "nextWeekContent": self.data.nextWeekContent,
          "tid": self.data.teacher.sid,
          "fileName": self.data.fileList[0].name
        },
        success(res) {
          Notify({
            type: 'success', 
            message: '周报提交成功!',
            duration: 3000 
          });

          api.request('GET', '/push/teacher/' + self.data.teacher.sid, app.globalData.header, {
            "message": self.data.teacher.name + "老师, 有学生提交了周报, 请注意查收~"
          }, true).then(res=>{
            if (res.code === 0) {
              console.log(res.msg);
            }
          })
          
          self.setData({
            thisWeekContent: '',
            nextWeekContent: '',
            teacher: null,
            fileList: []
          })
  
        }
      })
    } else {
      api.request('POST', '/student/weekPaper/addWeekPaper2', app.globalData.header, {
        "thisWeekContent": self.data.thisWeekContent,
        "nextWeekContent": self.data.nextWeekContent,
        "tid": self.data.teacher.sid,
      }, true).then(res => {
        if (res.code === 0) {
          Notify({
            type: 'success',
            message: '周报提交成功!',
            duration: 3000
          });

          api.request('GET', '/push/teacher/' + self.data.teacher.sid, app.globalData.header, {
            "message": self.data.teacher.name + "老师, 有学生提交了周报, 请注意查收~"
          }, true).then(res => {
            if (res.code === 0) {
              console.log(res.msg);
            }
          })

          self.setData({
            thisWeekContent: '',
            nextWeekContent: '',
            teacher: null,
            fileList: []
          })
        }
      })
      
    }
  },

  getMyTutor() {
    const self = this;
    var active = [];
    api.request('GET', '/student/weekPaper/getMyTutor', app.globalData.header, null, true).then(res => {
      if (res.code === 0) {
        res.data.forEach(teacher => {
          active.push({
            name: teacher.realName,
            tid: teacher.tid
          })
        })

        self.setData({
          actions: active
        })
      }
    })
  }
})