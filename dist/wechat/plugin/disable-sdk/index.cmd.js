"use strict";var base={plugin_version:"1.19.10"};function createPlugin(e){if("object"==typeof e&&"string"==typeof e.plugin_name&&""!==e.plugin_name)return e.plugin_version=base.plugin_version,e.log=e.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},e;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}var disableSDK={init(e){e.disableSDK=this.disableSDK.bind(this),e.enableSDK=this.enableSDK.bind(this),e.getDisabled=this.getDisabled.bind(this)},plugin_name:"DisableSDK",disabled:!1,disableSDK(){this.disabled=!0},enableSDK(){this.disabled=!1},getDisabled(){return this.disabled}},index=createPlugin(disableSDK);module.exports=index;