// miniprogram/pages/groupDetail/groupDetail.js

import { parseTime } from '../../utils/parseTime.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog.js'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify.js'

const app = getApp();
const base64 = require("../../utils/base64");
const api = require("../../utils/api");
const util = require("../../utils/util");

Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: {}, 
    groupMemberList: [],
    newTaskModal: false,
    taskName: '',
    taskList: null,
    groupCreateTime: null,
    userInfoFromCloud: {},
    userId: null,
    loadingLeave: false,
    showAvatarMenu: false,
    menuUser: {},
    loadingUpdateNote: false,
    editGroupModal: false,
    groupName: '',
    groupTeacherName: '',
    isEscape: app.globalData.isEscape,
    exactArray: [],
    theme: 'white-skin'
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("groupDetail.wxml 执行了 onLoad");
    // 从app.js中获取用户信息
    this.setData({
      userId : app.globalData.userId
    })

    this.setMonitor();
    app.openSocket();
    

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
    console.log("groupDetail.wxml 执行了 onShow");
    const self = this
    getApp().setTheme(this)
    self.getLatestData();
    
    
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("groupDetail.wxml 执行了 onHide");
  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("groupDetail.wxml 执行了 onUnLoad");
    // 关闭页面，就断开Socket
    app.closeSocket()
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
   * 用户点击右上角分享，或点击邀请按钮邀请成员
   */
  onShareAppMessage: function () {
    const { groupInfo } = this.data;
    const userInfo = app.globalData.userInfo;
    const { groupTeacherName } = this.data;
    console.log('小组id：' + groupInfo.gid);
    console.log('用户名：' + userInfo.nickName);
    console.log('老师名：' + groupTeacherName);
    if(app.globalData.isEscape) {
      return {
        title: `${userInfo.nickName}邀你加入${groupTeacherName}老师创新实践班：【${groupInfo.groupName}】`,
        path: `/pages/share/share?groupId=${groupInfo.gid}&inviter=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}&groupName=${groupInfo.groupName}`,
        imageUrl: getApp().globalData.imageUrl
      }
    }
  },


  editGroup() {
    this.setData({
      editGroupModal: true,
      groupName: this.data.groupInfo.groupName
    })
  },


  onGroupNameChange(evnet) {
    this.setData({
      groupName: event.detail
    })
  },


  confirmEditGroup(event) {
    const { groupInfo, groupName } = this.data
    const self = this
    if (event.detail === 'confirm') {
      // 修改接口请求
      self.setData({
        editGroupModal: false
      })
    } else {
      self.setData({
        editGroupModal: false
      })
    }
  },


  onTaskNameChange(event) {
    this.setData({
      taskName: event.detail
    })
  },


  callNewTask(event) {
    const self = this;
    if (event.detail == 'confirm') {
      if (this.data.taskName === '') {
        Notify({
          message: '请输入一个模块/任务名',
          duration: 2000,
          selector: '#van-notify',
          background: '#dc3545',
        });

        self.setData({
          newTaskModal : true
        })

        self.selectComponent("#new-bill-modal").stopLoading()
        return
      } else {
        //执行添加任务操作
        api.request('POST', '/student/task/addTask', app.globalData.header, {
          taskName: this.data.taskName,
          groupId: this.data.groupInfo.groupId
        },true).then(res => {
          if (res.code === 0) {
            self.setData({
              taskName: '',
              newTaskModal: false
            })

            // 重新请求该小组项目的所有任务/模块标题，更新界面
            api.request('GET', '/student/task/findAllTask', app.globalData.header, {
              groupId: self.data.groupInfo.groupId,
              page: 1,
              limit: 99
            }, true).then(res => {
              if (res.code == 0) {
                console.log(res.data.list);
                self.setData({
                  taskList: res.data.list
                })
              } else {
                console.log("查找任务列表失败");
              }
            })
          } else {
            console.log("添加失败");
            self.setData({
              taskName: '',
              newTaskModal: false
            })
          }
        })
      }
    } else {
      this.setData({
        newTaskModal: false
      })
    }
  },


  newTask() {
    var that = this;
    that.setData({
      newTaskModal: true
    })
  },

  deleteGroup() {

  },

  leaveGroup() {
    Dialog.confirm({
      message: `确定要退出小组吗？`,
      selector: '#confirm-leave-group'
    }).then(() => {
      const { groupInfo } = this.data;
      const self = this;
      self.setData({
        loadingLeave: false
      })
    })

  },


  /**
   * 设置App.js监听器
   */
  setMonitor() {
    var self = this;
    app.setMe(self.executeNotify);

  },


  /**
   * 定义回调方法
   */
  executeNotify(type) {
    console.log('app.js执行了通知')
    var self = this;
    Notify({ 
      type: 'success', 
      message: '您收到了新的任务',
      duration: 3000,
      selector: '#new-task-notify',
    });

  },




  getLatestData() {
    const { currentGroupInfo } = app.globalData;
    var groupMemberList = [];
    const self = this;
    app.showLoading(self);

    if (currentGroupInfo) {
      self.setData({
        groupInfo: currentGroupInfo,
      })
    }
    //console.log(self.data.groupInfo.subjectId)
    // 请求课题的导师信息
    api.request('GET', '/student/subject/getTeacherInfo', app.globalData.header, {
      subjectId : currentGroupInfo.subjectId
    },true).then(res => {
        if (res.code == 0) {
          console.log(res.data);
          self.setData({
            groupTeacherName: (res.data.realName == null ? res.data.githubName : res.data.realName)
          })
          
        } else {
          wx.showToast({
            title: res.msg,
            icon: '',
            duration: 2000
          })
        }
      })


    // 请求小组所有成员信息
    api.request('GET', '/student/group/findAllMember', app.globalData.header, {
      groupId : currentGroupInfo.groupId,
      page : 1,
      limit: 99
    },true).then(res => {
      if(res.code == 0) {
        console.log(res.data.list)
        for (var i = 0; i < res.data.list.length; i++) {
          groupMemberList.push(res.data.list[i].student)
        }
        this.setData({
          groupMemberList : groupMemberList,//小组创建者在前面
          exactArray: new Array((parseInt((groupMemberList.length / 5)) + 1) * 5 - groupMemberList.length)
        })

        // 向globalData赋值一个含有真实姓名/备注的用户obj
        const memberRemark = {};
        groupMemberList.forEach(item => {
          if(item.name) {
            memberRemark[`${item.sid}`] = item.name
          }
        })
        app.globalData.currentGroupMemberList = groupMemberList;
        app.globalData.memberRemark = memberRemark;
      }
    })


    // 请求该小组项目的所有任务/模块标题
    api.request('GET','/student/task/findAllTask', app.globalData.header, {
      groupId : currentGroupInfo.groupId,
      page : 1,
      limit : 99
    }, true).then(res => {
      if (res.code == 0) {
        console.log(res.data.list);
        self.setData({
          taskList : res.data.list
        })
        
      }
      app.hideLoading(self)

    })    
    
  }


})