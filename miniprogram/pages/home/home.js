const app = getApp();
Component({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    list: [{
        title: '创新实践课题管理',
        img: '../../images/hdu.jpg',
        url: '../subject/subject'
    },
      {
        title: '创新实践小组管理',
        img: '../../images/team6.jpg',
        url: '../group/group'
      },
      {
        title: '项目任务分工管理',
        img: '../../images/project.png',
        url: '../group/group'
      },
      {
        title: '个人代码笔记',
        img: '../../images/notes.png',
        url: '../drawer/drawer'
      },
      {
        title: '个人GitHub主页',
        img: '../../images/github.jpg',
        url: '../about/about'
      }
    ]
  },

  methods: {
    toChild(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    },

    //生命周期函数--监听页面加载
    onLoad: function (options) { //页面第一次加载，只会调用一次
      if (app.globalData.header.Cookie == null) {}
    },

    //生命周期函数--监听页面初次渲染完成
    onReady: function () {

    },

    //生命周期函数--监听页面显示。小程序启动，或从后台进入前台显示，会触发onShow。每一次打开这个页面都会调用一次
    onShow: function () {
 
    },

    //生命周期函数--监听页面隐藏。小程序从前台进入后台，会触发onHide
    onHide: function () {

    },

    //生命周期函数--监听页面卸载
    onUnload: function () {

    },

    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {

    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {

    },

    //用户点击右上角分享
    onShareAppMessage: function () {

    }
  },


  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  }
});