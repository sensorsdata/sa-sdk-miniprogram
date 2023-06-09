"use strict";var base={plugin_version:"1.19.4"};function createPlugin(e){if("object"==typeof e&&"string"==typeof e.plugin_name&&""!==e.plugin_name)return e.plugin_version=base.plugin_version,e.log=e.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},e;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}var h5Linker={is_ready:!1},log=console&&console.log||function(){};h5Linker.getSasdkValue=function(){var e=this.store.getDistinctId()||"",t=this.store.getFirstId()||"";return this._.urlSafeBase64&&this._.urlSafeBase64.encode?e=e?this._.urlSafeBase64.trim(this._.urlSafeBase64.encode(this._.base64Encode(e))):"":this._.rot13obfs&&(e=e?this._.rot13obfs(e):""),encodeURIComponent(t?"f"+e:"d"+e)},h5Linker.rewriteUrl=function(e,t){if(!this.is_ready)return this.log("h5Linker plugin not initialized"),e;var n=this,i=/([^?#]+)(\?[^#]*)?(#.*)?/.exec(e),s="";if(!i)return e;var r,a=i[1]||"",o=i[2]||"",l=i[3]||"",c="_sasdk="+this.getSasdkValue(),u=function(e){var t=e.split("&"),i=[];return n._.each(t,function(e){e.indexOf("_sasdk=")>-1?i.push(c):i.push(e)}),i.join("&")};(t=!!this._.isBoolean(t)&&t)?(r=l.indexOf("_sasdk"),s=l.indexOf("?")>-1?r>-1?a+o+"#"+l.substring(1,r)+u(l.substring(r,l.length)):a+o+l+"&"+c:a+o+"#"+l.substring(1)+"?"+c):(r=o.indexOf("_sasdk"),s=/^\?(\w)+/.test(o)?r>-1?a+"?"+u(o.substring(1))+l:a+o+"&"+c+l:a+"?"+c+l);return s},h5Linker.init=function(e){e?(this._=e._,this.store=e.store,this.log=e._.logger.info||log,this.is_ready=!0):log("H5Linker plugin initialization failed")},h5Linker.plugin_name="H5Linker";var hasOwnProperty=Object.prototype.hasOwnProperty;function isFunction(e){if(!e)return!1;var t=Object.prototype.toString.call(e);return"[object Function]"==t||"[object AsyncFunction]"==t}function isObject(e){return null!=e&&"[object Object]"==Object.prototype.toString.call(e)}function isString(e){return"[object String]"==toString.call(e)}function log$1(){if("object"==typeof console&&console.log){isString(arguments[0])&&(arguments[0]="sensors registerProperties————"+arguments[0]);try{return console.log.apply(console,arguments)}catch(e){console.log("sensors registerProperties————",arguments[0])}}}function extend(e){return each(Array.prototype.slice.call(arguments,1),function(t){for(var n in t)void 0!==t[n]&&(e[n]=t[n])}),e}function each(e,t,n){var i=Array.prototype.forEach,s={};if(null==e)return!1;if(i&&e.forEach===i)e.forEach(t,n);else if(e.length===+e.length){for(var r=0,a=e.length;r<a;r++)if(r in e&&t.call(n,e[r],r,e)===s)return!1}else for(var o in e)if(hasOwnProperty.call(e,o)&&t.call(n,e[o],o,e)===s)return!1}var _sa,_={isFunction:isFunction,isObject:isObject,extend:extend,log:log$1,each:each},RegisterProperties={plugin_name:"RegisterProperties",version:"props_sdk_version"},register_list=[];function getRegisterProperties(e){var t={};return _.each(register_list,function(n){var i={};_.isFunction(n)?i=n({event:e.event,properties:e.properties,data:e}):-1!==n.events.indexOf(e.event)&&(i=n.properties);t=Object.assign(t,i)}),_.isObject(t)?t:{}}RegisterProperties.init=function(e){if(!e||!_.isObject(e))return _.log("请传入正确的 sensors 对象！"),!1;(_sa=e).ee.data.on("beforeBuildCheck",function(e){if(_.isObject(e)&&"track"===e.type&&_.isObject(e.properties)){var t=getRegisterProperties(e);e=Object.assign(e.properties,t)}})},RegisterProperties.register=function(e){e&&_.isObject(e)?e.properties&&_.isObject(e.properties)&&e.events&&e.events.length>0&&register_list.push(e):_.log("参数错误！")},RegisterProperties.hookRegister=function(e){_.isFunction(e)&&register_list.push(e)};var sa,registerProperties=createPlugin(RegisterProperties),customEventList=[],maxSaveTime=2592e6,latestEventInitialTime=null;function decodeURI(e){var t="";try{t=decodeURIComponent(e)}catch(n){t=e}return t}function getQueryString(e,t){if(e[t])return decodeURI(e[t]);var n=e.scene||"";if(n){var i=decodeURI(n),s=new RegExp("(^|&)"+t+"=([^&]*)(&|$)","i"),r=i.match(s);if(null!==r)return decodeURI(r[2])}return null}function isSatCfLegal(e){return""!==e&&"''"!==e&&'""'!==e}var AdChannel={plugin_name:"ADChannel",init:function(e){if(!(sa=e))return console.log("当前主sdk 初始化失败，请传入正确的 sensors 对象！"),!1;var t=sa.usePlugin(registerProperties);this.eventList.init(),this.listenAppLaunch(),this.addIsChannelCallbackEvent(t)},getChannelQuery:function(e){var t=sa._.deepCopy(e).query;if(sa._.isObject(t)){var n=getQueryString(t,"sat_cf"),i=isSatCfLegal(n);if(n&&i){var s={};e.scene?s.$scene=sa._.getMPScene(e.scene):s.$scene="未取到值";var r=t.scene||"",a="";r&&(a=decodeURI(r),delete t.scene);var o=sa._.setQuery(t);if(a&&(o+=(o?"&":"")+a),e.path){s.$url_path=sa._.getPath(e.path),s.$title=sa._.getPageTitle(e.path);var l=o?"?"+o:"";s.$url=s.$url_path+l}t._sfs&&(s.$sf_source=t._sfs,s.$latest_sf_source=s.$sf_source);var c=sa._.setUtm(e,s);sa._.setLatestChannel(c.pre2),s.$latest_scene=s.$scene,s.$url_query=o,this.trackChannel(s)}}},trackChannel:function(e){sa.track("$ChannelLinkReaching",e),this.setEventQueue()},setEventQueue:function(){var e,t=[];try{for(var n=0;n<sa.initialState.queue.length;n++)if("appLaunch"===sa.initialState.queue[n][0]){e=n;break}sa._.isNumber(e)&&sa._.each(sa.initialState.queue,function(e,n){"track"===e[0]&&e[1]&&"$ChannelLinkReaching"===e[1][0]&&0!==n&&(t=e,sa.initialState.queue.splice(n,1))}),t.length>0&&sa.initialState.queue.splice(e,0,t)}catch(e){sa._.logger.info("渠道插件事件发送排序: "+e)}},addIsChannelCallbackEvent:function(e){var t=this,n=["$MPLaunch","$ABTestTrigger","$PlanPopupDisplay","$PlanPopupClick","$ChannelLinkReaching","$MPShow","$MPHide","$MPViewScreen","$MPClick","$MPShare","$MPAddFavorites","$MPPageLeave","$SignUp","$UnbindID","$BindID"];e.hookRegister(function(e){var i={};if(e&&e.event){var s=e.event,r=!0;n.indexOf(s)<0&&(t.eventList.hasEvent(s)?r=!1:t.eventList.add(s),i.$is_channel_callback_event=r)}return i})},eventList:{init:function(){var e=sa._.getStorageSync("saminiprogramchannel"),t=(new Date).getTime();if(e&&sa._.isNumber(e.latest_event_initial_time)&&sa._.isArray(e.event_list)){var n=t-e.latest_event_initial_time;n>0&&n<maxSaveTime?(customEventList=e.event_list,latestEventInitialTime=e.latest_event_initial_time):this.reset()}else this.reset()},add:function(e){customEventList.push(e),this.save()},save:function(){var e={event_list:customEventList,latest_event_initial_time:latestEventInitialTime};sa._.setStorageSync("saminiprogramchannel",e)},reset:function(){customEventList=[],latestEventInitialTime=(new Date).getTime(),this.save()},hasEvent:function(e){var t=!1;return sa._.each(customEventList,function(n){n===e&&(t=!0)}),t}},listenAppLaunch:function(){var e=wx.getLaunchOptionsSync()||{};e&&AdChannel.getChannelQuery(e)}};h5Linker.getSasdkValue=function(){var e=this.store.getDistinctId()||"",t=this.store.getFirstId()||"",n="";return e&&(n=JSON.stringify({did:e,aid:this._.getAppId()||"",adt:"mp"}),this._.urlSafeBase64&&this._.urlSafeBase64.encode?n=this._.urlSafeBase64.trim(this._.urlSafeBase64.encode(this._.base64Encode(n))):this._.rot13obfs&&(n=this._.rot13obfs(n))),encodeURIComponent(t?"f"+n:"d"+n)};var adChannelH5Linker={init:function(e){AdChannel.init(e),h5Linker.init(e)},addChannelInfoToUrl:function(e,t){return h5Linker.is_ready?h5Linker._.isString(e)&&""!==e&&/^http(s)?:\/\//.test(e)?h5Linker.rewriteUrl(e,t):(this.log("error: URL format error"),e):(this.log("adChannelH5Linker plugin not initialized"),e)},plugin_name:"AdChannelH5Linker"},index=createPlugin(adChannelH5Linker);module.exports=index;