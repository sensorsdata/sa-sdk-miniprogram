var _ = {};

var sa = {};

sa.para = {
  name: 'sensors',
  server_url: '',
  send_timeout: 1000,
  use_client_time: false,
  show_log: true,
  allow_amend_share_path: true,
  max_string_length: 300,
  datasend_timeout: 3000,
  source_channel: [],
  autoTrack: {
    appLaunch: true,
    appShow: true,
    appHide: true,
    pageShow: true,
    pageShare: true,
    mpClick: false,
  },
  is_persistent_save: {
    share: false,
    utm: false
  }
};

var mpHook = {
  "data": 1,
  "onLoad": 1,
  "onShow": 1,
  "onReady": 1,
  "onPullDownRefresh": 1,
  "onReachBottom": 1,
  "onShareAppMessage": 1,
  "onPageScroll": 1,
  "onResize": 1,
  "onTabItemTap": 1,
  "onHide": 1,
  "onUnload": 1
};

var logger = typeof logger === 'object' ? logger : {};

logger.info = function() {
  if (sa.para.show_log) {
    if (typeof console === 'object' && console.log) {
      try {
        return console.log.apply(console, arguments);
      } catch (e) {
        console.log(arguments[0]);
      }
    }
  }
};

sa.setPara = function(para) {

  sa.para = _.extend2Lev(sa.para, para);

  var channel = [];
  if (_.isArray(sa.para.source_channel)) {
    var len = sa.para.source_channel.length;
    var reserve_channel = ' utm_source utm_medium utm_campaign utm_content utm_term sa_utm ';
    for (var c = 0; c < len; c++) {
      if (reserve_channel.indexOf(' ' + sa.para.source_channel[c] + ' ') === -1) {
        channel.push(sa.para.source_channel[c]);
      }
    }
  }
  sa.para.source_channel = channel;

  if (_.isObject(sa.para.register)) {
    _.extend(_.info.properties, sa.para.register);
  }

  if (!sa.para.openid_url) {
    sa.para.openid_url = sa.para.server_url.replace(/([^\/])\/(sa)(\.gif){0,1}/, '$1/mp_login');
  }

  if (typeof sa.para.send_timeout !== 'number') {
    sa.para.send_timeout = 1000;
  }

  var batch_send_default = {
    send_timeout: 6000,
    max_length: 6
  };

  if (para && para.datasend_timeout) {} else if (!!sa.para.batch_send) {
    sa.para.datasend_timeout = 10000;
  }

  if (sa.para.batch_send === true) {
    sa.para.batch_send = _.extend({}, batch_send_default);
    sa.para.use_client_time = true;
  } else if (_.isObject(sa.para.batch_send)) {
    sa.para.use_client_time = true;
    sa.para.batch_send = _.extend({}, batch_send_default, sa.para.batch_send);
  }

  var is_persistent_save_default = {
    share: false,
    utm: false
  };

  if (sa.para.is_persistent_save === true) {
    sa.para.is_persistent_save = _.extend({}, is_persistent_save_default);
    sa.para.is_persistent_save.utm = true;
  } else if (_.isObject(sa.para.is_persistent_save)) {
    sa.para.is_persistent_save = _.extend({}, is_persistent_save_default, sa.para.is_persistent_save);
  }

  if (!sa.para.server_url) {
    logger.info('请使用 setPara() 方法设置 server_url 数据接收地址,详情可查看https://www.sensorsdata.cn/manual/mp_sdk_new.html#112-%E5%BC%95%E5%85%A5%E5%B9%B6%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0');
    return;
  }
};


sa.status = {};



var ArrayProto = Array.prototype,
  FuncProto = Function.prototype,
  ObjProto = Object.prototype,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty,
  LIB_VERSION = '1.13.24',
  LIB_NAME = 'MiniProgram';

var source_channel_standard = 'utm_source utm_medium utm_campaign utm_content utm_term';
var latest_source_channel = ['$latest_utm_source', '$latest_utm_medium', '$latest_utm_campaign', '$latest_utm_content', '$latest_utm_term', 'latest_sa_utm'];
var latest_share_info = ['$latest_share_distinct_id', '$latest_share_url_path', '$latest_share_depth'];

var mp_scene = {
  1000: '其他',
  1001: '发现栏小程序主入口，「最近使用」列表（基础库2.2.4版本起包含「我的小程序」列表）',
  1005: '顶部搜索框的搜索结果页',
  1006: '发现栏小程序主入口搜索框的搜索结果页',
  1007: '单人聊天会话中的小程序消息卡片',
  1008: '群聊会话中的小程序消息卡片',
  1010: '收藏夹',
  1011: '扫描二维码',
  1012: '长按图片识别二维码',
  1013: '手机相册选取二维码',
  1014: '小程序模版消息',
  1017: '前往体验版的入口页',
  1019: '微信钱包',
  1020: '公众号 profile 页相关小程序列表',
  1022: '聊天顶部置顶小程序入口',
  1023: '安卓系统桌面图标',
  1024: '小程序 profile 页',
  1025: '扫描一维码',
  1026: '附近小程序列表',
  1027: '顶部搜索框搜索结果页“使用过的小程序”列表',
  1028: '我的卡包',
  1029: '卡券详情页',
  1030: '自动化测试下打开小程序',
  1031: '长按图片识别一维码',
  1032: '手机相册选取一维码',
  1034: '微信支付完成页',
  1035: '公众号自定义菜单',
  1036: 'App 分享消息卡片',
  1037: '小程序打开小程序',
  1038: '从另一个小程序返回',
  1039: '摇电视',
  1042: '添加好友搜索框的搜索结果页',
  1043: '公众号模板消息',
  1044: '带 shareTicket 的小程序消息卡片（详情)',
  1045: '朋友圈广告',
  1046: '朋友圈广告详情页',
  1047: '扫描小程序码',
  1048: '长按图片识别小程序码',
  1049: '手机相册选取小程序码',
  1052: '卡券的适用门店列表',
  1053: '搜一搜的结果页',
  1054: '顶部搜索框小程序快捷入口',
  1056: '音乐播放器菜单',
  1057: '钱包中的银行卡详情页',
  1058: '公众号文章',
  1059: '体验版小程序绑定邀请页',
  1064: '微信连Wi-Fi状态栏',
  1067: '公众号文章广告',
  1068: '附近小程序列表广告',
  1069: '移动应用',
  1071: '钱包中的银行卡列表页',
  1072: '二维码收款页面',
  1073: '客服消息列表下发的小程序消息卡片',
  1074: '公众号会话下发的小程序消息卡片',
  1077: '摇周边',
  1078: '连Wi-Fi成功页',
  1079: '微信游戏中心',
  1081: '客服消息下发的文字链',
  1082: '公众号会话下发的文字链',
  1084: '朋友圈广告原生页',
  1088: '会话中查看系统消息，打开小程序',
  1089: '微信聊天主界面下拉',
  1090: '长按小程序右上角菜单唤出最近使用历史',
  1091: '公众号文章商品卡片',
  1092: '城市服务入口',
  1095: '小程序广告组件',
  1096: '聊天记录',
  1097: '微信支付签约页',
  1099: '页面内嵌插件',
  1102: '公众号 profile 页服务预览',
  1103: '发现栏小程序主入口，“我的小程序”列表',
  1104: '微信聊天主界面下拉，“我的小程序”栏',
  1106: '聊天主界面下拉，从顶部搜索结果页，打开小程序',
  1107: '订阅消息，打开小程序',
  1113: '安卓手机负一屏，打开小程序(三星)',
  1114: '安卓手机侧边栏，打开小程序(三星)',
  1124: '扫“一物一码”打开小程序',
  1125: '长按图片识别“一物一码”',
  1126: '扫描手机相册中选取的“一物一码”',
  1129: '微信爬虫访问',
  1131: '浮窗打开小程序',
  1133: '硬件设备打开小程序',
  1146: '地理位置信息打开出行类小程序',
  1148: '卡包-交通卡，打开小程序',
  1150: '扫一扫商品条码结果页打开小程序',
  1153: '“识物”结果页打开小程序'
};


var sa_referrer = '直接打开';

sa.status.referrer = '直接打开';

var mpshow_time = null;

var query_share_depth = 0;
var share_distinct_id = '';

var is_first_launch = false;

sa.lib_version = LIB_VERSION;


(function() {
  var nativeBind = FuncProto.bind,
    nativeForEach = ArrayProto.forEach,
    nativeIndexOf = ArrayProto.indexOf,
    nativeIsArray = Array.isArray,
    breaker = {};

  var each = _.each = function(obj, iterator, context) {
    if (obj == null) {
      return false;
    }
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0,
          l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
          return false;
        }
      }
    } else {
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) {
            return false;
          }
        }
      }
    }
  };

  _.logger = logger;
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !== void 0) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
  _.extend2Lev = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !== void 0 && source[prop] !== null) {
          if (_.isObject(source[prop]) && _.isObject(obj[prop])) {
            _.extend(obj[prop], source[prop]);
          } else {
            obj[prop] = source[prop];
          }
        }
      }
    });
    return obj;
  };
  _.coverExtend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (source[prop] !==
          void 0 && obj[prop] ===
          void 0) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  _.isArray = nativeIsArray ||
    function(obj) {
      return toString.call(obj) === '[object Array]';
    };

  _.isFunction = function(f) {
    try {
      return /^\s*\bfunction\b/.test(f);
    } catch (x) {
      return false;
    }
  };

  _.isArguments = function(obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  _.toArray = function(iterable) {
    if (!iterable) {
      return [];
    }
    if (iterable.toArray) {
      return iterable.toArray();
    }
    if (_.isArray(iterable)) {
      return slice.call(iterable);
    }
    if (_.isArguments(iterable)) {
      return slice.call(iterable);
    }
    return _.values(iterable);
  };

  _.values = function(obj) {
    var results = [];
    if (obj == null) {
      return results;
    }
    each(obj, function(value) {
      results[results.length] = value;
    });
    return results;
  };

  _.include = function(obj, target) {
    var found = false;
    if (obj == null) {
      return found;
    }
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
      return obj.indexOf(target) != -1;
    }
    each(obj, function(value) {
      if (found || (found = (value === target))) {
        return breaker;
      }
    });
    return found;
  };

})();

_.trim = function(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

_.isObject = function(obj) {
  if (obj === undefined || obj === null) {
    return false;
  } else {
    return (toString.call(obj) == '[object Object]');
  }
};

_.isEmptyObject = function(obj) {
  if (_.isObject(obj)) {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  return false;
};

_.isUndefined = function(obj) {
  return obj ===
    void 0;
};

_.isString = function(obj) {
  return toString.call(obj) == '[object String]';
};

_.isDate = function(obj) {
  return toString.call(obj) == '[object Date]';
};

_.isBoolean = function(obj) {
  return toString.call(obj) == '[object Boolean]';
};

_.isNumber = function(obj) {
  return (toString.call(obj) == '[object Number]' && /[\d\.]+/.test(String(obj)));
};

_.isJSONString = function(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
_.decodeURIComponent = function(val) {
  var result = '';
  try {
    result = decodeURIComponent(val);
  } catch (e) {
    result = val;
  };
  return result;
};

_.encodeDates = function(obj) {
  _.each(obj, function(v, k) {
    if (_.isDate(v)) {
      obj[k] = _.formatDate(v);
    } else if (_.isObject(v)) {
      obj[k] = _.encodeDates(v);
    }
  });
  return obj;
};

_.formatDate = function(d) {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(d.getMilliseconds());
};

_.searchObjDate = function(o) {
  if (_.isObject(o)) {
    _.each(o, function(a, b) {
      if (_.isObject(a)) {
        _.searchObjDate(o[b]);
      } else {
        if (_.isDate(a)) {
          o[b] = _.formatDate(a);
        }
      }
    });
  }
};
_.formatString = function(str) {
  if (str.length > sa.para.max_string_length) {
    logger.info('字符串长度超过限制，已经做截取--' + str);
    return str.slice(0, sa.para.max_string_length);
  } else {
    return str;
  }
};

_.searchObjString = function(o) {
  if (_.isObject(o)) {
    _.each(o, function(a, b) {
      if (_.isObject(a)) {
        _.searchObjString(o[b]);
      } else {
        if (_.isString(a)) {
          o[b] = _.formatString(a);
        }
      }
    });
  }
};

_.unique = function(ar) {
  var temp,
    n = [],
    o = {};
  for (var i = 0; i < ar.length; i++) {
    temp = ar[i];
    if (!(temp in o)) {
      o[temp] = true;
      n.push(temp);
    }
  }
  return n;
};

_.strip_sa_properties = function(p) {
  if (!_.isObject(p)) {
    return p;
  }
  _.each(p, function(v, k) {
    if (_.isArray(v)) {
      var temp = [];
      _.each(v, function(arrv) {
        if (_.isString(arrv)) {
          temp.push(arrv);
        } else {
          logger.info('您的数据-', v, '的数组里的值必须是字符串,已经将其删除');
        }
      });
      if (temp.length !== 0) {
        p[k] = temp;
      } else {
        delete p[k];
        logger.info('已经删除空的数组');
      }
    }
    if (!(_.isString(v) || _.isNumber(v) || _.isDate(v) || _.isBoolean(v) || _.isArray(v))) {
      logger.info('您的数据-', v, '-格式不满足要求，我们已经将其删除');
      delete p[k];
    }
  });
  return p;
};

_.strip_empty_properties = function(p) {
  var ret = {};
  _.each(p, function(v, k) {
    if (v != null) {
      ret[k] = v;
    }
  });
  return ret;
};

_.utf8Encode = function(string) {
  string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  var utftext = '',
    start,
    end;
  var stringl = 0,
    n;

  start = end = 0;
  stringl = string.length;

  for (n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;

    if (c1 < 128) {
      end++;
    } else if ((c1 > 127) && (c1 < 2048)) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.substring(start, string.length);
  }

  return utftext;
};

_.base64Encode = function(data) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];
  if (!data) {
    return data;
  }
  data = _.utf8Encode(data);
  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + '==';
      break;
    case 2:
      enc = enc.slice(0, -1) + '=';
      break;
  }

  return enc;
};

_.getCurrentPath = function() {
  var url = '未取到';
  try {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    url = currentPage.route;
  } catch (e) {
    logger.info(e);
  };
  return url;
};

_.getCurrentUrl = function(me) {
  var path = _.getCurrentPath();
  var query = '';
  if (_.isObject(me) && me.sensors_mp_encode_url_query) {
    query = me.sensors_mp_encode_url_query;
  }
  if (path) {
    return (query ? path + '?' + query : path);
  } else {
    return '未取到';
  }
};

_.getPath = function(path) {
  if (typeof path === 'string') {
    path = path.replace(/^\//, '');
  } else {
    path = '取值异常';
  }
  return path;
};

_.getMethods = function(option) {
  var methods = [];
  for (var m in option) {
    if (typeof(option[m]) === 'function' && !mpHook[m]) {
      methods.push(m);
    }
  }
  return methods;
}

_.isClick = function(type) {
  var mpTaps = {
    "tap": 1,
    "longpress": 1,
    "longtap": 1,
  };
  return !!mpTaps[type];
}

sa.initialState = {
  queue: [],
  isComplete: false,
  systemIsComplete: false,
  storeIsComplete: false,
  checkIsComplete: function() {
    if (this.systemIsComplete && this.storeIsComplete) {
      this.isComplete = true;
      if (this.queue.length > 0) {
        _.each(this.queue, function(content) {
          sa[content[0]].apply(sa, slice.call(content[1]));
        });
        this.queue = [];
      }
    }
  }
};


_.getCustomUtmFromQuery = function(query, utm_prefix, source_channel_prefix, sautm_prefix) {
  if (!_.isObject(query)) {
    return {};
  }
  var result = {};
  if (query['sa_utm']) {
    for (var i in query) {
      if (i === 'sa_utm') {
        result[sautm_prefix + i] = query[i];
        continue;
      }
      if (_.include(sa.para.source_channel, i)) {
        result[source_channel_prefix + i] = query[i];
      }
    }
  } else {
    for (var i in query) {
      if ((' ' + source_channel_standard + ' ').indexOf(' ' + i + ' ') !== -1) {
        result[utm_prefix + i] = query[i];
        continue;
      }
      if (_.include(sa.para.source_channel, i)) {
        result[source_channel_prefix + i] = query[i];
      }
    }
  }
  return result;
};

_.getObjFromQuery = function(str) {
  var query = str.split('?');
  var arr = [];
  var obj = {};
  if (query && query[1]) {
    _.each(query[1].split('&'), function(value) {
      arr = value.split('=');
      if (arr[0] && arr[1]) {
        obj[arr[0]] = arr[1];
      }
    });
  } else {
    return {};
  }
  return obj;
};

_.setStorageSync = function(key, value) {
  var fn = function() {
    wx.setStorageSync(key, value);
  };
  try {
    fn();
  } catch (e) {
    logger.info('set Storage fail --', e);
    try {
      fn();
    } catch (e2) {
      logger.info('set Storage fail again --', e2);
    }
  }
};

_.getStorageSync = function(key) {
  var store = '';
  try {
    store = wx.getStorageSync(key);
  } catch (e) {
    try {
      store = wx.getStorageSync(key);
    } catch (e2) {
      logger.info('getStorage fail');
    }
  }
  return store;
};

_.getMPScene = function(key) {
  if (typeof key === "number" || (typeof key === "string" && key !== "")) {
    key = String(key);
    return mp_scene[key] || key;
  } else {
    return "未取到值";
  }
};

_.setShareInfo = function(para, prop) {
  var share = {};
  var obj = {};
  var current_id = sa.store.getDistinctId();
  var current_first_id = sa.store.getFirstId();
  if (para && _.isObject(para.query) && para.query.sampshare) {
    share = _.decodeURIComponent(para.query.sampshare);
    if (_.isJSONString(share)) {
      share = JSON.parse(share);
    } else {
      return {};
    }
  } else {
    return {};
  }
  var depth = share.d;
  var path = share.p;
  var id = share.i;
  if (typeof id === 'string') {
    prop.$share_distinct_id = id;
    share_distinct_id = id;
    obj.$latest_share_distinct_id = id;
  } else {
    prop.$share_distinct_id = '取值异常';
  }


  if (typeof depth === 'number') {
    if (share_distinct_id && (share_distinct_id === current_id || share_distinct_id === current_first_id)) {
      prop.$share_depth = depth;
      query_share_depth = depth;
      obj.$latest_share_depth = depth;
    } else if (share_distinct_id && (share_distinct_id !== current_id || share_distinct_id !== current_first_id)) {
      prop.$share_depth = depth + 1;
      query_share_depth = depth + 1;
      obj.$latest_share_depth = depth + 1;
    } else {
      prop.$share_depth = '-1';
    }
  } else {
    prop.$share_depth = '-1';
  }
  if (typeof path === 'string') {
    prop.$share_url_path = path;
    obj.$latest_share_url_path = path;
  } else {
    prop.$share_url_path = '取值异常';
  }
  _.setLatestShare(obj);
};

_.getShareInfo = function() {
  return JSON.stringify({
    i: sa.store.getDistinctId() || '取值异常',
    p: _.getCurrentPath(),
    d: query_share_depth
  });
};

_.detectOptionQuery = function(para) {
  if (!para || !_.isObject(para.query)) {
    return {};
  }
  var result = {};
  result.query = _.extend({}, para.query);
  if (typeof result.query.scene === 'string' && isBScene(result.query)) {
    result.scene = result.query.scene;
    delete result.query.scene;
  }
  if (para.query.q && para.query.scancode_time && String(para.scene).slice(0, 3) === '101') {
    result.q = String(result.query.q);
    delete result.query.q;
    delete result.query.scancode_time;
  }

  function isBScene(obj) {
    var source = ['utm_source', 'utm_content', 'utm_medium', 'utm_campaign', 'utm_term', 'sa_utm'];
    var source_keyword = source.concat(sa.para.source_channel);
    var reg = new RegExp('(' + source_keyword.join('|') + ')%3D', 'i');
    var keys = Object.keys(obj);
    if (keys.length === 1 && keys[0] === 'scene' && reg.test(obj.scene)) {
      return true;
    } else {
      return false;
    }
  }

  return result;
};

_.getMixedQuery = function(para) {
  var obj = _.detectOptionQuery(para);
  var scene = obj.scene;
  var q = obj.q;
  var query = obj.query;
  for (var i in query) {
    query[i] = _.decodeURIComponent(query[i]);
  }
  if (scene) {
    scene = _.decodeURIComponent(scene);
    if (scene.indexOf("?") !== -1) {
      scene = '?' + scene.replace(/\?/g, '');
    } else {
      scene = '?' + scene;
    }
    _.extend(query, _.getObjFromQuery(scene));
  }

  if (q) {
    _.extend(query, _.getObjFromQuery(_.decodeURIComponent(q)));
  }


  return query;
};

_.setUtm = function(para, prop) {
  var utms = {};
  var query = _.getMixedQuery(para);
  var pre1 = _.getCustomUtmFromQuery(query, '$', '_', '$');
  var pre2 = _.getCustomUtmFromQuery(query, '$latest_', '_latest_', '$latest_');
  utms.pre1 = pre1;
  utms.pre2 = pre2;
  _.extend(prop, pre1);
  return utms;
};

_.wxrequest = function(obj) {
  var rq = wx.request(obj);
  setTimeout(function() {
    if (_.isObject(rq) && _.isFunction(rq.abort)) {
      rq.abort();
    }
  }, sa.para.datasend_timeout);
};

_.getAppId = function() {
  var info;
  if (wx.getAccountInfoSync) {
    info = wx.getAccountInfoSync();
  }
  if (_.isObject(info) && _.isObject(info.miniProgram)) {
    return info.miniProgram.appId;
  }
};


_.info = {
  currentProps: {},
  properties: {
    $lib: LIB_NAME,
    $lib_version: String(LIB_VERSION)
  },
  getSystem: function() {
    var e = this.properties;
    var that = this;

    function getNetwork() {
      wx.getNetworkType({
        "success": function(t) {
          e.$network_type = t["networkType"]
        },
        "complete": getSystemInfo
      })
    }

    function formatSystem(system) {
      var _system = system.toLowerCase();
      if (_system === 'ios') {
        return 'iOS';
      } else if (_system === 'android') {
        return 'Android';
      } else {
        return system;
      }
    }

    function getSystemInfo() {
      wx.getSystemInfo({
        "success": function(t) {
          e.$manufacturer = t["brand"];
          e.$model = t["model"];
          e.$screen_width = Number(t["screenWidth"]);
          e.$screen_height = Number(t["screenHeight"]);
          e.$os = formatSystem(t["platform"]);
          e.$os_version = t["system"].indexOf(' ') > -1 ? t["system"].split(' ')[1] : t["system"];
        },
        "complete": function() {
          var timeZoneOffset = new Date().getTimezoneOffset();
          var appId = _.getAppId();
          if (_.isNumber(timeZoneOffset)) {
            e.$timezone_offset = timeZoneOffset;
          }
          if (appId) {
            e.$app_id = appId;
          }
          sa.initialState.systemIsComplete = true;
          sa.initialState.checkIsComplete();
        }
      })
    }

    getNetwork();
  }
};

sa._ = _;



sa.prepareData = function(p, callback) {

  var data = {
    distinct_id: this.store.getDistinctId(),
    lib: {
      $lib: LIB_NAME,
      $lib_method: 'code',
      $lib_version: String(LIB_VERSION)
    },
    properties: {}
  };

  _.extend(data, this.store.getUnionId(), p);

  if (_.isObject(p.properties) && !_.isEmptyObject(p.properties)) {
    _.extend(data.properties, p.properties);
  }

  if (!p.type || p.type.slice(0, 7) !== 'profile') {
    if (sa.para.batch_send) {
      data._track_id = Number(String(Math.random()).slice(2, 5) + String(Math.random()).slice(2, 4) + String(Date.now()).slice(-4));
    }
    data.properties = _.extend({}, _.info.properties, sa.store.getProps(), _.info.currentProps, data.properties);

    if (typeof sa.store._state === 'object' && typeof sa.store._state.first_visit_day_time === 'number' && sa.store._state.first_visit_day_time > (new Date()).getTime()) {
      data.properties.$is_first_day = true;
    } else {
      data.properties.$is_first_day = false;
    }
  }
  if (data.properties.$time && _.isDate(data.properties.$time)) {
    data.time = data.properties.$time * 1;
    delete data.properties.$time;
  } else {
    if (sa.para.use_client_time) {
      data.time = (new Date()) * 1;
    }
  }


  _.searchObjDate(data);
  _.searchObjString(data);

  logger.info(data);

  sa.sendStrategy.send(data);
};

sa.store = {
  verifyDistinctId: function(id) {
    if (typeof id === 'number') {
      id = String(id);
      if (!/^\d+$/.test(id)) {
        id = 'unexpected_id';
      }
    }
    if (typeof id !== 'string' || id === '') {
      id = 'unexpected_id';
    }
    return id;
  },
  storageInfo: null,
  getUUID: function() {
    return "" + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') + '-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);

  },
  getStorage: function() {
    if (this.storageInfo) {
      return this.storageInfo;
    } else {
      this.storageInfo = sa._.getStorageSync("sensorsdata2015_wechat") || '';
      return this.storageInfo;
    }
  },
  _state: {},
  mem: {
    mdata: [],
    getLength: function() {
      return this.mdata.length;
    },
    add: function(data) {
      this.mdata.push(data);
    },
    clear: function(len) {
      this.mdata.splice(0, len);
    }
  },
  toState: function(ds) {
    var state = null;
    if (_.isJSONString(ds)) {
      state = JSON.parse(ds);
      if (state.distinct_id) {
        this._state = state;
      } else {
        this.set('distinct_id', this.getUUID());
      }
    } else if (_.isObject(ds)) {
      state = ds;
      if (state.distinct_id) {
        this._state = state;
      } else {
        this.set('distinct_id', this.getUUID());
      }
    } else {
      this.set('distinct_id', this.getUUID());
    }
  },
  getFirstId: function() {
    return this._state._first_id || this._state.first_id;
  },
  getDistinctId: function() {
    return this._state._distinct_id || this._state.distinct_id;
  },
  getUnionId: function() {
    var obj = {};
    var first_id = this._state._first_id || this._state.first_id;
    var distinct_id = this._state._distinct_id || this._state.distinct_id;
    if (first_id && distinct_id) {
      obj['login_id'] = distinct_id;
      obj['anonymous_id'] = first_id;
    } else {
      obj['anonymous_id'] = distinct_id;
    }
    return obj;
  },
  getProps: function() {
    return this._state.props || {};
  },
  setProps: function(newp, isCover) {
    var props = this._state.props || {};
    if (!isCover) {
      _.extend(props, newp);
      this.set('props', props);
    } else {
      this.set('props', newp);
    }
  },
  set: function(name, value) {
    var obj = {};
    if (typeof name === 'string') {
      obj[name] = value;
    } else if (typeof name === 'object') {
      obj = name;
    }
    this._state = this._state || {};
    for (var i in obj) {
      this._state[i] = obj[i];
      if (i === 'first_id') {
        delete this._state._first_id;
      } else if (i === 'distinct_id') {
        delete this._state._distinct_id;
      }
    }
    this.save();
  },
  change: function(name, value) {
    this._state['_' + name] = value;
  },
  save: function() {
    var copyState = JSON.parse(JSON.stringify(this._state));
    delete copyState._first_id;
    delete copyState._distinct_id;
    sa._.setStorageSync("sensorsdata2015_wechat", copyState);
  },
  init: function() {
    var info = this.getStorage();
    if (info) {
      this.toState(info);
    } else {
      is_first_launch = true;
      var time = (new Date());
      var visit_time = time.getTime();
      time.setHours(23);
      time.setMinutes(59);
      time.setSeconds(60);
      sa.setOnceProfile({
        $first_visit_time: new Date()
      });
      this.set({
        'distinct_id': this.getUUID(),
        'first_visit_time': visit_time,
        'first_visit_day_time': time.getTime()
      });
    }
  }
};

sa.setProfile = function(p, c) {
  sa.prepareData({
    type: 'profile_set',
    properties: p
  }, c);
};

sa.setOnceProfile = function(p, c) {
  sa.prepareData({
    type: 'profile_set_once',
    properties: p
  }, c);
};

sa.appendProfile = function(p, c) {
  if (!_.isObject(p)) {
    return false;
  }
  _.each(p, function(value, key) {
    if (_.isString(value)) {
      p[key] = [value];
    } else if (_.isArray(value)) {

    } else {
      delete p[key];
      logger.info('appendProfile属性的值必须是字符串或者数组');
    }
  });
  sa.prepareData({
    type: 'profile_append',
    properties: p
  }, c);
};

sa.incrementProfile = function(p, c) {
  if (!_.isObject(p)) {
    return false;
  }
  var str = p;
  if (_.isString(p)) {
    p = {}
    p[str] = 1;
  }
  sa.prepareData({
    type: 'profile_increment',
    properties: p
  }, c);
};

sa.track = function(e, p, c) {
  this.prepareData({
    type: 'track',
    event: e,
    properties: p
  }, c);
};

sa.identify = function(id, isSave) {
  if (typeof id !== 'string' && typeof id !== 'number') {
    return false;
  }
  id = sa.store.verifyDistinctId(id);
  var firstId = sa.store.getFirstId();
  if (isSave === true) {
    if (firstId) {
      sa.store.set('first_id', id);
    } else {
      sa.store.set('distinct_id', id);
    }
  } else {
    if (firstId) {
      sa.store.change('first_id', id);
    } else {
      sa.store.change('distinct_id', id);
    }
  }
};

sa.trackSignup = function(id, e, p, c) {
  var original_id = sa.store.getFirstId() || sa.store.getDistinctId();
  sa.store.set('distinct_id', id);
  sa.prepareData({
    original_id: original_id,
    distinct_id: id,
    type: 'track_signup',
    event: e,
    properties: p
  }, c);
};


sa.registerApp = function(obj) {
  if (_.isObject(obj) && !_.isEmptyObject(obj)) {
    _.info.currentProps = _.extend(_.info.currentProps, obj);
  }
};

sa.register = function(obj) {
  if (_.isObject(obj) && !_.isEmptyObject(obj)) {
    sa.store.setProps(obj);
  }
};

sa.clearAllRegister = function() {
  sa.store.setProps({}, true);
};

sa.clearAllProps = function(arr) {
  var obj = sa.store.getProps();
  var props = {};
  if (_.isArray(arr)) {
    _.each(obj, function(value, key) {
      if (!_.include(arr, key)) {
        props[key] = value;
      }
    });
    sa.store.setProps(props, true);
  }
};

sa.clearAppRegister = function(arr) {
  if (_.isArray(arr)) {
    _.each(_.info.currentProps, function(value, key) {
      if (_.include(arr, key)) {
        delete _.info.currentProps[key];
      }
    });
  }
};

_.setLatestChannel = function(channel) {
  if (!_.isEmptyObject(channel)) {
    if (includeChannel(channel, latest_source_channel)) {
      sa.clearAppRegister(latest_source_channel);
      sa.clearAllProps(latest_source_channel);
    }
    sa.para.is_persistent_save.utm ? sa.register(channel) : sa.registerApp(channel);
  }

  function includeChannel(channel, arr) {
    var found = false;
    for (var i in arr) {
      if (channel[arr[i]]) {
        found = true;
      }
    }
    return found;
  }
};

_.setLatestShare = function(share) {
  if (share.$latest_share_depth || share.$latest_share_distinct_id || share.$latest_share_url_path) {
    sa.clearAppRegister(latest_share_info);
    sa.clearAllProps(latest_share_info);

    sa.para.is_persistent_save.share ? sa.register(share) : sa.registerApp(share);
  }
};

sa.login = function(id) {
  if (typeof id !== 'string' && typeof id !== 'number') {
    return false;
  }
  id = sa.store.verifyDistinctId(id);
  var firstId = sa.store.getFirstId();
  var distinctId = sa.store.getDistinctId();
  if (id !== distinctId) {
    if (firstId) {
      sa.trackSignup(id, '$SignUp');
    } else {
      sa.store.set('first_id', distinctId);
      sa.trackSignup(id, '$SignUp');
    }
  }
};

sa.logout = function(isChangeId) {
  var firstId = sa.store.getFirstId();
  if (firstId) {
    sa.store.set('first_id', '');
    if (isChangeId === true) {
      sa.store.set('distinct_id', sa.store.getUUID());
    } else {
      sa.store.set('distinct_id', firstId);
    }
  } else {
    logger.info('没有first_id，logout失败');
  }
};

sa.openid = {
  getRequest: function(callback) {
    wx.login({
      success: function(res) {
        if (res.code && sa.para.appid && sa.para.openid_url) {
          _.wxrequest({
            url: sa.para.openid_url + '&code=' + res.code + '&appid=' + sa.para.appid,
            method: 'GET',
            complete: function(res2) {
              if (_.isObject(res2) && _.isObject(res2.data) && res2.data.openid) {
                callback(res2.data.openid);
              } else {
                callback();
              }
            }
          });
        } else {
          callback();
        }
      }
    });
  },
  getWXStorage: function() {
    var storageInfo = sa.store.getStorage();
    if (storageInfo && _.isObject(storageInfo)) {
      return storageInfo.openid;
    }
  },
  getOpenid: function(callback) {
    if (!sa.para.appid) {
      callback();
      return false;
    }
    var storageId = this.getWXStorage();
    if (storageId) {
      callback(storageId);
    } else {
      this.getRequest(callback);
    }
  }
};

sa.initial = function() {
  this._.info.getSystem();
  this.store.init();
};

sa.init = function(obj) {
  if (this.hasInit === true) {
    return false;
  }
  this.hasInit = true;
  sa.setPara(obj);
  if (sa.para.batch_send) {
    wx.getStorage({
      key: 'sensors_mp_prepare_data',
      complete: function(res) {
        var queue = res.data && _.isArray(res.data) ? res.data : [];
        sa.store.mem.mdata = queue.concat(sa.store.mem.mdata);
        sa.sendStrategy.syncStorage = true;
      }
    });
    sa.sendStrategy.batchInterval();
  }
  sa.initialState.storeIsComplete = true;
  sa.initialState.checkIsComplete();
};

sa.getPresetProperties = function() {
  if (_.info && _.info.properties && _.info.properties.$lib) {
    var builtinProps = {};
    _.each(_.info.currentProps, function(value, key) {
      if (key.indexOf('$') === 0) {
        builtinProps[key] = value;
      }
    });
    var obj = _.extend(builtinProps, {
      $url_path: _.getCurrentPath()
    }, _.info.properties, sa.store.getProps());
    delete obj.$lib;
    return obj;
  } else {
    return {};
  }
};

_.autoExeQueue = function() {
  var queue = {
    items: [],
    enqueue: function(val) {
      this.items.push(val);
      this.start();
    },
    dequeue: function() {
      return this.items.shift();
    },
    getCurrentItem: function() {
      return this.items[0];
    },
    isRun: false,
    start: function() {
      if (this.items.length > 0 && !this.isRun) {
        this.isRun = true;
        this.getCurrentItem().start();
      }
    },
    close: function() {
      this.dequeue();
      this.isRun = false;
      this.start();
    }
  };
  return queue;
};

sa.requestQueue = function(para) {
  this.url = para.url;
};
sa.requestQueue.prototype.isEnd = function() {
  if (!this.received) {
    this.received = true;
    this.close();
  }
};
sa.requestQueue.prototype.start = function() {
  var me = this;
  setTimeout(function() {
    me.isEnd();
  }, sa.para.send_timeout);
  _.wxrequest({
    url: this.url,
    method: 'GET',
    complete: function() {
      me.isEnd();
    }
  });
};

sa.dataQueue = _.autoExeQueue();

sa.sendStrategy = {
  dataHasSend: true,
  dataHasChange: false,
  syncStorage: false,
  failTime: 0,
  onAppHide: function() {
    if (sa.para.batch_send) {
      this.batchSend();
    }
  },
  send: function(data) {
    if (!sa.para.server_url) {
      return false;
    }
    if (sa.para.batch_send) {
      this.dataHasChange = true;
      if (sa.store.mem.getLength() >= 300) {
        logger.info('数据量存储过大，有异常');
        return false;
      }
      sa.store.mem.add(data);
      if (sa.store.mem.getLength() >= sa.para.batch_send.max_length) {
        this.batchSend();
      }
    } else {
      this.queueSend(data);
    }
  },
  queueSend: function(url) {
    url = JSON.stringify(url);
    if (sa.para.server_url.indexOf('?') !== -1) {
      url = sa.para.server_url + '&data=' + encodeURIComponent(_.base64Encode(url));
    } else {
      url = sa.para.server_url + '?data=' + encodeURIComponent(_.base64Encode(url));
    }

    var instance = new sa.requestQueue({
      url: url
    });
    instance.close = function() {
      sa.dataQueue.close();
    };
    sa.dataQueue.enqueue(instance);
  },
  wxrequest: function(option) {
    if (_.isArray(option.data) && option.data.length > 0) {
      var now = Date.now();
      option.data.forEach(function(v) {
        v._flush_time = now;
      });
      option.data = JSON.stringify(option.data);
      _.wxrequest({
        url: sa.para.server_url,
        method: 'POST',
        dataType: 'text',
        data: 'data_list=' + encodeURIComponent(_.base64Encode(option.data)),
        success: function() {
          option.success(option.len);
        },
        fail: function() {
          option.fail();
        }
      });
    } else {
      option.success(option.len);
    }
  },
  batchSend: function() {
    if (this.dataHasSend) {
      var data = sa.store.mem.mdata;
      var len = data.length;
      if (len > 0) {
        this.dataHasSend = false;
        this.wxrequest({
          data: data,
          len: len,
          success: this.batchRemove.bind(this),
          fail: this.sendFail.bind(this)
        });
      }
    }
  },
  sendFail: function() {
    this.dataHasSend = true;
    this.failTime++;
  },
  batchRemove: function(len) {
    sa.store.mem.clear(len);
    this.dataHasSend = true;
    this.dataHasChange = true;
    this.batchWrite();
    this.failTime = 0;
  },
  is_first_batch_write: true,
  batchWrite: function() {
    var me = this;
    if (this.dataHasChange) {
      if (this.is_first_batch_write) {
        this.is_first_batch_write = false;
        setTimeout(function() {
          me.batchSend();
        }, 1000);
      }

      this.dataHasChange = false;
      if (this.syncStorage) {
        sa._.setStorageSync('sensors_mp_prepare_data', sa.store.mem.mdata);
      }
    }
  },
  batchInterval: function() {

    var _this = this;

    function loopWrite() {
      setTimeout(function() {
        _this.batchWrite();
        loopWrite();
      }, 500);
    }

    function loopSend() {
      setTimeout(function() {
        _this.batchSend();
        loopSend();
      }, sa.para.batch_send.send_timeout * Math.pow(2, _this.failTime));
    }
    loopWrite();
    loopSend();
  }
};

sa.setOpenid = function(openid, isCover) {
  sa.store.set('openid', openid);
  if (isCover) {
    sa.store.set('distinct_id', openid);
  } else {
    sa.identify(openid, true);
  }
};

sa.initWithOpenid = function(options, callback) {
  options = options || {};
  if (options.appid) {
    sa.para.appid = options.appid;
  }
  sa.openid.getOpenid(function(openid) {
    if (openid) {
      sa.setOpenid(openid, options.isCoverLogin);
    }
    if (callback && _.isFunction(callback)) {
      callback(openid);
    }
    sa.init(options);
  });
};

_.each(['setProfile', 'setOnceProfile', 'track', 'quick', 'incrementProfile', 'appendProfile', 'login', 'logout'], function(method) {
  var temp = sa[method];
  sa[method] = function() {
    if (sa.initialState.isComplete) {
      temp.apply(sa, arguments);
    } else {
      sa.initialState.queue.push([method, arguments]);
    }
  };
});

_.setQuery = function(params, isEncode) {
  var url_query = '';
  if (params && _.isObject(params) && !_.isEmptyObject(params)) {
    var arr = [];
    _.each(params, function(value, key) {
      if (!(key === 'q' && _.isString(value) && value.indexOf('http') === 0) && key !== 'scene') {
        if (isEncode) {
          arr.push(key + '=' + value);
        } else {
          arr.push(key + '=' + _.decodeURIComponent(value));
        }
      }
    });
    return arr.join('&');
  } else {
    return url_query;
  }
};

_.getUtmFromPage = function() {
  var newObj = {};
  try {
    var allpages = getCurrentPages();
    var myvar = allpages[allpages.length - 1].options;
    newObj = _.getCustomUtmFromQuery(myvar, '$', '_', '$');
  } catch (e) {
    logger.info(e);
  }
  return newObj;
};


function mp_proxy(option, method, identifier) {
  var newFunc = sa.autoTrackCustom[identifier];
  if (option[method]) {
    var oldFunc = option[method];
    option[method] = function() {
      if (method === 'onLaunch') {
        this[sa.para.name] = sa;
      }
      if (!sa.para.autoTrackIsFirst || (_.isObject(sa.para.autoTrackIsFirst) && !sa.para.autoTrackIsFirst[identifier])) {
        oldFunc.apply(this, arguments);
        newFunc.apply(this, arguments);
      } else if (sa.para.autoTrackIsFirst === true || (_.isObject(sa.para.autoTrackIsFirst) && sa.para.autoTrackIsFirst[identifier])) {
        newFunc.apply(this, arguments);
        oldFunc.apply(this, arguments);
      }
    };
  } else {
    option[method] = function() {
      if (method === 'onLaunch') {
        this[sa.para.name] = sa;
      }
      newFunc.apply(this, arguments);
    };
  }
}

function click_proxy(option, method) {
  var oldFunc = option[method];

  option[method] = function() {
    var prop = {},
      type = '';

    if (_.isObject(arguments[0])) {
      var target = arguments[0].currentTarget || {};
      var dataset = target.dataset || {};
      type = arguments[0]['type'];
      prop['$element_id'] = target.id;
      prop['$element_type'] = dataset['type'];
      prop['$element_content'] = dataset['content'];
      prop['$element_name'] = dataset['name'];
    }
    if (type && _.isClick(type)) {
      prop['$url_path'] = _.getCurrentPath();
      sa.track('$MPClick', prop);
    }
    return oldFunc && oldFunc.apply(this, arguments);
  }
};


sa.autoTrackCustom = {
  trackCustom: function(api, prop, event) {
    var temp = sa.para.autoTrack[api];
    var tempFunc = '';
    if (sa.para.autoTrack && temp) {
      if (typeof temp === 'function') {
        tempFunc = temp();
        if (_.isObject(tempFunc)) {
          _.extend(prop, tempFunc);
        }
      } else if (_.isObject(temp)) {
        _.extend(prop, temp);
        sa.para.autoTrack[api] = true;
      }
      sa.track(event, prop);
    }
  },
  appLaunch: function(para, not_use_auto_track) {

    if (typeof this === 'object' && !this['trackCustom']) {
      this[sa.para.name] = sa;
    }


    var prop = {};
    if (para && para.path) {
      prop.$url_path = _.getPath(para.path);
    }
    _.setShareInfo(para, prop);
    var utms = _.setUtm(para, prop);
    if (is_first_launch) {
      prop.$is_first_time = true;
      if (!_.isEmptyObject(utms.pre1)) {
        sa.setOnceProfile(utms.pre1);
      }
    } else {
      prop.$is_first_time = false;
    }

    _.setLatestChannel(utms.pre2);

    prop.$scene = _.getMPScene(para.scene);
    sa.registerApp({
      $latest_scene: prop.$scene
    });

    prop.$url_query = _.setQuery(para.query);

    if (not_use_auto_track) {
      prop = _.extend(prop, not_use_auto_track);
      sa.track('$MPLaunch', prop);
    } else if (sa.para.autoTrack && sa.para.autoTrack.appLaunch) {

      sa.autoTrackCustom.trackCustom('appLaunch', prop, '$MPLaunch');
    }
  },
  appShow: function(para, not_use_auto_track) {
    var prop = {};

    mpshow_time = (new Date()).getTime();

    if (para && para.path) {
      prop.$url_path = _.getPath(para.path);
    }
    _.setShareInfo(para, prop);

    var utms = _.setUtm(para, prop);

    _.setLatestChannel(utms.pre2);

    prop.$scene = _.getMPScene(para.scene);
    sa.registerApp({
      $latest_scene: prop.$scene
    });

    prop.$url_query = _.setQuery(para.query);
    if (not_use_auto_track) {
      prop = _.extend(prop, not_use_auto_track);
      sa.track('$MPShow', prop);
    } else if (sa.para.autoTrack && sa.para.autoTrack.appShow) {
      sa.autoTrackCustom.trackCustom('appShow', prop, '$MPShow');
    }
  },
  appHide: function(not_use_auto_track) {
    var current_time = (new Date()).getTime();
    var prop = {};
    prop.$url_path = _.getCurrentPath();
    if (mpshow_time && (current_time - mpshow_time > 0) && ((current_time - mpshow_time) / 3600000 < 24)) {
      prop.event_duration = (current_time - mpshow_time) / 1000;
    }
    if (not_use_auto_track) {
      prop = _.extend(prop, not_use_auto_track);
      sa.track('$MPHide', prop);
    } else if (sa.para.autoTrack && sa.para.autoTrack.appHide) {
      sa.autoTrackCustom.trackCustom('appHide', prop, '$MPHide');
    }
    sa.sendStrategy.onAppHide();
  },
  pageLoad: function(para) {
    if (para && _.isObject(para)) {
      this.sensors_mp_url_query = _.setQuery(para);
      this.sensors_mp_encode_url_query = _.setQuery(para, true);
    }
  },
  pageShow: function() {
    var prop = {};
    var router = _.getCurrentPath();
    prop.$referrer = sa_referrer;
    prop.$url_path = router;
    sa.status.last_referrer = sa_referrer;
    prop.$url_query = this.sensors_mp_url_query ? this.sensors_mp_url_query : '';
    prop = _.extend(prop, _.getUtmFromPage());

    if (sa.para.onshow) {
      sa.para.onshow(sa, router, this);
    } else if (sa.para.autoTrack && sa.para.autoTrack.pageShow) {
      sa.autoTrackCustom.trackCustom('pageShow', prop, '$MPViewScreen');
    }
    sa_referrer = router;
    sa.status.referrer = router;
  },
  pageShare: function(option, not_use_auto_track) {

    var oldMessage = option.onShareAppMessage;

    option.onShareAppMessage = function() {

      var oldValue = oldMessage.apply(this, arguments);

      if (sa.para.autoTrack && sa.para.autoTrack.pageShare) {
        sa.autoTrackCustom.trackCustom('pageShare', {
          $url_path: _.getCurrentPath(),
          $share_depth: query_share_depth
        }, '$MPShare');
      }

      if (sa.para.allow_amend_share_path) {
        if (typeof oldValue !== 'object') {
          oldValue = {};
          oldValue.path = _.getCurrentUrl(this);
        }
        if (typeof oldValue === 'object' && (typeof oldValue.path === 'undefined' || oldValue.path === '')) {
          oldValue.path = _.getCurrentUrl(this);
        }
        if (typeof oldValue === 'object' && typeof oldValue.path === 'string') {
          if (oldValue.path.indexOf('?') === -1) {
            oldValue.path = oldValue.path + '?';
          } else {
            if (oldValue.path.slice(-1) !== '&') {
              oldValue.path = oldValue.path + '&';
            }
          }
        }

        oldValue.path = oldValue.path + 'sampshare=' + encodeURIComponent(_.getShareInfo());
      }
      return oldValue;
    }
  }

};



sa.quick = function() {
  var arg0 = arguments[0];
  var arg1 = arguments[1];
  var arg2 = arguments[2];

  var prop = _.isObject(arg2) ? arg2 : {};
  if (arg0 === 'getAnonymousID') {
    if (_.isEmptyObject(sa.store._state)) {
      logger.info('请先初始化SDK');
    } else {
      return sa.store._state._first_id || sa.store._state.first_id || sa.store._state._distinct_id || sa.store._state.distinct_id;
    }
  } else if (arg0 === 'appLaunch' || arg0 === 'appShow') {
    if (arg1) {
      sa.autoTrackCustom[arg0](arg1, prop);
    } else {
      logger.info('App的launch和show，在sensors.quick第二个参数必须传入App的options参数');
    }
  } else if (arg0 === 'appHide') {
    prop = _.isObject(arg1) ? arg1 : {};
    sa.autoTrackCustom[arg0](prop);
  }
};







var oldApp = App;
App = function(option) {
  mp_proxy(option, "onLaunch", 'appLaunch');
  mp_proxy(option, "onShow", 'appShow');
  mp_proxy(option, "onHide", 'appHide');
  oldApp.apply(this, arguments);
};

var oldPage = Page;
Page = function(option) {
  var methods = sa.para.autoTrack && sa.para.autoTrack.mpClick && _.getMethods(option);

  if (!!methods) {
    for (var i = 0, len = methods.length; i < len; i++) {
      click_proxy(option, methods[i]);
    }
  }

  mp_proxy(option, "onLoad", 'pageLoad');
  mp_proxy(option, "onShow", 'pageShow');
  if (typeof option.onShareAppMessage === 'function') {
    sa.autoTrackCustom.pageShare(option);
  }
  oldPage.apply(this, arguments);
};

var oldComponent = Component;
Component = function(option) {
  try {
    var methods = sa.para.autoTrack && sa.para.autoTrack.mpClick && _.getMethods(option.methods);

    if (!!methods) {
      for (var i = 0, len = methods.length; i < len; i++) {
        click_proxy(option.methods, methods[i]);
      }
    }

    mp_proxy(option.methods, 'onLoad', 'pageLoad');
    mp_proxy(option.methods, 'onShow', 'pageShow');
    if (typeof option.methods.onShareAppMessage === 'function') {
      sa.autoTrackCustom.pageShare(option.methods);
    }
    oldComponent.apply(this, arguments);
  } catch (e) {
    oldComponent.apply(this, arguments);
  }
};




sa.initial();


module.exports = sa;