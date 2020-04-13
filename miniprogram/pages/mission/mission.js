// miniprogram/pages/mission/mission.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabNum: 2,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    scrollLeft: 0,
    Tab: ["全部任务", "我的任务"],
    finished: [
      { finish: 1,
        people: [],
      }
    ],
    unfinished: [
      { 
        author: '1',
        name: '完成毕业设计',
        detail: '开发一个基于springboot框架的创新实践课程管理系统',
        teamid: 1,
        color: 2,
        finish: 0,
        deadline: 2020-5-1,
        people: [
          0, 1
        ],
        date: '2020-5-1',
      },
  
    ],
    mine: [
      {
        author: 1,
        name: '完成毕业设计',
        detail: '开发一个基于springboot框架的创新实践课程管理系统',
        teamid: 1,
        color: 2,
        finish: 0,
        deadline: 2020 - 5 - 1,
        people: [
          { openid: 1, name: '黄继升' },
        ],
        date: 2020-4-9
      },
    ],

    team: {
      openid: '1',
      missionlist:[
        { 
          author: 1, //创建任务的人id
          name: '完成毕业设计', 
          detail: '开发一个基于springboot框架的创新实践课程管理系统',
          teamid: 1,
          color: 2,
          finish: 0,
          deadline: 2020-5-1,
          people: [ //执行任务的人
            { openid: 1, name: '黄继升' },  
          ],
          date: 2020-4-9
        }
      ],
      people: [
        {name: '药水哥'},
        {name: '黄继升'}
      ]//小组成员表
    },
    color: ["#2d8cf0", "#19be6b", "#ff9900", "#ed3f14"]
  },


  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },


  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },


  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },


  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var teamid = app.globalData.teamid;
    wx.setStorageSync('teamid', teamid);
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
    return {
      title: '快加入我的创新实践小组吧！',
      path: "/pages/index/index?teamid=" + 1,
      imageUrl: '/images/hdu1.jpg',
    }

  }
})