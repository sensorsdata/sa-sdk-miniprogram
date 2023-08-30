"use strict";var base={plugin_version:"1.19.8"};function createPlugin(e){if("object"==typeof e&&"string"==typeof e.plugin_name&&""!==e.plugin_name)return e.plugin_version=base.plugin_version,e.log=e.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},e;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}var sa=null,_=null,platform_obj=null,isTaroVue3=!1,tagConfigMap={},tagsIntersectionMap={},delayTagViewIdTimerMap={},tagExposedViewIdMap={},tagObserveViewIdMap={},taroViews=[];function createObserver(e,a){var t,r=e.area_rate,o=getCurrentPages(),n=o[o.length-1],i={observeAll:!0,thresholds:[r]};return t=e.component?e.component.createIntersectionObserver(i):platform_obj.createIntersectionObserver(n,i),tagsIntersectionMap[a]||(tagsIntersectionMap[a]=[]),tagsIntersectionMap[a].push(t),t}function getBaseProps(e){var a=e.dataset,t={};return e.id&&(t.$element_id=e.id),a.type&&(t.$element_type=a.type),a.content&&(t.$element_content=a.content),a.name&&(t.$element_name=a.name),t.$url_path=_.getCurrentPath(),t}function getTaro3Dataset(e){var a=_.isEmptyObject(e.dataset)?e.id:e.dataset.sid,t={};return _.each(taroViews,function(e){a===e.uid&&(t=e.dataset)}),t}function getNodesViews(e){var a=[];return _.each(e.childNodes,function(e){a.push({dataset:e.dataset||{},props:e.props||{},uid:e.uid}),e.childNodes&&e.childNodes.length&&(a=a.concat(getNodesViews(e)))}),a}function setTaroViews(){taroViews=[];try{var e=document.body;e&&(taroViews=getNodesViews(e))}catch(e){}}function getProps(e){var a=isTaroVue3?getTaro3Dataset(e):e.dataset,t={},r={},o=null;_.each(a,function(e,a){if("sensorsExposureOption"===a)try{var n=_.isObject(e)?e:JSON.parse(e);o=_.isString(n.event_name)?n.event_name:o,t=_.isObject(n.config)?n.config:t,r=_.isObject(n.properties)?n.properties:r}catch(a){_.log("view attribute data-sensors-exposure-option error. value:",e)}}),_.each(a,function(e,a){if(a.startsWith("sensorsExposureConfig")){var n=a.replace(/^sensorsExposureConfig(.*)/,function(e,a){return a.replace(a[0],a[0].toLocaleLowerCase())});t[n]=e}if(a.startsWith("sensorsExposureProperty")){var i=a.replace(/^sensorsExposureProperty(.*)/,function(e,a){return a.replace(a[0],a[0].toLocaleLowerCase())});r[i]=e}"sensorsExposureEventName"===a&&(o=e)});var n=e.id||_.base64Encode(JSON.stringify({a:r,n:o}));return r=_.extend(getBaseProps({id:e.id,dataset:a}),r),{config:formatConfig(t),props:r,event_name:o,id:n}}function clearDelay(e,a){delayTagViewIdTimerMap[e]&&(a?delayTagViewIdTimerMap[e][a]&&(clearTimeout(delayTagViewIdTimerMap[e][a]),delete delayTagViewIdTimerMap[e][a]):_.each(delayTagViewIdTimerMap[e],function(a,t){clearTimeout(a),delete delayTagViewIdTimerMap[e][t]}))}function observeView(e,a,t){var r=t.area_rate;createObserver(t,e).relativeToViewport().observe("."+e,function(t){var o=t.boundingClientRect,n=t.intersectionRect;if(o.width&&o.height&&(0!==Number(r)||0!==n.bottom||0!==n.top||0!==n.right||0!==n.left)){var i=getProps(t),s=_.isEmptyObject(i.config)?tagConfigMap[e]:mergeConfig(i.config,tagConfigMap[e]),c=i.event_name,p=i.id,g=i.props;if(tagExposedViewIdMap[e]||(tagExposedViewIdMap[e]=[]),!(_.isArray(tagExposedViewIdMap[e])&&tagExposedViewIdMap[e].indexOf(p)>-1&&0==s.repeated||a.indexOf(p)<0))if(c)if(t.intersectionRatio>=r){var d=s.stay_duration;clearDelay(e,p);var u=function(){var a=tagConfigMap[e].listener,t=a&&a.shouldExpose,r=a&&a.didExpose,o={event_name:c,properties:g};if(t&&_.isFunction(t))try{if(!1===t(e,o))return}catch(e){}if(sa.track(c,g),r&&_.isFunction(r))try{r(e,o)}catch(e){}tagExposedViewIdMap[e].push(p)};d>0?(delayTagViewIdTimerMap[e]||(delayTagViewIdTimerMap[e]={}),delayTagViewIdTimerMap[e][p]=setTimeout(function(){clearDelay(e,p),u()},1e3*d)):u()}else clearDelay(e,p);else _.log("the view event_name error, exposure failed")}})}function checkView(e,a){(a.component||platform_obj).createSelectorQuery().selectAll("."+e).boundingClientRect(function(t){if(_.isArray(t)&&t.length>0){var r={};_.each(t,function(t){var o=getProps(t),n=(_.isEmptyObject(o.config)?a:mergeConfig(o.config,a)).area_rate,i=!1;tagObserveViewIdMap[e]||(tagObserveViewIdMap[e]=[]),_.each(tagObserveViewIdMap[e],function(e){e===o.id&&(i=!0)}),!1===i&&(r[n]||(r[n]=[]),r[n].push(o.id),tagObserveViewIdMap[e].push(o.id))}),_.each(r,function(t,r){observeView(e,t,{area_rate:r,component:a.component})})}}).exec()}function addPageExposure(){isTaroVue3&&setTaroViews(),_.each(tagConfigMap,function(e,a){checkView(a,e)})}function removePageExposure(){_.each(tagsIntersectionMap,function(e){_.each(e,function(e){e.disconnect()})}),_.each(delayTagViewIdTimerMap,function(e){_.each(e,function(e){clearTimeout(e)})}),tagsIntersectionMap={},delayTagViewIdTimerMap={},tagExposedViewIdMap={},tagObserveViewIdMap={},isTaroVue3&&(taroViews=[])}function formatConfig(e){var a={};return _.each(e,function(t,r){switch(r){case"area_rate":t=Number(t),!isNaN(t)&&t>=0&&t<=1?a.area_rate=t:_.log("parameter config.area_rate error. config:",e);break;case"stay_duration":t=Number(t),!isNaN(t)&&t>=0?a.stay_duration=t:_.log("parameter config.stay_duration error. config:",e);break;case"repeated":"false"===t||!1===t||"true"===t||!0===t?a.repeated="false"!==t&&Boolean(t):_.log("parameter config.repeated error. config:",e)}}),a}function mergeClassTag(e,a){return _.isArray(e)?a.concat(e):a}function mergeConfig(e,a){return{area_rate:_.isNumber(e.area_rate)&&e.area_rate>0&&e.area_rate<=1?e.area_rate:a.area_rate,stay_duration:_.isNumber(e.stay_duration)&&e.stay_duration>0?e.stay_duration:a.stay_duration,repeated:_.isBoolean(e.repeated)?e.repeated:a.repeated}}function initClassTagsConfig(e,a){var t={};return _.each(e,function(e){t[e]={area_rate:a.area_rate,stay_duration:a.stay_duration,repeated:a.repeated}}),t}function isComponent(e){return!!(_.isObject(e)&&_.isFunction(e.createSelectorQuery)&&_.isFunction(e.createIntersectionObserver))}var Exposure={plugin_name:"Exposure",config:{class_tags:["sensors-exposure-track"],area_rate:0,stay_duration:0,repeated:!0},isReady:!1,init:function(e,a){if(!e||sa)return!1;_=(sa=e)._,platform_obj=wx;var t=sa.ee;if(_.isObject(a)){var r=this.config.class_tags;this.config=mergeConfig(a,this.config),this.config.class_tags=mergeClassTag(a.class_tags,r),isTaroVue3=a.framework&&a.framework.taro||!1}tagConfigMap=initClassTagsConfig(this.config.class_tags,this.config),t.page.replay("pageShow",addPageExposure),t.page.replay("pageHide",removePageExposure),this.isReady=!0},addObserverByClassName:function(e,a,t){if(!1!==this.isReady)if(_.isString(e)){var r;_.isObject(a)?(a.component&&!isComponent(a.component)&&(_.log("parameter config.component error. config.component:"+a.component),delete a.component),tagConfigMap[e]=tagConfigMap[e]?mergeConfig(a,tagConfigMap[e]):mergeConfig(a,this.config)):tagConfigMap[e]=this.config,_.isObject(t)?tagConfigMap[e].listener=t:t&&_.log("parameter listener error. listener:"+t),r=a&&a.component?_.extend(tagConfigMap[e],{component:a.component}):tagConfigMap[e],isTaroVue3&&setTaroViews(),checkView(e,r)}else _.log("parameter tag error. tag:"+e)},removeObserverByClassName:function(e){!1!==this.isReady&&(_.isString(e)?(tagsIntersectionMap[e]&&(_.each(tagsIntersectionMap[e],function(e){e.disconnect()}),delete tagsIntersectionMap[e]),clearDelay(e),tagConfigMap[e]&&delete tagConfigMap[e],tagExposedViewIdMap[e]&&delete tagExposedViewIdMap[e],tagObserveViewIdMap[e]&&delete tagObserveViewIdMap[e],isTaroVue3&&(taroViews=[])):_.log("parameter tag error. tag:"+e))}},index=createPlugin(Exposure);module.exports=index;