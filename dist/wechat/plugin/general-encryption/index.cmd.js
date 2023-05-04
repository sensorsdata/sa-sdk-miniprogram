"use strict";var sd,_,_oldOnceData,_log,option,base={plugin_version:"1.19.2"};function createPlugin(t){if("object"==typeof t&&"string"==typeof t.plugin_name&&""!==t.plugin_name)return t.plugin_version=base.plugin_version,t.log=t.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},t;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}function formatData(t){try{var n=option.encrypt_utils.encryptSymmetricKeyWithPublicKey(option.pub_key),e={pkv:option.pkv,ekey:n};return sd.para.batch_send?e.flush_time=Date.now():t=[t],e.payloads=t,e}catch(n){return t}}function encodeTrackData(t){var n="";sd.para.batch_send?n=formatData(t):n=formatData(smEncrypt(t));var e=JSON.stringify(n);return"data="+encodeURIComponent(e)}function encryptData(t){try{var n=option.encrypt_utils.encryptEvent;if(sd._.isFunction(n)){var e=n(t);return sd._.base64Encode(e)}return t}catch(n){return _log("Encrypted data exception："+n),t}}function encryptStoreData(t){var n=t.length;if(n>0){for(var e=0;e<n;e++)_.isObject(t[e])&&(t[e]=smEncrypt(t[e]));sd.store.mem.mdata=t.concat(sd.store.mem.mdata)}}function smEncrypt(t){try{return encryptData(t)}catch(n){return _log("Encrypted data exception："+n),sd.para.batch_send?"":_oldOnceData.call(sd.kit,t)}}var GeneralEncryption={plugin_name:"GeneralEncryption",lib_version:"1.0.0",init:function(t,n){_=(sd=t)._;var e=n&&n.encrypt_utils;_log=sd&&sd._.logger.info||console&&console.log||function(){},sd&&sd.kit&&sd.kit.processData?_.isObject(e)&&_.isFunction(e.encryptEvent)&&_.isFunction(e.encryptSymmetricKeyWithPublicKey)&&_.isString(n.pub_key)&&_.isNumber(n.pkv)?(option=n,_oldOnceData=sd.kit.onceTrackData,sd.kit.onceTrackData=encodeTrackData,sd.kit.batchTrackData=encodeTrackData,sd.kit.processData=smEncrypt,sd.mergeStorageData.deleteAesData=encryptStoreData):_log("GeneralEncryption Plugin initialization failed. parameter error."):_log("Wechat SDK initialization failed.")}},index=createPlugin(GeneralEncryption);module.exports=index;