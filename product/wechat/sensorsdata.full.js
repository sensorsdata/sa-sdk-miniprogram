'use strict';

/**
 * @fileoverview sensors analytic miniprogram sdk
 */

var sa = {};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-04 15:32:15
 * @File:
 */
// sdk 的核心配置对象
// var saPara = {};

// 默认配置
var saPara = {
  // 神策分析注册在APP全局函数中的变量名，在非app.js中可以通过getApp().sensors(你这里定义的名字来使用)
  name: 'sensors',
  // 神策分析数据接收地址
  server_url: '',
  //默认使用队列发数据时候，两条数据发送间的最大间隔
  send_timeout: 1000,
  // 是否允许控制台打印查看埋点数据（建议开启查看）
  show_log: false,
  login_id_key: '$identity_login_id',
  // 是否允许修改onShareMessage里return的path，用来增加（用户id，分享层级，当前的path），在app onshow中自动获取这些参数来查看具体分享来源，层级等
  allow_amend_share_path: true,
  max_string_length: 500,
  datasend_timeout: 3000,
  source_channel: [],
  autoTrack: {
    appLaunch: true, //是否采集 $MPLaunch 事件，true 代表开启。
    appShow: true, //是否采集 $MPShow 事件，true 代表开启。
    appHide: true, //是否采集 $MPHide 事件，true 代表开启。
    pageShow: true, //是否采集 $MPViewScreen 事件，true 代表开启。
    pageShare: true, //是否采集 $MPShare 事件，true 代表开启。
    mpClick: false, // 是否采集 $MPClick 事件，true 代表开启。
    mpFavorite: true, // 是否采集 $MPAddFavorites 事件，true 代表开启。
    pageLeave: false // 是否采集页面浏览时长,默认不开启
  },
  autotrack_exclude_page: {
    pageShow: [],
    pageLeave: []
  },
  //是否允许将最近一次站外渠道信息保存到 wxStorage 中
  is_persistent_save: {
    share: false, // share 相关信息
    utm: false // utm 相关信息
  },

  preset_properties: {
    url_path: true //默认开启所有事件都采集
  },
  // 是否集成了插件！重要！
  // is_plugin: false
  //客户预置事件合集
  preset_events: {
    moments_page: false, // 处于单页模式是否开启数据发送，默认 false 不开启发送
    defer_track: false, // 上报点击埋点事件方式，默认同步，设置为真时会放入异步队列中
    share_info_use_string: false //分享信息设置区分 A B 版本 URL 链接拼接方式不一样
  },
  batch_send: true,
  storage_store_key: 'sensorsdata2015_wechat',
  storage_prepare_data_key: 'sensors_mp_prepare_data'
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-08 16:52:52
 * @File:
 */

function log() {
  if (saPara.show_log) {
    if (typeof console === 'object' && console.log) {
      try {
        return console.log.apply(console, arguments);
      } catch (e) {
        console.log(arguments[0]);
      }
    }
  }
}

/**
 * 判断是否为 Object
 * @param {*} obj
 * @returns {boolean}
 */

var nativeIsArray = Array.isArray,
  ObjProto = Object.prototype,
  ArrayProto = Array.prototype;

var nativeForEach = ArrayProto.forEach,
  nativeIndexOf = ArrayProto.indexOf,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty,
  slice = ArrayProto.slice;

/**
 *
 * @param {obj}} 遍历对象
 * @param {function} 回调方法
 * @param {obj} 回调方法绑定的 this 对象
 * @returns
 */
function each(obj, iterator, context) {
  if (obj == null) {
    return false;
  }
  var breaker = {};
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return false;
      }
    }
  } else {
    for (var item in obj) {
      if (hasOwnProperty.call(obj, item)) {
        if (iterator.call(context, obj[item], item, obj) === breaker) {
          return false;
        }
      }
    }
  }
}

/**
 *
 * @param {obj} 传入参数
 * @return {boolean}
 */
function isObject(obj) {
  if (obj === undefined || obj === null) {
    return false;
  } else {
    return toString.call(obj) == '[object Object]';
  }
}

/**
 * 返回 rand 方法
 * @param {number} 10^19 必传参数
 * @return {number}
 */
var getRandomBasic = (function () {
  var today = new Date();
  var seed = today.getTime();
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
  }
  return function rand(number) {
    return Math.ceil(rnd() * number);
  };
})();

/**
 * 生成一个随机数
 * @return {number}
 */
function getRandom() {
  if (typeof Uint32Array === 'function') {
    var cry = '';
    if (typeof crypto !== 'undefined') {
      cry = crypto;
    } else if (typeof msCrypto !== 'undefined') {
      cry = msCrypto;
    }
    if (isObject(cry) && cry.getRandomValues) {
      var typedArray = new Uint32Array(1);
      var randomNumber = cry.getRandomValues(typedArray)[0];
      var integerLimit = Math.pow(2, 32);
      return randomNumber / integerLimit;
    }
  }
  return getRandomBasic(10000000000000000000) / 10000000000000000000;
}

/**
 * 继承简单对象
 * @param {*} obj
 * @returns
 */
function extend(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

/**
 * 继承多层对象
 * @param {object}} obj
 */
function extend2Lev(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && source[prop] !== null) {
        if (isObject(source[prop]) && isObject(obj[prop])) {
          extend(obj[prop], source[prop]);
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
}

/**
 * 属性继承，对已有属性不处理
 * @param {*} obj
 * @return {object}
 */
function coverExtend(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && obj[prop] === void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

/**
 * 判断是否是一个数组
 */
var isArray =
  nativeIsArray ||
  function (obj) {
    return toString.call(obj) === '[object Array]';
  };

/**
 * 判断是否是一个方法
 * @param {function} f
 * @return {boolean}
 */
function isFunction(f) {
  if (!f) {
    return false;
  }
  var type = Object.prototype.toString.call(f);
  return type == '[object Function]' || type == '[object AsyncFunction]';
}

/**
 * 判断是否为一个参数对象
 * @param {obj} obj
 * @return {boolean}
 */
function isArguments(obj) {
  return !!(obj && hasOwnProperty.call(obj, 'callee'));
}

/**
 * 转成数组返回
 * @param {*} iterable
 * @return {array}
 */
function toArray(iterable) {
  if (!iterable) {
    return [];
  }
  if (iterable.toArray) {
    return iterable.toArray();
  }
  if (isArray(iterable)) {
    return slice.call(iterable);
  }
  if (isArguments(iterable)) {
    return slice.call(iterable);
  }
  return values(iterable);
}

/**
 * 将对象每一项以数组返回
 * @param {*} obj
 * @return {array}
 */
function values(obj) {
  var results = [];
  if (obj == null) {
    return results;
  }
  each(obj, function (value) {
    results[results.length] = value;
  });
  return results;
}

/**
 * 是否包含某项
 * @param {} obj
 * @param {*} target
 * @returns
 */
function include(obj, target) {
  var found = false;
  if (obj == null) {
    return found;
  }
  if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
    return obj.indexOf(target) != -1;
  }
  each(obj, function (value) {
    if (found || (found = value === target)) {
      return {};
    }
  });
  return found;
}

/**
 * 去掉空字符
 * @param {*} str
 * @returns
 */
function trim(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/**
 * 判断是否为一个空对象
 * @param {object} obj
 * @returns
 */
function isEmptyObject(obj) {
  if (isObject(obj)) {
    for (var item in obj) {
      if (hasOwnProperty.call(obj, item)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

/**
 * 深复制对象
 * @param {object} obj
 * @returns
 */
function deepCopy(obj) {
  var temp = {};
  function deepClone(target, source) {
    for (var k in source) {
      var item = source[k];
      if (isArray(item)) {
        target[k] = [];
        deepClone(target[k], item);
      } else if (isObject(item)) {
        target[k] = {};
        deepClone(target[k], item);
      } else {
        target[k] = item;
      }
    }
  }
  deepClone(temp, obj);
  return temp;
}

/**
 * 判断是否是 undefined 类型
 * @param {*} obj
 * @returns
 */
function isUndefined(obj) {
  return obj === void 0;
}

/**
 * 判断是否是一个字符串
 * @param {*}
 * @returns
 */
function isString(obj) {
  return toString.call(obj) == '[object String]';
}

/**
 * 判断是否为 Date 类型
 * @param {*} obj
 * @returns
 */
function isDate(obj) {
  return toString.call(obj) == '[object Date]';
}

/**
 * 判断是否为布尔类型
 * @param {*} obj
 * @returns
 */
function isBoolean(obj) {
  return toString.call(obj) == '[object Boolean]';
}

/**
 * 判断是否为 Number 类型
 * @param {*} obj
 * @returns
 */
function isNumber(obj) {
  return toString.call(obj) == '[object Number]' && /[\d\\.]+/.test(String(obj));
}

/**
 * 判断是否为 JSON 字符串
 * @param {*} str
 * @returns
 */
function isJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * 判断是否为整数类型
 */
var isInteger =
  Number.isInteger ||
  function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };

/**
 * 判断是否为安全整数类型
 */
var isSafeInteger =
  Number.isSafeInteger ||
  function (value) {
    return isInteger(value) && Math.abs(value) <= Math.pow(2, 53) - 1;
  };

var urlSafeBase64 = {
  ENC: {
    '+': '-',
    '/': '_',
    '=': '.'
  },
  DEC: {
    '-': '+',
    _: '/',
    '.': '='
  },
  /**
   * encode base64 string url safe
   * @param {String} base64 - base64 encoded string
   * @return {String} url-safe-base64 encoded
   */
  encode: function (base64) {
    return base64.replace(/[+/=]/g, function (m) {
      return urlSafeBase64.ENC[m];
    });
  },
  /**
   * decode url-safe-base64 string to base64
   * @param {String} safe - url-safe-base64 string
   * @return {String} base64 encoded
   */
  decode: function (safe) {
    return safe.replace(/[-_.]/g, function (m) {
      return urlSafeBase64.DEC[m];
    });
  },
  /**
   * trim padding - `window.atob` might handle trimmed strings, e.g. in Chrome@57, Firefox@52
   * @param {String} string - base64 or url-safe-base64 string
   * @return {String} string with padding chars removed
   */
  trim: function (string) {
    return string.replace(/[.=]{1,2}$/, '');
  },
  /**
   * checks if `string` is base64 encoded
   * @param {String} string
   * @return {Boolean} true if base64 encoded
   */
  isBase64: function (string) {
    return /^[A-Za-z0-9+/]*[=]{0,2}$/.test(string);
  },
  /**
   * checks if `string` is url-safe-base64 encoded
   * @param {String} string
   * @return {Boolean} true if url-safe-base64 encoded
   */
  isUrlSafeBase64: function (string) {
    return /^[A-Za-z0-9_-]*[.]{0,2}$/.test(string);
  }
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-09 11:36:17
 * @File:
 */
var SOURCE_CHANNEL_STANDARD = 'utm_source utm_medium utm_campaign utm_content utm_term';
var LATEST_SOURCE_CHANNEL = ['$latest_utm_source', '$latest_utm_medium', '$latest_utm_campaign', '$latest_utm_content', '$latest_utm_term', '$latest_sa_utm'];
var LATEST_SHARE_INFO = ['$latest_share_distinct_id', '$latest_share_url_path', '$latest_share_depth', '$latest_share_method'];
var SHARE_INFO_KEY = ['sensors_share_d', 'sensors_share_p', 'sensors_share_i', 'sensors_share_m'];

var MP_FILTER_HOOK = {
  data: 1,
  onLoad: 1,
  onShow: 1,
  onReady: 1,
  onPullDownRefresh: 1,
  onShareAppMessage: 1,
  onShareTimeline: 1,
  onReachBottom: 1,
  onPageScroll: 1,
  onResize: 1,
  onTabItemTap: 1,
  onHide: 1,
  onUnload: 1
};

var IDENTITY_KEY = {
  EMAIL: '$identity_email',
  MOBILE: '$identity_mobile',
  LOGIN: '$identity_login_id'
};

var LIB_VERSION = '1.19.12';
var LIB_NAME = 'MiniProgram';

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-05-07 14:40:11
 * @File: 全局变量均放到 meta 对象中，减少对外暴露的变量，方便统一管理
 */

var meta = {
  init_status: false,
  life_state: {
    app_launched: false
  },
  plugin: {
    init_list: [],
    uninitialized_list: []
  },
  privacy: {
    enable_data_collect: false
  },
  initialState: {
    queue: [],
    isComplete: false
  },
  preset_properties: {
    $lib: LIB_NAME,
    $lib_version: LIB_VERSION
  },
  promise_list: [],
  query_share_depth: 0,
  page_show_time: Date.now(),
  mp_show_time: null,
  share_distinct_id: '',
  share_method: '',
  current_scene: '',
  is_first_launch: false,
  wx_sdk_version: '',
  global_title: {},
  page_route_map: []
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-05 11:29:48
 * @File:
 */

function getAppInfoSync() {
  if (wx.getAccountInfoSync) {
    var info = wx.getAccountInfoSync(),
      accountInfo = info && info.miniProgram ? info.miniProgram : {};
    return {
      appId: accountInfo.appId,
      appEnv: accountInfo.envVersion,
      appVersion: accountInfo.version
    };
  }
  return {};
}

function getAppId() {
  var info = getAppInfoSync();
  if (info && info.appId) {
    return info.appId;
  }
  return '';
}

function getOpenidNameByAppid() {
  var appid = getAppId();
  var name = '$identity_mp_openid';
  if (appid) {
    name = '$identity_mp_' + appid + '_openid';
  }
  return name;
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-05 12:07:14
 * @File:
 */
/**
 * De-obfuscate an obfuscated string with the method above.
 */
function rot13defs(str) {
  var code_len = 13,
    n = 126;
  str = String(str);
  return rot13obfs(str, n - code_len);
}

/**
 * Obfuscate a plaintext string with a simple rotation algorithm similar to
 * the rot13 cipher.
 */
function rot13obfs(str, code_len) {
  str = String(str);
  code_len = typeof code_len === 'number' ? code_len : 13;
  var n = 126;

  var chars = str.split('');

  for (var i = 0, len = chars.length; i < len; i++) {
    var c = chars[i].charCodeAt(0);

    if (c < n) {
      chars[i] = String.fromCharCode((chars[i].charCodeAt(0) + code_len) % n);
    }
  }

  return chars.join('');
}

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

var store = {
  // 防止重复请求
  storageInfo: null,
  store_queue: [],
  getUUID: function () {
    return (
      '' +
      Date.now() +
      '-' +
      Math.floor(1e7 * getRandom()) +
      '-' +
      getRandom().toString(16).replace('.', '') +
      '-' +
      String(getRandom() * 31242)
        .replace('.', '')
        .slice(0, 8)
    );
  },
  getStorage: function () {
    if (this.storageInfo) {
      return this.storageInfo;
    } else {
      this.storageInfo = sa._.getStorageSync(saPara.storage_store_key) || '';
      return this.storageInfo;
    }
  },
  _state: {},
  // 未存储到storage中的内存数据
  mem: {
    mdata: [],
    getLength: function () {
      return this.mdata.length;
    },
    add: function (data) {
      this.mdata.push(data);
    },
    clear: function (len) {
      this.mdata.splice(0, len);
    }
  },
  toState: function (ds) {
    var state = null;
    var _this = this;
    function isStateDistinctId() {
      if (state.distinct_id) {
        _this._state = state;
      } else {
        _this.set('distinct_id', _this.getUUID());
      }
    }
    if (isJSONString(ds)) {
      state = JSON.parse(ds);
      isStateDistinctId();
    } else if (isObject(ds)) {
      state = ds;
      isStateDistinctId();
    } else {
      this.set('distinct_id', this.getUUID());
    }
    // 在初始化同步 storage ID 属性到内存中时，将对应的 identities 对象进行处理
    var first_id = this._state._first_id || this._state.first_id;
    var distinct_id = this._state._distinct_id || this._state.distinct_id;
    var openid = this._state.openid;
    var history_login_id = this._state.history_login_id ? this._state.history_login_id : {};
    var old_login_id_name = history_login_id.name;
    // 解密 iddentities
    if (this._state.identities && isString(this._state.identities)) {
      var identities = JSON.parse(rot13defs(this._state.identities));
      this._state.identities = identities;
    }

    // 获取当前 opneid 的 key 值
    var openid_name = getOpenidNameByAppid();
    /**
     * 由于 1.16.1 版本上线时，发现 1.16.1 版本 $mp_id、$mp_unionid、$mp_{appid}_openid 与其他业务线（SF）ID 冲突，且此版本上线 5 天后才下线，已经存在客户使用，故对此逻辑做兼容处理
     */
    function getOldOpenidNameByAppid() {
      var appid = getAppId();
      var name = '$mp_openid';
      if (appid) {
        name = '$mp_' + appid + '_openid';
      }
      return name;
    }

    // 初始化处理匿名 ID 及 初始化 identities
    if (this._state.identities && isObject(this._state.identities) && !isEmptyObject(this._state.identities)) {
      var old_openid_name = getOldOpenidNameByAppid();
      if (hasOwnProperty$1.call(this._state.identities, '$mp_id')) {
        this._state.identities['$identity_mp_id'] = this._state.identities['$mp_id'];
        delete this._state.identities['$mp_id'];
      }
      if (hasOwnProperty$1.call(this._state.identities, '$mp_unionid')) {
        this._state.identities['$identity_mp_unionid'] = this._state.identities['$mp_unionid'];
        delete this._state.identities['$mp_unionid'];
      }
      if (hasOwnProperty$1.call(this._state.identities, old_openid_name)) {
        this._state.identities[openid_name] = this._state.identities[old_openid_name];
        delete this._state.identities[old_openid_name];
      }
    } else {
      this._state.identities = {};
      this._state.identities.$identity_mp_id = this.getUUID();
    }
    // 单独处理 openid
    if (openid) {
      this._state.identities[openid_name] = openid;
    }

    function delIdentitiesProp(value) {
      for (var identitiesProp in store._state.identities) {
        if (hasOwnProperty$1.call(store._state.identities, identitiesProp)) {
          if (identitiesProp !== '$identity_mp_id' && identitiesProp !== value) {
            delete store._state.identities[identitiesProp];
          }
        }
      }
    }

    // 以下处理登录 ID 的相关逻辑
    if (first_id) {
      // 处理存在老的 3.0 登录 ID 逻辑，及不存在登录 ID 的情况
      if (old_login_id_name && hasOwnProperty$1.call(this._state.identities, old_login_id_name)) {
        if (this._state.identities[old_login_id_name] !== distinct_id) {
          this._state.identities[old_login_id_name] = distinct_id;
          delIdentitiesProp(old_login_id_name);
          this._state.history_login_id.value = distinct_id;
        }
      } else {
        this._state.identities[IDENTITY_KEY.LOGIN] = distinct_id;
        delIdentitiesProp(IDENTITY_KEY.LOGIN);
        this._state.history_login_id = {
          name: IDENTITY_KEY.LOGIN,
          value: distinct_id
        };
      }
    } else {
      // 处理 3.0 降到 2.0 后调用 logout 但是 3.0 的登录 ID 依旧存在的情况
      this._state.history_login_id = {
        name: '',
        value: ''
      };
    }
    this.save();
  },
  getFirstId: function () {
    return this._state._first_id || this._state.first_id;
  },
  /**
   * 获取当前 distinct_id，如果有 IDM3 状态下的登录的 distinctId 则返回此 ID 值，若没有则返回当前的匿名 ID
   * @returns distinct_id
   */
  getDistinctId: function () {
    var loginDistinctId = this.getLoginDistinctId();
    if (loginDistinctId) {
      return loginDistinctId;
    } else {
      return this._state._distinct_id || this._state.distinct_id;
    }
  },
  getUnionId: function () {
    var obj = {};
    var first_id = this._state._first_id || this._state.first_id;
    var distinct_id = this.getDistinctId();
    if (first_id && distinct_id) {
      obj['login_id'] = distinct_id;
      obj['anonymous_id'] = first_id;
    } else {
      obj['anonymous_id'] = distinct_id;
    }
    return obj;
  },
  /**
   * 新增 getHistoryLoginId 接口，用以获取到老的登录用户 ID 标识
   */
  getHistoryLoginId: function () {
    if (isObject(this._state.history_login_id)) {
      return this._state.history_login_id;
    } else {
      return null;
    }
  },
  /**
   * 获取当前的登录情况下的 distinctId
   * 获取当前 distinct_id，如果为 IDM3 登录 ID，则值为登录 ID 的 name + value 的格式
   * 如果为非登录状态，则直接返回 null，标识无值
   */
  getLoginDistinctId: function () {
    var historyLoginId = this.getHistoryLoginId();
    // 存在登录 ID 对象，且登录 ID 值为真（排除登录后登出，保存 history_login_id 对象，但清空属性值的情况）;否则为未登录状态，直接取当前的 distinct_id
    if (isObject(historyLoginId) && historyLoginId.value) {
      if (historyLoginId.name !== IDENTITY_KEY.LOGIN) {
        return historyLoginId.name + '+' + historyLoginId.value;
      } else {
        return historyLoginId.value;
      }
    } else {
      return null;
    }
  },
  getProps: function () {
    return this._state.props || {};
  },
  setProps: function (newp, isCover) {
    var props = this._state.props || {};
    if (!isCover) {
      extend(props, newp);
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
      // 如果set('first_id') 或者 set('distinct_id')，删除对应的临时属性
      if (i === 'first_id') {
        delete this._state._first_id;
      } else if (i === 'distinct_id') {
        delete this._state._distinct_id;
        sa.events.emit('changeDistinctId');
      }
    }
    this.save();
  },
  identitiesSet: function (params) {
    var identities = {};
    switch (params.type) {
    case 'login':
      identities.$identity_mp_id = this._state.identities.$identity_mp_id;
      identities[params.id_name] = params.id;
      break;
    case 'logout':
      identities.$identity_mp_id = this._state.identities.$identity_mp_id;
      break;
    }
    this.set('identities', identities);
  },
  change: function (name, value) {
    this._state['_' + name] = value;
  },
  encryptStorage: function () {
    var copyState = this.getStorage();
    var flag = 'data:enc;';
    if (isObject(copyState)) {
      copyState = flag + rot13obfs(JSON.stringify(copyState));
    } else if (isString(copyState)) {
      if (copyState.indexOf(flag) === -1) {
        copyState = flag + rot13obfs(copyState);
      }
    }
    sa._.setStorageSync(saPara.storage_store_key, copyState);
  },
  save: function () {
    // 深拷贝避免修改原对象
    var copyState = deepCopy(this._state);
    // 对 identitie 进行加密
    var identities = rot13obfs(JSON.stringify(copyState.identities));
    copyState.identities = identities;
    // 删除临时属性避免写入微信 storage
    delete copyState._first_id;
    delete copyState._distinct_id;
    // 是否开启本地存储加密
    if (saPara.encrypt_storage) {
      var flag = 'data:enc;';
      copyState = flag + rot13obfs(JSON.stringify(copyState));
    }
    sa._.setStorageSync(saPara.storage_store_key, copyState);
  },
  init: function () {
    var info = this.getStorage();
    var flag = 'data:enc;';
    var uuid = store.getUUID();
    if (info) {
      if (isString(info)) {
        //判断是否有加密的字段 有就解密
        if (info.indexOf(flag) !== -1) {
          info = info.substring(flag.length);
          info = JSON.parse(rot13defs(info));
        }
      }
      this.toState(info);
    } else {
      meta.is_first_launch = true;
      var time = new Date();
      var visit_time = time.getTime();
      time.setHours(23);
      time.setMinutes(59);
      time.setSeconds(60);
      this.set({
        distinct_id: uuid,
        first_visit_time: visit_time,
        first_visit_day_time: time.getTime(),
        identities: {
          $identity_mp_id: uuid
        },
        history_login_id: {
          name: '',
          value: ''
        }
      });
    }

    this.checkStoreInit();
  },
  checkStoreInit: function () {
    if (meta.init_status) {
      if (this.store_queue.length > 0) {
        each(this.store_queue, function (item) {
          sa[item.method].apply(sa, slice.call(item.params));
        });
      }
      this.store_queue = [];
    }
  }
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-08-08 15:54:39
 * @File:
 */
// gbk等编码decode会异常
function _decodeURIComponent(val) {
  var result = '';
  try {
    result = decodeURIComponent(val);
  } catch (e) {
    result = val;
  }
  return result;
}

var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
var decodeURIComponent$1 = _decodeURIComponent;

/**
 * 初始化 App 的监听
 */
function initAppGlobalName() {
  var oldApp = App;
  App = function (option) {
    option[saPara.name] = sa;
    oldApp.apply(this, arguments);
  };
}

/**
 * @param {*} data 数据
 */
function getPublicPresetProperties() {
  var refPage = getRefPage();
  var pageInfo = getCurrentPageInfo();
  var propertiesMap = {
    $referrer: refPage.route,
    $referrer_title: refPage.title,
    $title: pageInfo.title,
    $url: pageInfo.url
  };
  if (saPara.preset_properties.url_path === true) {
    propertiesMap.$url_path = pageInfo.path;
  }
  return propertiesMap;
}

function encodeDates(obj) {
  each(obj, function (v, k) {
    if (isDate(v)) {
      obj[k] = formatDate(v);
    } else if (isObject(v)) {
      obj[k] = encodeDates(v);
      // recurse
    }
  });
  return obj;
}

function formatDate(d) {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(d.getMilliseconds());
}

// 把日期格式全部转化成日期字符串
function searchObjDate(o) {
  if (isObject(o) || isArray(o)) {
    each(o, function (a, b) {
      if (isObject(a) || isArray(a)) {
        searchObjDate(o[b]);
      } else {
        if (isDate(a)) {
          o[b] = formatDate(a);
        }
      }
    });
  }
}
// 把字符串格式数据限制字符串长度
function formatString(str) {
  if (str.length > saPara.max_string_length) {
    log('字符串长度超过限制，已经做截取--' + str);
    return str.slice(0, saPara.max_string_length);
  } else {
    return str;
  }
}

// 把字符串格式数据限制字符串长度
function searchObjString(o) {
  if (isObject(o)) {
    each(o, function (a, b) {
      if (isObject(a)) {
        searchObjString(o[b]);
      } else {
        if (isString(a)) {
          o[b] = formatString(a);
        }
      }
    });
  }
}

// 处理动态公共属性
function parseSuperProperties(obj) {
  if (isObject(obj)) {
    each(obj, function (value, item) {
      if (isFunction(value)) {
        try {
          obj[item] = value();
          if (isFunction(obj[item])) {
            log('您的属性- ' + item + ' 格式不满足要求，我们已经将其删除');
            delete obj[item];
          }
        } catch (e) {
          delete obj[item];
          log('您的属性- ' + item + ' 抛出了异常，我们已经将其删除');
        }
      }
    });
  }
}

// 数组去重复
function unique(ar) {
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
}

var check = {
  // 检查关键字
  checkKeyword: function (para) {
    var reg = /^((?!^distinct_id$|^original_id$|^device_id$|^time$|^properties$|^id$|^first_id$|^second_id$|^users$|^events$|^event$|^user_id$|^date$|^datetime$|^user_group|^user_tag)[a-zA-Z_$][a-zA-Z\d_$]{0,99})$/i;
    return reg.test(para);
  },

  // 检查 id 字符串长度
  checkIdLength: function (str) {
    var temp = String(str);
    if (temp.length > 255) {
      log('id 长度超过 255 个字符！');
      return false;
    }
    return true;
  }
};

// 只能是sensors满足的数据格式
function strip_sa_properties(p) {
  if (!isObject(p)) {
    return p;
  }
  each(p, function (v, k) {
    // 如果是数组，把值自动转换成string
    if (isArray(v)) {
      var temp = [];
      each(v, function (arrv) {
        if (isString(arrv)) {
          temp.push(arrv);
        } else if (isUndefined(arrv)) {
          temp.push('null');
        } else {
          try {
            temp.push(JSON.stringify(arrv));
          } catch (error) {
            log('您的数据 - ' + k + ':' + v + ' - 的数组里的值有错误,已经将其删除');
          }
        }
      });
      p[k] = temp;
    }
    //如果是多层结构对象，直接序列化为字符串
    if (isObject(v)) {
      try {
        p[k] = JSON.stringify(v);
      } catch (error) {
        delete p[k];
        log('您的数据 - ' + k + ':' + v + ' - 的数据值有错误,已经将其删除');
      }
    } else if (!(isString(v) || isNumber(v) || isDate(v) || isBoolean(v) || isArray(v))) {
      // 只能是字符串，数字，日期,布尔，数组
      log('您的数据 - ' + k + ':' + v + ' - 格式不满足要求，已经将其删除');
      delete p[k];
    }
  });
  return p;
}

// 去掉undefined和null
function strip_empty_properties(p) {
  var ret = {};
  each(p, function (v, k) {
    if (v != null || v !== undefined) {
      ret[k] = v;
    }
  });
  return ret;
}

function utf8Encode(string) {
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
    } else if (c1 > 127 && c1 < 2048) {
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
}

function base64Encode(data) {
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
  data = utf8Encode(data);
  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = (o1 << 16) | (o2 << 8) | o3;

    h1 = (bits >> 18) & 0x3f;
    h2 = (bits >> 12) & 0x3f;
    h3 = (bits >> 6) & 0x3f;
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
}

function btoa(string) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  string = String(string);
  var bitmap,
    a,
    b,
    c,
    result = '',
    i = 0,
    rest = string.length % 3; // To determine the final padding

  for (; i < string.length; ) {
    if ((a = string.charCodeAt(i++)) > 255 || (b = string.charCodeAt(i++)) > 255 || (c = string.charCodeAt(i++)) > 255) {
      log('Failed to execute \'btoa\' : The string to be encoded contains characters outside of the Latin1 range.');
    }
    bitmap = (a << 16) | (b << 8) | c;
    result += b64.charAt((bitmap >> 18) & 63) + b64.charAt((bitmap >> 12) & 63) + b64.charAt((bitmap >> 6) & 63) + b64.charAt(bitmap & 63);
  }

  // If there's need of padding, replace the last 'A's with equal signs
  return rest ? result.slice(0, rest - 3) + '==='.substring(rest) : result;
}

function urlBase64Encode(data) {
  return btoa(
    encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1);
    })
  );
}

function getCurrentPage() {
  var obj = {};
  try {
    var pages = getCurrentPages();
    obj = pages[pages.length - 1];
  } catch (error) {
    log(error);
  }

  return obj;
}

function getCurrentPath() {
  var url = '未取到';
  try {
    var currentPage = getCurrentPage();
    url = currentPage ? currentPage.route : url;
  } catch (e) {
    log(e);
  }
  return url;
}

// 获取是否首日访问属性
function getIsFirstDay() {
  if (typeof store._state === 'object' && isNumber(store._state.first_visit_day_time) && store._state.first_visit_day_time > new Date().getTime()) {
    return true;
  } else {
    return false;
  }
}

function getCurrentUrl(me) {
  var path = getCurrentPath();
  var query = '';
  if (isObject(me) && me.sensors_mp_encode_url_query) {
    query = me.sensors_mp_encode_url_query;
  }
  if (path) {
    return query ? path + '?' + query : path;
  } else {
    return '未取到';
  }
}

// 统一path的格式
function getPath(path) {
  if (isString(path)) {
    path = path.replace(/^\//, '');
  } else {
    path = '取值异常';
  }
  return path;
}

//获取自定义key的utm值
function getCustomUtmFromQuery(query, utm_prefix, source_channel_prefix, sautm_prefix) {
  if (!isObject(query)) {
    return {};
  }
  var result = {};
  if (query['sa_utm']) {
    for (var i in query) {
      if (i === 'sa_utm') {
        result[sautm_prefix + i] = query[i];
        continue;
      }
      if (include(saPara.source_channel, i)) {
        result[source_channel_prefix + i] = query[i];
      }
    }
  } else {
    for (var k in query) {
      if ((' ' + SOURCE_CHANNEL_STANDARD + ' ').indexOf(' ' + k + ' ') !== -1) {
        result[utm_prefix + k] = query[k];
        continue;
      }
      if (include(saPara.source_channel, k)) {
        result[source_channel_prefix + k] = query[k];
      }
    }
  }
  return result;
}

function getObjFromQuery(str) {
  var query = str.split('?');
  var arr = [];
  var obj = {};
  if (query && query[1]) {
    each(query[1].split('&'), function (value) {
      arr = value.split('=');
      if (arr[0] && arr[1]) {
        obj[arr[0]] = arr[1];
      }
    });
  } else {
    return {};
  }
  return obj;
}

function setStorageSync(storage_key, value) {
  var fn = function () {
    wx.setStorageSync(storage_key, value);
  };
  try {
    fn();
  } catch (e) {
    log('set Storage fail --', e);
    try {
      fn();
    } catch (e2) {
      log('set Storage fail again --', e2);
    }
  }
}

function getStorageSync(storage_key) {
  var store = '';
  try {
    store = wx.getStorageSync(storage_key);
  } catch (e) {
    log('getStorage fail');
  }
  return store;
}

function getMPScene(scene_value) {
  if (isNumber(scene_value) || (isString(scene_value) && scene_value !== '')) {
    scene_value = 'wx-' + String(scene_value);
    return scene_value;
  } else {
    return '未取到值';
  }
}

/**
 *
 * @param {*} param 传入要拼接的对象
 * @param {*} isEncode 是否需要编码
 * @returns
 */
function objToParam(param, isEncode) {
  if (!isObject(param)) {
    log('请传入有效对象');
    return '';
  }
  var queryParam = [];
  for (var key in param) {
    if (hasOwnProperty$2.call(param, key)) {
      var value = param[key];
      if (typeof value == 'undefined') {
        queryParam.push(key + '=');
      } else {
        value = isEncode ? encodeURIComponent(value) : value;
        queryParam.push(key + '=' + value);
      }
    }
  }
  return queryParam.join('&');
}

//删除分享设置属性
function delObjectKey(obj) {
  if (!isObject(obj)) {
    log('请传入有效对象');
    return;
  }
  for (var i = 0; i < SHARE_INFO_KEY.length; i++) {
    delete obj[SHARE_INFO_KEY[i]];
  }
}

//分享数据逻辑处理
function shareInfoData(para) {
  var shareData = {};
  var share = {};
  //如果是老的 URL 拼接模式
  if (!saPara.preset_events.share_info_use_string) {
    if (para.query.sampshare) {
      share = _decodeURIComponent(para.query.sampshare);
      if (isJSONString(share)) {
        share = JSON.parse(share);
      } else {
        return {};
      }
    } else {
      return {};
    }

    shareData = {
      depth: share.d,
      path: share.p,
      id: share.i,
      method: share.m
    };
  } else {
    share = para.query;
    for (var i = 0; i < SHARE_INFO_KEY.length; i++) {
      if (!hasOwnProperty$2.call(share, SHARE_INFO_KEY[i])) {
        return {};
      }
      share[SHARE_INFO_KEY[i]] = _decodeURIComponent(share[SHARE_INFO_KEY[i]]);
    }

    shareData = {
      depth: Number(share.sensors_share_d),
      path: share.sensors_share_p || '',
      id: share.sensors_share_i || '',
      method: share.sensors_share_m || ''
    };
  }

  return shareData;
}

function setShareInfo(para, prop) {
  var share = {};
  var obj = {};
  var current_id = store.getDistinctId();
  var current_first_id = store.getFirstId();
  if (para && isObject(para.query)) {
    share = shareInfoData(para);
    if (!isEmptyObject(share)) {
      var depth = share.depth,
        path = share.path,
        id = share.id,
        method = share.method;
    } else {
      return {};
    }
  }

  if (typeof id === 'string') {
    prop.$share_distinct_id = id;
    meta.share_distinct_id = id;
    obj.$latest_share_distinct_id = id;
  } else {
    prop.$share_distinct_id = '取值异常';
  }

  if (typeof depth === 'number') {
    if (meta.share_distinct_id && (meta.share_distinct_id === current_id || meta.share_distinct_id === current_first_id)) {
      prop.$share_depth = depth;
      meta.query_share_depth = depth;
      obj.$latest_share_depth = depth;
    } else if (meta.share_distinct_id && (meta.share_distinct_id !== current_id || meta.share_distinct_id !== current_first_id)) {
      prop.$share_depth = depth + 1;
      meta.query_share_depth = depth + 1;
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
  if (typeof method === 'string') {
    prop.$share_method = method;
    obj.$latest_share_method = method;
  } else {
    prop.$share_method = '取值异常';
  }
  setLatestShare(obj);
}

function getShareInfo() {
  //确认是否采用新的拼接方式
  if (saPara.preset_events.share_info_use_string) {
    var param = {
      sensors_share_i: store.getDistinctId() || '取值异常',
      sensors_share_p: getCurrentPath(),
      sensors_share_d: meta.query_share_depth,
      sensors_share_m: meta.share_method
    };

    return objToParam(param, true);
  }

  var share_info = JSON.stringify({
    i: store.getDistinctId() || '取值异常',
    p: getCurrentPath(),
    d: meta.query_share_depth,
    m: meta.share_method
  });

  return 'sampshare=' + encodeURIComponent(share_info);
}

// 筛选检测出para里的query，q，scene
function detectOptionQuery(para) {
  if (!para || !isObject(para.query)) {
    return {};
  }
  var result = {};
  // path的query
  result.query = extend({}, para.query);
  //如果query有scene，认为scene是b接口传过来的
  if (typeof result.query.scene === 'string' && isBScene(result.query)) {
    result.scene = result.query.scene;
    delete result.query.scene;
  }
  //如果query有q
  if (para.query.q && para.query.scancode_time && String(para.scene).slice(0, 3) === '101') {
    result.q = String(result.query.q);
    delete result.query.q;
    delete result.query.scancode_time;
  }
  function isBScene(obj) {
    var source = ['utm_source', 'utm_content', 'utm_medium', 'utm_campaign', 'utm_term', 'sa_utm'];
    var source_keyword = source.concat(saPara.source_channel);
    var reg = new RegExp('(' + source_keyword.join('|') + ')%3D', 'i');
    var keys = Object.keys(obj);
    if (keys.length === 1 && keys[0] === 'scene' && reg.test(obj.scene)) {
      return true;
    } else {
      return false;
    }
  }

  return result;
}

// 从query,q,scene三个参数中，解析得到一个整合的query对象
function getMixedQuery(para) {
  var obj = detectOptionQuery(para);
  var scene = obj.scene;
  var q = obj.q;
  // query
  var query = obj.query;
  for (var i in query) {
    query[i] = _decodeURIComponent(query[i]);
  }
  // scene
  if (scene) {
    scene = _decodeURIComponent(scene);
    if (scene.indexOf('?') !== -1) {
      scene = '?' + scene.replace(/\?/g, '');
    } else {
      scene = '?' + scene;
    }
    extend(query, getObjFromQuery(scene));
  }

  // 普通二维码的q
  if (q) {
    extend(query, getObjFromQuery(_decodeURIComponent(q)));
  }

  return query;
}

// 解析参数中的utm，并添加
function setUtm(para, prop) {
  var utms = {};
  var query = getMixedQuery(para);
  var pre1 = getCustomUtmFromQuery(query, '$', '_', '$');
  var pre2 = getCustomUtmFromQuery(query, '$latest_', '_latest_', '$latest_');
  utms.pre1 = pre1;
  utms.pre2 = pre2;
  extend(prop, pre1);
  return utms;
}

// 设置 SF 渠道属性
function setSfSource(para, prop) {
  if (!isEmptyObject(para.query)) {
    if (para.query && para.query._sfs) {
      prop.$sf_source = para.query._sfs;
      sa.registerApp({ $latest_sf_source: prop.$sf_source });
    }
  }
}

// 设置 pageShow 的 SF 渠道属性
function setPageSfSource(prop) {
  try {
    var allpages = getCurrentPage();
    var options = allpages ? allpages.options : '';
    var myvar = deepCopy(options);
    for (var i in myvar) {
      myvar[i] = _decodeURIComponent(myvar[i]);
    }

    if (!isEmptyObject(myvar) && myvar._sfs) {
      prop.$sf_source = myvar._sfs;
    }
  } catch (e) {
    log(e);
  }
}

function setRefPage() {
  var urlText = '直接打开';
  var _refInfo = {
    route: urlText,
    path: urlText,
    title: ''
  };
  try {
    var pages = getCurrentPage();
    if (pages && pages.route) {
      var url_query = pages.sensors_mp_url_query ? '?' + pages.sensors_mp_url_query : '';
      var current_path = pages.route;
      var current_title = getPageTitle(current_path);
      _refInfo.route = current_path + url_query;
      _refInfo.path = current_path;
      _refInfo.title = current_title;

      var len = meta.page_route_map.length;

      if (len >= 2) {
        meta.page_route_map.shift();
        meta.page_route_map.push(_refInfo);
      } else {
        meta.page_route_map.push(_refInfo);
      }
    }
  } catch (error) {
    log(error);
  }
}

function getRefPage() {
  var urlText = '直接打开';
  var _refInfo = {
    route: urlText,
    path: urlText,
    title: ''
  };

  if (meta.page_route_map.length > 1) {
    _refInfo.title = meta.page_route_map[0].title;
    _refInfo.route = meta.page_route_map[0].route;
    _refInfo.path = meta.page_route_map[0].path;
  }

  return _refInfo;
}

//获取当前页面信息
function getCurrentPageInfo() {
  var pages = getCurrentPage();
  var pageInfo = {
    title: '',
    url: '',
    path: '未取到'
  };
  if (pages && pages.route) {
    var query = pages.sensors_mp_url_query ? '?' + pages.sensors_mp_url_query : '';
    pageInfo.title = getPageTitle(pages.route);
    pageInfo.url = pages.route + query;
    pageInfo.path = pages.route;
  }
  return pageInfo;
}

/**
 * 发送数据设置 ref
 * @param {*} prop
 * @param {*} path URL 如果传了 URL 表示要手动处理 ref
 * @param {*} query URL 参数
 */
function setPageRefData(prop, path, query) {
  var refPage = getRefPage();

  if (isObject(prop)) {
    if (!path) {
      prop.$referrer = refPage.route;
      prop.$referrer_title = refPage.title;
    } else if (meta.page_route_map.length > 0 && path) {
      query = query ? '?' + query : '';
      prop.$referrer = getPath(path) + query;
      prop.$referrer_title = getPageTitle(path);
    } else {
      prop.$referrer = '直接打开';
      prop.$referrer_title = '';
    }
  }
}

// 获取页面标题
function getPageTitle(route) {
  if (route === '未取到' || !route) {
    return '';
  }
  var title = '';
  try {
    if (__wxConfig) {
      var wxConfig = __wxConfig;
      var page_list = __wxConfig.page || {};
      var currentPageConfig = page_list[route] || page_list[route + '.html'];
      var globalConfigTitle = {},
        pageConfigTitle = {};
      if (wxConfig.global && wxConfig.global.window && wxConfig.global.window.navigationBarTitleText) {
        // app.json 中配置的标题
        globalConfigTitle.titleVal = wxConfig.global.window.navigationBarTitleText;
      }
      if (currentPageConfig && currentPageConfig.window && currentPageConfig.window.navigationBarTitleText) {
        // 页面 json 中配置的标题
        pageConfigTitle.titleVal = currentPageConfig.window.navigationBarTitleText;
      }

      // 增加页面 json 文件中页面标题读取，来增加获取到 title 的概率（在企业微信中无 __wxConfig.page 对象，所以上面的步骤无法获取到页面 title）
      if (!pageConfigTitle.titleVal && __wxAppCode__) {
        var page_config = __wxAppCode__[route + '.json'];
        if (page_config && page_config['navigationBarTitleText']) {
          pageConfigTitle.titleVal = page_config['navigationBarTitleText'];
        }
      }

      // 遍历通过 wx.setNavigationBarTitle 设置的 title 对象，匹配当前页面的
      each(meta.global_title, function (v, k) {
        if (k === route) {
          return (title = v);
        }
      });
      // 页面 json 配置的标题 > app.json 配置的标题
      if (title.length === 0) {
        var finalTitle = extend(globalConfigTitle, pageConfigTitle);
        title = finalTitle.titleVal || '';
      }
    }
  } catch (err) {
    log(err);
  }
  return title;
}

function wxrequest(obj) {
  if (compareSDKVersion(meta.wx_sdk_version, '2.10.0') >= 0) {
    obj.timeout = saPara.datasend_timeout;
    wx.request(obj);
  } else {
    var rq = wx.request(obj);
    setTimeout(function () {
      if (isObject(rq) && isFunction(rq.abort)) {
        rq.abort();
      }
    }, saPara.datasend_timeout);
  }
}

function validId(id) {
  if ((typeof id !== 'string' && typeof id !== 'number') || id === '') {
    log('输入 ID 类型错误');
    return false;
  }
  if (typeof id === 'number') {
    id = String(id);
    if (!/^\d+$/.test(id)) {
      log('输入 ID 类型错误');
      return false;
    }
  }
  if (!check.checkIdLength(id)) {
    return false;
  }
  return id;
}

// 对比基础库版本号函数
function compareSDKVersion(v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  var len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i]);
    var num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

/**
 * 字符串转换成大写
 * value 必须是字符串
 */
function setUpperCase(value) {
  if (isString(value)) {
    return value.toLocaleUpperCase();
  }
  return value;
}

function setLatestChannel(channel) {
  if (!isEmptyObject(channel)) {
    if (includeChannel(channel, LATEST_SOURCE_CHANNEL)) {
      sa.clearAppRegister(LATEST_SOURCE_CHANNEL);
      sa.clearAllProps(LATEST_SOURCE_CHANNEL);
    }
    saPara.is_persistent_save.utm ? sa.register(channel) : sa.registerApp(channel);
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
}

function setLatestShare(share) {
  if (share.$latest_share_depth || share.$latest_share_distinct_id || share.$latest_share_url_path || share.$latest_share_method) {
    sa.clearAppRegister(LATEST_SHARE_INFO);
    sa.clearAllProps(LATEST_SHARE_INFO);

    saPara.is_persistent_save.share ? sa.register(share) : sa.registerApp(share);
  }
}

// query 解析
function setQuery(params, isEncode) {
  var url_query = '';
  if (params && isObject(params) && !isEmptyObject(params)) {
    var arr = [];
    each(params, function (value, item) {
      // 防止传统二维码的para.q这种异常query。另外异常的para.scene 不好判断，直接去掉。建议不要使用这个容易异意的参数
      if (!(item === 'q' && isString(value) && value.indexOf('http') === 0)) {
        if (isEncode) {
          arr.push(item + '=' + value);
        } else {
          arr.push(item + '=' + _decodeURIComponent(value));
        }
      }
    });
    return arr.join('&');
  } else {
    return url_query;
  }
}

/**
 * 获取通过 wx.setNavigationBarTitle 接口设置的页面标题
 * @return {Object} 包含UTM信息的对象，如果没有相关信息则返回空对象
 */
function setNavigationBarTitle() {
  try {
    var oldSetNavigationBarTitle = wx.setNavigationBarTitle;
    Object.defineProperty(wx, 'setNavigationBarTitle', {
      get: function () {
        return function (titleObj) {
          // 获取当前页面路径
          var currentPagePath = getCurrentPath();
          titleObj = isObject(titleObj) ? titleObj : {};
          // 把当前页面路径和获取到的 title 存起来
          meta.global_title[currentPagePath] = titleObj.title;
          oldSetNavigationBarTitle.call(this, titleObj);
        };
      }
    });
  } catch (err) {
    log(err);
  }
}

/**
 * 从当前页面栈获取 UTM 信息
 *
 * @return {Object} 包含UTM信息的对象，如果没有相关信息则返回空对象
 */
function getUtmFromPage() {
  var newObj = {};
  try {
    var allpages = getCurrentPage();
    var myvar = deepCopy(allpages.options);
    for (var i in myvar) {
      myvar[i] = _decodeURIComponent(myvar[i]);
    }

    newObj = getCustomUtmFromQuery(myvar, '$', '_', '$');
  } catch (e) {
    log(e);
  }
  return newObj;
}

/**
 * 判断是否为新的 login id
 * @param {*} name
 * @param {*} id
 * @returns
 */
function isNewLoginId(name, id) {
  // 当当前 ID 的 name 与上一个登录 ID 的 name 相同，且当前 ID 值与上一个 ID 的值相同时，则认为是同一个 ID，否则是一个新的 ID
  // return !(name === store._state.history_login_id.name && store._state.history_login_id.value === id);
  // 判断当前 ID 的 name 是否和上一个 ID 的 name 值相同，若不相同，则继续判断 id 值
  if (name === store._state.history_login_id.name) {
    if (store._state.history_login_id.value === id) {
      return false;
    }
  }
  return true;
}

/**
 * 判断是否和匿名 id 相同
 * @param {*} id
 */
function isSameAndAnonymousID(id) {
  var firstId = store.getFirstId();
  var distinctId = store.getDistinctId();
  if (firstId) {
    return id === firstId;
  } else {
    return id === distinctId;
  }
}

/**
 * 判断是否为预置的 ID key,可以通过 ids 传入 id key 的列表,自定义预置的 key 值
 * @param {string} name
 * @param {array} ids
 * @returns {boolean}
 */
function isPresetIdKeys(name, ids) {
  // 预置 ID key 列表
  var keyList = ['$identity_anonymous_id'];
  if (isArray(ids)) {
    keyList = keyList.concat(ids);
  }
  for (var item of keyList) {
    if (item === name) {
      return true;
    }
  }
  return false;
}

/**
 * 数据 encode
 * @param {*} data
 * @returns
 */

function encodeTrackData(data) {
  data = JSON.stringify(data);
  var dataStr = base64Encode(data);
  return encodeURIComponent(dataStr);
}

/**
 * 设置所有事件都需要处理的公共预制属性
 * @param {*} data 数据
 */
function setPublicProperties(data) {
  if (data && data.properties) {
    var refPage = getRefPage();
    var pageInfo = getCurrentPageInfo();
    var propertiesMap = {
      $referrer: refPage.route,
      $referrer_title: refPage.title,
      $title: pageInfo.title,
      $url: pageInfo.url
    };
    if (saPara.preset_properties.url_path === true) {
      propertiesMap.$url_path = pageInfo.path;
    }
    for (var key in propertiesMap) {
      if (!hasOwnProperty$2.call(data.properties, key)) {
        data.properties[key] = propertiesMap[key];
      }
    }
  }
}

/**
 * 网络切换
 */
function networkStatusChange() {
  wx.onNetworkStatusChange(function (res) {
    sa.registerApp({ $network_type: res.networkType || '' });
  });
}

function getNetworkType() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: function (t) {
        meta.preset_properties.$network_type = setUpperCase(t['networkType']);
        resolve();
      },
      fail: function (t) {
        log('获取网络信息失败', t);
        reject();
      }
    });
  });
}

function getSystemInfo() {
  var e = meta.preset_properties;
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
  return new Promise((resolve) => {
    wx.getSystemInfo({
      success: function (t) {
        e.$brand = setUpperCase(t['brand']);
        e.$manufacturer = t['brand'];
        e.$model = t['model'];
        e.$screen_width = Number(t['screenWidth']);
        e.$screen_height = Number(t['screenHeight']);
        e.$os = formatSystem(t['platform']);
        e.$os_version = t['system'].indexOf(' ') > -1 ? t['system'].split(' ')[1] : t['system'];
        meta.wx_sdk_version = t['SDKVersion'];
        e.$mp_client_app_version = t['version'];
        e.$mp_client_basic_library_version = meta.wx_sdk_version;
        var timeZoneOffset = new Date().getTimezoneOffset();
        var accountInfo = getAppInfoSync();
        if (isNumber(timeZoneOffset)) {
          e.$timezone_offset = timeZoneOffset;
        }
        if (accountInfo.appId) {
          e.$app_id = accountInfo.appId;
        }
        if (accountInfo.appVersion) {
          e.$app_version = accountInfo.appVersion;
        }
        resolve();
      }
    });
  });
}

var info = {
  currentProps: meta.preset_properties
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-08 16:52:52
 * @File:
 */
var logger = {
  info: function () {
    if (saPara.show_log) {
      if (typeof console === 'object' && console.log) {
        try {
          // 传入的自定义属性是 null、undefined 等值也需要打印，所以判断 arguments.length
          if (arguments.length === 3) {
            return console.log(arguments[0], arguments[1], arguments[2]);
          }

          if (arguments.length === 2) {
            return console.log(arguments[0], arguments[1]);
          }

          if (arguments.length === 1) {
            return console.log(arguments[0]);
          }
        } catch (e) {
          console.log(arguments[0]);
        }
      }
    }
  }
};

function isValidListener(listener) {
  if (typeof listener === 'function') {
    return true;
  } else if (listener && typeof listener === 'object') {
    return isValidListener(listener.listener);
  } else {
    return false;
  }
}

/**
 * @class EventEmitter
 * @category Event
 * @example
 * var e = new EventEmitter()
 * e.on('HelloEvent',function(data){
 *  console.log('Hello Event happens',data);
 * })
 *
 * e.emit('HelloEvent',123);
 * // Hello Event happens , 123
 */
class EventEmitterBase {
  constructor() {
    this._events = {};
  }

  /**
   * 添加事件
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  on(eventName, listener) {
    if (!eventName || !listener) {
      return false;
    }

    if (!isValidListener(listener)) {
      throw new Error('listener must be a function');
    }

    this._events[eventName] = this._events[eventName] || [];
    var listenerIsWrapped = typeof listener === 'object';

    this._events[eventName].push(
      listenerIsWrapped
        ? listener
        : {
          listener: listener,
          once: false
        }
    );

    return this;
  }

  /**
   * 添加事件到事件回调函数列表头
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  prepend(eventName, listener) {
    if (!eventName || !listener) {
      return false;
    }

    if (!isValidListener(listener)) {
      throw new Error('listener must be a function');
    }

    this._events[eventName] = this._events[eventName] || [];
    var listenerIsWrapped = typeof listener === 'object';

    this._events[eventName].unshift(
      listenerIsWrapped
        ? listener
        : {
          listener: listener,
          once: false
        }
    );

    return this;
  }

  /**
   * 添加事件到事件回调函数列表头，回调只执行一次
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  prependOnce(eventName, listener) {
    return this.prepend(eventName, {
      listener: listener,
      once: true
    });
  }

  /**
   * 添加事件，该事件只能被执行一次
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  once(eventName, listener) {
    return this.on(eventName, {
      listener: listener,
      once: true
    });
  }

  /**
   * 删除事件
   * @param  {String} eventName 事件名称
   * @param  {Function} listener 监听器函数
   * @return {Object} 可链式调用
   */
  off(eventName, listener) {
    var listeners = this._events[eventName];
    if (!listeners) {
      return false;
    }
    if (typeof listener === 'number') {
      listeners.splice(listener, 1);
    } else if (typeof listener === 'function') {
      for (var i = 0, len = listeners.length; i < len; i++) {
        if (listeners[i] && listeners[i].listener === listener) {
          listeners.splice(i, 1);
        }
      }
    }
    return this;
  }

  /**
   * 触发事件
   * @param  {String} eventName 事件名称
   * @param  {Array} args 传入监听器函数的参数，使用数组形式传入
   * @return {Object} 可链式调用
   */
  emit(eventName, args) {
    var listeners = this._events[eventName];
    if (!listeners) {
      return false;
    }

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      if (listener) {
        listener.listener.call(this, args || {});
        if (listener.once) {
          this.off(eventName, i);
        }
      }
    }

    return this;
  }

  /**
   * 删除某一个类型的所有事件或者所有事件
   * @param  {String[]} eventName 事件名称
   */
  removeAllListeners(eventName) {
    if (eventName && this._events[eventName]) {
      this._events[eventName] = [];
    } else {
      this._events = {};
    }
  }

  /**
   * 返回某一个类型的所有事件或者所有事件
   * @param  {String[]} eventName 事件名称
   */
  listeners(eventName) {
    if (eventName && typeof eventName === 'string') {
      return this._events[eventName];
    } else {
      return this._events;
    }
  }
}

/**
 * ex 扩展
 */
class EventEmitterEx extends EventEmitterBase {
  constructor() {
    super();
    this.cacheEvents = [];
    this.maxLen = 20;
  }
  replay(eventName, listener) {
    this.on(eventName, listener);
    if (this.cacheEvents.length > 0) {
      this.cacheEvents.forEach(function (val) {
        if (val.type === eventName) {
          listener.call(null, val.data);
        }
      });
    }
  }
  emit(eventName, args) {
    super.emit.apply(this, arguments);
    this.cacheEvents.push({ type: eventName, data: args });
    this.cacheEvents.length > this.maxLen ? this.cacheEvents.shift() : null;
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-10 15:54:35
 * @File:
 */

var _ = /*#__PURE__*/Object.freeze({
  __proto__: null,
  decodeURIComponent: decodeURIComponent$1,
  encodeDates: encodeDates,
  formatDate: formatDate,
  searchObjDate: searchObjDate,
  formatString: formatString,
  searchObjString: searchObjString,
  parseSuperProperties: parseSuperProperties,
  unique: unique,
  check: check,
  getUtmFromPage: getUtmFromPage,
  setQuery: setQuery,
  setLatestShare: setLatestShare,
  setLatestChannel: setLatestChannel,
  setUpperCase: setUpperCase,
  compareSDKVersion: compareSDKVersion,
  validId: validId,
  wxrequest: wxrequest,
  getPageTitle: getPageTitle,
  setPageRefData: setPageRefData,
  getCurrentPageInfo: getCurrentPageInfo,
  getRefPage: getRefPage,
  setRefPage: setRefPage,
  setPageSfSource: setPageSfSource,
  setSfSource: setSfSource,
  setUtm: setUtm,
  getMixedQuery: getMixedQuery,
  detectOptionQuery: detectOptionQuery,
  getShareInfo: getShareInfo,
  setShareInfo: setShareInfo,
  shareInfoData: shareInfoData,
  delObjectKey: delObjectKey,
  objToParam: objToParam,
  getMPScene: getMPScene,
  getStorageSync: getStorageSync,
  setStorageSync: setStorageSync,
  getObjFromQuery: getObjFromQuery,
  getCustomUtmFromQuery: getCustomUtmFromQuery,
  getPath: getPath,
  getCurrentUrl: getCurrentUrl,
  getIsFirstDay: getIsFirstDay,
  getCurrentPath: getCurrentPath,
  getCurrentPage: getCurrentPage,
  urlBase64Encode: urlBase64Encode,
  btoa: btoa,
  base64Encode: base64Encode,
  strip_empty_properties: strip_empty_properties,
  strip_sa_properties: strip_sa_properties,
  setNavigationBarTitle: setNavigationBarTitle,
  networkStatusChange: networkStatusChange,
  getNetworkType: getNetworkType,
  getSystemInfo: getSystemInfo,
  encodeTrackData: encodeTrackData,
  initAppGlobalName: initAppGlobalName,
  getPublicPresetProperties: getPublicPresetProperties,
  setPublicProperties: setPublicProperties,
  isPresetIdKeys: isPresetIdKeys,
  isNewLoginId: isNewLoginId,
  isSameAndAnonymousID: isSameAndAnonymousID,
  info: info,
  logger: logger,
  getAppId: getAppId,
  getAppInfoSync: getAppInfoSync,
  getOpenidNameByAppid: getOpenidNameByAppid,
  rot13defs: rot13defs,
  rot13obfs: rot13obfs,
  each: each,
  isObject: isObject,
  getRandom: getRandom,
  extend: extend,
  extend2Lev: extend2Lev,
  coverExtend: coverExtend,
  isArray: isArray,
  isFunction: isFunction,
  isArguments: isArguments,
  toArray: toArray,
  values: values,
  include: include,
  trim: trim,
  isEmptyObject: isEmptyObject,
  deepCopy: deepCopy,
  isUndefined: isUndefined,
  isString: isString,
  isDate: isDate,
  isBoolean: isBoolean,
  isNumber: isNumber,
  isJSONString: isJSONString,
  isInteger: isInteger,
  isSafeInteger: isSafeInteger,
  slice: slice,
  urlSafeBase64: urlSafeBase64,
  EventEmitterBase: EventEmitterBase,
  EventEmitterEx: EventEmitterEx,
  log: log
});

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-07 11:57:39
 * @File: 提供方法，监听自定义修改动态预置属性
 */
function onEventSend() {
  var custom_monitor_prop = {};
  return custom_monitor_prop;
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-23 15:34:19
 * @File: 批量发送数据处理过程
 */

//批量发送，提供方法对数据加密插件重写
function processData(data) {
  return data;
}

//批量发送，提供方法对数据加密插件重写
function batchTrackData(data) {
  var now = Date.now();
  data.forEach(function (v) {
    v._flush_time = now;
  });
  return 'data_list=' + encodeTrackData(data);
}

//批量发送之前需要合并本地数据
var mergeStorageData = {
  getData: function (callback) {
    wx.getStorage({
      key: saPara.storage_prepare_data_key,
      complete: function (res) {
        var queue = res.data && isArray(res.data) ? res.data : [];
        mergeStorageData.deleteAesData(queue);
        callback && callback();
      }
    });
  },
  deleteAesData: function (queue) {
    var arr = [];
    var queue_len = queue.length;
    if (queue_len > 0) {
      //如果本地数据有加密过的数据，进行删除
      for (var i = 0; i < queue_len; i++) {
        if (isObject(queue[i])) {
          arr.push(queue[i]);
        }
      }
      store.mem.mdata = arr.concat(store.mem.mdata);
    }
  }
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-23 15:34:19
 * @File: 批量发送数据处理过程
 */

//单条发送，提供方法对数据加密插件重写
function onceTrackData(data) {
  return 'data=' + encodeTrackData(data);
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-07 11:55:37
 * @File:
 */

var kit = {};

//数据处理过程
kit.processData = processData;

kit.onceTrackData = onceTrackData;

kit.batchTrackData = batchTrackData;

kit.onEventSend = onEventSend;

var sendStrategy = {
  dataHasSend: true,
  dataHasChange: false,
  syncStorage: false,
  failTime: 0,
  /**
   * 注意！！ init 在国密加密（以及将来其他加密插件）中进行重新实现，如果修改 init，必须考虑过密加密插件中 init 是否需要同步修改
   */
  init: function () {
    this.sendHasInit = true;
    mergeStorageData.getData(sendStrategy.syncStorageState.bind(sendStrategy));
    this.batchInterval();
    this.onAppHide();
  },
  syncStorageState: function () {
    this.syncStorage = true;
  },
  onAppHide: function () {
    var _this = this;
    wx.onAppHide(function () {
      if (saPara.batch_send) {
        _this.batchSend();
      }
    });
  },
  /**
   * 注意！！ send 在国密加密（以及将来其他加密插件）中进行重新实现，如果修改 send，必须考虑过密加密插件 send 是否需要同步修改
   */
  send: function (data) {
    this.dataHasChange = true;
    if (store.mem.getLength() >= 500) {
      log('storage data is too large');
      store.mem.mdata.shift();
    }

    data = kit.processData(data);
    if (data) {
      store.mem.add(data);
    }
    this.sendAsOver();
  },
  // 超出条数也发
  sendAsOver: function () {
    if (this.sendHasInit && store.mem.getLength() >= saPara.batch_send.max_length) {
      this.batchSend();
    }
  },
  /**
   * 注意！！ wxrequest 在国密加密插件（以及将来其他加密插件）中进行重新实现，如果修改 wxrequest， 必须考虑加密插件中 wxrequest 是否需要同步修改
   */
  wxrequest: function (option) {
    if (isArray(option.data) && option.data.length > 0) {
      var data = kit.batchTrackData(option.data);
      sa._.wxrequest({
        url: saPara.server_url,
        method: 'POST',
        dataType: 'text',
        data: data,
        header: {
          'content-type': 'text/plain'
        },
        success: function () {
          option.success(option.len);
        },
        fail: function () {
          option.fail();
        }
      });
    } else {
      option.success(option.len);
    }
  },
  batchSend: function () {
    if (this.dataHasSend) {
      var data,
        len,
        mdata = store.mem.mdata;
      if (mdata.length >= 100) {
        data = mdata.slice(0, 100);
      } else {
        data = mdata;
      }
      len = data.length;
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
  sendFail: function () {
    this.dataHasSend = true;
    this.failTime++;
  },
  batchRemove: function (len) {
    store.mem.clear(len);
    this.dataHasSend = true;
    this.dataHasChange = true;
    this.batchWrite();
    this.failTime = 0;
  },
  is_first_batch_write: true,
  batchWrite: function () {
    if (this.dataHasChange) {
      this.dataHasChange = false;
      if (this.syncStorage) {
        sa._.setStorageSync(saPara.storage_prepare_data_key, store.mem.mdata);
      }
    }
  },
  batchInterval: function () {
    var _this = this;
    // 每隔 500ms，写入数据
    function loopWrite() {
      setTimeout(function () {
        _this.batchWrite();
        loopWrite();
      }, 500);
    }
    // 每隔6秒，发送数据
    function loopSend() {
      setTimeout(function () {
        _this.batchSend();
        loopSend();
      }, saPara.batch_send.send_timeout * Math.pow(2, _this.failTime));
    }
    loopWrite();
    loopSend();
  }
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-05-07 14:40:11
 * @File: 单条发送模块
 */

function onceSend(data) {
  data._flush_time = Date.now();
  var encodeData = kit.onceTrackData(data);
  var url = saPara.server_url + '?' + encodeData;

  if (saPara.server_url.indexOf('?') !== -1) {
    url = saPara.server_url + '&' + encodeData;
  }

  wxrequest({
    url: url,
    method: 'GET'
  });
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-20 17:21:25
 * @File:
 */

function buildData(p, custom_monitor_prop) {
  var data = {
    distinct_id: sa.store.getDistinctId(),
    identities: sa.store._state.identities,
    lib: {
      $lib: LIB_NAME,
      $lib_method: 'code',
      $lib_version: LIB_VERSION
    },
    properties: {}
  };

  if (p.type === 'track_id_unbind' && p.event === '$UnbindID') {
    data.identities = deepCopy(p.unbind_value);
    delete p.unbind_value;
  }

  // 合并自定义监听事件添加的属性，合并此属性在合自定义属性前，保证此属性优先级低于事件本身的自定义属性
  if (!isObject(custom_monitor_prop)) {
    custom_monitor_prop = {};
  }

  extend(data, sa.store.getUnionId(), p);

  // 合并properties里的属性
  if (isObject(p.properties) && !isEmptyObject(p.properties)) {
    extend(data.properties, p.properties);
  }

  // profile时不传公用属性
  if (!p.type || p.type.slice(0, 7) !== 'profile') {
    data._track_id = Number(String(getRandom()).slice(2, 5) + String(getRandom()).slice(2, 4) + String(Date.now()).slice(-4));
    // 传入的属性 > 当前页面的属性 > session的属性 > cookie的属性 > 预定义属性
    data.properties = extend({}, getPublicPresetProperties(), meta.preset_properties, sa.store.getProps(), custom_monitor_prop, data.properties);
    // 当上报的是事件的数据设置 $is_first_day 属性，对于上报用户属性相关的事件均不上报 $is_first_day 属性
    if (p.type === 'track') {
      data.properties.$is_first_day = getIsFirstDay();
    }
  }
  // 如果$time是传入的就用，否则使用服务端时间
  if (data.properties.$time && isDate(data.properties.$time)) {
    data.time = data.properties.$time * 1;
    delete data.properties.$time;
  } else {
    data.time = new Date() * 1;
  }

  //兼容自定义属性插件监听事件名称
  sa.ee.sdk.emit('createData', data);
  //兼容自定义属性插件监听事件名称
  sa.ee.sdk.emit('beforeBuildCheck', data);

  sa.ee.data.emit('beforeBuildCheck', data);

  // 处理动态公共属性
  parseSuperProperties(data.properties);
  searchObjDate(data);
  strip_sa_properties(data.properties);
  searchObjString(data);
  sa.ee.data.emit('finalAdjustData', data);
  return data;
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-16 15:14:55
 * @File:
 */

function dataStage(p) {
  if (!saPara.server_url) {
    return false;
  }

  // 判断当前处于单页模式就 return
  if (meta.current_scene && meta.current_scene === 1154 && !sa.para.preset_events.moments_page) {
    return false;
  }

  // 在事件发送前进行监听，返回处理后返回的自定义监听对象；传入事件深拷贝值，保证事件处理时不能影响事件本身的属性
  var event_target = sa._.deepCopy(p);
  var custom_monitor_prop = kit.onEventSend(event_target);

  var data = buildData(p, custom_monitor_prop);
  if (data) {
    log(data);
    sa.events.emit('send', data);
    //如果是批量发送
    if (sa.para.batch_send) {
      sendStrategy.send(data);
    } else {
      onceSend(data);
    }
  } else {
    log('error: 数据异常 ' + data);
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-05-07 14:40:11
 * @File:
 */

// 为了兼容弹窗 SDK 的弹窗组件 在 attached 的生命周期中调用此方法时，弹窗插件尚未声明而报错
// 弹窗 SDK 自身也会增加修复代码，进行修复
sa.popupEmitter = {
  attached: function () {
    return false;
  }
};

/**
 * 初始化插件，在主 SDK 初始化前，会先暂存当前插件初始化状态
 * @param {object} plugin
 * @param {object} para
 */
var usePlugin = function (plugin, para) {
  if (!isObject(plugin) && !isFunction(plugin)) {
    log('plugin must be an object', plugin);
    return false;
  }

  if (!isFunction(plugin.init)) {
    log('plugin maybe missing init method', plugin.plugin_name || plugin);
  }

  // 过滤掉不包含name的插件，有 name 的话，使用已有的实例
  if (isString(plugin.plugin_name) && plugin.plugin_name) {
    // 如果有插件，就使用原来的插件
    if (sa.modules[plugin.plugin_name]) {
      plugin = sa.modules[plugin.plugin_name];
    } else {
      // 如果没有插件，就存起来
      sa.modules[plugin.plugin_name] = plugin;
    }
  } else {
    log('plugin_name is not defined - ', plugin.plugin_name || plugin);
  }

  // 如果插件里有 plugin_is_init ，则返回
  if (isObject(plugin) && plugin.plugin_is_init === true) {
    //    log('duplicate initialization! plugin is already initialized - ', (plugin.plugin_name || plugin));
    return plugin;
  }

  // 版本校验
  if (isObject(plugin) && plugin.plugin_name) {
    if (!isString(plugin.plugin_version) || plugin.plugin_version !== LIB_VERSION) {
      log('warning!' + plugin.plugin_name + ' plugin version do not match SDK version ！！！');
    }
  }

  if (!meta.init_status) {
    var item = {
      target: plugin,
      para: para
    };
    meta.plugin.uninitialized_list.push(item);
  } else {
    if (typeof plugin.init === 'function') {
      plugin.init(sa, para);
      plugin.plugin_is_init = true;
      log(plugin.plugin_name + ' plugin is initialized');
    }
  }

  return plugin;
};

/**
 * 检查插件的初始化状态，未被初始化的插件重新完成初始化
 */
var checkPluginInitStatus = function () {
  if (meta.plugin.uninitialized_list.length > 0) {
    for (var temp in meta.plugin.uninitialized_list) {
      var plugin_item = meta.plugin.uninitialized_list[temp];
      if (plugin_item && plugin_item.target && typeof plugin_item.target.init === 'function' && !plugin_item.target.plugin_is_init) {
        plugin_item.target.init(sa, plugin_item.para);
        if (isObject(plugin_item.target)) {
          plugin_item.target.plugin_is_init = true;
          if (isString(plugin_item.target.plugin_name) && plugin_item.target.plugin_name) {
            log(plugin_item.target.plugin_name + ' plugin is initialized');
          }
        }
      }
    }
    meta.plugin.uninitialized_list = [];
  }
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-05-07 14:40:11
 * @File:
 */

/**
 * 监听 App 的生命周期钩子方法
 */
function initAppShowHide() {
  wx.onAppShow(function (para) {
    if (!meta.life_state.app_launched) {
      var option = wx.getLaunchOptionsSync() || {};
      sa.autoTrackCustom.appLaunch(option);
    }
    sa.autoTrackCustom.appShow(para);
  });

  wx.onAppHide(function () {
    sa.autoTrackCustom.appHide();
  });
}

/**
 * 检查是否执行 appLaunch， 若未执行则获取 App onLaunch 时的参数，调用 appLaunch 方法。
 * appLaunch 补发
 */
function checkAppLaunch() {
  if (!meta.life_state.app_launched) {
    var option = wx.getLaunchOptionsSync() || {};
    sa.autoTrackCustom.appLaunch(option);
  }
}

function mpProxy(option, method, identifier) {
  var newFunc = sa.autoTrackCustom[identifier];
  if (option[method]) {
    var oldFunc = option[method];
    option[method] = function () {
      if (!sa.para.autoTrackIsFirst || (isObject(sa.para.autoTrackIsFirst) && !sa.para.autoTrackIsFirst[identifier])) {
        oldFunc.apply(this, arguments);
        newFunc.apply(this, arguments);
      } else if (sa.para.autoTrackIsFirst === true || (isObject(sa.para.autoTrackIsFirst) && sa.para.autoTrackIsFirst[identifier])) {
        newFunc.apply(this, arguments);
        oldFunc.apply(this, arguments);
      }
      sa.ee.page.emit(identifier);
    };
  } else {
    option[method] = function () {
      newFunc.apply(this, arguments);
      sa.ee.page.emit(identifier);
    };
  }
}

function clickTrack(events) {
  var prop = {},
    event_prop = {},
    type = '';
  var current_target = events.currentTarget || {};
  var target = events.target || {};
  if (isObject(sa.para.framework) && isObject(sa.para.framework.taro) && !sa.para.framework.taro.createApp) {
    if (target.id && current_target.id && target.id !== current_target.id) {
      return false;
    }
  }

  var dataset = current_target.dataset || {};
  type = events['type'];
  prop['$element_id'] = current_target.id;
  prop['$element_type'] = dataset['type'];
  prop['$element_content'] = dataset['content'];
  prop['$element_name'] = dataset['name'];
  if (isObject(events.event_prop)) {
    event_prop = events.event_prop;
  }
  if (type && isClick(type)) {
    if (sa.para.preset_events && sa.para.preset_events.collect_element && sa.para.preset_events.collect_element(arguments[0]) === false) {
      return false;
    }
    prop['$url_path'] = sa._.getCurrentPath();
    sa._.setPageRefData(prop);
    prop = sa._.extend(prop, event_prop);
    sa.track('$MPClick', prop);
  }
}

// 重点注意 clickProxy 不能使用 return false
function clickProxy(option, method) {
  var oldFunc = option[method];
  option[method] = function () {
    // 在重写 oldFunc 之前就已经判断是一个方法类型，此处是做一次重复的校验
    var res = oldFunc.apply(this, arguments);
    var args = arguments[0];

    if (isObject(args)) {
      if (sa.para.preset_events.defer_track) {
        setTimeout(function () {
          clickTrack(args);
        }, 0);
      } else {
        clickTrack(args);
      }
    }
    return res;
  };
}

function isClick(type) {
  var mp_taps = {
    tap: 1,
    longpress: 1,
    longtap: 1
  };
  return !!mp_taps[type];
}

function tabProxy(option) {
  var oldTab = option['onTabItemTap'];
  option['onTabItemTap'] = function (item) {
    if (oldTab) {
      oldTab.apply(this, arguments);
    }
    var prop = {};

    if (item) {
      prop['$element_content'] = item.text;
    }
    prop['$element_type'] = 'tabBar';
    prop['$url_path'] = sa._.getCurrentPath();
    //设置 ref
    sa._.setPageRefData(prop);
    sa.track('$MPClick', prop);
  };
}

// 对 page 所有事件进行清理
function getMethods(option) {
  var mp_hook = MP_FILTER_HOOK;
  var methods = [];
  for (var m in option) {
    if (typeof option[m] === 'function' && !mp_hook[m]) {
      methods.push(m);
    }
  }
  return methods;
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-05-07 14:40:11
 * @File:
 */

function initPageProxy() {
  var oldPage = Page;
  Page = function (option) {
    try {
      // 针对构造页面时未传入任何对象的情况下，保证能采集页面的全埋点事件
      if (!option) {
        option = {};
      }
      monitorClick(option);
      monitorHooks(option);
      oldPage.apply(this, arguments);
    } catch (error) {
      oldPage.apply(this, arguments);
    }
  };

  var oldComponent = Component;
  Component = function (option) {
    try {
      // 针对构造页面时未传入任何对象的情况下，保证能采集页面的全埋点事件
      if (!option) {
        option = {};
      }
      if (!option.methods) {
        option.methods = {};
      }
      monitorClick(option.methods);
      monitorHooks(option.methods);
      oldComponent.apply(this, arguments);
    } catch (e) {
      oldComponent.apply(this, arguments);
    }
  };
}

function monitorClick(option) {
  var methods = [];
  if (sa.para.autoTrack && sa.para.autoTrack.mpClick) {
    methods = getMethods(option);
    tabProxy(option);

    var len = methods.length;
    for (var i = 0; i < len; i++) {
      clickProxy(option, methods[i]);
    }
  }
}

function monitorHooks(option) {
  mpProxy(option, 'onLoad', 'pageLoad');
  mpProxy(option, 'onShow', 'pageShow');
  mpProxy(option, 'onHide', 'pageHide');
  mpProxy(option, 'onUnload', 'pageHide');
  mpProxy(option, 'onAddToFavorites', 'pageAddFavorites');
  if (typeof option.onShareAppMessage === 'function') {
    sa.autoTrackCustom.pageShare(option);
  }
  if (typeof option.onShareTimeline === 'function') {
    sa.autoTrackCustom.pageShareTimeline(option);
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-08 18:59:23
 * @File:
 */

var eventEmitter = function () {
  this.sub = [];
};

eventEmitter.prototype = {
  add: function (item) {
    this.sub.push(item);
  },
  emit: function (event, data) {
    this.sub.forEach(function (temp) {
      temp.on(event, data);
    });
  }
};

var eventSub = function (handle) {
  sa.events.add(this);
  this._events = [];
  this.handle = handle;
  this.ready = false;
};

eventSub.prototype = {
  on: function (event, data) {
    if (this.ready) {
      if (isFunction(this.handle)) {
        try {
          this.handle(event, data);
        } catch (error) {
          log(error);
        }
      }
    } else {
      this._events.push({
        event,
        data
      });
    }
  },
  isReady: function () {
    var that = this;
    that.ready = true;
    that._events.forEach(function (item) {
      if (isFunction(that.handle)) {
        try {
          that.handle(item.event, item.data);
        } catch (error) {
          log(error);
        }
      }
    });
  }
};

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-07 14:20:38
 * @File:
 */
var ee = {};
ee.sdk = new EventEmitterEx();
ee.data = new EventEmitterEx();
ee.page = new EventEmitterEx();

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-05-07 14:40:11
 * @File:
 */

/**
 * 判断合规状态
 * 如果没有配置 privacy 则表示符合客户隐私要求，返回 true；配置 privacy 为 true，且已经执行 sa.init 方法则表示客户已经同意用户隐私协议，返回 true；否则返回 false，表示数据目前不可采集
 * @return {boolean}
 */
function checkPrivacyStatus() {
  var is_compliance_enabled;
  if (global && global.sensors_data_pre_config) {
    is_compliance_enabled = global.sensors_data_pre_config.is_compliance_enabled ? global.sensors_data_pre_config.is_compliance_enabled : false;
  }
  // 如果未配置 is_compliance_enabled 则检查合规状态时不做拦截处理
  if (!is_compliance_enabled) {
    return true;
  }

  // 如果已经执行 init_status 状态为真，数据则可正常采集
  if (meta.init_status) {
    return true;
  }

  // 经过 is_compliance_enabled、init_status 状态检查后，执行到此逻辑，表示客户需要客户签订隐私协议，init 尚未执行
  // enable_data_collect 默认 false，在执行 enableDataCollect 后则可修改为 true
  // 如果签订隐私协议后，直接调用 init 则会在上一步中拦截，标识可采集数据，若未调用，则调用 enableDataCollect 后，标识数据可以暂存，identify、setOpenid 等方法可以在 init 前调用
  if (meta.privacy.enable_data_collect) {
    return true;
  } else {
    return false;
  }
}

/**
 * 手动调用 API 控制数据可采集
 */
function enableDataCollect() {
  meta.privacy.enable_data_collect = true;
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-30 19:42:06
 * @File: 对所有提供的方法做代理暂存
 */

function apiStaging() {
  var saApiList = ['setProfile', 'setOnceProfile', 'track', 'quick', 'incrementProfile', 'appendProfile', 'login', 'logout', 'registerApp', 'register', 'clearAllRegister', 'clearAllProps', 'clearAppRegister', 'bind', 'unbind', 'unsetOpenid', 'setUnionid', 'unsetUnionid', 'bindOpenid', 'unbindOpenid', 'bindUnionid', 'unbindUnionid'];
  each(saApiList, function (method) {
    var temp = sa[method];
    sa[method] = function () {
      if (!checkPrivacyStatus()) {
        return false;
      }
      if (isFunction(sa.getDisabled) && sa.getDisabled()) {
        return false;
      }
      if (meta.initialState.isComplete) {
        temp.apply(sa, arguments);
      } else {
        meta.initialState.queue.push([method, arguments]);
      }
    };
  });
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-04 11:18:47
 * @File:
 */

function registerApp(obj) {
  if (isObject(obj) && !isEmptyObject(obj)) {
    meta.preset_properties = extend(meta.preset_properties, obj);
  }
}

function register(obj) {
  if (isObject(obj) && !isEmptyObject(obj)) {
    store.setProps(obj);
  }
}

function clearAllRegister() {
  store.setProps({}, true);
}

function clearAppRegister(arr) {
  if (isArray(arr)) {
    each(meta.preset_properties, function (value, item) {
      if (include(arr, item)) {
        delete meta.preset_properties[item];
      }
    });
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-05 14:32:00
 * @File:
 */

function clearAllProps(arr) {
  var obj = store.getProps();
  var props = {};
  if (isArray(arr)) {
    each(obj, function (value, item) {
      if (!include(arr, item)) {
        props[item] = value;
      }
    });
    store.setProps(props, true);
  }
}

var hasOwnProperty$3 = Object.prototype.hasOwnProperty;

function setProfile(p, c) {
  dataStage(
    {
      type: 'profile_set',
      properties: p
    });
}

function setOnceProfile(p, c) {
  dataStage(
    {
      type: 'profile_set_once',
      properties: p
    });
}

function appendProfile(p, c) {
  if (!isObject(p)) {
    return false;
  }
  each(p, function (value, item) {
    if (isString(value)) {
      p[item] = [value];
    } else if (isArray(value)) {
      p[item] = value;
    } else {
      delete p[item];
      log('appendProfile属性的值必须是字符串或者数组');
    }
  });
  dataStage(
    {
      type: 'profile_append',
      properties: p
    });
}

function incrementProfile(p, c) {
  if (!isObject(p)) {
    return false;
  }
  var str = p;
  if (isString(p)) {
    p = {};
    p[str] = 1;
  }
  dataStage(
    {
      type: 'profile_increment',
      properties: p
    });
}

function track(e, p, c) {
  dataStage(
    {
      type: 'track',
      event: e,
      properties: p
    });
}

function identify(id, isSave) {
  if (!checkPrivacyStatus()) {
    return false;
  }
  if (!meta.init_status) {
    store.store_queue.push({
      method: 'identify',
      params: arguments
    });
    return false;
  }
  id = validId(id);
  if (id) {
    var firstId = store.getFirstId();
    if (isSave === true) {
      if (firstId) {
        store.set('first_id', id);
      } else {
        store.set('distinct_id', id);
      }
    } else {
      if (firstId) {
        store.change('first_id', id);
      } else {
        store.change('distinct_id', id);
      }
    }
  }
}

/**
 *
 * @param {object} idObj 分别为 id: id 值、event_name: 事件名、id_name: 自定义 ID 的 name
 * @param {*} e
 * @param {*} p
 * @param {*} c
 * 原传参方式通过 4 个参数来实现，但使用过程中并未传入 p 和 c 参数，故不做处理
 * 兼容原有 ID 处理逻辑，判断第一个参数是否为一个对象，是对象则为新 3.0 的接口，需要按 3.0 的传参逻辑进行参数获取
 * 在现逻辑中为了不修改老 3.0 中调用 trackSignup 逻辑，若登录 ID key 为默认的 $identity_login_id 则不传 idName 参数
 */
function trackSignup(idObj, e, p, c) {
  var currentId, eventName, idName, distinctId, originalId;
  if (isObject(idObj)) {
    currentId = idObj.id;
    eventName = idObj.event_name;
    idName = idObj.id_name;
  } else {
    currentId = idObj;
    eventName = e;
  }
  // 按照原有逻辑修改 distinct_id 的值
  store.set('distinct_id', currentId);

  // 上报 $SignUp 事件前，先获取 original_id、distinct_id 的值
  if (idName && idName !== IDENTITY_KEY.LOGIN) {
    distinctId = idName + '+' + currentId;
  } else {
    distinctId = currentId;
  }

  originalId = store.getFirstId() || store.getDistinctId();

  dataStage(
    {
      original_id: originalId,
      distinct_id: distinctId,
      login_id: distinctId,
      type: 'track_signup',
      event: eventName,
      properties: p
    });
}

function login(id) {
  id = validId(id);
  // 如果 ID 不合法直接返回
  if (!id) {
    return false;
  }

  // 如果传入的 ID 和匿名 ID 相同则返回
  if (isSameAndAnonymousID(id)) {
    return false;
  }

  var firstId = store.getFirstId();
  var distinctId = store.getDistinctId();
  var idName = IDENTITY_KEY.LOGIN;

  // 通过 _.isNewLoginId 判断是否为新的登录 ID，并通过 newLoginId 保存
  var newLoginId = isNewLoginId(idName, id);
  if (newLoginId) {
    // 此时并未将修改的 login_id 保存到 storage 中
    store._state.identities[idName] = id;

    // 将登录 ID 保存到 history_login_id 对象中
    store.set('history_login_id', {
      name: idName,
      value: id
    });

    // 处理 trackSignup 逻辑，其中 newDistinctId 作为 2.0 的 distinct_id 通过 trackSignup 进行保存
    if (!firstId) {
      store.set('first_id', distinctId);
    }

    sa.trackSignup({
      id: id,
      event_name: '$SignUp'
    });

    // trackSignup 完之后更行 storage 中的 ID
    // 若登录 ID 发生改变，此时将登录 id 保存到 storage，并且清除其他 ID
    store.identitiesSet({
      type: 'login',
      id: id,
      id_name: idName
    });
  }
}

/**
 * 通过自定义的登录 ID 的 key（name）值进行登录
 * @param {string} name
 * @param {string} id
 * @returns
 */
function loginWithKey(name, id) {
  if (!isString(name)) {
    log('Key must be String');
    return false;
  }
  // 这个单独判断 name 的 length 是为了符合测试提出的多端检查统一，保证判断 loginWithKey 的 key 值时长度超过 100 打印日志，但继续做后续 ID 绑定
  // 同时 checkKeyword 未做修改，是为了保持原有统一检查逻辑不变，以免影响到其他检查
  // 在 name 的 length 的值小于 100 的情况下，若其他检查不符，会做 return 处理
  var info;
  if (!check.checkKeyword(name) && name.length > 100) {
    info = 'Key [' + name + '] is invalid';
    log(info);
  } else if (!check.checkKeyword(name)) {
    info = 'Key [' + name + '] is invalid';
    log(info);
    return false;
  }
  var listKeys = ['$mp_openid', '$identity_mp_openid', '$identity_mp_unionid', '$mp_unionid', '$mp_id', '$identity_mp_id'];
  if (isPresetIdKeys(name, listKeys)) {
    info = 'Key [' + name + '] is invalid';
    log(info);
    return false;
  }
  id = validId(id);
  // 如果 ID 不合法，直接返回
  if (!id) {
    return false;
  }

  // 如果传入的 ID 和匿名 ID 相同则返回
  if (isSameAndAnonymousID(id)) {
    return false;
  }

  var firstId = store.getFirstId();
  var distinctId = store.getDistinctId();
  // 通过 _.isNewLoginId 判断是否为新的登录 ID，并通过 newLoginId 保存
  var newLoginId = isNewLoginId(name, id);
  if (newLoginId) {
    // 此时并未将修改的 login_id 保存到 storage 中
    store._state.identities[name] = id;

    // 将登录 ID 保存到 history_login_id 对象中
    store.set('history_login_id', {
      name: name,
      value: id
    });

    if (!firstId) {
      store.set('first_id', distinctId);
    }

    sa.trackSignup({
      id: id,
      event_name: '$SignUp',
      id_name: name
    });
    // trackSignup 完之后更行 storage 中的 ID
    // 若登录 ID 发生改变，此时将 login 保存到 storage，并且清除其他 ID
    store.identitiesSet({
      type: 'login',
      id: id,
      id_name: name
    });
  }
}

function getAnonymousID() {
  if (isEmptyObject(store._state)) {
    log('请先初始化SDK');
  } else {
    return store._state._first_id || store._state.first_id || store._state._distinct_id || store._state.distinct_id;
  }
}

/**
 * 获取 identities 接口
 * @returns {object}
 */
function getIdentities() {
  if (isEmptyObject(store._state)) {
    log('请先初始化SDK');
    return null;
  } else {
    return store._state.identities || null;
  }
}

function logout(isChangeId) {
  var firstId = store.getFirstId();

  // IDM3 ID identities 先做更新，然后更新外层的 ID
  store.identitiesSet({ type: 'logout' });
  // 删除 history_login_id 的登录 ID
  store.set('history_login_id', {
    name: '',
    value: ''
  });

  if (firstId) {
    store.set('first_id', '');
    if (isChangeId === true) {
      store.set('distinct_id', store.getUUID());
    } else {
      store.set('distinct_id', firstId);
    }
  } else {
    log('没有first_id，logout失败');
  }
}

function getPresetProperties() {
  if (meta.preset_properties && meta.preset_properties.$lib) {
    var builtinProps = {};
    each(meta.preset_properties, function (value, item) {
      if (item.indexOf('$') === 0) {
        builtinProps[item] = value;
      }
    });
    var propertyObj = {
      $url_path: getCurrentPath(),
      $is_first_day: getIsFirstDay(),
      $is_first_time: meta.is_first_launch
    };
    var obj = extend(builtinProps, propertyObj, meta.preset_properties, store.getProps());
    delete obj.$lib;
    return obj;
  } else {
    return {};
  }
}

function setOpenid(openid, isCover) {
  openid = validId(openid);
  if (!openid) {
    return false;
  }
  if (!checkPrivacyStatus()) {
    return false;
  }
  if (!meta.init_status) {
    store.store_queue.push({
      method: 'setOpenid',
      params: arguments
    });
    return false;
  }
  log('该方法已不建议使用，如果是 id2 用户，请使用 identify 代替，如果是 id3 用户，请使用 bindOpenid 代替');
  if (isCover) {
    log('%c 当前版本 setOpenid 接口 已不支持传入第二个参数', 'color:#F39C12;font-size: 14px;');
  }
  store.set('openid', openid);
  sa.identify(openid, true);

  // IDM 3.0 只修改 identities 对象中 ID 的值，不上报 $BindID 事件
  var name = getOpenidNameByAppid();
  store._state.identities[name] = openid;
  store.save();
}

function unsetOpenid(val) {
  log('该方法已不建议使用，如果是 id3 用户，请使用 unbindOpenid 代替');
  var id = validId(val);
  if (!id) {
    return false;
  }
  var openid = store._state.openid;
  if (openid === id) {
    store.set('openid', '');
  }

  // IDM 3.0 只修改 identities 对象中 ID 的值，不上报 $UnbindID 事件
  var name = getOpenidNameByAppid();
  if (hasOwnProperty$3.call(store._state.identities, name) && id === store._state.identities[name]) {
    delete store._state.identities[name];

    // 2022-11-29-老乡鸡优化
    var first_id = store.getFirstId();
    var distinct_id = store.getDistinctId();
    var mp_id = store._state && store._state.identities && store._state.identities.$identity_mp_id;

    if (first_id && first_id === openid && mp_id) {
      store.change('first_id', mp_id);
    }
    if (distinct_id && distinct_id === openid && mp_id) {
      store.change('distinct_id', mp_id);
    }

    store.save();
  }
}

function bindOpenid(openid) {
  openid = validId(openid);
  if (!openid) {
    return false;
  }
  var name = getOpenidNameByAppid();
  this.bind(name, openid);
}

function unbindOpenid(val) {
  var id = validId(val);
  if (!id) {
    return false;
  }
  var name = getOpenidNameByAppid();
  // 不管本地有没有都要 unbind
  this.unbind(name, val);
}

function setUnionid(val) {
  var id = validId(val);
  if (id) {
    bind('$identity_mp_unionid', id);
  }
}

function unsetUnionid(val) {
  var id = validId(val);
  if (id) {
    // 为了与后端保持一致，解绑 unionid 时，若当前 unionid 存在，且与绑定的 ID 值一致，则清空 openid 及 unionid
    if (hasOwnProperty$3.call(store._state.identities, '$identity_mp_unionid') && id === store._state.identities['$identity_mp_unionid']) {
      var openid = getOpenidNameByAppid();
      if (hasOwnProperty$3.call(store._state.identities, openid)) {
        delete store._state.identities[openid];
        delete store._state.openid;
        store.save();
      }
    }
    unbind('$identity_mp_unionid', id);
  }
}

function initWithOpenid(options, callback) {
  options = options || {};
  if (options.appid) {
    saPara.appid = options.appid;
  }
  sa.openid.getOpenid(function (openid) {
    if (openid) {
      sa.setOpenid(openid, options.isCoverLogin);
    }
    if (callback && isFunction(callback)) {
      callback(openid);
    }
    sa.init(options);
  });
}

function bind(name, value) {
  if (isNumber(value)) {
    if (isInteger(value) && isSafeInteger(value) === false) {
      log('Value must be String');
      return false;
    }
    value = String(value);
  }
  if (!isString(name)) {
    log('Key must be String');
    return false;
  }
  // 获取当前的 login_id key
  var historyLoginId = store.getHistoryLoginId();
  var currentLoginIdName = historyLoginId ? historyLoginId.name : '';
  var info = '';
  // 通过 _.isPresetIdKeys 判断当前 ID 的 name 是否是预置的 ID key 值
  if (!check.checkKeyword(name) || isPresetIdKeys(name, [IDENTITY_KEY.LOGIN, currentLoginIdName, '$mp_id', '$identity_mp_id'])) {
    info = 'Key [' + name + '] is invalid';
    log(info);
    return false;
  }
  if (!value || value === '') {
    log('Value is empty or null');
    return false;
  }
  if (!isString(value)) {
    log('Value must be String');
    return false;
  }
  if (!check.checkIdLength(value)) {
    return false;
  }
  var identities = store._state.identities;
  identities[name] = value;
  store.save();

  dataStage({
    type: 'track_id_bind',
    event: '$BindID'
  });
}

function unbind(name, value) {
  if (isNumber(value)) {
    if (isInteger(value) && isSafeInteger(value) === false) {
      log('Value must be String');
      return false;
    }
    value = String(value);
  }
  if (!isString(name)) {
    log('Key must be String');
    return false;
  }
  var info = '';
  // 通过 _.isPresetIdKeys 判断是否是预置的 id key 值
  if (!sa._.check.checkKeyword(name) || isPresetIdKeys(name, [IDENTITY_KEY.LOGIN])) {
    info = 'Key [' + name + '] is invalid';
    log(info);
    return false;
  }
  if (!value || value === '') {
    log('Value is empty or null');
    return false;
  }
  if (!isString(value)) {
    log('Value must be String');
    return false;
  }
  if (!sa._.check.checkIdLength(value)) {
    return false;
  }

  if (hasOwnProperty$3.call(store._state.identities, name) && value === store._state.identities[name]) {
    if (name !== '$mp_id' && name !== '$identity_mp_id') {
      delete store._state.identities[name];
    }
    store.save();
  }
  var distinctId = store.getDistinctId();
  var firstId = store.getFirstId();
  var unbindDistinctId = name + '+' + value;

  if (distinctId === unbindDistinctId) {
    store.set('first_id', '');
    store.set('distinct_id', firstId);
    store.set('history_login_id', {
      name: '',
      value: ''
    });
  }
  var para = {};
  para[name] = value;
  dataStage({
    type: 'track_id_unbind',
    event: '$UnbindID',
    unbind_value: para
  });
}

/**
 * des: 传入web-view url 拼接 distinct_id 并返回
 * @param url string 必填
 * @param after_hash Boolean 默认 false 参数是否在 hash 前面，还是后面
 * author:zhigang
 */
function setWebViewUrl(url, after_hash) {
  log('setWebViewUrl 方法已从 2022-9-23 开始废弃，请尽快去除该 API 的调用，并使用 use 插件 代替');

  if (!isString(url) || url === '') {
    log('error:请传入正确的 URL 格式');
    return false;
  }

  if (!/^http(s)?:\/\//.test(url)) {
    log('warning: 请传入正确的 URL 格式');
    return false;
  }

  var reg = /([^?#]+)(\?[^#]*)?(#.*)?/,
    arr = reg.exec(url);

  if (!arr) {
    return false;
  }

  var host = arr[1] || '',
    search = arr[2] || '',
    hash = arr[3] || '',
    nurl = '';

  var distinct_id = store.getDistinctId() || '',
    first_id = store.getFirstId() || '',
    idIndex;

  if (urlSafeBase64 && urlSafeBase64.encode) {
    distinct_id = distinct_id ? urlSafeBase64.trim(urlSafeBase64.encode(urlBase64Encode(distinct_id))) : '';
  } else if (rot13obfs) {
    distinct_id = distinct_id ? rot13obfs(distinct_id) : '';
  }
  distinct_id = encodeURIComponent(distinct_id);
  var value = first_id ? 'f' + distinct_id : 'd' + distinct_id;

  if (after_hash) {
    idIndex = hash.indexOf('_sasdk');
    var queryIndex = hash.indexOf('?');
    if (queryIndex > -1) {
      if (idIndex > -1) {
        nurl = host + search + '#' + hash.substring(1, idIndex) + '_sasdk=' + value;
      } else {
        nurl = host + search + '#' + hash.substring(1) + '&_sasdk=' + value;
      }
    } else {
      nurl = host + search + '#' + hash.substring(1) + '?_sasdk=' + value;
    }
  } else {
    idIndex = search.indexOf('_sasdk');
    var hasQuery = /^\?(\w)+/.test(search);
    if (hasQuery) {
      if (idIndex > -1) {
        //如果 url 带有 sasdk 字段，进行值替换
        var newSearch = search.replace(/(_sasdk=)([^&]*)/gi, '_sasdk=' + value);
        nurl = host + newSearch + hash;
      } else {
        nurl = host + '?' + search.substring(1) + '&_sasdk=' + value + hash;
      }
    } else {
      nurl = host + '?' + search.substring(1) + '_sasdk=' + value + hash;
    }
  }

  return nurl;
}

function quick() {
  // 方法名
  var arg0 = arguments[0];
  // 传入的参数
  var arg1 = arguments[1];
  // 需要自定义的属性
  var arg2 = arguments[2];

  var prop = isObject(arg2) ? arg2 : {};
  if (arg0 === 'getAnonymousID') {
    if (isEmptyObject(store._state)) {
      log('请先初始化SDK');
    } else {
      return store._state._first_id || store._state.first_id || store._state._distinct_id || store._state.distinct_id;
    }
  } else if (arg0 === 'appLaunch' || arg0 === 'appShow') {
    if (arg1) {
      sa.autoTrackCustom[arg0](arg1, prop);
    } else {
      log('App的launch和show，在sensors.quick第二个参数必须传入App的options参数');
    }
  } else if (arg0 === 'appHide') {
    prop = isObject(arg1) ? arg1 : {};
    sa.autoTrackCustom[arg0](prop);
  }
}

function appLaunch(option, prop) {
  var obj = {};
  if (option && option.scene) {
    meta.current_scene = option.scene;
    obj.$scene = getMPScene(option.scene);
  } else {
    obj.$scene = '未取到值';
  }
  // 如果是从收藏夹进入小程序就把 query 中的 sampshare 删除
  if (option && option.scene && option.scene === 1010 && option.query) {
    if (option.query.sampshare) {
      delete option.query.sampshare;
    }
    delObjectKey(option.query);
  }
  if (option && option.path) {
    obj.$url_path = getPath(option.path);
    obj.$title = getPageTitle(option.path);
  }
  // 设置分享的信息
  setShareInfo(option, obj);
  // 设置utm的信息
  var utms = setUtm(option, obj);

  if (meta.is_first_launch) {
    obj.$is_first_time = true;
    if (!isEmptyObject(utms.pre1)) {
      sa.setOnceProfile(utms.pre1);
    }
  } else {
    obj.$is_first_time = false;
  }

  setLatestChannel(utms.pre2);
  setSfSource(option, obj);
  sa.registerApp({ $latest_scene: obj.$scene });

  obj.$url_query = setQuery(option.query);
  obj.$url = option.path + (obj.$url_query ? '?' + obj.$url_query : '');
  //设置 ref
  setPageRefData(prop);
  if (isObject(prop)) {
    obj = extend(obj, prop);
  }
  sa.track('$MPLaunch', obj);
}

function appShow(option, prop) {
  var obj = {};
  meta.mp_show_time = new Date().getTime();
  if (option && option.scene) {
    meta.current_scene = option.scene;
    obj.$scene = getMPScene(option.scene);
  } else {
    obj.$scene = '未取到值';
  }
  // 如果是从收藏夹进入小程序就把 query 中的 sampshare 删除
  if (option && option.scene && option.scene === 1010 && option.query) {
    if (option.query.sampshare) {
      delete option.query.sampshare;
    }
    delObjectKey(option.query);
  }

  if (option && option.path) {
    obj.$url_path = getPath(option.path);
    obj.$title = getPageTitle(option.path);
  }
  setShareInfo(option, obj);
  var utms = setUtm(option, obj);
  setLatestChannel(utms.pre2);
  setSfSource(option, obj);
  sa.registerApp({ $latest_scene: obj.$scene });
  obj.$url_query = setQuery(option.query);
  if (option && option.path) {
    obj.$url = option.path + (obj.$url_query ? '?' + obj.$url_query : '');
  }
  //设置 ref
  setPageRefData(obj, option.path, obj.$url_query);
  if (isObject(prop)) {
    obj = extend(obj, prop);
  }
  sa.track('$MPShow', obj);
}

function appHide(prop) {
  var current_time = new Date().getTime();
  var obj = {};
  obj.$url_path = getCurrentPath();
  if (meta.mp_show_time && current_time - meta.mp_show_time > 0 && (current_time - meta.mp_show_time) / 3600000 < 24) {
    obj.event_duration = (current_time - meta.mp_show_time) / 1000;
  }
  //设置 ref
  setPageRefData(obj);
  if (isObject(prop)) {
    obj = extend(obj, prop);
  }
  sa.track('$MPHide', obj);
  sa.sendStrategy.onAppHide();
}

function pageShow(prop) {
  var obj = {};
  var router = getCurrentPath();
  var title = getPageTitle(router);
  var currentPage = getCurrentPage();
  if (title) {
    obj.$title = title;
  }
  obj.$url_path = router;
  obj.$url_query = currentPage.sensors_mp_url_query ? currentPage.sensors_mp_url_query : '';
  obj = extend(obj, getUtmFromPage());
  setPageSfSource(obj);
  //设置 ref
  setPageRefData(obj);
  if (isObject(prop)) {
    obj = extend(obj, prop);
  }
  sa.track('$MPViewScreen', obj);
}

function setPara(para) {
  sa.para = extend2Lev(saPara, para);
  var channel = [];
  if (isArray(saPara.source_channel)) {
    var len = saPara.source_channel.length;
    var reserve_channel = ' utm_source utm_medium utm_campaign utm_content utm_term sa_utm ';
    for (var c = 0; c < len; c++) {
      if (reserve_channel.indexOf(' ' + saPara.source_channel[c] + ' ') === -1) {
        channel.push(saPara.source_channel[c]);
      }
    }
  }
  saPara.source_channel = channel;

  if (isObject(saPara.register)) {
    extend(meta.preset_properties, saPara.register);
  }

  // 初始化各种预定义参数
  if (!saPara.openid_url) {
    saPara.openid_url = saPara.server_url.replace(/([^\\/])\/(sa)(\.gif){0,1}/, '$1/mp_login');
  }

  if (typeof saPara.send_timeout !== 'number') {
    saPara.send_timeout = 1000;
  }

  var batch_send_default = {
    send_timeout: 6000,
    max_length: 6
  };

  // 如果已经配置为批量发送，且未定义请求撤销时间的情况下，设置请求撤销时间为 10s
  if (para && para.datasend_timeout) ; else if (saPara.batch_send) {
    saPara.datasend_timeout = 10000;
  }

  // 如果是true，转换成对象
  if (saPara.batch_send === true) {
    saPara.batch_send = extend({}, batch_send_default);
  } else if (isObject(saPara.batch_send)) {
    saPara.batch_send = extend({}, batch_send_default, saPara.batch_send);
  }

  var is_persistent_save_default = {
    share: false,
    utm: false
  };

  if (saPara.is_persistent_save === true) {
    saPara.is_persistent_save = extend({}, is_persistent_save_default);
    saPara.is_persistent_save.utm = true;
  } else if (isObject(saPara.is_persistent_save)) {
    saPara.is_persistent_save = extend({}, is_persistent_save_default, saPara.is_persistent_save);
  }

  if (!saPara.server_url) {
    log('请使用 setPara() 方法设置 server_url 数据接收地址,详情可查看https://www.sensorsdata.cn/manual/mp_sdk_new.html#112-%E5%BC%95%E5%85%A5%E5%B9%B6%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0');
    return;
  }

  saPara.preset_properties = isObject(saPara.preset_properties) ? saPara.preset_properties : {};

  // 对设置的 autotrack_exclude_page 属性进行检查，若配置异常，则设置为默认值
  if (!isObject(saPara.autotrack_exclude_page)) {
    saPara.autotrack_exclude_page = {
      pageShow: [],
      pageLeave: []
    };
  }
  if (!isArray(saPara.autotrack_exclude_page.pageShow)) {
    saPara.autotrack_exclude_page.pageShow = [];
  }
  if (!isArray(saPara.autotrack_exclude_page.pageLeave)) {
    saPara.autotrack_exclude_page.pageLeave = [];
  }
}

function getServerUrl() {
  return saPara.server_url;
}

var autoTrackCustom = {
  trackCustom: function (api, prop, event) {
    var temp = saPara.autoTrack[api];
    var tempFunc = '';
    if (saPara.autoTrack && temp) {
      if (typeof temp === 'function') {
        tempFunc = temp();
        if (isObject(tempFunc)) {
          extend(prop, tempFunc);
        }
      } else if (isObject(temp)) {
        extend(prop, temp);
        saPara.autoTrack[api] = true;
      }
      sa.track(event, prop);
    }
  },
  appLaunch: function (para, not_use_auto_track) {
    // 注意：不要去修改 para
    // if (typeof this === 'object' && !this['trackCustom']) {
    //   this[saPara.name] = sa;
    // }
    if (!checkPrivacyStatus()) {
      return false;
    }
    // 对 appLaunch 进行暂存
    if (!meta.initialState.isComplete) {
      meta.initialState.queue.push(['appLaunch', arguments]);
      meta.life_state.app_launched = true;
      return false;
    }
    meta.life_state.app_launched = true;
    var prop = {};
    if (para && para.scene) {
      meta.current_scene = para.scene;
      prop.$scene = getMPScene(para.scene);
    } else {
      prop.$scene = '未取到值';
    }
    // 如果是从收藏夹进入小程序就把 query 中的 sampshare 删除
    if (para && para.scene && para.scene === 1010 && para.query) {
      if (para.query.sampshare) {
        delete para.query.sampshare;
      }
      delObjectKey(para.query);
    }
    if (para && para.path) {
      prop.$url_path = getPath(para.path);
      prop.$title = getPageTitle(para.path);

      if (para.query && isObject(para.query)) {
        var _query = setQuery(para.query);
        _query = _query ? '?' + _query : '';
        prop.$url = prop.$url_path + _query;
      }
    }
    // 设置分享的信息
    setShareInfo(para, prop);
    // 设置utm的信息
    var utms = setUtm(para, prop);
    if (meta.is_first_launch) {
      prop.$is_first_time = true;
      if (!isEmptyObject(utms.pre1)) {
        sa.setOnceProfile(utms.pre1);
      }
    } else {
      prop.$is_first_time = false;
    }

    setLatestChannel(utms.pre2);
    setSfSource(para, prop);
    sa.registerApp({ $latest_scene: prop.$scene });

    prop.$url_query = setQuery(para.query);
    //设置 ref
    setPageRefData(prop);
    if (not_use_auto_track) {
      prop = extend(prop, not_use_auto_track);
      sa.track('$MPLaunch', prop);
    } else if (saPara.autoTrack && saPara.autoTrack.appLaunch) {
      sa.autoTrackCustom.trackCustom('appLaunch', prop, '$MPLaunch');
    }
  },
  appShow: function (para, not_use_auto_track) {
    // 注意：不要去修改 para
    var prop = {};

    meta.mp_show_time = new Date().getTime();

    if (para && para.scene) {
      meta.current_scene = para.scene;
      prop.$scene = getMPScene(para.scene);
    } else {
      prop.$scene = '未取到值';
    }

    // 如果是从收藏夹进入小程序就把 query 中的 sampshare 删除
    if (para && para.scene && para.scene === 1010 && para.query) {
      if (para.query.sampshare) {
        delete para.query.sampshare;
      }
      delObjectKey(para.query);
    }

    if (para && para.path) {
      prop.$url_path = getPath(para.path);
      prop.$title = getPageTitle(para.path);
    }
    // 设置分享的信息
    setShareInfo(para, prop);

    var utms = setUtm(para, prop);

    setLatestChannel(utms.pre2);
    setSfSource(para, prop);

    sa.registerApp({ $latest_scene: prop.$scene });
    prop.$url_query = setQuery(para.query);
    //设置 ref
    setPageRefData(prop, para.path, prop.$url_query);
    if (para && para.path) {
      prop.$url = para.path + (prop.$url_query ? '?' + prop.$url_query : '');
    }
    if (not_use_auto_track) {
      prop = extend(prop, not_use_auto_track);
      sa.track('$MPShow', prop);
    } else if (saPara.autoTrack && saPara.autoTrack.appShow) {
      sa.autoTrackCustom.trackCustom('appShow', prop, '$MPShow');
    }
  },
  appHide: function (not_use_auto_track) {
    var current_time = new Date().getTime();
    var prop = {};
    prop.$url_path = getCurrentPath();
    if (meta.mp_show_time && current_time - meta.mp_show_time > 0 && (current_time - meta.mp_show_time) / 3600000 < 24) {
      prop.event_duration = (current_time - meta.mp_show_time) / 1000;
    }
    //设置 ref
    setPageRefData(prop);
    if (not_use_auto_track) {
      prop = extend(prop, not_use_auto_track);
      sa.track('$MPHide', prop);
    } else if (saPara.autoTrack && saPara.autoTrack.appHide) {
      sa.autoTrackCustom.trackCustom('appHide', prop, '$MPHide');
    }
  },
  pageLoad: function (para) {
    if (meta.current_scene && meta.current_scene === 1010 && para) {
      if (para.sampshare) {
        delete para.sampshare;
      }
      delObjectKey(para);
    }
    // 注意：不要去修改 para
    if (para && isObject(para)) {
      this.sensors_mp_url_query = setQuery(para);
      this.sensors_mp_encode_url_query = setQuery(para, true);
    }
  },
  pageShow: function () {
    meta.page_show_time = Date.now();
    var prop = {};
    var router = getCurrentPath();
    var title = getPageTitle(router);
    setRefPage();
    prop.$url_path = router;
    prop.$url_query = this.sensors_mp_url_query ? this.sensors_mp_url_query : '';
    prop = extend(prop, getUtmFromPage());
    //设置 ref
    setPageRefData(prop);
    // 设置 SF 渠道属性
    setPageSfSource(prop);
    // 设置页面标题
    if (title) {
      prop.$title = title;
    }
    if (saPara.onshow) {
      saPara.onshow(sa, router, this);
    } else if (saPara.autotrack_exclude_page.pageShow.indexOf(router) === -1) {
      sa.autoTrackCustom.trackCustom('pageShow', prop, '$MPViewScreen');
    }
  },
  pageShare: function (option) {
    var oldMessage = option.onShareAppMessage;
    var isPromise = function (val) {
      return !!val && isFunction(val.then) && isFunction(val.catch);
    };

    option.onShareAppMessage = function () {
      var me = this;
      meta.share_method = '转发消息卡片';
      var oldShareValue = oldMessage.apply(this, arguments);

      if (saPara.autoTrack && saPara.autoTrack.pageShare) {
        var prop = {
          $url_path: getCurrentPath(),
          $share_depth: meta.query_share_depth,
          $share_method: meta.share_method
        };
        //设置 ref
        setPageRefData(prop);
        sa.autoTrackCustom.trackCustom('pageShare', prop, '$MPShare');
      }

      function setPath(value) {
        if (!isObject(value)) {
          value = {};
        }

        if (isUndefined(value.path) || value.path === '') {
          value.path = getCurrentUrl(me);
        }

        if (isString(value.path)) {
          if (value.path.indexOf('?') === -1) {
            value.path = value.path + '?';
          } else {
            if (value.path.slice(-1) !== '&') {
              value.path = value.path + '&';
            }
          }
        }
        value.path = value.path + getShareInfo();
        return value;
      }

      if (sa.para.allow_amend_share_path) {
        oldShareValue = setPath(oldShareValue);
        //如果返回来的参数包含 promise
        if (isObject(oldShareValue)) {
          for (var key in oldShareValue) {
            if (isPromise(oldShareValue[key])) {
              try {
                oldShareValue[key] = oldShareValue[key].then(function (data) {
                  return setPath(data);
                });
              } catch (error) {
                log('onShareAppMessage: ' + error);
              }
            }
          }
        }
      }

      return oldShareValue;
    };
  },
  pageShareTimeline: function (option) {
    var oldMessage = option.onShareTimeline;

    option.onShareTimeline = function () {
      meta.share_method = '朋友圈分享';
      var oldValue = oldMessage.apply(this, arguments);
      if (saPara.autoTrack && saPara.autoTrack.pageShare) {
        var prop = {
          $url_path: getCurrentPath(),
          $share_depth: meta.query_share_depth,
          $share_method: meta.share_method
        };
        //设置 ref
        setPageRefData(prop);
        sa.autoTrackCustom.trackCustom('pageShare', prop, '$MPShare');
      }

      if (saPara.allow_amend_share_path) {
        if (typeof oldValue !== 'object') {
          oldValue = {};
        }
        if (typeof oldValue === 'object' && typeof oldValue.query === 'undefined') {
          oldValue.query = '';
        }
        if (typeof oldValue === 'object' && typeof oldValue.query === 'string' && oldValue.query !== '') {
          if (oldValue.query.slice(-1) !== '&') {
            oldValue.query = oldValue.query + '&';
          }
        }

        oldValue.query = oldValue.query + getShareInfo();
      }
      return oldValue;
    };
  },
  pageAddFavorites: function () {
    var prop = {};
    prop.$url_path = getCurrentPath();
    if (saPara.autoTrack && saPara.autoTrack.mpFavorite) {
      sa.autoTrackCustom.trackCustom('mpFavorite', prop, '$MPAddFavorites');
    }
  },
  pageHide: function () {
    if (sa.para.autoTrack && sa.para.autoTrack.pageLeave) {
      // 原有 sendPageLeave 的逻辑
      sendPageLeave();
    }
  }
};

function sendPageLeave() {
  var currentPage = {};
  var router = '';
  try {
    currentPage = getCurrentPage();
    router = currentPage ? currentPage.route : '';
  } catch (error) {
    log(error);
  }
  if (meta.page_show_time >= 0 && router !== '') {
    var prop = {};
    var title = getPageTitle(router);
    var page_stay_time = (Date.now() - meta.page_show_time) / 1000;
    if (isNaN(page_stay_time) || page_stay_time < 0) {
      page_stay_time = 0;
    }
    prop.$url_query = currentPage.sensors_mp_url_query ? currentPage.sensors_mp_url_query : '';
    prop.$url_path = router;
    prop.$title = title;
    prop.event_duration = page_stay_time;
    // 数据上报前，判断当前页面是否采集
    if (saPara.autotrack_exclude_page.pageLeave.indexOf(router) === -1) {
      sa.track('$MPPageLeave', prop);
    }
    meta.page_show_time = -1;
  }
}

// 获取openid，先从storage里获取，
var openid = {
  getRequest: function (callback) {
    wx.login({
      success: function (res) {
        if (res.code && saPara.appid && saPara.openid_url) {
          wxrequest({
            url: saPara.openid_url + '&code=' + res.code + '&appid=' + saPara.appid,
            method: 'GET',
            complete: function (res2) {
              if (isObject(res2) && isObject(res2.data) && res2.data.openid) {
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
  getWXStorage: function () {
    var storageInfo = store.getStorage();
    if (storageInfo && isObject(storageInfo)) {
      return storageInfo.openid;
    }
  },
  getOpenid: function (callback) {
    if (!saPara.appid) {
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

var functions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setProfile: setProfile,
  setOnceProfile: setOnceProfile,
  appendProfile: appendProfile,
  incrementProfile: incrementProfile,
  track: track,
  identify: identify,
  trackSignup: trackSignup,
  login: login,
  loginWithKey: loginWithKey,
  getAnonymousID: getAnonymousID,
  getIdentities: getIdentities,
  logout: logout,
  getPresetProperties: getPresetProperties,
  setOpenid: setOpenid,
  unsetOpenid: unsetOpenid,
  bindOpenid: bindOpenid,
  unbindOpenid: unbindOpenid,
  setUnionid: setUnionid,
  unsetUnionid: unsetUnionid,
  bindUnionid: setUnionid,
  unbindUnionid: unsetUnionid,
  initWithOpenid: initWithOpenid,
  bind: bind,
  unbind: unbind,
  setWebViewUrl: setWebViewUrl,
  quick: quick,
  appLaunch: appLaunch,
  appShow: appShow,
  appHide: appHide,
  pageShow: pageShow,
  setPara: setPara,
  getServerUrl: getServerUrl,
  sendPageLeave: sendPageLeave,
  openid: openid,
  autoTrackCustom: autoTrackCustom,
  registerApp: registerApp,
  register: register,
  clearAllRegister: clearAllRegister,
  clearAppRegister: clearAppRegister,
  clearAllProps: clearAllProps
});

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-28 16:02:00
 * @File: API 对外输出
 */

function buildAPI(sa) {
  //对外 API 设置
  for (var f in functions) {
    sa[f] = functions[f];
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-04 15:05:47
 * @File: 设置首次访问时间
 */

function setFirstVisitTime() {
  if (meta.is_first_launch) {
    setOnceProfile({ $first_visit_time: new Date() });
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-07-04 14:42:20
 * @File: SDK 初始化后 触发事件队列
 */

function checkIsComplete() {
  meta.initialState.isComplete = true;
  if (meta.initialState.queue.length > 0) {
    each(meta.initialState.queue, function (content) {
      if (content[0] === 'appLaunch') {
        sa.autoTrackCustom.appLaunch.apply(sa.autoTrackCustom, slice.call(content[1]));
      } else {
        sa[content[0]].apply(sa, slice.call(content[1]));
      }
    });
    meta.initialState.queue = [];
  }
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-15 16:24:10
 * @File:
 */

// 初始化 SDK 数据发送
function init (obj) {
  if (meta.init_status === true) {
    return false;
  }
  meta.init_status = true;
  sa.ee.sdk.emit('beforeInit');

  //兼容老的参数配置逻辑
  if (obj && isObject(obj)) {
    sa.setPara(obj);
  }
  sa.ee.sdk.emit('initPara');
  sa.ee.sdk.emit('afterInitPara');

  //用户信息初始化
  sa.store.init();

  // sa.ee.sdk.emit('initAPI');
  // //可以用非发数据API，不能用发数据API，不能写API
  // sa.ee.sdk.emit('afterInitAPI');

  // sa.ee.sdk.emit('afterInit');

  //插件状态检查
  sa.checkPluginInitStatus();

  //初始化 首次
  setFirstVisitTime();

  //是否开启批量发送
  if (sa.para.batch_send) {
    sa.sendStrategy.init();
  }

  function readySystemInfo() {
    checkIsComplete();
    // 检查 appLaunch 事件是否发生或上报，未上报则完成一次上报
    checkAppLaunch();

    // ready 前不能有任何 track。可以用所有API，可以发数据
    sa.ee.sdk.emit('ready');
  }

  var promiseArr = [getNetworkType(), getSystemInfo()].concat(meta.promise_list);
  Promise.all(promiseArr)
    .then(() => {
      readySystemInfo();
    })
    .catch(() => {
      readySystemInfo();
    });
}

function registerPropertyPlugin(arg) {
  if (!isFunction(arg.properties)) {
    log('registerPropertyPlugin arguments error, properties must be function');
    return;
  }

  if (arg.isMatchedWithFilter && !isFunction(arg.isMatchedWithFilter)) {
    log('registerPropertyPlugin arguments error, isMatchedWithFilter must be function');
    return;
  }

  sa.ee.data.on('finalAdjustData', function (data) {
    try {
      if (isFunction(arg.isMatchedWithFilter)) {
        arg.isMatchedWithFilter(data) && arg.properties(data);
      } else {
        arg.properties(data);
      }
    } catch (e) {
      log('execute registerPropertyPlugin callback error:' + e);
    }
  });
}

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-06-15 15:45:40
 * @File:
 */

sa._ = _;
sa.modules = {};
sa.meta = meta;
sa.kit = kit;
sa.mergeStorageData = mergeStorageData;
sa.dataStage = dataStage;
sa.sendStrategy = sendStrategy;
sa.store = store;
sa.usePlugin = usePlugin;
sa.checkPluginInitStatus = checkPluginInitStatus;
sa.eventSub = eventSub;
sa.events = new eventEmitter();
sa.ee = ee;
sa.registerPropertyPlugin = registerPropertyPlugin;
sa.enableDataCollect = enableDataCollect; //合规方法

//兼容老的引用关系 渠道插件
sa.initialState = meta.initialState;
//兼容老的引用关系 ID3
sa.IDENTITY_KEY = {
  EMAIL: IDENTITY_KEY.EMAIL,
  MOBILE: IDENTITY_KEY.MOBILE
};

//暴露对外API,需要在 apiStaging 之前执行
buildAPI(sa);

//对外 API 方法暂存
apiStaging();

//获取通过 wx.setNavigationBarTitle 接口设置的页面标题
setNavigationBarTitle();
//监听网络变化
networkStatusChange();

//初始化全埋点
initAppGlobalName();
initAppShowHide();
initPageProxy();

sa.init = init;

var base = {
  plugin_version: '1.19.12'
};

function createPlugin(obj) {
  if (typeof obj === 'object'
    && typeof obj.plugin_name === 'string'
    && obj.plugin_name !== ''
  ) {
    obj.plugin_version = base.plugin_version;
    obj.log = obj.log || function(){
      if(typeof console === 'object' && typeof console.log === 'function'){
        console.log.apply(console,arguments);
      }
    };
    return obj;
  } else {
    typeof console === 'object'
      && typeof console.error === 'function'
      && console.error('plugin must contain  proprerty "plugin_name"');
  }
}

var disableSDK = {
  init(sa) {
    sa.disableSDK = this.disableSDK.bind(this);
    sa.enableSDK = this.enableSDK.bind(this);
    sa.getDisabled = this.getDisabled.bind(this);
  },
  plugin_name: 'DisableSDK',
  disabled: false,
  disableSDK() {
    this.disabled = true;
  },
  enableSDK() {
    this.disabled = false;
  },
  getDisabled() {
    return this.disabled;
  }
};

var DisableSDK = createPlugin(disableSDK);

sa.usePlugin(DisableSDK);

/*
 * @Author: wangzhigang@sensorsdata.cn
 * @Date: 2022-05-31 15:35:46
 * @File: 入口文件
 */

module.exports = sa;
