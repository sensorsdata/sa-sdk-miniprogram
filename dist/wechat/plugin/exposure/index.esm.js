var base={plugin_version:"1.19.3"};function createPlugin(e){if("object"==typeof e&&"string"==typeof e.plugin_name&&""!==e.plugin_name)return e.plugin_version=base.plugin_version,e.log=e.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},e;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}let sa=null,_=null,platform_obj=null,isTaroVue3=!1,tagConfigMap={},tagsIntersectionMap={},delayTagViewIdTimerMap={},tagExposedViewIdMap={},tagObserveViewIdMap={},taroViews=[];function createObserver(e,a){let t=getCurrentPages(),r=t[t.length-1],i=null,o={observeAll:!0,thresholds:[e]};return i=r.isComponent?platform_obj.createIntersectionObserver(o):platform_obj.createIntersectionObserver(r,o),tagsIntersectionMap[a]||(tagsIntersectionMap[a]=[]),tagsIntersectionMap[a].push(i),i}function getBaseProps(e){let a=e.dataset,t={};return t.$element_id=e.id,t.$element_type=a.type,t.$element_content=a.content,t.$element_name=a.name,t.$url_path=_.getCurrentPath(),t}function getTaro3Dataset(e){let a=_.isEmptyObject(e.dataset)?e.id:e.dataset.sid,t={};return _.each(taroViews,function(e){a===e.uid&&(t=e.dataset)}),t}function getNodesViews(e){var a=[];return _.each(e.childNodes,function(e){a.push({dataset:e.dataset||{},props:e.props||{},uid:e.uid}),e.childNodes&&e.childNodes.length&&(a=a.concat(getNodesViews(e)))}),a}function setTaroViews(){taroViews=[];let e=document.body;e&&(taroViews=getNodesViews(e))}function getProps(e){let a=isTaroVue3?getTaro3Dataset(e):e.dataset,t={},r={},i=null;_.each(a,function(e,a){if("sensorsExposureOption"===a)try{let a=_.isObject(e)?e:JSON.parse(e);i=_.isString(a.event_name)?a.event_name:i,t=_.isObject(a.config)?a.config:t,r=_.isObject(a.properties)?a.properties:r}catch(a){_.log("view attribute data-sensors-exposure-option error. value:",e)}}),_.each(a,function(e,a){if(a.startsWith("sensorsExposureConfig")){let r=a.replace(/^sensorsExposureConfig(.*)/,function(e,a){return a.replace(a[0],a[0].toLocaleLowerCase())});t[r]=e}if(a.startsWith("sensorsExposureProperty")){let t=a.replace(/^sensorsExposureProperty(.*)/,function(e,a){return a.replace(a[0],a[0].toLocaleLowerCase())});r[t]=e}"sensorsExposureEventName"===a&&(i=e)});let o=e.id||_.base64Encode(JSON.stringify({a:r,n:i}));return r=_.extend(getBaseProps({id:e.id,dataset:a}),r),{config:formatConfig(t),props:r,event_name:i,id:o}}function clearDelay(e,a){delayTagViewIdTimerMap[e]&&(a?delayTagViewIdTimerMap[e][a]&&(clearTimeout(delayTagViewIdTimerMap[e][a]),delete delayTagViewIdTimerMap[e][a]):_.each(delayTagViewIdTimerMap[e],function(a,t){clearTimeout(a),delete delayTagViewIdTimerMap[e][t]}))}function observeView(e,a,t){let r=t.area_rate;createObserver(r,e).relativeToViewport().observe("."+e,function(i){let o=i.boundingClientRect,n=i.intersectionRect;if(!o.width||!o.height)return;if(0===r&&0===n.bottom&&0===n.top&&0===n.right&&0===n.left)return;let s=getProps(i),c=_.isEmptyObject(s.config)?t:mergeConfig(s.config,t),g=s.event_name,p=s.id,l=s.props;if(tagExposedViewIdMap[e]||(tagExposedViewIdMap[e]=[]),!(_.isArray(tagExposedViewIdMap[e])&&tagExposedViewIdMap[e].indexOf(p)>-1&&0==c.repeated||a.indexOf(p)<0))if(g)if(i.intersectionRatio>=r){let a=c.stay_duration;clearDelay(e,p),a>0?(delayTagViewIdTimerMap[e]||(delayTagViewIdTimerMap[e]={}),delayTagViewIdTimerMap[e][p]=setTimeout(function(){clearDelay(e,p),sa.track(g,l),tagExposedViewIdMap[e].push(p)},1e3*a)):(sa.track(g,l),tagExposedViewIdMap[e].push(p))}else clearDelay(e,p);else _.log("the view event_name error, exposure failed")})}function checkView(e){platform_obj.createSelectorQuery().selectAll("."+e).boundingClientRect(function(a){if(_.isArray(a)&&a.length>0){let t={},r=tagConfigMap[e];_.each(a,function(a){let i=getProps(a),o=(_.isEmptyObject(i.config)?r:mergeConfig(i.config,r)).area_rate,n=!1;tagObserveViewIdMap[e]||(tagObserveViewIdMap[e]=[]),_.each(tagObserveViewIdMap[e],function(e){e===i.id&&(n=!0)}),t[o]||(t[o]=[]),!1===n&&(t[o].push(i.id),tagObserveViewIdMap[e].push(i.id))}),_.each(t,function(a){observeView(e,a,r)})}}).exec()}function addPageExposure(){isTaroVue3&&setTaroViews(),_.each(tagConfigMap,function(e,a){checkView(a)})}function removePageExposure(){_.each(tagsIntersectionMap,function(e){_.each(e,function(e){e.disconnect()})}),_.each(delayTagViewIdTimerMap,function(e){_.each(e,function(e){clearTimeout(e)})}),tagsIntersectionMap={},delayTagViewIdTimerMap={},tagExposedViewIdMap={},tagObserveViewIdMap={},isTaroVue3&&(taroViews=[])}function formatConfig(e){let a={};return _.each(e,function(t,r){switch(r){case"area_rate":t=Number(t),!isNaN(t)&&t>=0&&t<=1?a.area_rate=t:_.log("parameter config.area_rate error. config:",e);break;case"stay_duration":t=Number(t),!isNaN(t)&&t>=0?a.stay_duration=t:_.log("parameter config.stay_duration error. config:",e);break;case"repeated":"false"===t||!1===t||"true"===t||!0===t?a.repeated="false"!==t&&Boolean(t):_.log("parameter config.repeated error. config:",e)}}),a}function mergeClassTag(e,a){return _.isArray(e)?a.concat(e):a}function mergeConfig(e,a){return{area_rate:_.isNumber(e.area_rate)&&e.area_rate>0&&e.area_rate<=1?e.area_rate:a.area_rate,stay_duration:_.isNumber(e.stay_duration)&&e.stay_duration>0?e.stay_duration:a.stay_duration,repeated:_.isBoolean(e.repeated)?e.repeated:a.repeated}}function initClassTagsConfig(e,a){let t={};return _.each(e,function(e){t[e]={area_rate:a.area_rate,stay_duration:a.stay_duration,repeated:a.repeated}}),t}let Exposure={plugin_name:"Exposure",config:{class_tags:["sensors-exposure-track"],area_rate:0,stay_duration:0,repeated:!0},isReady:!1,init:function(e,a){if(!e||sa)return!1;_=(sa=e)._,platform_obj=wx;let t=sa.ee;if(_.isObject(a)){let e=this.config.class_tags;this.config=mergeConfig(a,this.config),this.config.class_tags=mergeClassTag(a.class_tags,e)}tagConfigMap=initClassTagsConfig(this.config.class_tags,this.config),isTaroVue3=sa.para.framework&&sa.para.framework.taro||!1,t.page.replay("pageShow",addPageExposure),t.page.replay("pageHide",removePageExposure),this.isReady=!0},addObserverByClassName:function(e,a){!1!==this.isReady&&(_.isString(e)?(_.isObject(a)?tagConfigMap[e]=tagConfigMap[e]?mergeConfig(a,tagConfigMap[e]):mergeConfig(a,this.config):tagConfigMap[e]=this.config,checkView(e)):_.log("parameter tag error. tag:"+e))},removeObserverByClassName:function(e){!1!==this.isReady&&(_.isString(e)?(tagsIntersectionMap[e]&&_.each(tagsIntersectionMap[e],function(e){e.disconnect()}),clearDelay(e),tagConfigMap[e]&&delete tagConfigMap[e],tagExposedViewIdMap[e]&&delete tagExposedViewIdMap[e],tagObserveViewIdMap[e]&&delete tagObserveViewIdMap[e],isTaroVue3&&(taroViews=[])):_.log("parameter tag error. tag:"+e))}};var index=createPlugin(Exposure);export default index;