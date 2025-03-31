"use strict";var _CryptoJS={};_CryptoJS.CryptoJS=function(t,e){var r;if("undefined"!=typeof window&&window.crypto&&(r=window.crypto),"undefined"!=typeof self&&self.crypto&&(r=self.crypto),"undefined"!=typeof globalThis&&globalThis.crypto&&(r=globalThis.crypto),!r&&"undefined"!=typeof window&&window.msCrypto&&(r=window.msCrypto),!r&&"undefined"!=typeof global&&global.crypto&&(r=global.crypto),!r&&"function"==typeof require)try{r=require("crypto")}catch(t){}var n=function(){if(r){if("function"==typeof r.getRandomValues)try{return r.getRandomValues(new Uint32Array(1))[0]}catch(t){}if("function"==typeof r.randomBytes)try{return r.randomBytes(4).readInt32LE()}catch(t){}}throw new Error("Native crypto module could not be used to get secure random number.")},i=Object.create||function(){function t(){}return function(e){var r;return t.prototype=e,r=new t,t.prototype=null,r}}(),o={},a=o.lib={},c=a.Base={extend:function(t){var e=i(this);return t&&e.mixIn(t),e.hasOwnProperty("init")&&this.init!==e.init||(e.init=function(){e.$super.init.apply(this,arguments)}),e.init.prototype=e,e.$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},s=a.WordArray=c.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:4*t.length},toString:function(t){return(t||f).stringify(this)},concat:function(t){var e=this.words,r=t.words,n=this.sigBytes,i=t.sigBytes;if(this.clamp(),n%4)for(var o=0;o<i;o++){var a=r[o>>>2]>>>24-o%4*8&255;e[n+o>>>2]|=a<<24-(n+o)%4*8}else for(var c=0;c<i;c+=4)e[n+c>>>2]=r[c>>>2];return this.sigBytes+=i,this},clamp:function(){var e=this.words,r=this.sigBytes;e[r>>>2]&=4294967295<<32-r%4*8,e.length=t.ceil(r/4)},clone:function(){var t=c.clone.call(this);return t.words=this.words.slice(0),t},random:function(t){for(var e=[],r=0;r<t;r+=4)e.push(n());return new s.init(e,t)}}),u=o.enc={},f=u.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255;n.push((o>>>4).toString(16)),n.push((15&o).toString(16))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n+=2)r[n>>>3]|=parseInt(t.substr(n,2),16)<<24-n%8*4;return new s.init(r,e/2)}},p=u.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],i=0;i<r;i++){var o=e[i>>>2]>>>24-i%4*8&255;n.push(String.fromCharCode(o))}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n++)r[n>>>2]|=(255&t.charCodeAt(n))<<24-n%4*8;return new s.init(r,e)}},h=u.Utf8={stringify:function(t){try{return decodeURIComponent(escape(p.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return p.parse(unescape(encodeURIComponent(t)))}},d=a.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=h.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var r,n=this._data,i=n.words,o=n.sigBytes,a=this.blockSize,c=o/(4*a),u=(c=e?t.ceil(c):t.max((0|c)-this._minBufferSize,0))*a,f=t.min(4*u,o);if(u){for(var p=0;p<u;p+=a)this._doProcessBlock(i,p);r=i.splice(0,u),n.sigBytes-=f}return new s.init(r,f)},clone:function(){var t=c.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),l=(a.Hasher=d.extend({cfg:c.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){d.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(e,r){return new t.init(r).finalize(e)}},_createHmacHelper:function(t){return function(e,r){return new l.HMAC.init(t,r).finalize(e)}}}),o.algo={});return o}(Math),function(t){var e=_CryptoJS.CryptoJS,r=e.lib,n=r.WordArray,i=r.Hasher,o=e.algo,a=[];!function(){for(var e=0;e<64;e++)a[e]=4294967296*t.abs(t.sin(e+1))|0}();var c=o.MD5=i.extend({_doReset:function(){this._hash=new n.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var n=e+r,i=t[n];t[n]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8)}var o=this._hash.words,c=t[e+0],h=t[e+1],d=t[e+2],l=t[e+3],y=t[e+4],_=t[e+5],g=t[e+6],v=t[e+7],S=t[e+8],m=t[e+9],k=t[e+10],C=t[e+11],B=t[e+12],x=t[e+13],D=t[e+14],w=t[e+15],b=o[0],E=o[1],z=o[2],J=o[3];b=s(b,E,z,J,c,7,a[0]),J=s(J,b,E,z,h,12,a[1]),z=s(z,J,b,E,d,17,a[2]),E=s(E,z,J,b,l,22,a[3]),b=s(b,E,z,J,y,7,a[4]),J=s(J,b,E,z,_,12,a[5]),z=s(z,J,b,E,g,17,a[6]),E=s(E,z,J,b,v,22,a[7]),b=s(b,E,z,J,S,7,a[8]),J=s(J,b,E,z,m,12,a[9]),z=s(z,J,b,E,k,17,a[10]),E=s(E,z,J,b,C,22,a[11]),b=s(b,E,z,J,B,7,a[12]),J=s(J,b,E,z,x,12,a[13]),z=s(z,J,b,E,D,17,a[14]),b=u(b,E=s(E,z,J,b,w,22,a[15]),z,J,h,5,a[16]),J=u(J,b,E,z,g,9,a[17]),z=u(z,J,b,E,C,14,a[18]),E=u(E,z,J,b,c,20,a[19]),b=u(b,E,z,J,_,5,a[20]),J=u(J,b,E,z,k,9,a[21]),z=u(z,J,b,E,w,14,a[22]),E=u(E,z,J,b,y,20,a[23]),b=u(b,E,z,J,m,5,a[24]),J=u(J,b,E,z,D,9,a[25]),z=u(z,J,b,E,l,14,a[26]),E=u(E,z,J,b,S,20,a[27]),b=u(b,E,z,J,x,5,a[28]),J=u(J,b,E,z,d,9,a[29]),z=u(z,J,b,E,v,14,a[30]),b=f(b,E=u(E,z,J,b,B,20,a[31]),z,J,_,4,a[32]),J=f(J,b,E,z,S,11,a[33]),z=f(z,J,b,E,C,16,a[34]),E=f(E,z,J,b,D,23,a[35]),b=f(b,E,z,J,h,4,a[36]),J=f(J,b,E,z,y,11,a[37]),z=f(z,J,b,E,v,16,a[38]),E=f(E,z,J,b,k,23,a[39]),b=f(b,E,z,J,x,4,a[40]),J=f(J,b,E,z,c,11,a[41]),z=f(z,J,b,E,l,16,a[42]),E=f(E,z,J,b,g,23,a[43]),b=f(b,E,z,J,m,4,a[44]),J=f(J,b,E,z,B,11,a[45]),z=f(z,J,b,E,w,16,a[46]),b=p(b,E=f(E,z,J,b,d,23,a[47]),z,J,c,6,a[48]),J=p(J,b,E,z,v,10,a[49]),z=p(z,J,b,E,D,15,a[50]),E=p(E,z,J,b,_,21,a[51]),b=p(b,E,z,J,B,6,a[52]),J=p(J,b,E,z,l,10,a[53]),z=p(z,J,b,E,k,15,a[54]),E=p(E,z,J,b,h,21,a[55]),b=p(b,E,z,J,S,6,a[56]),J=p(J,b,E,z,w,10,a[57]),z=p(z,J,b,E,g,15,a[58]),E=p(E,z,J,b,x,21,a[59]),b=p(b,E,z,J,y,6,a[60]),J=p(J,b,E,z,C,10,a[61]),z=p(z,J,b,E,d,15,a[62]),E=p(E,z,J,b,m,21,a[63]),o[0]=o[0]+b|0,o[1]=o[1]+E|0,o[2]=o[2]+z|0,o[3]=o[3]+J|0},_doFinalize:function(){var e=this._data,r=e.words,n=8*this._nDataBytes,i=8*e.sigBytes;r[i>>>5]|=128<<24-i%32;var o=t.floor(n/4294967296),a=n;r[15+(i+64>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),r[14+(i+64>>>9<<4)]=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8),e.sigBytes=4*(r.length+1),this._process();for(var c=this._hash,s=c.words,u=0;u<4;u++){var f=s[u];s[u]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8)}return c},clone:function(){var t=i.clone.call(this);return t._hash=this._hash.clone(),t}});function s(t,e,r,n,i,o,a){var c=t+(e&r|~e&n)+i+a;return(c<<o|c>>>32-o)+e}function u(t,e,r,n,i,o,a){var c=t+(e&n|r&~n)+i+a;return(c<<o|c>>>32-o)+e}function f(t,e,r,n,i,o,a){var c=t+(e^r^n)+i+a;return(c<<o|c>>>32-o)+e}function p(t,e,r,n,i,o,a){var c=t+(r^(e|~n))+i+a;return(c<<o|c>>>32-o)+e}e.MD5=i._createHelper(c),e.HmacMD5=i._createHmacHelper(c)}(Math),function(){var t=_CryptoJS.CryptoJS,e=t.lib,r=e.Base,n=e.WordArray,i=t.algo,o=i.MD5,a=i.EvpKDF=r.extend({cfg:r.extend({keySize:4,hasher:o,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r,i=this.cfg,o=i.hasher.create(),a=n.create(),c=a.words,s=i.keySize,u=i.iterations;c.length<s;){r&&o.update(r),r=o.update(t).finalize(e),o.reset();for(var f=1;f<u;f++)r=o.finalize(r),o.reset();a.concat(r)}return a.sigBytes=4*s,a}});t.EvpKDF=function(t,e,r){return a.create(r).compute(t,e)}}(),function(){var t=_CryptoJS.CryptoJS,e=t.lib.WordArray;t.enc.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,n=this._map;t.clamp();for(var i=[],o=0;o<r;o+=3)for(var a=(e[o>>>2]>>>24-o%4*8&255)<<16|(e[o+1>>>2]>>>24-(o+1)%4*8&255)<<8|e[o+2>>>2]>>>24-(o+2)%4*8&255,c=0;c<4&&o+.75*c<r;c++)i.push(n.charAt(a>>>6*(3-c)&63));var s=n.charAt(64);if(s)for(;i.length%4;)i.push(s);return i.join("")},parse:function(t){var r=t.length,n=this._map,i=this._reverseMap;if(!i){i=this._reverseMap=[];for(var o=0;o<n.length;o++)i[n.charCodeAt(o)]=o}var a=n.charAt(64);if(a){var c=t.indexOf(a);-1!==c&&(r=c)}return function(t,r,n){for(var i=[],o=0,a=0;a<r;a++)if(a%4){var c=n[t.charCodeAt(a-1)]<<a%4*2,s=n[t.charCodeAt(a)]>>>6-a%4*2,u=c|s;i[o>>>2]|=u<<24-o%4*8,o++}return e.create(i,o)}(t,r,i)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),_CryptoJS.CryptoJS.lib.Cipher||function(t){var e=_CryptoJS.CryptoJS,r=e.lib,n=r.Base,i=r.WordArray,o=r.BufferedBlockAlgorithm,a=e.enc,c=(a.Utf8,a.Base64),s=e.algo.EvpKDF,u=r.Cipher=o.extend({cfg:n.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,r){this.cfg=this.cfg.extend(r),this._xformMode=t,this._key=e,this.reset()},reset:function(){o.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function t(t){return"string"==typeof t?v:_}return function(e){return{encrypt:function(r,n,i){return t(n).encrypt(e,r,n,i)},decrypt:function(r,n,i){return t(n).decrypt(e,r,n,i)}}}}()}),f=(r.StreamCipher=u.extend({_doFinalize:function(){return this._process(!0)},blockSize:1}),e.mode={}),p=r.BlockCipherMode=n.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}}),h=f.CBC=function(){var e=p.extend();function r(e,r,n){var i,o=this._iv;o?(i=o,this._iv=t):i=this._prevBlock;for(var a=0;a<n;a++)e[r+a]^=i[a]}return e.Encryptor=e.extend({processBlock:function(t,e){var n=this._cipher,i=n.blockSize;r.call(this,t,e,i),n.encryptBlock(t,e),this._prevBlock=t.slice(e,e+i)}}),e.Decryptor=e.extend({processBlock:function(t,e){var n=this._cipher,i=n.blockSize,o=t.slice(e,e+i);n.decryptBlock(t,e),r.call(this,t,e,i),this._prevBlock=o}}),e}(),d=(e.pad={}).Pkcs7={pad:function(t,e){for(var r=4*e,n=r-t.sigBytes%r,o=n<<24|n<<16|n<<8|n,a=[],c=0;c<n;c+=4)a.push(o);var s=i.create(a,n);t.concat(s)},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},l=(r.BlockCipher=u.extend({cfg:u.cfg.extend({mode:h,padding:d}),reset:function(){var t;u.reset.call(this);var e=this.cfg,r=e.iv,n=e.mode;this._xformMode==this._ENC_XFORM_MODE?t=n.createEncryptor:(t=n.createDecryptor,this._minBufferSize=1),this._mode&&this._mode.__creator==t?this._mode.init(this,r&&r.words):(this._mode=t.call(n,this,r&&r.words),this._mode.__creator=t)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t,e=this.cfg.padding;return this._xformMode==this._ENC_XFORM_MODE?(e.pad(this._data,this.blockSize),t=this._process(!0)):(t=this._process(!0),e.unpad(t)),t},blockSize:4}),r.CipherParams=n.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}})),y=(e.format={}).OpenSSL={stringify:function(t){var e=t.ciphertext,r=t.salt;return(r?i.create([1398893684,1701076831]).concat(r).concat(e):e).toString(c)},parse:function(t){var e,r=c.parse(t),n=r.words;return 1398893684==n[0]&&1701076831==n[1]&&(e=i.create(n.slice(2,4)),n.splice(0,4),r.sigBytes-=16),l.create({ciphertext:r,salt:e})}},_=r.SerializableCipher=n.extend({cfg:n.extend({format:y}),encrypt:function(t,e,r,n){n=this.cfg.extend(n);var i=t.createEncryptor(r,n),o=i.finalize(e),a=i.cfg;return l.create({ciphertext:o,key:r,iv:a.iv,algorithm:t,mode:a.mode,padding:a.padding,blockSize:t.blockSize,formatter:n.format})},decrypt:function(t,e,r,n){return n=this.cfg.extend(n),e=this._parse(e,n.format),t.createDecryptor(r,n).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}}),g=(e.kdf={}).OpenSSL={execute:function(t,e,r,n){n||(n=i.random(8));var o=s.create({keySize:e+r}).compute(t,n),a=i.create(o.words.slice(e),4*r);return o.sigBytes=4*e,l.create({key:o,iv:a,salt:n})}},v=r.PasswordBasedCipher=_.extend({cfg:_.cfg.extend({kdf:g}),encrypt:function(t,e,r,n){var i=(n=this.cfg.extend(n)).kdf.execute(r,t.keySize,t.ivSize);n.iv=i.iv;var o=_.encrypt.call(this,t,e,i.key,n);return o.mixIn(i),o},decrypt:function(t,e,r,n){n=this.cfg.extend(n),e=this._parse(e,n.format);var i=n.kdf.execute(r,t.keySize,t.ivSize,e.salt);return n.iv=i.iv,_.decrypt.call(this,t,e,i.key,n)}})}(),function(){var t=_CryptoJS.CryptoJS,e=t.lib.BlockCipher,r=t.algo,n=[],i=[],o=[],a=[],c=[],s=[],u=[],f=[],p=[],h=[];!function(){for(var t=[],e=0;e<256;e++)t[e]=e<128?e<<1:e<<1^283;var r=0,d=0;for(e=0;e<256;e++){var l=d^d<<1^d<<2^d<<3^d<<4;l=l>>>8^255&l^99,n[r]=l,i[l]=r;var y=t[r],_=t[y],g=t[_],v=257*t[l]^16843008*l;o[r]=v<<24|v>>>8,a[r]=v<<16|v>>>16,c[r]=v<<8|v>>>24,s[r]=v;v=16843009*g^65537*_^257*y^16843008*r;u[l]=v<<24|v>>>8,f[l]=v<<16|v>>>16,p[l]=v<<8|v>>>24,h[l]=v,r?(r=y^t[t[t[g^y]]],d^=t[t[d]]):r=d=1}}();var d=[0,1,2,4,8,16,32,64,128,27,54],l=r.AES=e.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var t=this._keyPriorReset=this._key,e=t.words,r=t.sigBytes/4,i=4*((this._nRounds=r+6)+1),o=this._keySchedule=[],a=0;a<i;a++)a<r?o[a]=e[a]:(l=o[a-1],a%r?r>6&&a%r==4&&(l=n[l>>>24]<<24|n[l>>>16&255]<<16|n[l>>>8&255]<<8|n[255&l]):(l=n[(l=l<<8|l>>>24)>>>24]<<24|n[l>>>16&255]<<16|n[l>>>8&255]<<8|n[255&l],l^=d[a/r|0]<<24),o[a]=o[a-r]^l);for(var c=this._invKeySchedule=[],s=0;s<i;s++){a=i-s;if(s%4)var l=o[a];else l=o[a-4];c[s]=s<4||a<=4?l:u[n[l>>>24]]^f[n[l>>>16&255]]^p[n[l>>>8&255]]^h[n[255&l]]}}},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,o,a,c,s,n)},decryptBlock:function(t,e){var r=t[e+1];t[e+1]=t[e+3],t[e+3]=r,this._doCryptBlock(t,e,this._invKeySchedule,u,f,p,h,i);r=t[e+1];t[e+1]=t[e+3],t[e+3]=r},_doCryptBlock:function(t,e,r,n,i,o,a,c){for(var s=this._nRounds,u=t[e]^r[0],f=t[e+1]^r[1],p=t[e+2]^r[2],h=t[e+3]^r[3],d=4,l=1;l<s;l++){var y=n[u>>>24]^i[f>>>16&255]^o[p>>>8&255]^a[255&h]^r[d++],_=n[f>>>24]^i[p>>>16&255]^o[h>>>8&255]^a[255&u]^r[d++],g=n[p>>>24]^i[h>>>16&255]^o[u>>>8&255]^a[255&f]^r[d++],v=n[h>>>24]^i[u>>>16&255]^o[f>>>8&255]^a[255&p]^r[d++];u=y,f=_,p=g,h=v}y=(c[u>>>24]<<24|c[f>>>16&255]<<16|c[p>>>8&255]<<8|c[255&h])^r[d++],_=(c[f>>>24]<<24|c[p>>>16&255]<<16|c[h>>>8&255]<<8|c[255&u])^r[d++],g=(c[p>>>24]<<24|c[h>>>16&255]<<16|c[u>>>8&255]<<8|c[255&f])^r[d++],v=(c[h>>>24]<<24|c[u>>>16&255]<<16|c[f>>>8&255]<<8|c[255&p])^r[d++];t[e]=y,t[e+1]=_,t[e+2]=g,t[e+3]=v},keySize:8});t.AES=e._createHelper(l)}();var _iv,_sa,_config,_oldOnceData,CryptoJS=_CryptoJS.CryptoJS,getRandomBasic=function(){var t=(new Date).getTime();return function(e){return Math.ceil((t=(9301*t+49297)%233280)/233280*e)}}();function isObject(t){return null!=t&&"[object Object]"==toString.call(t)}function getRandom(){if("function"==typeof Uint32Array){var t="";if("undefined"!=typeof crypto?t=crypto:"undefined"!=typeof msCrypto&&(t=msCrypto),isObject(t)&&t.getRandomValues){var e=new Uint32Array(1);return t.getRandomValues(e)[0]/Math.pow(2,32)}}return getRandomBasic(1e19)/1e19}function buildAESOption(t){return{mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Pkcs7,iv:t||generateIVData()}}function encryptData(t,e,r,n){var i=buildAESOption(r),o=t;"string"!=typeof t&&(o=JSON.stringify(t)),n||(e=CryptoJS.enc.Base64.parse(e));var a=CryptoJS.enc.Utf8.parse(o),c=CryptoJS.AES.encrypt(a,e,i).toString();return i.iv.clone().concat(CryptoJS.enc.Base64.parse(c)).toString(CryptoJS.enc.Base64)}function decryptData(t,e,r){var n=CryptoJS.enc.Base64.parse(t).toString(),i=n.substr(0,32),o=CryptoJS.enc.Hex.parse(n.substr(32)).toString(CryptoJS.enc.Base64),a=buildAESOption(CryptoJS.enc.Hex.parse(i));return r||(e=CryptoJS.enc.Base64.parse(e)),CryptoJS.AES.decrypt(o,e,a).toString(CryptoJS.enc.Utf8)}function generateIVData(t){t=t||16;for(var e="";t-- >0;){var r=Math.ceil(127*getRandom()).toString(16);e+=2===r.length?r:"0"+r}return CryptoJS.enc.Hex.parse(e)}var _log=console&&console.log||function(){};function isTruthy(t,e){return!!t||(_log(e+"不能为空。"),!1)}function matchType(t,e,r){return typeof t===r||(_log("参数类型错误,"+e+"必须为"+r),!1)}function aesEncrypt(t){try{return encryptData(t,_config.k,_iv)}catch(e){return _log("数据加密异常："+e),_sa.para.batch_send?"":_oldOnceData.call(_sa.kit,t)}}function formatData(t){var e={key_id:_config.kid,key_hash:_config.khash,nc:1},r="payload";return _sa.para.batch_send&&(e.flush_time=Date.now(),r="payloads"),e[r]=t,e}function encodeTrackData(t){var e="";_sa.para.batch_send?e=formatData(t):e=formatData(aesEncrypt(t));var r=JSON.stringify(e);return"data="+encodeURIComponent(r)+"&gzip=9"}function isObject$1(t){return null!=t&&"[object Object]"==toString.call(t)}function encryptStoreData(t){var e=t.length;if(e>0){for(var r=0;r<e;r++)isObject$1(t[r])&&(t[r]=aesEncrypt(t[r]));_sa.store.mem.mdata=t.concat(_sa.store.mem.mdata)}}function doEnDecrypt(t,e,r,n){try{var i=r||_config&&_config.k;return isTruthy(i,"参数key")&&matchType(i,"参数key","string")?(void 0===n&&(n=void 0!==r),t?encryptData(e,i,null,n):decryptData(e,i,n)):e}catch(t){return _log("执行加解密失败，返回原始数据。"),e}}var AesEncryption={plugin_name:"AesEncryption",lib_version:"1.0.0",init:function(t,e){(_sa=t)&&_sa.kit&&_sa.kit.processData?isTruthy(e,"初始配置config")&&isTruthy(e.k,"初始参数k")&&isTruthy(e.kid,"初始参数kid")&&isTruthy(e.khash,"初始参数khash")&&matchType(e.k,"初始参数k","string")&&matchType(e.khash,"初始参数khash","string")&&matchType(e.kid,"初始参数kid","number")?(_config=e,_iv=generateIVData(),_oldOnceData=_sa.kit.onceTrackData,_sa.kit.onceTrackData=encodeTrackData,_sa.kit.batchTrackData=encodeTrackData,_sa.kit.processData=aesEncrypt,_sa.mergeStorageData.deleteAesData=encryptStoreData,_log("AES插件初始化完成")):_log("AES插件初始化失败"):_log("AES插件初始化失败,当前主sdk不支持AES插件，请升级主sdk")},encrypt:function(t,e,r){return doEnDecrypt(!0,t,e,r)},decrypt:function(t,e,r){return doEnDecrypt(!1,t,e,r)}},base={plugin_version:"1.21.6"};function createPlugin(t){if("object"==typeof t&&"string"==typeof t.plugin_name&&""!==t.plugin_name)return t.plugin_version=base.plugin_version,t.log=t.log||function(){"object"==typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)},t;"object"==typeof console&&"function"==typeof console.error&&console.error('plugin must contain  proprerty "plugin_name"')}var index=createPlugin(AesEncryption);module.exports=index;