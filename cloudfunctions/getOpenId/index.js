// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数: 获取用户的openid
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }

  // event默认参数：
  // event: {"userInfo":{"appId":"wx55cd29c85957466a","openId":"oLM575X8DAwc6rxmZMOJ4rPxbMdM"}}
  return event.userInfo;
  
}