var base={plugin_version:"1.21.6"};function createPlugin(e){if("object"==typeof e&&"string"==typeof e.plugin_name&&""!==e.plugin_name)return e.plugin_version=base.plugin_version,e.log=e.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},e;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}var oldOpenid={init(e){var t={getRequest:function(t){wx.login({success:function(i){i.code&&e.para.appid&&e.para.openid_url?e._.wxrequest({url:e.para.openid_url+"&code="+i.code+"&appid="+e.para.appid,method:"GET",complete:function(i){e._.isObject(i)&&e._.isObject(i.data)&&i.data.openid?t(i.data.openid):t()}}):t()}})},getWXStorage:function(){var t=e.store.getStorage();if(t&&e._.isObject(t))return t.openid},getOpenid:function(t){if(!e.para.appid)return t(),!1;var i=this.getWXStorage();i?t(i):this.getRequest(t)}};e.unsetOpenid=function(t){var i=e._.validId(t);if(!i)return!1;var n=e.store._state.openid;n===i&&e.store.set("openid","");var o=e._.getOpenidNameByAppid();if(Object.prototype.hasOwnProperty.call(e.store._state.identities,o)&&i===e.store._state.identities[o]){delete e.store._state.identities[o];var r=e.store.getFirstId(),s=e.store.getDistinctId(),a=e.store._state&&e.store._state.identities&&e.store._state.identities.$identity_mp_id;r&&r===n&&a&&e.store.change("first_id",a),s&&s===n&&a&&e.store.change("distinct_id",a),e.store.save()}},e.setOpenid=function(t){if(!(t=e._.validId(t)))return!1;if(!e.meta.init_status)return e.store.store_queue.push({method:"setOpenid",params:arguments}),!1;e.store.set("openid",t),e.identify(t);var i=e._.getOpenidNameByAppid();e.store._state.identities[i]=t,e.store.save()},e.initWithOpenid=function(i,n){(i=i||{}).appid&&(e.para.appid=i.appid),t.getOpenid(function(t){t&&e.setOpenid(t,i.isCoverLogin),n&&e._.isFunction(n)&&n(t),e.init(i)})}},plugin_name:"OldOpenid"},index=createPlugin(oldOpenid);export default index;