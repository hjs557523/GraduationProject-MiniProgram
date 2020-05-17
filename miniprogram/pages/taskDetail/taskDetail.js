// miniprogram/pages/taskDetail/taskDetail.js

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
    option1: [
      { text: '选择对应的issue标签', value: 0 },
      { text: '这是一个测试issue标签', value: 1 },
    ],
    moduleUrl: 0,

    myProcess: 0,
    userId: null,
    currentTask: null,
    currentGroupInfo: null,
    processList: [],
    loadingEnd: false,
    isLoadingProject: false,
    showAddProjectSheet: false,
    currentGroupMemberList: [], // 当前群所有成员列表

    // 所选时间
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2025, 12, 31).getTime(),
    endDate: new Date().getTime(),

    projectTitle: '',
    projectDetail: '',
    loadingConfirm: false,

    // 折叠面板
    activeCollapse: ['1'],
    userInfoFromCloud: {},
    isEditProject: false,
    targetProject: {},
    showMyPaid: false,
    wordList: [], // 说话列表
    word: '', // 你要说啥
    loadingSendWord: false,
    isEscape: getApp().globalData.isEscape,
    theme: 'white-skin'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    wx.showNavigationBarLoading();
    // 获取当前小组成员
    let currentGroupMemberList = app.globalData.currentGroupMemberList;
    // 让默认情况下所有的头像勾选
    currentGroupMemberList.forEach(item => {
      item.checked = true
    })

    self.getTaskLatest();
    self.setData({
      currentGroupInfo : app.globalData.currentGroupInfo,
      currentGroupMemberList,
      userId : app.globalData.userId || wx.getStorageSync('userId')
    })

    self.getProcess();
    self.getLabels();
    //self.getWord();

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
    return {
      title: getApp().globalData.shareWord(),
      path: getApp().globalData.sharePath,
      imageUrl: getApp().globalData.imageUrl
    }
  },


  getTaskLatest() {
    const self = this;
    // 获取最新Task数据，主要是更新Task
    api.request('GET', '/student/task/findOneTask', app.globalData.header, {
      taskId: app.globalData.currentTask.tid
    }, true).then(res => {
      if (res.code == 0) {
        console.log(res.data);
        self.setData({
          currentTask: res.data
        })
        self.getWord();
        // 获取Task数据之后，再获取该Task下对应的issue的所有comment
        getApp().hideLoading(self)
      }
    })

  },


  getProcess() {
    // 请求所有的子任务项
    const self = this;
    const { currentTask, currentGroupMemberList } = this.data
    var arr = [];
    var myProcess = 0;
    self.setData({
      isLoadingProject: true
    })
    getApp().showLoading(self)
    api.request('GET', '/student/process/findAllProcess', app.globalData.header, {
      taskId: app.globalData.currentTask.tid,
      page: 1,
      limit: 99
    }, true).then(res => {
      if (res.code == 0) {
        let tempList = res.data.list;
        tempList.forEach(item => {
          // 转换时间
          item.createTime = parseTime(new Date(item.createTime), '{y}-{m}-{d} {h}:{i}')
          item.endTime = parseTime(new Date(item.endTime), '{y}-{m}-{d} {h}:{i}')
          const memberRemark = app.globalData.memberRemark;
          item.executerList = [];

          // 分割执行者列表，处理子任务执行者的信息，同时计算个人需要执行的任务数
          arr = item.executerIdList.split(',');
          arr.forEach(item2 => {
            if (parseInt(item2) === self.data.userId) {
              myProcess = myProcess + 1;
            }
            self.data.currentGroupMemberList.forEach(member => {
              if (parseInt(item2) === member.sid) {
                item.executerList.push({
                  sid: member.sid,
                  name: member.name || member.githubName,
                  avatar: member.picImg
                })
              }
            })  
          })

          // 处理子任务创建者的信息
          self.data.currentGroupMemberList.forEach(member => {
            if(item.publisherId === member.sid) {
              item.publisherName = member.name || member.githubName
              item.publisherAvatar = member.picImg
            }
          })

        })

        self.setData({
          myProcess: myProcess,
          processList: tempList.reverse(),
          showMyPaid: true,
          isLoadingProject: false
        })
      }
    })
  },

  onCollapseChange(event) {
    this.setData({
      activeCollapse: event.detail
    })
  },


  addProcess() {
    this.setData({
      showAddProjectSheet: true
    })
  },

  closeAddProjectSheet() {
    this.data.currentGroupMemberList.forEach((member, index) => {
      this.data.currentGroupMemberList[index].checked = true;
    })

    this.setData({
      showAddProjectSheet: false,
      projectTitle: '',
      projectDetail: '',
      moduleUrl: 0,
      isEditProject: false,
      endTime: new Date().getTime,
      currentGroupMemberList: this.data.currentGroupMemberList
    })
  },

  addProjectTitleInput(event) {
    this.setData({
      projectTitle: event.detail
    })
  },

  addProjectDetailInput(event) {
    this.setData({
      projectDetail: event.detail
    })
  },


  clickAvatar(event) {
    // 先计算勾选的人数
    console.log(event.currentTarget.dataset.index)
    const { currentGroupMemberList } = this.data
    const index = event.currentTarget.dataset.index
    let checkedNum = 0
    currentGroupMemberList.forEach(item => {
      if (item.checked) {
        checkedNum++
      }
    })
    if (checkedNum === 1 && currentGroupMemberList[index].checked) {
      Notify({
        text: '至少选择一人执行',
        duration: 1500,
        selector: '#bill-notify-selector',
        backgroundColor: '#dc3545'
      });
      return
    } else {
      const checked = this.data.currentGroupMemberList[index].checked
      this.data.currentGroupMemberList[index].checked = !checked
      this.setData({
        currentGroupMemberList: this.data.currentGroupMemberList
      })
    }
  },

  onTimeChange(event) {
    this.setData({
      endDate: event.detail
    });

    console.log(event.detail);
  },

  editProject(event) {
    const self = this
    const { currentGroupMemberList } = this.data
    const clickProject = event.currentTarget.dataset.item
    
    // 首先将所有勾选改为false
    currentGroupMemberList.forEach((member, index) => {
      this.data.currentGroupMemberList[index].checked = false
    }) 

    this.setData({
      currentGroupMemberList: this.data.currentGroupMemberList
    })

    // 判断哪些是勾选的
    this.data.currentGroupMemberList.forEach((member, index) => {
      clickProject.executerList.forEach(item => {
        if (member.sid === item.sid) {
          this.data.currentGroupMemberList[index].checked = true
        }
      })
    })

    self.setData({
      showAddProjectSheet: true,
      projectTitle: clickProject.processTitle,
      projectDetail: clickProject.processDetail,
      moduleUrl: clickProject.moduleUrl,
      currentGroupMemberList: this.data.currentGroupMemberList,
      isEditProject: true,
      targetProject: clickProject,
    })
  },


  confirmEditProject() {
    const { targetProject, currentTask, projectDetail, projectTitle, currentGroupMemberList, endDate, moduleUrl } = this.data;
    const self = this
    const tempContainUser = []
    currentGroupMemberList.forEach(item => {
      if (item.checked) {
        tempContainUser.push(item.sid)
      }
    })

    // 请求修改api
    api.request('POST', '/student/process/editProcess', app.globalData.header, {
      processId: targetProject.processId,
      processTitle : projectTitle,
      processDetail : projectDetail,
      endTime : new Date(endDate),
      moduleUrl : moduleUrl,
      executerIdList : tempContainUser.join(',')
    }).then(res => {
      if(res.code === 0) {
        Notify({
          text: '修改成功',
          duration: 1500,
          selector: '#bill-notify-selector',
          backgroundColor: '#28a745'
        })

        self.setData({
          showAddProjectSheet : false,
          activeCollapse : [],
          projectTitle : '',
          projectDetail : '',
          moduleUrl : '',
          isEditProject : false
        })

        self.getTaskLatest()
        self.getProcess()
      }
      else {
        Notify({
          text: '修改失败',
          duration: 1500,
          selector: '#bill-notify-selector',
          backgroundColor: '#28a745'
        })
        
        self.setData({
          showAddProjectSheet: false,
          activeCollapse: [],
          projectTitle: '',
          projectDetail: '',
          moduleUrl: '',
          isEditProject: false
        })
      }
    })
  },

  confirmAddProject() {
    const { currentTask, projectDetail, projectTitle, currentGroupMemberList, endDate, moduleUrl, currentGroupInfo } = this.data;
    console.log(moduleUrl);
    const self = this
    if (projectTitle === '') {
      Toast.fail('任务名为空');
      return
    } else if (projectDetail === '' ) {
      Toast.fail('任务描述为空');
      return
    } else if (moduleUrl == 0) {
      Toast.fail('请选择标签');
      return
    }
    self.setData({
      loadingConfirm: true
    })

    const tempContainUser = []
    currentGroupMemberList.forEach(item => {
      if (item.checked) {
        tempContainUser.push(item.sid)
      }
    })

    console.log(tempContainUser)

    api.request('POST', '/student/process/addProcess', app.globalData.header, {
      processType: currentTask.tid,
      processTitle: projectTitle,
      processDetail: projectDetail,
      executerIdList: tempContainUser.join(','),
      endTime: new Date(endDate),
      groupId: currentGroupInfo.groupId,
      moduleUrl: moduleUrl
    }, true).then(res => {
      if (res.code == 0) {
        self.setData({
          activeCollapse: []
        })
        self.getTaskLatest()
        self.getProcess()
        self.closeAddProjectSheet()
      }
      else {
        console.log('error')
      }

      self.setData({
        loadingConfirm: false
      })
    })
  },


  finishProject(event) {
    const self = this;
    console.log(event.currentTarget.dataset.item);
    Dialog.confirm({
      title: '提示',
      message: '是否确认已完成任务？'
    }).then(() => {
      this.setData({
        targetProject: event.currentTarget.dataset.item
      })

      // 请求修改api
      api.request('GET', '/student/process/finishProcess', app.globalData.header, {
        processId: this.data.targetProject.processId
      }).then(res => {
        if (res.code === 0) {
          Notify({
            text: '修改成功',
            duration: 1500,
            selector: '#bill-notify-selector',
            backgroundColor: '#28a745'
          })
          self.getTaskLatest()
          self.getProcess()
        }
        else {
          Notify({
            text: '修改失败',
            duration: 1500,
            selector: '#bill-notify-selector',
            backgroundColor: '#28a745'
          })
        }
      })
    }).catch(() => {
      console.log('取消')
    });
  },

  showUserName(event) {
    wx.showToast({
      title: event.currentTarget.dataset.user.name,
      icon: 'none'
    })
  },

  onSubmitAll(event) {
    const { currentTask, currentGroupMemberList, processList } = this.data
    const self = this
    self.setData({
      loadingEnd : true
    })

    console.log(event);
    
  },

  choose(event) {
    console.log(event.detail);
    this.setData({
      moduleUrl: event.detail
    })
    console.log(this.data.moduleUrl)
  },


  getLabels() {
    // 请求Label
    var self = this;
    var option = [{ text: '选择对应的issue标签', value: 0 }];
    api.request('GET', '/student/process/getLabels', app.globalData.header, {
      groupId: this.data.currentGroupInfo.groupId
    }).then(res => {
      if (res.code === 0) {
        for(var i = 0; i < res.data.length; i++) {
          option.push({ text: res.data[i], value: res.data[i]})
        }
        this.setData({
          option1: option
        })
        console.log(option)
      }
      else {
        console.log(res.msg);
      }
    })
  },

  onWordChange(event) {
    this.setData({
      word: event.detail
    })
  },


  sendWord() {
    const { word } = this.data
    const self = this
    if (word == '') {
      Toast.fail('你忘记写内容了');
    } else {
      self.setData({
        loadingSendWord: true
      })
    }

    //api请求
  },


  getWord() {
    const self = this;
    api.request('GET', '/student/task/getComment', app.globalData.header, {
      taskId: self.data.currentTask.tid
    }).then(res => {
      if (res.code === 0) {
        console.log(res.data);
        const wordList = res.data;
        wordList.forEach(word => {
          word.createDate = word.createDate ? parseTime(word.createDate, '{y}-{m}-{d} {h}:{i}:{s}') : '木有记录时间';
        })

        self.setData({
          wordList : wordList
        })
      }
      else {
        console.log(res.msg);
      }
    })
  }

})