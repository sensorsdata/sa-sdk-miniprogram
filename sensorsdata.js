/**
 * @fileoverview sensors analytic miniprogram sdk
 * @author shengyonggen@sensorsdata.cn
 */

var _ = {};

var sa = {};

sa.para = require('sensorsdata_conf.js');

// 初始化各种预定义参数
if (!sa.para.openid_url){
  sa.para.openid_url = sa.para.server_url.replace(/\/sa(\.gif){0,1}/, '/mp_login');
}


// 工具函数

var ArrayProto = Array.prototype,
  FuncProto = Function.prototype,
  ObjProto = Object.prototype,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty,
  LIB_VERSION = '1.3',
  LIB_NAME = 'MiniProgram';

var source_channel_standard = 'utm_source utm_medium utm_campaign utm_content utm_term';

var mp_scene = {
  1001: '发现栏小程序主入口',
  1005: '顶部搜索框的搜索结果页',
  1006: '发现栏小程序主入口搜索框的搜索结果页',
  1007: '单人聊天会话中的小程序消息卡片',
  1008: '群聊会话中的小程序消息卡片',
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
  1071: '钱包中的银行卡列表页',
  1072: '二维码收款页面',
  1073: '客服消息列表下发的小程序消息卡片',
  1074: '公众号会话下发的小程序消息卡片',
  1078: '连Wi-Fi成功页',
  1089: '微信聊天主界面下拉',
  1090: '长按小程序右上角菜单唤出最近使用历史',
  1092: '城市服务入口'
};


var sa_referrer = '直接打开';

var mpshow_time = null;

var is_first_launch = false;

sa.lib_version = LIB_VERSION;

var logger = typeof logger === 'object' ? logger : {};
logger.info = function () {
  if (typeof console === 'object' && console.log) {
    try {
      return console.log.apply(console, arguments);
    } catch (e) {
      console.log(arguments[0]);
    }
  }
};

(function () {
  var nativeBind = FuncProto.bind,
    nativeForEach = ArrayProto.forEach,
    nativeIndexOf = ArrayProto.indexOf,
    nativeIsArray = Array.isArray,
    breaker = {};

  var each = _.each = function (obj, iterator, context) {
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
  // 普通的extend，不能到二级
  _.extend = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        if (source[prop] !==
          void 0) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
  // 允许二级的extend
  _.extend2Lev = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      for (var prop in source) {
        if (source[prop] !==
          void 0) {
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
  // 如果已经有的属性不覆盖,如果没有的属性加进来
  _.coverExtend = function (obj) {
    each(slice.call(arguments, 1), function (source) {
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
    function (obj) {
      return toString.call(obj) === '[object Array]';
    };

  _.isFunction = function (f) {
    try {
      return /^\s*\bfunction\b/.test(f);
    } catch (x) {
      return false;
    }
  };

  _.isArguments = function (obj) {
    return !!(obj && hasOwnProperty.call(obj, 'callee'));
  };

  _.toArray = function (iterable) {
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

  _.values = function (obj) {
    var results = [];
    if (obj == null) {
      return results;
    }
    each(obj, function (value) {
      results[results.length] = value;
    });
    return results;
  };

  _.include = function (obj, target) {
    var found = false;
    if (obj == null) {
      return found;
    }
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
      return obj.indexOf(target) != -1;
    }
    each(obj, function (value) {
      if (found || (found = (value === target))) {
        return breaker;
      }
    });
    return found;
  };

})();

_.trim = function (str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

_.isObject = function (obj) {
  return (toString.call(obj) == '[object Object]') && (obj != null);
};

_.isEmptyObject = function (obj) {
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

_.isUndefined = function (obj) {
  return obj ===
    void 0;
};

_.isString = function (obj) {
  return toString.call(obj) == '[object String]';
};

_.isDate = function (obj) {
  return toString.call(obj) == '[object Date]';
};

_.isBoolean = function (obj) {
  return toString.call(obj) == '[object Boolean]';
};

_.isNumber = function (obj) {
  return (toString.call(obj) == '[object Number]' && /[\d\.]+/.test(String(obj)));
};

_.isJSONString = function (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
// gbk等编码decode会异常
_.decodeURIComponent = function (val) {
  var result = '';
  try {
    result = decodeURIComponent(val);
  } catch (e) {
    result = val;
  };
  return result;
};

_.encodeDates = function (obj) {
  _.each(obj, function (v, k) {
    if (_.isDate(v)) {
      obj[k] = _.formatDate(v);
    } else if (_.isObject(v)) {
      obj[k] = _.encodeDates(v);
      // recurse
    }
  });
  return obj;
};

_.formatDate = function (d) {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(d.getMilliseconds());
};

// 把日期格式全部转化成日期字符串
_.searchObjDate = function (o) {
  if (_.isObject(o)) {
    _.each(o, function (a, b) {
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
// 把字符串格式数据限制字符串长度
_.formatString = function (str) {
  if (str.length > sa.para.max_string_length) {
    logger.info('字符串长度超过限制，已经做截取--' + str);
    return str.slice(0, sa.para.max_string_length);
  } else {
    return str;
  }
};

// 把字符串格式数据限制字符串长度
_.searchObjString = function (o) {
  if (_.isObject(o)) {
    _.each(o, function (a, b) {
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

// 数组去重复
_.unique = function (ar) {
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

// 只能是sensors满足的数据格式
_.strip_sa_properties = function (p) {
  if (!_.isObject(p)) {
    return p;
  }
  _.each(p, function (v, k) {
    // 如果是数组，把值自动转换成string
    if (_.isArray(v)) {
      var temp = [];
      _.each(v, function (arrv) {
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
    // 只能是字符串，数字，日期,布尔，数组
    if (!(_.isString(v) || _.isNumber(v) || _.isDate(v) || _.isBoolean(v) || _.isArray(v))) {
      logger.info('您的数据-', v, '-格式不满足要求，我们已经将其删除');
      delete p[k];
    }
  });
  return p;
};

// 去掉undefined和null
_.strip_empty_properties = function (p) {
  var ret = {};
  _.each(p, function (v, k) {
    if (v != null) {
      ret[k] = v;
    }
  });
  return ret;
};

_.utf8Encode = function (string) {
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

_.base64Encode = function (data) {
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

_.getQueryParam = function (url, param) {
  url = _.decodeURIComponent(url);
  var regexS = "[\\?&]" + param + "=([^&#]*)",
    regex = new RegExp(regexS),
    results = regex.exec(url);
  if (results === null || (results && typeof (results[1]) !== 'string' && results[1].length)) {
    return '';
  } else {
    return _.decodeURIComponent(results[1]);
  }
};

// 发数据预存队列
sa.initialState = {
  queue : [],
  isComplete : false,
  systemIsComplete : false,
  storeIsComplete : false,
  checkIsComplete : function () {
    if (this.systemIsComplete && this.storeIsComplete) {
      this.isComplete = true;
      if (this.queue.length > 0) {
        _.each(this.queue, function (content) {
          sa[content[0]].apply(sa, slice.call(content[1]));
        });
        sa.queue = [];
      }
    }
  }
};

// 业务工具方法


_.getPrefixUtm = function (utms, prefix, prefix_add) {
  prefix = prefix || '';
  prefix_add = prefix_add || '_';
  if (!_.isObject(utms)) {
    return {};
  }
  var $utms = {}, otherUtms = {};
  for (var i in utms) {
    if ((' ' + source_channel_standard + ' ').indexOf(' ' + i + ' ') !== -1) {
      $utms[prefix + i] = utms[i];
    } else {
      otherUtms[prefix_add + i] = utms[i];
    }
  }
  return {
    $utms: $utms,
    otherUtms: otherUtms
  };
}

_.getSource = function (url) {
  var campagin_w = source_channel_standard.split(' ');
  var campaign_keywords = source_channel_standard.split(' ');
  var kw = '';
  var params = {};
  url = _.decodeURIComponent(url);
  url = url.split('?');
  if (url.length === 2) {
    url = url[1];
  } else {
    return {};
  }

  url = '?' + url;
  if (_.isArray(sa.para.source_channel) && sa.para.source_channel.length > 0) {
    campaign_keywords = campaign_keywords.concat(sa.para.source_channel);
    campaign_keywords = _.unique(campaign_keywords);
  }
  _.each(campaign_keywords, function (kwkey) {
    kw = _.getQueryParam(url, kwkey);
    if (kw.length) {
      if (_.include(campagin_w, kwkey)) {
        params[kwkey] = kw;
      }
    }
  });
  return params;
};

_.getUtm = function(url,prefix1,prefix2){
  var utms = _.getSource(url);
  var pre1 = {};
  var pre2 = {};
  if ((typeof prefix2 === 'undefined') && prefix1) {
    return {
      pre1: _.getPrefixUtm(utms, prefix1).$utms || {},
      pre2: {}
    };
  } else if (typeof prefix2 !== 'undefined' && prefix1){
    return {
      pre1: _.getPrefixUtm(utms, prefix1).$utms || {},
      pre2: _.getPrefixUtm(utms, prefix2).$utms || {}
    };
  } else {
    return {
      pre1:{},
      pre2:{}
    };
  }
}

_.getMPScene = function (key) {
  key = String(key);
  return mp_scene[key] || key;
};
_.info = {
  properties: {
    $lib: LIB_NAME,
    $lib_version: String(LIB_VERSION),
    $user_agent: 'SensorsAnalytics MP SDK'
  },
  getSystem: function () {
    var e = this.properties;
    var that = this;

    function getNetwork() {
      wx.getNetworkType({
        "success": function (t) {
          e.$network_type = t["networkType"]
        },
        "complete": getSystemInfo
      })
    }

    function getSystemInfo() {
      wx.getSystemInfo({
        "success": function (t) {
          e.$model = t["model"];
          e.$screen_width = Number(t["windowWidth"]);
          e.$screen_height = Number(t["windowHeight"]);
          e.$os = t["system"].split(' ')[0];
          e.$os_version = t["system"].split(' ')[1];
        },
        "complete": function(){
          sa.initialState.systemIsComplete = true;
          sa.initialState.checkIsComplete();
        }
      })
    }

    getNetwork();
  }
};

sa._ = _;



sa.prepareData = function (p, callback) {

  var data = {
    distinct_id: this.store.getDistinctId(),
    lib: {
      $lib: LIB_NAME,
      $lib_method: 'code',
      $lib_version: String(LIB_VERSION)
    },
    properties: {}
  };

  _.extend(data, p);

  // 合并properties里的属性
  if (_.isObject(p.properties) && !_.isEmptyObject(p.properties)) {
    _.extend(data.properties, p.properties);
  }

  // profile时不传公用属性
  if (!p.type || p.type.slice(0, 7) !== 'profile') {
    // 传入的属性 > 当前页面的属性 > session的属性 > cookie的属性 > 预定义属性
    data.properties = _.extend({}, _.info.properties, sa.store.getProps(), data.properties);

    // 判断是否是首日访问，果子说要做
    if (typeof sa.store._state === 'object' && typeof sa.store._state.first_visit_day_time === 'number' && sa.store._state.first_visit_day_time > (new Date()).getTime()) {
      data.properties.$is_first_day = true;
    } else {
      data.properties.$is_first_day = false;
    }
  }
  // 如果$time是传入的就用，否则使用服务端时间
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

  sa.send(data, callback);
};

sa.store = {
  // 防止重复请求
  storageInfo:null,
  getUUID: function () {
    return "" + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') + '-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);

  },
  getStorage: function () {
    if(this.storageInfo){
      return this.storageInfo;
    }else{
      this.storageInfo = wx.getStorageSync("sensorsdata2015_wechat") || '';
      return this.storageInfo;
    }
  },
  _state: {},
  toState: function (ds) {
    var state = null;
    if (_.isJSONString(ds)) {
      state = JSON.parse(ds);
      if (state.distinct_id) {
        this._state = state;
      } else {
        this.set('distinct_id', this.getUUID());
      }
    }else if (_.isObject(ds)) {
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
  getFirstId: function () {
    return this._state.first_id;
  },
  getDistinctId: function () {
    return this._state.distinct_id;
  },
  getProps: function () {
    return this._state.props || {};
  },
  setProps: function (newp, isCover) {
    var props = this._state.props || {};
    if (!isCover) {
      _.extend(props, newp);
      this.set('props', props);
    } else {
      this.set('props', newp);
    }
  },
  set: function (name, value) {
    var obj = {};
    if (typeof name === 'string') {
      obj[name] = value;
    } else if (typeof name === 'object') {
      obj = name;
    }
    this._state = this._state || {};
    for (var i in obj) {
      this._state[i] = obj[i];
    }
    this.save();
  },
  change: function (name, value) {
    this._state[name] = value;
  },
  save: function () {
    wx.setStorageSync("sensorsdata2015_wechat", this._state);
  },
  init: function () {
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
//      sa.setOnceProfile({$first_visit_time: new Date()});
      this.set({
        'distinct_id': this.getUUID(),
        'first_visit_time': visit_time,
        'first_visit_day_time': time.getTime()
      });
    }
  }
};

sa.setProfile = function (p, c) {
  sa.prepareData({
    type: 'profile_set',
    properties: p
  }, c);
};

sa.setOnceProfile = function (p, c) {
  sa.prepareData({
    type: 'profile_set_once',
    properties: p
  }, c);
};

sa.track = function (e, p, c) {
  this.prepareData({
    type: 'track',
    event: e,
    properties: p
  }, c);
};

sa.identify = function (id, isSave) {
  if (typeof id === 'number') {
    id = String(id);
  } else if (typeof id !== 'string') {
    return false;
  }
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

sa.trackSignup = function (id, e, p, c) {

  sa.prepareData({
    original_id: sa.store.getFirstId() || sa.store.getDistinctId(),
    distinct_id: id,
    type: 'track_signup',
    event: e,
    properties: p
  }, c);
  sa.store.set('distinct_id', id);
};

sa.registerApp = function(obj){
  if (_.isObject(obj) && !_.isEmptyObject(obj)) {
    _.info.properties = _.extend(_.info.properties, obj);
  }
};

sa.register = function (obj) {
  if (_.isObject(obj) && !_.isEmptyObject(obj)) {
    sa.store.setProps(obj);
  }
};

sa.clearAllRegister = function () {
  sa.store.setProps({}, true);
};

sa.login = function (id) {
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

// 获取openid，先从storage里获取，
sa.openid = {
  getRequest: function (callback) {
    wx.login({
      success: function (res) {
        if (res.code && sa.para.appid && sa.para.openid_url) {
          wx.request({
            url: sa.para.openid_url + '&code=' + res.code + '&appid=' + sa.para.appid,
            method: 'GET',
            complete: function (res2) {
              if (_.isObject(res2) && _.isObject(res2.data) && res2.data.openid){
                callback(res2.data.openid);
              }else{
                callback();
              }
            }
          });
        }else{
          callback();
        }
      }
    });
  },
  getWXStorage: function(){
    var storageInfo = sa.store.getStorage();
    if(storageInfo && _.isObject(storageInfo)){
      return storageInfo.openid;
    }
  },
  getOpenid: function(callback){
    if(!sa.para.appid){
      callback();
      return false;
    }
    var storageId = this.getWXStorage();
    if (storageId){
      callback(storageId);
    }else{
      this.getRequest(function(openid){
        if(openid){
          callback(openid);
        }
      });
    }
  }


};




sa.initial = function () {
  this._.info.getSystem();
  this.store.init();
  if (_.isObject(this.para.register)) {
    _.info.properties = _.extend(_.info.properties, this.para.register);
  }

};

sa.init = function(){
  sa.initialState.storeIsComplete = true;
  sa.initialState.checkIsComplete();
};


// 发送队列
_.autoExeQueue = function () {
  var queue = {
    // 简单队列
    items: [],
    enqueue: function (val) {
      this.items.push(val);
      this.start();
    },
    dequeue: function () {
      return this.items.shift();
    },
    getCurrentItem: function () {
      return this.items[0];
    },
    // 自动循环执行队列
    isRun: false,
    start: function () {
      if (this.items.length > 0 && !this.isRun) {
        this.isRun = true;
        this.getCurrentItem().start();
      }
    },
    close: function () {
      this.dequeue();
      this.isRun = false;
      this.start();
    }
  };
  return queue;
};

sa.requestQueue = function (para) {
  this.url = para.url;
};
sa.requestQueue.prototype.isEnd = function () {
  if (!this.received) {
    this.received = true;
    this.close();
  }
};
sa.requestQueue.prototype.start = function () {
  var me = this;
  setTimeout(function () {
    me.isEnd();
  }, 300);
  wx.request({
    url: this.url,
    method: 'GET',
    complete: function(){
      me.isEnd();
    }
  });
};

sa.dataQueue = _.autoExeQueue();

sa.send = function (t) {
  var url = '';
  t._nocache = (String(Math.random()) + String(Math.random()) + String(Math.random())).slice(2, 15);

  logger.info(t);

  t = JSON.stringify(t);

  if (sa.para.server_url.indexOf('?') !== -1) {
    url = sa.para.server_url + '&data=' + encodeURIComponent(_.base64Encode(t));
  } else {
    url = sa.para.server_url + '?data=' + encodeURIComponent(_.base64Encode(t));
  }
  var instance = new sa.requestQueue({
    url:url
  });
  instance.close = function () {
    sa.dataQueue.close();
  };
  sa.dataQueue.enqueue(instance);

};

sa.autoTrackCustom = function(api, prop, event) {
  var temp = sa.para.autoTrack[api];
  var tempFunc = '';
  if (sa.para.autoTrack && temp) {
    if (typeof temp === 'function') {
      tempFunc = temp();
      if(_.isObject(tempFunc)){
        _.extend(prop, tempFunc);
      }
    }else if(_.isObject(temp)){
      _.extend(prop, temp);
    }
    sa.track(event, prop);
  }
};

sa.setOpenid = function (openid, isCover){
  sa.store.set('openid', openid);
  if (isCover) {
    sa.store.set('distinct_id', openid);
  } else {
    sa.identify(openid, true);
  }
};

sa.initWithOpenid = function (options) {
  options = options || {};
  sa.openid.getOpenid(function (openid) {
    if (openid) {
      sa.setOpenid(openid,options.isCoverLogin);
    }
    sa.init();
  });

};

// 对所有提供的方法做代理暂存
_.each(['setProfile', 'setOnceProfile', 'track', 'register', 'clearAllRegister', 'autoTrackCustom', 'registerApp'],function(method){
  var temp = sa[method];
  sa[method] = function(){
    if (sa.initialState.isComplete){
      temp.apply(sa,arguments);
    }else{
      sa.initialState.queue.push([method,arguments]);
    }
  };
});


// 全局事件

function e(t, n, o) {
  if (t[n]) {
    var e = t[n];
    t[n] = function (t) {
      o.call(this, t, n);
      e.call(this, t);
    }
  } else
    t[n] = function (t) {
      o.call(this, t, n);
    }
}

function appLaunch(para) {
  this[sa.para.name] = sa;
  var prop = {};

  if (para && para.path) {
    prop.$url_path = para.path;
  }
  // 暂时只解析传统网页渠道的query
  if (para && _.isObject(para.query) && para.query.q) {
    var utms = _.getUtm(para.query.q,'$','$latest_');
    _.extend(prop, utms.pre1);
    if (is_first_launch){
      sa.setOnceProfile(utms.pre1);
    }
    sa.registerApp(utms.pre2);
  }
  prop.$scene = _.getMPScene(para.scene);
  //  console.log('app_launch', JSON.stringify(arguments));
  if (sa.para.autoTrack && sa.para.autoTrack.appLaunch === true) {
    sa.autoTrackCustom('appLaunch', prop, '$MPLaunch');
  }

};

function appShow(para) {
  //  console.log('app_show', JSON.stringify(arguments));
  var prop = {};

  mpshow_time = (new Date()).getTime();

  if (para && para.path) {
    prop.$url_path = para.path;
  }
  
  // 暂时只解析传统网页渠道的query
  if (para && _.isObject(para.query) && para.query.q) {
    var utms = _.getUtm(para.query.q, '$', '$latest_');
    _.extend(prop, utms.pre1);
    sa.registerApp(utms.pre2);
  }
  prop.$scene = _.getMPScene(para.scene);
  if (sa.para.autoTrack && sa.para.autoTrack.appShow === true) {
    sa.autoTrackCustom('appShow',prop,'$MPShow');
  }
};

function appHide() {
  var current_time = (new Date()).getTime();
  var prop = {};
  if (mpshow_time && (current_time - mpshow_time > 0) && ((current_time - mpshow_time)/3600000 < 24) ) {
    prop.event_duration = (current_time - mpshow_time)/1000;
  }
  if (sa.para.autoTrack && sa.para.autoTrack.appHide === true) {

    sa.autoTrackCustom('appHide', prop, '$MPHide');
  }
  //  console.log('app_hide', JSON.stringify(arguments));
  //  sa.track('app_hide', { detail: JSON.stringify(arguments) });
};

function appError() {
  //  console.log('app_error', JSON.stringify(arguments));
  //  sa.track('app_error', { detail: JSON.stringify(arguments) });
}
function appUnLaunch() {
  //  console.log('app_unlaunch', JSON.stringify(arguments));
  //  sa.track('app_unlaunch', { detail: JSON.stringify(arguments) });
}

var p = App;

App = function (t) {
  e(t, "onLaunch", appLaunch);
  e(t, "onShow", appShow);
  //  e(t, "onUnLaunch", appUnLaunch);
  e(t, "onHide", appHide);
  //  e(t, "onError",appError);
  p(t);
};

function pageOnunload(n, e) {

  // console.log('s-page_unload', JSON.stringify(arguments));
  //  sa.track('page_unload', { detail: JSON.stringify(arguments) });  
}

function pageOnHide() {
  // console.log('s-page_hide', JSON.stringify(arguments));
  //  sa.track('page_hide', { detail: JSON.stringify(arguments) });
}

function pageOnReady() {
  // console.log('s-page_ready', JSON.stringify(arguments));
  //  sa.track('page_ready', { detail: JSON.stringify(arguments) });
}

function pageOnPullDownRefresh() {
  //  console.log('page_PullDownRefresh', JSON.stringify(arguments));
  //  sa.track('page_PullDownRefresh', { detail: JSON.stringify(arguments) });
}

function pageOnReachBottom() {
  //  console.log('page_ReachBottom', JSON.stringify(arguments));
  //  sa.track('page_ReachBottom', { detail: JSON.stringify(arguments) };
}
function pageOnShareAppMessage(n, e) {
  //  console.log('page_ShareAppMessage', JSON.stringify(arguments));
  //  sa.track('page_ShareAppMessage', { detail: JSON.stringify(arguments) });
}

var v = Page;
Page = function (t) {
  e(t, "onLoad", function (para) {
    // 暂时只解析传统网页渠道的query
    if (para && _.isObject(para) && para.q) {
      this.sensors_mp_load_utm = _.getUtm(para.q,'$').pre1;
    }
  });

  e(t, "onShow", function () {
    var router = '系统没有取到值';
    if (typeof this === 'object') {
      if (typeof this.route === 'string') {
        router = this.route;
      } else if (typeof this.__route__ === 'string') {
        router = this.__route__;
      }
    }

    var prop = {};
    prop.$referrer = sa_referrer;
    prop.$url_path = router;
    if (this.sensors_mp_load_utm){
      _.extend(prop, this.sensors_mp_load_utm);
      this.sensors_mp_load_utm = null;
    }
    if (sa.para.onshow) {
      sa.para.onshow(sa, router, this);
    } else {
      sa.autoTrackCustom('pageShow', prop, '$MPViewScreen');
    }
    sa_referrer = router;
  });

  //	e(t, "onHide", pageOnHide);

  //  e(t, "onReady", pageOnReady);
  //  e(t, "onPullDownRefresh", pageOnPullDownRefresh);
  //  e(t, "onReachBottom", pageOnReachBottom);
  //  e(t, "onShareAppMessage", pageOnShareAppMessage);


  v(t);

}

sa.initial();


module.exports = sa;
