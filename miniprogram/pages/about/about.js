const app = getApp();
const request = require("../../utils/api");

const COVER_IMAGE_URL =
  "https://s1.ax1x.com/2020/03/18/8DFc60.png";

const username = wx.getStorageSync("username");
Page({
  data: {
    // 最活跃的关注信息
    attentionList: [],
    // 登陆人信息
    userInfo: "",
    // 图表信息
    chart: {
      url: "https://ghchart.rshah.org/409ba5/" + wx.getStorageSync("username"),//这里出了问题，有时候只会请求"https://ghchart.rshah.org/409ba5/"
      year: new Date().getFullYear()
    },
    coverImage: COVER_IMAGE_URL
  },

  onLoad() {
    console.log(username);//undefined, 说明username的初始化

    wx.showLoading({
      title: "加载中"
    });
    //获取当前登陆用户的基本信息
    this.setData({
      userInfo: app.globalData.userInfo
    });
    const username = wx.getStorageSync("username");

    //获取收到的Event并得到最近活跃的关注人
    request
      .get(`/users/${username}/received_events`, { per_page: 30, page: 1 })
      .then(res => {
        let arr = [],
          obj = {},
          resultObj = {},
          attentionList = [];
        res.forEach(item => {
          let { display_login, avatar_url, id } = item.actor;
          resultObj[id] = {
            avatar_url,
            display_login
          };
          arr.push(id);
        });

        arr.forEach(ele => {
          !obj[ele] ? (obj[ele] = 1) : (obj[ele] += 1);
        });
        for (let e in obj) {
          resultObj[e]["times"] = obj[e];
        }
        for (let i in resultObj) {
          attentionList.push(resultObj[i]);
        }
        attentionList.sort((a, b) => b.times - a.times);
        this.setData({ attentionList }, () => {
          wx.hideLoading();
        });
      });
  },

  // 退出登录功能
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    });
  },
  // 关闭 modal
  hideModal() {
    this.setData({
      modalName: null
    });
  },

  // exit
  exit() {
    this.hideModal();
    wx.clearStorageSync();
    wx.reLaunch({
      url: "/pages/login/login"
    });
  }
});
