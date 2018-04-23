/**
 * @fileoverview sensors analytic miniprogram sdk
 * @author shengyonggen@sensorsdata.cn
 */

var _ = {};

var sa = {};

sa.para = require('sensorsdata_conf.js');


// 优化配置  
/*
  if (sa.para.debug_mode) {
    sa.para.debug_mode_url = sa.para.server_url.replace(/\/sa$/, '/debug').replace(/(\/sa)(\?[^\/]+)$/, '/debug$2');
  }router
*/

sa._queue = [];
// 是否已经获取到系统信息
sa.getSystemInfoComplete = false;

var ArrayProto = Array.prototype,
    FuncProto = Function.prototype,
    ObjProto = Object.prototype,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty,
    LIB_VERSION = '0.7',
	LIB_NAME = 'MiniProgram';

sa.lib_version = LIB_VERSION;

var logger = typeof logger === 'object' ? logger : {};
logger.info = function() {
	if ( typeof console === 'object' && console.log) {
		try {
			return console.log.apply(console, arguments);
		} catch (e) {
			console.log(arguments[0]);
		}
	}
};

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
				if ( i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
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
	_.extend = function(obj) {
		each(slice.call(arguments, 1), function(source) {
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
	_.extend2Lev = function(obj) {
		each(slice.call(arguments, 1), function(source) {
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
			if (found || ( found = (value === target))) {
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
	return (toString.call(obj) == '[object Object]') && (obj != null);
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
// gbk等编码decode会异常
_.decodeURIComponent = function(val) {
	var result = '';
	try {
		result = decodeURIComponent(val);
	} catch(e) {
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
			// recurse
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

// 把日期格式全部转化成日期字符串
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
// 把字符串格式数据限制字符串长度
_.formatString = function(str) {
	if (str.length > sa.para.max_string_length) {
		logger.info('字符串长度超过限制，已经做截取--' + str);
		return str.slice(0, sa.para.max_string_length);
	} else {
		return str;
	}
};

// 把字符串格式数据限制字符串长度
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

// 数组去重复
_.unique = function(ar) {
	var temp,
	    n = [],
	    o = {};
	for (var i = 0; i < ar.length; i++) {
		temp = ar[i];
		if (!( temp in o)) {
			o[temp] = true;
			n.push(temp);
		}
	}
	return n;
};

// 只能是sensors满足的数据格式
_.strip_sa_properties = function(p) {
	if (!_.isObject(p)) {
		return p;
	}
	_.each(p, function(v, k) {
		// 如果是数组，把值自动转换成string
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
		// 只能是字符串，数字，日期,布尔，数组
		if (!(_.isString(v) || _.isNumber(v) || _.isDate(v) || _.isBoolean(v) || _.isArray(v))) {
			logger.info('您的数据-', v, '-格式不满足要求，我们已经将其删除');
			delete p[k];
		}
	});
	return p;
};

// 去掉undefined和null
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

	for ( n = 0; n < stringl; n++) {
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

_.info = {
	properties : {
		$lib : LIB_NAME,
		$lib_version : String(LIB_VERSION),
		$user_agent: 'SensorsAnalytics MP SDK'
	},
	getSystem : function() {
		var e = this.properties;
		var that = this;

		function getNetwork() {
			wx.getNetworkType({
				"success" : function(t) {
					e.$network_type = t["networkType"]
				},
				"complete" : getSystemInfo
			})
		}

		function getSystemInfo() {
			wx.getSystemInfo({
				"success" : function(t) {
					e.$model = t["model"];
					e.$screen_width = Number(t["windowWidth"]);
					e.$screen_height = Number(t["windowHeight"]);
					e.$os = t["system"].split(' ')[0];
					e.$os_version = t["system"].split(' ')[1];
				},
				"complete" : that.setStatusComplete
			})
		}

		getNetwork();
	},
	setStatusComplete : function() {
		sa.getSystemInfoComplete = true;
		if (sa._queue.length > 0) {
			_.each(sa._queue, function(content) {
				sa.prepareData.apply(sa, slice.call(content));
			});
			sa._queue = [];
		}
	}
};

sa._ = _;

sa.prepareData = function(p, callback) {
	if (!sa.getSystemInfoComplete) {
		sa._queue.push(arguments);
		return false;
	}

	var data = {
		distinct_id : this.store.getDistinctId(),
		lib : {
			$lib : LIB_NAME,
			$lib_method : 'code',
			$lib_version : String(LIB_VERSION)
		},
		properties : {}
	};

	_.extend(data, p);

	// 合并properties里的属性
	if (_.isObject(p.properties) && !_.isEmptyObject(p.properties)){
		_.extend(data.properties, p.properties);
	}

	// profile时不传公用属性
	if (!p.type || p.type.slice(0, 7) !== 'profile') {
		// 传入的属性 > 当前页面的属性 > session的属性 > cookie的属性 > 预定义属性
    data.properties = _.extend({}, _.info.properties, sa.store.getProps(), data.properties);
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
  // 判断是否是首日访问，果子说要做
  if (typeof sa.store._state === 'object' && typeof sa.store._state.first_visit_day_time === 'number' && sa.store._state.first_visit_day_time > (new Date()).getTime() ){
    data.properties.$is_first_day = true;
  }else{
    data.properties.$is_first_day = false;
  }

	_.searchObjDate(data);
	_.searchObjString(data);

	sa.send(data, callback);
};

sa.store = {
	getUUID : function() {
		return "" + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') + '-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);

	},
	setStorage : function() {

	},
	getStorage : function() {
		return wx.getStorageSync("sensorsdata2015_wechat") || '';
	},
	_state : {},
	toState : function(ds) {
		var state = null;
		if (_.isJSONString(ds)) {
			state = JSON.parse(ds);
			if (state.distinct_id) {
				this._state = state;
			} else {
				this.set('distinct_id', this.getUUID());
			}
		} else {
			this.set('distinct_id', this.getUUID());
		}
	},
	getFirstId : function() {
		return this._state.first_id;
	},
	getDistinctId : function() {
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
	set : function(name, value) {
    var obj = {};
    if(typeof name === 'string'){
      obj[name] = value;
    }else if(typeof name === 'object'){
      obj = name;
    }
		this._state = this._state || {};
    for(var i in obj){
      this._state[i] = obj[i];
    }
		this.save();
	},
  change: function (name, value) {
    this._state[name] = value;
  },
	save : function() {
		wx.setStorageSync("sensorsdata2015_wechat", JSON.stringify(this._state));
	},
	init : function() {
		var info = this.getStorage();
		if (info) {
			this.toState(info);
		} else {
      var time = (new Date());
      var visit_time = time.getTime();
      time.setHours(23);
      time.setMinutes(59);
      time.setSeconds(60);
			this.set({
        'distinct_id':this.getUUID(),
        'first_visit_time' : visit_time,
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

sa.track = function(e, p, c) {
	this.prepareData({
		type : 'track',
		event : e,
		properties : p
	}, c);
};

sa.identify = function (id, isSave) {
  if (typeof id === 'number') {
    id = String(id);
  }else if(typeof id !== 'string'){
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

sa.trackSignup = function(id, e, p, c) {

	sa.prepareData({
		original_id : sa.store.getFirstId() || sa.store.getDistinctId(),
		distinct_id : id,
		type : 'track_signup',
		event : e,
		properties : p
	}, c);
	sa.store.set('distinct_id', id);
};

sa.register = function(obj){
  if (_.isObject(obj) && !_.isEmptyObject(obj)) {
    sa.store.setProps(obj);
  }
};

sa.clearAllRegister = function(){
  sa.store.setProps({},true);
};

sa.login = function(id) {
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

sa.init = function() {
	this._.info.getSystem();
	this.store.init();
	if(_.isObject(this.para.register)){
	_.info.properties = _.extend(_.info.properties,this.para.register);
	}

};

sa.send = function(t) {
	var url = '';
	t._nocache = (String(Math.random()) + String(Math.random()) + String(Math.random())).slice(2, 15);

	logger.info(t);

	t = JSON.stringify(t);

	if (sa.para.server_url.indexOf('?') !== -1) {
		url = sa.para.server_url + '&data=' + encodeURIComponent(_.base64Encode(t));
	} else {
		url = sa.para.server_url + '?data=' + encodeURIComponent(_.base64Encode(t));
	}

	var sendRequest = function() {
		wx.request({
			"url" : url,
			"method" : "GET"
		})
	};
	sendRequest();
};

function e(t, n, o) {
	if (t[n]) {
		var e = t[n];
		t[n] = function(t) {
			o.call(this, t, n), e.call(this, t)
		}
	} else
		t[n] = function(t) {
			o.call(this, t, n)
		}
}

function appLaunch() {
	this[sa.para.name] = sa;
	sa.init();

};

function appShow() {

};

function appHide(n, e) {

};

var p = App;

App = function(t) {
	e(t, "onLaunch", appLaunch);
	e(t, "onShow", appShow);
	e(t, "onHide", appHide);
	p(t);
};

function pageOnunload(n, e) {

}

function pageOnload(t, n) {

};

function pageOnshow(t, n) {
  var router = typeof this["__route__"] === 'string' ? this["__route__"] : '系统没有取到值';
  if (sa.para.onshow){		
    sa.para.onshow(sa, router, this)
	}else{
    sa.track('$MPViewScreen', {
      $url: router
    });
  }
};

var v = Page;

Page = function(t) {
	e(t, "onLoad", pageOnload);
	e(t, "onUnload", pageOnunload);
	e(t, "onShow", pageOnshow);
	e(t, "onHide", pageOnunload);

	v(t);

}

module.exports = sa;
