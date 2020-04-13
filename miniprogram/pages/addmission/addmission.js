const app = getApp();
Page({
  data: {
    colorchoose: 0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    picker: ['类型1：需求分析', '类型2：开发任务', '类型3：测试任务', '类型4：算法研究', '类型5：文档撰写', '类型6：验收答辩'],
    multiIndex: [0, 0, 0],
    time: '12:01',
    startDate: '2020-01-01',
    endDate: '2020-05-31',
    items: [
      {name: '黄继升', value: '黄继升', checked: 'true'},
      { name: '高考', value: '高考' },
      {name: '陈奕迅', value: '陈奕迅'},
      {name: '吕不韦', value: '吕不韦'},
      { name: '司徒浩南', value: '司徒浩南' },
    ]
  },

  bindcolor(e) {
    this.setData({
      colorchoose: e.currentTarget.dataset.index
    })

    console.log(e.currentTarget.dataset.index);
  },

  DateChange1(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  DateChange2(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  MultiColumnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;
              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
})