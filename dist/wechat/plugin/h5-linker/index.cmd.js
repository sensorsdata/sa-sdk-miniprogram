"use strict";var base={plugin_version:"1.19.11"};function createPlugin(i){if("object"==typeof i&&"string"==typeof i.plugin_name&&""!==i.plugin_name)return i.plugin_version=base.plugin_version,i.log=i.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},i;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}var h5Linker={is_ready:!1},log=console&&console.log||function(){};h5Linker.getSasdkValue=function(){var i=this.store.getDistinctId()||"",e=this.store.getFirstId()||"";return this._.urlSafeBase64&&this._.urlSafeBase64.encode?i=i?this._.urlSafeBase64.trim(this._.urlSafeBase64.encode(this._.base64Encode(i))):"":this._.rot13obfs&&(i=i?this._.rot13obfs(i):""),encodeURIComponent(e?"f"+i:"d"+i)},h5Linker.rewriteUrl=function(i,e){if(!this.is_ready)return this.log("h5Linker plugin not initialized"),i;var n=this,t=/([^?#]+)(\?[^#]*)?(#.*)?/.exec(i),r="";if(!t)return i;var o,s=t[1]||"",l=t[2]||"",a=t[3]||"",u="_sasdk="+this.getSasdkValue(),g=function(i){var e=i.split("&"),t=[];return n._.each(e,function(i){i.indexOf("_sasdk=")>-1?t.push(u):t.push(i)}),t.join("&")};(e=!!this._.isBoolean(e)&&e)?(o=a.indexOf("_sasdk"),r=a.indexOf("?")>-1?o>-1?s+l+"#"+a.substring(1,o)+g(a.substring(o,a.length)):s+l+a+"&"+u:s+l+"#"+a.substring(1)+"?"+u):(o=l.indexOf("_sasdk"),r=/^\?(\w)+/.test(l)?o>-1?s+"?"+g(l.substring(1))+a:s+l+"&"+u+a:s+"?"+u+a);return r},h5Linker.init=function(i){i?(this._=i._,this.store=i.store,this.log=i._.logger.info||log,this.is_ready=!0):log("H5Linker plugin initialization failed")},h5Linker.plugin_name="H5Linker",h5Linker.addDistinctIdToUrl=function(i,e){return this.is_ready?this._.isString(i)&&""!==i&&/^http(s)?:\/\//.test(i)?h5Linker.rewriteUrl(i,e):(this.log("error: URL format error"),i):(this.log("H5Linker plugin not initialized"),i)};var index=createPlugin(h5Linker);module.exports=index;