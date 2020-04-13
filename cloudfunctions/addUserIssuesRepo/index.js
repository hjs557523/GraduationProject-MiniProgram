// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await db.collection('user_issues_repo').add({
    data: event,
    success(res) {
      console.log("添加成功:" + res);
    },
    fail(res) {
      console.log("添加失败:" + res);
    }
  })
  return event.result.userInfo.openId;
}