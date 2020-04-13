const Towxml = require('/towxml/main'); //引入towxml库

//app.js
App({
  towxml: new Towxml(), //markdown解析渲染。创建towxml对象，供小程序页面使用

  onLaunch: function() {

    // 云开发初始化
    // wx.cloud.init({
    //   env: "hjs-vfa14", //云开发环境的id
    //   traceUser: true
    // })


    this.getSystemInfo();

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // 全局
  globalData: {
    teamid: 1,
    userInfo: null,
    openId: '',
    blog: '',
    //自己维护一个header, 解决session过期问题
    header: {
      'content-type': "application/x-www-form-urlencoded;charset=utf-8", //默认该请求方式为表单提交格式，纯json字符串格式则修改为: 'application/json; charset=UTF-8' 
      'x-requested-with': 'XMLHttpRequest', //默认该请求为ajax请求，没有该属性或修改该属性值为null，则表示为同步请求(普通请求)
      'Cookie': null
    },
    //然后在每一次wx.request中的请求参数带上该header
    //var header = getApp().globalData.header; //获取app.js中的请求头

    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄绿色',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  },

  // 获取系统信息
  getSystemInfo() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        if (custom) {
          this.globalData.Custom = custom;
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    });
  },

  

  // getOpenId() {
  //   var that = this;
  //   wx.cloud.callFunction({
  //     name: 'getOpenId',
  //     complete: res => {
  //       // res: {
  //       //   errMsg: "cloud.callFunction:ok",
  //       //   result: {
  //       //     userInfo: {
  //       //       appId: "wx55cd29c85957466a",
  //       //       openId: "oLM575X8DAwc6rxmZMOJ4rPxbMdM"
  //       //     },
  //       //     ...
  //       //   },
  //       //   requestID: "2aa0d2e1-6f28-11ea-ab05-525400192d0e"
  //       // }
  //       this.globalData.openId = res.result.openId;
  //       console.log("openId1:" + this.globalData.openId)
  //     }
  //   })
  // },

});