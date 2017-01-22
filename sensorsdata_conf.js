var conf = {
    // 神策分析的全局变量名
    name: 'sensors',
    // 神策分析数据接收地址,类似(http://xxx.cloud.sensorsdata.cn:8006/sa?project=gxq&token=312d2dfw21)
    server_url: 'http://xxx.cloud.sensorsdata.cn:8006/sa',
    // 传入的字符串最大长度限制
    max_string_length: 100,
    // 发送事件的时间使用客户端时间还是服务端时间
    use_client_time: false,
    // 选择需要
    register: {}

};

module.exports = conf;
