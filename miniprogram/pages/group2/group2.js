// miniprogram/pages/group2/group2.js

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog.js'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();
const base64 = require("../../utils/base64");
const api = require("../../utils/api");
const util = require("../../utils/util");

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart)
  var option = {
    color: ['#FFCC00'],
    title: {
      text: '本周销量统计图'
    },
    tooltip: {},
    legend: {
      data: ['销量']
    },
    xAxis: {
      data: ["周一", "周二", "周三", "周四", "周五", "周六", '周日']
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 13, 20, 38]
    }]
  };
  chart.setOption(option)
  return chart
}

Page({

  /**
   * 页面的初始数据
   */
  data: {

    ec: { onInit: initChart },
    show: false,
    groupList: [],
    isEscape: app.globalData.isEscape,
    statusBarHeight: getApp().globalData.statusBarHeight,
    screenWidth: getApp().globalData.screenWidth,
    showTips: false,
    showShareTips: false,
    theme: 'white-skin',
    newGroupModal: false,
    groupName: '',
    repositoryUrl: '',
    value1:0,
    showAddGroupSheet: false,
    groupTitle: '',
    subjectNameList: [],
    subjectIndexList: [],
    subjectId: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    console.log("group2.wxml 执行了 onLoad");
    var that = this;
    // 先处理看是否查看过教程
    var isVisitedHelp = wx.getStorageSync('isVisitedHelp') || false

    if (!isVisitedHelp) {
      Dialog.confirm({
        title: '首次使用提醒',
        message: '新用户首次使用，可先查看教程'
      }).then(() => { //用户同意查看教程
        wx.setStorageSync('isVisitedHelp', true)
        wx.navigateTo({
          url: '/pages/help/help',
        })
      }).catch(() => { //用户拒绝查看教程
        wx.setStorageSync('isVisitedHelp', true)
        wx.showToast({
          title: '欢迎使用创新实践课程管理系统小程序～😊',
          icon: 'none'
        })
      });
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
   

    console.log("group2.wxml 执行了 onShow");
    app.setTheme(this);
    this.getAllMyGroup();
    this.getAllSubject();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("group2.wxml 执行了 onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("group2.wxml 执行了 onUnload");
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


  /**
   * 点击查看小组详情
   */
  goToGroupDetail(event) {
    app.globalData.currentGroupInfo = event.currentTarget.dataset.group;
    console.log(app.globalData.currentGroupInfo);
    wx.navigateTo({
      url: '/pages/groupDetail/groupDetail',
    })
  },


  getAllMyGroup: function() {
    var groupList = [];
    var ownerIdList = [];
    api.request('GET', '/student/group/findAllJoin', app.globalData.header, {
      page: 1,
      limit: 20
    }).then(res => {
      if (res.code == 0) {
        // this.setData({
        //   groupList: res.data.list
        // })
        console.log(res.data.list)
        for(var i = 0; i < res.data.list.length; i++) {
          var item = {};
          item.ownerId = res.data.list[i].group.ownerId;
          item.groupName = res.data.list[i].group.groupName;
          item.groupId = res.data.list[i].group.gid;
          item.subjectId = res.data.list[i].group.subjectId;
          groupList.push(item)
          ownerIdList.push(item.ownerId)
        }

        api.request('POST', '/student/group/findOwner', app.globalData.header2, JSON.stringify(ownerIdList), true)
        .then(res => {
          if (res.code == 0) {
            for(i = 0; i < res.data.length; i++) {
              //console.log(res.data[i])
              groupList[i].avatar = res.data[i].picImg;
            }
            this.setData({
              groupList : groupList
            })
            app.globalData.groupList = groupList;
          }
        }) 
      } else {
        wx.showToast({
          title: '您没有加入任何小组',
          icon: '',
          duration: 3000
        })
      }
    })
  },


  getAllSubject() {
    var subjectNameList = [];
    var subjectIndexList = [];
    api.request('GET', '/student/subject/findAll', app.globalData.header,{
      page: 1,
      limit: 999
    }).then(res => {
      if (res.code == 0) {
        console.log(res.data.list)
        for(var i = 0; i < res.data.list.length; i++) {
            subjectIndexList.push(res.data.list[i].subjectId),
            subjectNameList.push(res.data.list[i].teacher.realName + '-' + res.data.list[i].subjectName)
        }
        this.setData({
          subjectIndexList : subjectIndexList,
          subjectNameList : subjectNameList,
        })
      } else {
        this.setData({
          subjectNameList : ['当前没有导师上传课题']
        })
      }
    })
  },


  showNewGroupModal() {
    this.setData({
      newGroupModal: true
    })
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  addProject() {
    this.setData({
      showAddGroupSheet: true
    })
  },

  closeAddGroupSheet() {
    this.setData({
      showAddGroupSheet: false,
      groupName: '',
      repositoryUrl: '',
      subject: ''
    })
  },

  onChange(event) {
    var that = this;
    const { picker, value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      subjectId: that.data.subjectIndexList[index]
    })

    console.log(this.data.subjectId);
  },

  addGroupNameInput(event) {
    this.setData({
      groupName: event.detail
    })
  },

  addRepositoryUrlInput(event) {
    this.setData({
      repositoryUrl: event.detail
    })
  },

  addGroup() {
    if (this.data.groupName != null && this.data.repositoryUrl != null && this.data.subjectId != null) {
      var that = this;
      var data = {
          groupName : this.data.groupName,
          repositoryUrl : this.data.repositoryUrl,
          subjectId: this.data.subjectId
      }

      //请求创建小组接口
      api.request('POST', '/student/group/create', app.globalData.header2, 
      JSON.stringify(data)).then(res => {
        if (res.code == 0) {
          that.closeAddGroupSheet();
          that.getAllMyGroup();

        } else {
          wx.showToast({
            title: '创建失败',
            icon: '',
            duration: 2000
          })
        }
      })
    }
    else {

    }
  },

  more(event) {
    console.log(event);
  },

  onStatistic() {
    wx.navigateTo({
      url: '/pages/statistic/statistic',
    })
  },

  onNotify() {
    // 获取消息订阅授权
    wx.requestSubscribeMessage({
      tmplIds: ['7tHGRJ6DoXw28_YtKewPg4OnKBn4nZRm9tMpI5vU-rs', 'Kkw079z2CYDocnKLSopdt7iBBLlvH_rU0FA12StwbAM'],
      success(res) {
        console.log('授权成功', res);
      },
      fail(res) {
        console.log('授权失败', res);
      }
    })
  },

  myProcess() {
    wx.navigateTo({
      url:'/pages/myTask/myTask',
    })
    
  },

  onReport() {
    wx.navigateTo({
      url: '/pages/report/report',
    })
  }


})