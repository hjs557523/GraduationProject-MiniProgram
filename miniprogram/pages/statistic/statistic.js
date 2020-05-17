// miniprogram/pages/statistic/statistic.js
import * as echarts from '../../ec-canvas/echarts';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
let chart = null;
let chart2 = null;
const app = getApp();
const base64 = require("../../utils/base64");
const api = require("../../utils/api");
const util = require("../../utils/util");

function getOption(nameList, dataList, formatter) {
  var option = {
    color: ['red', 'blue', '#3CB371', 'yellow', 'pink', 'orange', 'purple'],
    tooltip: {
      trigger: 'item',
      formatter: formatter,
      // position: 'inside'
    },
    // 饼图、仪表盘、漏斗图: { a }（系列名称），{ b }（数据项名称），{ c }（数值）, { d }（百分比）
    legend: {
      orient: 'horizontal',
      data: nameList,
      x: 'center',
      y: 'bottom',
      textStyle: { //图例文字的样式
        fontSize: 11
      },
    },

    series: [{
      name: '访问来源：GitHub',
      type: 'pie',
      radius: '55%',
      center: ['50%', '45%'],
      data: dataList,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  return option;
}

function getOption2(xData, series) {
  var option = {
    color: ['#5ea9fc', '#896af7', '#2cb865', '#f6a90a', '#36c4c2', '#f6716f', '#ffb624'],
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [],
      bottom: 0
    },
    grid: {
      left: '0%',
      right: '10%',
      top: '10%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData
    },
    yAxis: {
      type: 'value'
    },
    series: series
  };

  return option;
}

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  let option = {
    // title: {
    //   text: 'commit统计',
    //   // subtext: '测试数据',
    //   x: 'center',
    //   textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
    //     fontFamily: 'Arial, Verdana, sans...',
    //     fontSize: 30,
    //     fontStyle: 'normal',
    //     fontWeight: 'bolder',
    //   },
    // },
    color: ['red', 'blue', '#3CB371', 'yellow', 'pink', 'orange', 'purple'],
    tooltip: {
      trigger: 'item',
      formatter: "{a}\n真实姓名：{b} \n提交次数： {c} ({d}%)",
      // position: 'inside'
    },
    // 饼图、仪表盘、漏斗图: { a }（系列名称），{ b }（数据项名称），{ c }（数值）, { d }（百分比）
    legend: {
      orient: 'horizontal',
      data: ['黄继升', '测试号1', '测试号2', '测试号3'],
      x: 'center',
      y: 'bottom',
      textStyle: { //图例文字的样式
        fontSize: 11
      },
    },
    // grid: {
    //   left: '25%',
    //   right: '25%',
    //   bottom: '25%',
    //   top: '25%',
    // },

    series: [{
      name: '访问来源：GitHub',
      type: 'pie',
      radius: '55%',
      center: ['50%', '40%'],
      data: [{
          value: 0,
          name: '黄继升'
        },
        {
          value: 0,
          name: '测试号1'
        },
        {
          value: 0,
          name: '测试号2'
        },
        {
          value: 0,
          name: '测试号3'
        }
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  chart.setOption(option);
  return chart;
}

function initChart2(canvas, width, height) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart2);

  let option = {
    color: ['#5ea9fc', '#896af7', '#2cb865', '#f6a90a','#36c4c2', '#f6716f', '#ffb624'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [],
      bottom: 0
    },
    grid: {
      left: '0%',
      right: '10%',
      top: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '测试号1',
        type: 'line',
        data: [220, 282, 291, 334, 390, 410, 450]
      },
      {
        name: '测试号2',
        type: 'line',
        data: [350, 332, 401, 354, 490, 590, 620]
      },
      {
        name: '测试号3',
        type: 'line',
        data: [420, 362, 501, 434, 590, 690, 700]
      },
      {
        name: '黄继升',
        type: 'line',
        data: [620, 932, 901, 934, 1190, 1230, 1250]
      }
    ]
  };


  chart2.setOption(option);
  return chart2;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    theme: 'white-skin',
    ec: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    watchList: [],
    nameList: [],
    commitList: [],
    codeList:[],
    series: [],
    week:[],
    text: '',
    nzopen: false,
    pxopen: false,
    nzshow: true,
    pxshow: true,
    isfull: false,
    shownavindex: 2,
    watchIndex: 0,
    pdIndex: 0,


    activeYate: 7.89,
    activeChain: -3.21,
    activeDtaArray: [{
      studentId: '16041321',
      name: '黄继升',
      githubName: 'hjs557523',
      count: 10
    }, {
      studentId: '16041322',
      name: '测试号',
      githubName: 'hjs557524',
      count: 11
    }, {
      studentId: '16041323',
      name: '测试号2',
      githubName: 'hjs557525',
      count: 12
    }, {
      studentId: '16041324',
      name: '测试号3',
      githubName: 'hjs557526',
      count: 13
    }],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var nameList = [];
    var commitList = [];
    var codeList = [];
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var self = this;
    var nameList = [];
    var commitList = [];
    var codeList = [];
    var series = [];
    var week = [];
    this.setData({
      watchList: app.globalData.groupList,
      active: 0
    })
    if (app.globalData.groupList.length !== 0) {
      api.request('GET', '/student/process/taskStatistic', app.globalData.header, {
        groupId: app.globalData.groupList[0].groupId
      }, true).then(res => {
        if (res.code == 0) {
          console.log(res.data);
          this.setData({
            activeDtaArray: res.data
          })
        } else {
          console.log(res.msg);
        }
      })

      api.request('GET', '/student/process/commitStatistic', app.globalData.header, {
        groupId: app.globalData.groupList[0].groupId
      }, false).then(res => {
        if (res.code == 0) {
          res.data.reverse();
          for (var i = 0; i < res.data.length; i++) {
            nameList.push(res.data[i].realName);
            commitList.push({
              value: res.data[i].totalCommit,
              name: res.data[i].realName
            })
            codeList.push({
              value: res.data[i].totalCodeNum,
              name: res.data[i].realName
            })
            series.push({
              name: res.data[i].realName,
              type: 'line',
              data: res.data[i].weekCodeNum
            })
          }

          for (var i = 0; i < res.data[0].weekCodeNum.length; i++) {
            week.push('第' + (i + 1) + '周');
          }
          self.setData({
            nameList: nameList,
            commitList: commitList,
            codeList: codeList,
            series: series,
            week: week
          })

          var option = getOption(nameList, commitList, "{a}\n真实姓名：{b} \n提交次数： {c} ({d}%)")
          chart.setOption(option);

          var option2 = getOption2(week, series);
          chart2.clear();
          chart2.setOption(option2);
        } else {
          console.log(res.msg);
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 下拉框是否隐藏
  list: function(e) {
    console.log("点击了下拉队伍")
    var self = this;
    console.log(this.data.nzopen);
    if (this.data.nzopen) {
      self.setData({
        nzopen: false,
        pxopen: false,
        nzshow: false,
        pxshow: true,
        isfull: false,
        shownavindex: 2
      });
      self.hidebg();
    } else {
      this.setData({
        watchContent: this.data.watchList,
        nzopen: true,
        pxopen: false,
        nzshow: false,
        pxshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },

  // 点击灰色背景隐藏所有的筛选内容
  hidebg: function(e) {
    console.log("执行了hidebg")
    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      // shownavindex: 0,
    })
  },

  selectWatch: function(e) {
    var self = this;
    var nameList = [];
    var commitList = [];
    var codeList = [];
    var week = [];
    var series = [];
    Toast.loading({
      mask: true,
      message: '请求中...',
      duration: 0
    });
    api.request('GET', '/student/process/taskStatistic', app.globalData.header, {
      groupId: e.currentTarget.dataset.group.groupId
    }, false).then(res => {
      if (res.code == 0) {
        this.setData({
          activeDtaArray: res.data
        })
      } else {
        console.log(res.msg);
      }
    })

    api.request('GET', '/student/process/commitStatistic', app.globalData.header, {
      groupId: e.currentTarget.dataset.group.groupId
    }, false).then(res => {
      if (res.code == 0) {
        console.log(res.data);
        for(var i = 0; i < res.data.length; i++) {
          nameList.push(res.data[i].realName);
          commitList.push({
            value: res.data[i].totalCommit, 
            name: res.data[i].realName
          })

          codeList.push({
            value: res.data[i].totalCodeNum,
            name: res.data[i].realName
          })

          series.push({
            name: res.data[i].realName,
            type: 'line',
            data: res.data[i].weekCodeNum
          })
        }
        for (var i = 0; i < res.data[0].weekCodeNum.length; i++) {
          week.push('第' + (i + 1) + '周');
        }
        self.setData({
          nameList: nameList,
          commitList: commitList,
          codeList: codeList,
          series: series,
          week: week,
          active: 0
        })

        var option = getOption(nameList, commitList, 'commit统计', "{a}\n真实姓名：{b} \n提交次数： {c} ({d}%)")
        chart.setOption(option);

        var option2 = getOption2(week, series);
        chart2.clear();
        chart2.setOption(option2);
        Toast.clear()
      } else {
        Toast.clear()
        console.log(res.msg);
      }
    })

    console.log(e.currentTarget.dataset.group);

    this.setData({
      watchIndex: e.currentTarget.dataset.index,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: false,
      isfull: false,
      shownavindex: 2
    });
    this.hidebg();
  },

  selectPad: function(e) {
    this.setData({
      pdIndex: e.currentTarget.dataset.index,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: false,
      isfull: false,
      shownavindex: 3
    });
    this.hidebg();
  },

  onChange(event) {
    var self = this;
    console.log(event.detail.name)
    if (event.detail.name === 0) {
      var option = getOption(
        self.data.nameList, 
        self.data.commitList, 
        "{a}\n真实姓名：{b} \n提交次数： {c} ({d}%)"
      )
      chart.setOption(option);
      self.setData({
        active: 0
      })
    }
    else if (event.detail.name === 1) {
      var option = getOption(
        self.data.nameList,
        self.data.codeList,
        "{a}\n真实姓名：{b} \n提交代码： {c} 行 ({d}%)"
      )
      chart.setOption(option);
      self.setData({
        active: 1
      })
    }
    
  }
})