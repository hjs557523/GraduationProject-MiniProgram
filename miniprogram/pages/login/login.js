// pages/login/login.js
const app = getApp();
const base64 = require("../../utils/base64");
const api = require("../../utils/api");
const util = require("../../utils/util");

// config
const bgCoverUrl =
  "https://s1.ax1x.com/2020/03/18/8BOOwq.png";
const iconUrl =
  "https://s1.ax1x.com/2020/03/18/8Bc3oq.png";

Page({
  // 页面的初始数据
  data: {
    backPath: '',
    coo: app.globalData.header.Cookie,
    openId: '',
    username: '',
    password: '',
    githubUsername: '',
    githubPassword: '',
    bgCoverUrl,
    iconUrl,
    userTypeList: ['学生登录', '教师登录'],
    userTypeList2: ['以学生身份登录', '以教师身份登录'],
    userTypeListIndex: 0,
    userTypeListIndex2: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 0,
    scrollLeft: 0,
    Tab: ['系统账号登录', 'GitHub登录']
  },


  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })

    console.log('TabCur: ' + this.data.TabCur);
  },

  // 登录函数
  login: function(username, password, userType, loginMode) {
    const { backPath } = this.data
    if (!!username || !!password) {
      wx.showLoading({
        title: '正在登录'
      });
      var that = this;
      console.log(this.data);
      if (loginMode == 0) {
        wx.login({
          success: function(res) {
            api.request('POST', '/wx/login', app.globalData.header, {
              code: res.code,
              username: username,
              password: password,
              userType: userType
            }, false).then(res => {
              if (res.code == 0) {
                app.globalData.header.Cookie = res.data.cookie;
                app.globalData.header2.Cookie = res.data.cookie;
                app.globalData.header3.Cookie = res.data.cookie;
                app.globalData.userId = res.data.userId;
                app.globalData.userType = userType;
                app.globalData.username = username;
                wx.setStorageSync('Cookies', res.data.cookie);
                wx.setStorageSync('userId', res.data.userId);
                wx.setStorageSync('userType', userType);
                wx.setStorageSync('username', username);
                wx.hideLoading()


                console.log("登陆成功!");
                wx.showToast({
                  title: '登陆成功',
                  icon: 'none',
                  duration: 1500
                })

                // 跳转团队详情页面
                wx.switchTab({
                  url: '/pages/group2/group2',
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 3000
                })
              }
            })

          }
        })
      } else {
        wx.login({
          success: function(res) {
            console.log(base64.base64_encode(username + ":" + password))
            console.log(res.code)
            api.request('POST', '/wx/githubLogin', app.globalData.header, {
              code: res.code,
              base64Token: base64.base64_encode(username + ":" + password),
              userType: userType
            }, false).then(res => {
              wx.hideLoading()
              if (res.code == 0) { //github验证成功，并且和本系统账号有绑定
                app.globalData.header.Cookie = res.data.cookie;
                app.globalData.header2.Cookie = res.data.cookie;
                app.globalData.header3.Cookie = res.data.cookie;
                app.globalData.userId = res.data.userId;
                app.globalData.userType = userType;
                app.globalData.username = username;
                wx.setStorageSync('Cookies', res.data.cookie);
                wx.setStorageSync('userId', res.data.userId);
                wx.setStorageSync('username', username);
                wx.setStorageSync('userType', userType);
                console.log(res.data);
                console.log("登陆成功!");
                wx.showToast({
                  title: '登陆成功!',
                  icon: 'none',
                  duration: 1500
                })
                wx.redirectTo({
                  url: `${backPath === '' ? '/pages/group2/group2' : `/pages/${backPath}/${backPath}`}`,
                })
              } else if (res.code == 1111) { //github验证成功，但未和本系统账号进行绑定
                app.globalData.header.Cookie = res.data;
                app.globalData.header2.Cookie = res.data;
                app.globalData.header3.Cookie = res.data.cookie;
                app.globalData.userType = userType;
                app.globalData.username = username;

                wx.setStorageSync('Cookies', res.data);
                wx.setStorageSync('userType', userType);
                wx.setStorageSync('username', username);
                wx.redirectTo({
                  url: `${backPath === '' ? '/pages/me/me' : `/pages/me/me?back=${backPath}`}`,
                })
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              } else { //登录失败，github账号和密码错误
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 3000
                })
              }
            })


          }
        })
      }
    } else {
      wx.showToast({
        title: "请输入账号和密码!",
        icon: "none",
        duration: 2000
      });
    }
  },

  getGitHubUserName: function(e) {
    if (!!!e.detail.value) {
      wx.showToast({
        title: '请输入github账号!',
        icon: "none",
        duration: 2000
      })
    }

    this.setData({
      githubUsername: e.detail.value
    })

    console.log(this.data.githubUsername);
  },


  getGitHubPassword: function(e) {
    console.log(e.detail.value);
    if (!!!e.detail.value) {
      wx.showToast({
        title: '请输入github密码!',
        icon: "none",
        duration: 2000
      })
    }
    this.setData({
      githubPassword: e.detail.value
    })
  },


  getUserName: function(e) {
    console.log(e.detail.value);
    if (!!!e.detail.value) {
      wx.showToast({
        title: '请输入学号/工号',
        icon: "none",
        duration: 2000
      })
    }
    this.setData({
      username: e.detail.value
    })

    console.log(this.data.username)
  },


  getPassword: function(e) {
    console.log(e.detail.value);
    if (!!!e.detail.value) {
      wx.showToast({
        title: '请输入密码',
        icon: "none",
        duration: 2000
      })
    }
    this.setData({
      password: e.detail.value
    })
  },

  UserTypeChange2: function(e) {
    this.setData({
      userTypeListIndex2: e.detail.value
    })
  },

  UserTypeChange: function(e) {
    this.setData({
      userTypeListIndex: e.detail.value
    })
  },

  // 登录按键: 授权 + 登录
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    wx.setStorageSync('userInfo', e.detail.userInfo)
    if (!!!app.globalData.userInfo) {
      wx.showToast({
        title: '拒绝授权，无法登录',
        icon: 'none',
        duration: 2000
      })

    } else {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

      if (this.data.TabCur == 0) {
        this.login(this.data.username, this.data.password, this.data.userTypeListIndex, 0);
      } else {
        this.login(this.data.githubUsername, this.data.githubPassword, this.data.userTypeListIndex2, 1)
      }
    }
  },

  // 获取当前登陆用户的基本信息
  // getUserInfo() {
  //   wx.showLoading({
  //     title: '加载中...'
  //   });
  //   request
  //     .get("/user")
  //     .then(res => {
  //       console.log(res);
  //       wx.hideLoading();
  //       app.globalData.userInfo = res;
  //       wx.switchTab({
  //         url: "/pages/index/index"
  //       });
  //     })
  //     .catch(err => {
  //       this.handleErr(err);
  //     });
  // },

  // 处理错误信息，如果捕获到错误，说明登录信息有误。就清空本地缓存
  handleErr(err) {
    wx.hideLoading();
    wx.showToast({
      title: err,
      icon: "none",
      duration: 2000
    });
    wx.removeStorageSync("Authorization");
    wx.removeStorageSync("username");
    wx.removeStorageSync("selectedRepository");
  },

  add(data) {
    wx.cloud.callFunction({
      //云函数名称
      name: 'addUserIssuesRepo',
      data: data,
      success(res) {
        console.log("新增用户信息成功: " + res)
      },
      fail(res) {
        console.log("新增用户信息失败: " + res)
      }
    })
  },




  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    console.log("login.wxml 执行了 onLoad");
    if (options.hasOwnProperty("back")) {
      this.setData({
        backPath: options.back
      })
    }
    if ((wx.getStorageSync("username") != null) && (wx.getStorageSync("password") != null)) {
      this.setData({
        defaultValue: wx.getStorageSync("username"),
        defaultValue2: wx.getStorageSync("password"),
        githubUsername: wx.getStorageSync("username"),

      })
    }

  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {},
  // 生命周期函数--监听页面显示
  onShow: function() {
    console.log("login.wxml 执行了 onShow");
  },
  // 生命周期函数--监听页面隐藏
  onHide: function() {
    console.log("login.wxml 执行了 onHide");
  },
  // 生命周期函数--监听页面卸载
  onUnload: function() {
    console.log("login.wxml 执行了 onUnload");
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function() {},
  // 用户点击右上角分享
  onShareAppMessage: function() {}
});