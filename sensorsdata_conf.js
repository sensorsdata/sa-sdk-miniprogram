var conf = {
  // 神策分析注册在APP全局函数中的变量名，在非app.js中可以通过getApp().sensors(你这里定义的名字来使用)
  name: 'sensors',
  // 神策分析数据接收地址
  server_url: 'https://test-syg.datasink.sensorsdata.cn/sa.gif?token=27f1e21b78daf376',
  // 传入的字符串最大长度限制
  max_string_length: 300,
  // 发送事件的时间使用客户端时间还是服务端时间
  use_client_time: false
};

module.exports = conf;