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
  // 验证是否登录
  // verifyLogin() {
  //   let isLogin = !!wx.getStorageSync("Authorization") && !!wx.getStorageSync("username") && !!wx.getStorageSync("selectedRepository");
  //   //只有三者都不为空，才返回true

  //   if (isLogin) {

  //     //Get the authenticated user all basic messages

  //     wx.switchTab({
  //       url: "/pages/index/index"
  //     });

  //     request
  //       .get("/user")
  //       .then(res => {
  //         console.log(res);
  //         app.globalData.userInfo = res;

  //       })
  //       .catch(err => {
  //         this.handleErr(err);
  //       });
  //   }
  // },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })

    console.log('TabCur: ' + this.data.TabCur);
  },

  // 登录函数
  login: function(username, password, userType, loginMode) {
    // 设置当前用户以及选择的仓库
    // wx.setStorageSync("username", username);
    // wx.setStorageSync("password", password);
    // wx.setStorageSync("userType", userTypeListIndex);

    if (!!username || !!password) {
      wx.showLoading({
        title: '正在登录'
      });
      var that = this;
      console.log(this.data);
      if (loginMode == 0) {
        wx.login({
          success: function (res) {
            api.request('POST', '/wx/login', {
              code: res.code,
              username: username,
              password: password,
              userType: userType
            }, false).then(res => {
              wx.hideLoading()
              if (res.code == 0) {
                app.globalData.header.Cookie = res.data;
                wx.setStorageSync('Cookies', res.data);
                console.log("登陆成功!");
                wx.showToast({
                  title: '登陆成功',
                  icon: 'none',
                  duration: 1500
                })
                // 跳转页面
                //
                //
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
        api.request('POST', '/wx/githubLogin', {
          base64Token : base64.base64_encode(username + ":" + password),
          userType : userType
        }, false).then(res => {
          wx.hideLoading()
          if (res.code == 0) { //github验证成功，并且和本系统账号有绑定
            app.globalData.header.Cookie = res.data.cookie;
            app.globalData.userId = res.data.userId;
            app.globalData.userType = userType;
            wx.setStorageSync('Cookies', res.data.cookie);
            wx.setStorageSync('userId', res.data.userId);
            wx.setStorageSync('userType', userType);
            console.log(res.data);
            console.log("登陆成功!");
            wx.showToast({
              title: '登陆成功!',
              icon: 'none',
              duration: 1500
            })
          } else if(res.code == 1111) { //github验证成功，但未和本系统账号进行绑定
            app.globalData.header.Cookie = res.data;
            app.globalData.userType = userType;
            wx.setStorageSync('Cookies', res.data);
            wx.setStorageSync('userType', userType);
            wx.redirectTo({
              url: '/pages/me/me',
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
    } 
    else {
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

    console.log(this.data.githubPassword);
  },

  //获取 repository 列表
  // getRepository: function(e) { //bindblur失去焦点就会触发, 即填完密码后就会触发
  //   const password = e.detail.value;
  //   const username = this.data.username;
  //   if (!!username && !!password) {
  //     wx.request({
  //       url: `https://api.github.com/users/${username}/repos`, //ES6语法
  //       header: {
  //         'content-type': "application/json",
  //         'Authorization': "Basic " + base64.base64_encode(username + ":" + password)
  //       },
  //       success: res => {
  //         console.log(res);
  //         if (res.statusCode !== 200) {
  //           wx.showToast({
  //             title: "仓库列表请求失败",
  //             icon: "none",
  //             duration: 2000
  //           });
  //           return;
  //         };
  //         let temArr = [];
  //         res.data.forEach(ele => {
  //           temArr.push(ele.name);
  //         });
  //         this.setData({
  //           repositoryList: temArr
  //         });
  //       }
  //     });
  //   } else {
  //     wx.showToast({
  //       title: "请输入用户名和密码",
  //       icon: "none",
  //       duration: 2000
  //     });
  //   }
  // },

  // 捕获 repository 变化
  // repositoryChange: function(e) {
  //   this.setData({
  //     repositoryIndex: e.detail.value
  //   });
  // },

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
  onLoad: function() {
    // if(app.globalData.header.Cookie != null) {


    //   wx.switchTab({
    //     url: '/pages/home/home',
    //   })
    // }
    if ((wx.getStorageSync("username") != null) && (wx.getStorageSync("password") != null)) {
      this.setData({
        defaultValue: wx.getStorageSync("username"),
        defaultValue2: wx.getStorageSync("password"),
        username: wx.getStorageSync("username"),
        password: wx.getStorageSync("password")
      })

    }

  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {},
  // 生命周期函数--监听页面显示
  onShow: function() {},
  // 生命周期函数--监听页面隐藏
  onHide: function() {},
  // 生命周期函数--监听页面卸载
  onUnload: function() {},
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function() {},
  // 用户点击右上角分享
  onShareAppMessage: function() {}
});