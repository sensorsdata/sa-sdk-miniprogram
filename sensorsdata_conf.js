var conf = {
  // 神策分析注册在APP全局函数中的变量名，在非app.js中可以通过getApp().sensors(你这里定义的名字来使用)
  name: 'sensors',
  // 如果要通过sdk自动获取openid，需要在神策分析中配置appid和appsercret，并在这里标志appid,不需要的话，不用填。
  appid: 'wx16ce2f6e06acd4d5',
  // 神策分析数据接收地址
  server_url: 'https://test-syg.datasink.sensorsdata.cn/sa.gif?project=xubo&token=27f1e21b78daf376',
  // 传入的字符串最大长度限制，防止未知字符串超长
  max_string_length: 300,
  // 发送事件的时间使用客户端时间还是服务端时间
  use_client_time: false,
  // 是否允许控制台打印查看埋点数据（建议开启查看）
  show_log: true,
  // 是否允许修改onShareMessage里return的path，用来增加（用户id，分享层级，当前的path），在app onshow中自动获取这些参数来查看具体分享来源，层级等
  allow_amend_share_path : true,
  // 是否自动采集如下事件（建议开启）
  autoTrack:{
    //$MPLaunch -> App onLaunch
    appLaunch:false,
    //$MPShow -> App onShow
    appShow:false,
    //$MPHide -> App onHide
    appHide:false,
    //$MPViewScreen -> page onShow
    pageShow:false,
    //$MPShare -> page onShareMessage
    pageShare: false
  }
};

module.exports = conf;