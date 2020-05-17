const Towxml = require('/towxml/main'); //引入towxml库
import Notify from './miniprogram_npm/@vant/weapp/notify/notify';

//app.js
App({
  towxml: new Towxml(), //markdown解析渲染。创建towxml对象，供小程序页面使用

  onLaunch: function(options) {
    console.log(options);
    const self = this;
    // 查看主题设置
    this.globalData.skin.index = wx.getStorageSync('skin') || 1

    // 判断是否在审核期间
    // const nowTime = Date.parse(new Date())
    // if (nowTime < 1565078400000) { // 2019-08-06 16:00:00
    //   this.globalData.isEscape = false
    // }
    
    // 获取手机信息以配置顶栏
    wx.getSystemInfo({
      success: res => {
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.navBarHeight = 44 + res.statusBarHeight
        this.globalData.screenWidth = res.screenWidth
      }
    })

    this.globalData.shareParam = options.query 

    // 查看是否授权 + 登录
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              self.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (self.userInfoReadyCallback) {
                self.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.reLaunch({
            url: `/pages/login/login?back=${options.path.split('/')[1]}`,
          })
        } 
      }
    })

    // 这里应该逻辑为登陆成功后，再在login.js里开启webSocket
    if(self.globalData.socketStatus === 'closed') {
      //self.openSocket();
    }
  },


  setTheme(page) {
    const storeTheme = wx.getStorageSync('theme') || 'white-skin'
    page.setData({
      theme: storeTheme,
      selectType: storeTheme
    })
  },


  /**
   * 将子页面函数设置为全局变量
   */
  setMe(me) {
    this.globalData.me = me;// me就是 groupDetail.js的executeNotify
  },



  // 全局
  globalData: {

    notify: {},//通知方法
    socketStatus: 'closed',
    groupList: [],
    currentGroupInfo: null,
    currentGroupMemberList: [],
    currentTask: null,
    userInfo: null,
    shareParam: null,
    billId: '', // 用于展示结果的billid
    userInfoFromCloud: null,
    memberRemark: {},
    statusBarHeight: 0,
    navBarHeight: 0,
    screenWidth: 0,
    isLoading: false,
    shareWord: function () {
      return `你的同学${this.userInfo.nickName}在用这个创新实践课程管理小程序，你也来试试吧 `
      },
    sharePath: '/pages/group2/group2',
    imageUrl: 'https://s1.ax1x.com/2020/04/16/JF6Qqe.png',
    isEscape: true,
    teamid: 1,
    userId: null,
    userType: null,
    username: null,
    openId: '',
    blog: '',
    isEscape: true,
    //自己维护一个header, 解决session过期问题
    header: {
      'content-type': "application/x-www-form-urlencoded;charset=utf-8", //默认该请求方式为表单提交格式
      'x-requested-with': 'XMLHttpRequest', //默认该请求为ajax请求，没有该属性或修改该属性值为null，则表示为同步请求(普通请求)
      'Cookie': wx.getStorageSync('Cookies')
    },
    //然后在每一次wx.request中的请求参数带上该header
    //var header = getApp().globalData.header; //获取app.js中的请求头


    header2: {
      'content-type': "application/json;charset=utf-8", //纯json字符串格式则修改为: 'application/json; charset=UTF-8' 
      'x-requested-with': 'XMLHttpRequest', //默认该请求为ajax请求，没有该属性或修改该属性值为null，则表示为同步请求(普通请求)
      'Cookie': wx.getStorageSync('Cookies')
    },


    header3: {
      'content-type': "multipart/form-data", //文件上传
      'x-requested-with': 'XMLHttpRequest', //默认该请求为ajax请求，没有该属性或修改该属性值为null，则表示为同步请求(普通请求)
      'Cookie': wx.getStorageSync('Cookies')
    },

    skin: {
      colorList: [
        {
          bg0: 'rgb(255, 232, 59)',
          type: 'yellow-skin'
        },
        {
          bg0: '#F2F2F2',
          type: 'white-skin'
        },
        {
          bg0: '#7BB2D9',
          type: 'blue-skin'
        }, {
          bg0: '#60837F',
          type: 'green-skin'
        }, {
          bg0: '#AE303F',
          type: 'red-skin'
        }, {
          bg0: '#6B60C8',
          type: 'purple-skin'
        }
      ],
      index: 0
    }
  },


  showLoading(target) {
    const nav = target.selectComponent('.nav-instance')
    nav.showLoading()
  },


  hideLoading(target) {
    const nav = target.selectComponent('.nav-instance')
    nav.hideLoading()
  },

  /**
   * 打开webSocket，并开始进行事件监听
   */
  openSocket() {
    var self = this;
    //打开时的动作
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接')
      this.globalData.socketStatus = 'connected';
      
      //this.sendMessage();

    })

    //断开时的动作
    wx.onSocketClose(() => {
      console.log('WebSocket 已断开')
      this.globalData.socketStatus = 'closed'
    })

    //报错时的动作
    wx.onSocketError(error => {
      console.error('socket error:', error)
    })

    // 监听服务器推送的消息
    wx.onSocketMessage(message => {
      // 把JSONStr转为JSON
      message = message.data.replace(" ", "");
      if (typeof message != 'object') {
        message = message.replace(/\ufeff/g, ""); //重点
        var jj = JSON.parse(message);
        message = jj;
      }
      console.log("【websocket监听到消息】内容如下：");

      self.globalData.me("helloword");
    })


    // 打开信道
    wx.connectSocket({
      url: "ws://" + "localhost" + ":8080/websocket/student" + wx.getStorageSync('userId'),
    })
  },

  //关闭信道
  closeSocket() {
    if (this.globalData.socketStatus === 'connected') {
      wx.closeSocket({
        success: () => {
          this.globalData.socketStatus = 'closed'
        }
      })
    }
  },

  //发送消息函数
  sendMessage() {
    if (this.globalData.socketStatus === 'connected') {
      //自定义的发给后台识别的参数 ，我这里发送的是name
      wx.sendSocketMessage({
        data: "{\"toUserId\":\"1\", \"contentText\":\"请求连接\"}"
      })
    }
  },

});