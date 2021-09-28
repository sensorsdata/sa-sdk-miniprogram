'use strict';

var _ = {};

var sa = {};

sa.para = {
  name: 'sensors',
  server_url: '',
  send_timeout: 1000,
  show_log: false,
  allow_amend_share_path: true,
  max_string_length: 500,
  datasend_timeout: 3000,
  source_channel: [],
  autoTrack: {
    appLaunch: true,
    appShow: true,
    appHide: true,
    pageShow: true,
    pageShare: true,
    mpClick: false,
    mpFavorite: true,
    pageLeave: false
  },
  autotrack_exclude_page: {
    pageShow: []
  },
  is_persistent_save: {
    share: false,
    utm: false
  },

  preset_properties: {
    url_path: true
  },
  preset_events: {
    moments_page: false,
    defer_track: false,
    share_info_use_string: false
  },
  batch_send: true,
  storage_store_key: 'sensorsdata2015_wechat',
  storage_prepare_data_key: 'sensors_mp_prepare_data'
};

var mpHook = {
  data: 1,
  onLoad: 1,
  onShow: 1,
  onReady: 1,
  onPullDownRefresh: 1,
  onReachBottom: 1,
  onShareAppMessage: 1,
  onShareTimeline: 1,
  onPullDownRefresh: 1,
  onReachBottom: 1,
  onPageScroll: 1,
  onResize: 1,
  onTabItemTap: 1,
  onHide: 1,
  onUnload: 1
};

var logger = typeof logger === 'object' ? logger : {};

logger.info = function() {
  if (sa.para.show_log) {
    if (typeof console === 'object' && console.log) {
      try {
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

  if (para && para.datasend_timeout);
  else if (!!sa.para.batch_send) {
    sa.para.datasend_timeout = 10000;
  }

  if (sa.para.batch_send === true) {
    sa.para.batch_send = _.extend({}, batch_send_default);
  } else if (_.isObject(sa.para.batch_send)) {
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

  sa.para.preset_properties = _.isObject(sa.para.preset_properties) ? sa.para.preset_properties : {};
};

sa.getServerUrl = function() {
  return sa.para.server_url;
};

sa.status = {};


var ArrayProto = Array.prototype,
  ObjProto = Object.prototype,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty,
  LIB_VERSION = '1.14.23',
  LIB_NAME = 'MiniProgram';

var source_channel_standard = 'utm_source utm_medium utm_campaign utm_content utm_term';
var latest_source_channel = ['$latest_utm_source', '$latest_utm_medium', '$latest_utm_campaign', '$latest_utm_content', '$latest_utm_term', '$latest_sa_utm'];
var latest_share_info = ['$latest_share_distinct_id', '$latest_share_url_path', '$latest_share_depth', '$latest_share_method'];
var share_info_key = ['sensors_share_d', 'sensors_share_p', 'sensors_share_i', 'sensors_share_m'];
var page_show_time = Date.now();

var mpshow_time = null;

var query_share_depth = 0;
var share_distinct_id = '';
var share_method = '';
var current_scene = '';

var is_first_launch = false;
var wxSDKVersion = '';
sa.lib_version = LIB_VERSION;

var globalTitle = {};
var page_route_map = [];

(function() {
  var nativeForEach = ArrayProto.forEach,
    nativeIndexOf = ArrayProto.indexOf,
    nativeIsArray = Array.isArray,
    breaker = {};

  var each = (_.each = function(obj, iterator, context) {
    if (obj == null) {
      return false;
    }
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
  });

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
        if (source[prop] !== void 0 && obj[prop] === void 0) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  _.isArray =
    nativeIsArray ||
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
      if (found || (found = value === target)) {
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
    return toString.call(obj) == '[object Object]';
  }
};

_.isEmptyObject = function(obj) {
  if (_.isObject(obj)) {
    for (var item in obj) {
      if (hasOwnProperty.call(obj, item)) {
        return false;
      }
    }
    return true;
  }
  return false;
};

_.isUndefined = function(obj) {
  return obj === void 0;
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
  return toString.call(obj) == '[object Number]' && /[\d\.]+/.test(String(obj));
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
  }
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

_.parseSuperProperties = function(obj) {
  if (_.isObject(obj)) {
    _.each(obj, function(value, item) {
      if (_.isFunction(value)) {
        try {
          obj[item] = value();
          if (_.isFunction(obj[item])) {
            logger.info('您的属性- ' + item + ' 格式不满足要求，我们已经将其删除');
            delete obj[item];
          }
        } catch (e) {
          delete obj[item];
          logger.info('您的属性- ' + item + ' 抛出了异常，我们已经将其删除');
        }
      }
    });
    _.strip_sa_properties(obj);
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
};

_.urlSafeBase64 = (function() {
  var ENC = {
    '+': '-',
    '/': '_',
    '=': '.'
  };
  var DEC = {
    '-': '+',
    _: '/',
    '.': '='
  };

  var encode = function(base64) {
    return base64.replace(/[+/=]/g, function(m) {
      return ENC[m];
    });
  };

  var decode = function(safe) {
    return safe.replace(/[-_.]/g, function(m) {
      return DEC[m];
    });
  };

  var trim = function(string) {
    return string.replace(/[.=]{1,2}$/, '');
  };

  var isBase64 = function(string) {
    return /^[A-Za-z0-9+/]*[=]{0,2}$/.test(string);
  };

  var isUrlSafeBase64 = function(string) {
    return /^[A-Za-z0-9_-]*[.]{0,2}$/.test(string);
  };

  return {
    encode: encode,
    decode: decode,
    trim: trim,
    isBase64: isBase64,
    isUrlSafeBase64: isUrlSafeBase64
  };
})();

_.btoa = function(string) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  string = String(string);
  var bitmap,
    a,
    b,
    c,
    result = '',
    i = 0,
    rest = string.length % 3;

  for (; i < string.length;) {
    if ((a = string.charCodeAt(i++)) > 255 || (b = string.charCodeAt(i++)) > 255 || (c = string.charCodeAt(i++)) > 255) {
      logger.info("Failed to execute 'btoa' : The string to be encoded contains characters outside of the Latin1 range.");
    }
    bitmap = (a << 16) | (b << 8) | c;
    result += b64.charAt((bitmap >> 18) & 63) + b64.charAt((bitmap >> 12) & 63) + b64.charAt((bitmap >> 6) & 63) + b64.charAt(bitmap & 63);
  }

  return rest ? result.slice(0, rest - 3) + '==='.substring(rest) : result;
};

_.urlBase64Encode = function(data) {
  return _.btoa(
    encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
    })
  );
};

_.rot13obfs = function(str, code_len) {
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
};

_.rot13defs = function(str) {
  var code_len = 13,
    n = 126,
    str = String(str);
  return _.rot13obfs(str, n - code_len);
};

_.getCurrentPage = function() {
  var obj = {};
  try {
    var pages = getCurrentPages();
    obj = pages[pages.length - 1];
  } catch (error) {
    logger.info(error);
  }

  return obj;
};

_.getCurrentPath = function() {
  var url = '未取到';
  try {
    var currentPage = _.getCurrentPage();
    url = currentPage ? currentPage.route : url;
  } catch (e) {
    logger.info(e);
  }
  return url;
};

_.getIsFirstDay = function() {
  if (typeof sa.store._state === 'object' && typeof sa.store._state.first_visit_day_time === 'number' && sa.store._state.first_visit_day_time > new Date().getTime()) {
    return true;
  } else {
    return false;
  }
};

_.getCurrentUrl = function(me) {
  var path = _.getCurrentPath();
  var query = '';
  if (_.isObject(me) && me.sensors_mp_encode_url_query) {
    query = me.sensors_mp_encode_url_query;
  }
  if (path) {
    return query ? path + '?' + query : path;
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
    if (typeof option[m] === 'function' && !mpHook[m]) {
      methods.push(m);
    }
  }
  return methods;
};

_.isClick = function(type) {
  var mpTaps = {
    tap: 1,
    longpress: 1,
    longtap: 1
  };
  return !!mpTaps[type];
};

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

_.setStorageSync = function(storage_key, value) {
  var fn = function() {
    wx.setStorageSync(storage_key, value);
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

_.getStorageSync = function(storage_key) {
  var store = '';
  try {
    store = wx.getStorageSync(storage_key);
  } catch (e) {
    try {
      store = wx.getStorageSync(storage_key);
    } catch (e2) {
      logger.info('getStorage fail');
    }
  }
  return store;
};

_.getMPScene = function(scene_value) {
  if (typeof scene_value === 'number' || (typeof scene_value === 'string' && scene_value !== '')) {
    scene_value = 'wx-' + String(scene_value);
    return scene_value;
  } else {
    return '未取到值';
  }
};

_.objToParam = function(param, isEncode) {
  if (Object.prototype.toString.call(param) !== '[object Object]') {
    logger.info('请传入有效对象');
    return '';
  }
  var queryParam = [];
  for (var key in param) {
    if (param.hasOwnProperty(key)) {
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
};

_.delObjectKey = function(obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    logger.info('请传入有效对象');
    return;
  }
  for (var i = 0; i < share_info_key.length; i++) {
    delete obj[share_info_key[i]];
  }
};

_.shareInfoData = function(para) {
  var shareData = {};
  var share = {};
  if (!sa.para.preset_events.share_info_use_string) {
    if (para.query.sampshare) {
      share = _.decodeURIComponent(para.query.sampshare);
      if (_.isJSONString(share)) {
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
    for (var i = 0; i < share_info_key.length; i++) {
      if (!share.hasOwnProperty(share_info_key[i])) {
        return {};
      }
      share[share_info_key[i]] = _.decodeURIComponent(share[share_info_key[i]]);
    }

    shareData = {
      depth: Number(share.sensors_share_d),
      path: share.sensors_share_p || '',
      id: share.sensors_share_i || '',
      method: share.sensors_share_m || ''
    };
  }

  return shareData;
};

_.setShareInfo = function(para, prop) {
  var share = {};
  var obj = {};
  var current_id = sa.store.getDistinctId();
  var current_first_id = sa.store.getFirstId();
  if (para && _.isObject(para.query)) {
    share = _.shareInfoData(para);
    if (!_.isEmptyObject(share)) {
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
  if (typeof method === 'string') {
    prop.$share_method = method;
    obj.$latest_share_method = method;
  } else {
    prop.$share_method = '取值异常';
  }
  _.setLatestShare(obj);
};

_.getShareInfo = function() {
  if (sa.para.preset_events.share_info_use_string) {
    var param = {
      sensors_share_i: sa.store.getDistinctId() || '取值异常',
      sensors_share_p: _.getCurrentPath(),
      sensors_share_d: query_share_depth,
      sensors_share_m: share_method
    };

    return _.objToParam(param, true);
  }

  var share_info = JSON.stringify({
    i: sa.store.getDistinctId() || '取值异常',
    p: _.getCurrentPath(),
    d: query_share_depth,
    m: share_method
  });

  return 'sampshare=' + encodeURIComponent(share_info);
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
    if (scene.indexOf('?') !== -1) {
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

_.setSfSource = function(para, prop) {
  if (!_.isEmptyObject(para.query) && para.query._sfs) {
    prop.$sf_source = para.query._sfs;
    sa.registerApp({
      $latest_sf_source: prop.$sf_source
    });
  }
};

_.setPageSfSource = function(prop) {
  try {
    var allpages = getCurrentPages();
    var myvar = JSON.parse(JSON.stringify(allpages[allpages.length - 1].options));
    for (var i in myvar) {
      myvar[i] = _.decodeURIComponent(myvar[i]);
    }

    if (!_.isEmptyObject(myvar) && myvar._sfs) {
      prop.$sf_source = myvar._sfs;
    }
  } catch (e) {
    logger.info(e);
  }
};

try {
  var oldSetNavigationBarTitle = wx.setNavigationBarTitle;
  Object.defineProperty(wx, 'setNavigationBarTitle', {
    get: function() {
      return function(titleObj) {
        var pages = getCurrentPages();
        var currentPagePath = pages[pages.length - 1].route || '';
        titleObj = _.isObject(titleObj) ? titleObj : {};
        globalTitle[currentPagePath] = titleObj.title;
        oldSetNavigationBarTitle.call(this, titleObj);
      };
    }
  });
} catch (err) {
  logger.info(err);
}

_.setRefPage = function() {

  try {
    var pages = getCurrentPages();
    if (pages && pages.length === 1) {
      var current_path = pages[pages.length - 1].route;
      var current_title = _.getPageTitle(current_path);
      var currentPageInfo = {
        title: current_title,
        route: current_path
      };

      if (page_route_map.length >= 2) {
        if (page_route_map[page_route_map.length - 1].route !== currentPageInfo.route) {
          page_route_map.push(currentPageInfo);
          page_route_map.shift();
        }
      } else {
        page_route_map.push(currentPageInfo);
      }
    }
  } catch (error) {
    logger.info(error);
  }
};

_.getRefPage = function() {
  var _refInfo = {
    route: '直接打开',
    title: ''
  };

  try {
    var pages = getCurrentPages();
    if (pages && pages.length >= 2) {
      _refInfo.route = pages[pages.length - 2].route;
      _refInfo.title = _.getPageTitle(_refInfo.route);
    } else if (pages && pages.length >= 1) {
      if (page_route_map.length >= 2) {
        var refPages = page_route_map;
        _refInfo.route = refPages[refPages.length - 2].route;
        _refInfo.title = _.getPageTitle(_refInfo.route);
      }

      if (_refInfo.route === pages[pages.length - 1].route) {
        _refInfo = {
          title: '',
          route: '直接打开'
        };
      }
    }
  } catch (error) {
    logger.info(error);
  }
  return _refInfo;
};

_.setPageRefData = function(prop) {
  var refPage = _.getRefPage();
  if (_.isObject(prop)) {
    prop.$referrer = refPage.route;
    prop.$referrer_title = refPage.title;
  }
};

_.getPageTitle = function(route) {
  if (route === '未取到' || !route) {
    return false;
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
        globalConfigTitle.titleVal = wxConfig.global.window.navigationBarTitleText;
      }
      if (currentPageConfig && currentPageConfig.window && currentPageConfig.window.navigationBarTitleText) {
        pageConfigTitle.titleVal = currentPageConfig.window.navigationBarTitleText;
      }

      if (!pageConfigTitle.titleVal && __wxAppCode__) {
        var page_config = __wxAppCode__[route + '.json'];
        if (page_config && page_config['navigationBarTitleText']) {
          pageConfigTitle.titleVal = page_config['navigationBarTitleText'];
        }
      }

      _.each(globalTitle, function(v, k) {
        if (k === route) {
          return (title = v);
        }
      });
      if (title.length === 0) {
        var finalTitle = _.extend(globalConfigTitle, pageConfigTitle);
        title = finalTitle.titleVal;
      }
    }
  } catch (err) {
    logger.info(err);
  }
  return title;
};

_.wxrequest = function(obj) {
  if (_.compareSDKVersion(wxSDKVersion, '2.10.0') >= 0) {
    obj.timeout = sa.para.datasend_timeout;
    wx.request(obj);
  } else {
    var rq = wx.request(obj);
    setTimeout(function() {
      if (_.isObject(rq) && _.isFunction(rq.abort)) {
        rq.abort();
      }
    }, sa.para.datasend_timeout);
  }
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

_.validId = function(id) {
  if ((typeof id !== 'string' && typeof id !== 'number') || id === '') {
    logger.info('输入 ID 类型错误');
    return false;
  }
  if (typeof id === 'number') {
    id = String(id);
    if (!/^\d+$/.test(id)) {
      logger.info('输入 ID 类型错误');
      return false;
    }
  }
  return id;
};

_.compareSDKVersion = function(v1, v2) {
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
};

_.setUpperCase = function(value) {
  if (_.isString(value)) {
    return value.toLocaleUpperCase();
  }
  return value;
};

_.info = {
  currentProps: {},
  properties: {
    $lib: LIB_NAME,
    $lib_version: String(LIB_VERSION)
  },
  getSystem: function() {
    var e = this.properties;

    function getNetwork() {
      wx.getNetworkType({
        success: function(t) {
          e.$network_type = _.setUpperCase(t['networkType']);
        },
        complete: getSystemInfo
      });
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
        success: function(t) {
          e.$brand = _.setUpperCase(t['brand']);
          e.$manufacturer = t['brand'];
          e.$model = t['model'];
          e.$screen_width = Number(t['screenWidth']);
          e.$screen_height = Number(t['screenHeight']);
          e.$os = formatSystem(t['platform']);
          e.$os_version = t['system'].indexOf(' ') > -1 ? t['system'].split(' ')[1] : t['system'];
          wxSDKVersion = t['SDKVersion'];
        },
        complete: function() {
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
      });
    }

    getNetwork();
  }
};

sa._ = _;

_.eventEmitter = function() {
  this.sub = [];
};
_.eventEmitter.prototype = {
  add: function(item) {
    this.sub.push(item);
  },
  emit: function(event, data) {
    this.sub.forEach(function(temp) {
      temp.on(event, data);
    });
  }
};

_.eventSub = function(handle) {
  sa.events.add(this);
  this._events = [];
  this.handle = handle;
  this.ready = false;
};

_.eventSub.prototype = {
  on: function(event, data) {
    if (this.ready) {
      if (_.isFunction(this.handle)) {
        try {
          this.handle(event, data);
        } catch (error) {
          logger.info(error);
        }
      }
    } else {
      this._events.push({
        event,
        data
      });
    }
  },
  isReady: function() {
    var that = this;
    that.ready = true;
    that._events.forEach(function(item) {
      if (_.isFunction(that.handle)) {
        try {
          that.handle(item.event, item.data);
        } catch (error) {
          logger.info(error);
        }
      }
    });
  }
};

sa.eventSub = _.eventSub;

sa.events = new _.eventEmitter();

sa.usePlugin = function(plugin, para) {
  if (typeof plugin.init === 'function') {
    plugin.init(sa, para);
  }
};

sa.prepareData = function(p, callback) {
  if (current_scene && current_scene === 1154 && !sa.para.preset_events.moments_page) {
    return false;
  }

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
    data._track_id = Number(String(Math.random()).slice(2, 5) + String(Math.random()).slice(2, 4) + String(Date.now()).slice(-4));
    data.properties = _.extend({}, _.info.properties, sa.store.getProps(), _.info.currentProps, data.properties);
    if (p.type === 'track') {
      data.properties.$is_first_day = _.getIsFirstDay();
    }

    var refPage = _.getRefPage();
    if (!data.properties.hasOwnProperty('$referrer')) {
      data.properties.$referrer = refPage.route;
    }

    if (!data.properties.hasOwnProperty('$referrer_title')) {
      data.properties.$referrer_title = refPage.title;
    }
  }
  if (data.properties.$time && _.isDate(data.properties.$time)) {
    data.time = data.properties.$time * 1;
    delete data.properties.$time;
  } else {
    data.time = new Date() * 1;
  }

  _.parseSuperProperties(data.properties);

  _.searchObjDate(data);
  _.searchObjString(data);

  logger.info(data);
  sa.events.emit('send', data);

  sa.sendStrategy.send(data);
};

sa.store = {
  storageInfo: null,
  getUUID: function() {
    return (
      '' +
      Date.now() +
      '-' +
      Math.floor(1e7 * Math.random()) +
      '-' +
      Math.random().toString(16).replace('.', '') +
      '-' +
      String(Math.random() * 31242)
      .replace('.', '')
      .slice(0, 8)
    );
  },
  getStorage: function() {
    if (this.storageInfo) {
      return this.storageInfo;
    } else {
      this.storageInfo = sa._.getStorageSync(sa.para.storage_store_key) || '';
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
        sa.events.emit('changeDistinctId');
      }
    }
    this.save();
  },
  change: function(name, value) {
    this._state['_' + name] = value;
  },
  encryptStorage: function() {
    var copyState = this.getStorage();
    var flag = 'data:enc;';
    if (_.isObject(copyState)) {
      copyState = flag + _.rot13obfs(JSON.stringify(copyState));
    } else if (_.isString(copyState)) {
      if (copyState.indexOf(flag) === -1) {
        copyState = flag + _.rot13obfs(copyState);
      }
    }
    sa._.setStorageSync(sa.para.storage_store_key, copyState);
  },
  save: function() {
    var copyState = JSON.parse(JSON.stringify(this._state));
    delete copyState._first_id;
    delete copyState._distinct_id;
    if (sa.para.encrypt_storage) {
      var flag = 'data:enc;';
      copyState = flag + _.rot13obfs(JSON.stringify(copyState));
    }
    sa._.setStorageSync(sa.para.storage_store_key, copyState);
  },
  init: function() {
    var info = this.getStorage();
    var flag = 'data:enc;';
    if (info) {
      if (_.isString(info)) {
        if (info.indexOf(flag) !== -1) {
          info = info.substring(flag.length);
          info = JSON.parse(_.rot13defs(info));
        }
      }
      this.toState(info);
    } else {
      is_first_launch = true;
      var time = new Date();
      var visit_time = time.getTime();
      time.setHours(23);
      time.setMinutes(59);
      time.setSeconds(60);
      sa.setOnceProfile({
        $first_visit_time: new Date()
      });
      this.set({
        distinct_id: this.getUUID(),
        first_visit_time: visit_time,
        first_visit_day_time: time.getTime()
      });
    }
  }
};

sa.setProfile = function(p, c) {
  sa.prepareData({
      type: 'profile_set',
      properties: p
    },
    c
  );
};

sa.setOnceProfile = function(p, c) {
  sa.prepareData({
      type: 'profile_set_once',
      properties: p
    },
    c
  );
};

sa.appendProfile = function(p, c) {
  if (!_.isObject(p)) {
    return false;
  }
  _.each(p, function(value, item) {
    if (_.isString(value)) {
      p[item] = [value];
    } else if (_.isArray(value));
    else {
      delete p[item];
      logger.info('appendProfile属性的值必须是字符串或者数组');
    }
  });
  sa.prepareData({
      type: 'profile_append',
      properties: p
    },
    c
  );
};

sa.incrementProfile = function(p, c) {
  if (!_.isObject(p)) {
    return false;
  }
  var str = p;
  if (_.isString(p)) {
    p = {};
    p[str] = 1;
  }
  sa.prepareData({
      type: 'profile_increment',
      properties: p
    },
    c
  );
};

sa.track = function(e, p, c) {
  this.prepareData({
      type: 'track',
      event: e,
      properties: p
    },
    c
  );
};

sa.identify = function(id, isSave) {
  id = _.validId(id);
  if (id) {
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
    },
    c
  );
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
    _.each(obj, function(value, item) {
      if (!_.include(arr, item)) {
        props[item] = value;
      }
    });
    sa.store.setProps(props, true);
  }
};

sa.clearAppRegister = function(arr) {
  if (_.isArray(arr)) {
    _.each(_.info.currentProps, function(value, item) {
      if (_.include(arr, item)) {
        delete _.info.currentProps[item];
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
  if (share.$latest_share_depth || share.$latest_share_distinct_id || share.$latest_share_url_path || share.$latest_share_method) {
    sa.clearAppRegister(latest_share_info);
    sa.clearAllProps(latest_share_info);

    sa.para.is_persistent_save.share ? sa.register(share) : sa.registerApp(share);
  }
};

sa.login = function(id) {
  id = _.validId(id);
  if (id) {
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
  }
};

sa.getAnonymousID = function() {
  if (_.isEmptyObject(sa.store._state)) {
    logger.info('请先初始化SDK');
  } else {
    return sa.store._state._first_id || sa.store._state.first_id || sa.store._state._distinct_id || sa.store._state.distinct_id;
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

sa.getLocation = function() {
  wx.getSetting({
    success: function(res) {
      if (res.authSetting['scope.userLocation']) {
        wx.getLocation({
          type: sa.para.preset_properties.location.type,
          success: function(res) {
            sa.registerApp({
              $latitude: res.latitude * Math.pow(10, 6),
              $longitude: res.longitude * Math.pow(10, 6),
              $geo_coordinate_system: _.setUpperCase(sa.para.preset_properties.location.type)
            });
          },
          fail: function(err) {
            logger.info('获取位置失败', err);
          }
        });
      } else {
        return false;
      }
    }
  });
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
  if (sa.para.encrypt_storage) {
    this.store.encryptStorage();
  }
  if (sa.para.batch_send) {
    wx.getStorage({
      key: sa.para.storage_prepare_data_key,
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
    _.each(_.info.currentProps, function(value, item) {
      if (item.indexOf('$') === 0) {
        builtinProps[item] = value;
      }
    });
    var obj = _.extend(builtinProps, {
      $url_path: _.getCurrentPath(),
      $is_first_day: _.getIsFirstDay()
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
      if (sa.store.mem.getLength() >= 500) {
        logger.info('数据量存储过大，有异常');
        sa.store.mem.mdata.shift();
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
    url._flush_time = Date.now();
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
      var data,
        len,
        mdata = sa.store.mem.mdata;
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
        sa._.setStorageSync(sa.para.storage_prepare_data_key, sa.store.mem.mdata);
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

sa.setWebViewUrl = function(url, after_hash) {
  if (!_.isString(url) || url === '') {
    logger.info('error:请传入正确的 URL 格式');
    return false;
  }

  url = decodeURIComponent(url);
  var reg = /([^?#]+)(\?[^#]*)?(#.*)?/,
    arr = reg.exec(url);

  var host = arr[1] || '',
    search = arr[2] || '',
    hash = arr[3] || '',
    nurl = '';

  var distinct_id = sa.store.getDistinctId() || '',
    first_id = sa.store.getFirstId() || '',
    idIndex;

  if (_.urlSafeBase64 && _.urlSafeBase64.encode) {
    distinct_id = distinct_id ? _.urlSafeBase64.trim(_.urlSafeBase64.encode(_.urlBase64Encode(distinct_id))) : '';
  } else if (this._.rot13obfs) {
    distinct_id = distinct_id ? _.rot13obfs(distinct_id) : '';
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
};

_.each(['setProfile', 'setOnceProfile', 'track', 'quick', 'incrementProfile', 'appendProfile', 'login', 'logout', 'registerApp', 'register', 'clearAllRegister', 'clearAllProps', 'clearAppRegister'], function(method) {
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
    _.each(params, function(value, item) {
      if (!(item === 'q' && _.isString(value) && value.indexOf('http') === 0)) {
        if (isEncode) {
          arr.push(item + '=' + value);
        } else {
          arr.push(item + '=' + _.decodeURIComponent(value));
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
    var myvar = JSON.parse(JSON.stringify(allpages[allpages.length - 1].options));

    for (var i in myvar) {
      myvar[i] = _.decodeURIComponent(myvar[i]);
    }

    newObj = _.getCustomUtmFromQuery(myvar, '$', '_', '$');
  } catch (e) {
    logger.info(e);
  }
  return newObj;
};

_.sendPageLeave = function() {
  var currentPage = {};
  try {
    var pages = getCurrentPages();
    currentPage = pages[pages.length - 1];
  } catch (error) {
    logger.info(error);
  }
  var router = currentPage.route;
  if (page_show_time >= 0 && router !== '') {
    var prop = {};
    var title = _.getPageTitle(router);
    var page_stay_time = (Date.now() - page_show_time) / 1000;
    prop.$url_query = currentPage.sensors_mp_url_query ? currentPage.sensors_mp_url_query : '';
    prop.$url_path = router;
    prop.$title = title;
    prop.event_duration = page_stay_time;
    sa.track('$MPPageLeave', prop);
    page_show_time = -1;
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
    if (para && para.scene) {
      current_scene = para.scene;
      prop.$scene = _.getMPScene(para.scene);
    } else {
      prop.$scene = '未取到值';
    }
    if (para && para.scene && para.scene === 1010 && para.query) {
      if (para.query.sampshare) {
        delete para.query.sampshare;
      }
      _.delObjectKey(para.query);
    }
    if (para && para.path) {
      prop.$url_path = _.getPath(para.path);
      if (sa.para.preset_properties.url_path === true) {
        sa.registerApp({
          $url_path: prop.$url_path
        });
      }
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
    _.setSfSource(para, prop);
    sa.registerApp({
      $latest_scene: prop.$scene
    });

    prop.$url_query = _.setQuery(para.query);
    _.setPageRefData(prop);
    if (not_use_auto_track) {
      prop = _.extend(prop, not_use_auto_track);
      sa.track('$MPLaunch', prop);
    } else if (sa.para.autoTrack && sa.para.autoTrack.appLaunch) {
      sa.autoTrackCustom.trackCustom('appLaunch', prop, '$MPLaunch');
    }
  },
  appShow: function(para, not_use_auto_track) {
    var prop = {};

    mpshow_time = new Date().getTime();

    if (para && para.scene) {
      current_scene = para.scene;
      prop.$scene = _.getMPScene(para.scene);
    } else {
      prop.$scene = '未取到值';
    }

    if (para && para.scene && para.scene === 1010 && para.query) {
      if (para.query.sampshare) {
        delete para.query.sampshare;
      }
      _.delObjectKey(para.query);
    }

    if (para && para.path) {
      prop.$url_path = _.getPath(para.path);
      if (sa.para.preset_properties.url_path === true) {
        sa.registerApp({
          $url_path: prop.$url_path
        });
      }
    }
    if (_.isObject(sa.para.preset_properties.location) && (sa.para.preset_properties.location.type === 'wgs84' || sa.para.preset_properties.location.type === 'gcj02')) {
      sa.getLocation();
    }
    _.setShareInfo(para, prop);

    var utms = _.setUtm(para, prop);

    _.setLatestChannel(utms.pre2);
    _.setSfSource(para, prop);
    _.setPageRefData(prop);
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
    var current_time = new Date().getTime();
    var prop = {};
    prop.$url_path = _.getCurrentPath();
    if (mpshow_time && current_time - mpshow_time > 0 && (current_time - mpshow_time) / 3600000 < 24) {
      prop.event_duration = (current_time - mpshow_time) / 1000;
    }
    _.setPageRefData(prop);
    if (not_use_auto_track) {
      prop = _.extend(prop, not_use_auto_track);
      sa.track('$MPHide', prop);
    } else if (sa.para.autoTrack && sa.para.autoTrack.appHide) {
      sa.autoTrackCustom.trackCustom('appHide', prop, '$MPHide');
    }
    sa.sendStrategy.onAppHide();
  },
  pageLoad: function(para) {
    if (current_scene && current_scene === 1010 && para) {
      if (para.sampshare) {
        delete para.sampshare;
      }
      _.delObjectKey(para);
    }
    if (para && _.isObject(para)) {
      this.sensors_mp_url_query = _.setQuery(para);
      this.sensors_mp_encode_url_query = _.setQuery(para, true);
    }
  },
  pageShow: function() {
    page_show_time = Date.now();
    var prop = {};
    var router = _.getCurrentPath();
    var title = _.getPageTitle(router);
    _.setRefPage();
    prop.$url_path = router;
    prop.$url_query = this.sensors_mp_url_query ? this.sensors_mp_url_query : '';
    prop = _.extend(prop, _.getUtmFromPage());
    _.setPageRefData(prop);
    _.setPageSfSource(prop);
    if (title) {
      prop.$title = title;
    }
    if (sa.para.onshow) {
      sa.para.onshow(sa, router, this);
    } else if (!(_.isObject(sa.para.autotrack_exclude_page) && _.isArray(sa.para.autotrack_exclude_page.pageShow) && sa.para.autotrack_exclude_page.pageShow.indexOf(router) !== -1)) {
      sa.autoTrackCustom.trackCustom('pageShow', prop, '$MPViewScreen');
    }
    if (sa.para.preset_properties.url_path === true) {
      sa.registerApp({
        $url_path: router
      });
    }
  },
  pageShare: function(option) {
    var oldMessage = option.onShareAppMessage;

    option.onShareAppMessage = function() {
      share_method = '转发消息卡片';
      var oldValue = oldMessage.apply(this, arguments);

      if (sa.para.autoTrack && sa.para.autoTrack.pageShare) {
        var prop = {
          $url_path: _.getCurrentPath(),
          $share_depth: query_share_depth,
          $share_method: share_method
        };
        _.setPageRefData(prop);
        sa.autoTrackCustom.trackCustom('pageShare', prop, '$MPShare');
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

        oldValue.path = oldValue.path + _.getShareInfo();
      }

      return oldValue;
    };
  },
  pageShareTimeline: function(option) {
    var oldMessage = option.onShareTimeline;

    option.onShareTimeline = function() {
      share_method = '朋友圈分享';
      var oldValue = oldMessage.apply(this, arguments);
      if (sa.para.autoTrack && sa.para.autoTrack.pageShare) {
        var prop = {
          $url_path: _.getCurrentPath(),
          $share_depth: query_share_depth,
          $share_method: share_method
        };
        _.setPageRefData(prop);
        sa.autoTrackCustom.trackCustom('pageShare', prop, '$MPShare');
      }

      if (sa.para.allow_amend_share_path) {
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

        oldValue.query = oldValue.query + _.getShareInfo();
      }
      return oldValue;
    };
  },
  pageAddFavorites: function() {
    var prop = {};
    prop.$url_path = _.getCurrentPath();
    if (sa.para.autoTrack && sa.para.autoTrack.mpFavorite) {
      sa.autoTrackCustom.trackCustom('mpFavorite', prop, '$MPAddFavorites');
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
sa.appLaunch = function(option, prop) {
  var obj = {};
  if (option && option.scene) {
    current_scene = option.scene;
    obj.$scene = _.getMPScene(option.scene);
  } else {
    obj.$scene = '未取到值';
  }
  if (option && option.scene && option.scene === 1010 && option.query) {
    if (option.query.sampshare) {
      delete option.query.sampshare;
    }
    _.delObjectKey(option.query);
  }
  if (option && option.path) {
    obj.$url_path = _.getPath(option.path);
    if (sa.para.preset_properties.url_path === true) {
      sa.registerApp({
        $url_path: obj.$url_path
      });
    }
  }
  _.setShareInfo(option, obj);
  var utms = _.setUtm(option, obj);

  if (is_first_launch) {
    obj.$is_first_time = true;
    if (!_.isEmptyObject(utms.pre1)) {
      sa.setOnceProfile(utms.pre1);
    }
  } else {
    obj.$is_first_time = false;
  }

  _.setLatestChannel(utms.pre2);
  _.setSfSource(option, obj);
  sa.registerApp({
    $latest_scene: obj.$scene
  });

  obj.$url_query = _.setQuery(option.query);
  _.setPageRefData(prop);
  if (_.isObject(prop)) {
    obj = _.extend(obj, prop);
  }
  sa.track('$MPLaunch', obj);
};
sa.appShow = function(option, prop) {
  var obj = {};
  mpshow_time = new Date().getTime();
  if (option && option.scene) {
    current_scene = option.scene;
    obj.$scene = _.getMPScene(option.scene);
  } else {
    obj.$scene = '未取到值';
  }
  if (option && option.scene && option.scene === 1010 && option.query) {
    if (option.query.sampshare) {
      delete option.query.sampshare;
    }
    _.delObjectKey(option.query);
  }

  if (option && option.path) {
    obj.$url_path = _.getPath(option.path);
    if (sa.para.preset_properties.url_path === true) {
      sa.registerApp({
        $url_path: obj.$url_path
      });
    }
  }
  if (_.isObject(sa.para.preset_properties.location) && (sa.para.preset_properties.location.type === 'wgs84' || sa.para.preset_properties.location.type === 'gcj02')) {
    sa.getLocation();
  }
  _.setShareInfo(option, obj);
  var utms = _.setUtm(option, obj);
  _.setLatestChannel(utms.pre2);
  _.setSfSource(option, obj);
  sa.registerApp({
    $latest_scene: obj.$scene
  });
  obj.$url_query = _.setQuery(option.query);
  _.setPageRefData(obj);
  if (_.isObject(prop)) {
    obj = _.extend(obj, prop);
  }
  sa.track('$MPShow', obj);
};

sa.appHide = function(prop) {
  var current_time = new Date().getTime();
  var obj = {};
  obj.$url_path = _.getCurrentPath();
  if (mpshow_time && current_time - mpshow_time > 0 && (current_time - mpshow_time) / 3600000 < 24) {
    obj.event_duration = (current_time - mpshow_time) / 1000;
  }
  _.setPageRefData(obj);
  if (_.isObject(prop)) {
    obj = _.extend(obj, prop);
  }
  sa.track('$MPHide', obj);
  sa.sendStrategy.onAppHide();
};

sa.pageShow = function(prop) {
  var obj = {};
  var router = _.getCurrentPath();
  var title = _.getPageTitle(router);
  var currentPage = {};
  try {
    var pages = getCurrentPages();
    currentPage = pages[pages.length - 1];
  } catch (error) {
    logger.info(error);
  }
  if (sa.para.preset_properties.url_path === true) {
    sa.registerApp({
      $url_path: router
    });
  }
  if (title) {
    obj.$title = title;
  }
  obj.$url_path = router;
  obj.$url_query = currentPage.sensors_mp_url_query ? currentPage.sensors_mp_url_query : '';
  obj = _.extend(obj, _.getUtmFromPage());
  _.setPageSfSource(obj);
  _.setPageRefData(obj);
  if (_.isObject(prop)) {
    obj = _.extend(obj, prop);
  }
  sa.track('$MPViewScreen', obj);
};
sa.initial();

module.exports = sa;