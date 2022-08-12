'use strict';


var sa = {};


var nativeIsArray = Array.isArray,
  ObjProto = Object.prototype,
  ArrayProto = Array.prototype;

var nativeForEach = ArrayProto.forEach,
  nativeIndexOf = ArrayProto.indexOf,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty,
  slice = ArrayProto.slice;

var each = function(obj, iterator, context) {
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
};

function isObject(obj) {
  if (obj === undefined || obj === null) {
    return false;
  } else {
    return toString.call(obj) == '[object Object]';
  }
}

var getRandomBasic = (function() {
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

function extend(obj) {
  each(slice.call(arguments, 1), function(source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

function extend2Lev(obj) {
  each(slice.call(arguments, 1), function(source) {
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

function coverExtend(obj) {
  each(slice.call(arguments, 1), function(source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && obj[prop] === void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

var isArray =
  nativeIsArray ||
  function(obj) {
    return toString.call(obj) === '[object Array]';
  };

function isFunction(f) {
  if (!f) {
    return false;
  }
  var type = Object.prototype.toString.call(f);
  return type == '[object Function]' || type == '[object AsyncFunction]';
}

function isArguments(obj) {
  return !!(obj && hasOwnProperty.call(obj, 'callee'));
}

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

function values(obj) {
  var results = [];
  if (obj == null) {
    return results;
  }
  each(obj, function(value) {
    results[results.length] = value;
  });
  return results;
}

function include(obj, target) {
  var found = false;
  if (obj == null) {
    return found;
  }
  if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
    return obj.indexOf(target) != -1;
  }
  each(obj, function(value) {
    if (found || (found = value === target)) {
      return {};
    }
  });
  return found;
}

function trim(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

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

function isUndefined(obj) {
  return obj === void 0;
}

function isString(obj) {
  return toString.call(obj) == '[object String]';
}

function isDate(obj) {
  return toString.call(obj) == '[object Date]';
}

function isBoolean(obj) {
  return toString.call(obj) == '[object Boolean]';
}

function isNumber(obj) {
  return toString.call(obj) == '[object Number]' && /[\d\.]+/.test(String(obj));
}

function isJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

var isInteger =
  Number.isInteger ||
  function(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };

var isSafeInteger =
  Number.isSafeInteger ||
  function(value) {
    return isInteger(value) && Math.abs(value) <= Math.pow(2, 53) - 1;
  };

var _ = {
  each,
  isObject,
  getRandomBasic,
  getRandom,
  extend,
  extend2Lev,
  coverExtend,
  isArray,
  isFunction,
  isArguments,
  toArray,
  values,
  include,
  trim,
  isEmptyObject,
  deepCopy,
  isUndefined,
  isString,
  isDate,
  isBoolean,
  isNumber,
  isJSONString,
  isInteger,
  isSafeInteger,
  slice
};

var kit = {};

kit.buildData = function(p, custom_monitor_prop) {
  var data = {
    distinct_id: sa.store.getDistinctId(),
    identities: sa.store._state.identities,
    lib: {
      $lib: sa.lib_name,
      $lib_method: 'code',
      $lib_version: sa.lib_version
    },
    properties: {}
  };

  if (p.type === 'track_id_unbind' && p.event === '$UnbindID') {
    data.identities = _.deepCopy(p.unbind_value);
    delete p.unbind_value;
  }

  if (!_.isObject(custom_monitor_prop)) {
    custom_monitor_prop = {};
  }

  _.extend(data, sa.store.getUnionId(), p);

  if (_.isObject(p.properties) && !_.isEmptyObject(p.properties)) {
    _.extend(data.properties, p.properties);
  }

  if (!p.type || p.type.slice(0, 7) !== 'profile') {
    data._track_id = Number(String(getRandom()).slice(2, 5) + String(getRandom()).slice(2, 4) + String(Date.now()).slice(-4));
    data.properties = _.extend({}, _.info.properties, sa.store.getProps(), _.info.currentProps, custom_monitor_prop, data.properties);
    if (p.type === 'track') {
      data.properties.$is_first_day = _.getIsFirstDay();
    }

    setPublicProperties(data);
  }
  if (data.properties.$time && _.isDate(data.properties.$time)) {
    data.time = data.properties.$time * 1;
    delete data.properties.$time;
  } else {
    data.time = new Date() * 1;
  }

  sa.ee.sdk.emit('createData', data);

  _.parseSuperProperties(data.properties);
  _.searchObjDate(data);
  _.searchObjString(data);

  return data;
};

kit.processData = function(data) {
  return data;
};

kit.onceTrackData = function(data) {
  return 'data=' + encodeTrackData(data);
};

kit.batchTrackData = function(data) {
  var now = Date.now();
  data.forEach(function(v) {
    v._flush_time = now;
  });
  return 'data_list=' + encodeTrackData(data);
};


function encodeTrackData(data) {
  data = JSON.stringify(data);
  var dataStr = sa._.base64Encode(data);
  return encodeURIComponent(dataStr);
}

function setPublicProperties(data) {
  if (data && data.properties) {
    var refPage = sa._.getRefPage();
    var pageInfo = sa._.getCurrentPageInfo();
    var propertiesMap = {
      $referrer: refPage.route,
      $referrer_title: refPage.title,
      $title: pageInfo.title,
      $url: pageInfo.url
    };
    if (sa.para.preset_properties.url_path === true) {
      propertiesMap.$url_path = pageInfo.path;
    }
    for (var key in propertiesMap) {
      if (!data.properties.hasOwnProperty(key)) {
        data.properties[key] = propertiesMap[key];
      }
    }
  }
}

kit.onEventSend = function() {
  var custom_monitor_prop = {};
  return custom_monitor_prop;
};


var mergeStorageData = {};

mergeStorageData.getData = function(callback) {
  wx.getStorage({
    key: sa.para.storage_prepare_data_key,
    complete: function(res) {
      var queue = res.data && sa._.isArray(res.data) ? res.data : [];
      mergeStorageData.deleteAesData(queue);
      callback && callback();
    }
  });
};

mergeStorageData.deleteAesData = function(queue) {
  var arr = [];
  var queue_len = queue.length;
  if (queue_len > 0) {
    for (var i = 0; i < queue_len; i++) {
      if (sa._.isObject(queue[i])) {
        arr.push(queue[i]);
      }
    }
    sa.store.mem.mdata = arr.concat(sa.store.mem.mdata);
  }
};

var sendStrategy = {
  dataHasSend: true,
  dataHasChange: false,
  syncStorage: false,
  failTime: 0,
  init: function() {
    mergeStorageData.getData(sendStrategy.syncStorageState);
    sendStrategy.batchInterval();
  },
  syncStorageState: function() {
    sendStrategy.syncStorage = true;
  },
  onAppHide: function() {
    if (sa.para.batch_send) {
      this.batchSend();
    }
  },
  send: function(data) {
    this.dataHasChange = true;
    if (sa.store.mem.getLength() >= 500) {
      sa._.logger.info('数据量存储过大，有异常');
      sa.store.mem.mdata.shift();
    }

    data = kit.processData(data);
    if (data) {
      sa.store.mem.add(data);
    }
    if (sa.store.mem.getLength() >= sa.para.batch_send.max_length) {
      this.batchSend();
    }
  },
  wxrequest: function(option) {
    if (sa._.isArray(option.data) && option.data.length > 0) {
      var data = kit.batchTrackData(option.data);

      sa._.wxrequest({
        url: sa.para.server_url,
        method: 'POST',
        dataType: 'text',
        data: data,
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

function getSendUrl(url, data) {
  var encodeData = kit.onceTrackData(data);

  if (url.indexOf('?') !== -1) {
    return url + '&' + encodeData;
  }
  return url + '?' + encodeData;
}

function onceSend(data) {
  data._flush_time = Date.now();
  var url = getSendUrl(sa.para.server_url, data);
  sa._.wxrequest({
    url: url,
    method: 'GET'
  });
}


var saEvent = {};

saEvent.send = function(p, callback) {
  if (!sa.para.server_url) {
    sa._.logger.info('error: server_url 不能为空');
    return false;
  }

  if (sa.current_scene && sa.current_scene === 1154 && !sa.para.preset_events.moments_page) {
    return false;
  }

  var event_target = sa._.deepCopy(p);
  var custom_monitor_prop = sa.kit.onEventSend(event_target);

  var data = sa.kit.buildData(p, custom_monitor_prop);
  if (data) {
    saEvent.debug(data);
    sa.events.emit('send', data);
    if (sa.para.batch_send) {
      sendStrategy.send(data);
    } else {
      onceSend(data);
    }
  } else {
    sa._.logger.info('error: 数据异常 ' + data);
  }
};

saEvent.debug = function(data) {
  sa._.logger.info(data);
};

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
  mp_hook: {
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
  },
  user: {
    LOGIN_ID_KEY: '$identity_login_id'
  }
};

sa.popupEmitter = {
  attached: function() {
    return false;
  }
};

var usePlugin = function(plugin, para) {
  if (plugin && plugin.info && plugin.info.lib_plugin_name === 'miniprogram_abtesting') {
    if (typeof plugin.init === 'function') {
      plugin.init(sa, para);
    }
    return false;
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
    }
  }
};

var checkPluginInitStatus = function() {
  if (meta.plugin.uninitialized_list.length > 0) {
    for (var temp in meta.plugin.uninitialized_list) {
      var plugin_item = meta.plugin.uninitialized_list[temp];
      if (plugin_item && plugin_item.target && typeof plugin_item.target.init === 'function') {
        plugin_item.target.init(sa, plugin_item.para);
      }
    }
    meta.plugin.uninitialized_list = [];
  }
};

function checkPrivacyStatus() {
  var is_compliance_enabled;
  if (global && global.sensors_data_pre_config) {
    is_compliance_enabled = global.sensors_data_pre_config.is_compliance_enabled ? global.sensors_data_pre_config.is_compliance_enabled : false;
  }
  if (!is_compliance_enabled) {
    return true;
  }

  if (meta.init_status) {
    return true;
  }

  if (meta.privacy.enable_data_collect) {
    return true;
  } else {
    return false;
  }
}

function enableDataCollect() {
  meta.privacy.enable_data_collect = true;
}

function checkAppLaunch() {
  if (!meta.life_state.app_launched) {
    var option = wx.getLaunchOptionsSync() || {};
    sa.autoTrackCustom.appLaunch(option);
  }
}

function isValidListener(listener) {
  if (typeof listener === 'function') {
    return true;
  } else if (listener && typeof listener === 'object') {
    return isValidListener(listener.listener);
  } else {
    return false;
  }
}

function EventEmitter() {
  this._events = {};
}

EventEmitter.prototype.on = function(eventName, listener) {
  if (!eventName || !listener) {
    return false;
  }

  if (!isValidListener(listener)) {
    throw new Error('listener must be a function');
  }

  this._events[eventName] = this._events[eventName] || [];
  var listenerIsWrapped = typeof listener === 'object';

  this._events[eventName].push(
    listenerIsWrapped ?
    listener :
    {
      listener: listener,
      once: false
    }
  );

  return this;
};

EventEmitter.prototype.prepend = function(eventName, listener) {
  if (!eventName || !listener) {
    return false;
  }

  if (!isValidListener(listener)) {
    throw new Error('listener must be a function');
  }

  this._events[eventName] = this._events[eventName] || [];
  var listenerIsWrapped = typeof listener === 'object';

  this._events[eventName].unshift(
    listenerIsWrapped ?
    listener :
    {
      listener: listener,
      once: false
    }
  );

  return this;
};

EventEmitter.prototype.prependOnce = function(eventName, listener) {
  return this.prepend(eventName, {
    listener: listener,
    once: true
  });
};

EventEmitter.prototype.once = function(eventName, listener) {
  return this.on(eventName, {
    listener: listener,
    once: true
  });
};

EventEmitter.prototype.off = function(eventName, listener) {
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
};

EventEmitter.prototype.emit = function(eventName, args) {
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
};

EventEmitter.prototype.removeAllListeners = function(eventName) {
  if (eventName && this._events[eventName]) {
    this._events[eventName] = [];
  } else {
    this._events = {};
  }
};

EventEmitter.prototype.listeners = function(eventName) {
  if (eventName && typeof eventName === 'string') {
    return this._events[eventName];
  } else {
    return this._events;
  }
};

function isNewLoginId(name, id) {
  if (name === sa.store._state.history_login_id.name) {
    if (sa.store._state.history_login_id.value === id) {
      return false;
    }
  }
  return true;
}

function isSameAndAnonymousID(id) {
  var firstId = sa.store.getFirstId();
  var distinctId = sa.store.getDistinctId();
  if (firstId) {
    return id === firstId;
  } else {
    return id === distinctId;
  }
}

function isPresetIdKeys(name, ids) {
  var keyList = ['$identity_anonymous_id', '$mp_openid', '$identity_mp_openid', '$identity_mp_unionid', '$mp_unionid'];
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


sa.kit = kit;
sa.mergeStorageData = mergeStorageData;
sa.saEvent = saEvent;
sa.sendStrategy = sendStrategy;
sa._ = _;
sa.ee = {};
sa.ee.sdk = new EventEmitter();

sa.IDENTITY_KEY = {
  EMAIL: '$identity_email',
  MOBILE: '$identity_mobile'
};

sa.usePlugin = usePlugin;
sa.checkPluginInitStatus = checkPluginInitStatus;

sa.enableDataCollect = enableDataCollect;

sa.para = {
  name: 'sensors',
  server_url: '',
  send_timeout: 1000,
  show_log: false,
  login_id_key: '$identity_login_id',
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
    pageShow: [],
    pageLeave: []
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

_.logger = logger;

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
  else if (sa.para.batch_send) {
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

  if (!_.isObject(sa.para.autotrack_exclude_page)) {
    sa.para.autotrack_exclude_page = {
      pageShow: [],
      pageLeave: []
    };
  }
  if (!_.isArray(sa.para.autotrack_exclude_page.pageShow)) {
    sa.para.autotrack_exclude_page.pageShow = [];
  }
  if (!_.isArray(sa.para.autotrack_exclude_page.pageLeave)) {
    sa.para.autotrack_exclude_page.pageLeave = [];
  }
};

sa.getServerUrl = function() {
  return sa.para.server_url;
};

var LIB_VERSION = '1.17.12',
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
sa.lib_name = LIB_NAME;

var globalTitle = {};
var page_route_map = [];

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

_.check = {
  checkKeyword: function(para) {
    var reg = /^((?!^distinct_id$|^original_id$|^device_id$|^time$|^properties$|^id$|^first_id$|^second_id$|^users$|^events$|^event$|^user_id$|^date$|^datetime$|^user_group|^user_tag)[a-zA-Z_$][a-zA-Z\d_$]{0,99})$/i;
    return reg.test(para);
  },

  ckeckIdLength: function(str) {
    var temp = String(str);
    if (temp.length > 255) {
      logger.info('id 长度超过 255 个字符！');
      return false;
    }
    return true;
  }
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
      p[k] = temp;
    }
    if (!(_.isString(v) || _.isNumber(v) || _.isDate(v) || _.isBoolean(v) || _.isArray(v))) {
      logger.info('您的数据 - ' + k + ':' + v + ' - 格式不满足要求，已经将其删除');
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
    n = 126;
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
          if (content[0] === 'appLaunch') {
            sa.autoTrackCustom.appLaunch.apply(sa.autoTrackCustom, _.slice.call(content[1]));
          } else {
            sa[content[0]].apply(sa, _.slice.call(content[1]));
          }
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
    var allpages = _.getCurrentPage();
    var options = allpages ? allpages.options : '';
    var myvar = _.deepCopy(options);
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
        var currentPagePath = _.getCurrentPath();
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
  var urlText = '直接打开';
  var _refInfo = {
    route: urlText,
    path: urlText,
    title: ''
  };
  try {
    var pages = _.getCurrentPage();
    if (pages && pages.route) {
      var url_query = pages.sensors_mp_url_query ? '?' + pages.sensors_mp_url_query : '';
      var current_path = pages.route;
      var current_title = _.getPageTitle(current_path);
      _refInfo.route = current_path + url_query;
      _refInfo.path = current_path;
      _refInfo.title = current_title;

      var len = page_route_map.length;

      if (len >= 2) {
        page_route_map.shift();
        page_route_map.push(_refInfo);
      } else {
        page_route_map.push(_refInfo);
      }
    }
  } catch (error) {
    logger.info(error);
  }
};

_.getRefPage = function() {
  var urlText = '直接打开';
  var _refInfo = {
    route: urlText,
    path: urlText,
    title: ''
  };

  if (page_route_map.length > 1) {
    _refInfo.title = page_route_map[0].title;
    _refInfo.route = page_route_map[0].route;
    _refInfo.path = page_route_map[0].path;
  }

  return _refInfo;
};

_.getCurrentPageInfo = function() {
  var pages = _.getCurrentPage();
  var pageInfo = {
    title: '',
    url: '',
    path: '未取到'
  };
  if (pages && pages.route) {
    var query = pages.sensors_mp_url_query ? '?' + pages.sensors_mp_url_query : '';
    pageInfo.title = _.getPageTitle(pages.route);
    pageInfo.url = pages.route + query;
    pageInfo.path = pages.route;
  }
  return pageInfo;
};

_.setPageRefData = function(prop, path, query) {
  var refPage = _.getRefPage();

  if (_.isObject(prop)) {
    if (!path) {
      prop.$referrer = refPage.route;
      prop.$referrer_title = refPage.title;
    } else if (page_route_map.length > 0 && path) {
      query = query ? '?' + query : '';
      prop.$referrer = _.getPath(path) + query;
      prop.$referrer_title = _.getPageTitle(path);
    } else {
      prop.$referrer = '直接打开';
      prop.$referrer_title = '';
    }
  }
};

_.getPageTitle = function(route) {
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
        title = finalTitle.titleVal || '';
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

_.getAppInfoSync = function() {
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
};

_.getAppId = function() {
  var info = _.getAppInfoSync();
  if (info && info.appId) {
    return info.appId;
  }
  return '';
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
  if (!_.check.ckeckIdLength(id)) {
    return false;
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

_.getOpenidNameByAppid = function() {
  var appid = _.getAppId();
  var name = '$identity_mp_openid';
  if (appid) {
    name = '$identity_mp_' + appid + '_openid';
  }
  return name;
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
          e.$mp_client_app_version = t['version'];
          e.$mp_client_basic_library_version = wxSDKVersion;
        },
        complete: function() {
          var timeZoneOffset = new Date().getTimezoneOffset();
          var accountInfo = _.getAppInfoSync();
          if (_.isNumber(timeZoneOffset)) {
            e.$timezone_offset = timeZoneOffset;
          }
          if (accountInfo.appId) {
            e.$app_id = accountInfo.appId;
          }
          if (accountInfo.appVersion) {
            e.$app_version = accountInfo.appVersion;
          }
          sa.initialState.systemIsComplete = true;
          sa.initialState.checkIsComplete();
        }
      });
    }

    getNetwork();
  }
};

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

sa.store = {
  storageInfo: null,
  store_queue: [],
  getUUID: function() {
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
    var first_id = this._state._first_id || this._state.first_id;
    var distinct_id = this._state._distinct_id || this._state.distinct_id;
    var openid = this._state.openid;
    var history_login_id = this._state.history_login_id ? this._state.history_login_id : {};
    var old_login_id_name = history_login_id.name;
    if (this._state.identities && _.isString(this._state.identities)) {
      var identities = JSON.parse(_.rot13defs(this._state.identities));
      this._state.identities = identities;
    }

    var openid_name = _.getOpenidNameByAppid();

    if (this._state.identities && _.isObject(this._state.identities) && !_.isEmptyObject(this._state.identities)) {
      function getOldOpenidNameByAppid() {
        var appid = _.getAppId();
        var name = '$mp_openid';
        if (appid) {
          name = '$mp_' + appid + '_openid';
        }
        return name;
      }
      var old_openid_name = getOldOpenidNameByAppid();
      if (this._state.identities.hasOwnProperty('$mp_id')) {
        this._state.identities['$identity_mp_id'] = this._state.identities['$mp_id'];
        delete this._state.identities['$mp_id'];
      }
      if (this._state.identities.hasOwnProperty('$mp_unionid')) {
        this._state.identities['$identity_mp_unionid'] = this._state.identities['$mp_unionid'];
        delete this._state.identities['$mp_unionid'];
      }
      if (this._state.identities.hasOwnProperty(old_openid_name)) {
        this._state.identities[openid_name] = this._state.identities[old_openid_name];
        delete this._state.identities[old_openid_name];
      }

      if (this._state.identities.hasOwnProperty('$identity_anonymous_id')) {
        if (!first_id) {
          this._state.identities.$identity_anonymous_id = distinct_id;
        } else {
          this._state.identities.$identity_anonymous_id = first_id;
        }
      }
    } else {
      this._state.identities = {};
      this._state.identities.$identity_mp_id = this.getUUID();
      if (!first_id) {
        this._state.identities.$identity_anonymous_id = distinct_id;
      } else {
        this._state.identities.$identity_anonymous_id = first_id;
      }
    }

    if (openid) {
      this._state.identities[openid_name] = openid;
    }

    if (first_id) {
      if (old_login_id_name && this._state.identities.hasOwnProperty(old_login_id_name)) {
        if (this._state.identities[old_login_id_name] !== distinct_id) {
          this._state.identities[old_login_id_name] = distinct_id;
          for (var identitiesprop in this._state.identities) {
            if (this._state.identities.hasOwnProperty(identitiesprop)) {
              if (identitiesprop !== '$identity_mp_id' && identitiesprop !== old_login_id_name) {
                delete this._state.identities[identitiesprop];
              }
            }
          }
          this._state.history_login_id.value = distinct_id;
        }
      } else {
        this._state.identities[meta.user.LOGIN_ID_KEY] = distinct_id;
        for (var identitiesprop in this._state.identities) {
          if (this._state.identities.hasOwnProperty(identitiesprop)) {
            if (identitiesprop !== '$identity_mp_id' && identitiesprop !== meta.user.LOGIN_ID_KEY) {
              delete this._state.identities[identitiesprop];
            }
          }
        }
        this._state.history_login_id = {
          name: meta.user.LOGIN_ID_KEY,
          value: distinct_id
        };
      }
    } else {
      if (this._state.identities.hasOwnProperty('$identity_login_id') || this._state.identities.hasOwnProperty(old_login_id_name)) {
        for (var identitiesprop in this._state.identities) {
          if (this._state.identities.hasOwnProperty(identitiesprop)) {
            if (identitiesprop !== '$identity_mp_id' && identitiesprop !== '$identity_anonymous_id') {
              delete this._state.identities[identitiesprop];
            }
          }
        }
      }
      this._state.history_login_id = {
        name: '',
        value: ''
      };
    }
    this.save();
  },
  getFirstId: function() {
    return this._state._first_id || this._state.first_id;
  },
  getDistinctId: function() {
    var loginDistinctId = this.getLoginDistinctId();
    if (loginDistinctId) {
      return loginDistinctId;
    } else {
      return this._state._distinct_id || this._state.distinct_id;
    }
  },
  getUnionId: function() {
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
  getHistoryLoginId: function() {
    if (isObject(this._state.history_login_id)) {
      return this._state.history_login_id;
    } else {
      return null;
    }
  },
  getLoginDistinctId: function() {
    var historyLoginId = this.getHistoryLoginId();
    if (isObject(historyLoginId) && historyLoginId.value) {
      if (historyLoginId.name !== meta.user.LOGIN_ID_KEY) {
        return historyLoginId.name + '+' + historyLoginId.value;
      } else {
        return historyLoginId.value;
      }
    } else {
      return null;
    }
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
  identitiesSet: function(params) {
    var identities = {};
    switch (params.type) {
      case 'login':
        identities.$identity_mp_id = sa.store._state.identities.$identity_mp_id;
        identities[params.id_name] = params.id;
        break;
      case 'logout':
        identities.$identity_mp_id = sa.store._state.identities.$identity_mp_id;
        break;
      case 'identify':
        identities = _.deepCopy(sa.store._state.identities);
        identities.$identity_anonymous_id = params.id;
        break;
    }
    sa.store.set('identities', identities);
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
    var copyState = _.deepCopy(this._state);
    var identities = _.rot13obfs(JSON.stringify(copyState.identities));
    copyState.identities = identities;
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
        first_visit_day_time: time.getTime(),
        identities: {
          $identity_mp_id: this.getUUID()
        },
        history_login_id: {
          name: '',
          value: ''
        }
      });
    }
    sa.store.checkStoreInit();
  },
  checkStoreInit: function() {
    if (meta.init_status) {
      if (this.store_queue.length > 0) {
        _.each(this.store_queue, function(item) {
          sa[item.method].apply(sa, _.slice.call(item.params));
        });
      }
      this.store_queue = [];
    }
  }
};

sa.setProfile = function(p, c) {
  sa.saEvent.send({
      type: 'profile_set',
      properties: p
    },
    c
  );
};

sa.setOnceProfile = function(p, c) {
  sa.saEvent.send({
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
    } else {
      delete p[item];
      logger.info('appendProfile属性的值必须是字符串或者数组');
    }
  });
  sa.saEvent.send({
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
  sa.saEvent.send({
      type: 'profile_increment',
      properties: p
    },
    c
  );
};

sa.track = function(e, p, c) {
  this.saEvent.send({
      type: 'track',
      event: e,
      properties: p
    },
    c
  );
};

sa.identify = function(id, isSave) {
  if (!checkPrivacyStatus()) {
    return false;
  }
  if (!meta.init_status) {
    sa.store.store_queue.push({
      method: 'identify',
      params: arguments
    });
    return false;
  }
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
    sa.store.identitiesSet({
      type: 'identify',
      id: id
    });
  }
};

sa.trackSignup = function(idObj, e, p, c) {
  var currentId, eventName, idName, distinctId, originalId;
  if (isObject(idObj)) {
    currentId = idObj.id;
    eventName = idObj.event_name;
    idName = idObj.id_name;
  } else {
    currentId = idObj;
    eventName = e;
  }
  sa.store.set('distinct_id', currentId);

  if (idName && idName !== meta.user.LOGIN_ID_KEY) {
    distinctId = idName + '+' + currentId;
  } else {
    distinctId = currentId;
  }

  var originalId = sa.store.getFirstId() || sa.store.getDistinctId();

  sa.saEvent.send({
      original_id: originalId,
      distinct_id: distinctId,
      login_id: distinctId,
      type: 'track_signup',
      event: eventName,
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
  if (!id) {
    return false;
  }

  if (isSameAndAnonymousID(id)) {
    return false;
  }

  var firstId = sa.store.getFirstId();
  var distinctId = sa.store.getDistinctId();
  var idName = meta.user.LOGIN_ID_KEY;

  var newLoginId = isNewLoginId(idName, id);
  if (newLoginId) {
    sa.store._state.identities[idName] = id;

    sa.store.set('history_login_id', {
      name: idName,
      value: id
    });

    if (firstId) {
      sa.trackSignup({
        id: id,
        event_name: '$SignUp'
      });
    } else {
      sa.store.set('first_id', distinctId);
      sa.trackSignup({
        id: id,
        event_name: '$SignUp'
      });
    }

    sa.store.identitiesSet({
      type: 'login',
      id: id,
      id_name: idName
    });
  }
};

sa.loginWithKey = function(name, id) {
  if (!_.isString(name)) {
    logger.info('Key must be String');
    return false;
  }
  var info;
  if (!_.check.checkKeyword(name) && name.length > 100) {
    info = 'Key [' + name + '] is invalid';
    logger.info(info);
  } else if (!_.check.checkKeyword(name)) {
    info = 'Key [' + name + '] is invalid';
    logger.info(info);
    return false;
  }
  if (isPresetIdKeys(name, ['$mp_id', '$identity_mp_id'])) {
    var info = 'Key [' + name + '] is invalid';
    logger.info(info);
    return false;
  }
  id = _.validId(id);
  if (!id) {
    return false;
  }

  if (isSameAndAnonymousID(id)) {
    return false;
  }

  var firstId = sa.store.getFirstId();
  var distinctId = sa.store.getDistinctId();
  var newLoginId = isNewLoginId(name, id);
  if (newLoginId) {
    sa.store._state.identities[name] = id;

    sa.store.set('history_login_id', {
      name: name,
      value: id
    });

    if (firstId) {
      sa.trackSignup({
        id: id,
        event_name: '$SignUp',
        id_name: name
      });
    } else {
      sa.store.set('first_id', distinctId);
      sa.trackSignup({
        id: id,
        event_name: '$SignUp',
        id_name: name
      });
    }
    sa.store.identitiesSet({
      type: 'login',
      id: id,
      id_name: name
    });
  }
};

sa.getAnonymousID = function() {
  if (_.isEmptyObject(sa.store._state)) {
    logger.info('请先初始化SDK');
  } else {
    return sa.store._state._first_id || sa.store._state.first_id || sa.store._state._distinct_id || sa.store._state.distinct_id;
  }
};

sa.getIdentities = function() {
  if (_.isEmptyObject(sa.store._state)) {
    logger.info('请先初始化SDK');
    return null;
  } else {
    return sa.store._state.identities || null;
  }
};

sa.logout = function(isChangeId) {
  var firstId = sa.store.getFirstId();

  sa.store.identitiesSet({
    type: 'logout'
  });
  sa.store.set('history_login_id', {
    name: '',
    value: ''
  });

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

sa.init = function(obj) {
  if (meta.init_status === true) {
    return false;
  }
  meta.init_status = true;

  if (obj && _.isObject(obj)) {
    sa.setPara(obj);
  }
  sa.store.init();
  sa._.info.getSystem();

  sa.checkPluginInitStatus();
  if (sa.para.batch_send) {
    sendStrategy.init();
  }
  sa.initialState.storeIsComplete = true;
  sa.initialState.checkIsComplete();
  checkAppLaunch();
};

sa.getPresetProperties = function() {
  if (_.info && _.info.properties && _.info.properties.$lib) {
    var builtinProps = {};
    _.each(_.info.currentProps, function(value, item) {
      if (item.indexOf('$') === 0) {
        builtinProps[item] = value;
      }
    });
    var propertyObj = {
      $url_path: _.getCurrentPath(),
      $is_first_day: _.getIsFirstDay(),
      $is_first_time: is_first_launch
    };
    var obj = _.extend(builtinProps, propertyObj, _.info.properties, sa.store.getProps());
    delete obj.$lib;
    return obj;
  } else {
    return {};
  }
};

sa.setOpenid = function(openid, isCover) {
  var openid = _.validId(openid);
  if (!openid) {
    return false;
  }
  if (!checkPrivacyStatus()) {
    return false;
  }
  if (!meta.init_status) {
    sa.store.store_queue.push({
      method: 'setOpenid',
      params: arguments
    });
    return false;
  }
  if (isCover) {
    console.log('%c 当前版本 setOpenid 接口 已不支持传入第二个参数', 'color:#F39C12;font-size: 14px;');
  }
  sa.store.set('openid', openid);
  sa.identify(openid, true);

  var name = _.getOpenidNameByAppid();
  sa.store._state.identities[name] = openid;
  sa.store.save();
};

sa.unsetOpenid = function(val) {
  var id = _.validId(val);
  if (!id) {
    return false;
  }
  var openid = sa.store._state.openid;
  if (openid === id) {
    sa.store.set('openid', '');
  }

  var name = _.getOpenidNameByAppid();
  if (sa.store._state.identities.hasOwnProperty(name) && id === sa.store._state.identities[name]) {
    delete sa.store._state.identities[name];
    sa.store.save();
  }
};

sa.setUnionid = function(val) {
  var id = _.validId(val);
  if (id) {
    sa.store._state.identities['$identity_mp_unionid'] = id;
    sa.store.save();
  }
};

sa.unsetUnionid = function(val) {
  var id = _.validId(val);
  if (id) {
    if (sa.store._state.identities.hasOwnProperty('$identity_mp_unionid') && id === sa.store._state.identities['$identity_mp_unionid']) {
      var openid = _.getOpenidNameByAppid();
      if (sa.store._state.identities.hasOwnProperty(openid)) {
        delete sa.store._state.identities[openid];
        delete sa.store._state.openid;
        sa.store.save();
      }
      delete sa.store._state.identities['$identity_mp_unionid'];
      sa.store.save();
    }
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

sa.bind = function(name, value) {
  if (_.isNumber(value)) {
    if (_.isInteger(value) && _.isSafeInteger(value) === false) {
      logger.info('Value must be String');
      return false;
    }
    value = String(value);
  }
  if (!_.isString(name)) {
    logger.info('Key must be String');
    return false;
  }
  var historyLoginId = sa.store.getHistoryLoginId();
  var currentLoginIdName = historyLoginId ? historyLoginId.name : '';

  if (!_.check.checkKeyword(name) || isPresetIdKeys(name, [meta.user.LOGIN_ID_KEY, currentLoginIdName, '$mp_id', '$identity_mp_id'])) {
    var info = 'Key [' + name + '] is invalid';
    logger.info(info);
    return false;
  }
  if (!value || value === '') {
    logger.info('Value is empty or null');
    return false;
  }
  if (!_.isString(value)) {
    logger.info('Value must be String');
    return false;
  }
  if (!_.check.ckeckIdLength(value)) {
    var info = 'Value [' + value + '] is beyond the maximum length 255';
    logger.info(info);
    return false;
  }
  var identities = sa.store._state.identities;
  identities[name] = value;
  sa.store.save();

  sa.saEvent.send({
    type: 'track_id_bind',
    event: '$BindID'
  });
};

sa.unbind = function(name, value) {
  if (_.isNumber(value)) {
    if (_.isInteger(value) && _.isSafeInteger(value) === false) {
      logger.info('Value must be String');
      return false;
    }
    value = String(value);
  }
  if (!_.isString(name)) {
    logger.info('Key must be String');
    return false;
  }

  if (!_.check.checkKeyword(name) || isPresetIdKeys(name, [meta.user.LOGIN_ID_KEY])) {
    var info = 'Key [' + name + '] is invalid';
    logger.info(info);
    return false;
  }
  if (!value || value === '') {
    logger.info('Value is empty or null');
    return false;
  }
  if (!_.isString(value)) {
    logger.info('Value must be String');
    return false;
  }
  if (!_.check.ckeckIdLength(value)) {
    var info = 'Value [' + value + '] is beyond the maximum length 255';
    logger.info(info);
    return false;
  }

  if (sa.store._state.identities.hasOwnProperty(name) && value === sa.store._state.identities[name]) {
    if (name !== '$mp_id' && name !== '$identity_mp_id') {
      delete sa.store._state.identities[name];
    }
    sa.store.save();
  }
  var distinctId = sa.store.getDistinctId();
  var firstId = sa.store.getFirstId();
  var unbindDistinctId = name + '+' + value;

  if (distinctId === unbindDistinctId) {
    sa.store.set('first_id', '');
    sa.store.set('distinct_id', firstId);
    sa.store.set('history_login_id', {
      name: '',
      value: ''
    });
  }
  var para = {};
  para[name] = value;
  sa.saEvent.send({
    type: 'track_id_unbind',
    event: '$UnbindID',
    unbind_value: para
  });
};

sa.setWebViewUrl = function(url, after_hash) {
  if (!_.isString(url) || url === '') {
    logger.info('error:请传入正确的 URL 格式');
    return false;
  }

  if (!/^http(s)?:\/\//.test(url)) {
    logger.info('warning: 请传入正确的 URL 格式');
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

_.each(['setProfile', 'setOnceProfile', 'track', 'quick', 'incrementProfile', 'appendProfile', 'login', 'logout', 'registerApp', 'register', 'clearAllRegister', 'clearAllProps', 'clearAppRegister', 'bind', 'unbind', 'unsetOpenid', 'setUnionid', 'unsetUnionid'], function(method) {
  var temp = sa[method];
  sa[method] = function() {
    if (!checkPrivacyStatus()) {
      return false;
    }
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
    var allpages = _.getCurrentPage();
    var myvar = _.deepCopy(allpages.options);
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
  var router = '';
  try {
    currentPage = _.getCurrentPage();
    router = currentPage ? currentPage.route : '';
  } catch (error) {
    logger.info(error);
  }
  if (page_show_time >= 0 && router !== '') {
    var prop = {};
    var title = _.getPageTitle(router);
    var page_stay_time = (Date.now() - page_show_time) / 1000;
    if (isNaN(page_stay_time) || page_stay_time < 0) {
      page_stay_time = 0;
    }
    prop.$url_query = currentPage.sensors_mp_url_query ? currentPage.sensors_mp_url_query : '';
    prop.$url_path = router;
    prop.$title = title;
    prop.event_duration = page_stay_time;
    if (sa.para.autotrack_exclude_page.pageLeave.indexOf(router) === -1) {
      sa.track('$MPPageLeave', prop);
    }
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
    if (!checkPrivacyStatus()) {
      return false;
    }
    if (!sa.initialState.isComplete) {
      sa.initialState.queue.push(['appLaunch', arguments]);
      meta.life_state.app_launched = true;
      return false;
    }
    meta.life_state.app_launched = true;
    var prop = {};
    if (para && para.scene) {
      current_scene = para.scene;
      sa.current_scene = current_scene;
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
      prop.$title = _.getPageTitle(para.path);

      if (para.query && _.isObject(para.query)) {
        var _query = _.setQuery(para.query);
        _query = _query ? '?' + _query : '';
        prop.$url = prop.$url_path + _query;
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
      sa.current_scene = current_scene;
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
      prop.$title = _.getPageTitle(para.path);
    }
    _.setShareInfo(para, prop);

    var utms = _.setUtm(para, prop);

    _.setLatestChannel(utms.pre2);
    _.setSfSource(para, prop);

    sa.registerApp({
      $latest_scene: prop.$scene
    });
    prop.$url_query = _.setQuery(para.query);
    _.setPageRefData(prop, para.path, prop.$url_query);
    if (para && para.path) {
      prop.$url = para.path + (prop.$url_query ? '?' + prop.$url_query : '');
    }
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
    sendStrategy.onAppHide();
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
    } else if (sa.para.autotrack_exclude_page.pageShow.indexOf(router) === -1) {
      sa.autoTrackCustom.trackCustom('pageShow', prop, '$MPViewScreen');
    }
  },
  pageShare: function(option) {
    var oldMessage = option.onShareAppMessage;
    var isPromise = function(val) {
      return !!val && _.isFunction(val.then) && _.isFunction(val.catch);
    };

    option.onShareAppMessage = function() {
      share_method = '转发消息卡片';
      var oldShareValue = oldMessage.apply(this, arguments);

      if (sa.para.autoTrack && sa.para.autoTrack.pageShare) {
        var prop = {
          $url_path: _.getCurrentPath(),
          $share_depth: query_share_depth,
          $share_method: share_method
        };
        _.setPageRefData(prop);
        sa.autoTrackCustom.trackCustom('pageShare', prop, '$MPShare');
      }

      function setPath(value) {
        if (!_.isObject(value)) {
          value = {};
        }

        if (_.isUndefined(value.path) || value.path === '') {
          value.path = _.getCurrentUrl(this);
        }

        if (_.isString(value.path)) {
          if (value.path.indexOf('?') === -1) {
            value.path = value.path + '?';
          } else {
            if (value.path.slice(-1) !== '&') {
              value.path = value.path + '&';
            }
          }
        }
        value.path = value.path + _.getShareInfo();
        return value;
      }

      if (sa.para.allow_amend_share_path) {
        oldShareValue = setPath(oldShareValue);
        if (_.isObject(oldShareValue)) {
          for (var key in oldShareValue) {
            if (isPromise(oldShareValue[key])) {
              try {
                oldShareValue[key] = oldShareValue[key].then(function(data) {
                  return setPath(data);
                });
              } catch (error) {
                logger.info('onShareAppMessage: ' + error);
              }
            }
          }
        }
      }

      return oldShareValue;
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
    sa.current_scene = current_scene;
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
    obj.$title = _.getPageTitle(option.path);
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
  obj.$url = option.path + (obj.$url_query ? '?' + obj.$url_query : '');
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
    sa.current_scene = current_scene;
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
    obj.$title = _.getPageTitle(option.path);
  }
  _.setShareInfo(option, obj);
  var utms = _.setUtm(option, obj);
  _.setLatestChannel(utms.pre2);
  _.setSfSource(option, obj);
  sa.registerApp({
    $latest_scene: obj.$scene
  });
  obj.$url_query = _.setQuery(option.query);
  if (option && option.path) {
    obj.$url = option.path + (obj.$url_query ? '?' + obj.$url_query : '');
  }
  _.setPageRefData(obj, option.path, obj.$url_query);
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
  sendStrategy.onAppHide();
};

sa.pageShow = function(prop) {
  var obj = {};
  var router = _.getCurrentPath();
  var title = _.getPageTitle(router);
  var currentPage = _.getCurrentPage();
  _.setRefPage();
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

module.exports = sa;