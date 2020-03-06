(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!*************************************!*\
  !*** E:/uin_test/zjlive/pages.json ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25120200103005","_inBundle":false,"_integrity":"sha512-nYoIrRV2e5o/vzr6foSdWi3Rl2p0GuO+LPY3JctyY6uTKgPnuH99d7aL/QQdJ1SacQjBWO+QGK1qankN7oyrWw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25120200103005.tgz","_shasum":"a77a63481f36474f3e86686868051219d1bb12df","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"6be187a3dfe15f95dd6146d9fec08e1f81100987","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25120200103005"};

/***/ }),
/* 7 */
/*!******************************************************!*\
  !*** E:/uin_test/zjlive/pages.json?{"type":"style"} ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "直播", "enablePullDownRefresh": true }, "pages/center/center": { "navigationBarTitleText": "我的", "enablePullDownRefresh": false }, "pages/new/new": { "navigationBarTitleText": "新闻", "enablePullDownRefresh": true }, "pages/hot/hot": { "navigationBarTitleText": "推荐", "enablePullDownRefresh": true }, "pages/detail/detail": { "navigationBarTitleText": "详情", "navigationBarBackgroundColor": "#000000", "backgroundColor": "#000000" }, "pages/info/info": {}, "pages/newlist/newlist": { "enablePullDownRefresh": true }, "pages/moreList/moreList": { "navigationBarTitleText": "新闻" }, "pages/channel/channel": { "navigationBarTitleText": "频道" }, "pages/leftlist/leftlist": { "navigationBarTitleText": "新闻", "enablePullDownRefresh": true }, "pages/picture/picture": { "navigationBarTitleText": "图片", "enablePullDownRefresh": true }, "pages/live/live": {} }, "globalStyle": { "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#FF80AB", "backgroundColor": "#EFEFEF" } };exports.default = _default;

/***/ }),
/* 8 */
/*!*****************************************************!*\
  !*** E:/uin_test/zjlive/pages.json?{"type":"stat"} ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__A910299" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */
/*!*****************************************!*\
  !*** E:/uin_test/zjlive/common/util.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.friendlyDate = friendlyDate;function friendlyDate(timestamp) {
  var formats = {
    'year': '%n% 年前',
    'month': '%n% 月前',
    'day': '%n% 天前',
    'hour': '%n% 小时前',
    'minute': '%n% 分钟前',
    'second': '%n% 秒前' };


  var now = Date.now();
  var seconds = Math.floor((now - timestamp) / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var months = Math.floor(days / 30);
  var years = Math.floor(months / 12);

  var diffType = '';
  var diffValue = 0;
  if (years > 0) {
    diffType = 'year';
    diffValue = years;
  } else {
    if (months > 0) {
      diffType = 'month';
      diffValue = months;
    } else {
      if (days > 0) {
        diffType = 'day';
        diffValue = days;
      } else {
        if (hours > 0) {
          diffType = 'hour';
          diffValue = hours;
        } else {
          if (minutes > 0) {
            diffType = 'minute';
            diffValue = minutes;
          } else {
            diffType = 'second';
            diffValue = seconds === 0 ? seconds = 1 : seconds;
          }
        }
      }
    }
  }
  return formats[diffType].replace('%n%', diffValue);
}

/***/ }),
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */
/*!*********************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/flv.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _polyfill = _interopRequireDefault(__webpack_require__(/*! ./utils/polyfill.js */ 109));
var _features = _interopRequireDefault(__webpack_require__(/*! ./core/features.js */ 113));
var _loader = __webpack_require__(/*! ./io/loader.js */ 118);
var _flvPlayer = _interopRequireDefault(__webpack_require__(/*! ./player/flv-player.js */ 129));
var _nativePlayer = _interopRequireDefault(__webpack_require__(/*! ./player/native-player.js */ 150));
var _playerEvents = _interopRequireDefault(__webpack_require__(/*! ./player/player-events.js */ 130));
var _playerErrors = __webpack_require__(/*! ./player/player-errors.js */ 149);
var _loggingControl = _interopRequireDefault(__webpack_require__(/*! ./utils/logging-control.js */ 132));
var _exception = __webpack_require__(/*! ./utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /*
                                                                                                                                                * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                *
                                                                                                                                                * @author zheng qian <xqq@xqq.im>
                                                                                                                                                *
                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                *
                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                *
                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                * limitations under the License.
                                                                                                                                                */ // here are all the interfaces
// install polyfills
_polyfill.default.install(); // factory method
function createPlayer(mediaDataSource, optionalConfig) {var mds = mediaDataSource;if (mds == null || typeof mds !== 'object') {throw new _exception.InvalidArgumentException('MediaDataSource must be an javascript object!');}if (!mds.hasOwnProperty('type')) {throw new _exception.InvalidArgumentException('MediaDataSource must has type field to indicate video file type!');}switch (mds.type) {
    case 'flv':
      return new _flvPlayer.default(mds, optionalConfig);
    default:
      return new _nativePlayer.default(mds, optionalConfig);}

}


// feature detection
function isSupported() {
  return _features.default.supportMSEH264Playback();
}

function getFeatureList() {
  return _features.default.getFeatureList();
}


// interfaces
var flvjs = {};

flvjs.createPlayer = createPlayer;
flvjs.isSupported = isSupported;
flvjs.getFeatureList = getFeatureList;

flvjs.BaseLoader = _loader.BaseLoader;
flvjs.LoaderStatus = _loader.LoaderStatus;
flvjs.LoaderErrors = _loader.LoaderErrors;

flvjs.Events = _playerEvents.default;
flvjs.ErrorTypes = _playerErrors.ErrorTypes;
flvjs.ErrorDetails = _playerErrors.ErrorDetails;

flvjs.FlvPlayer = _flvPlayer.default;
flvjs.NativePlayer = _nativePlayer.default;
flvjs.LoggingControl = _loggingControl.default;

Object.defineProperty(flvjs, 'version', {
  enumerable: true,
  get: function get() {
    // replaced by browserify-versionify transform
    return '__VERSION__';
  } });var _default =


flvjs;exports.default = _default;

/***/ }),
/* 109 */
/*!********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/utils/polyfill.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */var

Polyfill = /*#__PURE__*/function () {function Polyfill() {_classCallCheck(this, Polyfill);}_createClass(Polyfill, null, [{ key: "install", value: function install()

    {
      // ES6 Object.setPrototypeOf
      Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
        obj.__proto__ = proto;
        return obj;
      };

      // ES6 Object.assign
      Object.assign = Object.assign || function (target) {
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          if (source !== undefined && source !== null) {
            for (var key in source) {
              if (source.hasOwnProperty(key)) {
                output[key] = source[key];
              }
            }
          }
        }
        return output;
      };

      // ES6 Promise (missing support in IE11)
      if (typeof self.Promise !== 'function') {
        __webpack_require__(/*! es6-promise */ 110).polyfill();
      }
    } }]);return Polyfill;}();



Polyfill.install();var _default =

Polyfill;exports.default = _default;

/***/ }),
/* 110 */
/*!**********************************************************!*\
  !*** E:/uin_test/zjlive/es6-promise/dist/es6-promise.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) { /*!
               * @overview es6-promise - a tiny implementation of Promises/A+.
               * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
               * @license   Licensed under MIT license
               *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
               * @version   v4.2.8+1e68dce6
               */

(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
})(void 0, function () {'use strict';

  function objectOrFunction(x) {
    var type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
  }

  function isFunction(x) {
    return typeof x === 'function';
  }



  var _isArray = void 0;
  if (Array.isArray) {
    _isArray = Array.isArray;
  } else {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = void 0;
  var customSchedulerFn = void 0;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var vertx = Function('return this')().require('vertx');
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = void 0;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && "function" === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;


    if (_state) {
      var callback = arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
      `Promise.resolve` returns a promise that will become resolved with the
      passed `value`. It is shorthand for the following:
    
      ```javascript
      let promise = new Promise(function(resolve, reject){
        resolve(1);
      });
    
      promise.then(function(value){
        // value === 1
      });
      ```
    
      Instead of writing the above, your code now simply becomes the following:
    
      ```javascript
      let promise = Promise.resolve(1);
    
      promise.then(function(value){
        // value === 1
      });
      ```
    
      @method resolve
      @static
      @param {Any} value value that the returned promise will be resolved with
      Useful for tooling.
      @return {Promise} a promise that will become fulfilled with the given
      `value`
    */
  function resolve$1(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && typeof object === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(2);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
    try {
      then$$1.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then$$1) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then$$1, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return resolve(promise, value);
      }, function (reason) {
        return reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$1) {
    if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$1 === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$1)) {
        handleForeignThenable(promise, maybeThenable, then$$1);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function resolve(promise, value) {
    if (promise === value) {
      reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      var then$$1 = void 0;
      try {
        then$$1 = value.then;
      } catch (error) {
        reject(promise, error);
        return;
      }
      handleMaybeThenable(promise, value, then$$1);
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;


    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = void 0,
    callback = void 0,
    detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
    value = void 0,
    error = void 0,
    succeeded = true;

    if (hasCallback) {
      try {
        value = callback(detail);
      } catch (e) {
        succeeded = false;
        error = e;
      }

      if (promise === value) {
        reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
    }

    if (promise._state !== PENDING) {
      // noop
    } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (succeeded === false) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        resolve(promise, value);
      }, function rejectPromise(reason) {
        reject(promise, reason);
      });
    } catch (e) {
      reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  }

  var Enumerator = function () {
    function Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(noop);

      if (!this.promise[PROMISE_ID]) {
        makePromise(this.promise);
      }

      if (isArray(input)) {
        this.length = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate(input);
          if (this._remaining === 0) {
            fulfill(this.promise, this._result);
          }
        }
      } else {
        reject(this.promise, validationError());
      }
    }

    Enumerator.prototype._enumerate = function _enumerate(input) {
      for (var i = 0; this._state === PENDING && i < input.length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
      var c = this._instanceConstructor;
      var resolve$$1 = c.resolve;


      if (resolve$$1 === resolve$1) {
        var _then = void 0;
        var error = void 0;
        var didError = false;
        try {
          _then = entry.then;
        } catch (e) {
          didError = true;
          error = e;
        }

        if (_then === then && entry._state !== PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof _then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === Promise$1) {
          var promise = new c(noop);
          if (didError) {
            reject(promise, error);
          } else {
            handleMaybeThenable(promise, entry, _then);
          }
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function (resolve$$1) {
            return resolve$$1(entry);
          }), i);
        }
      } else {
        this._willSettleAt(resolve$$1(entry), i);
      }
    };

    Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
      var promise = this.promise;


      if (promise._state === PENDING) {
        this._remaining--;

        if (state === REJECTED) {
          reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        fulfill(promise, this._result);
      }
    };

    Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
      var enumerator = this;

      subscribe(promise, undefined, function (value) {
        return enumerator._settledAt(FULFILLED, i, value);
      }, function (reason) {
        return enumerator._settledAt(REJECTED, i, reason);
      });
    };

    return Enumerator;
  }();

  /**
         `Promise.all` accepts an array of promises, and returns a new promise which
         is fulfilled with an array of fulfillment values for the passed promises, or
         rejected with the reason of the first passed promise to be rejected. It casts all
         elements of the passed iterable to promises as it runs this algorithm.
       
         Example:
       
         ```javascript
         let promise1 = resolve(1);
         let promise2 = resolve(2);
         let promise3 = resolve(3);
         let promises = [ promise1, promise2, promise3 ];
       
         Promise.all(promises).then(function(array){
           // The array here would be [ 1, 2, 3 ];
         });
         ```
       
         If any of the `promises` given to `all` are rejected, the first promise
         that is rejected will be given as an argument to the returned promises's
         rejection handler. For example:
       
         Example:
       
         ```javascript
         let promise1 = resolve(1);
         let promise2 = reject(new Error("2"));
         let promise3 = reject(new Error("3"));
         let promises = [ promise1, promise2, promise3 ];
       
         Promise.all(promises).then(function(array){
           // Code here never runs because there are rejected promises!
         }, function(error) {
           // error.message === "2"
         });
         ```
       
         @method all
         @static
         @param {Array} entries array of promises
         @param {String} label optional string for labeling the promise.
         Useful for tooling.
         @return {Promise} promise that is fulfilled when all `promises` have been
         fulfilled, or rejected if any of them become rejected.
         @static
       */
  function all(entries) {
    return new Enumerator(this, entries).promise;
  }

  /**
      `Promise.race` returns a new promise which is settled in the same way as the
      first passed promise to settle.
    
      Example:
    
      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });
    
      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 2');
        }, 100);
      });
    
      Promise.race([promise1, promise2]).then(function(result){
        // result === 'promise 2' because it was resolved before promise1
        // was resolved.
      });
      ```
    
      `Promise.race` is deterministic in that only the state of the first
      settled promise matters. For example, even if other promises given to the
      `promises` array argument are resolved, but the first settled promise has
      become rejected before the other promises became fulfilled, the returned
      promise will become rejected:
    
      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });
    
      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error('promise 2'));
        }, 100);
      });
    
      Promise.race([promise1, promise2]).then(function(result){
        // Code here never runs
      }, function(reason){
        // reason.message === 'promise 2' because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```
    
      An example real-world use case is implementing timeouts:
    
      ```javascript
      Promise.race([ajax('foo.json'), timeout(5000)])
      ```
    
      @method race
      @static
      @param {Array} promises array of promises to observe
      Useful for tooling.
      @return {Promise} a promise which settles in the same way as the first passed
      promise to settle.
    */
  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
      `Promise.reject` returns a promise rejected with the passed `reason`.
      It is shorthand for the following:
    
      ```javascript
      let promise = new Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });
    
      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```
    
      Instead of writing the above, your code now simply becomes the following:
    
      ```javascript
      let promise = Promise.reject(new Error('WHOOPS'));
    
      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```
    
      @method reject
      @static
      @param {Any} reason value that the returned promise will be rejected with.
      Useful for tooling.
      @return {Promise} a promise rejected with the given `reason`.
    */
  function reject$1(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.
    
      Terminology
      -----------
    
      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.
    
      A promise can be in one of three states: pending, fulfilled, or rejected.
    
      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.
    
      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.
    
    
      Basic Usage:
      ------------
    
      ```js
      let promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);
    
        // on failure
        reject(reason);
      });
    
      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```
    
      Advanced Usage:
      ---------------
    
      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.
    
      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          let xhr = new XMLHttpRequest();
    
          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();
    
          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }
    
      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```
    
      Unlike callbacks, promises are great composable primitives.
    
      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON
    
        return values;
      });
      ```
    
      @class Promise
      @param {Function} resolver
      Useful for tooling.
      @constructor
    */

  var Promise$1 = function () {
    function Promise(resolver) {
      this[PROMISE_ID] = nextId();
      this._result = this._state = undefined;
      this._subscribers = [];

      if (noop !== resolver) {
        typeof resolver !== 'function' && needsResolver();
        this instanceof Promise ? initializePromise(this, resolver) : needsNew();
      }
    }

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
       ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
       Chaining
      --------
       The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
       ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
       findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
       ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
       Assimilation
      ------------
       Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
       ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
       If the assimliated promise rejects, then the downstream promise will also reject.
       ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
       Simple Example
      --------------
       Synchronous Example
       ```javascript
      let result;
       try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
       Errback Example
       ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
       Promise Example;
       ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
       Advanced Example
      --------------
       Synchronous Example
       ```javascript
      let author, books;
       try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
       Errback Example
       ```js
       function foundBooks(books) {
       }
       function failure(reason) {
       }
       findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
       Promise Example;
       ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
       @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
      */

    /**
         `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
         as the catch block of a try/catch statement.
         ```js
         function findAuthor(){
         throw new Error('couldn't find that author');
         }
         // synchronous
         try {
         findAuthor();
         } catch(reason) {
         // something went wrong
         }
         // async with promises
         findAuthor().catch(function(reason){
         // something went wrong
         });
         ```
         @method catch
         @param {Function} onRejection
         Useful for tooling.
         @return {Promise}
         */


    Promise.prototype.catch = function _catch(onRejection) {
      return this.then(null, onRejection);
    };

    /**
         `finally` will be invoked regardless of the promise's fate just as native
         try/catch/finally behaves
       
         Synchronous example:
       
         ```js
         findAuthor() {
           if (Math.random() > 0.5) {
             throw new Error();
           }
           return new Author();
         }
       
         try {
           return findAuthor(); // succeed or fail
         } catch(error) {
           return findOtherAuther();
         } finally {
           // always runs
           // doesn't affect the return value
         }
         ```
       
         Asynchronous example:
       
         ```js
         findAuthor().catch(function(reason){
           return findOtherAuther();
         }).finally(function(){
           // author was either found, or not
         });
         ```
       
         @method finally
         @param {Function} callback
         @return {Promise}
       */


    Promise.prototype.finally = function _finally(callback) {
      var promise = this;
      var constructor = promise.constructor;

      if (isFunction(callback)) {
        return promise.then(function (value) {
          return constructor.resolve(callback()).then(function () {
            return value;
          });
        }, function (reason) {
          return constructor.resolve(callback()).then(function () {
            throw reason;
          });
        });
      }

      return promise.then(callback, callback);
    };

    return Promise;
  }();

  Promise$1.prototype.then = then;
  Promise$1.all = all;
  Promise$1.race = race;
  Promise$1.resolve = resolve$1;
  Promise$1.reject = reject$1;
  Promise$1._setScheduler = setScheduler;
  Promise$1._setAsap = setAsap;
  Promise$1._asap = asap;

  /*global self*/
  function polyfill() {
    var local = void 0;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise$1;
  }

  // Strange compat..
  Promise$1.polyfill = polyfill;
  Promise$1.Promise = Promise$1;

  return Promise$1;

});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../HBuilderX/plugins/uniapp-cli/node_modules/node-libs-browser/mock/process.js */ 111), __webpack_require__(/*! ./../../../../HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/global.js */ 3)))

/***/ }),
/* 111 */
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
	setTimeout(fn, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ 112);
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),
/* 112 */
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ 111)))

/***/ }),
/* 113 */
/*!*******************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/core/features.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _ioController = _interopRequireDefault(__webpack_require__(/*! ../io/io-controller.js */ 114));
var _config = __webpack_require__(/*! ../config.js */ 128);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

Features = /*#__PURE__*/function () {function Features() {_classCallCheck(this, Features);}_createClass(Features, null, [{ key: "supportMSEH264Playback", value: function supportMSEH264Playback()

    {
      return window.MediaSource &&
      window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
    } }, { key: "supportNetworkStreamIO", value: function supportNetworkStreamIO()

    {
      var ioctl = new _ioController.default({}, (0, _config.createDefaultConfig)());
      var loaderType = ioctl.loaderType;
      ioctl.destroy();
      return loaderType == 'fetch-stream-loader' || loaderType == 'xhr-moz-chunked-loader';
    } }, { key: "getNetworkLoaderTypeName", value: function getNetworkLoaderTypeName()

    {
      var ioctl = new _ioController.default({}, (0, _config.createDefaultConfig)());
      var loaderType = ioctl.loaderType;
      ioctl.destroy();
      return loaderType;
    } }, { key: "supportNativeMediaPlayback", value: function supportNativeMediaPlayback(

    mimeType) {
      if (Features.videoElement == undefined) {
        Features.videoElement = window.document.createElement('video');
      }
      var canPlay = Features.videoElement.canPlayType(mimeType);
      return canPlay === 'probably' || canPlay == 'maybe';
    } }, { key: "getFeatureList", value: function getFeatureList()

    {
      var features = {
        mseFlvPlayback: false,
        mseLiveFlvPlayback: false,
        networkStreamIO: false,
        networkLoaderName: '',
        nativeMP4H264Playback: false,
        nativeWebmVP8Playback: false,
        nativeWebmVP9Playback: false };


      features.mseFlvPlayback = Features.supportMSEH264Playback();
      features.networkStreamIO = Features.supportNetworkStreamIO();
      features.networkLoaderName = Features.getNetworkLoaderTypeName();
      features.mseLiveFlvPlayback = features.mseFlvPlayback && features.networkStreamIO;
      features.nativeMP4H264Playback = Features.supportNativeMediaPlayback('video/mp4; codecs="avc1.42001E, mp4a.40.2"');
      features.nativeWebmVP8Playback = Features.supportNativeMediaPlayback('video/webm; codecs="vp8.0, vorbis"');
      features.nativeWebmVP9Playback = Features.supportNativeMediaPlayback('video/webm; codecs="vp9"');

      return features;
    } }]);return Features;}();var _default =



Features;exports.default = _default;

/***/ }),
/* 114 */
/*!**********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/io-controller.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _speedSampler = _interopRequireDefault(__webpack_require__(/*! ./speed-sampler.js */ 117));
var _loader = __webpack_require__(/*! ./loader.js */ 118);
var _fetchStreamLoader = _interopRequireDefault(__webpack_require__(/*! ./fetch-stream-loader.js */ 120));
var _xhrMozChunkedLoader = _interopRequireDefault(__webpack_require__(/*! ./xhr-moz-chunked-loader.js */ 122));
var _xhrMsstreamLoader = _interopRequireDefault(__webpack_require__(/*! ./xhr-msstream-loader.js */ 123));
var _xhrRangeLoader = _interopRequireDefault(__webpack_require__(/*! ./xhr-range-loader.js */ 124));
var _websocketLoader = _interopRequireDefault(__webpack_require__(/*! ./websocket-loader.js */ 125));
var _rangeSeekHandler = _interopRequireDefault(__webpack_require__(/*! ./range-seek-handler.js */ 126));
var _paramSeekHandler = _interopRequireDefault(__webpack_require__(/*! ./param-seek-handler.js */ 127));
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * DataSource: {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              *     url: string,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              *     filesize: number,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              *     cors: boolean,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              *     withCredentials: boolean
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              */

// Manage IO Loaders
var IOController = /*#__PURE__*/function () {

  function IOController(dataSource, config, extraData) {_classCallCheck(this, IOController);
    this.TAG = 'IOController';

    this._config = config;
    this._extraData = extraData;

    this._stashInitialSize = 1024 * 384; // default initial size: 384KB
    if (config.stashInitialSize != undefined && config.stashInitialSize > 0) {
      // apply from config
      this._stashInitialSize = config.stashInitialSize;
    }

    this._stashUsed = 0;
    this._stashSize = this._stashInitialSize;
    this._bufferSize = 1024 * 1024 * 3; // initial size: 3MB
    this._stashBuffer = new ArrayBuffer(this._bufferSize);
    this._stashByteStart = 0;
    this._enableStash = true;
    if (config.enableStashBuffer === false) {
      this._enableStash = false;
    }

    this._loader = null;
    this._loaderClass = null;
    this._seekHandler = null;

    this._dataSource = dataSource;
    this._isWebSocketURL = /wss?:\/\/(.+?)/.test(dataSource.url);
    this._refTotalLength = dataSource.filesize ? dataSource.filesize : null;
    this._totalLength = this._refTotalLength;
    this._fullRequestFlag = false;
    this._currentRange = null;
    this._redirectedURL = null;

    this._speedNormalized = 0;
    this._speedSampler = new _speedSampler.default();
    this._speedNormalizeList = [64, 128, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096];

    this._isEarlyEofReconnecting = false;

    this._paused = false;
    this._resumeFrom = 0;

    this._onDataArrival = null;
    this._onSeeked = null;
    this._onError = null;
    this._onComplete = null;
    this._onRedirect = null;
    this._onRecoveredEarlyEof = null;

    this._selectSeekHandler();
    this._selectLoader();
    this._createLoader();
  }_createClass(IOController, [{ key: "destroy", value: function destroy()

    {
      if (this._loader.isWorking()) {
        this._loader.abort();
      }
      this._loader.destroy();
      this._loader = null;
      this._loaderClass = null;
      this._dataSource = null;
      this._stashBuffer = null;
      this._stashUsed = this._stashSize = this._bufferSize = this._stashByteStart = 0;
      this._currentRange = null;
      this._speedSampler = null;

      this._isEarlyEofReconnecting = false;

      this._onDataArrival = null;
      this._onSeeked = null;
      this._onError = null;
      this._onComplete = null;
      this._onRedirect = null;
      this._onRecoveredEarlyEof = null;

      this._extraData = null;
    } }, { key: "isWorking", value: function isWorking()

    {
      return this._loader && this._loader.isWorking() && !this._paused;
    } }, { key: "isPaused", value: function isPaused()

    {
      return this._paused;
    } }, { key: "_selectSeekHandler", value: function _selectSeekHandler()
























































































    {
      var config = this._config;

      if (config.seekType === 'range') {
        this._seekHandler = new _rangeSeekHandler.default(this._config.rangeLoadZeroStart);
      } else if (config.seekType === 'param') {
        var paramStart = config.seekParamStart || 'bstart';
        var paramEnd = config.seekParamEnd || 'bend';

        this._seekHandler = new _paramSeekHandler.default(paramStart, paramEnd);
      } else if (config.seekType === 'custom') {
        if (typeof config.customSeekHandler !== 'function') {
          throw new _exception.InvalidArgumentException('Custom seekType specified in config but invalid customSeekHandler!');
        }
        this._seekHandler = new config.customSeekHandler();
      } else {
        throw new _exception.InvalidArgumentException("Invalid seekType in config: ".concat(config.seekType));
      }
    } }, { key: "_selectLoader", value: function _selectLoader()

    {
      if (this._config.customLoader != null) {
        this._loaderClass = this._config.customLoader;
      } else if (this._isWebSocketURL) {
        this._loaderClass = _websocketLoader.default;
      } else if (_fetchStreamLoader.default.isSupported()) {
        this._loaderClass = _fetchStreamLoader.default;
      } else if (_xhrMozChunkedLoader.default.isSupported()) {
        this._loaderClass = _xhrMozChunkedLoader.default;
      } else if (_xhrRangeLoader.default.isSupported()) {
        this._loaderClass = _xhrRangeLoader.default;
      } else {
        throw new _exception.RuntimeException('Your browser doesn\'t support xhr with arraybuffer responseType!');
      }
    } }, { key: "_createLoader", value: function _createLoader()

    {
      this._loader = new this._loaderClass(this._seekHandler, this._config);
      if (this._loader.needStashBuffer === false) {
        this._enableStash = false;
      }
      this._loader.onContentLengthKnown = this._onContentLengthKnown.bind(this);
      this._loader.onURLRedirect = this._onURLRedirect.bind(this);
      this._loader.onDataArrival = this._onLoaderChunkArrival.bind(this);
      this._loader.onComplete = this._onLoaderComplete.bind(this);
      this._loader.onError = this._onLoaderError.bind(this);
    } }, { key: "open", value: function open(

    optionalFrom) {
      this._currentRange = { from: 0, to: -1 };
      if (optionalFrom) {
        this._currentRange.from = optionalFrom;
      }

      this._speedSampler.reset();
      if (!optionalFrom) {
        this._fullRequestFlag = true;
      }

      this._loader.open(this._dataSource, Object.assign({}, this._currentRange));
    } }, { key: "abort", value: function abort()

    {
      this._loader.abort();

      if (this._paused) {
        this._paused = false;
        this._resumeFrom = 0;
      }
    } }, { key: "pause", value: function pause()

    {
      if (this.isWorking()) {
        this._loader.abort();

        if (this._stashUsed !== 0) {
          this._resumeFrom = this._stashByteStart;
          this._currentRange.to = this._stashByteStart - 1;
        } else {
          this._resumeFrom = this._currentRange.to + 1;
        }
        this._stashUsed = 0;
        this._stashByteStart = 0;
        this._paused = true;
      }
    } }, { key: "resume", value: function resume()

    {
      if (this._paused) {
        this._paused = false;
        var bytes = this._resumeFrom;
        this._resumeFrom = 0;
        this._internalSeek(bytes, true);
      }
    } }, { key: "seek", value: function seek(

    bytes) {
      this._paused = false;
      this._stashUsed = 0;
      this._stashByteStart = 0;
      this._internalSeek(bytes, true);
    }

    /**
       * When seeking request is from media seeking, unconsumed stash data should be dropped
       * However, stash data shouldn't be dropped if seeking requested from http reconnection
       *
       * @dropUnconsumed: Ignore and discard all unconsumed data in stash buffer
       */ }, { key: "_internalSeek", value: function _internalSeek(
    bytes, dropUnconsumed) {
      if (this._loader.isWorking()) {
        this._loader.abort();
      }

      // dispatch & flush stash buffer before seek
      this._flushStashBuffer(dropUnconsumed);

      this._loader.destroy();
      this._loader = null;

      var requestRange = { from: bytes, to: -1 };
      this._currentRange = { from: requestRange.from, to: -1 };

      this._speedSampler.reset();
      this._stashSize = this._stashInitialSize;
      this._createLoader();
      this._loader.open(this._dataSource, requestRange);

      if (this._onSeeked) {
        this._onSeeked();
      }
    } }, { key: "updateUrl", value: function updateUrl(

    url) {
      if (!url || typeof url !== 'string' || url.length === 0) {
        throw new _exception.InvalidArgumentException('Url must be a non-empty string!');
      }

      this._dataSource.url = url;

      // TODO: replace with new url
    } }, { key: "_expandBuffer", value: function _expandBuffer(

    expectedBytes) {
      var bufferNewSize = this._stashSize;
      while (bufferNewSize + 1024 * 1024 * 1 < expectedBytes) {
        bufferNewSize *= 2;
      }

      bufferNewSize += 1024 * 1024 * 1; // bufferSize = stashSize + 1MB
      if (bufferNewSize === this._bufferSize) {
        return;
      }

      var newBuffer = new ArrayBuffer(bufferNewSize);

      if (this._stashUsed > 0) {// copy existing data into new buffer
        var stashOldArray = new Uint8Array(this._stashBuffer, 0, this._stashUsed);
        var stashNewArray = new Uint8Array(newBuffer, 0, bufferNewSize);
        stashNewArray.set(stashOldArray, 0);
      }

      this._stashBuffer = newBuffer;
      this._bufferSize = bufferNewSize;
    } }, { key: "_normalizeSpeed", value: function _normalizeSpeed(

    input) {
      var list = this._speedNormalizeList;
      var last = list.length - 1;
      var mid = 0;
      var lbound = 0;
      var ubound = last;

      if (input < list[0]) {
        return list[0];
      }

      // binary search
      while (lbound <= ubound) {
        mid = lbound + Math.floor((ubound - lbound) / 2);
        if (mid === last || input >= list[mid] && input < list[mid + 1]) {
          return list[mid];
        } else if (list[mid] < input) {
          lbound = mid + 1;
        } else {
          ubound = mid - 1;
        }
      }
    } }, { key: "_adjustStashSize", value: function _adjustStashSize(

    normalized) {
      var stashSizeKB = 0;

      if (this._config.isLive) {
        // live stream: always use single normalized speed for size of stashSizeKB
        stashSizeKB = normalized;
      } else {
        if (normalized < 512) {
          stashSizeKB = normalized;
        } else if (normalized >= 512 && normalized <= 1024) {
          stashSizeKB = Math.floor(normalized * 1.5);
        } else {
          stashSizeKB = normalized * 2;
        }
      }

      if (stashSizeKB > 8192) {
        stashSizeKB = 8192;
      }

      var bufferSize = stashSizeKB * 1024 + 1024 * 1024 * 1; // stashSize + 1MB
      if (this._bufferSize < bufferSize) {
        this._expandBuffer(bufferSize);
      }
      this._stashSize = stashSizeKB * 1024;
    } }, { key: "_dispatchChunks", value: function _dispatchChunks(

    chunks, byteStart) {
      this._currentRange.to = byteStart + chunks.byteLength - 1;
      return this._onDataArrival(chunks, byteStart);
    } }, { key: "_onURLRedirect", value: function _onURLRedirect(

    redirectedURL) {
      this._redirectedURL = redirectedURL;
      if (this._onRedirect) {
        this._onRedirect(redirectedURL);
      }
    } }, { key: "_onContentLengthKnown", value: function _onContentLengthKnown(

    contentLength) {
      if (contentLength && this._fullRequestFlag) {
        this._totalLength = contentLength;
        this._fullRequestFlag = false;
      }
    } }, { key: "_onLoaderChunkArrival", value: function _onLoaderChunkArrival(

    chunk, byteStart, receivedLength) {
      if (!this._onDataArrival) {
        throw new _exception.IllegalStateException('IOController: No existing consumer (onDataArrival) callback!');
      }
      if (this._paused) {
        return;
      }
      if (this._isEarlyEofReconnecting) {
        // Auto-reconnect for EarlyEof succeed, notify to upper-layer by callback
        this._isEarlyEofReconnecting = false;
        if (this._onRecoveredEarlyEof) {
          this._onRecoveredEarlyEof();
        }
      }

      this._speedSampler.addBytes(chunk.byteLength);

      // adjust stash buffer size according to network speed dynamically
      var KBps = this._speedSampler.lastSecondKBps;
      if (KBps !== 0) {
        var normalized = this._normalizeSpeed(KBps);
        if (this._speedNormalized !== normalized) {
          this._speedNormalized = normalized;
          this._adjustStashSize(normalized);
        }
      }

      if (!this._enableStash) {// disable stash
        if (this._stashUsed === 0) {
          // dispatch chunk directly to consumer;
          // check ret value (consumed bytes) and stash unconsumed to stashBuffer
          var consumed = this._dispatchChunks(chunk, byteStart);
          if (consumed < chunk.byteLength) {// unconsumed data remain.
            var remain = chunk.byteLength - consumed;
            if (remain > this._bufferSize) {
              this._expandBuffer(remain);
            }
            var stashArray = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
            stashArray.set(new Uint8Array(chunk, consumed), 0);
            this._stashUsed += remain;
            this._stashByteStart = byteStart + consumed;
          }
        } else {
          // else: Merge chunk into stashBuffer, and dispatch stashBuffer to consumer.
          if (this._stashUsed + chunk.byteLength > this._bufferSize) {
            this._expandBuffer(this._stashUsed + chunk.byteLength);
          }
          var _stashArray = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
          _stashArray.set(new Uint8Array(chunk), this._stashUsed);
          this._stashUsed += chunk.byteLength;
          var _consumed = this._dispatchChunks(this._stashBuffer.slice(0, this._stashUsed), this._stashByteStart);
          if (_consumed < this._stashUsed && _consumed > 0) {// unconsumed data remain
            var remainArray = new Uint8Array(this._stashBuffer, _consumed);
            _stashArray.set(remainArray, 0);
          }
          this._stashUsed -= _consumed;
          this._stashByteStart += _consumed;
        }
      } else {// enable stash
        if (this._stashUsed === 0 && this._stashByteStart === 0) {// seeked? or init chunk?
          // This is the first chunk after seek action
          this._stashByteStart = byteStart;
        }
        if (this._stashUsed + chunk.byteLength <= this._stashSize) {
          // just stash
          var _stashArray2 = new Uint8Array(this._stashBuffer, 0, this._stashSize);
          _stashArray2.set(new Uint8Array(chunk), this._stashUsed);
          this._stashUsed += chunk.byteLength;
        } else {// stashUsed + chunkSize > stashSize, size limit exceeded
          var _stashArray3 = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
          if (this._stashUsed > 0) {// There're stash datas in buffer
            // dispatch the whole stashBuffer, and stash remain data
            // then append chunk to stashBuffer (stash)
            var buffer = this._stashBuffer.slice(0, this._stashUsed);
            var _consumed2 = this._dispatchChunks(buffer, this._stashByteStart);
            if (_consumed2 < buffer.byteLength) {
              if (_consumed2 > 0) {
                var _remainArray = new Uint8Array(buffer, _consumed2);
                _stashArray3.set(_remainArray, 0);
                this._stashUsed = _remainArray.byteLength;
                this._stashByteStart += _consumed2;
              }
            } else {
              this._stashUsed = 0;
              this._stashByteStart += _consumed2;
            }
            if (this._stashUsed + chunk.byteLength > this._bufferSize) {
              this._expandBuffer(this._stashUsed + chunk.byteLength);
              _stashArray3 = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
            }
            _stashArray3.set(new Uint8Array(chunk), this._stashUsed);
            this._stashUsed += chunk.byteLength;
          } else {// stash buffer empty, but chunkSize > stashSize (oh, holy shit)
            // dispatch chunk directly and stash remain data
            var _consumed3 = this._dispatchChunks(chunk, byteStart);
            if (_consumed3 < chunk.byteLength) {
              var _remain = chunk.byteLength - _consumed3;
              if (_remain > this._bufferSize) {
                this._expandBuffer(_remain);
                _stashArray3 = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
              }
              _stashArray3.set(new Uint8Array(chunk, _consumed3), 0);
              this._stashUsed += _remain;
              this._stashByteStart = byteStart + _consumed3;
            }
          }
        }
      }
    } }, { key: "_flushStashBuffer", value: function _flushStashBuffer(

    dropUnconsumed) {
      if (this._stashUsed > 0) {
        var buffer = this._stashBuffer.slice(0, this._stashUsed);
        var consumed = this._dispatchChunks(buffer, this._stashByteStart);
        var remain = buffer.byteLength - consumed;

        if (consumed < buffer.byteLength) {
          if (dropUnconsumed) {
            _logger.default.w(this.TAG, "".concat(remain, " bytes unconsumed data remain when flush buffer, dropped"));
          } else {
            if (consumed > 0) {
              var stashArray = new Uint8Array(this._stashBuffer, 0, this._bufferSize);
              var remainArray = new Uint8Array(buffer, consumed);
              stashArray.set(remainArray, 0);
              this._stashUsed = remainArray.byteLength;
              this._stashByteStart += consumed;
            }
            return 0;
          }
        }
        this._stashUsed = 0;
        this._stashByteStart = 0;
        return remain;
      }
      return 0;
    } }, { key: "_onLoaderComplete", value: function _onLoaderComplete(

    from, to) {
      // Force-flush stash buffer, and drop unconsumed data
      this._flushStashBuffer(true);

      if (this._onComplete) {
        this._onComplete(this._extraData);
      }
    } }, { key: "_onLoaderError", value: function _onLoaderError(

    type, data) {
      _logger.default.e(this.TAG, "Loader error, code = ".concat(data.code, ", msg = ").concat(data.msg));

      this._flushStashBuffer(false);

      if (this._isEarlyEofReconnecting) {
        // Auto-reconnect for EarlyEof failed, throw UnrecoverableEarlyEof error to upper-layer
        this._isEarlyEofReconnecting = false;
        type = _loader.LoaderErrors.UNRECOVERABLE_EARLY_EOF;
      }

      switch (type) {
        case _loader.LoaderErrors.EARLY_EOF:{
            if (!this._config.isLive) {
              // Do internal http reconnect if not live stream
              if (this._totalLength) {
                var nextFrom = this._currentRange.to + 1;
                if (nextFrom < this._totalLength) {
                  _logger.default.w(this.TAG, 'Connection lost, trying reconnect...');
                  this._isEarlyEofReconnecting = true;
                  this._internalSeek(nextFrom, false);
                }
                return;
              }
              // else: We don't know totalLength, throw UnrecoverableEarlyEof
            }
            // live stream: throw UnrecoverableEarlyEof error to upper-layer
            type = _loader.LoaderErrors.UNRECOVERABLE_EARLY_EOF;
            break;
          }
        case _loader.LoaderErrors.UNRECOVERABLE_EARLY_EOF:
        case _loader.LoaderErrors.CONNECTING_TIMEOUT:
        case _loader.LoaderErrors.HTTP_STATUS_CODE_INVALID:
        case _loader.LoaderErrors.EXCEPTION:
          break;}


      if (this._onError) {
        this._onError(type, data);
      } else {
        throw new _exception.RuntimeException('IOException: ' + data.msg);
      }
    } }, { key: "status", get: function get() {return this._loader.status;} }, { key: "extraData", get: function get() {return this._extraData;}, set: function set(data) {this._extraData = data;} // prototype: function onDataArrival(chunks: ArrayBuffer, byteStart: number): number
  }, { key: "onDataArrival", get: function get() {return this._onDataArrival;}, set: function set(callback) {this._onDataArrival = callback;} }, { key: "onSeeked", get: function get() {return this._onSeeked;}, set: function set(callback) {this._onSeeked = callback;} // prototype: function onError(type: number, info: {code: number, msg: string}): void
  }, { key: "onError", get: function get() {return this._onError;}, set: function set(callback) {this._onError = callback;} }, { key: "onComplete", get: function get() {return this._onComplete;}, set: function set(callback) {this._onComplete = callback;} }, { key: "onRedirect", get: function get() {return this._onRedirect;}, set: function set(callback) {this._onRedirect = callback;} }, { key: "onRecoveredEarlyEof", get: function get() {return this._onRecoveredEarlyEof;}, set: function set(callback) {this._onRecoveredEarlyEof = callback;} }, { key: "currentURL", get: function get() {return this._dataSource.url;} }, { key: "hasRedirect", get: function get() {return this._redirectedURL != null || this._dataSource.redirectedURL != undefined;} }, { key: "currentRedirectedURL", get: function get() {return this._redirectedURL || this._dataSource.redirectedURL;} // in KB/s
  }, { key: "currentSpeed", get: function get() {if (this._loaderClass === _xhrRangeLoader.default) {// SpeedSampler is inaccuracy if loader is RangeLoader
        return this._loader.currentSpeed;}return this._speedSampler.lastSecondKBps;} }, { key: "loaderType", get: function get() {return this._loader.type;} }]);return IOController;}();var _default = IOController;exports.default = _default;

/***/ }),
/* 115 */
/*!******************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/utils/logger.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _events = _interopRequireDefault(__webpack_require__(/*! events */ 116));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

Log = /*#__PURE__*/function () {function Log() {_classCallCheck(this, Log);}_createClass(Log, null, [{ key: "e", value: function e(

    tag, msg) {
      if (!tag || Log.FORCE_GLOBAL_TAG)
      tag = Log.GLOBAL_TAG;

      var str = "[".concat(tag, "] > ").concat(msg);

      if (Log.ENABLE_CALLBACK) {
        Log.emitter.emit('log', 'error', str);
      }

      if (!Log.ENABLE_ERROR) {
        return;
      }

      if (console.error) {
        console.error(str);
      } else if (console.warn) {
        console.warn(str);
      } else {
        console.log(str);
      }
    } }, { key: "i", value: function i(

    tag, msg) {
      if (!tag || Log.FORCE_GLOBAL_TAG)
      tag = Log.GLOBAL_TAG;

      var str = "[".concat(tag, "] > ").concat(msg);

      if (Log.ENABLE_CALLBACK) {
        Log.emitter.emit('log', 'info', str);
      }

      if (!Log.ENABLE_INFO) {
        return;
      }

      if (console.info) {
        console.info(str);
      } else {
        console.log(str);
      }
    } }, { key: "w", value: function w(

    tag, msg) {
      if (!tag || Log.FORCE_GLOBAL_TAG)
      tag = Log.GLOBAL_TAG;

      var str = "[".concat(tag, "] > ").concat(msg);

      if (Log.ENABLE_CALLBACK) {
        Log.emitter.emit('log', 'warn', str);
      }

      if (!Log.ENABLE_WARN) {
        return;
      }

      if (console.warn) {
        console.warn(str);
      } else {
        console.log(str);
      }
    } }, { key: "d", value: function d(

    tag, msg) {
      if (!tag || Log.FORCE_GLOBAL_TAG)
      tag = Log.GLOBAL_TAG;

      var str = "[".concat(tag, "] > ").concat(msg);

      if (Log.ENABLE_CALLBACK) {
        Log.emitter.emit('log', 'debug', str);
      }

      if (!Log.ENABLE_DEBUG) {
        return;
      }

      if (console.debug) {
        console.debug(str);
      } else {
        console.log(str);
      }
    } }, { key: "v", value: function v(

    tag, msg) {
      if (!tag || Log.FORCE_GLOBAL_TAG)
      tag = Log.GLOBAL_TAG;

      var str = "[".concat(tag, "] > ").concat(msg);

      if (Log.ENABLE_CALLBACK) {
        Log.emitter.emit('log', 'verbose', str);
      }

      if (!Log.ENABLE_VERBOSE) {
        return;
      }

      console.log(str);
    } }]);return Log;}();



Log.GLOBAL_TAG = 'flv.js';
Log.FORCE_GLOBAL_TAG = false;
Log.ENABLE_ERROR = true;
Log.ENABLE_INFO = true;
Log.ENABLE_WARN = true;
Log.ENABLE_DEBUG = true;
Log.ENABLE_VERBOSE = true;

Log.ENABLE_CALLBACK = false;

Log.emitter = new _events.default();var _default =

Log;exports.default = _default;

/***/ }),
/* 116 */
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ }),
/* 117 */
/*!**********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/speed-sampler.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */

// Utility class to calculate realtime network I/O speed
var SpeedSampler = /*#__PURE__*/function () {

  function SpeedSampler() {_classCallCheck(this, SpeedSampler);
    // milliseconds
    this._firstCheckpoint = 0;
    this._lastCheckpoint = 0;
    this._intervalBytes = 0;
    this._totalBytes = 0;
    this._lastSecondBytes = 0;

    // compatibility detection
    if (self.performance && self.performance.now) {
      this._now = self.performance.now.bind(self.performance);
    } else {
      this._now = Date.now;
    }
  }_createClass(SpeedSampler, [{ key: "reset", value: function reset()

    {
      this._firstCheckpoint = this._lastCheckpoint = 0;
      this._totalBytes = this._intervalBytes = 0;
      this._lastSecondBytes = 0;
    } }, { key: "addBytes", value: function addBytes(

    bytes) {
      if (this._firstCheckpoint === 0) {
        this._firstCheckpoint = this._now();
        this._lastCheckpoint = this._firstCheckpoint;
        this._intervalBytes += bytes;
        this._totalBytes += bytes;
      } else if (this._now() - this._lastCheckpoint < 1000) {
        this._intervalBytes += bytes;
        this._totalBytes += bytes;
      } else {// duration >= 1000
        this._lastSecondBytes = this._intervalBytes;
        this._intervalBytes = bytes;
        this._totalBytes += bytes;
        this._lastCheckpoint = this._now();
      }
    } }, { key: "currentKBps", get: function get()

    {
      this.addBytes(0);

      var durationSeconds = (this._now() - this._lastCheckpoint) / 1000;
      if (durationSeconds == 0) durationSeconds = 1;
      return this._intervalBytes / durationSeconds / 1024;
    } }, { key: "lastSecondKBps", get: function get()

    {
      this.addBytes(0);

      if (this._lastSecondBytes !== 0) {
        return this._lastSecondBytes / 1024;
      } else {// lastSecondBytes === 0
        if (this._now() - this._lastCheckpoint >= 500) {
          // if time interval since last checkpoint has exceeded 500ms
          // the speed is nearly accurate
          return this.currentKBps;
        } else {
          // We don't know
          return 0;
        }
      }
    } }, { key: "averageKBps", get: function get()

    {
      var durationSeconds = (this._now() - this._firstCheckpoint) / 1000;
      return this._totalBytes / durationSeconds / 1024;
    } }]);return SpeedSampler;}();var _default =



SpeedSampler;exports.default = _default;

/***/ }),
/* 118 */
/*!***************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/loader.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.BaseLoader = exports.LoaderErrors = exports.LoaderStatus = void 0;

















var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var LoaderStatus = {
  kIdle: 0,
  kConnecting: 1,
  kBuffering: 2,
  kError: 3,
  kComplete: 4 };exports.LoaderStatus = LoaderStatus;


var LoaderErrors = {
  OK: 'OK',
  EXCEPTION: 'Exception',
  HTTP_STATUS_CODE_INVALID: 'HttpStatusCodeInvalid',
  CONNECTING_TIMEOUT: 'ConnectingTimeout',
  EARLY_EOF: 'EarlyEof',
  UNRECOVERABLE_EARLY_EOF: 'UnrecoverableEarlyEof' };


/* Loader has callbacks which have following prototypes:
                                                       *     function onContentLengthKnown(contentLength: number): void
                                                       *     function onURLRedirect(url: string): void
                                                       *     function onDataArrival(chunk: ArrayBuffer, byteStart: number, receivedLength: number): void
                                                       *     function onError(errorType: number, errorInfo: {code: number, msg: string}): void
                                                       *     function onComplete(rangeFrom: number, rangeTo: number): void
                                                       */exports.LoaderErrors = LoaderErrors;var
BaseLoader = /*#__PURE__*/function () {

  function BaseLoader(typeName) {_classCallCheck(this, BaseLoader);
    this._type = typeName || 'undefined';
    this._status = LoaderStatus.kIdle;
    this._needStash = false;
    // callbacks
    this._onContentLengthKnown = null;
    this._onURLRedirect = null;
    this._onDataArrival = null;
    this._onError = null;
    this._onComplete = null;
  }_createClass(BaseLoader, [{ key: "destroy", value: function destroy()

    {
      this._status = LoaderStatus.kIdle;
      this._onContentLengthKnown = null;
      this._onURLRedirect = null;
      this._onDataArrival = null;
      this._onError = null;
      this._onComplete = null;
    } }, { key: "isWorking", value: function isWorking()

    {
      return this._status === LoaderStatus.kConnecting || this._status === LoaderStatus.kBuffering;
    } }, { key: "open",





















































    // pure virtual
    value: function open(dataSource, range) {
      throw new _exception.NotImplementedException('Unimplemented abstract function!');
    } }, { key: "abort", value: function abort()

    {
      throw new _exception.NotImplementedException('Unimplemented abstract function!');
    } }, { key: "type", get: function get() {return this._type;} }, { key: "status", get: function get() {return this._status;} }, { key: "needStashBuffer", get: function get() {return this._needStash;} }, { key: "onContentLengthKnown", get: function get() {return this._onContentLengthKnown;}, set: function set(callback) {this._onContentLengthKnown = callback;} }, { key: "onURLRedirect", get: function get() {return this._onURLRedirect;}, set: function set(callback) {this._onURLRedirect = callback;} }, { key: "onDataArrival", get: function get() {return this._onDataArrival;}, set: function set(callback) {this._onDataArrival = callback;} }, { key: "onError", get: function get() {return this._onError;}, set: function set(callback) {this._onError = callback;} }, { key: "onComplete", get: function get() {return this._onComplete;}, set: function set(callback) {this._onComplete = callback;} }]);return BaseLoader;}();exports.BaseLoader = BaseLoader;

/***/ }),
/* 119 */
/*!*********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/utils/exception.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.NotImplementedException = exports.InvalidArgumentException = exports.IllegalStateException = exports.RuntimeException = void 0;function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */var

RuntimeException = /*#__PURE__*/function () {

  function RuntimeException(message) {_classCallCheck(this, RuntimeException);
    this._message = message;
  }_createClass(RuntimeException, [{ key: "toString", value: function toString()









    {
      return this.name + ': ' + this.message;
    } }, { key: "name", get: function get() {return 'RuntimeException';} }, { key: "message", get: function get() {return this._message;} }]);return RuntimeException;}();exports.RuntimeException = RuntimeException;var



IllegalStateException = /*#__PURE__*/function (_RuntimeException) {_inherits(IllegalStateException, _RuntimeException);

  function IllegalStateException(message) {_classCallCheck(this, IllegalStateException);return _possibleConstructorReturn(this, _getPrototypeOf(IllegalStateException).call(this,
    message));
  }_createClass(IllegalStateException, [{ key: "name", get: function get()

    {
      return 'IllegalStateException';
    } }]);return IllegalStateException;}(RuntimeException);exports.IllegalStateException = IllegalStateException;var



InvalidArgumentException = /*#__PURE__*/function (_RuntimeException2) {_inherits(InvalidArgumentException, _RuntimeException2);

  function InvalidArgumentException(message) {_classCallCheck(this, InvalidArgumentException);return _possibleConstructorReturn(this, _getPrototypeOf(InvalidArgumentException).call(this,
    message));
  }_createClass(InvalidArgumentException, [{ key: "name", get: function get()

    {
      return 'InvalidArgumentException';
    } }]);return InvalidArgumentException;}(RuntimeException);exports.InvalidArgumentException = InvalidArgumentException;var



NotImplementedException = /*#__PURE__*/function (_RuntimeException3) {_inherits(NotImplementedException, _RuntimeException3);

  function NotImplementedException(message) {_classCallCheck(this, NotImplementedException);return _possibleConstructorReturn(this, _getPrototypeOf(NotImplementedException).call(this,
    message));
  }_createClass(NotImplementedException, [{ key: "name", get: function get()

    {
      return 'NotImplementedException';
    } }]);return NotImplementedException;}(RuntimeException);exports.NotImplementedException = NotImplementedException;

/***/ }),
/* 120 */
/*!****************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/fetch-stream-loader.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _browser = _interopRequireDefault(__webpack_require__(/*! ../utils/browser.js */ 121));
var _loader = __webpack_require__(/*! ./loader.js */ 118);
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}

/* fetch + stream IO loader. Currently working on chrome 43+.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * fetch provides a better alternative http API to XMLHttpRequest
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * fetch spec   https://fetch.spec.whatwg.org/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * stream spec  https://streams.spec.whatwg.org/
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    */var
FetchStreamLoader = /*#__PURE__*/function (_BaseLoader) {_inherits(FetchStreamLoader, _BaseLoader);_createClass(FetchStreamLoader, null, [{ key: "isSupported", value: function isSupported()

    {
      try {
        // fetch + stream is broken on Microsoft Edge. Disable before build 15048.
        // see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8196907/
        // Fixed in Jan 10, 2017. Build 15048+ removed from blacklist.
        var isWorkWellEdge = _browser.default.msedge && _browser.default.version.minor >= 15048;
        var browserNotBlacklisted = _browser.default.msedge ? isWorkWellEdge : true;
        return self.fetch && self.ReadableStream && browserNotBlacklisted;
      } catch (e) {
        return false;
      }
    } }]);

  function FetchStreamLoader(seekHandler, config) {var _this;_classCallCheck(this, FetchStreamLoader);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(FetchStreamLoader).call(this, 'fetch-stream-loader'));
    _this.TAG = 'FetchStreamLoader';

    _this._seekHandler = seekHandler;
    _this._config = config;
    _this._needStash = true;

    _this._requestAbort = false;
    _this._contentLength = null;
    _this._receivedLength = 0;return _this;
  }_createClass(FetchStreamLoader, [{ key: "destroy", value: function destroy()

    {
      if (this.isWorking()) {
        this.abort();
      }
      _get(_getPrototypeOf(FetchStreamLoader.prototype), "destroy", this).call(this);
    } }, { key: "open", value: function open(

    dataSource, range) {var _this2 = this;
      this._dataSource = dataSource;
      this._range = range;

      var sourceURL = dataSource.url;
      if (this._config.reuseRedirectedURL && dataSource.redirectedURL != undefined) {
        sourceURL = dataSource.redirectedURL;
      }

      var seekConfig = this._seekHandler.getConfig(sourceURL, range);

      var headers = new self.Headers();

      if (typeof seekConfig.headers === 'object') {
        var configHeaders = seekConfig.headers;
        for (var key in configHeaders) {
          if (configHeaders.hasOwnProperty(key)) {
            headers.append(key, configHeaders[key]);
          }
        }
      }

      var params = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default',
        // The default policy of Fetch API in the whatwg standard
        // Safari incorrectly indicates 'no-referrer' as default policy, fuck it
        referrerPolicy: 'no-referrer-when-downgrade' };


      // add additional headers
      if (typeof this._config.headers === 'object') {
        for (var _key in this._config.headers) {
          headers.append(_key, this._config.headers[_key]);
        }
      }

      // cors is enabled by default
      if (dataSource.cors === false) {
        // no-cors means 'disregard cors policy', which can only be used in ServiceWorker
        params.mode = 'same-origin';
      }

      // withCredentials is disabled by default
      if (dataSource.withCredentials) {
        params.credentials = 'include';
      }

      // referrerPolicy from config
      if (dataSource.referrerPolicy) {
        params.referrerPolicy = dataSource.referrerPolicy;
      }

      this._status = _loader.LoaderStatus.kConnecting;
      self.fetch(seekConfig.url, params).then(function (res) {
        if (_this2._requestAbort) {
          _this2._requestAbort = false;
          _this2._status = _loader.LoaderStatus.kIdle;
          return;
        }
        if (res.ok && res.status >= 200 && res.status <= 299) {
          if (res.url !== seekConfig.url) {
            if (_this2._onURLRedirect) {
              var redirectedURL = _this2._seekHandler.removeURLParameters(res.url);
              _this2._onURLRedirect(redirectedURL);
            }
          }

          var lengthHeader = res.headers.get('Content-Length');
          if (lengthHeader != null) {
            _this2._contentLength = parseInt(lengthHeader);
            if (_this2._contentLength !== 0) {
              if (_this2._onContentLengthKnown) {
                _this2._onContentLengthKnown(_this2._contentLength);
              }
            }
          }

          return _this2._pump.call(_this2, res.body.getReader());
        } else {
          _this2._status = _loader.LoaderStatus.kError;
          if (_this2._onError) {
            _this2._onError(_loader.LoaderErrors.HTTP_STATUS_CODE_INVALID, { code: res.status, msg: res.statusText });
          } else {
            throw new _exception.RuntimeException('FetchStreamLoader: Http code invalid, ' + res.status + ' ' + res.statusText);
          }
        }
      }).catch(function (e) {
        _this2._status = _loader.LoaderStatus.kError;
        if (_this2._onError) {
          _this2._onError(_loader.LoaderErrors.EXCEPTION, { code: -1, msg: e.message });
        } else {
          throw e;
        }
      });
    } }, { key: "abort", value: function abort()

    {
      this._requestAbort = true;
    } }, { key: "_pump", value: function _pump(

    reader) {var _this3 = this; // ReadableStreamReader
      return reader.read().then(function (result) {
        if (result.done) {
          // First check received length
          if (_this3._contentLength !== null && _this3._receivedLength < _this3._contentLength) {
            // Report Early-EOF
            _this3._status = _loader.LoaderStatus.kError;
            var type = _loader.LoaderErrors.EARLY_EOF;
            var info = { code: -1, msg: 'Fetch stream meet Early-EOF' };
            if (_this3._onError) {
              _this3._onError(type, info);
            } else {
              throw new _exception.RuntimeException(info.msg);
            }
          } else {
            // OK. Download complete
            _this3._status = _loader.LoaderStatus.kComplete;
            if (_this3._onComplete) {
              _this3._onComplete(_this3._range.from, _this3._range.from + _this3._receivedLength - 1);
            }
          }
        } else {
          if (_this3._requestAbort === true) {
            _this3._requestAbort = false;
            _this3._status = _loader.LoaderStatus.kComplete;
            return reader.cancel();
          }

          _this3._status = _loader.LoaderStatus.kBuffering;

          var chunk = result.value.buffer;
          var byteStart = _this3._range.from + _this3._receivedLength;
          _this3._receivedLength += chunk.byteLength;

          if (_this3._onDataArrival) {
            _this3._onDataArrival(chunk, byteStart, _this3._receivedLength);
          }

          _this3._pump(reader);
        }
      }).catch(function (e) {
        if (e.code === 11 && _browser.default.msedge) {// InvalidStateError on Microsoft Edge
          // Workaround: Edge may throw InvalidStateError after ReadableStreamReader.cancel() call
          // Ignore the unknown exception.
          // Related issue: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11265202/
          return;
        }

        _this3._status = _loader.LoaderStatus.kError;
        var type = 0;
        var info = null;

        if ((e.code === 19 || e.message === 'network error') && ( // NETWORK_ERR
        _this3._contentLength === null ||
        _this3._contentLength !== null && _this3._receivedLength < _this3._contentLength)) {
          type = _loader.LoaderErrors.EARLY_EOF;
          info = { code: e.code, msg: 'Fetch stream meet Early-EOF' };
        } else {
          type = _loader.LoaderErrors.EXCEPTION;
          info = { code: e.code, msg: e.message };
        }

        if (_this3._onError) {
          _this3._onError(type, info);
        } else {
          throw new _exception.RuntimeException(info.msg);
        }
      });
    } }]);return FetchStreamLoader;}(_loader.BaseLoader);var _default =



FetchStreamLoader;exports.default = _default;

/***/ }),
/* 121 */
/*!*******************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/utils/browser.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /*
                                                                                                      * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                      *
                                                                                                      * @author zheng qian <xqq@xqq.im>
                                                                                                      *
                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                      * You may obtain a copy of the License at
                                                                                                      *
                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                      *
                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                      * See the License for the specific language governing permissions and
                                                                                                      * limitations under the License.
                                                                                                      */

var Browser = {};

function detect() {
  // modified from jquery-browser-plugin

  var ua = self.navigator.userAgent.toLowerCase();

  var match = /(edge)\/([\w.]+)/.exec(ua) ||
  /(opr)[\/]([\w.]+)/.exec(ua) ||
  /(chrome)[ \/]([\w.]+)/.exec(ua) ||
  /(iemobile)[\/]([\w.]+)/.exec(ua) ||
  /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
  /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
  /(webkit)[ \/]([\w.]+)/.exec(ua) ||
  /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
  /(msie) ([\w.]+)/.exec(ua) ||
  ua.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
  ua.indexOf('compatible') < 0 && /(firefox)[ \/]([\w.]+)/.exec(ua) ||
  [];

  var platform_match = /(ipad)/.exec(ua) ||
  /(ipod)/.exec(ua) ||
  /(windows phone)/.exec(ua) ||
  /(iphone)/.exec(ua) ||
  /(kindle)/.exec(ua) ||
  /(android)/.exec(ua) ||
  /(windows)/.exec(ua) ||
  /(mac)/.exec(ua) ||
  /(linux)/.exec(ua) ||
  /(cros)/.exec(ua) ||
  [];

  var matched = {
    browser: match[5] || match[3] || match[1] || '',
    version: match[2] || match[4] || '0',
    majorVersion: match[4] || match[2] || '0',
    platform: platform_match[0] || '' };


  var browser = {};
  if (matched.browser) {
    browser[matched.browser] = true;

    var versionArray = matched.majorVersion.split('.');
    browser.version = {
      major: parseInt(matched.majorVersion, 10),
      string: matched.version };

    if (versionArray.length > 1) {
      browser.version.minor = parseInt(versionArray[1], 10);
    }
    if (versionArray.length > 2) {
      browser.version.build = parseInt(versionArray[2], 10);
    }
  }

  if (matched.platform) {
    browser[matched.platform] = true;
  }

  if (browser.chrome || browser.opr || browser.safari) {
    browser.webkit = true;
  }

  // MSIE. IE11 has 'rv' identifer
  if (browser.rv || browser.iemobile) {
    if (browser.rv) {
      delete browser.rv;
    }
    var msie = 'msie';
    matched.browser = msie;
    browser[msie] = true;
  }

  // Microsoft Edge
  if (browser.edge) {
    delete browser.edge;
    var msedge = 'msedge';
    matched.browser = msedge;
    browser[msedge] = true;
  }

  // Opera 15+
  if (browser.opr) {
    var opera = 'opera';
    matched.browser = opera;
    browser[opera] = true;
  }

  // Stock android browsers are marked as Safari
  if (browser.safari && browser.android) {
    var android = 'android';
    matched.browser = android;
    browser[android] = true;
  }

  browser.name = matched.browser;
  browser.platform = matched.platform;

  for (var key in Browser) {
    if (Browser.hasOwnProperty(key)) {
      delete Browser[key];
    }
  }
  Object.assign(Browser, browser);
}

detect();var _default =

Browser;exports.default = _default;

/***/ }),
/* 122 */
/*!*******************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/xhr-moz-chunked-loader.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _loader = __webpack_require__(/*! ./loader.js */ 118);
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}

// For FireFox browser which supports `xhr.responseType = 'moz-chunked-arraybuffer'`
var MozChunkedLoader = /*#__PURE__*/function (_BaseLoader) {_inherits(MozChunkedLoader, _BaseLoader);_createClass(MozChunkedLoader, null, [{ key: "isSupported", value: function isSupported()

    {
      try {
        var xhr = new XMLHttpRequest();
        // Firefox 37- requires .open() to be called before setting responseType
        xhr.open('GET', 'https://example.com', true);
        xhr.responseType = 'moz-chunked-arraybuffer';
        return xhr.responseType === 'moz-chunked-arraybuffer';
      } catch (e) {
        _logger.default.w('MozChunkedLoader', e.message);
        return false;
      }
    } }]);

  function MozChunkedLoader(seekHandler, config) {var _this;_classCallCheck(this, MozChunkedLoader);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(MozChunkedLoader).call(this, 'xhr-moz-chunked-loader'));
    _this.TAG = 'MozChunkedLoader';

    _this._seekHandler = seekHandler;
    _this._config = config;
    _this._needStash = true;

    _this._xhr = null;
    _this._requestAbort = false;
    _this._contentLength = null;
    _this._receivedLength = 0;return _this;
  }_createClass(MozChunkedLoader, [{ key: "destroy", value: function destroy()

    {
      if (this.isWorking()) {
        this.abort();
      }
      if (this._xhr) {
        this._xhr.onreadystatechange = null;
        this._xhr.onprogress = null;
        this._xhr.onloadend = null;
        this._xhr.onerror = null;
        this._xhr = null;
      }
      _get(_getPrototypeOf(MozChunkedLoader.prototype), "destroy", this).call(this);
    } }, { key: "open", value: function open(

    dataSource, range) {
      this._dataSource = dataSource;
      this._range = range;

      var sourceURL = dataSource.url;
      if (this._config.reuseRedirectedURL && dataSource.redirectedURL != undefined) {
        sourceURL = dataSource.redirectedURL;
      }

      var seekConfig = this._seekHandler.getConfig(sourceURL, range);
      this._requestURL = seekConfig.url;

      var xhr = this._xhr = new XMLHttpRequest();
      xhr.open('GET', seekConfig.url, true);
      xhr.responseType = 'moz-chunked-arraybuffer';
      xhr.onreadystatechange = this._onReadyStateChange.bind(this);
      xhr.onprogress = this._onProgress.bind(this);
      xhr.onloadend = this._onLoadEnd.bind(this);
      xhr.onerror = this._onXhrError.bind(this);

      // cors is auto detected and enabled by xhr

      // withCredentials is disabled by default
      if (dataSource.withCredentials) {
        xhr.withCredentials = true;
      }

      if (typeof seekConfig.headers === 'object') {
        var headers = seekConfig.headers;

        for (var key in headers) {
          if (headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key]);
          }
        }
      }

      // add additional headers
      if (typeof this._config.headers === 'object') {
        var _headers = this._config.headers;

        for (var _key in _headers) {
          if (_headers.hasOwnProperty(_key)) {
            xhr.setRequestHeader(_key, _headers[_key]);
          }
        }
      }

      this._status = _loader.LoaderStatus.kConnecting;
      xhr.send();
    } }, { key: "abort", value: function abort()

    {
      this._requestAbort = true;
      if (this._xhr) {
        this._xhr.abort();
      }
      this._status = _loader.LoaderStatus.kComplete;
    } }, { key: "_onReadyStateChange", value: function _onReadyStateChange(

    e) {
      var xhr = e.target;

      if (xhr.readyState === 2) {// HEADERS_RECEIVED
        if (xhr.responseURL != undefined && xhr.responseURL !== this._requestURL) {
          if (this._onURLRedirect) {
            var redirectedURL = this._seekHandler.removeURLParameters(xhr.responseURL);
            this._onURLRedirect(redirectedURL);
          }
        }

        if (xhr.status !== 0 && (xhr.status < 200 || xhr.status > 299)) {
          this._status = _loader.LoaderStatus.kError;
          if (this._onError) {
            this._onError(_loader.LoaderErrors.HTTP_STATUS_CODE_INVALID, { code: xhr.status, msg: xhr.statusText });
          } else {
            throw new _exception.RuntimeException('MozChunkedLoader: Http code invalid, ' + xhr.status + ' ' + xhr.statusText);
          }
        } else {
          this._status = _loader.LoaderStatus.kBuffering;
        }
      }
    } }, { key: "_onProgress", value: function _onProgress(

    e) {
      if (this._status === _loader.LoaderStatus.kError) {
        // Ignore error response
        return;
      }

      if (this._contentLength === null) {
        if (e.total !== null && e.total !== 0) {
          this._contentLength = e.total;
          if (this._onContentLengthKnown) {
            this._onContentLengthKnown(this._contentLength);
          }
        }
      }

      var chunk = e.target.response;
      var byteStart = this._range.from + this._receivedLength;
      this._receivedLength += chunk.byteLength;

      if (this._onDataArrival) {
        this._onDataArrival(chunk, byteStart, this._receivedLength);
      }
    } }, { key: "_onLoadEnd", value: function _onLoadEnd(

    e) {
      if (this._requestAbort === true) {
        this._requestAbort = false;
        return;
      } else if (this._status === _loader.LoaderStatus.kError) {
        return;
      }

      this._status = _loader.LoaderStatus.kComplete;
      if (this._onComplete) {
        this._onComplete(this._range.from, this._range.from + this._receivedLength - 1);
      }
    } }, { key: "_onXhrError", value: function _onXhrError(

    e) {
      this._status = _loader.LoaderStatus.kError;
      var type = 0;
      var info = null;

      if (this._contentLength && e.loaded < this._contentLength) {
        type = _loader.LoaderErrors.EARLY_EOF;
        info = { code: -1, msg: 'Moz-Chunked stream meet Early-Eof' };
      } else {
        type = _loader.LoaderErrors.EXCEPTION;
        info = { code: -1, msg: e.constructor.name + ' ' + e.type };
      }

      if (this._onError) {
        this._onError(type, info);
      } else {
        throw new _exception.RuntimeException(info.msg);
      }
    } }]);return MozChunkedLoader;}(_loader.BaseLoader);var _default =



MozChunkedLoader;exports.default = _default;

/***/ }),
/* 123 */
/*!****************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/xhr-msstream-loader.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _loader = __webpack_require__(/*! ./loader.js */ 118);
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}

/* Notice: ms-stream may cause IE/Edge browser crash if seek too frequently!!!
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * The browser may crash in wininet.dll. Disable for now.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * For IE11/Edge browser by microsoft which supports `xhr.responseType = 'ms-stream'`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * Notice that ms-stream API sucks. The buffer is always expanding along with downloading.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * We need to abort the xhr if buffer size exceeded limit size (e.g. 16 MiB), then do reconnect.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * in order to release previous ArrayBuffer to avoid memory leak
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * Otherwise, the ArrayBuffer will increase to a terrible size that equals final file size.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    */var
MSStreamLoader = /*#__PURE__*/function (_BaseLoader) {_inherits(MSStreamLoader, _BaseLoader);_createClass(MSStreamLoader, null, [{ key: "isSupported", value: function isSupported()

    {
      try {
        if (typeof self.MSStream === 'undefined' || typeof self.MSStreamReader === 'undefined') {
          return false;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://example.com', true);
        xhr.responseType = 'ms-stream';
        return xhr.responseType === 'ms-stream';
      } catch (e) {
        _logger.default.w('MSStreamLoader', e.message);
        return false;
      }
    } }]);

  function MSStreamLoader(seekHandler, config) {var _this;_classCallCheck(this, MSStreamLoader);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(MSStreamLoader).call(this, 'xhr-msstream-loader'));
    _this.TAG = 'MSStreamLoader';

    _this._seekHandler = seekHandler;
    _this._config = config;
    _this._needStash = true;

    _this._xhr = null;
    _this._reader = null; // MSStreamReader

    _this._totalRange = null;
    _this._currentRange = null;

    _this._currentRequestURL = null;
    _this._currentRedirectedURL = null;

    _this._contentLength = null;
    _this._receivedLength = 0;

    _this._bufferLimit = 16 * 1024 * 1024; // 16MB
    _this._lastTimeBufferSize = 0;
    _this._isReconnecting = false;return _this;
  }_createClass(MSStreamLoader, [{ key: "destroy", value: function destroy()

    {
      if (this.isWorking()) {
        this.abort();
      }
      if (this._reader) {
        this._reader.onprogress = null;
        this._reader.onload = null;
        this._reader.onerror = null;
        this._reader = null;
      }
      if (this._xhr) {
        this._xhr.onreadystatechange = null;
        this._xhr = null;
      }
      _get(_getPrototypeOf(MSStreamLoader.prototype), "destroy", this).call(this);
    } }, { key: "open", value: function open(

    dataSource, range) {
      this._internalOpen(dataSource, range, false);
    } }, { key: "_internalOpen", value: function _internalOpen(

    dataSource, range, isSubrange) {
      this._dataSource = dataSource;

      if (!isSubrange) {
        this._totalRange = range;
      } else {
        this._currentRange = range;
      }

      var sourceURL = dataSource.url;
      if (this._config.reuseRedirectedURL) {
        if (this._currentRedirectedURL != undefined) {
          sourceURL = this._currentRedirectedURL;
        } else if (dataSource.redirectedURL != undefined) {
          sourceURL = dataSource.redirectedURL;
        }
      }

      var seekConfig = this._seekHandler.getConfig(sourceURL, range);
      this._currentRequestURL = seekConfig.url;

      var reader = this._reader = new self.MSStreamReader();
      reader.onprogress = this._msrOnProgress.bind(this);
      reader.onload = this._msrOnLoad.bind(this);
      reader.onerror = this._msrOnError.bind(this);

      var xhr = this._xhr = new XMLHttpRequest();
      xhr.open('GET', seekConfig.url, true);
      xhr.responseType = 'ms-stream';
      xhr.onreadystatechange = this._xhrOnReadyStateChange.bind(this);
      xhr.onerror = this._xhrOnError.bind(this);

      if (dataSource.withCredentials) {
        xhr.withCredentials = true;
      }

      if (typeof seekConfig.headers === 'object') {
        var headers = seekConfig.headers;

        for (var key in headers) {
          if (headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key]);
          }
        }
      }

      // add additional headers
      if (typeof this._config.headers === 'object') {
        var _headers = this._config.headers;

        for (var _key in _headers) {
          if (_headers.hasOwnProperty(_key)) {
            xhr.setRequestHeader(_key, _headers[_key]);
          }
        }
      }

      if (this._isReconnecting) {
        this._isReconnecting = false;
      } else {
        this._status = _loader.LoaderStatus.kConnecting;
      }
      xhr.send();
    } }, { key: "abort", value: function abort()

    {
      this._internalAbort();
      this._status = _loader.LoaderStatus.kComplete;
    } }, { key: "_internalAbort", value: function _internalAbort()

    {
      if (this._reader) {
        if (this._reader.readyState === 1) {// LOADING
          this._reader.abort();
        }
        this._reader.onprogress = null;
        this._reader.onload = null;
        this._reader.onerror = null;
        this._reader = null;
      }
      if (this._xhr) {
        this._xhr.abort();
        this._xhr.onreadystatechange = null;
        this._xhr = null;
      }
    } }, { key: "_xhrOnReadyStateChange", value: function _xhrOnReadyStateChange(

    e) {
      var xhr = e.target;

      if (xhr.readyState === 2) {// HEADERS_RECEIVED
        if (xhr.status >= 200 && xhr.status <= 299) {
          this._status = _loader.LoaderStatus.kBuffering;

          if (xhr.responseURL != undefined) {
            var redirectedURL = this._seekHandler.removeURLParameters(xhr.responseURL);
            if (xhr.responseURL !== this._currentRequestURL && redirectedURL !== this._currentRedirectedURL) {
              this._currentRedirectedURL = redirectedURL;
              if (this._onURLRedirect) {
                this._onURLRedirect(redirectedURL);
              }
            }
          }

          var lengthHeader = xhr.getResponseHeader('Content-Length');
          if (lengthHeader != null && this._contentLength == null) {
            var length = parseInt(lengthHeader);
            if (length > 0) {
              this._contentLength = length;
              if (this._onContentLengthKnown) {
                this._onContentLengthKnown(this._contentLength);
              }
            }
          }
        } else {
          this._status = _loader.LoaderStatus.kError;
          if (this._onError) {
            this._onError(_loader.LoaderErrors.HTTP_STATUS_CODE_INVALID, { code: xhr.status, msg: xhr.statusText });
          } else {
            throw new _exception.RuntimeException('MSStreamLoader: Http code invalid, ' + xhr.status + ' ' + xhr.statusText);
          }
        }
      } else if (xhr.readyState === 3) {// LOADING
        if (xhr.status >= 200 && xhr.status <= 299) {
          this._status = _loader.LoaderStatus.kBuffering;

          var msstream = xhr.response;
          this._reader.readAsArrayBuffer(msstream);
        }
      }
    } }, { key: "_xhrOnError", value: function _xhrOnError(

    e) {
      this._status = _loader.LoaderStatus.kError;
      var type = _loader.LoaderErrors.EXCEPTION;
      var info = { code: -1, msg: e.constructor.name + ' ' + e.type };

      if (this._onError) {
        this._onError(type, info);
      } else {
        throw new _exception.RuntimeException(info.msg);
      }
    } }, { key: "_msrOnProgress", value: function _msrOnProgress(

    e) {
      var reader = e.target;
      var bigbuffer = reader.result;
      if (bigbuffer == null) {// result may be null, workaround for buggy M$
        this._doReconnectIfNeeded();
        return;
      }

      var slice = bigbuffer.slice(this._lastTimeBufferSize);
      this._lastTimeBufferSize = bigbuffer.byteLength;
      var byteStart = this._totalRange.from + this._receivedLength;
      this._receivedLength += slice.byteLength;

      if (this._onDataArrival) {
        this._onDataArrival(slice, byteStart, this._receivedLength);
      }

      if (bigbuffer.byteLength >= this._bufferLimit) {
        _logger.default.v(this.TAG, "MSStream buffer exceeded max size near ".concat(byteStart + slice.byteLength, ", reconnecting..."));
        this._doReconnectIfNeeded();
      }
    } }, { key: "_doReconnectIfNeeded", value: function _doReconnectIfNeeded()

    {
      if (this._contentLength == null || this._receivedLength < this._contentLength) {
        this._isReconnecting = true;
        this._lastTimeBufferSize = 0;
        this._internalAbort();

        var range = {
          from: this._totalRange.from + this._receivedLength,
          to: -1 };

        this._internalOpen(this._dataSource, range, true);
      }
    } }, { key: "_msrOnLoad", value: function _msrOnLoad(

    e) {// actually it is onComplete event
      this._status = _loader.LoaderStatus.kComplete;
      if (this._onComplete) {
        this._onComplete(this._totalRange.from, this._totalRange.from + this._receivedLength - 1);
      }
    } }, { key: "_msrOnError", value: function _msrOnError(

    e) {
      this._status = _loader.LoaderStatus.kError;
      var type = 0;
      var info = null;

      if (this._contentLength && this._receivedLength < this._contentLength) {
        type = _loader.LoaderErrors.EARLY_EOF;
        info = { code: -1, msg: 'MSStream meet Early-Eof' };
      } else {
        type = _loader.LoaderErrors.EARLY_EOF;
        info = { code: -1, msg: e.constructor.name + ' ' + e.type };
      }

      if (this._onError) {
        this._onError(type, info);
      } else {
        throw new _exception.RuntimeException(info.msg);
      }
    } }]);return MSStreamLoader;}(_loader.BaseLoader);var _default =


MSStreamLoader;exports.default = _default;

/***/ }),
/* 124 */
/*!*************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/xhr-range-loader.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _speedSampler = _interopRequireDefault(__webpack_require__(/*! ./speed-sampler.js */ 117));
var _loader = __webpack_require__(/*! ./loader.js */ 118);
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}

// Universal IO Loader, implemented by adding Range header in xhr's request header
var RangeLoader = /*#__PURE__*/function (_BaseLoader) {_inherits(RangeLoader, _BaseLoader);_createClass(RangeLoader, null, [{ key: "isSupported", value: function isSupported()

    {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://example.com', true);
        xhr.responseType = 'arraybuffer';
        return xhr.responseType === 'arraybuffer';
      } catch (e) {
        _logger.default.w('RangeLoader', e.message);
        return false;
      }
    } }]);

  function RangeLoader(seekHandler, config) {var _this;_classCallCheck(this, RangeLoader);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(RangeLoader).call(this, 'xhr-range-loader'));
    _this.TAG = 'RangeLoader';

    _this._seekHandler = seekHandler;
    _this._config = config;
    _this._needStash = false;

    _this._chunkSizeKBList = [
    128, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 5120, 6144, 7168, 8192];

    _this._currentChunkSizeKB = 384;
    _this._currentSpeedNormalized = 0;
    _this._zeroSpeedChunkCount = 0;

    _this._xhr = null;
    _this._speedSampler = new _speedSampler.default();

    _this._requestAbort = false;
    _this._waitForTotalLength = false;
    _this._totalLengthReceived = false;

    _this._currentRequestURL = null;
    _this._currentRedirectedURL = null;
    _this._currentRequestRange = null;
    _this._totalLength = null; // size of the entire file
    _this._contentLength = null; // Content-Length of entire request range
    _this._receivedLength = 0; // total received bytes
    _this._lastTimeLoaded = 0; // received bytes of current request sub-range
    return _this;}_createClass(RangeLoader, [{ key: "destroy", value: function destroy()

    {
      if (this.isWorking()) {
        this.abort();
      }
      if (this._xhr) {
        this._xhr.onreadystatechange = null;
        this._xhr.onprogress = null;
        this._xhr.onload = null;
        this._xhr.onerror = null;
        this._xhr = null;
      }
      _get(_getPrototypeOf(RangeLoader.prototype), "destroy", this).call(this);
    } }, { key: "open", value: function open(





    dataSource, range) {
      this._dataSource = dataSource;
      this._range = range;
      this._status = _loader.LoaderStatus.kConnecting;

      var useRefTotalLength = false;
      if (this._dataSource.filesize != undefined && this._dataSource.filesize !== 0) {
        useRefTotalLength = true;
        this._totalLength = this._dataSource.filesize;
      }

      if (!this._totalLengthReceived && !useRefTotalLength) {
        // We need total filesize
        this._waitForTotalLength = true;
        this._internalOpen(this._dataSource, { from: 0, to: -1 });
      } else {
        // We have filesize, start loading
        this._openSubRange();
      }
    } }, { key: "_openSubRange", value: function _openSubRange()

    {
      var chunkSize = this._currentChunkSizeKB * 1024;

      var from = this._range.from + this._receivedLength;
      var to = from + chunkSize;

      if (this._contentLength != null) {
        if (to - this._range.from >= this._contentLength) {
          to = this._range.from + this._contentLength - 1;
        }
      }

      this._currentRequestRange = { from: from, to: to };
      this._internalOpen(this._dataSource, this._currentRequestRange);
    } }, { key: "_internalOpen", value: function _internalOpen(

    dataSource, range) {
      this._lastTimeLoaded = 0;

      var sourceURL = dataSource.url;
      if (this._config.reuseRedirectedURL) {
        if (this._currentRedirectedURL != undefined) {
          sourceURL = this._currentRedirectedURL;
        } else if (dataSource.redirectedURL != undefined) {
          sourceURL = dataSource.redirectedURL;
        }
      }

      var seekConfig = this._seekHandler.getConfig(sourceURL, range);
      this._currentRequestURL = seekConfig.url;

      var xhr = this._xhr = new XMLHttpRequest();
      xhr.open('GET', seekConfig.url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onreadystatechange = this._onReadyStateChange.bind(this);
      xhr.onprogress = this._onProgress.bind(this);
      xhr.onload = this._onLoad.bind(this);
      xhr.onerror = this._onXhrError.bind(this);

      if (dataSource.withCredentials) {
        xhr.withCredentials = true;
      }

      if (typeof seekConfig.headers === 'object') {
        var headers = seekConfig.headers;

        for (var key in headers) {
          if (headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key]);
          }
        }
      }

      // add additional headers
      if (typeof this._config.headers === 'object') {
        var _headers = this._config.headers;

        for (var _key in _headers) {
          if (_headers.hasOwnProperty(_key)) {
            xhr.setRequestHeader(_key, _headers[_key]);
          }
        }
      }

      xhr.send();
    } }, { key: "abort", value: function abort()

    {
      this._requestAbort = true;
      this._internalAbort();
      this._status = _loader.LoaderStatus.kComplete;
    } }, { key: "_internalAbort", value: function _internalAbort()

    {
      if (this._xhr) {
        this._xhr.onreadystatechange = null;
        this._xhr.onprogress = null;
        this._xhr.onload = null;
        this._xhr.onerror = null;
        this._xhr.abort();
        this._xhr = null;
      }
    } }, { key: "_onReadyStateChange", value: function _onReadyStateChange(

    e) {
      var xhr = e.target;

      if (xhr.readyState === 2) {// HEADERS_RECEIVED
        if (xhr.responseURL != undefined) {// if the browser support this property
          var redirectedURL = this._seekHandler.removeURLParameters(xhr.responseURL);
          if (xhr.responseURL !== this._currentRequestURL && redirectedURL !== this._currentRedirectedURL) {
            this._currentRedirectedURL = redirectedURL;
            if (this._onURLRedirect) {
              this._onURLRedirect(redirectedURL);
            }
          }
        }

        if (xhr.status >= 200 && xhr.status <= 299) {
          if (this._waitForTotalLength) {
            return;
          }
          this._status = _loader.LoaderStatus.kBuffering;
        } else {
          this._status = _loader.LoaderStatus.kError;
          if (this._onError) {
            this._onError(_loader.LoaderErrors.HTTP_STATUS_CODE_INVALID, { code: xhr.status, msg: xhr.statusText });
          } else {
            throw new _exception.RuntimeException('RangeLoader: Http code invalid, ' + xhr.status + ' ' + xhr.statusText);
          }
        }
      }
    } }, { key: "_onProgress", value: function _onProgress(

    e) {
      if (this._status === _loader.LoaderStatus.kError) {
        // Ignore error response
        return;
      }

      if (this._contentLength === null) {
        var openNextRange = false;

        if (this._waitForTotalLength) {
          this._waitForTotalLength = false;
          this._totalLengthReceived = true;
          openNextRange = true;

          var total = e.total;
          this._internalAbort();
          if (total != null & total !== 0) {
            this._totalLength = total;
          }
        }

        // calculate currrent request range's contentLength
        if (this._range.to === -1) {
          this._contentLength = this._totalLength - this._range.from;
        } else {// to !== -1
          this._contentLength = this._range.to - this._range.from + 1;
        }

        if (openNextRange) {
          this._openSubRange();
          return;
        }
        if (this._onContentLengthKnown) {
          this._onContentLengthKnown(this._contentLength);
        }
      }

      var delta = e.loaded - this._lastTimeLoaded;
      this._lastTimeLoaded = e.loaded;
      this._speedSampler.addBytes(delta);
    } }, { key: "_normalizeSpeed", value: function _normalizeSpeed(

    input) {
      var list = this._chunkSizeKBList;
      var last = list.length - 1;
      var mid = 0;
      var lbound = 0;
      var ubound = last;

      if (input < list[0]) {
        return list[0];
      }

      while (lbound <= ubound) {
        mid = lbound + Math.floor((ubound - lbound) / 2);
        if (mid === last || input >= list[mid] && input < list[mid + 1]) {
          return list[mid];
        } else if (list[mid] < input) {
          lbound = mid + 1;
        } else {
          ubound = mid - 1;
        }
      }
    } }, { key: "_onLoad", value: function _onLoad(

    e) {
      if (this._status === _loader.LoaderStatus.kError) {
        // Ignore error response
        return;
      }

      if (this._waitForTotalLength) {
        this._waitForTotalLength = false;
        return;
      }

      this._lastTimeLoaded = 0;
      var KBps = this._speedSampler.lastSecondKBps;
      if (KBps === 0) {
        this._zeroSpeedChunkCount++;
        if (this._zeroSpeedChunkCount >= 3) {
          // Try get currentKBps after 3 chunks
          KBps = this._speedSampler.currentKBps;
        }
      }

      if (KBps !== 0) {
        var normalized = this._normalizeSpeed(KBps);
        if (this._currentSpeedNormalized !== normalized) {
          this._currentSpeedNormalized = normalized;
          this._currentChunkSizeKB = normalized;
        }
      }

      var chunk = e.target.response;
      var byteStart = this._range.from + this._receivedLength;
      this._receivedLength += chunk.byteLength;

      var reportComplete = false;

      if (this._contentLength != null && this._receivedLength < this._contentLength) {
        // continue load next chunk
        this._openSubRange();
      } else {
        reportComplete = true;
      }

      // dispatch received chunk
      if (this._onDataArrival) {
        this._onDataArrival(chunk, byteStart, this._receivedLength);
      }

      if (reportComplete) {
        this._status = _loader.LoaderStatus.kComplete;
        if (this._onComplete) {
          this._onComplete(this._range.from, this._range.from + this._receivedLength - 1);
        }
      }
    } }, { key: "_onXhrError", value: function _onXhrError(

    e) {
      this._status = _loader.LoaderStatus.kError;
      var type = 0;
      var info = null;

      if (this._contentLength && this._receivedLength > 0 &&
      this._receivedLength < this._contentLength) {
        type = _loader.LoaderErrors.EARLY_EOF;
        info = { code: -1, msg: 'RangeLoader meet Early-Eof' };
      } else {
        type = _loader.LoaderErrors.EXCEPTION;
        info = { code: -1, msg: e.constructor.name + ' ' + e.type };
      }

      if (this._onError) {
        this._onError(type, info);
      } else {
        throw new _exception.RuntimeException(info.msg);
      }
    } }, { key: "currentSpeed", get: function get() {return this._speedSampler.lastSecondKBps;} }]);return RangeLoader;}(_loader.BaseLoader);var _default =



RangeLoader;exports.default = _default;

/***/ }),
/* 125 */
/*!*************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/websocket-loader.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _loader = __webpack_require__(/*! ./loader.js */ 118);
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}

// For FLV over WebSocket live stream
var WebSocketLoader = /*#__PURE__*/function (_BaseLoader) {_inherits(WebSocketLoader, _BaseLoader);_createClass(WebSocketLoader, null, [{ key: "isSupported", value: function isSupported()

    {
      try {
        return typeof self.WebSocket !== 'undefined';
      } catch (e) {
        return false;
      }
    } }]);

  function WebSocketLoader() {var _this;_classCallCheck(this, WebSocketLoader);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(WebSocketLoader).call(this, 'websocket-loader'));
    _this.TAG = 'WebSocketLoader';

    _this._needStash = true;

    _this._ws = null;
    _this._requestAbort = false;
    _this._receivedLength = 0;return _this;
  }_createClass(WebSocketLoader, [{ key: "destroy", value: function destroy()

    {
      if (this._ws) {
        this.abort();
      }
      _get(_getPrototypeOf(WebSocketLoader.prototype), "destroy", this).call(this);
    } }, { key: "open", value: function open(

    dataSource) {
      try {
        var ws = this._ws = new self.WebSocket(dataSource.url);
        ws.binaryType = 'arraybuffer';
        ws.onopen = this._onWebSocketOpen.bind(this);
        ws.onclose = this._onWebSocketClose.bind(this);
        ws.onmessage = this._onWebSocketMessage.bind(this);
        ws.onerror = this._onWebSocketError.bind(this);

        this._status = _loader.LoaderStatus.kConnecting;
      } catch (e) {
        this._status = _loader.LoaderStatus.kError;

        var info = { code: e.code, msg: e.message };

        if (this._onError) {
          this._onError(_loader.LoaderErrors.EXCEPTION, info);
        } else {
          throw new _exception.RuntimeException(info.msg);
        }
      }
    } }, { key: "abort", value: function abort()

    {
      var ws = this._ws;
      if (ws && (ws.readyState === 0 || ws.readyState === 1)) {// CONNECTING || OPEN
        this._requestAbort = true;
        ws.close();
      }

      this._ws = null;
      this._status = _loader.LoaderStatus.kComplete;
    } }, { key: "_onWebSocketOpen", value: function _onWebSocketOpen(

    e) {
      this._status = _loader.LoaderStatus.kBuffering;
    } }, { key: "_onWebSocketClose", value: function _onWebSocketClose(

    e) {
      if (this._requestAbort === true) {
        this._requestAbort = false;
        return;
      }

      this._status = _loader.LoaderStatus.kComplete;

      if (this._onComplete) {
        this._onComplete(0, this._receivedLength - 1);
      }
    } }, { key: "_onWebSocketMessage", value: function _onWebSocketMessage(

    e) {var _this2 = this;
      if (e.data instanceof ArrayBuffer) {
        this._dispatchArrayBuffer(e.data);
      } else if (e.data instanceof Blob) {
        var reader = new FileReader();
        reader.onload = function () {
          _this2._dispatchArrayBuffer(reader.result);
        };
        reader.readAsArrayBuffer(e.data);
      } else {
        this._status = _loader.LoaderStatus.kError;
        var info = { code: -1, msg: 'Unsupported WebSocket message type: ' + e.data.constructor.name };

        if (this._onError) {
          this._onError(_loader.LoaderErrors.EXCEPTION, info);
        } else {
          throw new _exception.RuntimeException(info.msg);
        }
      }
    } }, { key: "_dispatchArrayBuffer", value: function _dispatchArrayBuffer(

    arraybuffer) {
      var chunk = arraybuffer;
      var byteStart = this._receivedLength;
      this._receivedLength += chunk.byteLength;

      if (this._onDataArrival) {
        this._onDataArrival(chunk, byteStart, this._receivedLength);
      }
    } }, { key: "_onWebSocketError", value: function _onWebSocketError(

    e) {
      this._status = _loader.LoaderStatus.kError;

      var info = {
        code: e.code,
        msg: e.message };


      if (this._onError) {
        this._onError(_loader.LoaderErrors.EXCEPTION, info);
      } else {
        throw new _exception.RuntimeException(info.msg);
      }
    } }]);return WebSocketLoader;}(_loader.BaseLoader);var _default =



WebSocketLoader;exports.default = _default;

/***/ }),
/* 126 */
/*!***************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/range-seek-handler.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */var

RangeSeekHandler = /*#__PURE__*/function () {

  function RangeSeekHandler(zeroStart) {_classCallCheck(this, RangeSeekHandler);
    this._zeroStart = zeroStart || false;
  }_createClass(RangeSeekHandler, [{ key: "getConfig", value: function getConfig(

    url, range) {
      var headers = {};

      if (range.from !== 0 || range.to !== -1) {
        var param;
        if (range.to !== -1) {
          param = "bytes=".concat(range.from.toString(), "-").concat(range.to.toString());
        } else {
          param = "bytes=".concat(range.from.toString(), "-");
        }
        headers['Range'] = param;
      } else if (this._zeroStart) {
        headers['Range'] = 'bytes=0-';
      }

      return {
        url: url,
        headers: headers };

    } }, { key: "removeURLParameters", value: function removeURLParameters(

    seekedURL) {
      return seekedURL;
    } }]);return RangeSeekHandler;}();var _default =



RangeSeekHandler;exports.default = _default;

/***/ }),
/* 127 */
/*!***************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/io/param-seek-handler.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */var

ParamSeekHandler = /*#__PURE__*/function () {

  function ParamSeekHandler(paramStart, paramEnd) {_classCallCheck(this, ParamSeekHandler);
    this._startName = paramStart;
    this._endName = paramEnd;
  }_createClass(ParamSeekHandler, [{ key: "getConfig", value: function getConfig(

    baseUrl, range) {
      var url = baseUrl;

      if (range.from !== 0 || range.to !== -1) {
        var needAnd = true;
        if (url.indexOf('?') === -1) {
          url += '?';
          needAnd = false;
        }

        if (needAnd) {
          url += '&';
        }

        url += "".concat(this._startName, "=").concat(range.from.toString());

        if (range.to !== -1) {
          url += "&".concat(this._endName, "=").concat(range.to.toString());
        }
      }

      return {
        url: url,
        headers: {} };

    } }, { key: "removeURLParameters", value: function removeURLParameters(

    seekedURL) {
      var baseURL = seekedURL.split('?')[0];
      var params = undefined;

      var queryIndex = seekedURL.indexOf('?');
      if (queryIndex !== -1) {
        params = seekedURL.substring(queryIndex + 1);
      }

      var resultParams = '';

      if (params != undefined && params.length > 0) {
        var pairs = params.split('&');

        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          var requireAnd = i > 0;

          if (pair[0] !== this._startName && pair[0] !== this._endName) {
            if (requireAnd) {
              resultParams += '&';
            }
            resultParams += pairs[i];
          }
        }
      }

      return resultParams.length === 0 ? baseURL : baseURL + '?' + resultParams;
    } }]);return ParamSeekHandler;}();var _default =



ParamSeekHandler;exports.default = _default;

/***/ }),
/* 128 */
/*!************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/config.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createDefaultConfig = createDefaultConfig;exports.defaultConfig = void 0; /*
                                                                                                                                                              * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                              *
                                                                                                                                                              * @author zheng qian <xqq@xqq.im>
                                                                                                                                                              *
                                                                                                                                                              * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                              * you may not use this file except in compliance with the License.
                                                                                                                                                              * You may obtain a copy of the License at
                                                                                                                                                              *
                                                                                                                                                              *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                              *
                                                                                                                                                              * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                              * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                              * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                              * See the License for the specific language governing permissions and
                                                                                                                                                              * limitations under the License.
                                                                                                                                                              */

var defaultConfig = {
  enableWorker: false,
  enableStashBuffer: true,
  stashInitialSize: undefined,

  isLive: false,

  lazyLoad: true,
  lazyLoadMaxDuration: 3 * 60,
  lazyLoadRecoverDuration: 30,
  deferLoadAfterSourceOpen: true,

  // autoCleanupSourceBuffer: default as false, leave unspecified
  autoCleanupMaxBackwardDuration: 3 * 60,
  autoCleanupMinBackwardDuration: 2 * 60,

  statisticsInfoReportInterval: 600,

  fixAudioTimestampGap: true,

  accurateSeek: false,
  seekType: 'range', // [range, param, custom]
  seekParamStart: 'bstart',
  seekParamEnd: 'bend',
  rangeLoadZeroStart: false,
  customSeekHandler: undefined,
  reuseRedirectedURL: false,
  // referrerPolicy: leave as unspecified

  headers: undefined,
  customLoader: undefined };exports.defaultConfig = defaultConfig;


function createDefaultConfig() {
  return Object.assign({}, defaultConfig);
}

/***/ }),
/* 129 */
/*!***********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/player/flv-player.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _events = _interopRequireDefault(__webpack_require__(/*! events */ 116));
var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _browser = _interopRequireDefault(__webpack_require__(/*! ../utils/browser.js */ 121));
var _playerEvents = _interopRequireDefault(__webpack_require__(/*! ./player-events.js */ 130));
var _transmuxer = _interopRequireDefault(__webpack_require__(/*! ../core/transmuxer.js */ 131));
var _transmuxingEvents = _interopRequireDefault(__webpack_require__(/*! ../core/transmuxing-events.js */ 145));
var _mseController = _interopRequireDefault(__webpack_require__(/*! ../core/mse-controller.js */ 147));
var _mseEvents = _interopRequireDefault(__webpack_require__(/*! ../core/mse-events.js */ 148));
var _playerErrors = __webpack_require__(/*! ./player-errors.js */ 149);
var _config = __webpack_require__(/*! ../config.js */ 128);
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

FlvPlayer = /*#__PURE__*/function () {

  function FlvPlayer(mediaDataSource, config) {_classCallCheck(this, FlvPlayer);
    this.TAG = 'FlvPlayer';
    this._type = 'FlvPlayer';
    this._emitter = new _events.default();

    this._config = (0, _config.createDefaultConfig)();
    if (typeof config === 'object') {
      Object.assign(this._config, config);
    }

    if (mediaDataSource.type.toLowerCase() !== 'flv') {
      throw new _exception.InvalidArgumentException('FlvPlayer requires an flv MediaDataSource input!');
    }

    if (mediaDataSource.isLive === true) {
      this._config.isLive = true;
    }

    this.e = {
      onvLoadedMetadata: this._onvLoadedMetadata.bind(this),
      onvSeeking: this._onvSeeking.bind(this),
      onvCanPlay: this._onvCanPlay.bind(this),
      onvStalled: this._onvStalled.bind(this),
      onvProgress: this._onvProgress.bind(this) };


    if (self.performance && self.performance.now) {
      this._now = self.performance.now.bind(self.performance);
    } else {
      this._now = Date.now;
    }

    this._pendingSeekTime = null; // in seconds
    this._requestSetTime = false;
    this._seekpointRecord = null;
    this._progressChecker = null;

    this._mediaDataSource = mediaDataSource;
    this._mediaElement = null;
    this._msectl = null;
    this._transmuxer = null;

    this._mseSourceOpened = false;
    this._hasPendingLoad = false;
    this._receivedCanPlay = false;

    this._mediaInfo = null;
    this._statisticsInfo = null;

    var chromeNeedIDRFix = _browser.default.chrome && (
    _browser.default.version.major < 50 ||
    _browser.default.version.major === 50 && _browser.default.version.build < 2661);
    this._alwaysSeekKeyframe = chromeNeedIDRFix || _browser.default.msedge || _browser.default.msie ? true : false;

    if (this._alwaysSeekKeyframe) {
      this._config.accurateSeek = false;
    }
  }_createClass(FlvPlayer, [{ key: "destroy", value: function destroy()

    {
      if (this._progressChecker != null) {
        window.clearInterval(this._progressChecker);
        this._progressChecker = null;
      }
      if (this._transmuxer) {
        this.unload();
      }
      if (this._mediaElement) {
        this.detachMediaElement();
      }
      this.e = null;
      this._mediaDataSource = null;

      this._emitter.removeAllListeners();
      this._emitter = null;
    } }, { key: "on", value: function on(

    event, listener) {var _this = this;
      if (event === _playerEvents.default.MEDIA_INFO) {
        if (this._mediaInfo != null) {
          Promise.resolve().then(function () {
            _this._emitter.emit(_playerEvents.default.MEDIA_INFO, _this.mediaInfo);
          });
        }
      } else if (event === _playerEvents.default.STATISTICS_INFO) {
        if (this._statisticsInfo != null) {
          Promise.resolve().then(function () {
            _this._emitter.emit(_playerEvents.default.STATISTICS_INFO, _this.statisticsInfo);
          });
        }
      }
      this._emitter.addListener(event, listener);
    } }, { key: "off", value: function off(

    event, listener) {
      this._emitter.removeListener(event, listener);
    } }, { key: "attachMediaElement", value: function attachMediaElement(

    mediaElement) {var _this2 = this;
      this._mediaElement = mediaElement;
      mediaElement.addEventListener('loadedmetadata', this.e.onvLoadedMetadata);
      mediaElement.addEventListener('seeking', this.e.onvSeeking);
      mediaElement.addEventListener('canplay', this.e.onvCanPlay);
      mediaElement.addEventListener('stalled', this.e.onvStalled);
      mediaElement.addEventListener('progress', this.e.onvProgress);

      this._msectl = new _mseController.default(this._config);

      this._msectl.on(_mseEvents.default.UPDATE_END, this._onmseUpdateEnd.bind(this));
      this._msectl.on(_mseEvents.default.BUFFER_FULL, this._onmseBufferFull.bind(this));
      this._msectl.on(_mseEvents.default.SOURCE_OPEN, function () {
        _this2._mseSourceOpened = true;
        if (_this2._hasPendingLoad) {
          _this2._hasPendingLoad = false;
          _this2.load();
        }
      });
      this._msectl.on(_mseEvents.default.ERROR, function (info) {
        _this2._emitter.emit(_playerEvents.default.ERROR,
        _playerErrors.ErrorTypes.MEDIA_ERROR,
        _playerErrors.ErrorDetails.MEDIA_MSE_ERROR,
        info);

      });

      this._msectl.attachMediaElement(mediaElement);

      if (this._pendingSeekTime != null) {
        try {
          mediaElement.currentTime = this._pendingSeekTime;
          this._pendingSeekTime = null;
        } catch (e) {
          // IE11 may throw InvalidStateError if readyState === 0
          // We can defer set currentTime operation after loadedmetadata
        }
      }
    } }, { key: "detachMediaElement", value: function detachMediaElement()

    {
      if (this._mediaElement) {
        this._msectl.detachMediaElement();
        this._mediaElement.removeEventListener('loadedmetadata', this.e.onvLoadedMetadata);
        this._mediaElement.removeEventListener('seeking', this.e.onvSeeking);
        this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
        this._mediaElement.removeEventListener('stalled', this.e.onvStalled);
        this._mediaElement.removeEventListener('progress', this.e.onvProgress);
        this._mediaElement = null;
      }
      if (this._msectl) {
        this._msectl.destroy();
        this._msectl = null;
      }
    } }, { key: "load", value: function load()

    {var _this3 = this;
      if (!this._mediaElement) {
        throw new _exception.IllegalStateException('HTMLMediaElement must be attached before load()!');
      }
      if (this._transmuxer) {
        throw new _exception.IllegalStateException('FlvPlayer.load() has been called, please call unload() first!');
      }
      if (this._hasPendingLoad) {
        return;
      }

      if (this._config.deferLoadAfterSourceOpen && this._mseSourceOpened === false) {
        this._hasPendingLoad = true;
        return;
      }

      if (this._mediaElement.readyState > 0) {
        this._requestSetTime = true;
        // IE11 may throw InvalidStateError if readyState === 0
        this._mediaElement.currentTime = 0;
      }

      this._transmuxer = new _transmuxer.default(this._mediaDataSource, this._config);

      this._transmuxer.on(_transmuxingEvents.default.INIT_SEGMENT, function (type, is) {
        _this3._msectl.appendInitSegment(is);
      });
      this._transmuxer.on(_transmuxingEvents.default.MEDIA_SEGMENT, function (type, ms) {
        _this3._msectl.appendMediaSegment(ms);

        // lazyLoad check
        if (_this3._config.lazyLoad && !_this3._config.isLive) {
          var currentTime = _this3._mediaElement.currentTime;
          if (ms.info.endDts >= (currentTime + _this3._config.lazyLoadMaxDuration) * 1000) {
            if (_this3._progressChecker == null) {
              _logger.default.v(_this3.TAG, 'Maximum buffering duration exceeded, suspend transmuxing task');
              _this3._suspendTransmuxer();
            }
          }
        }
      });
      this._transmuxer.on(_transmuxingEvents.default.LOADING_COMPLETE, function () {
        _this3._msectl.endOfStream();
        _this3._emitter.emit(_playerEvents.default.LOADING_COMPLETE);
      });
      this._transmuxer.on(_transmuxingEvents.default.RECOVERED_EARLY_EOF, function () {
        _this3._emitter.emit(_playerEvents.default.RECOVERED_EARLY_EOF);
      });
      this._transmuxer.on(_transmuxingEvents.default.IO_ERROR, function (detail, info) {
        _this3._emitter.emit(_playerEvents.default.ERROR, _playerErrors.ErrorTypes.NETWORK_ERROR, detail, info);
      });
      this._transmuxer.on(_transmuxingEvents.default.DEMUX_ERROR, function (detail, info) {
        _this3._emitter.emit(_playerEvents.default.ERROR, _playerErrors.ErrorTypes.MEDIA_ERROR, detail, { code: -1, msg: info });
      });
      this._transmuxer.on(_transmuxingEvents.default.MEDIA_INFO, function (mediaInfo) {
        _this3._mediaInfo = mediaInfo;
        _this3._emitter.emit(_playerEvents.default.MEDIA_INFO, Object.assign({}, mediaInfo));
      });
      this._transmuxer.on(_transmuxingEvents.default.METADATA_ARRIVED, function (metadata) {
        _this3._emitter.emit(_playerEvents.default.METADATA_ARRIVED, metadata);
      });
      this._transmuxer.on(_transmuxingEvents.default.SCRIPTDATA_ARRIVED, function (data) {
        _this3._emitter.emit(_playerEvents.default.SCRIPTDATA_ARRIVED, data);
      });
      this._transmuxer.on(_transmuxingEvents.default.STATISTICS_INFO, function (statInfo) {
        _this3._statisticsInfo = _this3._fillStatisticsInfo(statInfo);
        _this3._emitter.emit(_playerEvents.default.STATISTICS_INFO, Object.assign({}, _this3._statisticsInfo));
      });
      this._transmuxer.on(_transmuxingEvents.default.RECOMMEND_SEEKPOINT, function (milliseconds) {
        if (_this3._mediaElement && !_this3._config.accurateSeek) {
          _this3._requestSetTime = true;
          _this3._mediaElement.currentTime = milliseconds / 1000;
        }
      });

      this._transmuxer.open();
    } }, { key: "unload", value: function unload()

    {
      if (this._mediaElement) {
        this._mediaElement.pause();
      }
      if (this._msectl) {
        this._msectl.seek(0);
      }
      if (this._transmuxer) {
        this._transmuxer.close();
        this._transmuxer.destroy();
        this._transmuxer = null;
      }
    } }, { key: "play", value: function play()

    {
      return this._mediaElement.play();
    } }, { key: "pause", value: function pause()

    {
      this._mediaElement.pause();
    } }, { key: "_fillStatisticsInfo", value: function _fillStatisticsInfo(
























































    statInfo) {
      statInfo.playerType = this._type;

      if (!(this._mediaElement instanceof HTMLVideoElement)) {
        return statInfo;
      }

      var hasQualityInfo = true;
      var decoded = 0;
      var dropped = 0;

      if (this._mediaElement.getVideoPlaybackQuality) {
        var quality = this._mediaElement.getVideoPlaybackQuality();
        decoded = quality.totalVideoFrames;
        dropped = quality.droppedVideoFrames;
      } else if (this._mediaElement.webkitDecodedFrameCount != undefined) {
        decoded = this._mediaElement.webkitDecodedFrameCount;
        dropped = this._mediaElement.webkitDroppedFrameCount;
      } else {
        hasQualityInfo = false;
      }

      if (hasQualityInfo) {
        statInfo.decodedFrames = decoded;
        statInfo.droppedFrames = dropped;
      }

      return statInfo;
    } }, { key: "_onmseUpdateEnd", value: function _onmseUpdateEnd()

    {
      if (!this._config.lazyLoad || this._config.isLive) {
        return;
      }

      var buffered = this._mediaElement.buffered;
      var currentTime = this._mediaElement.currentTime;
      var currentRangeStart = 0;
      var currentRangeEnd = 0;

      for (var i = 0; i < buffered.length; i++) {
        var start = buffered.start(i);
        var end = buffered.end(i);
        if (start <= currentTime && currentTime < end) {
          currentRangeStart = start;
          currentRangeEnd = end;
          break;
        }
      }

      if (currentRangeEnd >= currentTime + this._config.lazyLoadMaxDuration && this._progressChecker == null) {
        _logger.default.v(this.TAG, 'Maximum buffering duration exceeded, suspend transmuxing task');
        this._suspendTransmuxer();
      }
    } }, { key: "_onmseBufferFull", value: function _onmseBufferFull()

    {
      _logger.default.v(this.TAG, 'MSE SourceBuffer is full, suspend transmuxing task');
      if (this._progressChecker == null) {
        this._suspendTransmuxer();
      }
    } }, { key: "_suspendTransmuxer", value: function _suspendTransmuxer()

    {
      if (this._transmuxer) {
        this._transmuxer.pause();

        if (this._progressChecker == null) {
          this._progressChecker = window.setInterval(this._checkProgressAndResume.bind(this), 1000);
        }
      }
    } }, { key: "_checkProgressAndResume", value: function _checkProgressAndResume()

    {
      var currentTime = this._mediaElement.currentTime;
      var buffered = this._mediaElement.buffered;

      var needResume = false;

      for (var i = 0; i < buffered.length; i++) {
        var from = buffered.start(i);
        var to = buffered.end(i);
        if (currentTime >= from && currentTime < to) {
          if (currentTime >= to - this._config.lazyLoadRecoverDuration) {
            needResume = true;
          }
          break;
        }
      }

      if (needResume) {
        window.clearInterval(this._progressChecker);
        this._progressChecker = null;
        if (needResume) {
          _logger.default.v(this.TAG, 'Continue loading from paused position');
          this._transmuxer.resume();
        }
      }
    } }, { key: "_isTimepointBuffered", value: function _isTimepointBuffered(

    seconds) {
      var buffered = this._mediaElement.buffered;

      for (var i = 0; i < buffered.length; i++) {
        var from = buffered.start(i);
        var to = buffered.end(i);
        if (seconds >= from && seconds < to) {
          return true;
        }
      }
      return false;
    } }, { key: "_internalSeek", value: function _internalSeek(

    seconds) {
      var directSeek = this._isTimepointBuffered(seconds);

      var directSeekBegin = false;
      var directSeekBeginTime = 0;

      if (seconds < 1.0 && this._mediaElement.buffered.length > 0) {
        var videoBeginTime = this._mediaElement.buffered.start(0);
        if (videoBeginTime < 1.0 && seconds < videoBeginTime || _browser.default.safari) {
          directSeekBegin = true;
          // also workaround for Safari: Seek to 0 may cause video stuck, use 0.1 to avoid
          directSeekBeginTime = _browser.default.safari ? 0.1 : videoBeginTime;
        }
      }

      if (directSeekBegin) {// seek to video begin, set currentTime directly if beginPTS buffered
        this._requestSetTime = true;
        this._mediaElement.currentTime = directSeekBeginTime;
      } else if (directSeek) {// buffered position
        if (!this._alwaysSeekKeyframe) {
          this._requestSetTime = true;
          this._mediaElement.currentTime = seconds;
        } else {
          var idr = this._msectl.getNearestKeyframe(Math.floor(seconds * 1000));
          this._requestSetTime = true;
          if (idr != null) {
            this._mediaElement.currentTime = idr.dts / 1000;
          } else {
            this._mediaElement.currentTime = seconds;
          }
        }
        if (this._progressChecker != null) {
          this._checkProgressAndResume();
        }
      } else {
        if (this._progressChecker != null) {
          window.clearInterval(this._progressChecker);
          this._progressChecker = null;
        }
        this._msectl.seek(seconds);
        this._transmuxer.seek(Math.floor(seconds * 1000)); // in milliseconds
        // no need to set mediaElement.currentTime if non-accurateSeek,
        // just wait for the recommend_seekpoint callback
        if (this._config.accurateSeek) {
          this._requestSetTime = true;
          this._mediaElement.currentTime = seconds;
        }
      }
    } }, { key: "_checkAndApplyUnbufferedSeekpoint", value: function _checkAndApplyUnbufferedSeekpoint()

    {
      if (this._seekpointRecord) {
        if (this._seekpointRecord.recordTime <= this._now() - 100) {
          var target = this._mediaElement.currentTime;
          this._seekpointRecord = null;
          if (!this._isTimepointBuffered(target)) {
            if (this._progressChecker != null) {
              window.clearTimeout(this._progressChecker);
              this._progressChecker = null;
            }
            // .currentTime is consists with .buffered timestamp
            // Chrome/Edge use DTS, while FireFox/Safari use PTS
            this._msectl.seek(target);
            this._transmuxer.seek(Math.floor(target * 1000));
            // set currentTime if accurateSeek, or wait for recommend_seekpoint callback
            if (this._config.accurateSeek) {
              this._requestSetTime = true;
              this._mediaElement.currentTime = target;
            }
          }
        } else {
          window.setTimeout(this._checkAndApplyUnbufferedSeekpoint.bind(this), 50);
        }
      }
    } }, { key: "_checkAndResumeStuckPlayback", value: function _checkAndResumeStuckPlayback(

    stalled) {
      var media = this._mediaElement;
      if (stalled || !this._receivedCanPlay || media.readyState < 2) {// HAVE_CURRENT_DATA
        var buffered = media.buffered;
        if (buffered.length > 0 && media.currentTime < buffered.start(0)) {
          _logger.default.w(this.TAG, "Playback seems stuck at ".concat(media.currentTime, ", seek to ").concat(buffered.start(0)));
          this._requestSetTime = true;
          this._mediaElement.currentTime = buffered.start(0);
          this._mediaElement.removeEventListener('progress', this.e.onvProgress);
        }
      } else {
        // Playback didn't stuck, remove progress event listener
        this._mediaElement.removeEventListener('progress', this.e.onvProgress);
      }
    } }, { key: "_onvLoadedMetadata", value: function _onvLoadedMetadata(

    e) {
      if (this._pendingSeekTime != null) {
        this._mediaElement.currentTime = this._pendingSeekTime;
        this._pendingSeekTime = null;
      }
    } }, { key: "_onvSeeking", value: function _onvSeeking(

    e) {// handle seeking request from browser's progress bar
      var target = this._mediaElement.currentTime;
      var buffered = this._mediaElement.buffered;

      if (this._requestSetTime) {
        this._requestSetTime = false;
        return;
      }

      if (target < 1.0 && buffered.length > 0) {
        // seek to video begin, set currentTime directly if beginPTS buffered
        var videoBeginTime = buffered.start(0);
        if (videoBeginTime < 1.0 && target < videoBeginTime || _browser.default.safari) {
          this._requestSetTime = true;
          // also workaround for Safari: Seek to 0 may cause video stuck, use 0.1 to avoid
          this._mediaElement.currentTime = _browser.default.safari ? 0.1 : videoBeginTime;
          return;
        }
      }

      if (this._isTimepointBuffered(target)) {
        if (this._alwaysSeekKeyframe) {
          var idr = this._msectl.getNearestKeyframe(Math.floor(target * 1000));
          if (idr != null) {
            this._requestSetTime = true;
            this._mediaElement.currentTime = idr.dts / 1000;
          }
        }
        if (this._progressChecker != null) {
          this._checkProgressAndResume();
        }
        return;
      }

      this._seekpointRecord = {
        seekPoint: target,
        recordTime: this._now() };

      window.setTimeout(this._checkAndApplyUnbufferedSeekpoint.bind(this), 50);
    } }, { key: "_onvCanPlay", value: function _onvCanPlay(

    e) {
      this._receivedCanPlay = true;
      this._mediaElement.removeEventListener('canplay', this.e.onvCanPlay);
    } }, { key: "_onvStalled", value: function _onvStalled(

    e) {
      this._checkAndResumeStuckPlayback(true);
    } }, { key: "_onvProgress", value: function _onvProgress(

    e) {
      this._checkAndResumeStuckPlayback();
    } }, { key: "type", get: function get() {return this._type;} }, { key: "buffered", get: function get() {return this._mediaElement.buffered;} }, { key: "duration", get: function get() {return this._mediaElement.duration;} }, { key: "volume", get: function get() {return this._mediaElement.volume;}, set: function set(value) {this._mediaElement.volume = value;} }, { key: "muted", get: function get() {return this._mediaElement.muted;}, set: function set(muted) {this._mediaElement.muted = muted;} }, { key: "currentTime", get: function get() {if (this._mediaElement) {return this._mediaElement.currentTime;}return 0;}, set: function set(seconds) {if (this._mediaElement) {this._internalSeek(seconds);} else {this._pendingSeekTime = seconds;}} }, { key: "mediaInfo", get: function get() {return Object.assign({}, this._mediaInfo);} }, { key: "statisticsInfo", get: function get() {if (this._statisticsInfo == null) {this._statisticsInfo = {};}this._statisticsInfo = this._fillStatisticsInfo(this._statisticsInfo);return Object.assign({}, this._statisticsInfo);} }]);return FlvPlayer;}();var _default =



FlvPlayer;exports.default = _default;

/***/ }),
/* 130 */
/*!**************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/player/player-events.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /*
                                                                                                      * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                      *
                                                                                                      * @author zheng qian <xqq@xqq.im>
                                                                                                      *
                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                      * You may obtain a copy of the License at
                                                                                                      *
                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                      *
                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                      * See the License for the specific language governing permissions and
                                                                                                      * limitations under the License.
                                                                                                      */

var PlayerEvents = {
  ERROR: 'error',
  LOADING_COMPLETE: 'loading_complete',
  RECOVERED_EARLY_EOF: 'recovered_early_eof',
  MEDIA_INFO: 'media_info',
  METADATA_ARRIVED: 'metadata_arrived',
  SCRIPTDATA_ARRIVED: 'scriptdata_arrived',
  STATISTICS_INFO: 'statistics_info' };var _default =


PlayerEvents;exports.default = _default;

/***/ }),
/* 131 */
/*!*********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/core/transmuxer.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _events = _interopRequireDefault(__webpack_require__(/*! events */ 116));
var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _loggingControl = _interopRequireDefault(__webpack_require__(/*! ../utils/logging-control.js */ 132));
var _transmuxingController = _interopRequireDefault(__webpack_require__(/*! ./transmuxing-controller.js */ 133));
var _transmuxingEvents = _interopRequireDefault(__webpack_require__(/*! ./transmuxing-events.js */ 145));
var _transmuxingWorker = _interopRequireDefault(__webpack_require__(/*! ./transmuxing-worker.js */ 146));
var _mediaInfo = _interopRequireDefault(__webpack_require__(/*! ./media-info.js */ 134));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

Transmuxer = /*#__PURE__*/function () {

  function Transmuxer(mediaDataSource, config) {_classCallCheck(this, Transmuxer);
    this.TAG = 'Transmuxer';
    this._emitter = new _events.default();

    if (config.enableWorker && typeof Worker !== 'undefined') {
      try {
        var work = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'webworkify'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
        this._worker = work(_transmuxingWorker.default);
        this._workerDestroying = false;
        this._worker.addEventListener('message', this._onWorkerMessage.bind(this));
        this._worker.postMessage({ cmd: 'init', param: [mediaDataSource, config] });
        this.e = {
          onLoggingConfigChanged: this._onLoggingConfigChanged.bind(this) };

        _loggingControl.default.registerListener(this.e.onLoggingConfigChanged);
        this._worker.postMessage({ cmd: 'logging_config', param: _loggingControl.default.getConfig() });
      } catch (error) {
        _logger.default.e(this.TAG, 'Error while initialize transmuxing worker, fallback to inline transmuxing');
        this._worker = null;
        this._controller = new _transmuxingController.default(mediaDataSource, config);
      }
    } else {
      this._controller = new _transmuxingController.default(mediaDataSource, config);
    }

    if (this._controller) {
      var ctl = this._controller;
      ctl.on(_transmuxingEvents.default.IO_ERROR, this._onIOError.bind(this));
      ctl.on(_transmuxingEvents.default.DEMUX_ERROR, this._onDemuxError.bind(this));
      ctl.on(_transmuxingEvents.default.INIT_SEGMENT, this._onInitSegment.bind(this));
      ctl.on(_transmuxingEvents.default.MEDIA_SEGMENT, this._onMediaSegment.bind(this));
      ctl.on(_transmuxingEvents.default.LOADING_COMPLETE, this._onLoadingComplete.bind(this));
      ctl.on(_transmuxingEvents.default.RECOVERED_EARLY_EOF, this._onRecoveredEarlyEof.bind(this));
      ctl.on(_transmuxingEvents.default.MEDIA_INFO, this._onMediaInfo.bind(this));
      ctl.on(_transmuxingEvents.default.METADATA_ARRIVED, this._onMetaDataArrived.bind(this));
      ctl.on(_transmuxingEvents.default.SCRIPTDATA_ARRIVED, this._onScriptDataArrived.bind(this));
      ctl.on(_transmuxingEvents.default.STATISTICS_INFO, this._onStatisticsInfo.bind(this));
      ctl.on(_transmuxingEvents.default.RECOMMEND_SEEKPOINT, this._onRecommendSeekpoint.bind(this));
    }
  }_createClass(Transmuxer, [{ key: "destroy", value: function destroy()

    {
      if (this._worker) {
        if (!this._workerDestroying) {
          this._workerDestroying = true;
          this._worker.postMessage({ cmd: 'destroy' });
          _loggingControl.default.removeListener(this.e.onLoggingConfigChanged);
          this.e = null;
        }
      } else {
        this._controller.destroy();
        this._controller = null;
      }
      this._emitter.removeAllListeners();
      this._emitter = null;
    } }, { key: "on", value: function on(

    event, listener) {
      this._emitter.addListener(event, listener);
    } }, { key: "off", value: function off(

    event, listener) {
      this._emitter.removeListener(event, listener);
    } }, { key: "hasWorker", value: function hasWorker()

    {
      return this._worker != null;
    } }, { key: "open", value: function open()

    {
      if (this._worker) {
        this._worker.postMessage({ cmd: 'start' });
      } else {
        this._controller.start();
      }
    } }, { key: "close", value: function close()

    {
      if (this._worker) {
        this._worker.postMessage({ cmd: 'stop' });
      } else {
        this._controller.stop();
      }
    } }, { key: "seek", value: function seek(

    milliseconds) {
      if (this._worker) {
        this._worker.postMessage({ cmd: 'seek', param: milliseconds });
      } else {
        this._controller.seek(milliseconds);
      }
    } }, { key: "pause", value: function pause()

    {
      if (this._worker) {
        this._worker.postMessage({ cmd: 'pause' });
      } else {
        this._controller.pause();
      }
    } }, { key: "resume", value: function resume()

    {
      if (this._worker) {
        this._worker.postMessage({ cmd: 'resume' });
      } else {
        this._controller.resume();
      }
    } }, { key: "_onInitSegment", value: function _onInitSegment(

    type, initSegment) {var _this = this;
      // do async invoke
      Promise.resolve().then(function () {
        _this._emitter.emit(_transmuxingEvents.default.INIT_SEGMENT, type, initSegment);
      });
    } }, { key: "_onMediaSegment", value: function _onMediaSegment(

    type, mediaSegment) {var _this2 = this;
      Promise.resolve().then(function () {
        _this2._emitter.emit(_transmuxingEvents.default.MEDIA_SEGMENT, type, mediaSegment);
      });
    } }, { key: "_onLoadingComplete", value: function _onLoadingComplete()

    {var _this3 = this;
      Promise.resolve().then(function () {
        _this3._emitter.emit(_transmuxingEvents.default.LOADING_COMPLETE);
      });
    } }, { key: "_onRecoveredEarlyEof", value: function _onRecoveredEarlyEof()

    {var _this4 = this;
      Promise.resolve().then(function () {
        _this4._emitter.emit(_transmuxingEvents.default.RECOVERED_EARLY_EOF);
      });
    } }, { key: "_onMediaInfo", value: function _onMediaInfo(

    mediaInfo) {var _this5 = this;
      Promise.resolve().then(function () {
        _this5._emitter.emit(_transmuxingEvents.default.MEDIA_INFO, mediaInfo);
      });
    } }, { key: "_onMetaDataArrived", value: function _onMetaDataArrived(

    metadata) {var _this6 = this;
      Promise.resolve().then(function () {
        _this6._emitter.emit(_transmuxingEvents.default.METADATA_ARRIVED, metadata);
      });
    } }, { key: "_onScriptDataArrived", value: function _onScriptDataArrived(

    data) {var _this7 = this;
      Promise.resolve().then(function () {
        _this7._emitter.emit(_transmuxingEvents.default.SCRIPTDATA_ARRIVED, data);
      });
    } }, { key: "_onStatisticsInfo", value: function _onStatisticsInfo(

    statisticsInfo) {var _this8 = this;
      Promise.resolve().then(function () {
        _this8._emitter.emit(_transmuxingEvents.default.STATISTICS_INFO, statisticsInfo);
      });
    } }, { key: "_onIOError", value: function _onIOError(

    type, info) {var _this9 = this;
      Promise.resolve().then(function () {
        _this9._emitter.emit(_transmuxingEvents.default.IO_ERROR, type, info);
      });
    } }, { key: "_onDemuxError", value: function _onDemuxError(

    type, info) {var _this10 = this;
      Promise.resolve().then(function () {
        _this10._emitter.emit(_transmuxingEvents.default.DEMUX_ERROR, type, info);
      });
    } }, { key: "_onRecommendSeekpoint", value: function _onRecommendSeekpoint(

    milliseconds) {var _this11 = this;
      Promise.resolve().then(function () {
        _this11._emitter.emit(_transmuxingEvents.default.RECOMMEND_SEEKPOINT, milliseconds);
      });
    } }, { key: "_onLoggingConfigChanged", value: function _onLoggingConfigChanged(

    config) {
      if (this._worker) {
        this._worker.postMessage({ cmd: 'logging_config', param: config });
      }
    } }, { key: "_onWorkerMessage", value: function _onWorkerMessage(

    e) {
      var message = e.data;
      var data = message.data;

      if (message.msg === 'destroyed' || this._workerDestroying) {
        this._workerDestroying = false;
        this._worker.terminate();
        this._worker = null;
        return;
      }

      switch (message.msg) {
        case _transmuxingEvents.default.INIT_SEGMENT:
        case _transmuxingEvents.default.MEDIA_SEGMENT:
          this._emitter.emit(message.msg, data.type, data.data);
          break;
        case _transmuxingEvents.default.LOADING_COMPLETE:
        case _transmuxingEvents.default.RECOVERED_EARLY_EOF:
          this._emitter.emit(message.msg);
          break;
        case _transmuxingEvents.default.MEDIA_INFO:
          Object.setPrototypeOf(data, _mediaInfo.default.prototype);
          this._emitter.emit(message.msg, data);
          break;
        case _transmuxingEvents.default.METADATA_ARRIVED:
        case _transmuxingEvents.default.SCRIPTDATA_ARRIVED:
        case _transmuxingEvents.default.STATISTICS_INFO:
          this._emitter.emit(message.msg, data);
          break;
        case _transmuxingEvents.default.IO_ERROR:
        case _transmuxingEvents.default.DEMUX_ERROR:
          this._emitter.emit(message.msg, data.type, data.info);
          break;
        case _transmuxingEvents.default.RECOMMEND_SEEKPOINT:
          this._emitter.emit(message.msg, data);
          break;
        case 'logcat_callback':
          _logger.default.emitter.emit('log', data.type, data.logcat);
          break;
        default:
          break;}

    } }]);return Transmuxer;}();var _default =



Transmuxer;exports.default = _default;

/***/ }),
/* 132 */
/*!***************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/utils/logging-control.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _events = _interopRequireDefault(__webpack_require__(/*! events */ 116));
var _logger = _interopRequireDefault(__webpack_require__(/*! ./logger.js */ 115));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

LoggingControl = /*#__PURE__*/function () {function LoggingControl() {_classCallCheck(this, LoggingControl);}_createClass(LoggingControl, null, [{ key: "getConfig", value: function getConfig()

















































































    {
      return {
        globalTag: _logger.default.GLOBAL_TAG,
        forceGlobalTag: _logger.default.FORCE_GLOBAL_TAG,
        enableVerbose: _logger.default.ENABLE_VERBOSE,
        enableDebug: _logger.default.ENABLE_DEBUG,
        enableInfo: _logger.default.ENABLE_INFO,
        enableWarn: _logger.default.ENABLE_WARN,
        enableError: _logger.default.ENABLE_ERROR,
        enableCallback: _logger.default.ENABLE_CALLBACK };

    } }, { key: "applyConfig", value: function applyConfig(

    config) {
      _logger.default.GLOBAL_TAG = config.globalTag;
      _logger.default.FORCE_GLOBAL_TAG = config.forceGlobalTag;
      _logger.default.ENABLE_VERBOSE = config.enableVerbose;
      _logger.default.ENABLE_DEBUG = config.enableDebug;
      _logger.default.ENABLE_INFO = config.enableInfo;
      _logger.default.ENABLE_WARN = config.enableWarn;
      _logger.default.ENABLE_ERROR = config.enableError;
      _logger.default.ENABLE_CALLBACK = config.enableCallback;
    } }, { key: "_notifyChange", value: function _notifyChange()

    {
      var emitter = LoggingControl.emitter;

      if (emitter.listenerCount('change') > 0) {
        var config = LoggingControl.getConfig();
        emitter.emit('change', config);
      }
    } }, { key: "registerListener", value: function registerListener(

    listener) {
      LoggingControl.emitter.addListener('change', listener);
    } }, { key: "removeListener", value: function removeListener(

    listener) {
      LoggingControl.emitter.removeListener('change', listener);
    } }, { key: "addLogListener", value: function addLogListener(

    listener) {
      _logger.default.emitter.addListener('log', listener);
      if (_logger.default.emitter.listenerCount('log') > 0) {
        _logger.default.ENABLE_CALLBACK = true;
        LoggingControl._notifyChange();
      }
    } }, { key: "removeLogListener", value: function removeLogListener(

    listener) {
      _logger.default.emitter.removeListener('log', listener);
      if (_logger.default.emitter.listenerCount('log') === 0) {
        _logger.default.ENABLE_CALLBACK = false;
        LoggingControl._notifyChange();
      }
    } }, { key: "forceGlobalTag", get: function get() {return _logger.default.FORCE_GLOBAL_TAG;}, set: function set(enable) {_logger.default.FORCE_GLOBAL_TAG = enable;LoggingControl._notifyChange();} }, { key: "globalTag", get: function get() {return _logger.default.GLOBAL_TAG;}, set: function set(tag) {_logger.default.GLOBAL_TAG = tag;LoggingControl._notifyChange();} }, { key: "enableAll", get: function get() {return _logger.default.ENABLE_VERBOSE && _logger.default.ENABLE_DEBUG && _logger.default.ENABLE_INFO && _logger.default.ENABLE_WARN && _logger.default.ENABLE_ERROR;}, set: function set(enable) {_logger.default.ENABLE_VERBOSE = enable;_logger.default.ENABLE_DEBUG = enable;_logger.default.ENABLE_INFO = enable;_logger.default.ENABLE_WARN = enable;_logger.default.ENABLE_ERROR = enable;LoggingControl._notifyChange();} }, { key: "enableDebug", get: function get() {return _logger.default.ENABLE_DEBUG;}, set: function set(enable) {_logger.default.ENABLE_DEBUG = enable;LoggingControl._notifyChange();} }, { key: "enableVerbose", get: function get() {return _logger.default.ENABLE_VERBOSE;}, set: function set(enable) {_logger.default.ENABLE_VERBOSE = enable;LoggingControl._notifyChange();} }, { key: "enableInfo", get: function get() {return _logger.default.ENABLE_INFO;}, set: function set(enable) {_logger.default.ENABLE_INFO = enable;LoggingControl._notifyChange();} }, { key: "enableWarn", get: function get() {return _logger.default.ENABLE_WARN;}, set: function set(enable) {_logger.default.ENABLE_WARN = enable;LoggingControl._notifyChange();} }, { key: "enableError", get: function get() {return _logger.default.ENABLE_ERROR;}, set: function set(enable) {_logger.default.ENABLE_ERROR = enable;LoggingControl._notifyChange();} }]);return LoggingControl;}();



LoggingControl.emitter = new _events.default();var _default =

LoggingControl;exports.default = _default;

/***/ }),
/* 133 */
/*!*********************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/core/transmuxing-controller.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _events = _interopRequireDefault(__webpack_require__(/*! events */ 116));
var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _browser = _interopRequireDefault(__webpack_require__(/*! ../utils/browser.js */ 121));
var _mediaInfo = _interopRequireDefault(__webpack_require__(/*! ./media-info.js */ 134));
var _flvDemuxer = _interopRequireDefault(__webpack_require__(/*! ../demux/flv-demuxer.js */ 135));
var _mp4Remuxer = _interopRequireDefault(__webpack_require__(/*! ../remux/mp4-remuxer.js */ 141));
var _demuxErrors = _interopRequireDefault(__webpack_require__(/*! ../demux/demux-errors.js */ 140));
var _ioController = _interopRequireDefault(__webpack_require__(/*! ../io/io-controller.js */ 114));
var _transmuxingEvents = _interopRequireDefault(__webpack_require__(/*! ./transmuxing-events.js */ 145));
var _loader = __webpack_require__(/*! ../io/loader.js */ 118);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

// Transmuxing (IO, Demuxing, Remuxing) controller, with multipart support
var TransmuxingController = /*#__PURE__*/function () {

  function TransmuxingController(mediaDataSource, config) {_classCallCheck(this, TransmuxingController);
    this.TAG = 'TransmuxingController';
    this._emitter = new _events.default();

    this._config = config;

    // treat single part media as multipart media, which has only one segment
    if (!mediaDataSource.segments) {
      mediaDataSource.segments = [{
        duration: mediaDataSource.duration,
        filesize: mediaDataSource.filesize,
        url: mediaDataSource.url }];

    }

    // fill in default IO params if not exists
    if (typeof mediaDataSource.cors !== 'boolean') {
      mediaDataSource.cors = true;
    }
    if (typeof mediaDataSource.withCredentials !== 'boolean') {
      mediaDataSource.withCredentials = false;
    }

    this._mediaDataSource = mediaDataSource;
    this._currentSegmentIndex = 0;
    var totalDuration = 0;

    this._mediaDataSource.segments.forEach(function (segment) {
      // timestampBase for each segment, and calculate total duration
      segment.timestampBase = totalDuration;
      totalDuration += segment.duration;
      // params needed by IOController
      segment.cors = mediaDataSource.cors;
      segment.withCredentials = mediaDataSource.withCredentials;
      // referrer policy control, if exist
      if (config.referrerPolicy) {
        segment.referrerPolicy = config.referrerPolicy;
      }
    });

    if (!isNaN(totalDuration) && this._mediaDataSource.duration !== totalDuration) {
      this._mediaDataSource.duration = totalDuration;
    }

    this._mediaInfo = null;
    this._demuxer = null;
    this._remuxer = null;
    this._ioctl = null;

    this._pendingSeekTime = null;
    this._pendingResolveSeekPoint = null;

    this._statisticsReporter = null;
  }_createClass(TransmuxingController, [{ key: "destroy", value: function destroy()

    {
      this._mediaInfo = null;
      this._mediaDataSource = null;

      if (this._statisticsReporter) {
        this._disableStatisticsReporter();
      }
      if (this._ioctl) {
        this._ioctl.destroy();
        this._ioctl = null;
      }
      if (this._demuxer) {
        this._demuxer.destroy();
        this._demuxer = null;
      }
      if (this._remuxer) {
        this._remuxer.destroy();
        this._remuxer = null;
      }

      this._emitter.removeAllListeners();
      this._emitter = null;
    } }, { key: "on", value: function on(

    event, listener) {
      this._emitter.addListener(event, listener);
    } }, { key: "off", value: function off(

    event, listener) {
      this._emitter.removeListener(event, listener);
    } }, { key: "start", value: function start()

    {
      this._loadSegment(0);
      this._enableStatisticsReporter();
    } }, { key: "_loadSegment", value: function _loadSegment(

    segmentIndex, optionalFrom) {
      this._currentSegmentIndex = segmentIndex;
      var dataSource = this._mediaDataSource.segments[segmentIndex];

      var ioctl = this._ioctl = new _ioController.default(dataSource, this._config, segmentIndex);
      ioctl.onError = this._onIOException.bind(this);
      ioctl.onSeeked = this._onIOSeeked.bind(this);
      ioctl.onComplete = this._onIOComplete.bind(this);
      ioctl.onRedirect = this._onIORedirect.bind(this);
      ioctl.onRecoveredEarlyEof = this._onIORecoveredEarlyEof.bind(this);

      if (optionalFrom) {
        this._demuxer.bindDataSource(this._ioctl);
      } else {
        ioctl.onDataArrival = this._onInitChunkArrival.bind(this);
      }

      ioctl.open(optionalFrom);
    } }, { key: "stop", value: function stop()

    {
      this._internalAbort();
      this._disableStatisticsReporter();
    } }, { key: "_internalAbort", value: function _internalAbort()

    {
      if (this._ioctl) {
        this._ioctl.destroy();
        this._ioctl = null;
      }
    } }, { key: "pause", value: function pause()

    {// take a rest
      if (this._ioctl && this._ioctl.isWorking()) {
        this._ioctl.pause();
        this._disableStatisticsReporter();
      }
    } }, { key: "resume", value: function resume()

    {
      if (this._ioctl && this._ioctl.isPaused()) {
        this._ioctl.resume();
        this._enableStatisticsReporter();
      }
    } }, { key: "seek", value: function seek(

    milliseconds) {
      if (this._mediaInfo == null || !this._mediaInfo.isSeekable()) {
        return;
      }

      var targetSegmentIndex = this._searchSegmentIndexContains(milliseconds);

      if (targetSegmentIndex === this._currentSegmentIndex) {
        // intra-segment seeking
        var segmentInfo = this._mediaInfo.segments[targetSegmentIndex];

        if (segmentInfo == undefined) {
          // current segment loading started, but mediainfo hasn't received yet
          // wait for the metadata loaded, then seek to expected position
          this._pendingSeekTime = milliseconds;
        } else {
          var keyframe = segmentInfo.getNearestKeyframe(milliseconds);
          this._remuxer.seek(keyframe.milliseconds);
          this._ioctl.seek(keyframe.fileposition);
          // Will be resolved in _onRemuxerMediaSegmentArrival()
          this._pendingResolveSeekPoint = keyframe.milliseconds;
        }
      } else {
        // cross-segment seeking
        var targetSegmentInfo = this._mediaInfo.segments[targetSegmentIndex];

        if (targetSegmentInfo == undefined) {
          // target segment hasn't been loaded. We need metadata then seek to expected time
          this._pendingSeekTime = milliseconds;
          this._internalAbort();
          this._remuxer.seek();
          this._remuxer.insertDiscontinuity();
          this._loadSegment(targetSegmentIndex);
          // Here we wait for the metadata loaded, then seek to expected position
        } else {
          // We have target segment's metadata, direct seek to target position
          var _keyframe = targetSegmentInfo.getNearestKeyframe(milliseconds);
          this._internalAbort();
          this._remuxer.seek(milliseconds);
          this._remuxer.insertDiscontinuity();
          this._demuxer.resetMediaInfo();
          this._demuxer.timestampBase = this._mediaDataSource.segments[targetSegmentIndex].timestampBase;
          this._loadSegment(targetSegmentIndex, _keyframe.fileposition);
          this._pendingResolveSeekPoint = _keyframe.milliseconds;
          this._reportSegmentMediaInfo(targetSegmentIndex);
        }
      }

      this._enableStatisticsReporter();
    } }, { key: "_searchSegmentIndexContains", value: function _searchSegmentIndexContains(

    milliseconds) {
      var segments = this._mediaDataSource.segments;
      var idx = segments.length - 1;

      for (var i = 0; i < segments.length; i++) {
        if (milliseconds < segments[i].timestampBase) {
          idx = i - 1;
          break;
        }
      }
      return idx;
    } }, { key: "_onInitChunkArrival", value: function _onInitChunkArrival(

    data, byteStart) {var _this = this;
      var probeData = null;
      var consumed = 0;

      if (byteStart > 0) {
        // IOController seeked immediately after opened, byteStart > 0 callback may received
        this._demuxer.bindDataSource(this._ioctl);
        this._demuxer.timestampBase = this._mediaDataSource.segments[this._currentSegmentIndex].timestampBase;

        consumed = this._demuxer.parseChunks(data, byteStart);
      } else if ((probeData = _flvDemuxer.default.probe(data)).match) {
        // Always create new FLVDemuxer
        this._demuxer = new _flvDemuxer.default(probeData, this._config);

        if (!this._remuxer) {
          this._remuxer = new _mp4Remuxer.default(this._config);
        }

        var mds = this._mediaDataSource;
        if (mds.duration != undefined && !isNaN(mds.duration)) {
          this._demuxer.overridedDuration = mds.duration;
        }
        if (typeof mds.hasAudio === 'boolean') {
          this._demuxer.overridedHasAudio = mds.hasAudio;
        }
        if (typeof mds.hasVideo === 'boolean') {
          this._demuxer.overridedHasVideo = mds.hasVideo;
        }

        this._demuxer.timestampBase = mds.segments[this._currentSegmentIndex].timestampBase;

        this._demuxer.onError = this._onDemuxException.bind(this);
        this._demuxer.onMediaInfo = this._onMediaInfo.bind(this);
        this._demuxer.onMetaDataArrived = this._onMetaDataArrived.bind(this);
        this._demuxer.onScriptDataArrived = this._onScriptDataArrived.bind(this);

        this._remuxer.bindDataSource(this._demuxer.
        bindDataSource(this._ioctl));


        this._remuxer.onInitSegment = this._onRemuxerInitSegmentArrival.bind(this);
        this._remuxer.onMediaSegment = this._onRemuxerMediaSegmentArrival.bind(this);

        consumed = this._demuxer.parseChunks(data, byteStart);
      } else {
        probeData = null;
        _logger.default.e(this.TAG, 'Non-FLV, Unsupported media type!');
        Promise.resolve().then(function () {
          _this._internalAbort();
        });
        this._emitter.emit(_transmuxingEvents.default.DEMUX_ERROR, _demuxErrors.default.FORMAT_UNSUPPORTED, 'Non-FLV, Unsupported media type');

        consumed = 0;
      }

      return consumed;
    } }, { key: "_onMediaInfo", value: function _onMediaInfo(

    mediaInfo) {var _this2 = this;
      if (this._mediaInfo == null) {
        // Store first segment's mediainfo as global mediaInfo
        this._mediaInfo = Object.assign({}, mediaInfo);
        this._mediaInfo.keyframesIndex = null;
        this._mediaInfo.segments = [];
        this._mediaInfo.segmentCount = this._mediaDataSource.segments.length;
        Object.setPrototypeOf(this._mediaInfo, _mediaInfo.default.prototype);
      }

      var segmentInfo = Object.assign({}, mediaInfo);
      Object.setPrototypeOf(segmentInfo, _mediaInfo.default.prototype);
      this._mediaInfo.segments[this._currentSegmentIndex] = segmentInfo;

      // notify mediaInfo update
      this._reportSegmentMediaInfo(this._currentSegmentIndex);

      if (this._pendingSeekTime != null) {
        Promise.resolve().then(function () {
          var target = _this2._pendingSeekTime;
          _this2._pendingSeekTime = null;
          _this2.seek(target);
        });
      }
    } }, { key: "_onMetaDataArrived", value: function _onMetaDataArrived(

    metadata) {
      this._emitter.emit(_transmuxingEvents.default.METADATA_ARRIVED, metadata);
    } }, { key: "_onScriptDataArrived", value: function _onScriptDataArrived(

    data) {
      this._emitter.emit(_transmuxingEvents.default.SCRIPTDATA_ARRIVED, data);
    } }, { key: "_onIOSeeked", value: function _onIOSeeked()

    {
      this._remuxer.insertDiscontinuity();
    } }, { key: "_onIOComplete", value: function _onIOComplete(

    extraData) {
      var segmentIndex = extraData;
      var nextSegmentIndex = segmentIndex + 1;

      if (nextSegmentIndex < this._mediaDataSource.segments.length) {
        this._internalAbort();
        this._remuxer.flushStashedSamples();
        this._loadSegment(nextSegmentIndex);
      } else {
        this._remuxer.flushStashedSamples();
        this._emitter.emit(_transmuxingEvents.default.LOADING_COMPLETE);
        this._disableStatisticsReporter();
      }
    } }, { key: "_onIORedirect", value: function _onIORedirect(

    redirectedURL) {
      var segmentIndex = this._ioctl.extraData;
      this._mediaDataSource.segments[segmentIndex].redirectedURL = redirectedURL;
    } }, { key: "_onIORecoveredEarlyEof", value: function _onIORecoveredEarlyEof()

    {
      this._emitter.emit(_transmuxingEvents.default.RECOVERED_EARLY_EOF);
    } }, { key: "_onIOException", value: function _onIOException(

    type, info) {
      _logger.default.e(this.TAG, "IOException: type = ".concat(type, ", code = ").concat(info.code, ", msg = ").concat(info.msg));
      this._emitter.emit(_transmuxingEvents.default.IO_ERROR, type, info);
      this._disableStatisticsReporter();
    } }, { key: "_onDemuxException", value: function _onDemuxException(

    type, info) {
      _logger.default.e(this.TAG, "DemuxException: type = ".concat(type, ", info = ").concat(info));
      this._emitter.emit(_transmuxingEvents.default.DEMUX_ERROR, type, info);
    } }, { key: "_onRemuxerInitSegmentArrival", value: function _onRemuxerInitSegmentArrival(

    type, initSegment) {
      this._emitter.emit(_transmuxingEvents.default.INIT_SEGMENT, type, initSegment);
    } }, { key: "_onRemuxerMediaSegmentArrival", value: function _onRemuxerMediaSegmentArrival(

    type, mediaSegment) {
      if (this._pendingSeekTime != null) {
        // Media segments after new-segment cross-seeking should be dropped.
        return;
      }
      this._emitter.emit(_transmuxingEvents.default.MEDIA_SEGMENT, type, mediaSegment);

      // Resolve pending seekPoint
      if (this._pendingResolveSeekPoint != null && type === 'video') {
        var syncPoints = mediaSegment.info.syncPoints;
        var seekpoint = this._pendingResolveSeekPoint;
        this._pendingResolveSeekPoint = null;

        // Safari: Pass PTS for recommend_seekpoint
        if (_browser.default.safari && syncPoints.length > 0 && syncPoints[0].originalDts === seekpoint) {
          seekpoint = syncPoints[0].pts;
        }
        // else: use original DTS (keyframe.milliseconds)

        this._emitter.emit(_transmuxingEvents.default.RECOMMEND_SEEKPOINT, seekpoint);
      }
    } }, { key: "_enableStatisticsReporter", value: function _enableStatisticsReporter()

    {
      if (this._statisticsReporter == null) {
        this._statisticsReporter = self.setInterval(
        this._reportStatisticsInfo.bind(this),
        this._config.statisticsInfoReportInterval);
      }
    } }, { key: "_disableStatisticsReporter", value: function _disableStatisticsReporter()

    {
      if (this._statisticsReporter) {
        self.clearInterval(this._statisticsReporter);
        this._statisticsReporter = null;
      }
    } }, { key: "_reportSegmentMediaInfo", value: function _reportSegmentMediaInfo(

    segmentIndex) {
      var segmentInfo = this._mediaInfo.segments[segmentIndex];
      var exportInfo = Object.assign({}, segmentInfo);

      exportInfo.duration = this._mediaInfo.duration;
      exportInfo.segmentCount = this._mediaInfo.segmentCount;
      delete exportInfo.segments;
      delete exportInfo.keyframesIndex;

      this._emitter.emit(_transmuxingEvents.default.MEDIA_INFO, exportInfo);
    } }, { key: "_reportStatisticsInfo", value: function _reportStatisticsInfo()

    {
      var info = {};

      info.url = this._ioctl.currentURL;
      info.hasRedirect = this._ioctl.hasRedirect;
      if (info.hasRedirect) {
        info.redirectedURL = this._ioctl.currentRedirectedURL;
      }

      info.speed = this._ioctl.currentSpeed;
      info.loaderType = this._ioctl.loaderType;
      info.currentSegmentIndex = this._currentSegmentIndex;
      info.totalSegmentCount = this._mediaDataSource.segments.length;

      this._emitter.emit(_transmuxingEvents.default.STATISTICS_INFO, info);
    } }]);return TransmuxingController;}();var _default =



TransmuxingController;exports.default = _default;

/***/ }),
/* 134 */
/*!*********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/core/media-info.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */var

MediaInfo = /*#__PURE__*/function () {

  function MediaInfo() {_classCallCheck(this, MediaInfo);
    this.mimeType = null;
    this.duration = null;

    this.hasAudio = null;
    this.hasVideo = null;
    this.audioCodec = null;
    this.videoCodec = null;
    this.audioDataRate = null;
    this.videoDataRate = null;

    this.audioSampleRate = null;
    this.audioChannelCount = null;

    this.width = null;
    this.height = null;
    this.fps = null;
    this.profile = null;
    this.level = null;
    this.refFrames = null;
    this.chromaFormat = null;
    this.sarNum = null;
    this.sarDen = null;

    this.metadata = null;
    this.segments = null; // MediaInfo[]
    this.segmentCount = null;
    this.hasKeyframesIndex = null;
    this.keyframesIndex = null;
  }_createClass(MediaInfo, [{ key: "isComplete", value: function isComplete()

    {
      var audioInfoComplete = this.hasAudio === false ||
      this.hasAudio === true &&
      this.audioCodec != null &&
      this.audioSampleRate != null &&
      this.audioChannelCount != null;

      var videoInfoComplete = this.hasVideo === false ||
      this.hasVideo === true &&
      this.videoCodec != null &&
      this.width != null &&
      this.height != null &&
      this.fps != null &&
      this.profile != null &&
      this.level != null &&
      this.refFrames != null &&
      this.chromaFormat != null &&
      this.sarNum != null &&
      this.sarDen != null;

      // keyframesIndex may not be present
      return this.mimeType != null &&
      this.duration != null &&
      this.metadata != null &&
      this.hasKeyframesIndex != null &&
      audioInfoComplete &&
      videoInfoComplete;
    } }, { key: "isSeekable", value: function isSeekable()

    {
      return this.hasKeyframesIndex === true;
    } }, { key: "getNearestKeyframe", value: function getNearestKeyframe(

    milliseconds) {
      if (this.keyframesIndex == null) {
        return null;
      }

      var table = this.keyframesIndex;
      var keyframeIdx = this._search(table.times, milliseconds);

      return {
        index: keyframeIdx,
        milliseconds: table.times[keyframeIdx],
        fileposition: table.filepositions[keyframeIdx] };

    } }, { key: "_search", value: function _search(

    list, value) {
      var idx = 0;

      var last = list.length - 1;
      var mid = 0;
      var lbound = 0;
      var ubound = last;

      if (value < list[0]) {
        idx = 0;
        lbound = ubound + 1; // skip search
      }

      while (lbound <= ubound) {
        mid = lbound + Math.floor((ubound - lbound) / 2);
        if (mid === last || value >= list[mid] && value < list[mid + 1]) {
          idx = mid;
          break;
        } else if (list[mid] < value) {
          lbound = mid + 1;
        } else {
          ubound = mid - 1;
        }
      }

      return idx;
    } }]);return MediaInfo;}();var _default =



MediaInfo;exports.default = _default;

/***/ }),
/* 135 */
/*!***********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/demux/flv-demuxer.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _amfParser = _interopRequireDefault(__webpack_require__(/*! ./amf-parser.js */ 136));
var _spsParser = _interopRequireDefault(__webpack_require__(/*! ./sps-parser.js */ 138));
var _demuxErrors = _interopRequireDefault(__webpack_require__(/*! ./demux-errors.js */ 140));
var _mediaInfo = _interopRequireDefault(__webpack_require__(/*! ../core/media-info.js */ 134));
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

function Swap16(src) {
  return src >>> 8 & 0xFF |
  (src & 0xFF) << 8;
}

function Swap32(src) {
  return (src & 0xFF000000) >>> 24 |
  (src & 0x00FF0000) >>> 8 |
  (src & 0x0000FF00) << 8 |
  (src & 0x000000FF) << 24;
}

function ReadBig32(array, index) {
  return array[index] << 24 |
  array[index + 1] << 16 |
  array[index + 2] << 8 |
  array[index + 3];
}var


FLVDemuxer = /*#__PURE__*/function () {

  function FLVDemuxer(probeData, config) {_classCallCheck(this, FLVDemuxer);
    this.TAG = 'FLVDemuxer';

    this._config = config;

    this._onError = null;
    this._onMediaInfo = null;
    this._onMetaDataArrived = null;
    this._onScriptDataArrived = null;
    this._onTrackMetadata = null;
    this._onDataAvailable = null;

    this._dataOffset = probeData.dataOffset;
    this._firstParse = true;
    this._dispatch = false;

    this._hasAudio = probeData.hasAudioTrack;
    this._hasVideo = probeData.hasVideoTrack;

    this._hasAudioFlagOverrided = false;
    this._hasVideoFlagOverrided = false;

    this._audioInitialMetadataDispatched = false;
    this._videoInitialMetadataDispatched = false;

    this._mediaInfo = new _mediaInfo.default();
    this._mediaInfo.hasAudio = this._hasAudio;
    this._mediaInfo.hasVideo = this._hasVideo;
    this._metadata = null;
    this._audioMetadata = null;
    this._videoMetadata = null;

    this._naluLengthSize = 4;
    this._timestampBase = 0; // int32, in milliseconds
    this._timescale = 1000;
    this._duration = 0; // int32, in milliseconds
    this._durationOverrided = false;
    this._referenceFrameRate = {
      fixed: true,
      fps: 23.976,
      fps_num: 23976,
      fps_den: 1000 };


    this._flvSoundRateTable = [5500, 11025, 22050, 44100, 48000];

    this._mpegSamplingRates = [
    96000, 88200, 64000, 48000, 44100, 32000,
    24000, 22050, 16000, 12000, 11025, 8000, 7350];


    this._mpegAudioV10SampleRateTable = [44100, 48000, 32000, 0];
    this._mpegAudioV20SampleRateTable = [22050, 24000, 16000, 0];
    this._mpegAudioV25SampleRateTable = [11025, 12000, 8000, 0];

    this._mpegAudioL1BitRateTable = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, -1];
    this._mpegAudioL2BitRateTable = [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, -1];
    this._mpegAudioL3BitRateTable = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1];

    this._videoTrack = { type: 'video', id: 1, sequenceNumber: 0, samples: [], length: 0 };
    this._audioTrack = { type: 'audio', id: 2, sequenceNumber: 0, samples: [], length: 0 };

    this._littleEndian = function () {
      var buf = new ArrayBuffer(2);
      new DataView(buf).setInt16(0, 256, true); // little-endian write
      return new Int16Array(buf)[0] === 256; // platform-spec read, if equal then LE
    }();
  }_createClass(FLVDemuxer, [{ key: "destroy", value: function destroy()

    {
      this._mediaInfo = null;
      this._metadata = null;
      this._audioMetadata = null;
      this._videoMetadata = null;
      this._videoTrack = null;
      this._audioTrack = null;

      this._onError = null;
      this._onMediaInfo = null;
      this._onMetaDataArrived = null;
      this._onScriptDataArrived = null;
      this._onTrackMetadata = null;
      this._onDataAvailable = null;
    } }, { key: "bindDataSource", value: function bindDataSource(



























    loader) {
      loader.onDataArrival = this.parseChunks.bind(this);
      return this;
    }

    // prototype: function(type: string, metadata: any): void
  }, { key: "resetMediaInfo", value: function resetMediaInfo()




















































































    {
      this._mediaInfo = new _mediaInfo.default();
    } }, { key: "_isInitialMetadataDispatched", value: function _isInitialMetadataDispatched()

    {
      if (this._hasAudio && this._hasVideo) {// both audio & video
        return this._audioInitialMetadataDispatched && this._videoInitialMetadataDispatched;
      }
      if (this._hasAudio && !this._hasVideo) {// audio only
        return this._audioInitialMetadataDispatched;
      }
      if (!this._hasAudio && this._hasVideo) {// video only
        return this._videoInitialMetadataDispatched;
      }
      return false;
    }

    // function parseChunks(chunk: ArrayBuffer, byteStart: number): number;
  }, { key: "parseChunks", value: function parseChunks(chunk, byteStart) {
      if (!this._onError || !this._onMediaInfo || !this._onTrackMetadata || !this._onDataAvailable) {
        throw new _exception.IllegalStateException('Flv: onError & onMediaInfo & onTrackMetadata & onDataAvailable callback must be specified');
      }

      var offset = 0;
      var le = this._littleEndian;

      if (byteStart === 0) {// buffer with FLV header
        if (chunk.byteLength > 13) {
          var probeData = FLVDemuxer.probe(chunk);
          offset = probeData.dataOffset;
        } else {
          return 0;
        }
      }

      if (this._firstParse) {// handle PreviousTagSize0 before Tag1
        this._firstParse = false;
        if (byteStart + offset !== this._dataOffset) {
          _logger.default.w(this.TAG, 'First time parsing but chunk byteStart invalid!');
        }

        var v = new DataView(chunk, offset);
        var prevTagSize0 = v.getUint32(0, !le);
        if (prevTagSize0 !== 0) {
          _logger.default.w(this.TAG, 'PrevTagSize0 !== 0 !!!');
        }
        offset += 4;
      }

      while (offset < chunk.byteLength) {
        this._dispatch = true;

        var _v = new DataView(chunk, offset);

        if (offset + 11 + 4 > chunk.byteLength) {
          // data not enough for parsing an flv tag
          break;
        }

        var tagType = _v.getUint8(0);
        var dataSize = _v.getUint32(0, !le) & 0x00FFFFFF;

        if (offset + 11 + dataSize + 4 > chunk.byteLength) {
          // data not enough for parsing actual data body
          break;
        }

        if (tagType !== 8 && tagType !== 9 && tagType !== 18) {
          _logger.default.w(this.TAG, "Unsupported tag type ".concat(tagType, ", skipped"));
          // consume the whole tag (skip it)
          offset += 11 + dataSize + 4;
          continue;
        }

        var ts2 = _v.getUint8(4);
        var ts1 = _v.getUint8(5);
        var ts0 = _v.getUint8(6);
        var ts3 = _v.getUint8(7);

        var timestamp = ts0 | ts1 << 8 | ts2 << 16 | ts3 << 24;

        var streamId = _v.getUint32(7, !le) & 0x00FFFFFF;
        if (streamId !== 0) {
          _logger.default.w(this.TAG, 'Meet tag which has StreamID != 0!');
        }

        var dataOffset = offset + 11;

        switch (tagType) {
          case 8: // Audio
            this._parseAudioData(chunk, dataOffset, dataSize, timestamp);
            break;
          case 9: // Video
            this._parseVideoData(chunk, dataOffset, dataSize, timestamp, byteStart + offset);
            break;
          case 18: // ScriptDataObject
            this._parseScriptData(chunk, dataOffset, dataSize);
            break;}


        var prevTagSize = _v.getUint32(11 + dataSize, !le);
        if (prevTagSize !== 11 + dataSize) {
          _logger.default.w(this.TAG, "Invalid PrevTagSize ".concat(prevTagSize));
        }

        offset += 11 + dataSize + 4; // tagBody + dataSize + prevTagSize
      }

      // dispatch parsed frames to consumer (typically, the remuxer)
      if (this._isInitialMetadataDispatched()) {
        if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {
          this._onDataAvailable(this._audioTrack, this._videoTrack);
        }
      }

      return offset; // consumed bytes, just equals latest offset index
    } }, { key: "_parseScriptData", value: function _parseScriptData(

    arrayBuffer, dataOffset, dataSize) {
      var scriptData = _amfParser.default.parseScriptData(arrayBuffer, dataOffset, dataSize);

      if (scriptData.hasOwnProperty('onMetaData')) {
        if (scriptData.onMetaData == null || typeof scriptData.onMetaData !== 'object') {
          _logger.default.w(this.TAG, 'Invalid onMetaData structure!');
          return;
        }
        if (this._metadata) {
          _logger.default.w(this.TAG, 'Found another onMetaData tag!');
        }
        this._metadata = scriptData;
        var onMetaData = this._metadata.onMetaData;

        if (this._onMetaDataArrived) {
          this._onMetaDataArrived(Object.assign({}, onMetaData));
        }

        if (typeof onMetaData.hasAudio === 'boolean') {// hasAudio
          if (this._hasAudioFlagOverrided === false) {
            this._hasAudio = onMetaData.hasAudio;
            this._mediaInfo.hasAudio = this._hasAudio;
          }
        }
        if (typeof onMetaData.hasVideo === 'boolean') {// hasVideo
          if (this._hasVideoFlagOverrided === false) {
            this._hasVideo = onMetaData.hasVideo;
            this._mediaInfo.hasVideo = this._hasVideo;
          }
        }
        if (typeof onMetaData.audiodatarate === 'number') {// audiodatarate
          this._mediaInfo.audioDataRate = onMetaData.audiodatarate;
        }
        if (typeof onMetaData.videodatarate === 'number') {// videodatarate
          this._mediaInfo.videoDataRate = onMetaData.videodatarate;
        }
        if (typeof onMetaData.width === 'number') {// width
          this._mediaInfo.width = onMetaData.width;
        }
        if (typeof onMetaData.height === 'number') {// height
          this._mediaInfo.height = onMetaData.height;
        }
        if (typeof onMetaData.duration === 'number') {// duration
          if (!this._durationOverrided) {
            var duration = Math.floor(onMetaData.duration * this._timescale);
            this._duration = duration;
            this._mediaInfo.duration = duration;
          }
        } else {
          this._mediaInfo.duration = 0;
        }
        if (typeof onMetaData.framerate === 'number') {// framerate
          var fps_num = Math.floor(onMetaData.framerate * 1000);
          if (fps_num > 0) {
            var fps = fps_num / 1000;
            this._referenceFrameRate.fixed = true;
            this._referenceFrameRate.fps = fps;
            this._referenceFrameRate.fps_num = fps_num;
            this._referenceFrameRate.fps_den = 1000;
            this._mediaInfo.fps = fps;
          }
        }
        if (typeof onMetaData.keyframes === 'object') {// keyframes
          this._mediaInfo.hasKeyframesIndex = true;
          var keyframes = onMetaData.keyframes;
          this._mediaInfo.keyframesIndex = this._parseKeyframesIndex(keyframes);
          onMetaData.keyframes = null; // keyframes has been extracted, remove it
        } else {
          this._mediaInfo.hasKeyframesIndex = false;
        }
        this._dispatch = false;
        this._mediaInfo.metadata = onMetaData;
        _logger.default.v(this.TAG, 'Parsed onMetaData');
        if (this._mediaInfo.isComplete()) {
          this._onMediaInfo(this._mediaInfo);
        }
      }

      if (Object.keys(scriptData).length > 0) {
        if (this._onScriptDataArrived) {
          this._onScriptDataArrived(Object.assign({}, scriptData));
        }
      }
    } }, { key: "_parseKeyframesIndex", value: function _parseKeyframesIndex(

    keyframes) {
      var times = [];
      var filepositions = [];

      // ignore first keyframe which is actually AVC Sequence Header (AVCDecoderConfigurationRecord)
      for (var i = 1; i < keyframes.times.length; i++) {
        var time = this._timestampBase + Math.floor(keyframes.times[i] * 1000);
        times.push(time);
        filepositions.push(keyframes.filepositions[i]);
      }

      return {
        times: times,
        filepositions: filepositions };

    } }, { key: "_parseAudioData", value: function _parseAudioData(

    arrayBuffer, dataOffset, dataSize, tagTimestamp) {
      if (dataSize <= 1) {
        _logger.default.w(this.TAG, 'Flv: Invalid audio packet, missing SoundData payload!');
        return;
      }

      if (this._hasAudioFlagOverrided === true && this._hasAudio === false) {
        // If hasAudio: false indicated explicitly in MediaDataSource,
        // Ignore all the audio packets
        return;
      }

      var le = this._littleEndian;
      var v = new DataView(arrayBuffer, dataOffset, dataSize);

      var soundSpec = v.getUint8(0);

      var soundFormat = soundSpec >>> 4;
      if (soundFormat !== 2 && soundFormat !== 10) {// MP3 or AAC
        this._onError(_demuxErrors.default.CODEC_UNSUPPORTED, 'Flv: Unsupported audio codec idx: ' + soundFormat);
        return;
      }

      var soundRate = 0;
      var soundRateIndex = (soundSpec & 12) >>> 2;
      if (soundRateIndex >= 0 && soundRateIndex <= 4) {
        soundRate = this._flvSoundRateTable[soundRateIndex];
      } else {
        this._onError(_demuxErrors.default.FORMAT_ERROR, 'Flv: Invalid audio sample rate idx: ' + soundRateIndex);
        return;
      }

      var soundSize = (soundSpec & 2) >>> 1; // unused
      var soundType = soundSpec & 1;


      var meta = this._audioMetadata;
      var track = this._audioTrack;

      if (!meta) {
        if (this._hasAudio === false && this._hasAudioFlagOverrided === false) {
          this._hasAudio = true;
          this._mediaInfo.hasAudio = true;
        }

        // initial metadata
        meta = this._audioMetadata = {};
        meta.type = 'audio';
        meta.id = track.id;
        meta.timescale = this._timescale;
        meta.duration = this._duration;
        meta.audioSampleRate = soundRate;
        meta.channelCount = soundType === 0 ? 1 : 2;
      }

      if (soundFormat === 10) {// AAC
        var aacData = this._parseAACAudioData(arrayBuffer, dataOffset + 1, dataSize - 1);
        if (aacData == undefined) {
          return;
        }

        if (aacData.packetType === 0) {// AAC sequence header (AudioSpecificConfig)
          if (meta.config) {
            _logger.default.w(this.TAG, 'Found another AudioSpecificConfig!');
          }
          var misc = aacData.data;
          meta.audioSampleRate = misc.samplingRate;
          meta.channelCount = misc.channelCount;
          meta.codec = misc.codec;
          meta.originalCodec = misc.originalCodec;
          meta.config = misc.config;
          // The decode result of an aac sample is 1024 PCM samples
          meta.refSampleDuration = 1024 / meta.audioSampleRate * meta.timescale;
          _logger.default.v(this.TAG, 'Parsed AudioSpecificConfig');

          if (this._isInitialMetadataDispatched()) {
            // Non-initial metadata, force dispatch (or flush) parsed frames to remuxer
            if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {
              this._onDataAvailable(this._audioTrack, this._videoTrack);
            }
          } else {
            this._audioInitialMetadataDispatched = true;
          }
          // then notify new metadata
          this._dispatch = false;
          this._onTrackMetadata('audio', meta);

          var mi = this._mediaInfo;
          mi.audioCodec = meta.originalCodec;
          mi.audioSampleRate = meta.audioSampleRate;
          mi.audioChannelCount = meta.channelCount;
          if (mi.hasVideo) {
            if (mi.videoCodec != null) {
              mi.mimeType = 'video/x-flv; codecs="' + mi.videoCodec + ',' + mi.audioCodec + '"';
            }
          } else {
            mi.mimeType = 'video/x-flv; codecs="' + mi.audioCodec + '"';
          }
          if (mi.isComplete()) {
            this._onMediaInfo(mi);
          }
        } else if (aacData.packetType === 1) {// AAC raw frame data
          var dts = this._timestampBase + tagTimestamp;
          var aacSample = { unit: aacData.data, length: aacData.data.byteLength, dts: dts, pts: dts };
          track.samples.push(aacSample);
          track.length += aacData.data.length;
        } else {
          _logger.default.e(this.TAG, "Flv: Unsupported AAC data type ".concat(aacData.packetType));
        }
      } else if (soundFormat === 2) {// MP3
        if (!meta.codec) {
          // We need metadata for mp3 audio track, extract info from frame header
          var _misc = this._parseMP3AudioData(arrayBuffer, dataOffset + 1, dataSize - 1, true);
          if (_misc == undefined) {
            return;
          }
          meta.audioSampleRate = _misc.samplingRate;
          meta.channelCount = _misc.channelCount;
          meta.codec = _misc.codec;
          meta.originalCodec = _misc.originalCodec;
          // The decode result of an mp3 sample is 1152 PCM samples
          meta.refSampleDuration = 1152 / meta.audioSampleRate * meta.timescale;
          _logger.default.v(this.TAG, 'Parsed MPEG Audio Frame Header');

          this._audioInitialMetadataDispatched = true;
          this._onTrackMetadata('audio', meta);

          var _mi = this._mediaInfo;
          _mi.audioCodec = meta.codec;
          _mi.audioSampleRate = meta.audioSampleRate;
          _mi.audioChannelCount = meta.channelCount;
          _mi.audioDataRate = _misc.bitRate;
          if (_mi.hasVideo) {
            if (_mi.videoCodec != null) {
              _mi.mimeType = 'video/x-flv; codecs="' + _mi.videoCodec + ',' + _mi.audioCodec + '"';
            }
          } else {
            _mi.mimeType = 'video/x-flv; codecs="' + _mi.audioCodec + '"';
          }
          if (_mi.isComplete()) {
            this._onMediaInfo(_mi);
          }
        }

        // This packet is always a valid audio packet, extract it
        var data = this._parseMP3AudioData(arrayBuffer, dataOffset + 1, dataSize - 1, false);
        if (data == undefined) {
          return;
        }
        var _dts = this._timestampBase + tagTimestamp;
        var mp3Sample = { unit: data, length: data.byteLength, dts: _dts, pts: _dts };
        track.samples.push(mp3Sample);
        track.length += data.length;
      }
    } }, { key: "_parseAACAudioData", value: function _parseAACAudioData(

    arrayBuffer, dataOffset, dataSize) {
      if (dataSize <= 1) {
        _logger.default.w(this.TAG, 'Flv: Invalid AAC packet, missing AACPacketType or/and Data!');
        return;
      }

      var result = {};
      var array = new Uint8Array(arrayBuffer, dataOffset, dataSize);

      result.packetType = array[0];

      if (array[0] === 0) {
        result.data = this._parseAACAudioSpecificConfig(arrayBuffer, dataOffset + 1, dataSize - 1);
      } else {
        result.data = array.subarray(1);
      }

      return result;
    } }, { key: "_parseAACAudioSpecificConfig", value: function _parseAACAudioSpecificConfig(

    arrayBuffer, dataOffset, dataSize) {
      var array = new Uint8Array(arrayBuffer, dataOffset, dataSize);
      var config = null;

      /* Audio Object Type:
                            0: Null
                            1: AAC Main
                            2: AAC LC
                            3: AAC SSR (Scalable Sample Rate)
                            4: AAC LTP (Long Term Prediction)
                            5: HE-AAC / SBR (Spectral Band Replication)
                            6: AAC Scalable
                         */

      var audioObjectType = 0;
      var originalAudioObjectType = 0;
      var audioExtensionObjectType = null;
      var samplingIndex = 0;
      var extensionSamplingIndex = null;

      // 5 bits
      audioObjectType = originalAudioObjectType = array[0] >>> 3;
      // 4 bits
      samplingIndex = (array[0] & 0x07) << 1 | array[1] >>> 7;
      if (samplingIndex < 0 || samplingIndex >= this._mpegSamplingRates.length) {
        this._onError(_demuxErrors.default.FORMAT_ERROR, 'Flv: AAC invalid sampling frequency index!');
        return;
      }

      var samplingFrequence = this._mpegSamplingRates[samplingIndex];

      // 4 bits
      var channelConfig = (array[1] & 0x78) >>> 3;
      if (channelConfig < 0 || channelConfig >= 8) {
        this._onError(_demuxErrors.default.FORMAT_ERROR, 'Flv: AAC invalid channel configuration');
        return;
      }

      if (audioObjectType === 5) {// HE-AAC?
        // 4 bits
        extensionSamplingIndex = (array[1] & 0x07) << 1 | array[2] >>> 7;
        // 5 bits
        audioExtensionObjectType = (array[2] & 0x7C) >>> 2;
      }

      // workarounds for various browsers
      var userAgent = self.navigator.userAgent.toLowerCase();

      if (userAgent.indexOf('firefox') !== -1) {
        // firefox: use SBR (HE-AAC) if freq less than 24kHz
        if (samplingIndex >= 6) {
          audioObjectType = 5;
          config = new Array(4);
          extensionSamplingIndex = samplingIndex - 3;
        } else {// use LC-AAC
          audioObjectType = 2;
          config = new Array(2);
          extensionSamplingIndex = samplingIndex;
        }
      } else if (userAgent.indexOf('android') !== -1) {
        // android: always use LC-AAC
        audioObjectType = 2;
        config = new Array(2);
        extensionSamplingIndex = samplingIndex;
      } else {
        // for other browsers, e.g. chrome...
        // Always use HE-AAC to make it easier to switch aac codec profile
        audioObjectType = 5;
        extensionSamplingIndex = samplingIndex;
        config = new Array(4);

        if (samplingIndex >= 6) {
          extensionSamplingIndex = samplingIndex - 3;
        } else if (channelConfig === 1) {// Mono channel
          audioObjectType = 2;
          config = new Array(2);
          extensionSamplingIndex = samplingIndex;
        }
      }

      config[0] = audioObjectType << 3;
      config[0] |= (samplingIndex & 0x0F) >>> 1;
      config[1] = (samplingIndex & 0x0F) << 7;
      config[1] |= (channelConfig & 0x0F) << 3;
      if (audioObjectType === 5) {
        config[1] |= (extensionSamplingIndex & 0x0F) >>> 1;
        config[2] = (extensionSamplingIndex & 0x01) << 7;
        // extended audio object type: force to 2 (LC-AAC)
        config[2] |= 2 << 2;
        config[3] = 0;
      }

      return {
        config: config,
        samplingRate: samplingFrequence,
        channelCount: channelConfig,
        codec: 'mp4a.40.' + audioObjectType,
        originalCodec: 'mp4a.40.' + originalAudioObjectType };

    } }, { key: "_parseMP3AudioData", value: function _parseMP3AudioData(

    arrayBuffer, dataOffset, dataSize, requestHeader) {
      if (dataSize < 4) {
        _logger.default.w(this.TAG, 'Flv: Invalid MP3 packet, header missing!');
        return;
      }

      var le = this._littleEndian;
      var array = new Uint8Array(arrayBuffer, dataOffset, dataSize);
      var result = null;

      if (requestHeader) {
        if (array[0] !== 0xFF) {
          return;
        }
        var ver = array[1] >>> 3 & 0x03;
        var layer = (array[1] & 0x06) >> 1;

        var bitrate_index = (array[2] & 0xF0) >>> 4;
        var sampling_freq_index = (array[2] & 0x0C) >>> 2;

        var channel_mode = array[3] >>> 6 & 0x03;
        var channel_count = channel_mode !== 3 ? 2 : 1;

        var sample_rate = 0;
        var bit_rate = 0;
        var object_type = 34; // Layer-3, listed in MPEG-4 Audio Object Types

        var codec = 'mp3';

        switch (ver) {
          case 0: // MPEG 2.5
            sample_rate = this._mpegAudioV25SampleRateTable[sampling_freq_index];
            break;
          case 2: // MPEG 2
            sample_rate = this._mpegAudioV20SampleRateTable[sampling_freq_index];
            break;
          case 3: // MPEG 1
            sample_rate = this._mpegAudioV10SampleRateTable[sampling_freq_index];
            break;}


        switch (layer) {
          case 1: // Layer 3
            object_type = 34;
            if (bitrate_index < this._mpegAudioL3BitRateTable.length) {
              bit_rate = this._mpegAudioL3BitRateTable[bitrate_index];
            }
            break;
          case 2: // Layer 2
            object_type = 33;
            if (bitrate_index < this._mpegAudioL2BitRateTable.length) {
              bit_rate = this._mpegAudioL2BitRateTable[bitrate_index];
            }
            break;
          case 3: // Layer 1
            object_type = 32;
            if (bitrate_index < this._mpegAudioL1BitRateTable.length) {
              bit_rate = this._mpegAudioL1BitRateTable[bitrate_index];
            }
            break;}


        result = {
          bitRate: bit_rate,
          samplingRate: sample_rate,
          channelCount: channel_count,
          codec: codec,
          originalCodec: codec };

      } else {
        result = array;
      }

      return result;
    } }, { key: "_parseVideoData", value: function _parseVideoData(

    arrayBuffer, dataOffset, dataSize, tagTimestamp, tagPosition) {
      if (dataSize <= 1) {
        _logger.default.w(this.TAG, 'Flv: Invalid video packet, missing VideoData payload!');
        return;
      }

      if (this._hasVideoFlagOverrided === true && this._hasVideo === false) {
        // If hasVideo: false indicated explicitly in MediaDataSource,
        // Ignore all the video packets
        return;
      }

      var spec = new Uint8Array(arrayBuffer, dataOffset, dataSize)[0];

      var frameType = (spec & 240) >>> 4;
      var codecId = spec & 15;

      if (codecId !== 7) {
        this._onError(_demuxErrors.default.CODEC_UNSUPPORTED, "Flv: Unsupported codec in video frame: ".concat(codecId));
        return;
      }

      this._parseAVCVideoPacket(arrayBuffer, dataOffset + 1, dataSize - 1, tagTimestamp, tagPosition, frameType);
    } }, { key: "_parseAVCVideoPacket", value: function _parseAVCVideoPacket(

    arrayBuffer, dataOffset, dataSize, tagTimestamp, tagPosition, frameType) {
      if (dataSize < 4) {
        _logger.default.w(this.TAG, 'Flv: Invalid AVC packet, missing AVCPacketType or/and CompositionTime');
        return;
      }

      var le = this._littleEndian;
      var v = new DataView(arrayBuffer, dataOffset, dataSize);

      var packetType = v.getUint8(0);
      var cts_unsigned = v.getUint32(0, !le) & 0x00FFFFFF;
      var cts = cts_unsigned << 8 >> 8; // convert to 24-bit signed int

      if (packetType === 0) {// AVCDecoderConfigurationRecord
        this._parseAVCDecoderConfigurationRecord(arrayBuffer, dataOffset + 4, dataSize - 4);
      } else if (packetType === 1) {// One or more Nalus
        this._parseAVCVideoData(arrayBuffer, dataOffset + 4, dataSize - 4, tagTimestamp, tagPosition, frameType, cts);
      } else if (packetType === 2) {
        // empty, AVC end of sequence
      } else {
        this._onError(_demuxErrors.default.FORMAT_ERROR, "Flv: Invalid video packet type ".concat(packetType));
        return;
      }
    } }, { key: "_parseAVCDecoderConfigurationRecord", value: function _parseAVCDecoderConfigurationRecord(

    arrayBuffer, dataOffset, dataSize) {
      if (dataSize < 7) {
        _logger.default.w(this.TAG, 'Flv: Invalid AVCDecoderConfigurationRecord, lack of data!');
        return;
      }

      var meta = this._videoMetadata;
      var track = this._videoTrack;
      var le = this._littleEndian;
      var v = new DataView(arrayBuffer, dataOffset, dataSize);

      if (!meta) {
        if (this._hasVideo === false && this._hasVideoFlagOverrided === false) {
          this._hasVideo = true;
          this._mediaInfo.hasVideo = true;
        }

        meta = this._videoMetadata = {};
        meta.type = 'video';
        meta.id = track.id;
        meta.timescale = this._timescale;
        meta.duration = this._duration;
      } else {
        if (typeof meta.avcc !== 'undefined') {
          _logger.default.w(this.TAG, 'Found another AVCDecoderConfigurationRecord!');
        }
      }

      var version = v.getUint8(0); // configurationVersion
      var avcProfile = v.getUint8(1); // avcProfileIndication
      var profileCompatibility = v.getUint8(2); // profile_compatibility
      var avcLevel = v.getUint8(3); // AVCLevelIndication

      if (version !== 1 || avcProfile === 0) {
        this._onError(_demuxErrors.default.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord');
        return;
      }

      this._naluLengthSize = (v.getUint8(4) & 3) + 1; // lengthSizeMinusOne
      if (this._naluLengthSize !== 3 && this._naluLengthSize !== 4) {// holy shit!!!
        this._onError(_demuxErrors.default.FORMAT_ERROR, "Flv: Strange NaluLengthSizeMinusOne: ".concat(this._naluLengthSize - 1));
        return;
      }

      var spsCount = v.getUint8(5) & 31; // numOfSequenceParameterSets
      if (spsCount === 0) {
        this._onError(_demuxErrors.default.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord: No SPS');
        return;
      } else if (spsCount > 1) {
        _logger.default.w(this.TAG, "Flv: Strange AVCDecoderConfigurationRecord: SPS Count = ".concat(spsCount));
      }

      var offset = 6;

      for (var i = 0; i < spsCount; i++) {
        var len = v.getUint16(offset, !le); // sequenceParameterSetLength
        offset += 2;

        if (len === 0) {
          continue;
        }

        // Notice: Nalu without startcode header (00 00 00 01)
        var sps = new Uint8Array(arrayBuffer, dataOffset + offset, len);
        offset += len;

        var config = _spsParser.default.parseSPS(sps);
        if (i !== 0) {
          // ignore other sps's config
          continue;
        }

        meta.codecWidth = config.codec_size.width;
        meta.codecHeight = config.codec_size.height;
        meta.presentWidth = config.present_size.width;
        meta.presentHeight = config.present_size.height;

        meta.profile = config.profile_string;
        meta.level = config.level_string;
        meta.bitDepth = config.bit_depth;
        meta.chromaFormat = config.chroma_format;
        meta.sarRatio = config.sar_ratio;
        meta.frameRate = config.frame_rate;

        if (config.frame_rate.fixed === false ||
        config.frame_rate.fps_num === 0 ||
        config.frame_rate.fps_den === 0) {
          meta.frameRate = this._referenceFrameRate;
        }

        var fps_den = meta.frameRate.fps_den;
        var fps_num = meta.frameRate.fps_num;
        meta.refSampleDuration = meta.timescale * (fps_den / fps_num);

        var codecArray = sps.subarray(1, 4);
        var codecString = 'avc1.';
        for (var j = 0; j < 3; j++) {
          var h = codecArray[j].toString(16);
          if (h.length < 2) {
            h = '0' + h;
          }
          codecString += h;
        }
        meta.codec = codecString;

        var mi = this._mediaInfo;
        mi.width = meta.codecWidth;
        mi.height = meta.codecHeight;
        mi.fps = meta.frameRate.fps;
        mi.profile = meta.profile;
        mi.level = meta.level;
        mi.refFrames = config.ref_frames;
        mi.chromaFormat = config.chroma_format_string;
        mi.sarNum = meta.sarRatio.width;
        mi.sarDen = meta.sarRatio.height;
        mi.videoCodec = codecString;

        if (mi.hasAudio) {
          if (mi.audioCodec != null) {
            mi.mimeType = 'video/x-flv; codecs="' + mi.videoCodec + ',' + mi.audioCodec + '"';
          }
        } else {
          mi.mimeType = 'video/x-flv; codecs="' + mi.videoCodec + '"';
        }
        if (mi.isComplete()) {
          this._onMediaInfo(mi);
        }
      }

      var ppsCount = v.getUint8(offset); // numOfPictureParameterSets
      if (ppsCount === 0) {
        this._onError(_demuxErrors.default.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord: No PPS');
        return;
      } else if (ppsCount > 1) {
        _logger.default.w(this.TAG, "Flv: Strange AVCDecoderConfigurationRecord: PPS Count = ".concat(ppsCount));
      }

      offset++;

      for (var _i = 0; _i < ppsCount; _i++) {
        var _len = v.getUint16(offset, !le); // pictureParameterSetLength
        offset += 2;

        if (_len === 0) {
          continue;
        }

        // pps is useless for extracting video information
        offset += _len;
      }

      meta.avcc = new Uint8Array(dataSize);
      meta.avcc.set(new Uint8Array(arrayBuffer, dataOffset, dataSize), 0);
      _logger.default.v(this.TAG, 'Parsed AVCDecoderConfigurationRecord');

      if (this._isInitialMetadataDispatched()) {
        // flush parsed frames
        if (this._dispatch && (this._audioTrack.length || this._videoTrack.length)) {
          this._onDataAvailable(this._audioTrack, this._videoTrack);
        }
      } else {
        this._videoInitialMetadataDispatched = true;
      }
      // notify new metadata
      this._dispatch = false;
      this._onTrackMetadata('video', meta);
    } }, { key: "_parseAVCVideoData", value: function _parseAVCVideoData(

    arrayBuffer, dataOffset, dataSize, tagTimestamp, tagPosition, frameType, cts) {
      var le = this._littleEndian;
      var v = new DataView(arrayBuffer, dataOffset, dataSize);

      var units = [],length = 0;

      var offset = 0;
      var lengthSize = this._naluLengthSize;
      var dts = this._timestampBase + tagTimestamp;
      var keyframe = frameType === 1; // from FLV Frame Type constants

      while (offset < dataSize) {
        if (offset + 4 >= dataSize) {
          _logger.default.w(this.TAG, "Malformed Nalu near timestamp ".concat(dts, ", offset = ").concat(offset, ", dataSize = ").concat(dataSize));
          break; // data not enough for next Nalu
        }
        // Nalu with length-header (AVC1)
        var naluSize = v.getUint32(offset, !le); // Big-Endian read
        if (lengthSize === 3) {
          naluSize >>>= 8;
        }
        if (naluSize > dataSize - lengthSize) {
          _logger.default.w(this.TAG, "Malformed Nalus near timestamp ".concat(dts, ", NaluSize > DataSize!"));
          return;
        }

        var unitType = v.getUint8(offset + lengthSize) & 0x1F;

        if (unitType === 5) {// IDR
          keyframe = true;
        }

        var data = new Uint8Array(arrayBuffer, dataOffset + offset, lengthSize + naluSize);
        var unit = { type: unitType, data: data };
        units.push(unit);
        length += data.byteLength;

        offset += lengthSize + naluSize;
      }

      if (units.length) {
        var track = this._videoTrack;
        var avcSample = {
          units: units,
          length: length,
          isKeyframe: keyframe,
          dts: dts,
          cts: cts,
          pts: dts + cts };

        if (keyframe) {
          avcSample.fileposition = tagPosition;
        }
        track.samples.push(avcSample);
        track.length += length;
      }
    } }, { key: "onTrackMetadata", get: function get() {return this._onTrackMetadata;}, set: function set(callback) {this._onTrackMetadata = callback;} // prototype: function(mediaInfo: MediaInfo): void
  }, { key: "onMediaInfo", get: function get() {return this._onMediaInfo;}, set: function set(callback) {this._onMediaInfo = callback;} }, { key: "onMetaDataArrived", get: function get() {return this._onMetaDataArrived;}, set: function set(callback) {this._onMetaDataArrived = callback;} }, { key: "onScriptDataArrived", get: function get() {return this._onScriptDataArrived;}, set: function set(callback) {this._onScriptDataArrived = callback;} // prototype: function(type: number, info: string): void
  }, { key: "onError", get: function get() {return this._onError;}, set: function set(callback) {this._onError = callback;} // prototype: function(videoTrack: any, audioTrack: any): void
  }, { key: "onDataAvailable", get: function get() {return this._onDataAvailable;}, set: function set(callback) {this._onDataAvailable = callback;} // timestamp base for output samples, must be in milliseconds
  }, { key: "timestampBase", get: function get() {return this._timestampBase;}, set: function set(base) {this._timestampBase = base;} }, { key: "overridedDuration", get: function get() {return this._duration;} // Force-override media duration. Must be in milliseconds, int32
    , set: function set(duration) {this._durationOverrided = true;this._duration = duration;this._mediaInfo.duration = duration;} // Force-override audio track present flag, boolean
  }, { key: "overridedHasAudio", set: function set(hasAudio) {this._hasAudioFlagOverrided = true;this._hasAudio = hasAudio;this._mediaInfo.hasAudio = hasAudio;} // Force-override video track present flag, boolean
  }, { key: "overridedHasVideo", set: function set(hasVideo) {this._hasVideoFlagOverrided = true;this._hasVideo = hasVideo;this._mediaInfo.hasVideo = hasVideo;} }], [{ key: "probe", value: function probe(buffer) {var data = new Uint8Array(buffer);var mismatch = { match: false };if (data[0] !== 0x46 || data[1] !== 0x4C || data[2] !== 0x56 || data[3] !== 0x01) {return mismatch;}var hasAudio = (data[4] & 4) >>> 2 !== 0;var hasVideo = (data[4] & 1) !== 0;var offset = ReadBig32(data, 5);if (offset < 9) {return mismatch;}return { match: true, consumed: offset, dataOffset: offset, hasAudioTrack: hasAudio, hasVideoTrack: hasVideo };} }]);return FLVDemuxer;}();var _default = FLVDemuxer;exports.default = _default;

/***/ }),
/* 136 */
/*!**********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/demux/amf-parser.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _utf8Conv = _interopRequireDefault(__webpack_require__(/*! ../utils/utf8-conv.js */ 137));
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var le = function () {
  var buf = new ArrayBuffer(2);
  new DataView(buf).setInt16(0, 256, true); // little-endian write
  return new Int16Array(buf)[0] === 256; // platform-spec read, if equal then LE
}();var

AMF = /*#__PURE__*/function () {function AMF() {_classCallCheck(this, AMF);}_createClass(AMF, null, [{ key: "parseScriptData", value: function parseScriptData(

    arrayBuffer, dataOffset, dataSize) {
      var data = {};

      try {
        var name = AMF.parseValue(arrayBuffer, dataOffset, dataSize);
        var value = AMF.parseValue(arrayBuffer, dataOffset + name.size, dataSize - name.size);

        data[name.data] = value.data;
      } catch (e) {
        _logger.default.e('AMF', e.toString());
      }

      return data;
    } }, { key: "parseObject", value: function parseObject(

    arrayBuffer, dataOffset, dataSize) {
      if (dataSize < 3) {
        throw new _exception.IllegalStateException('Data not enough when parse ScriptDataObject');
      }
      var name = AMF.parseString(arrayBuffer, dataOffset, dataSize);
      var value = AMF.parseValue(arrayBuffer, dataOffset + name.size, dataSize - name.size);
      var isObjectEnd = value.objectEnd;

      return {
        data: {
          name: name.data,
          value: value.data },

        size: name.size + value.size,
        objectEnd: isObjectEnd };

    } }, { key: "parseVariable", value: function parseVariable(

    arrayBuffer, dataOffset, dataSize) {
      return AMF.parseObject(arrayBuffer, dataOffset, dataSize);
    } }, { key: "parseString", value: function parseString(

    arrayBuffer, dataOffset, dataSize) {
      if (dataSize < 2) {
        throw new _exception.IllegalStateException('Data not enough when parse String');
      }
      var v = new DataView(arrayBuffer, dataOffset, dataSize);
      var length = v.getUint16(0, !le);

      var str;
      if (length > 0) {
        str = (0, _utf8Conv.default)(new Uint8Array(arrayBuffer, dataOffset + 2, length));
      } else {
        str = '';
      }

      return {
        data: str,
        size: 2 + length };

    } }, { key: "parseLongString", value: function parseLongString(

    arrayBuffer, dataOffset, dataSize) {
      if (dataSize < 4) {
        throw new _exception.IllegalStateException('Data not enough when parse LongString');
      }
      var v = new DataView(arrayBuffer, dataOffset, dataSize);
      var length = v.getUint32(0, !le);

      var str;
      if (length > 0) {
        str = (0, _utf8Conv.default)(new Uint8Array(arrayBuffer, dataOffset + 4, length));
      } else {
        str = '';
      }

      return {
        data: str,
        size: 4 + length };

    } }, { key: "parseDate", value: function parseDate(

    arrayBuffer, dataOffset, dataSize) {
      if (dataSize < 10) {
        throw new _exception.IllegalStateException('Data size invalid when parse Date');
      }
      var v = new DataView(arrayBuffer, dataOffset, dataSize);
      var timestamp = v.getFloat64(0, !le);
      var localTimeOffset = v.getInt16(8, !le);
      timestamp += localTimeOffset * 60 * 1000; // get UTC time

      return {
        data: new Date(timestamp),
        size: 8 + 2 };

    } }, { key: "parseValue", value: function parseValue(

    arrayBuffer, dataOffset, dataSize) {
      if (dataSize < 1) {
        throw new _exception.IllegalStateException('Data not enough when parse Value');
      }

      var v = new DataView(arrayBuffer, dataOffset, dataSize);

      var offset = 1;
      var type = v.getUint8(0);
      var value;
      var objectEnd = false;

      try {
        switch (type) {
          case 0: // Number(Double) type
            value = v.getFloat64(1, !le);
            offset += 8;
            break;
          case 1:{// Boolean type
              var b = v.getUint8(1);
              value = b ? true : false;
              offset += 1;
              break;
            }
          case 2:{// String type
              var amfstr = AMF.parseString(arrayBuffer, dataOffset + 1, dataSize - 1);
              value = amfstr.data;
              offset += amfstr.size;
              break;
            }
          case 3:{// Object(s) type
              value = {};
              var terminal = 0; // workaround for malformed Objects which has missing ScriptDataObjectEnd
              if ((v.getUint32(dataSize - 4, !le) & 0x00FFFFFF) === 9) {
                terminal = 3;
              }
              while (offset < dataSize - 4) {// 4 === type(UI8) + ScriptDataObjectEnd(UI24)
                var amfobj = AMF.parseObject(arrayBuffer, dataOffset + offset, dataSize - offset - terminal);
                if (amfobj.objectEnd)
                break;
                value[amfobj.data.name] = amfobj.data.value;
                offset += amfobj.size;
              }
              if (offset <= dataSize - 3) {
                var marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;
                if (marker === 9) {
                  offset += 3;
                }
              }
              break;
            }
          case 8:{// ECMA array type (Mixed array)
              value = {};
              offset += 4; // ECMAArrayLength(UI32)
              var _terminal = 0; // workaround for malformed MixedArrays which has missing ScriptDataObjectEnd
              if ((v.getUint32(dataSize - 4, !le) & 0x00FFFFFF) === 9) {
                _terminal = 3;
              }
              while (offset < dataSize - 8) {// 8 === type(UI8) + ECMAArrayLength(UI32) + ScriptDataVariableEnd(UI24)
                var amfvar = AMF.parseVariable(arrayBuffer, dataOffset + offset, dataSize - offset - _terminal);
                if (amfvar.objectEnd)
                break;
                value[amfvar.data.name] = amfvar.data.value;
                offset += amfvar.size;
              }
              if (offset <= dataSize - 3) {
                var _marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;
                if (_marker === 9) {
                  offset += 3;
                }
              }
              break;
            }
          case 9: // ScriptDataObjectEnd
            value = undefined;
            offset = 1;
            objectEnd = true;
            break;
          case 10:{// Strict array type
              // ScriptDataValue[n]. NOTE: according to video_file_format_spec_v10_1.pdf
              value = [];
              var strictArrayLength = v.getUint32(1, !le);
              offset += 4;
              for (var i = 0; i < strictArrayLength; i++) {
                var val = AMF.parseValue(arrayBuffer, dataOffset + offset, dataSize - offset);
                value.push(val.data);
                offset += val.size;
              }
              break;
            }
          case 11:{// Date type
              var date = AMF.parseDate(arrayBuffer, dataOffset + 1, dataSize - 1);
              value = date.data;
              offset += date.size;
              break;
            }
          case 12:{// Long string type
              var amfLongStr = AMF.parseString(arrayBuffer, dataOffset + 1, dataSize - 1);
              value = amfLongStr.data;
              offset += amfLongStr.size;
              break;
            }
          default:
            // ignore and skip
            offset = dataSize;
            _logger.default.w('AMF', 'Unsupported AMF value type ' + type);}

      } catch (e) {
        _logger.default.e('AMF', e.toString());
      }

      return {
        data: value,
        size: offset,
        objectEnd: objectEnd };

    } }]);return AMF;}();var _default =



AMF;exports.default = _default;

/***/ }),
/* 137 */
/*!*********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/utils/utf8-conv.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /*
                                                                                                      * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                      *
                                                                                                      * This file is derived from C++ project libWinTF8 (https://github.com/m13253/libWinTF8)
                                                                                                      * @author zheng qian <xqq@xqq.im>
                                                                                                      *
                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                      * You may obtain a copy of the License at
                                                                                                      *
                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                      *
                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                      * See the License for the specific language governing permissions and
                                                                                                      * limitations under the License.
                                                                                                      */

function checkContinuation(uint8array, start, checkLength) {
  var array = uint8array;
  if (start + checkLength < array.length) {
    while (checkLength--) {
      if ((array[++start] & 0xC0) !== 0x80)
      return false;
    }
    return true;
  } else {
    return false;
  }
}

function decodeUTF8(uint8array) {
  var out = [];
  var input = uint8array;
  var i = 0;
  var length = uint8array.length;

  while (i < length) {
    if (input[i] < 0x80) {
      out.push(String.fromCharCode(input[i]));
      ++i;
      continue;
    } else if (input[i] < 0xC0) {
      // fallthrough
    } else if (input[i] < 0xE0) {
      if (checkContinuation(input, i, 1)) {
        var ucs4 = (input[i] & 0x1F) << 6 | input[i + 1] & 0x3F;
        if (ucs4 >= 0x80) {
          out.push(String.fromCharCode(ucs4 & 0xFFFF));
          i += 2;
          continue;
        }
      }
    } else if (input[i] < 0xF0) {
      if (checkContinuation(input, i, 2)) {
        var _ucs = (input[i] & 0xF) << 12 | (input[i + 1] & 0x3F) << 6 | input[i + 2] & 0x3F;
        if (_ucs >= 0x800 && (_ucs & 0xF800) !== 0xD800) {
          out.push(String.fromCharCode(_ucs & 0xFFFF));
          i += 3;
          continue;
        }
      }
    } else if (input[i] < 0xF8) {
      if (checkContinuation(input, i, 3)) {
        var _ucs2 = (input[i] & 0x7) << 18 | (input[i + 1] & 0x3F) << 12 |
        (input[i + 2] & 0x3F) << 6 | input[i + 3] & 0x3F;
        if (_ucs2 > 0x10000 && _ucs2 < 0x110000) {
          _ucs2 -= 0x10000;
          out.push(String.fromCharCode(_ucs2 >>> 10 | 0xD800));
          out.push(String.fromCharCode(_ucs2 & 0x3FF | 0xDC00));
          i += 4;
          continue;
        }
      }
    }
    out.push(String.fromCharCode(0xFFFD));
    ++i;
  }

  return out.join('');
}var _default =

decodeUTF8;exports.default = _default;

/***/ }),
/* 138 */
/*!**********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/demux/sps-parser.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _expGolomb = _interopRequireDefault(__webpack_require__(/*! ./exp-golomb.js */ 139));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

SPSParser = /*#__PURE__*/function () {function SPSParser() {_classCallCheck(this, SPSParser);}_createClass(SPSParser, null, [{ key: "_ebsp2rbsp", value: function _ebsp2rbsp(

    uint8array) {
      var src = uint8array;
      var src_length = src.byteLength;
      var dst = new Uint8Array(src_length);
      var dst_idx = 0;

      for (var i = 0; i < src_length; i++) {
        if (i >= 2) {
          // Unescape: Skip 0x03 after 00 00
          if (src[i] === 0x03 && src[i - 1] === 0x00 && src[i - 2] === 0x00) {
            continue;
          }
        }
        dst[dst_idx] = src[i];
        dst_idx++;
      }

      return new Uint8Array(dst.buffer, 0, dst_idx);
    } }, { key: "parseSPS", value: function parseSPS(

    uint8array) {
      var rbsp = SPSParser._ebsp2rbsp(uint8array);
      var gb = new _expGolomb.default(rbsp);

      gb.readByte();
      var profile_idc = gb.readByte(); // profile_idc
      gb.readByte(); // constraint_set_flags[5] + reserved_zero[3]
      var level_idc = gb.readByte(); // level_idc
      gb.readUEG(); // seq_parameter_set_id

      var profile_string = SPSParser.getProfileString(profile_idc);
      var level_string = SPSParser.getLevelString(level_idc);
      var chroma_format_idc = 1;
      var chroma_format = 420;
      var chroma_format_table = [0, 420, 422, 444];
      var bit_depth = 8;

      if (profile_idc === 100 || profile_idc === 110 || profile_idc === 122 ||
      profile_idc === 244 || profile_idc === 44 || profile_idc === 83 ||
      profile_idc === 86 || profile_idc === 118 || profile_idc === 128 ||
      profile_idc === 138 || profile_idc === 144) {

        chroma_format_idc = gb.readUEG();
        if (chroma_format_idc === 3) {
          gb.readBits(1); // separate_colour_plane_flag
        }
        if (chroma_format_idc <= 3) {
          chroma_format = chroma_format_table[chroma_format_idc];
        }

        bit_depth = gb.readUEG() + 8; // bit_depth_luma_minus8
        gb.readUEG(); // bit_depth_chroma_minus8
        gb.readBits(1); // qpprime_y_zero_transform_bypass_flag
        if (gb.readBool()) {// seq_scaling_matrix_present_flag
          var scaling_list_count = chroma_format_idc !== 3 ? 8 : 12;
          for (var i = 0; i < scaling_list_count; i++) {
            if (gb.readBool()) {// seq_scaling_list_present_flag
              if (i < 6) {
                SPSParser._skipScalingList(gb, 16);
              } else {
                SPSParser._skipScalingList(gb, 64);
              }
            }
          }
        }
      }
      gb.readUEG(); // log2_max_frame_num_minus4
      var pic_order_cnt_type = gb.readUEG();
      if (pic_order_cnt_type === 0) {
        gb.readUEG(); // log2_max_pic_order_cnt_lsb_minus_4
      } else if (pic_order_cnt_type === 1) {
        gb.readBits(1); // delta_pic_order_always_zero_flag
        gb.readSEG(); // offset_for_non_ref_pic
        gb.readSEG(); // offset_for_top_to_bottom_field
        var num_ref_frames_in_pic_order_cnt_cycle = gb.readUEG();
        for (var _i = 0; _i < num_ref_frames_in_pic_order_cnt_cycle; _i++) {
          gb.readSEG(); // offset_for_ref_frame
        }
      }
      var ref_frames = gb.readUEG(); // max_num_ref_frames
      gb.readBits(1); // gaps_in_frame_num_value_allowed_flag

      var pic_width_in_mbs_minus1 = gb.readUEG();
      var pic_height_in_map_units_minus1 = gb.readUEG();

      var frame_mbs_only_flag = gb.readBits(1);
      if (frame_mbs_only_flag === 0) {
        gb.readBits(1); // mb_adaptive_frame_field_flag
      }
      gb.readBits(1); // direct_8x8_inference_flag

      var frame_crop_left_offset = 0;
      var frame_crop_right_offset = 0;
      var frame_crop_top_offset = 0;
      var frame_crop_bottom_offset = 0;

      var frame_cropping_flag = gb.readBool();
      if (frame_cropping_flag) {
        frame_crop_left_offset = gb.readUEG();
        frame_crop_right_offset = gb.readUEG();
        frame_crop_top_offset = gb.readUEG();
        frame_crop_bottom_offset = gb.readUEG();
      }

      var sar_width = 1,sar_height = 1;
      var fps = 0,fps_fixed = true,fps_num = 0,fps_den = 0;

      var vui_parameters_present_flag = gb.readBool();
      if (vui_parameters_present_flag) {
        if (gb.readBool()) {// aspect_ratio_info_present_flag
          var aspect_ratio_idc = gb.readByte();
          var sar_w_table = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];
          var sar_h_table = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33, 99, 3, 2, 1];

          if (aspect_ratio_idc > 0 && aspect_ratio_idc < 16) {
            sar_width = sar_w_table[aspect_ratio_idc - 1];
            sar_height = sar_h_table[aspect_ratio_idc - 1];
          } else if (aspect_ratio_idc === 255) {
            sar_width = gb.readByte() << 8 | gb.readByte();
            sar_height = gb.readByte() << 8 | gb.readByte();
          }
        }

        if (gb.readBool()) {// overscan_info_present_flag
          gb.readBool(); // overscan_appropriate_flag
        }
        if (gb.readBool()) {// video_signal_type_present_flag
          gb.readBits(4); // video_format & video_full_range_flag
          if (gb.readBool()) {// colour_description_present_flag
            gb.readBits(24); // colour_primaries & transfer_characteristics & matrix_coefficients
          }
        }
        if (gb.readBool()) {// chroma_loc_info_present_flag
          gb.readUEG(); // chroma_sample_loc_type_top_field
          gb.readUEG(); // chroma_sample_loc_type_bottom_field
        }
        if (gb.readBool()) {// timing_info_present_flag
          var num_units_in_tick = gb.readBits(32);
          var time_scale = gb.readBits(32);
          fps_fixed = gb.readBool(); // fixed_frame_rate_flag

          fps_num = time_scale;
          fps_den = num_units_in_tick * 2;
          fps = fps_num / fps_den;
        }
      }

      var sarScale = 1;
      if (sar_width !== 1 || sar_height !== 1) {
        sarScale = sar_width / sar_height;
      }

      var crop_unit_x = 0,crop_unit_y = 0;
      if (chroma_format_idc === 0) {
        crop_unit_x = 1;
        crop_unit_y = 2 - frame_mbs_only_flag;
      } else {
        var sub_wc = chroma_format_idc === 3 ? 1 : 2;
        var sub_hc = chroma_format_idc === 1 ? 2 : 1;
        crop_unit_x = sub_wc;
        crop_unit_y = sub_hc * (2 - frame_mbs_only_flag);
      }

      var codec_width = (pic_width_in_mbs_minus1 + 1) * 16;
      var codec_height = (2 - frame_mbs_only_flag) * ((pic_height_in_map_units_minus1 + 1) * 16);

      codec_width -= (frame_crop_left_offset + frame_crop_right_offset) * crop_unit_x;
      codec_height -= (frame_crop_top_offset + frame_crop_bottom_offset) * crop_unit_y;

      var present_width = Math.ceil(codec_width * sarScale);

      gb.destroy();
      gb = null;

      return {
        profile_string: profile_string, // baseline, high, high10, ...
        level_string: level_string, // 3, 3.1, 4, 4.1, 5, 5.1, ...
        bit_depth: bit_depth, // 8bit, 10bit, ...
        ref_frames: ref_frames,
        chroma_format: chroma_format, // 4:2:0, 4:2:2, ...
        chroma_format_string: SPSParser.getChromaFormatString(chroma_format),

        frame_rate: {
          fixed: fps_fixed,
          fps: fps,
          fps_den: fps_den,
          fps_num: fps_num },


        sar_ratio: {
          width: sar_width,
          height: sar_height },


        codec_size: {
          width: codec_width,
          height: codec_height },


        present_size: {
          width: present_width,
          height: codec_height } };


    } }, { key: "_skipScalingList", value: function _skipScalingList(

    gb, count) {
      var last_scale = 8,next_scale = 8;
      var delta_scale = 0;
      for (var i = 0; i < count; i++) {
        if (next_scale !== 0) {
          delta_scale = gb.readSEG();
          next_scale = (last_scale + delta_scale + 256) % 256;
        }
        last_scale = next_scale === 0 ? last_scale : next_scale;
      }
    } }, { key: "getProfileString", value: function getProfileString(

    profile_idc) {
      switch (profile_idc) {
        case 66:
          return 'Baseline';
        case 77:
          return 'Main';
        case 88:
          return 'Extended';
        case 100:
          return 'High';
        case 110:
          return 'High10';
        case 122:
          return 'High422';
        case 244:
          return 'High444';
        default:
          return 'Unknown';}

    } }, { key: "getLevelString", value: function getLevelString(

    level_idc) {
      return (level_idc / 10).toFixed(1);
    } }, { key: "getChromaFormatString", value: function getChromaFormatString(

    chroma) {
      switch (chroma) {
        case 420:
          return '4:2:0';
        case 422:
          return '4:2:2';
        case 444:
          return '4:4:4';
        default:
          return 'Unknown';}

    } }]);return SPSParser;}();var _default =



SPSParser;exports.default = _default;

/***/ }),
/* 139 */
/*!**********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/demux/exp-golomb.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

// Exponential-Golomb buffer decoder
var ExpGolomb = /*#__PURE__*/function () {

  function ExpGolomb(uint8array) {_classCallCheck(this, ExpGolomb);
    this.TAG = 'ExpGolomb';

    this._buffer = uint8array;
    this._buffer_index = 0;
    this._total_bytes = uint8array.byteLength;
    this._total_bits = uint8array.byteLength * 8;
    this._current_word = 0;
    this._current_word_bits_left = 0;
  }_createClass(ExpGolomb, [{ key: "destroy", value: function destroy()

    {
      this._buffer = null;
    } }, { key: "_fillCurrentWord", value: function _fillCurrentWord()

    {
      var buffer_bytes_left = this._total_bytes - this._buffer_index;
      if (buffer_bytes_left <= 0)
      throw new _exception.IllegalStateException('ExpGolomb: _fillCurrentWord() but no bytes available');

      var bytes_read = Math.min(4, buffer_bytes_left);
      var word = new Uint8Array(4);
      word.set(this._buffer.subarray(this._buffer_index, this._buffer_index + bytes_read));
      this._current_word = new DataView(word.buffer).getUint32(0, false);

      this._buffer_index += bytes_read;
      this._current_word_bits_left = bytes_read * 8;
    } }, { key: "readBits", value: function readBits(

    bits) {
      if (bits > 32)
      throw new _exception.InvalidArgumentException('ExpGolomb: readBits() bits exceeded max 32bits!');

      if (bits <= this._current_word_bits_left) {
        var _result = this._current_word >>> 32 - bits;
        this._current_word <<= bits;
        this._current_word_bits_left -= bits;
        return _result;
      }

      var result = this._current_word_bits_left ? this._current_word : 0;
      result = result >>> 32 - this._current_word_bits_left;
      var bits_need_left = bits - this._current_word_bits_left;

      this._fillCurrentWord();
      var bits_read_next = Math.min(bits_need_left, this._current_word_bits_left);

      var result2 = this._current_word >>> 32 - bits_read_next;
      this._current_word <<= bits_read_next;
      this._current_word_bits_left -= bits_read_next;

      result = result << bits_read_next | result2;
      return result;
    } }, { key: "readBool", value: function readBool()

    {
      return this.readBits(1) === 1;
    } }, { key: "readByte", value: function readByte()

    {
      return this.readBits(8);
    } }, { key: "_skipLeadingZero", value: function _skipLeadingZero()

    {
      var zero_count;
      for (zero_count = 0; zero_count < this._current_word_bits_left; zero_count++) {
        if (0 !== (this._current_word & 0x80000000 >>> zero_count)) {
          this._current_word <<= zero_count;
          this._current_word_bits_left -= zero_count;
          return zero_count;
        }
      }
      this._fillCurrentWord();
      return zero_count + this._skipLeadingZero();
    } }, { key: "readUEG", value: function readUEG()

    {// unsigned exponential golomb
      var leading_zeros = this._skipLeadingZero();
      return this.readBits(leading_zeros + 1) - 1;
    } }, { key: "readSEG", value: function readSEG()

    {// signed exponential golomb
      var value = this.readUEG();
      if (value & 0x01) {
        return value + 1 >>> 1;
      } else {
        return -1 * (value >>> 1);
      }
    } }]);return ExpGolomb;}();var _default =



ExpGolomb;exports.default = _default;

/***/ }),
/* 140 */
/*!************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/demux/demux-errors.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /*
                                                                                                      * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                      *
                                                                                                      * @author zheng qian <xqq@xqq.im>
                                                                                                      *
                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                      * You may obtain a copy of the License at
                                                                                                      *
                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                      *
                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                      * See the License for the specific language governing permissions and
                                                                                                      * limitations under the License.
                                                                                                      */

var DemuxErrors = {
  OK: 'OK',
  FORMAT_ERROR: 'FormatError',
  FORMAT_UNSUPPORTED: 'FormatUnsupported',
  CODEC_UNSUPPORTED: 'CodecUnsupported' };var _default =


DemuxErrors;exports.default = _default;

/***/ }),
/* 141 */
/*!***********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/remux/mp4-remuxer.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _mp4Generator = _interopRequireDefault(__webpack_require__(/*! ./mp4-generator.js */ 142));
var _aacSilent = _interopRequireDefault(__webpack_require__(/*! ./aac-silent.js */ 143));
var _browser = _interopRequireDefault(__webpack_require__(/*! ../utils/browser.js */ 121));
var _mediaSegmentInfo = __webpack_require__(/*! ../core/media-segment-info.js */ 144);
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}


// Fragmented mp4 remuxer
var MP4Remuxer = /*#__PURE__*/function () {

  function MP4Remuxer(config) {_classCallCheck(this, MP4Remuxer);
    this.TAG = 'MP4Remuxer';

    this._config = config;
    this._isLive = config.isLive === true ? true : false;

    this._dtsBase = -1;
    this._dtsBaseInited = false;
    this._audioDtsBase = Infinity;
    this._videoDtsBase = Infinity;
    this._audioNextDts = undefined;
    this._videoNextDts = undefined;
    this._audioStashedLastSample = null;
    this._videoStashedLastSample = null;

    this._audioMeta = null;
    this._videoMeta = null;

    this._audioSegmentInfoList = new _mediaSegmentInfo.MediaSegmentInfoList('audio');
    this._videoSegmentInfoList = new _mediaSegmentInfo.MediaSegmentInfoList('video');

    this._onInitSegment = null;
    this._onMediaSegment = null;

    // Workaround for chrome < 50: Always force first sample as a Random Access Point in media segment
    // see https://bugs.chromium.org/p/chromium/issues/detail?id=229412
    this._forceFirstIDR = _browser.default.chrome && (
    _browser.default.version.major < 50 ||
    _browser.default.version.major === 50 && _browser.default.version.build < 2661) ? true : false;

    // Workaround for IE11/Edge: Fill silent aac frame after keyframe-seeking
    // Make audio beginDts equals with video beginDts, in order to fix seek freeze
    this._fillSilentAfterSeek = _browser.default.msedge || _browser.default.msie;

    // While only FireFox supports 'audio/mp4, codecs="mp3"', use 'audio/mpeg' for chrome, safari, ...
    this._mp3UseMpegAudio = !_browser.default.firefox;

    this._fillAudioTimestampGap = this._config.fixAudioTimestampGap;
  }_createClass(MP4Remuxer, [{ key: "destroy", value: function destroy()

    {
      this._dtsBase = -1;
      this._dtsBaseInited = false;
      this._audioMeta = null;
      this._videoMeta = null;
      this._audioSegmentInfoList.clear();
      this._audioSegmentInfoList = null;
      this._videoSegmentInfoList.clear();
      this._videoSegmentInfoList = null;
      this._onInitSegment = null;
      this._onMediaSegment = null;
    } }, { key: "bindDataSource", value: function bindDataSource(

    producer) {
      producer.onDataAvailable = this.remux.bind(this);
      producer.onTrackMetadata = this._onTrackMetadataReceived.bind(this);
      return this;
    }

    /* prototype: function onInitSegment(type: string, initSegment: ArrayBuffer): void
         InitSegment: {
             type: string,
             data: ArrayBuffer,
             codec: string,
             container: string
         }
      */ }, { key: "insertDiscontinuity", value: function insertDiscontinuity()
























    {
      this._audioNextDts = this._videoNextDts = undefined;
    } }, { key: "seek", value: function seek(

    originalDts) {
      this._audioStashedLastSample = null;
      this._videoStashedLastSample = null;
      this._videoSegmentInfoList.clear();
      this._audioSegmentInfoList.clear();
    } }, { key: "remux", value: function remux(

    audioTrack, videoTrack) {
      if (!this._onMediaSegment) {
        throw new _exception.IllegalStateException('MP4Remuxer: onMediaSegment callback must be specificed!');
      }
      if (!this._dtsBaseInited) {
        this._calculateDtsBase(audioTrack, videoTrack);
      }
      this._remuxVideo(videoTrack);
      this._remuxAudio(audioTrack);
    } }, { key: "_onTrackMetadataReceived", value: function _onTrackMetadataReceived(

    type, metadata) {
      var metabox = null;

      var container = 'mp4';
      var codec = metadata.codec;

      if (type === 'audio') {
        this._audioMeta = metadata;
        if (metadata.codec === 'mp3' && this._mp3UseMpegAudio) {
          // 'audio/mpeg' for MP3 audio track
          container = 'mpeg';
          codec = '';
          metabox = new Uint8Array();
        } else {
          // 'audio/mp4, codecs="codec"'
          metabox = _mp4Generator.default.generateInitSegment(metadata);
        }
      } else if (type === 'video') {
        this._videoMeta = metadata;
        metabox = _mp4Generator.default.generateInitSegment(metadata);
      } else {
        return;
      }

      // dispatch metabox (Initialization Segment)
      if (!this._onInitSegment) {
        throw new _exception.IllegalStateException('MP4Remuxer: onInitSegment callback must be specified!');
      }
      this._onInitSegment(type, {
        type: type,
        data: metabox.buffer,
        codec: codec,
        container: "".concat(type, "/").concat(container),
        mediaDuration: metadata.duration // in timescale 1000 (milliseconds)
      });
    } }, { key: "_calculateDtsBase", value: function _calculateDtsBase(

    audioTrack, videoTrack) {
      if (this._dtsBaseInited) {
        return;
      }

      if (audioTrack.samples && audioTrack.samples.length) {
        this._audioDtsBase = audioTrack.samples[0].dts;
      }
      if (videoTrack.samples && videoTrack.samples.length) {
        this._videoDtsBase = videoTrack.samples[0].dts;
      }

      this._dtsBase = Math.min(this._audioDtsBase, this._videoDtsBase);
      this._dtsBaseInited = true;
    } }, { key: "flushStashedSamples", value: function flushStashedSamples()

    {
      var videoSample = this._videoStashedLastSample;
      var audioSample = this._audioStashedLastSample;

      var videoTrack = {
        type: 'video',
        id: 1,
        sequenceNumber: 0,
        samples: [],
        length: 0 };


      if (videoSample != null) {
        videoTrack.samples.push(videoSample);
        videoTrack.length = videoSample.length;
      }

      var audioTrack = {
        type: 'audio',
        id: 2,
        sequenceNumber: 0,
        samples: [],
        length: 0 };


      if (audioSample != null) {
        audioTrack.samples.push(audioSample);
        audioTrack.length = audioSample.length;
      }

      this._videoStashedLastSample = null;
      this._audioStashedLastSample = null;

      this._remuxVideo(videoTrack, true);
      this._remuxAudio(audioTrack, true);
    } }, { key: "_remuxAudio", value: function _remuxAudio(

    audioTrack, force) {
      if (this._audioMeta == null) {
        return;
      }

      var track = audioTrack;
      var samples = track.samples;
      var dtsCorrection = undefined;
      var firstDts = -1,lastDts = -1,lastPts = -1;
      var refSampleDuration = this._audioMeta.refSampleDuration;

      var mpegRawTrack = this._audioMeta.codec === 'mp3' && this._mp3UseMpegAudio;
      var firstSegmentAfterSeek = this._dtsBaseInited && this._audioNextDts === undefined;

      var insertPrefixSilentFrame = false;

      if (!samples || samples.length === 0) {
        return;
      }
      if (samples.length === 1 && !force) {
        // If [sample count in current batch] === 1 && (force != true)
        // Ignore and keep in demuxer's queue
        return;
      } // else if (force === true) do remux

      var offset = 0;
      var mdatbox = null;
      var mdatBytes = 0;

      // calculate initial mdat size
      if (mpegRawTrack) {
        // for raw mpeg buffer
        offset = 0;
        mdatBytes = track.length;
      } else {
        // for fmp4 mdat box
        offset = 8; // size + type
        mdatBytes = 8 + track.length;
      }


      var lastSample = null;

      // Pop the lastSample and waiting for stash
      if (samples.length > 1) {
        lastSample = samples.pop();
        mdatBytes -= lastSample.length;
      }

      // Insert [stashed lastSample in the previous batch] to the front
      if (this._audioStashedLastSample != null) {
        var sample = this._audioStashedLastSample;
        this._audioStashedLastSample = null;
        samples.unshift(sample);
        mdatBytes += sample.length;
      }

      // Stash the lastSample of current batch, waiting for next batch
      if (lastSample != null) {
        this._audioStashedLastSample = lastSample;
      }


      var firstSampleOriginalDts = samples[0].dts - this._dtsBase;

      // calculate dtsCorrection
      if (this._audioNextDts) {
        dtsCorrection = firstSampleOriginalDts - this._audioNextDts;
      } else {// this._audioNextDts == undefined
        if (this._audioSegmentInfoList.isEmpty()) {
          dtsCorrection = 0;
          if (this._fillSilentAfterSeek && !this._videoSegmentInfoList.isEmpty()) {
            if (this._audioMeta.originalCodec !== 'mp3') {
              insertPrefixSilentFrame = true;
            }
          }
        } else {
          var _lastSample = this._audioSegmentInfoList.getLastSampleBefore(firstSampleOriginalDts);
          if (_lastSample != null) {
            var distance = firstSampleOriginalDts - (_lastSample.originalDts + _lastSample.duration);
            if (distance <= 3) {
              distance = 0;
            }
            var expectedDts = _lastSample.dts + _lastSample.duration + distance;
            dtsCorrection = firstSampleOriginalDts - expectedDts;
          } else {// lastSample == null, cannot found
            dtsCorrection = 0;
          }
        }
      }

      if (insertPrefixSilentFrame) {
        // align audio segment beginDts to match with current video segment's beginDts
        var firstSampleDts = firstSampleOriginalDts - dtsCorrection;
        var videoSegment = this._videoSegmentInfoList.getLastSegmentBefore(firstSampleOriginalDts);
        if (videoSegment != null && videoSegment.beginDts < firstSampleDts) {
          var silentUnit = _aacSilent.default.getSilentFrame(this._audioMeta.originalCodec, this._audioMeta.channelCount);
          if (silentUnit) {
            var dts = videoSegment.beginDts;
            var silentFrameDuration = firstSampleDts - videoSegment.beginDts;
            _logger.default.v(this.TAG, "InsertPrefixSilentAudio: dts: ".concat(dts, ", duration: ").concat(silentFrameDuration));
            samples.unshift({ unit: silentUnit, dts: dts, pts: dts });
            mdatBytes += silentUnit.byteLength;
          } // silentUnit == null: Cannot generate, skip
        } else {
          insertPrefixSilentFrame = false;
        }
      }

      var mp4Samples = [];

      // Correct dts for each sample, and calculate sample duration. Then output to mp4Samples
      for (var i = 0; i < samples.length; i++) {
        var _sample = samples[i];
        var unit = _sample.unit;
        var originalDts = _sample.dts - this._dtsBase;
        var _dts = originalDts - dtsCorrection;

        if (firstDts === -1) {
          firstDts = _dts;
        }

        var sampleDuration = 0;

        if (i !== samples.length - 1) {
          var nextDts = samples[i + 1].dts - this._dtsBase - dtsCorrection;
          sampleDuration = nextDts - _dts;
        } else {// the last sample
          if (lastSample != null) {// use stashed sample's dts to calculate sample duration
            var _nextDts = lastSample.dts - this._dtsBase - dtsCorrection;
            sampleDuration = _nextDts - _dts;
          } else if (mp4Samples.length >= 1) {// use second last sample duration
            sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
          } else {// the only one sample, use reference sample duration
            sampleDuration = Math.floor(refSampleDuration);
          }
        }

        var needFillSilentFrames = false;
        var silentFrames = null;

        // Silent frame generation, if large timestamp gap detected && config.fixAudioTimestampGap
        if (sampleDuration > refSampleDuration * 1.5 && this._audioMeta.codec !== 'mp3' && this._fillAudioTimestampGap && !_browser.default.safari) {
          // We need to insert silent frames to fill timestamp gap
          needFillSilentFrames = true;
          var delta = Math.abs(sampleDuration - refSampleDuration);
          var frameCount = Math.ceil(delta / refSampleDuration);
          var currentDts = _dts + refSampleDuration; // Notice: in float

          _logger.default.w(this.TAG, 'Large audio timestamp gap detected, may cause AV sync to drift. ' +
          'Silent frames will be generated to avoid unsync.\n' + "dts: ".concat(
          _dts + sampleDuration, " ms, expected: ").concat(_dts + Math.round(refSampleDuration), " ms, ") + "delta: ".concat(
          Math.round(delta), " ms, generate: ").concat(frameCount, " frames"));

          var _silentUnit = _aacSilent.default.getSilentFrame(this._audioMeta.originalCodec, this._audioMeta.channelCount);
          if (_silentUnit == null) {
            _logger.default.w(this.TAG, 'Unable to generate silent frame for ' + "".concat(
            this._audioMeta.originalCodec, " with ").concat(this._audioMeta.channelCount, " channels, repeat last frame"));
            // Repeat last frame
            _silentUnit = unit;
          }
          silentFrames = [];

          for (var j = 0; j < frameCount; j++) {
            var intDts = Math.round(currentDts); // round to integer
            if (silentFrames.length > 0) {
              // Set previous frame sample duration
              var previousFrame = silentFrames[silentFrames.length - 1];
              previousFrame.duration = intDts - previousFrame.dts;
            }
            var frame = {
              dts: intDts,
              pts: intDts,
              cts: 0,
              unit: _silentUnit,
              size: _silentUnit.byteLength,
              duration: 0, // wait for next sample
              originalDts: originalDts,
              flags: {
                isLeading: 0,
                dependsOn: 1,
                isDependedOn: 0,
                hasRedundancy: 0 } };


            silentFrames.push(frame);
            mdatBytes += frame.size;
            currentDts += refSampleDuration;
          }

          // last frame: align end time to next frame dts
          var lastFrame = silentFrames[silentFrames.length - 1];
          lastFrame.duration = _dts + sampleDuration - lastFrame.dts;

          // silentFrames.forEach((frame) => {
          //     Log.w(this.TAG, `SilentAudio: dts: ${frame.dts}, duration: ${frame.duration}`);
          // });

          // Set correct sample duration for current frame
          sampleDuration = Math.round(refSampleDuration);
        }

        mp4Samples.push({
          dts: _dts,
          pts: _dts,
          cts: 0,
          unit: _sample.unit,
          size: _sample.unit.byteLength,
          duration: sampleDuration,
          originalDts: originalDts,
          flags: {
            isLeading: 0,
            dependsOn: 1,
            isDependedOn: 0,
            hasRedundancy: 0 } });



        if (needFillSilentFrames) {
          // Silent frames should be inserted after wrong-duration frame
          mp4Samples.push.apply(mp4Samples, silentFrames);
        }
      }

      // allocate mdatbox
      if (mpegRawTrack) {
        // allocate for raw mpeg buffer
        mdatbox = new Uint8Array(mdatBytes);
      } else {
        // allocate for fmp4 mdat box
        mdatbox = new Uint8Array(mdatBytes);
        // size field
        mdatbox[0] = mdatBytes >>> 24 & 0xFF;
        mdatbox[1] = mdatBytes >>> 16 & 0xFF;
        mdatbox[2] = mdatBytes >>> 8 & 0xFF;
        mdatbox[3] = mdatBytes & 0xFF;
        // type field (fourCC)
        mdatbox.set(_mp4Generator.default.types.mdat, 4);
      }

      // Write samples into mdatbox
      for (var _i = 0; _i < mp4Samples.length; _i++) {
        var _unit = mp4Samples[_i].unit;
        mdatbox.set(_unit, offset);
        offset += _unit.byteLength;
      }

      var latest = mp4Samples[mp4Samples.length - 1];
      lastDts = latest.dts + latest.duration;
      this._audioNextDts = lastDts;

      // fill media segment info & add to info list
      var info = new _mediaSegmentInfo.MediaSegmentInfo();
      info.beginDts = firstDts;
      info.endDts = lastDts;
      info.beginPts = firstDts;
      info.endPts = lastDts;
      info.originalBeginDts = mp4Samples[0].originalDts;
      info.originalEndDts = latest.originalDts + latest.duration;
      info.firstSample = new _mediaSegmentInfo.SampleInfo(mp4Samples[0].dts,
      mp4Samples[0].pts,
      mp4Samples[0].duration,
      mp4Samples[0].originalDts,
      false);
      info.lastSample = new _mediaSegmentInfo.SampleInfo(latest.dts,
      latest.pts,
      latest.duration,
      latest.originalDts,
      false);
      if (!this._isLive) {
        this._audioSegmentInfoList.append(info);
      }

      track.samples = mp4Samples;
      track.sequenceNumber++;

      var moofbox = null;

      if (mpegRawTrack) {
        // Generate empty buffer, because useless for raw mpeg
        moofbox = new Uint8Array();
      } else {
        // Generate moof for fmp4 segment
        moofbox = _mp4Generator.default.moof(track, firstDts);
      }

      track.samples = [];
      track.length = 0;

      var segment = {
        type: 'audio',
        data: this._mergeBoxes(moofbox, mdatbox).buffer,
        sampleCount: mp4Samples.length,
        info: info };


      if (mpegRawTrack && firstSegmentAfterSeek) {
        // For MPEG audio stream in MSE, if seeking occurred, before appending new buffer
        // We need explicitly set timestampOffset to the desired point in timeline for mpeg SourceBuffer.
        segment.timestampOffset = firstDts;
      }

      this._onMediaSegment('audio', segment);
    } }, { key: "_remuxVideo", value: function _remuxVideo(

    videoTrack, force) {
      if (this._videoMeta == null) {
        return;
      }

      var track = videoTrack;
      var samples = track.samples;
      var dtsCorrection = undefined;
      var firstDts = -1,lastDts = -1;
      var firstPts = -1,lastPts = -1;

      if (!samples || samples.length === 0) {
        return;
      }
      if (samples.length === 1 && !force) {
        // If [sample count in current batch] === 1 && (force != true)
        // Ignore and keep in demuxer's queue
        return;
      } // else if (force === true) do remux

      var offset = 8;
      var mdatbox = null;
      var mdatBytes = 8 + videoTrack.length;


      var lastSample = null;

      // Pop the lastSample and waiting for stash
      if (samples.length > 1) {
        lastSample = samples.pop();
        mdatBytes -= lastSample.length;
      }

      // Insert [stashed lastSample in the previous batch] to the front
      if (this._videoStashedLastSample != null) {
        var sample = this._videoStashedLastSample;
        this._videoStashedLastSample = null;
        samples.unshift(sample);
        mdatBytes += sample.length;
      }

      // Stash the lastSample of current batch, waiting for next batch
      if (lastSample != null) {
        this._videoStashedLastSample = lastSample;
      }


      var firstSampleOriginalDts = samples[0].dts - this._dtsBase;

      // calculate dtsCorrection
      if (this._videoNextDts) {
        dtsCorrection = firstSampleOriginalDts - this._videoNextDts;
      } else {// this._videoNextDts == undefined
        if (this._videoSegmentInfoList.isEmpty()) {
          dtsCorrection = 0;
        } else {
          var _lastSample2 = this._videoSegmentInfoList.getLastSampleBefore(firstSampleOriginalDts);
          if (_lastSample2 != null) {
            var distance = firstSampleOriginalDts - (_lastSample2.originalDts + _lastSample2.duration);
            if (distance <= 3) {
              distance = 0;
            }
            var expectedDts = _lastSample2.dts + _lastSample2.duration + distance;
            dtsCorrection = firstSampleOriginalDts - expectedDts;
          } else {// lastSample == null, cannot found
            dtsCorrection = 0;
          }
        }
      }

      var info = new _mediaSegmentInfo.MediaSegmentInfo();
      var mp4Samples = [];

      // Correct dts for each sample, and calculate sample duration. Then output to mp4Samples
      for (var i = 0; i < samples.length; i++) {
        var _sample2 = samples[i];
        var originalDts = _sample2.dts - this._dtsBase;
        var isKeyframe = _sample2.isKeyframe;
        var dts = originalDts - dtsCorrection;
        var cts = _sample2.cts;
        var pts = dts + cts;

        if (firstDts === -1) {
          firstDts = dts;
          firstPts = pts;
        }

        var sampleDuration = 0;

        if (i !== samples.length - 1) {
          var nextDts = samples[i + 1].dts - this._dtsBase - dtsCorrection;
          sampleDuration = nextDts - dts;
        } else {// the last sample
          if (lastSample != null) {// use stashed sample's dts to calculate sample duration
            var _nextDts2 = lastSample.dts - this._dtsBase - dtsCorrection;
            sampleDuration = _nextDts2 - dts;
          } else if (mp4Samples.length >= 1) {// use second last sample duration
            sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
          } else {// the only one sample, use reference sample duration
            sampleDuration = Math.floor(this._videoMeta.refSampleDuration);
          }
        }

        if (isKeyframe) {
          var syncPoint = new _mediaSegmentInfo.SampleInfo(dts, pts, sampleDuration, _sample2.dts, true);
          syncPoint.fileposition = _sample2.fileposition;
          info.appendSyncPoint(syncPoint);
        }

        mp4Samples.push({
          dts: dts,
          pts: pts,
          cts: cts,
          units: _sample2.units,
          size: _sample2.length,
          isKeyframe: isKeyframe,
          duration: sampleDuration,
          originalDts: originalDts,
          flags: {
            isLeading: 0,
            dependsOn: isKeyframe ? 2 : 1,
            isDependedOn: isKeyframe ? 1 : 0,
            hasRedundancy: 0,
            isNonSync: isKeyframe ? 0 : 1 } });


      }

      // allocate mdatbox
      mdatbox = new Uint8Array(mdatBytes);
      mdatbox[0] = mdatBytes >>> 24 & 0xFF;
      mdatbox[1] = mdatBytes >>> 16 & 0xFF;
      mdatbox[2] = mdatBytes >>> 8 & 0xFF;
      mdatbox[3] = mdatBytes & 0xFF;
      mdatbox.set(_mp4Generator.default.types.mdat, 4);

      // Write samples into mdatbox
      for (var _i2 = 0; _i2 < mp4Samples.length; _i2++) {
        var units = mp4Samples[_i2].units;
        while (units.length) {
          var unit = units.shift();
          var data = unit.data;
          mdatbox.set(data, offset);
          offset += data.byteLength;
        }
      }

      var latest = mp4Samples[mp4Samples.length - 1];
      lastDts = latest.dts + latest.duration;
      lastPts = latest.pts + latest.duration;
      this._videoNextDts = lastDts;

      // fill media segment info & add to info list
      info.beginDts = firstDts;
      info.endDts = lastDts;
      info.beginPts = firstPts;
      info.endPts = lastPts;
      info.originalBeginDts = mp4Samples[0].originalDts;
      info.originalEndDts = latest.originalDts + latest.duration;
      info.firstSample = new _mediaSegmentInfo.SampleInfo(mp4Samples[0].dts,
      mp4Samples[0].pts,
      mp4Samples[0].duration,
      mp4Samples[0].originalDts,
      mp4Samples[0].isKeyframe);
      info.lastSample = new _mediaSegmentInfo.SampleInfo(latest.dts,
      latest.pts,
      latest.duration,
      latest.originalDts,
      latest.isKeyframe);
      if (!this._isLive) {
        this._videoSegmentInfoList.append(info);
      }

      track.samples = mp4Samples;
      track.sequenceNumber++;

      // workaround for chrome < 50: force first sample as a random access point
      // see https://bugs.chromium.org/p/chromium/issues/detail?id=229412
      if (this._forceFirstIDR) {
        var flags = mp4Samples[0].flags;
        flags.dependsOn = 2;
        flags.isNonSync = 0;
      }

      var moofbox = _mp4Generator.default.moof(track, firstDts);
      track.samples = [];
      track.length = 0;

      this._onMediaSegment('video', {
        type: 'video',
        data: this._mergeBoxes(moofbox, mdatbox).buffer,
        sampleCount: mp4Samples.length,
        info: info });

    } }, { key: "_mergeBoxes", value: function _mergeBoxes(

    moof, mdat) {
      var result = new Uint8Array(moof.byteLength + mdat.byteLength);
      result.set(moof, 0);
      result.set(mdat, moof.byteLength);
      return result;
    } }, { key: "onInitSegment", get: function get() {return this._onInitSegment;}, set: function set(callback) {this._onInitSegment = callback;} /* prototype: function onMediaSegment(type: string, mediaSegment: MediaSegment): void
                                                                                                                                                     MediaSegment: {
                                                                                                                                                         type: string,
                                                                                                                                                         data: ArrayBuffer,
                                                                                                                                                         sampleCount: int32
                                                                                                                                                         info: MediaSegmentInfo
                                                                                                                                                     }
                                                                                                                                                  */ }, { key: "onMediaSegment", get: function get() {return this._onMediaSegment;}, set: function set(callback) {this._onMediaSegment = callback;} }]);return MP4Remuxer;}();var _default = MP4Remuxer;exports.default = _default;

/***/ }),
/* 142 */
/*!*************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/remux/mp4-generator.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * This file is derived from dailymotion's hls.js library (hls.js/src/remux/mp4-generator.js)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */

//  MP4 boxes generator for ISO BMFF (ISO Base Media File Format, defined in ISO/IEC 14496-12)
var MP4 = /*#__PURE__*/function () {function MP4() {_classCallCheck(this, MP4);}_createClass(MP4, null, [{ key: "init", value: function init()

    {
      MP4.types = {
        avc1: [], avcC: [], btrt: [], dinf: [],
        dref: [], esds: [], ftyp: [], hdlr: [],
        mdat: [], mdhd: [], mdia: [], mfhd: [],
        minf: [], moof: [], moov: [], mp4a: [],
        mvex: [], mvhd: [], sdtp: [], stbl: [],
        stco: [], stsc: [], stsd: [], stsz: [],
        stts: [], tfdt: [], tfhd: [], traf: [],
        trak: [], trun: [], trex: [], tkhd: [],
        vmhd: [], smhd: [], '.mp3': [] };


      for (var name in MP4.types) {
        if (MP4.types.hasOwnProperty(name)) {
          MP4.types[name] = [
          name.charCodeAt(0),
          name.charCodeAt(1),
          name.charCodeAt(2),
          name.charCodeAt(3)];

        }
      }

      var constants = MP4.constants = {};

      constants.FTYP = new Uint8Array([
      0x69, 0x73, 0x6F, 0x6D, // major_brand: isom
      0x0, 0x0, 0x0, 0x1, // minor_version: 0x01
      0x69, 0x73, 0x6F, 0x6D, // isom
      0x61, 0x76, 0x63, 0x31 // avc1
      ]);

      constants.STSD_PREFIX = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      0x00, 0x00, 0x00, 0x01 // entry_count
      ]);

      constants.STTS = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      0x00, 0x00, 0x00, 0x00 // entry_count
      ]);

      constants.STSC = constants.STCO = constants.STTS;

      constants.STSZ = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      0x00, 0x00, 0x00, 0x00, // sample_size
      0x00, 0x00, 0x00, 0x00 // sample_count
      ]);

      constants.HDLR_VIDEO = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      0x00, 0x00, 0x00, 0x00, // pre_defined
      0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
      0x00, 0x00, 0x00, 0x00, // reserved: 3 * 4 bytes
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x56, 0x69, 0x64, 0x65,
      0x6F, 0x48, 0x61, 0x6E,
      0x64, 0x6C, 0x65, 0x72, 0x00 // name: VideoHandler
      ]);

      constants.HDLR_AUDIO = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      0x00, 0x00, 0x00, 0x00, // pre_defined
      0x73, 0x6F, 0x75, 0x6E, // handler_type: 'soun'
      0x00, 0x00, 0x00, 0x00, // reserved: 3 * 4 bytes
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x53, 0x6F, 0x75, 0x6E,
      0x64, 0x48, 0x61, 0x6E,
      0x64, 0x6C, 0x65, 0x72, 0x00 // name: SoundHandler
      ]);

      constants.DREF = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      0x00, 0x00, 0x00, 0x01, // entry_count
      0x00, 0x00, 0x00, 0x0C, // entry_size
      0x75, 0x72, 0x6C, 0x20, // type 'url '
      0x00, 0x00, 0x00, 0x01 // version(0) + flags
      ]);

      // Sound media header
      constants.SMHD = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      0x00, 0x00, 0x00, 0x00 // balance(2) + reserved(2)
      ]);

      // video media header
      constants.VMHD = new Uint8Array([
      0x00, 0x00, 0x00, 0x01, // version(0) + flags
      0x00, 0x00, // graphicsmode: 2 bytes
      0x00, 0x00, 0x00, 0x00, // opcolor: 3 * 2 bytes
      0x00, 0x00]);

    }

    // Generate a box
  }, { key: "box", value: function box(type) {
      var size = 8;
      var result = null;
      var datas = Array.prototype.slice.call(arguments, 1);
      var arrayCount = datas.length;

      for (var i = 0; i < arrayCount; i++) {
        size += datas[i].byteLength;
      }

      result = new Uint8Array(size);
      result[0] = size >>> 24 & 0xFF; // size
      result[1] = size >>> 16 & 0xFF;
      result[2] = size >>> 8 & 0xFF;
      result[3] = size & 0xFF;

      result.set(type, 4); // type

      var offset = 8;
      for (var _i = 0; _i < arrayCount; _i++) {// data body
        result.set(datas[_i], offset);
        offset += datas[_i].byteLength;
      }

      return result;
    }

    // emit ftyp & moov
  }, { key: "generateInitSegment", value: function generateInitSegment(meta) {
      var ftyp = MP4.box(MP4.types.ftyp, MP4.constants.FTYP);
      var moov = MP4.moov(meta);

      var result = new Uint8Array(ftyp.byteLength + moov.byteLength);
      result.set(ftyp, 0);
      result.set(moov, ftyp.byteLength);
      return result;
    }

    // Movie metadata box
  }, { key: "moov", value: function moov(meta) {
      var mvhd = MP4.mvhd(meta.timescale, meta.duration);
      var trak = MP4.trak(meta);
      var mvex = MP4.mvex(meta);
      return MP4.box(MP4.types.moov, mvhd, trak, mvex);
    }

    // Movie header box
  }, { key: "mvhd", value: function mvhd(timescale, duration) {
      return MP4.box(MP4.types.mvhd, new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      0x00, 0x00, 0x00, 0x00, // creation_time
      0x00, 0x00, 0x00, 0x00, // modification_time
      timescale >>> 24 & 0xFF, // timescale: 4 bytes
      timescale >>> 16 & 0xFF,
      timescale >>> 8 & 0xFF,
      timescale & 0xFF,
      duration >>> 24 & 0xFF, // duration: 4 bytes
      duration >>> 16 & 0xFF,
      duration >>> 8 & 0xFF,
      duration & 0xFF,
      0x00, 0x01, 0x00, 0x00, // Preferred rate: 1.0
      0x01, 0x00, 0x00, 0x00, // PreferredVolume(1.0, 2bytes) + reserved(2bytes)
      0x00, 0x00, 0x00, 0x00, // reserved: 4 + 4 bytes
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x00, // ----begin composition matrix----
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x40, 0x00, 0x00, 0x00, // ----end composition matrix----
      0x00, 0x00, 0x00, 0x00, // ----begin pre_defined 6 * 4 bytes----
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // ----end pre_defined 6 * 4 bytes----
      0xFF, 0xFF, 0xFF, 0xFF // next_track_ID
      ]));
    }

    // Track box
  }, { key: "trak", value: function trak(meta) {
      return MP4.box(MP4.types.trak, MP4.tkhd(meta), MP4.mdia(meta));
    }

    // Track header box
  }, { key: "tkhd", value: function tkhd(meta) {
      var trackId = meta.id,duration = meta.duration;
      var width = meta.presentWidth,height = meta.presentHeight;

      return MP4.box(MP4.types.tkhd, new Uint8Array([
      0x00, 0x00, 0x00, 0x07, // version(0) + flags
      0x00, 0x00, 0x00, 0x00, // creation_time
      0x00, 0x00, 0x00, 0x00, // modification_time
      trackId >>> 24 & 0xFF, // track_ID: 4 bytes
      trackId >>> 16 & 0xFF,
      trackId >>> 8 & 0xFF,
      trackId & 0xFF,
      0x00, 0x00, 0x00, 0x00, // reserved: 4 bytes
      duration >>> 24 & 0xFF, // duration: 4 bytes
      duration >>> 16 & 0xFF,
      duration >>> 8 & 0xFF,
      duration & 0xFF,
      0x00, 0x00, 0x00, 0x00, // reserved: 2 * 4 bytes
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // layer(2bytes) + alternate_group(2bytes)
      0x00, 0x00, 0x00, 0x00, // volume(2bytes) + reserved(2bytes)
      0x00, 0x01, 0x00, 0x00, // ----begin composition matrix----
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x40, 0x00, 0x00, 0x00, // ----end composition matrix----
      width >>> 8 & 0xFF, // width and height
      width & 0xFF,
      0x00, 0x00,
      height >>> 8 & 0xFF,
      height & 0xFF,
      0x00, 0x00]));

    }

    // Media Box
  }, { key: "mdia", value: function mdia(meta) {
      return MP4.box(MP4.types.mdia, MP4.mdhd(meta), MP4.hdlr(meta), MP4.minf(meta));
    }

    // Media header box
  }, { key: "mdhd", value: function mdhd(meta) {
      var timescale = meta.timescale;
      var duration = meta.duration;
      return MP4.box(MP4.types.mdhd, new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      0x00, 0x00, 0x00, 0x00, // creation_time
      0x00, 0x00, 0x00, 0x00, // modification_time
      timescale >>> 24 & 0xFF, // timescale: 4 bytes
      timescale >>> 16 & 0xFF,
      timescale >>> 8 & 0xFF,
      timescale & 0xFF,
      duration >>> 24 & 0xFF, // duration: 4 bytes
      duration >>> 16 & 0xFF,
      duration >>> 8 & 0xFF,
      duration & 0xFF,
      0x55, 0xC4, // language: und (undetermined)
      0x00, 0x00 // pre_defined = 0
      ]));
    }

    // Media handler reference box
  }, { key: "hdlr", value: function hdlr(meta) {
      var data = null;
      if (meta.type === 'audio') {
        data = MP4.constants.HDLR_AUDIO;
      } else {
        data = MP4.constants.HDLR_VIDEO;
      }
      return MP4.box(MP4.types.hdlr, data);
    }

    // Media infomation box
  }, { key: "minf", value: function minf(meta) {
      var xmhd = null;
      if (meta.type === 'audio') {
        xmhd = MP4.box(MP4.types.smhd, MP4.constants.SMHD);
      } else {
        xmhd = MP4.box(MP4.types.vmhd, MP4.constants.VMHD);
      }
      return MP4.box(MP4.types.minf, xmhd, MP4.dinf(), MP4.stbl(meta));
    }

    // Data infomation box
  }, { key: "dinf", value: function dinf() {
      var result = MP4.box(MP4.types.dinf,
      MP4.box(MP4.types.dref, MP4.constants.DREF));

      return result;
    }

    // Sample table box
  }, { key: "stbl", value: function stbl(meta) {
      var result = MP4.box(MP4.types.stbl, // type: stbl
      MP4.stsd(meta), // Sample Description Table
      MP4.box(MP4.types.stts, MP4.constants.STTS), // Time-To-Sample
      MP4.box(MP4.types.stsc, MP4.constants.STSC), // Sample-To-Chunk
      MP4.box(MP4.types.stsz, MP4.constants.STSZ), // Sample size
      MP4.box(MP4.types.stco, MP4.constants.STCO) // Chunk offset
      );
      return result;
    }

    // Sample description box
  }, { key: "stsd", value: function stsd(meta) {
      if (meta.type === 'audio') {
        if (meta.codec === 'mp3') {
          return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.mp3(meta));
        }
        // else: aac -> mp4a
        return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.mp4a(meta));
      } else {
        return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.avc1(meta));
      }
    } }, { key: "mp3", value: function mp3(

    meta) {
      var channelCount = meta.channelCount;
      var sampleRate = meta.audioSampleRate;

      var data = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // reserved(4)
      0x00, 0x00, 0x00, 0x01, // reserved(2) + data_reference_index(2)
      0x00, 0x00, 0x00, 0x00, // reserved: 2 * 4 bytes
      0x00, 0x00, 0x00, 0x00,
      0x00, channelCount, // channelCount(2)
      0x00, 0x10, // sampleSize(2)
      0x00, 0x00, 0x00, 0x00, // reserved(4)
      sampleRate >>> 8 & 0xFF, // Audio sample rate
      sampleRate & 0xFF,
      0x00, 0x00]);


      return MP4.box(MP4.types['.mp3'], data);
    } }, { key: "mp4a", value: function mp4a(

    meta) {
      var channelCount = meta.channelCount;
      var sampleRate = meta.audioSampleRate;

      var data = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // reserved(4)
      0x00, 0x00, 0x00, 0x01, // reserved(2) + data_reference_index(2)
      0x00, 0x00, 0x00, 0x00, // reserved: 2 * 4 bytes
      0x00, 0x00, 0x00, 0x00,
      0x00, channelCount, // channelCount(2)
      0x00, 0x10, // sampleSize(2)
      0x00, 0x00, 0x00, 0x00, // reserved(4)
      sampleRate >>> 8 & 0xFF, // Audio sample rate
      sampleRate & 0xFF,
      0x00, 0x00]);


      return MP4.box(MP4.types.mp4a, data, MP4.esds(meta));
    } }, { key: "esds", value: function esds(

    meta) {
      var config = meta.config || [];
      var configSize = config.length;
      var data = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version 0 + flags

      0x03, // descriptor_type
      0x17 + configSize, // length3
      0x00, 0x01, // es_id
      0x00, // stream_priority

      0x04, // descriptor_type
      0x0F + configSize, // length
      0x40, // codec: mpeg4_audio
      0x15, // stream_type: Audio
      0x00, 0x00, 0x00, // buffer_size
      0x00, 0x00, 0x00, 0x00, // maxBitrate
      0x00, 0x00, 0x00, 0x00, // avgBitrate

      0x05 // descriptor_type
      ].concat([
      configSize]).
      concat(
      config).
      concat([
      0x06, 0x01, 0x02 // GASpecificConfig
      ]));
      return MP4.box(MP4.types.esds, data);
    } }, { key: "avc1", value: function avc1(

    meta) {
      var avcc = meta.avcc;
      var width = meta.codecWidth,height = meta.codecHeight;

      var data = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // reserved(4)
      0x00, 0x00, 0x00, 0x01, // reserved(2) + data_reference_index(2)
      0x00, 0x00, 0x00, 0x00, // pre_defined(2) + reserved(2)
      0x00, 0x00, 0x00, 0x00, // pre_defined: 3 * 4 bytes
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      width >>> 8 & 0xFF, // width: 2 bytes
      width & 0xFF,
      height >>> 8 & 0xFF, // height: 2 bytes
      height & 0xFF,
      0x00, 0x48, 0x00, 0x00, // horizresolution: 4 bytes
      0x00, 0x48, 0x00, 0x00, // vertresolution: 4 bytes
      0x00, 0x00, 0x00, 0x00, // reserved: 4 bytes
      0x00, 0x01, // frame_count
      0x0A, // strlen
      0x78, 0x71, 0x71, 0x2F, // compressorname: 32 bytes
      0x66, 0x6C, 0x76, 0x2E,
      0x6A, 0x73, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00,
      0x00, 0x18, // depth
      0xFF, 0xFF // pre_defined = -1
      ]);
      return MP4.box(MP4.types.avc1, data, MP4.box(MP4.types.avcC, avcc));
    }

    // Movie Extends box
  }, { key: "mvex", value: function mvex(meta) {
      return MP4.box(MP4.types.mvex, MP4.trex(meta));
    }

    // Track Extends box
  }, { key: "trex", value: function trex(meta) {
      var trackId = meta.id;
      var data = new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) + flags
      trackId >>> 24 & 0xFF, // track_ID
      trackId >>> 16 & 0xFF,
      trackId >>> 8 & 0xFF,
      trackId & 0xFF,
      0x00, 0x00, 0x00, 0x01, // default_sample_description_index
      0x00, 0x00, 0x00, 0x00, // default_sample_duration
      0x00, 0x00, 0x00, 0x00, // default_sample_size
      0x00, 0x01, 0x00, 0x01 // default_sample_flags
      ]);
      return MP4.box(MP4.types.trex, data);
    }

    // Movie fragment box
  }, { key: "moof", value: function moof(track, baseMediaDecodeTime) {
      return MP4.box(MP4.types.moof, MP4.mfhd(track.sequenceNumber), MP4.traf(track, baseMediaDecodeTime));
    } }, { key: "mfhd", value: function mfhd(

    sequenceNumber) {
      var data = new Uint8Array([
      0x00, 0x00, 0x00, 0x00,
      sequenceNumber >>> 24 & 0xFF, // sequence_number: int32
      sequenceNumber >>> 16 & 0xFF,
      sequenceNumber >>> 8 & 0xFF,
      sequenceNumber & 0xFF]);

      return MP4.box(MP4.types.mfhd, data);
    }

    // Track fragment box
  }, { key: "traf", value: function traf(track, baseMediaDecodeTime) {
      var trackId = track.id;

      // Track fragment header box
      var tfhd = MP4.box(MP4.types.tfhd, new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) & flags
      trackId >>> 24 & 0xFF, // track_ID
      trackId >>> 16 & 0xFF,
      trackId >>> 8 & 0xFF,
      trackId & 0xFF]));

      // Track Fragment Decode Time
      var tfdt = MP4.box(MP4.types.tfdt, new Uint8Array([
      0x00, 0x00, 0x00, 0x00, // version(0) & flags
      baseMediaDecodeTime >>> 24 & 0xFF, // baseMediaDecodeTime: int32
      baseMediaDecodeTime >>> 16 & 0xFF,
      baseMediaDecodeTime >>> 8 & 0xFF,
      baseMediaDecodeTime & 0xFF]));

      var sdtp = MP4.sdtp(track);
      var trun = MP4.trun(track, sdtp.byteLength + 16 + 16 + 8 + 16 + 8 + 8);

      return MP4.box(MP4.types.traf, tfhd, tfdt, trun, sdtp);
    }

    // Sample Dependency Type box
  }, { key: "sdtp", value: function sdtp(track) {
      var samples = track.samples || [];
      var sampleCount = samples.length;
      var data = new Uint8Array(4 + sampleCount);
      // 0~4 bytes: version(0) & flags
      for (var i = 0; i < sampleCount; i++) {
        var flags = samples[i].flags;
        data[i + 4] = flags.isLeading << 6 | // is_leading: 2 (bit)
        flags.dependsOn << 4 // sample_depends_on
        | flags.isDependedOn << 2 // sample_is_depended_on
        | flags.hasRedundancy; // sample_has_redundancy
      }
      return MP4.box(MP4.types.sdtp, data);
    }

    // Track fragment run box
  }, { key: "trun", value: function trun(track, offset) {
      var samples = track.samples || [];
      var sampleCount = samples.length;
      var dataSize = 12 + 16 * sampleCount;
      var data = new Uint8Array(dataSize);
      offset += 8 + dataSize;

      data.set([
      0x00, 0x00, 0x0F, 0x01, // version(0) & flags
      sampleCount >>> 24 & 0xFF, // sample_count
      sampleCount >>> 16 & 0xFF,
      sampleCount >>> 8 & 0xFF,
      sampleCount & 0xFF,
      offset >>> 24 & 0xFF, // data_offset
      offset >>> 16 & 0xFF,
      offset >>> 8 & 0xFF,
      offset & 0xFF],
      0);

      for (var i = 0; i < sampleCount; i++) {
        var duration = samples[i].duration;
        var size = samples[i].size;
        var flags = samples[i].flags;
        var cts = samples[i].cts;
        data.set([
        duration >>> 24 & 0xFF, // sample_duration
        duration >>> 16 & 0xFF,
        duration >>> 8 & 0xFF,
        duration & 0xFF,
        size >>> 24 & 0xFF, // sample_size
        size >>> 16 & 0xFF,
        size >>> 8 & 0xFF,
        size & 0xFF,
        flags.isLeading << 2 | flags.dependsOn, // sample_flags
        flags.isDependedOn << 6 | flags.hasRedundancy << 4 | flags.isNonSync,
        0x00, 0x00, // sample_degradation_priority
        cts >>> 24 & 0xFF, // sample_composition_time_offset
        cts >>> 16 & 0xFF,
        cts >>> 8 & 0xFF,
        cts & 0xFF],
        12 + 16 * i);
      }
      return MP4.box(MP4.types.trun, data);
    } }, { key: "mdat", value: function mdat(

    data) {
      return MP4.box(MP4.types.mdat, data);
    } }]);return MP4;}();



MP4.init();var _default =

MP4;exports.default = _default;

/***/ }),
/* 143 */
/*!**********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/remux/aac-silent.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * This file is modified from dailymotion's hls.js library (hls.js/src/helper/aac.js)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */var

AAC = /*#__PURE__*/function () {function AAC() {_classCallCheck(this, AAC);}_createClass(AAC, null, [{ key: "getSilentFrame", value: function getSilentFrame(

    codec, channelCount) {
      if (codec === 'mp4a.40.2') {
        // handle LC-AAC
        if (channelCount === 1) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x23, 0x80]);
        } else if (channelCount === 2) {
          return new Uint8Array([0x21, 0x00, 0x49, 0x90, 0x02, 0x19, 0x00, 0x23, 0x80]);
        } else if (channelCount === 3) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x8e]);
        } else if (channelCount === 4) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x80, 0x2c, 0x80, 0x08, 0x02, 0x38]);
        } else if (channelCount === 5) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x38]);
        } else if (channelCount === 6) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x00, 0xb2, 0x00, 0x20, 0x08, 0xe0]);
        }
      } else {
        // handle HE-AAC (mp4a.40.5 / mp4a.40.29)
        if (channelCount === 1) {
          // ffmpeg -y -f lavfi -i "aevalsrc=0:d=0.05" -c:a libfdk_aac -profile:a aac_he -b:a 4k output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
          return new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x4e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x1c, 0x6, 0xf1, 0xc1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);
        } else if (channelCount === 2) {
          // ffmpeg -y -f lavfi -i "aevalsrc=0|0:d=0.05" -c:a libfdk_aac -profile:a aac_he_v2 -b:a 4k output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
          return new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x5e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x0, 0x95, 0x0, 0x6, 0xf1, 0xa1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);
        } else if (channelCount === 3) {
          // ffmpeg -y -f lavfi -i "aevalsrc=0|0|0:d=0.05" -c:a libfdk_aac -profile:a aac_he_v2 -b:a 4k output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
          return new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x5e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x0, 0x95, 0x0, 0x6, 0xf1, 0xa1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);
        }
      }
      return null;
    } }]);return AAC;}();var _default =



AAC;exports.default = _default;

/***/ }),
/* 144 */
/*!*****************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/core/media-segment-info.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.MediaSegmentInfoList = exports.IDRSampleList = exports.MediaSegmentInfo = exports.SampleInfo = void 0;function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */

// Represents an media sample (audio / video)
var SampleInfo =

function SampleInfo(dts, pts, duration, originalDts, isSync) {_classCallCheck(this, SampleInfo);
  this.dts = dts;
  this.pts = pts;
  this.duration = duration;
  this.originalDts = originalDts;
  this.isSyncPoint = isSync;
  this.fileposition = null;
};



// Media Segment concept is defined in Media Source Extensions spec.
// Particularly in ISO BMFF format, an Media Segment contains a moof box followed by a mdat box.
exports.SampleInfo = SampleInfo;var MediaSegmentInfo = /*#__PURE__*/function () {

  function MediaSegmentInfo() {_classCallCheck(this, MediaSegmentInfo);
    this.beginDts = 0;
    this.endDts = 0;
    this.beginPts = 0;
    this.endPts = 0;
    this.originalBeginDts = 0;
    this.originalEndDts = 0;
    this.syncPoints = []; // SampleInfo[n], for video IDR frames only
    this.firstSample = null; // SampleInfo
    this.lastSample = null; // SampleInfo
  }_createClass(MediaSegmentInfo, [{ key: "appendSyncPoint", value: function appendSyncPoint(

    sampleInfo) {// also called Random Access Point
      sampleInfo.isSyncPoint = true;
      this.syncPoints.push(sampleInfo);
    } }]);return MediaSegmentInfo;}();



// Ordered list for recording video IDR frames, sorted by originalDts
exports.MediaSegmentInfo = MediaSegmentInfo;var IDRSampleList = /*#__PURE__*/function () {

  function IDRSampleList() {_classCallCheck(this, IDRSampleList);
    this._list = [];
  }_createClass(IDRSampleList, [{ key: "clear", value: function clear()

    {
      this._list = [];
    } }, { key: "appendArray", value: function appendArray(

    syncPoints) {
      var list = this._list;

      if (syncPoints.length === 0) {
        return;
      }

      if (list.length > 0 && syncPoints[0].originalDts < list[list.length - 1].originalDts) {
        this.clear();
      }

      Array.prototype.push.apply(list, syncPoints);
    } }, { key: "getLastSyncPointBeforeDts", value: function getLastSyncPointBeforeDts(

    dts) {
      if (this._list.length == 0) {
        return null;
      }

      var list = this._list;
      var idx = 0;
      var last = list.length - 1;
      var mid = 0;
      var lbound = 0;
      var ubound = last;

      if (dts < list[0].dts) {
        idx = 0;
        lbound = ubound + 1;
      }

      while (lbound <= ubound) {
        mid = lbound + Math.floor((ubound - lbound) / 2);
        if (mid === last || dts >= list[mid].dts && dts < list[mid + 1].dts) {
          idx = mid;
          break;
        } else if (list[mid].dts < dts) {
          lbound = mid + 1;
        } else {
          ubound = mid - 1;
        }
      }
      return this._list[idx];
    } }]);return IDRSampleList;}();



// Data structure for recording information of media segments in single track.
exports.IDRSampleList = IDRSampleList;var MediaSegmentInfoList = /*#__PURE__*/function () {

  function MediaSegmentInfoList(type) {_classCallCheck(this, MediaSegmentInfoList);
    this._type = type;
    this._list = [];
    this._lastAppendLocation = -1; // cached last insert location
  }_createClass(MediaSegmentInfoList, [{ key: "isEmpty", value: function isEmpty()









    {
      return this._list.length === 0;
    } }, { key: "clear", value: function clear()

    {
      this._list = [];
      this._lastAppendLocation = -1;
    } }, { key: "_searchNearestSegmentBefore", value: function _searchNearestSegmentBefore(

    originalBeginDts) {
      var list = this._list;
      if (list.length === 0) {
        return -2;
      }
      var last = list.length - 1;
      var mid = 0;
      var lbound = 0;
      var ubound = last;

      var idx = 0;

      if (originalBeginDts < list[0].originalBeginDts) {
        idx = -1;
        return idx;
      }

      while (lbound <= ubound) {
        mid = lbound + Math.floor((ubound - lbound) / 2);
        if (mid === last || originalBeginDts > list[mid].lastSample.originalDts &&
        originalBeginDts < list[mid + 1].originalBeginDts) {
          idx = mid;
          break;
        } else if (list[mid].originalBeginDts < originalBeginDts) {
          lbound = mid + 1;
        } else {
          ubound = mid - 1;
        }
      }
      return idx;
    } }, { key: "_searchNearestSegmentAfter", value: function _searchNearestSegmentAfter(

    originalBeginDts) {
      return this._searchNearestSegmentBefore(originalBeginDts) + 1;
    } }, { key: "append", value: function append(

    mediaSegmentInfo) {
      var list = this._list;
      var msi = mediaSegmentInfo;
      var lastAppendIdx = this._lastAppendLocation;
      var insertIdx = 0;

      if (lastAppendIdx !== -1 && lastAppendIdx < list.length &&
      msi.originalBeginDts >= list[lastAppendIdx].lastSample.originalDts && (
      lastAppendIdx === list.length - 1 ||
      lastAppendIdx < list.length - 1 &&
      msi.originalBeginDts < list[lastAppendIdx + 1].originalBeginDts)) {
        insertIdx = lastAppendIdx + 1; // use cached location idx
      } else {
        if (list.length > 0) {
          insertIdx = this._searchNearestSegmentBefore(msi.originalBeginDts) + 1;
        }
      }

      this._lastAppendLocation = insertIdx;
      this._list.splice(insertIdx, 0, msi);
    } }, { key: "getLastSegmentBefore", value: function getLastSegmentBefore(

    originalBeginDts) {
      var idx = this._searchNearestSegmentBefore(originalBeginDts);
      if (idx >= 0) {
        return this._list[idx];
      } else {// -1
        return null;
      }
    } }, { key: "getLastSampleBefore", value: function getLastSampleBefore(

    originalBeginDts) {
      var segment = this.getLastSegmentBefore(originalBeginDts);
      if (segment != null) {
        return segment.lastSample;
      } else {
        return null;
      }
    } }, { key: "getLastSyncPointBefore", value: function getLastSyncPointBefore(

    originalBeginDts) {
      var segmentIdx = this._searchNearestSegmentBefore(originalBeginDts);
      var syncPoints = this._list[segmentIdx].syncPoints;
      while (syncPoints.length === 0 && segmentIdx > 0) {
        segmentIdx--;
        syncPoints = this._list[segmentIdx].syncPoints;
      }
      if (syncPoints.length > 0) {
        return syncPoints[syncPoints.length - 1];
      } else {
        return null;
      }
    } }, { key: "type", get: function get() {return this._type;} }, { key: "length", get: function get() {return this._list.length;} }]);return MediaSegmentInfoList;}();exports.MediaSegmentInfoList = MediaSegmentInfoList;

/***/ }),
/* 145 */
/*!*****************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/core/transmuxing-events.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /*
                                                                                                      * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                      *
                                                                                                      * @author zheng qian <xqq@xqq.im>
                                                                                                      *
                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                      * You may obtain a copy of the License at
                                                                                                      *
                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                      *
                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                      * See the License for the specific language governing permissions and
                                                                                                      * limitations under the License.
                                                                                                      */

var TransmuxingEvents = {
  IO_ERROR: 'io_error',
  DEMUX_ERROR: 'demux_error',
  INIT_SEGMENT: 'init_segment',
  MEDIA_SEGMENT: 'media_segment',
  LOADING_COMPLETE: 'loading_complete',
  RECOVERED_EARLY_EOF: 'recovered_early_eof',
  MEDIA_INFO: 'media_info',
  METADATA_ARRIVED: 'metadata_arrived',
  SCRIPTDATA_ARRIVED: 'scriptdata_arrived',
  STATISTICS_INFO: 'statistics_info',
  RECOMMEND_SEEKPOINT: 'recommend_seekpoint' };var _default =


TransmuxingEvents;exports.default = _default;

/***/ }),
/* 146 */
/*!*****************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/core/transmuxing-worker.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _loggingControl = _interopRequireDefault(__webpack_require__(/*! ../utils/logging-control.js */ 132));
var _polyfill = _interopRequireDefault(__webpack_require__(/*! ../utils/polyfill.js */ 109));
var _transmuxingController = _interopRequireDefault(__webpack_require__(/*! ./transmuxing-controller.js */ 133));
var _transmuxingEvents = _interopRequireDefault(__webpack_require__(/*! ./transmuxing-events.js */ 145));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /*
                                                                                                                                                                                   * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                                   *
                                                                                                                                                                                   * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                                   *
                                                                                                                                                                                   * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                   * you may not use this file except in compliance with the License.
                                                                                                                                                                                   * You may obtain a copy of the License at
                                                                                                                                                                                   *
                                                                                                                                                                                   *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                   *
                                                                                                                                                                                   * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                   * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                   * See the License for the specific language governing permissions and
                                                                                                                                                                                   * limitations under the License.
                                                                                                                                                                                   */ /* post message to worker:
                                                                                                                                                                                         data: {
                                                                                                                                                                                             cmd: string
                                                                                                                                                                                             param: any
                                                                                                                                                                                         }
                                                                                                                                                                                      
                                                                                                                                                                                         receive message from worker:
                                                                                                                                                                                         data: {
                                                                                                                                                                                             msg: string,
                                                                                                                                                                                             data: any
                                                                                                                                                                                         }
                                                                                                                                                                                       */var TransmuxingWorker = function TransmuxingWorker(self) {var TAG = 'TransmuxingWorker';var controller = null;var logcatListener = onLogcatCallback.bind(this);_polyfill.default.install();self.addEventListener('message', function (e) {switch (e.data.cmd) {case 'init':controller = new _transmuxingController.default(e.data.param[0], e.data.param[1]);controller.on(_transmuxingEvents.default.IO_ERROR, onIOError.bind(this));
        controller.on(_transmuxingEvents.default.DEMUX_ERROR, onDemuxError.bind(this));
        controller.on(_transmuxingEvents.default.INIT_SEGMENT, onInitSegment.bind(this));
        controller.on(_transmuxingEvents.default.MEDIA_SEGMENT, onMediaSegment.bind(this));
        controller.on(_transmuxingEvents.default.LOADING_COMPLETE, onLoadingComplete.bind(this));
        controller.on(_transmuxingEvents.default.RECOVERED_EARLY_EOF, onRecoveredEarlyEof.bind(this));
        controller.on(_transmuxingEvents.default.MEDIA_INFO, onMediaInfo.bind(this));
        controller.on(_transmuxingEvents.default.METADATA_ARRIVED, onMetaDataArrived.bind(this));
        controller.on(_transmuxingEvents.default.SCRIPTDATA_ARRIVED, onScriptDataArrived.bind(this));
        controller.on(_transmuxingEvents.default.STATISTICS_INFO, onStatisticsInfo.bind(this));
        controller.on(_transmuxingEvents.default.RECOMMEND_SEEKPOINT, onRecommendSeekpoint.bind(this));
        break;
      case 'destroy':
        if (controller) {
          controller.destroy();
          controller = null;
        }
        self.postMessage({ msg: 'destroyed' });
        break;
      case 'start':
        controller.start();
        break;
      case 'stop':
        controller.stop();
        break;
      case 'seek':
        controller.seek(e.data.param);
        break;
      case 'pause':
        controller.pause();
        break;
      case 'resume':
        controller.resume();
        break;
      case 'logging_config':{
          var config = e.data.param;
          _loggingControl.default.applyConfig(config);

          if (config.enableCallback === true) {
            _loggingControl.default.addLogListener(logcatListener);
          } else {
            _loggingControl.default.removeLogListener(logcatListener);
          }
          break;
        }}

  });

  function onInitSegment(type, initSegment) {
    var obj = {
      msg: _transmuxingEvents.default.INIT_SEGMENT,
      data: {
        type: type,
        data: initSegment } };


    self.postMessage(obj, [initSegment.data]); // data: ArrayBuffer
  }

  function onMediaSegment(type, mediaSegment) {
    var obj = {
      msg: _transmuxingEvents.default.MEDIA_SEGMENT,
      data: {
        type: type,
        data: mediaSegment } };


    self.postMessage(obj, [mediaSegment.data]); // data: ArrayBuffer
  }

  function onLoadingComplete() {
    var obj = {
      msg: _transmuxingEvents.default.LOADING_COMPLETE };

    self.postMessage(obj);
  }

  function onRecoveredEarlyEof() {
    var obj = {
      msg: _transmuxingEvents.default.RECOVERED_EARLY_EOF };

    self.postMessage(obj);
  }

  function onMediaInfo(mediaInfo) {
    var obj = {
      msg: _transmuxingEvents.default.MEDIA_INFO,
      data: mediaInfo };

    self.postMessage(obj);
  }

  function onMetaDataArrived(metadata) {
    var obj = {
      msg: _transmuxingEvents.default.METADATA_ARRIVED,
      data: metadata };

    self.postMessage(obj);
  }

  function onScriptDataArrived(data) {
    var obj = {
      msg: _transmuxingEvents.default.SCRIPTDATA_ARRIVED,
      data: data };

    self.postMessage(obj);
  }

  function onStatisticsInfo(statInfo) {
    var obj = {
      msg: _transmuxingEvents.default.STATISTICS_INFO,
      data: statInfo };

    self.postMessage(obj);
  }

  function onIOError(type, info) {
    self.postMessage({
      msg: _transmuxingEvents.default.IO_ERROR,
      data: {
        type: type,
        info: info } });


  }

  function onDemuxError(type, info) {
    self.postMessage({
      msg: _transmuxingEvents.default.DEMUX_ERROR,
      data: {
        type: type,
        info: info } });


  }

  function onRecommendSeekpoint(milliseconds) {
    self.postMessage({
      msg: _transmuxingEvents.default.RECOMMEND_SEEKPOINT,
      data: milliseconds });

  }

  function onLogcatCallback(type, str) {
    self.postMessage({
      msg: 'logcat_callback',
      data: {
        type: type,
        logcat: str } });


  }

};var _default =

TransmuxingWorker;exports.default = _default;

/***/ }),
/* 147 */
/*!*************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/core/mse-controller.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _events = _interopRequireDefault(__webpack_require__(/*! events */ 116));
var _logger = _interopRequireDefault(__webpack_require__(/*! ../utils/logger.js */ 115));
var _browser = _interopRequireDefault(__webpack_require__(/*! ../utils/browser.js */ 121));
var _mseEvents = _interopRequireDefault(__webpack_require__(/*! ./mse-events.js */ 148));
var _mediaSegmentInfo = __webpack_require__(/*! ./media-segment-info.js */ 144);
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

// Media Source Extensions controller
var MSEController = /*#__PURE__*/function () {

  function MSEController(config) {_classCallCheck(this, MSEController);
    this.TAG = 'MSEController';

    this._config = config;
    this._emitter = new _events.default();

    if (this._config.isLive && this._config.autoCleanupSourceBuffer == undefined) {
      // For live stream, do auto cleanup by default
      this._config.autoCleanupSourceBuffer = true;
    }

    this.e = {
      onSourceOpen: this._onSourceOpen.bind(this),
      onSourceEnded: this._onSourceEnded.bind(this),
      onSourceClose: this._onSourceClose.bind(this),
      onSourceBufferError: this._onSourceBufferError.bind(this),
      onSourceBufferUpdateEnd: this._onSourceBufferUpdateEnd.bind(this) };


    this._mediaSource = null;
    this._mediaSourceObjectURL = null;
    this._mediaElement = null;

    this._isBufferFull = false;
    this._hasPendingEos = false;

    this._requireSetMediaDuration = false;
    this._pendingMediaDuration = 0;

    this._pendingSourceBufferInit = [];
    this._mimeTypes = {
      video: null,
      audio: null };

    this._sourceBuffers = {
      video: null,
      audio: null };

    this._lastInitSegments = {
      video: null,
      audio: null };

    this._pendingSegments = {
      video: [],
      audio: [] };

    this._pendingRemoveRanges = {
      video: [],
      audio: [] };

    this._idrList = new _mediaSegmentInfo.IDRSampleList();
  }_createClass(MSEController, [{ key: "destroy", value: function destroy()

    {
      if (this._mediaElement || this._mediaSource) {
        this.detachMediaElement();
      }
      this.e = null;
      this._emitter.removeAllListeners();
      this._emitter = null;
    } }, { key: "on", value: function on(

    event, listener) {
      this._emitter.addListener(event, listener);
    } }, { key: "off", value: function off(

    event, listener) {
      this._emitter.removeListener(event, listener);
    } }, { key: "attachMediaElement", value: function attachMediaElement(

    mediaElement) {
      if (this._mediaSource) {
        throw new _exception.IllegalStateException('MediaSource has been attached to an HTMLMediaElement!');
      }
      var ms = this._mediaSource = new window.MediaSource();
      ms.addEventListener('sourceopen', this.e.onSourceOpen);
      ms.addEventListener('sourceended', this.e.onSourceEnded);
      ms.addEventListener('sourceclose', this.e.onSourceClose);

      this._mediaElement = mediaElement;
      this._mediaSourceObjectURL = window.URL.createObjectURL(this._mediaSource);
      mediaElement.src = this._mediaSourceObjectURL;
    } }, { key: "detachMediaElement", value: function detachMediaElement()

    {
      if (this._mediaSource) {
        var ms = this._mediaSource;
        for (var type in this._sourceBuffers) {
          // pending segments should be discard
          var ps = this._pendingSegments[type];
          ps.splice(0, ps.length);
          this._pendingSegments[type] = null;
          this._pendingRemoveRanges[type] = null;
          this._lastInitSegments[type] = null;

          // remove all sourcebuffers
          var sb = this._sourceBuffers[type];
          if (sb) {
            if (ms.readyState !== 'closed') {
              // ms edge can throw an error: Unexpected call to method or property access
              try {
                ms.removeSourceBuffer(sb);
              } catch (error) {
                _logger.default.e(this.TAG, error.message);
              }
              sb.removeEventListener('error', this.e.onSourceBufferError);
              sb.removeEventListener('updateend', this.e.onSourceBufferUpdateEnd);
            }
            this._mimeTypes[type] = null;
            this._sourceBuffers[type] = null;
          }
        }
        if (ms.readyState === 'open') {
          try {
            ms.endOfStream();
          } catch (error) {
            _logger.default.e(this.TAG, error.message);
          }
        }
        ms.removeEventListener('sourceopen', this.e.onSourceOpen);
        ms.removeEventListener('sourceended', this.e.onSourceEnded);
        ms.removeEventListener('sourceclose', this.e.onSourceClose);
        this._pendingSourceBufferInit = [];
        this._isBufferFull = false;
        this._idrList.clear();
        this._mediaSource = null;
      }

      if (this._mediaElement) {
        this._mediaElement.src = '';
        this._mediaElement.removeAttribute('src');
        this._mediaElement = null;
      }
      if (this._mediaSourceObjectURL) {
        window.URL.revokeObjectURL(this._mediaSourceObjectURL);
        this._mediaSourceObjectURL = null;
      }
    } }, { key: "appendInitSegment", value: function appendInitSegment(

    initSegment, deferred) {
      if (!this._mediaSource || this._mediaSource.readyState !== 'open') {
        // sourcebuffer creation requires mediaSource.readyState === 'open'
        // so we defer the sourcebuffer creation, until sourceopen event triggered
        this._pendingSourceBufferInit.push(initSegment);
        // make sure that this InitSegment is in the front of pending segments queue
        this._pendingSegments[initSegment.type].push(initSegment);
        return;
      }

      var is = initSegment;
      var mimeType = "".concat(is.container);
      if (is.codec && is.codec.length > 0) {
        mimeType += ";codecs=".concat(is.codec);
      }

      var firstInitSegment = false;

      _logger.default.v(this.TAG, 'Received Initialization Segment, mimeType: ' + mimeType);
      this._lastInitSegments[is.type] = is;

      if (mimeType !== this._mimeTypes[is.type]) {
        if (!this._mimeTypes[is.type]) {// empty, first chance create sourcebuffer
          firstInitSegment = true;
          try {
            var sb = this._sourceBuffers[is.type] = this._mediaSource.addSourceBuffer(mimeType);
            sb.addEventListener('error', this.e.onSourceBufferError);
            sb.addEventListener('updateend', this.e.onSourceBufferUpdateEnd);
          } catch (error) {
            _logger.default.e(this.TAG, error.message);
            this._emitter.emit(_mseEvents.default.ERROR, { code: error.code, msg: error.message });
            return;
          }
        } else {
          _logger.default.v(this.TAG, "Notice: ".concat(is.type, " mimeType changed, origin: ").concat(this._mimeTypes[is.type], ", target: ").concat(mimeType));
        }
        this._mimeTypes[is.type] = mimeType;
      }

      if (!deferred) {
        // deferred means this InitSegment has been pushed to pendingSegments queue
        this._pendingSegments[is.type].push(is);
      }
      if (!firstInitSegment) {// append immediately only if init segment in subsequence
        if (this._sourceBuffers[is.type] && !this._sourceBuffers[is.type].updating) {
          this._doAppendSegments();
        }
      }
      if (_browser.default.safari && is.container === 'audio/mpeg' && is.mediaDuration > 0) {
        // 'audio/mpeg' track under Safari may cause MediaElement's duration to be NaN
        // Manually correct MediaSource.duration to make progress bar seekable, and report right duration
        this._requireSetMediaDuration = true;
        this._pendingMediaDuration = is.mediaDuration / 1000; // in seconds
        this._updateMediaSourceDuration();
      }
    } }, { key: "appendMediaSegment", value: function appendMediaSegment(

    mediaSegment) {
      var ms = mediaSegment;
      this._pendingSegments[ms.type].push(ms);

      if (this._config.autoCleanupSourceBuffer && this._needCleanupSourceBuffer()) {
        this._doCleanupSourceBuffer();
      }

      var sb = this._sourceBuffers[ms.type];
      if (sb && !sb.updating && !this._hasPendingRemoveRanges()) {
        this._doAppendSegments();
      }
    } }, { key: "seek", value: function seek(

    seconds) {
      // remove all appended buffers
      for (var type in this._sourceBuffers) {
        if (!this._sourceBuffers[type]) {
          continue;
        }

        // abort current buffer append algorithm
        var sb = this._sourceBuffers[type];
        if (this._mediaSource.readyState === 'open') {
          try {
            // If range removal algorithm is running, InvalidStateError will be throwed
            // Ignore it.
            sb.abort();
          } catch (error) {
            _logger.default.e(this.TAG, error.message);
          }
        }

        // IDRList should be clear
        this._idrList.clear();

        // pending segments should be discard
        var ps = this._pendingSegments[type];
        ps.splice(0, ps.length);

        if (this._mediaSource.readyState === 'closed') {
          // Parent MediaSource object has been detached from HTMLMediaElement
          continue;
        }

        // record ranges to be remove from SourceBuffer
        for (var i = 0; i < sb.buffered.length; i++) {
          var start = sb.buffered.start(i);
          var end = sb.buffered.end(i);
          this._pendingRemoveRanges[type].push({ start: start, end: end });
        }

        // if sb is not updating, let's remove ranges now!
        if (!sb.updating) {
          this._doRemoveRanges();
        }

        // Safari 10 may get InvalidStateError in the later appendBuffer() after SourceBuffer.remove() call
        // Internal parser's state may be invalid at this time. Re-append last InitSegment to workaround.
        // Related issue: https://bugs.webkit.org/show_bug.cgi?id=159230
        if (_browser.default.safari) {
          var lastInitSegment = this._lastInitSegments[type];
          if (lastInitSegment) {
            this._pendingSegments[type].push(lastInitSegment);
            if (!sb.updating) {
              this._doAppendSegments();
            }
          }
        }
      }
    } }, { key: "endOfStream", value: function endOfStream()

    {
      var ms = this._mediaSource;
      var sb = this._sourceBuffers;
      if (!ms || ms.readyState !== 'open') {
        if (ms && ms.readyState === 'closed' && this._hasPendingSegments()) {
          // If MediaSource hasn't turned into open state, and there're pending segments
          // Mark pending endOfStream, defer call until all pending segments appended complete
          this._hasPendingEos = true;
        }
        return;
      }
      if (sb.video && sb.video.updating || sb.audio && sb.audio.updating) {
        // If any sourcebuffer is updating, defer endOfStream operation
        // See _onSourceBufferUpdateEnd()
        this._hasPendingEos = true;
      } else {
        this._hasPendingEos = false;
        // Notify media data loading complete
        // This is helpful for correcting total duration to match last media segment
        // Otherwise MediaElement's ended event may not be triggered
        ms.endOfStream();
      }
    } }, { key: "getNearestKeyframe", value: function getNearestKeyframe(

    dts) {
      return this._idrList.getLastSyncPointBeforeDts(dts);
    } }, { key: "_needCleanupSourceBuffer", value: function _needCleanupSourceBuffer()

    {
      if (!this._config.autoCleanupSourceBuffer) {
        return false;
      }

      var currentTime = this._mediaElement.currentTime;

      for (var type in this._sourceBuffers) {
        var sb = this._sourceBuffers[type];
        if (sb) {
          var buffered = sb.buffered;
          if (buffered.length >= 1) {
            if (currentTime - buffered.start(0) >= this._config.autoCleanupMaxBackwardDuration) {
              return true;
            }
          }
        }
      }

      return false;
    } }, { key: "_doCleanupSourceBuffer", value: function _doCleanupSourceBuffer()

    {
      var currentTime = this._mediaElement.currentTime;

      for (var type in this._sourceBuffers) {
        var sb = this._sourceBuffers[type];
        if (sb) {
          var buffered = sb.buffered;
          var doRemove = false;

          for (var i = 0; i < buffered.length; i++) {
            var start = buffered.start(i);
            var end = buffered.end(i);

            if (start <= currentTime && currentTime < end + 3) {// padding 3 seconds
              if (currentTime - start >= this._config.autoCleanupMaxBackwardDuration) {
                doRemove = true;
                var removeEnd = currentTime - this._config.autoCleanupMinBackwardDuration;
                this._pendingRemoveRanges[type].push({ start: start, end: removeEnd });
              }
            } else if (end < currentTime) {
              doRemove = true;
              this._pendingRemoveRanges[type].push({ start: start, end: end });
            }
          }

          if (doRemove && !sb.updating) {
            this._doRemoveRanges();
          }
        }
      }
    } }, { key: "_updateMediaSourceDuration", value: function _updateMediaSourceDuration()

    {
      var sb = this._sourceBuffers;
      if (this._mediaElement.readyState === 0 || this._mediaSource.readyState !== 'open') {
        return;
      }
      if (sb.video && sb.video.updating || sb.audio && sb.audio.updating) {
        return;
      }

      var current = this._mediaSource.duration;
      var target = this._pendingMediaDuration;

      if (target > 0 && (isNaN(current) || target > current)) {
        _logger.default.v(this.TAG, "Update MediaSource duration from ".concat(current, " to ").concat(target));
        this._mediaSource.duration = target;
      }

      this._requireSetMediaDuration = false;
      this._pendingMediaDuration = 0;
    } }, { key: "_doRemoveRanges", value: function _doRemoveRanges()

    {
      for (var type in this._pendingRemoveRanges) {
        if (!this._sourceBuffers[type] || this._sourceBuffers[type].updating) {
          continue;
        }
        var sb = this._sourceBuffers[type];
        var ranges = this._pendingRemoveRanges[type];
        while (ranges.length && !sb.updating) {
          var range = ranges.shift();
          sb.remove(range.start, range.end);
        }
      }
    } }, { key: "_doAppendSegments", value: function _doAppendSegments()

    {
      var pendingSegments = this._pendingSegments;

      for (var type in pendingSegments) {
        if (!this._sourceBuffers[type] || this._sourceBuffers[type].updating) {
          continue;
        }

        if (pendingSegments[type].length > 0) {
          var segment = pendingSegments[type].shift();

          if (segment.timestampOffset) {
            // For MPEG audio stream in MSE, if unbuffered-seeking occurred
            // We need explicitly set timestampOffset to the desired point in timeline for mpeg SourceBuffer.
            var currentOffset = this._sourceBuffers[type].timestampOffset;
            var targetOffset = segment.timestampOffset / 1000; // in seconds

            var delta = Math.abs(currentOffset - targetOffset);
            if (delta > 0.1) {// If time delta > 100ms
              _logger.default.v(this.TAG, "Update MPEG audio timestampOffset from ".concat(currentOffset, " to ").concat(targetOffset));
              this._sourceBuffers[type].timestampOffset = targetOffset;
            }
            delete segment.timestampOffset;
          }

          if (!segment.data || segment.data.byteLength === 0) {
            // Ignore empty buffer
            continue;
          }

          try {
            this._sourceBuffers[type].appendBuffer(segment.data);
            this._isBufferFull = false;
            if (type === 'video' && segment.hasOwnProperty('info')) {
              this._idrList.appendArray(segment.info.syncPoints);
            }
          } catch (error) {
            this._pendingSegments[type].unshift(segment);
            if (error.code === 22) {// QuotaExceededError
              /* Notice that FireFox may not throw QuotaExceededError if SourceBuffer is full
               * Currently we can only do lazy-load to avoid SourceBuffer become scattered.
               * SourceBuffer eviction policy may be changed in future version of FireFox.
               *
               * Related issues:
               * https://bugzilla.mozilla.org/show_bug.cgi?id=1279885
               * https://bugzilla.mozilla.org/show_bug.cgi?id=1280023
               */

              // report buffer full, abort network IO
              if (!this._isBufferFull) {
                this._emitter.emit(_mseEvents.default.BUFFER_FULL);
              }
              this._isBufferFull = true;
            } else {
              _logger.default.e(this.TAG, error.message);
              this._emitter.emit(_mseEvents.default.ERROR, { code: error.code, msg: error.message });
            }
          }
        }
      }
    } }, { key: "_onSourceOpen", value: function _onSourceOpen()

    {
      _logger.default.v(this.TAG, 'MediaSource onSourceOpen');
      this._mediaSource.removeEventListener('sourceopen', this.e.onSourceOpen);
      // deferred sourcebuffer creation / initialization
      if (this._pendingSourceBufferInit.length > 0) {
        var pendings = this._pendingSourceBufferInit;
        while (pendings.length) {
          var segment = pendings.shift();
          this.appendInitSegment(segment, true);
        }
      }
      // there may be some pending media segments, append them
      if (this._hasPendingSegments()) {
        this._doAppendSegments();
      }
      this._emitter.emit(_mseEvents.default.SOURCE_OPEN);
    } }, { key: "_onSourceEnded", value: function _onSourceEnded()

    {
      // fired on endOfStream
      _logger.default.v(this.TAG, 'MediaSource onSourceEnded');
    } }, { key: "_onSourceClose", value: function _onSourceClose()

    {
      // fired on detaching from media element
      _logger.default.v(this.TAG, 'MediaSource onSourceClose');
      if (this._mediaSource && this.e != null) {
        this._mediaSource.removeEventListener('sourceopen', this.e.onSourceOpen);
        this._mediaSource.removeEventListener('sourceended', this.e.onSourceEnded);
        this._mediaSource.removeEventListener('sourceclose', this.e.onSourceClose);
      }
    } }, { key: "_hasPendingSegments", value: function _hasPendingSegments()

    {
      var ps = this._pendingSegments;
      return ps.video.length > 0 || ps.audio.length > 0;
    } }, { key: "_hasPendingRemoveRanges", value: function _hasPendingRemoveRanges()

    {
      var prr = this._pendingRemoveRanges;
      return prr.video.length > 0 || prr.audio.length > 0;
    } }, { key: "_onSourceBufferUpdateEnd", value: function _onSourceBufferUpdateEnd()

    {
      if (this._requireSetMediaDuration) {
        this._updateMediaSourceDuration();
      } else if (this._hasPendingRemoveRanges()) {
        this._doRemoveRanges();
      } else if (this._hasPendingSegments()) {
        this._doAppendSegments();
      } else if (this._hasPendingEos) {
        this.endOfStream();
      }
      this._emitter.emit(_mseEvents.default.UPDATE_END);
    } }, { key: "_onSourceBufferError", value: function _onSourceBufferError(

    e) {
      _logger.default.e(this.TAG, "SourceBuffer Error: ".concat(e));
      // this error might not always be fatal, just ignore it
    } }]);return MSEController;}();var _default =



MSEController;exports.default = _default;

/***/ }),
/* 148 */
/*!*********************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/core/mse-events.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /*
                                                                                                      * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                      *
                                                                                                      * @author zheng qian <xqq@xqq.im>
                                                                                                      *
                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                      * You may obtain a copy of the License at
                                                                                                      *
                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                      *
                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                      * See the License for the specific language governing permissions and
                                                                                                      * limitations under the License.
                                                                                                      */

var MSEEvents = {
  ERROR: 'error',
  SOURCE_OPEN: 'source_open',
  UPDATE_END: 'update_end',
  BUFFER_FULL: 'buffer_full' };var _default =


MSEEvents;exports.default = _default;

/***/ }),
/* 149 */
/*!**************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/player/player-errors.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.ErrorDetails = exports.ErrorTypes = void 0;

















var _loader = __webpack_require__(/*! ../io/loader.js */ 118);
var _demuxErrors = _interopRequireDefault(__webpack_require__(/*! ../demux/demux-errors.js */ 140));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /*
                                                                                                                                                                              * Copyright (C) 2016 Bilibili. All Rights Reserved.
                                                                                                                                                                              *
                                                                                                                                                                              * @author zheng qian <xqq@xqq.im>
                                                                                                                                                                              *
                                                                                                                                                                              * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                              * you may not use this file except in compliance with the License.
                                                                                                                                                                              * You may obtain a copy of the License at
                                                                                                                                                                              *
                                                                                                                                                                              *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                              *
                                                                                                                                                                              * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                              * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                              * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                              * See the License for the specific language governing permissions and
                                                                                                                                                                              * limitations under the License.
                                                                                                                                                                              */var ErrorTypes = { NETWORK_ERROR: 'NetworkError', MEDIA_ERROR: 'MediaError', OTHER_ERROR: 'OtherError' };exports.ErrorTypes = ErrorTypes;var ErrorDetails = { NETWORK_EXCEPTION: _loader.LoaderErrors.EXCEPTION, NETWORK_STATUS_CODE_INVALID: _loader.LoaderErrors.HTTP_STATUS_CODE_INVALID, NETWORK_TIMEOUT: _loader.LoaderErrors.CONNECTING_TIMEOUT, NETWORK_UNRECOVERABLE_EARLY_EOF: _loader.LoaderErrors.UNRECOVERABLE_EARLY_EOF, MEDIA_MSE_ERROR: 'MediaMSEError', MEDIA_FORMAT_ERROR: _demuxErrors.default.FORMAT_ERROR,
  MEDIA_FORMAT_UNSUPPORTED: _demuxErrors.default.FORMAT_UNSUPPORTED,
  MEDIA_CODEC_UNSUPPORTED: _demuxErrors.default.CODEC_UNSUPPORTED };exports.ErrorDetails = ErrorDetails;

/***/ }),
/* 150 */
/*!**************************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/flv.js/src/player/native-player.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

















var _events = _interopRequireDefault(__webpack_require__(/*! events */ 116));
var _playerEvents = _interopRequireDefault(__webpack_require__(/*! ./player-events.js */ 130));
var _config = __webpack_require__(/*! ../config.js */ 128);
var _exception = __webpack_require__(/*! ../utils/exception.js */ 119);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

// Player wrapper for browser's native player (HTMLVideoElement) without MediaSource src. 
var NativePlayer = /*#__PURE__*/function () {

  function NativePlayer(mediaDataSource, config) {_classCallCheck(this, NativePlayer);
    this.TAG = 'NativePlayer';
    this._type = 'NativePlayer';
    this._emitter = new _events.default();

    this._config = (0, _config.createDefaultConfig)();
    if (typeof config === 'object') {
      Object.assign(this._config, config);
    }

    if (mediaDataSource.type.toLowerCase() === 'flv') {
      throw new _exception.InvalidArgumentException('NativePlayer does\'t support flv MediaDataSource input!');
    }
    if (mediaDataSource.hasOwnProperty('segments')) {
      throw new _exception.InvalidArgumentException("NativePlayer(".concat(mediaDataSource.type, ") doesn't support multipart playback!"));
    }

    this.e = {
      onvLoadedMetadata: this._onvLoadedMetadata.bind(this) };


    this._pendingSeekTime = null;
    this._statisticsReporter = null;

    this._mediaDataSource = mediaDataSource;
    this._mediaElement = null;
  }_createClass(NativePlayer, [{ key: "destroy", value: function destroy()

    {
      if (this._mediaElement) {
        this.unload();
        this.detachMediaElement();
      }
      this.e = null;
      this._mediaDataSource = null;
      this._emitter.removeAllListeners();
      this._emitter = null;
    } }, { key: "on", value: function on(

    event, listener) {var _this = this;
      if (event === _playerEvents.default.MEDIA_INFO) {
        if (this._mediaElement != null && this._mediaElement.readyState !== 0) {// HAVE_NOTHING
          Promise.resolve().then(function () {
            _this._emitter.emit(_playerEvents.default.MEDIA_INFO, _this.mediaInfo);
          });
        }
      } else if (event === _playerEvents.default.STATISTICS_INFO) {
        if (this._mediaElement != null && this._mediaElement.readyState !== 0) {
          Promise.resolve().then(function () {
            _this._emitter.emit(_playerEvents.default.STATISTICS_INFO, _this.statisticsInfo);
          });
        }
      }
      this._emitter.addListener(event, listener);
    } }, { key: "off", value: function off(

    event, listener) {
      this._emitter.removeListener(event, listener);
    } }, { key: "attachMediaElement", value: function attachMediaElement(

    mediaElement) {
      this._mediaElement = mediaElement;
      mediaElement.addEventListener('loadedmetadata', this.e.onvLoadedMetadata);

      if (this._pendingSeekTime != null) {
        try {
          mediaElement.currentTime = this._pendingSeekTime;
          this._pendingSeekTime = null;
        } catch (e) {
          // IE11 may throw InvalidStateError if readyState === 0
          // Defer set currentTime operation after loadedmetadata
        }
      }
    } }, { key: "detachMediaElement", value: function detachMediaElement()

    {
      if (this._mediaElement) {
        this._mediaElement.src = '';
        this._mediaElement.removeAttribute('src');
        this._mediaElement.removeEventListener('loadedmetadata', this.e.onvLoadedMetadata);
        this._mediaElement = null;
      }
      if (this._statisticsReporter != null) {
        window.clearInterval(this._statisticsReporter);
        this._statisticsReporter = null;
      }
    } }, { key: "load", value: function load()

    {
      if (!this._mediaElement) {
        throw new _exception.IllegalStateException('HTMLMediaElement must be attached before load()!');
      }
      this._mediaElement.src = this._mediaDataSource.url;

      if (this._mediaElement.readyState > 0) {
        this._mediaElement.currentTime = 0;
      }

      this._mediaElement.preload = 'auto';
      this._mediaElement.load();
      this._statisticsReporter = window.setInterval(
      this._reportStatisticsInfo.bind(this),
      this._config.statisticsInfoReportInterval);
    } }, { key: "unload", value: function unload()

    {
      if (this._mediaElement) {
        this._mediaElement.src = '';
        this._mediaElement.removeAttribute('src');
      }
      if (this._statisticsReporter != null) {
        window.clearInterval(this._statisticsReporter);
        this._statisticsReporter = null;
      }
    } }, { key: "play", value: function play()

    {
      return this._mediaElement.play();
    } }, { key: "pause", value: function pause()

    {
      this._mediaElement.pause();
    } }, { key: "_onvLoadedMetadata", value: function _onvLoadedMetadata(




























































































    e) {
      if (this._pendingSeekTime != null) {
        this._mediaElement.currentTime = this._pendingSeekTime;
        this._pendingSeekTime = null;
      }
      this._emitter.emit(_playerEvents.default.MEDIA_INFO, this.mediaInfo);
    } }, { key: "_reportStatisticsInfo", value: function _reportStatisticsInfo()

    {
      this._emitter.emit(_playerEvents.default.STATISTICS_INFO, this.statisticsInfo);
    } }, { key: "type", get: function get() {return this._type;} }, { key: "buffered", get: function get() {return this._mediaElement.buffered;} }, { key: "duration", get: function get() {return this._mediaElement.duration;} }, { key: "volume", get: function get() {return this._mediaElement.volume;}, set: function set(value) {this._mediaElement.volume = value;} }, { key: "muted", get: function get() {return this._mediaElement.muted;}, set: function set(muted) {this._mediaElement.muted = muted;} }, { key: "currentTime", get: function get() {if (this._mediaElement) {return this._mediaElement.currentTime;}return 0;}, set: function set(seconds) {if (this._mediaElement) {this._mediaElement.currentTime = seconds;} else {this._pendingSeekTime = seconds;}} }, { key: "mediaInfo", get: function get() {var mediaPrefix = this._mediaElement instanceof HTMLAudioElement ? 'audio/' : 'video/';var info = { mimeType: mediaPrefix + this._mediaDataSource.type };if (this._mediaElement) {info.duration = Math.floor(this._mediaElement.duration * 1000);if (this._mediaElement instanceof HTMLVideoElement) {info.width = this._mediaElement.videoWidth;info.height = this._mediaElement.videoHeight;}}return info;} }, { key: "statisticsInfo", get: function get() {var info = { playerType: this._type, url: this._mediaDataSource.url };if (!(this._mediaElement instanceof HTMLVideoElement)) {return info;}var hasQualityInfo = true;var decoded = 0;var dropped = 0;if (this._mediaElement.getVideoPlaybackQuality) {var quality = this._mediaElement.getVideoPlaybackQuality();decoded = quality.totalVideoFrames;dropped = quality.droppedVideoFrames;} else if (this._mediaElement.webkitDecodedFrameCount != undefined) {decoded = this._mediaElement.webkitDecodedFrameCount;dropped = this._mediaElement.webkitDroppedFrameCount;} else {hasQualityInfo = false;}if (hasQualityInfo) {info.decodedFrames = decoded;info.droppedFrames = dropped;}return info;} }]);return NativePlayer;}();var _default =



NativePlayer;exports.default = _default;

/***/ }),
/* 151 */
/*!*******************************************************************!*\
  !*** E:/uin_test/zjlive/node_modules/dplayer/dist/DPlayer.min.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
!function (e, t) { true ? module.exports = t() : undefined;}(window, function () {return function (e) {var t = {};function n(i) {if (t[i]) return t[i].exports;var a = t[i] = { i: i, l: !1, exports: {} };return e[i].call(a.exports, a, a.exports, n), a.l = !0, a.exports;}return n.m = e, n.c = t, n.d = function (e, t, i) {n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i });}, n.r = function (e) {"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });}, n.t = function (e, t) {if (1 & t && (e = n(e)), 8 & t) return e;if (4 & t && "object" == typeof e && e && e.__esModule) return e;var i = Object.create(null);if (n.r(i), Object.defineProperty(i, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e) for (var a in e) {n.d(i, a, function (t) {return e[t];}.bind(null, a));}return i;}, n.n = function (e) {var t = e && e.__esModule ? function () {return e.default;} : function () {return e;};return n.d(t, "a", t), t;}, n.o = function (e, t) {return Object.prototype.hasOwnProperty.call(e, t);}, n.p = "/", n(n.s = 78);}([function (e, t, n) {"use strict";var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {return typeof e;} : function (e) {return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;},a = n(11),o = n(65),r = Object.prototype.toString;function s(e) {return "[object Array]" === r.call(e);}function l(e) {return null !== e && "object" === (void 0 === e ? "undefined" : i(e));}function c(e) {return "[object Function]" === r.call(e);}function u(e, t) {if (null !== e && void 0 !== e) if ("object" !== (void 0 === e ? "undefined" : i(e)) && (e = [e]), s(e)) for (var n = 0, a = e.length; n < a; n++) {t.call(null, e[n], n, e);} else for (var o in e) {Object.prototype.hasOwnProperty.call(e, o) && t.call(null, e[o], o, e);}}e.exports = { isArray: s, isArrayBuffer: function isArrayBuffer(e) {return "[object ArrayBuffer]" === r.call(e);}, isBuffer: o, isFormData: function isFormData(e) {return "undefined" != typeof FormData && e instanceof FormData;}, isArrayBufferView: function isArrayBufferView(e) {return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && e.buffer instanceof ArrayBuffer;}, isString: function isString(e) {return "string" == typeof e;}, isNumber: function isNumber(e) {return "number" == typeof e;}, isObject: l, isUndefined: function isUndefined(e) {return void 0 === e;}, isDate: function isDate(e) {return "[object Date]" === r.call(e);}, isFile: function isFile(e) {return "[object File]" === r.call(e);}, isBlob: function isBlob(e) {return "[object Blob]" === r.call(e);}, isFunction: c, isStream: function isStream(e) {return l(e) && c(e.pipe);}, isURLSearchParams: function isURLSearchParams(e) {return "undefined" != typeof URLSearchParams && e instanceof URLSearchParams;}, isStandardBrowserEnv: function isStandardBrowserEnv() {return ("undefined" == typeof navigator || "ReactNative" !== navigator.product) && "undefined" != typeof window && "undefined" != typeof document;}, forEach: u, merge: function e() {var t = {};function n(n, a) {"object" === i(t[a]) && "object" === (void 0 === n ? "undefined" : i(n)) ? t[a] = e(t[a], n) : t[a] = n;}for (var a = 0, o = arguments.length; a < o; a++) {u(arguments[a], n);}return t;}, extend: function extend(e, t, n) {return u(t, function (t, i) {e[i] = n && "function" == typeof t ? a(t, n) : t;}), e;}, trim: function trim(e) {return e.replace(/^\s*/, "").replace(/\s*$/, "");} };}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = /mobile/i.test(window.navigator.userAgent),a = { secondToTime: function secondToTime(e) {var t = Math.floor(e / 3600),n = Math.floor((e - 3600 * t) / 60),i = Math.floor(e - 3600 * t - 60 * n);return (t > 0 ? [t, n, i] : [n, i]).map(function (e) {return e < 10 ? "0" + e : "" + e;}).join(":");}, getElementViewLeft: function getElementViewLeft(e) {var t = e.offsetLeft,n = e.offsetParent,i = document.body.scrollLeft + document.documentElement.scrollLeft;if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) for (; null !== n && n !== e;) {t += n.offsetLeft, n = n.offsetParent;} else for (; null !== n;) {t += n.offsetLeft, n = n.offsetParent;}return t - i;}, getBoundingClientRectViewLeft: function getBoundingClientRectViewLeft(e) {var t = document.documentElement.scrollTop;if (e.getBoundingClientRect) {if ("number" != typeof this.getBoundingClientRectViewLeft.offset) {var n = document.createElement("div");n.style.cssText = "position:absolute;top:0;left:0;", document.body.appendChild(n), this.getBoundingClientRectViewLeft.offset = -n.getBoundingClientRect().top - t, document.body.removeChild(n), n = null;}var i = e.getBoundingClientRect(),a = this.getBoundingClientRectViewLeft.offset;return i.left + a;}return this.getElementViewLeft(e);}, getScrollPosition: function getScrollPosition() {return { left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0, top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0 };}, setScrollPosition: function setScrollPosition(e) {var t = e.left,n = void 0 === t ? 0 : t,i = e.top,a = void 0 === i ? 0 : i;this.isFirefox ? (document.documentElement.scrollLeft = n, document.documentElement.scrollTop = a) : window.scrollTo(n, a);}, isMobile: i, isFirefox: /firefox/i.test(window.navigator.userAgent), isChrome: /chrome/i.test(window.navigator.userAgent), storage: { set: function set(e, t) {localStorage.setItem(e, t);}, get: function get(e) {return localStorage.getItem(e);} }, cumulativeOffset: function cumulativeOffset(e) {var t = 0,n = 0;do {t += e.offsetTop || 0, n += e.offsetLeft || 0, e = e.offsetParent;} while (e);return { top: t, left: n };}, nameMap: { dragStart: i ? "touchstart" : "mousedown", dragMove: i ? "touchmove" : "mousemove", dragEnd: i ? "touchend" : "mouseup" }, color2Number: function color2Number(e) {return "#" === e[0] && (e = e.substr(1)), 3 === e.length && (e = "" + e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), parseInt(e, 16) + 0 & 16777215;}, number2Color: function number2Color(e) {return "#" + ("00000" + e.toString(16)).slice(-6);}, number2Type: function number2Type(e) {switch (e) {case 0:return "right";case 1:return "top";case 2:return "bottom";default:return "right";}} };t.default = a;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = b(n(46)),a = b(n(45)),o = b(n(44)),r = b(n(43)),s = b(n(42)),l = b(n(41)),c = b(n(40)),u = b(n(39)),d = b(n(38)),p = b(n(37)),h = b(n(36)),f = b(n(35)),y = b(n(34)),m = b(n(33)),v = b(n(32)),g = b(n(31));function b(e) {return e && e.__esModule ? e : { default: e };}var w = { play: i.default, pause: a.default, volumeUp: o.default, volumeDown: r.default, volumeOff: s.default, full: l.default, fullWeb: c.default, setting: u.default, right: d.default, comment: p.default, commentOff: h.default, send: f.default, pallette: y.default, camera: m.default, subtitle: v.default, loading: g.default };t.default = w;}, function (e, t, n) {"use strict";(function (t) {var i = n(0),a = n(63),o = { "Content-Type": "application/x-www-form-urlencoded" };function r(e, t) {!i.isUndefined(e) && i.isUndefined(e["Content-Type"]) && (e["Content-Type"] = t);}var s,l = { adapter: ("undefined" != typeof XMLHttpRequest ? s = n(10) : void 0 !== t && (s = n(10)), s), transformRequest: [function (e, t) {return a(t, "Content-Type"), i.isFormData(e) || i.isArrayBuffer(e) || i.isBuffer(e) || i.isStream(e) || i.isFile(e) || i.isBlob(e) ? e : i.isArrayBufferView(e) ? e.buffer : i.isURLSearchParams(e) ? (r(t, "application/x-www-form-urlencoded;charset=utf-8"), e.toString()) : i.isObject(e) ? (r(t, "application/json;charset=utf-8"), JSON.stringify(e)) : e;}], transformResponse: [function (e) {if ("string" == typeof e) try {e = JSON.parse(e);} catch (e) {}return e;}], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, validateStatus: function validateStatus(e) {return e >= 200 && e < 300;} };l.headers = { common: { Accept: "application/json, text/plain, */*" } }, i.forEach(["delete", "get", "head"], function (e) {l.headers[e] = {};}), i.forEach(["post", "put", "patch"], function (e) {l.headers[e] = i.merge(o);}), e.exports = l;}).call(this, n(12));}, function (e, t, n) {"use strict";var i,a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {return typeof e;} : function (e) {return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;};i = function () {return this;}();try {i = i || Function("return this")() || (0, eval)("this");} catch (e) {"object" === ("undefined" == typeof window ? "undefined" : a(window)) && (i = window);}e.exports = i;}, function (e, t, n) {var i = n(6);e.exports = function (e) {"use strict";var t = "",n = (e = e || {}).enableSubtitle,a = e.subtitle,o = e.current,r = e.pic,s = i.$escape,l = e.screenshot,c = e.preload,u = e.url;n = a && "webvtt" === a.type;return t += '\n<video\n    class="dplayer-video ', o && (t += "dplayer-video-current"), t += '"\n    webkit-playsinline\n    playsinline\n    ', r && (t += 'poster="', t += s(r), t += '"'), t += "\n    ", (l || n) && (t += 'crossorigin="anonymous"'), t += "\n    ", c && (t += 'preload="', t += s(c), t += '"'), t += "\n    ", u && (t += 'src="', t += s(u), t += '"'), t += "\n    >\n    ", n && (t += '\n    <track kind="metadata" default src="', t += s(a.url), t += '"></track>\n    '), t += "\n</video>";};}, function (e, t, n) {"use strict";e.exports = n(29);}, function (e, t, n) {"use strict";function i(e) {this.message = e;}i.prototype.toString = function () {return "Cancel" + (this.message ? ": " + this.message : "");}, i.prototype.__CANCEL__ = !0, e.exports = i;}, function (e, t, n) {"use strict";e.exports = function (e) {return !(!e || !e.__CANCEL__);};}, function (e, t, n) {"use strict";var i = n(61);e.exports = function (e, t, n, a, o) {var r = new Error(e);return i(r, t, n, a, o);};}, function (e, t, n) {"use strict";var i = n(0),a = n(62),o = n(60),r = n(59),s = n(58),l = n(9),c = "undefined" != typeof window && window.btoa && window.btoa.bind(window) || n(57);e.exports = function (e) {return new Promise(function (t, u) {var d = e.data,p = e.headers;i.isFormData(d) && delete p["Content-Type"];var h = new XMLHttpRequest(),f = "onreadystatechange",y = !1;if ("undefined" == typeof window || !window.XDomainRequest || "withCredentials" in h || s(e.url) || (h = new window.XDomainRequest(), f = "onload", y = !0, h.onprogress = function () {}, h.ontimeout = function () {}), e.auth) {var m = e.auth.username || "",v = e.auth.password || "";p.Authorization = "Basic " + c(m + ":" + v);}if (h.open(e.method.toUpperCase(), o(e.url, e.params, e.paramsSerializer), !0), h.timeout = e.timeout, h[f] = function () {if (h && (4 === h.readyState || y) && (0 !== h.status || h.responseURL && 0 === h.responseURL.indexOf("file:"))) {var n = "getAllResponseHeaders" in h ? r(h.getAllResponseHeaders()) : null,i = { data: e.responseType && "text" !== e.responseType ? h.response : h.responseText, status: 1223 === h.status ? 204 : h.status, statusText: 1223 === h.status ? "No Content" : h.statusText, headers: n, config: e, request: h };a(t, u, i), h = null;}}, h.onerror = function () {u(l("Network Error", e, null, h)), h = null;}, h.ontimeout = function () {u(l("timeout of " + e.timeout + "ms exceeded", e, "ECONNABORTED", h)), h = null;}, i.isStandardBrowserEnv()) {var g = n(56),b = (e.withCredentials || s(e.url)) && e.xsrfCookieName ? g.read(e.xsrfCookieName) : void 0;b && (p[e.xsrfHeaderName] = b);}if ("setRequestHeader" in h && i.forEach(p, function (e, t) {void 0 === d && "content-type" === t.toLowerCase() ? delete p[t] : h.setRequestHeader(t, e);}), e.withCredentials && (h.withCredentials = !0), e.responseType) try {h.responseType = e.responseType;} catch (t) {if ("json" !== e.responseType) throw t;}"function" == typeof e.onDownloadProgress && h.addEventListener("progress", e.onDownloadProgress), "function" == typeof e.onUploadProgress && h.upload && h.upload.addEventListener("progress", e.onUploadProgress), e.cancelToken && e.cancelToken.promise.then(function (e) {h && (h.abort(), u(e), h = null);}), void 0 === d && (d = null), h.send(d);});};}, function (e, t, n) {"use strict";e.exports = function (e, t) {return function () {for (var n = new Array(arguments.length), i = 0; i < n.length; i++) {n[i] = arguments[i];}return e.apply(t, n);};};}, function (e, t, n) {"use strict";var i,a,o = e.exports = {};function r() {throw new Error("setTimeout has not been defined");}function s() {throw new Error("clearTimeout has not been defined");}function l(e) {if (i === setTimeout) return setTimeout(e, 0);if ((i === r || !i) && setTimeout) return i = setTimeout, setTimeout(e, 0);try {return i(e, 0);} catch (t) {try {return i.call(null, e, 0);} catch (t) {return i.call(this, e, 0);}}}!function () {try {i = "function" == typeof setTimeout ? setTimeout : r;} catch (e) {i = r;}try {a = "function" == typeof clearTimeout ? clearTimeout : s;} catch (e) {a = s;}}();var c,u = [],d = !1,p = -1;function h() {d && c && (d = !1, c.length ? u = c.concat(u) : p = -1, u.length && f());}function f() {if (!d) {var e = l(h);d = !0;for (var t = u.length; t;) {for (c = u, u = []; ++p < t;) {c && c[p].run();}p = -1, t = u.length;}c = null, d = !1, function (e) {if (a === clearTimeout) return clearTimeout(e);if ((a === s || !a) && clearTimeout) return a = clearTimeout, clearTimeout(e);try {a(e);} catch (t) {try {return a.call(null, e);} catch (t) {return a.call(this, e);}}}(e);}}function y(e, t) {this.fun = e, this.array = t;}function m() {}o.nextTick = function (e) {var t = new Array(arguments.length - 1);if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) {t[n - 1] = arguments[n];}u.push(new y(e, t)), 1 !== u.length || d || l(f);}, y.prototype.run = function () {this.fun.apply(null, this.array);}, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = m, o.addListener = m, o.once = m, o.off = m, o.removeListener = m, o.removeAllListeners = m, o.emit = m, o.prependListener = m, o.prependOnceListener = m, o.listeners = function (e) {return [];}, o.binding = function (e) {throw new Error("process.binding is not supported");}, o.cwd = function () {return "/";}, o.chdir = function (e) {throw new Error("process.chdir is not supported");}, o.umask = function () {return 0;};}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}();var a = function () {function e(t) {var n = this;!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.container = t.template.infoPanel, this.template = t.template, this.video = t.video, this.player = t, this.template.infoPanelClose.addEventListener("click", function () {n.hide();});}return i(e, [{ key: "show", value: function value() {this.beginTime = Date.now(), this.update(), this.player.timer.enable("info"), this.player.timer.enable("fps"), this.container.classList.remove("dplayer-info-panel-hide");} }, { key: "hide", value: function value() {this.player.timer.disable("info"), this.player.timer.disable("fps"), this.container.classList.add("dplayer-info-panel-hide");} }, { key: "triggle", value: function value() {this.container.classList.contains("dplayer-info-panel-hide") ? this.show() : this.hide();} }, { key: "update", value: function value() {this.template.infoVersion.innerHTML = "v1.25.0 fdcf45b", this.template.infoType.innerHTML = this.player.type, this.template.infoUrl.innerHTML = this.player.options.video.url, this.template.infoResolution.innerHTML = this.player.video.videoWidth + " x " + this.player.video.videoHeight, this.template.infoDuration.innerHTML = this.player.video.duration, this.player.options.danmaku && (this.template.infoDanmakuId.innerHTML = this.player.options.danmaku.id, this.template.infoDanmakuApi.innerHTML = this.player.options.danmaku.api, this.template.infoDanmakuAmount.innerHTML = this.player.danmaku.dan.length);} }, { key: "fps", value: function value(e) {this.template.infoFPS.innerHTML = "" + e.toFixed(1);} }]), e;}();t.default = a;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}();var a = function () {function e(t) {var n = this;!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.player = t, this.shown = !1, Array.prototype.slice.call(this.player.template.menuItem).forEach(function (e, t) {n.player.options.contextmenu[t].click && e.addEventListener("click", function () {n.player.options.contextmenu[t].click(n.player), n.hide();});}), this.player.container.addEventListener("contextmenu", function (e) {if (n.shown) n.hide();else {var t = e || window.event;t.preventDefault();var i = n.player.container.getBoundingClientRect();n.show(t.clientX - i.left, t.clientY - i.top), n.player.template.mask.addEventListener("click", function () {n.hide();});}});}return i(e, [{ key: "show", value: function value(e, t) {this.player.template.menu.classList.add("dplayer-menu-show");var n = this.player.container.getBoundingClientRect();e + this.player.template.menu.offsetWidth >= n.width ? (this.player.template.menu.style.right = n.width - e + "px", this.player.template.menu.style.left = "initial") : (this.player.template.menu.style.left = e + "px", this.player.template.menu.style.right = "initial"), t + this.player.template.menu.offsetHeight >= n.height ? (this.player.template.menu.style.bottom = n.height - t + "px", this.player.template.menu.style.top = "initial") : (this.player.template.menu.style.top = t + "px", this.player.template.menu.style.bottom = "initial"), this.player.template.mask.classList.add("dplayer-mask-show"), this.shown = !0, this.player.events.trigger("contextmenu_show");} }, { key: "hide", value: function value() {this.player.template.mask.classList.remove("dplayer-mask-show"), this.player.template.menu.classList.remove("dplayer-menu-show"), this.shown = !1, this.player.events.trigger("contextmenu_hide");} }]), e;}();t.default = a;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });t.default = function e(t) {!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), t.options.hotkey && document.addEventListener("keydown", function (e) {if (t.focus) {var n = document.activeElement.tagName.toUpperCase(),i = document.activeElement.getAttribute("contenteditable");if ("INPUT" !== n && "TEXTAREA" !== n && "" !== i && "true" !== i) {var a = e || window.event,o = void 0;switch (a.keyCode) {case 32:a.preventDefault(), t.toggle();break;case 37:a.preventDefault(), t.seek(t.video.currentTime - 5), t.controller.setAutoHide();break;case 39:a.preventDefault(), t.seek(t.video.currentTime + 5), t.controller.setAutoHide();break;case 38:a.preventDefault(), o = t.volume() + .1, t.volume(o);break;case 40:a.preventDefault(), o = t.volume() - .1, t.volume(o);}}}}), document.addEventListener("keydown", function (e) {switch ((e || window.event).keyCode) {case 27:t.fullScreen.isFullScreen("web") && t.fullScreen.cancel("web");}});};}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i,a = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}(),o = n(1),r = (i = o) && i.__esModule ? i : { default: i };var s = function () {function e(t) {var n = this;!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.player = t, this.player.template.mask.addEventListener("click", function () {n.hide();}), this.player.template.commentButton.addEventListener("click", function () {n.show();}), this.player.template.commentSettingButton.addEventListener("click", function () {n.toggleSetting();}), this.player.template.commentColorSettingBox.addEventListener("click", function () {if (n.player.template.commentColorSettingBox.querySelector("input:checked+span")) {var e = n.player.template.commentColorSettingBox.querySelector("input:checked").value;n.player.template.commentSettingFill.style.fill = e, n.player.template.commentInput.style.color = e, n.player.template.commentSendFill.style.fill = e;}}), this.player.template.commentInput.addEventListener("click", function () {n.hideSetting();}), this.player.template.commentInput.addEventListener("keydown", function (e) {13 === (e || window.event).keyCode && n.send();}), this.player.template.commentSendButton.addEventListener("click", function () {n.send();});}return a(e, [{ key: "show", value: function value() {this.player.controller.disableAutoHide = !0, this.player.template.controller.classList.add("dplayer-controller-comment"), this.player.template.mask.classList.add("dplayer-mask-show"), this.player.container.classList.add("dplayer-show-controller"), this.player.template.commentInput.focus();} }, { key: "hide", value: function value() {this.player.template.controller.classList.remove("dplayer-controller-comment"), this.player.template.mask.classList.remove("dplayer-mask-show"), this.player.container.classList.remove("dplayer-show-controller"), this.player.controller.disableAutoHide = !1, this.hideSetting();} }, { key: "showSetting", value: function value() {this.player.template.commentSettingBox.classList.add("dplayer-comment-setting-open");} }, { key: "hideSetting", value: function value() {this.player.template.commentSettingBox.classList.remove("dplayer-comment-setting-open");} }, { key: "toggleSetting", value: function value() {this.player.template.commentSettingBox.classList.contains("dplayer-comment-setting-open") ? this.hideSetting() : this.showSetting();} }, { key: "send", value: function value() {var e = this;this.player.template.commentInput.blur(), this.player.template.commentInput.value.replace(/^\s+|\s+$/g, "") ? this.player.danmaku.send({ text: this.player.template.commentInput.value, color: r.default.color2Number(this.player.container.querySelector(".dplayer-comment-setting-color input:checked").value), type: parseInt(this.player.container.querySelector(".dplayer-comment-setting-type input:checked").value) }, function () {e.player.template.commentInput.value = "", e.hide();}) : this.player.notice(this.player.tran("Please input danmaku content!"));} }]), e;}();t.default = s;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i,a = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}(),o = n(1),r = (i = o) && i.__esModule ? i : { default: i };var s = function () {function e(t) {var n = this;!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.player = t, this.player.template.mask.addEventListener("click", function () {n.hide();}), this.player.template.settingButton.addEventListener("click", function () {n.show();}), this.loop = this.player.options.loop, this.player.template.loopToggle.checked = this.loop, this.player.template.loop.addEventListener("click", function () {n.player.template.loopToggle.checked = !n.player.template.loopToggle.checked, n.player.template.loopToggle.checked ? n.loop = !0 : n.loop = !1, n.hide();}), this.showDanmaku = this.player.user.get("danmaku"), this.showDanmaku || this.player.danmaku && this.player.danmaku.hide(), this.player.template.showDanmakuToggle.checked = this.showDanmaku, this.player.template.showDanmaku.addEventListener("click", function () {n.player.template.showDanmakuToggle.checked = !n.player.template.showDanmakuToggle.checked, n.player.template.showDanmakuToggle.checked ? (n.showDanmaku = !0, n.player.danmaku.show()) : (n.showDanmaku = !1, n.player.danmaku.hide()), n.player.user.set("danmaku", n.showDanmaku ? 1 : 0), n.hide();}), this.unlimitDanmaku = this.player.user.get("unlimited"), this.player.template.unlimitDanmakuToggle.checked = this.unlimitDanmaku, this.player.template.unlimitDanmaku.addEventListener("click", function () {n.player.template.unlimitDanmakuToggle.checked = !n.player.template.unlimitDanmakuToggle.checked, n.player.template.unlimitDanmakuToggle.checked ? (n.unlimitDanmaku = !0, n.player.danmaku.unlimit(!0)) : (n.unlimitDanmaku = !1, n.player.danmaku.unlimit(!1)), n.player.user.set("unlimited", n.unlimitDanmaku ? 1 : 0), n.hide();}), this.player.template.speed.addEventListener("click", function () {n.player.template.settingBox.classList.add("dplayer-setting-box-narrow"), n.player.template.settingBox.classList.add("dplayer-setting-box-speed");});for (var i = function i(e) {n.player.template.speedItem[e].addEventListener("click", function () {n.player.speed(n.player.template.speedItem[e].dataset.speed), n.hide();});}, a = 0; a < this.player.template.speedItem.length; a++) {i(a);}if (this.player.danmaku) {this.player.on("danmaku_opacity", function (e) {n.player.bar.set("danmaku", e, "width"), n.player.user.set("opacity", e);}), this.player.danmaku.opacity(this.player.user.get("opacity"));var o = function o(e) {var t = e || window.event,i = ((t.clientX || t.changedTouches[0].clientX) - r.default.getBoundingClientRectViewLeft(n.player.template.danmakuOpacityBarWrap)) / 130;i = Math.max(i, 0), i = Math.min(i, 1), n.player.danmaku.opacity(i);},s = function e() {document.removeEventListener(r.default.nameMap.dragEnd, e), document.removeEventListener(r.default.nameMap.dragMove, o), n.player.template.danmakuOpacityBox.classList.remove("dplayer-setting-danmaku-active");};this.player.template.danmakuOpacityBarWrapWrap.addEventListener("click", function (e) {var t = e || window.event,i = ((t.clientX || t.changedTouches[0].clientX) - r.default.getBoundingClientRectViewLeft(n.player.template.danmakuOpacityBarWrap)) / 130;i = Math.max(i, 0), i = Math.min(i, 1), n.player.danmaku.opacity(i);}), this.player.template.danmakuOpacityBarWrapWrap.addEventListener(r.default.nameMap.dragStart, function () {document.addEventListener(r.default.nameMap.dragMove, o), document.addEventListener(r.default.nameMap.dragEnd, s), n.player.template.danmakuOpacityBox.classList.add("dplayer-setting-danmaku-active");});}}return a(e, [{ key: "hide", value: function value() {var e = this;this.player.template.settingBox.classList.remove("dplayer-setting-box-open"), this.player.template.mask.classList.remove("dplayer-mask-show"), setTimeout(function () {e.player.template.settingBox.classList.remove("dplayer-setting-box-narrow"), e.player.template.settingBox.classList.remove("dplayer-setting-box-speed");}, 300), this.player.controller.disableAutoHide = !1;} }, { key: "show", value: function value() {this.player.template.settingBox.classList.add("dplayer-setting-box-open"), this.player.template.mask.classList.add("dplayer-mask-show"), this.player.controller.disableAutoHide = !0;} }]), e;}();t.default = s;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}();var a = function () {function e(t) {!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.container = t.container, this.barWidth = t.barWidth, this.container.style.backgroundImage = "url('" + t.url + "')", this.events = t.events;}return i(e, [{ key: "resize", value: function value(e, t) {this.container.style.width = e + "px", this.container.style.height = t + "px", this.container.style.top = 2 - t + "px";} }, { key: "show", value: function value() {this.container.style.display = "block", this.events && this.events.trigger("thumbnails_show");} }, { key: "move", value: function value(e) {this.container.style.backgroundPosition = "-" + 160 * (Math.ceil(e / this.barWidth * 100) - 1) + "px 0", this.container.style.left = Math.min(Math.max(e - this.container.offsetWidth / 2, -10), this.barWidth - 150) + "px";} }, { key: "hide", value: function value() {this.container.style.display = "none", this.events && this.events.trigger("thumbnails_hide");} }]), e;}();t.default = a;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}(),a = s(n(1)),o = s(n(18)),r = s(n(2));function s(e) {return e && e.__esModule ? e : { default: e };}var l = function () {function e(t) {var n = this;!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.player = t, this.autoHideTimer = 0, a.default.isMobile || (this.player.container.addEventListener("mousemove", function () {n.setAutoHide();}), this.player.container.addEventListener("click", function () {n.setAutoHide();}), this.player.on("play", function () {n.setAutoHide();}), this.player.on("pause", function () {n.setAutoHide();})), this.initPlayButton(), this.initThumbnails(), this.initPlayedBar(), this.initFullButton(), this.initQualityButton(), this.initScreenshotButton(), this.initSubtitleButton(), this.initHighlights(), a.default.isMobile || this.initVolumeButton();}return i(e, [{ key: "initPlayButton", value: function value() {var e = this;this.player.template.playButton.addEventListener("click", function () {e.player.toggle();}), a.default.isMobile ? (this.player.template.videoWrap.addEventListener("click", function () {e.toggle();}), this.player.template.controllerMask.addEventListener("click", function () {e.toggle();})) : (this.player.template.videoWrap.addEventListener("click", function () {e.player.toggle();}), this.player.template.controllerMask.addEventListener("click", function () {e.player.toggle();}));} }, { key: "initHighlights", value: function value() {var e = this;this.player.on("durationchange", function () {if (1 !== e.player.video.duration && e.player.video.duration !== 1 / 0 && e.player.options.highlight) {var t = document.querySelectorAll(".dplayer-highlight");[].slice.call(t, 0).forEach(function (t) {e.player.template.playedBarWrap.removeChild(t);});for (var n = 0; n < e.player.options.highlight.length; n++) {if (e.player.options.highlight[n].text && e.player.options.highlight[n].time) {var i = document.createElement("div");i.classList.add("dplayer-highlight"), i.style.left = e.player.options.highlight[n].time / e.player.video.duration * 100 + "%", i.innerHTML = '<span class="dplayer-highlight-text">' + e.player.options.highlight[n].text + "</span>", e.player.template.playedBarWrap.insertBefore(i, e.player.template.playedBarTime);}}}});} }, { key: "initThumbnails", value: function value() {var e = this;this.player.options.video.thumbnails && (this.thumbnails = new o.default({ container: this.player.template.barPreview, barWidth: this.player.template.barWrap.offsetWidth, url: this.player.options.video.thumbnails, events: this.player.events }), this.player.on("loadedmetadata", function () {e.thumbnails.resize(160, e.player.video.videoHeight / e.player.video.videoWidth * 160);}));} }, { key: "initPlayedBar", value: function value() {var e = this,t = function t(_t) {var n = ((_t.clientX || _t.changedTouches[0].clientX) - a.default.getBoundingClientRectViewLeft(e.player.template.playedBarWrap)) / e.player.template.playedBarWrap.clientWidth;n = Math.max(n, 0), n = Math.min(n, 1), e.player.bar.set("played", n, "width"), e.player.template.ptime.innerHTML = a.default.secondToTime(n * e.player.video.duration);},n = function n(i) {document.removeEventListener(a.default.nameMap.dragEnd, n), document.removeEventListener(a.default.nameMap.dragMove, t);var o = ((i.clientX || i.changedTouches[0].clientX) - a.default.getBoundingClientRectViewLeft(e.player.template.playedBarWrap)) / e.player.template.playedBarWrap.clientWidth;o = Math.max(o, 0), o = Math.min(o, 1), e.player.bar.set("played", o, "width"), e.player.seek(e.player.bar.get("played") * e.player.video.duration), e.player.timer.enable("progress");};this.player.template.playedBarWrap.addEventListener(a.default.nameMap.dragStart, function () {e.player.timer.disable("progress"), document.addEventListener(a.default.nameMap.dragMove, t), document.addEventListener(a.default.nameMap.dragEnd, n);}), this.player.template.playedBarWrap.addEventListener(a.default.nameMap.dragMove, function (t) {if (e.player.video.duration) {var n = a.default.cumulativeOffset(e.player.template.playedBarWrap).left,i = (t.clientX || t.changedTouches[0].clientX) - n;if (i < 0 || i > e.player.template.playedBarWrap.offsetWidth) return;var o = e.player.video.duration * (i / e.player.template.playedBarWrap.offsetWidth);a.default.isMobile && e.thumbnails && e.thumbnails.show(), e.thumbnails && e.thumbnails.move(i), e.player.template.playedBarTime.style.left = i - (o >= 3600 ? 25 : 20) + "px", e.player.template.playedBarTime.innerText = a.default.secondToTime(o), e.player.template.playedBarTime.classList.remove("hidden");}}), this.player.template.playedBarWrap.addEventListener(a.default.nameMap.dragEnd, function () {a.default.isMobile && e.thumbnails && e.thumbnails.hide();}), a.default.isMobile || (this.player.template.playedBarWrap.addEventListener("mouseenter", function () {e.player.video.duration && (e.thumbnails && e.thumbnails.show(), e.player.template.playedBarTime.classList.remove("hidden"));}), this.player.template.playedBarWrap.addEventListener("mouseleave", function () {e.player.video.duration && (e.thumbnails && e.thumbnails.hide(), e.player.template.playedBarTime.classList.add("hidden"));}));} }, { key: "initFullButton", value: function value() {var e = this;this.player.template.browserFullButton.addEventListener("click", function () {e.player.fullScreen.toggle("browser");}), this.player.template.webFullButton.addEventListener("click", function () {e.player.fullScreen.toggle("web");});} }, { key: "initVolumeButton", value: function value() {var e = this,t = function t(_t2) {var n = _t2 || window.event,i = ((n.clientX || n.changedTouches[0].clientX) - a.default.getBoundingClientRectViewLeft(e.player.template.volumeBarWrap) - 5.5) / 35;e.player.volume(i);},n = function n() {document.removeEventListener(a.default.nameMap.dragEnd, n), document.removeEventListener(a.default.nameMap.dragMove, t), e.player.template.volumeButton.classList.remove("dplayer-volume-active");};this.player.template.volumeBarWrapWrap.addEventListener("click", function (t) {var n = t || window.event,i = ((n.clientX || n.changedTouches[0].clientX) - a.default.getBoundingClientRectViewLeft(e.player.template.volumeBarWrap) - 5.5) / 35;e.player.volume(i);}), this.player.template.volumeBarWrapWrap.addEventListener(a.default.nameMap.dragStart, function () {document.addEventListener(a.default.nameMap.dragMove, t), document.addEventListener(a.default.nameMap.dragEnd, n), e.player.template.volumeButton.classList.add("dplayer-volume-active");}), this.player.template.volumeButtonIcon.addEventListener("click", function () {e.player.video.muted ? (e.player.video.muted = !1, e.player.switchVolumeIcon(), e.player.bar.set("volume", e.player.volume(), "width")) : (e.player.video.muted = !0, e.player.template.volumeIcon.innerHTML = r.default.volumeOff, e.player.bar.set("volume", 0, "width"));});} }, { key: "initQualityButton", value: function value() {var e = this;this.player.options.video.quality && this.player.template.qualityList.addEventListener("click", function (t) {t.target.classList.contains("dplayer-quality-item") && e.player.switchQuality(t.target.dataset.index);});} }, { key: "initScreenshotButton", value: function value() {var e = this;this.player.options.screenshot && this.player.template.camareButton.addEventListener("click", function () {var t = document.createElement("canvas");t.width = e.player.video.videoWidth, t.height = e.player.video.videoHeight, t.getContext("2d").drawImage(e.player.video, 0, 0, t.width, t.height);var n = void 0;t.toBlob(function (e) {n = URL.createObjectURL(e);var t = document.createElement("a");t.href = n, t.download = "DPlayer.png", t.style.display = "none", document.body.appendChild(t), t.click(), document.body.removeChild(t), URL.revokeObjectURL(n);}), e.player.events.trigger("screenshot", n);});} }, { key: "initSubtitleButton", value: function value() {var e = this;this.player.options.subtitle && (this.player.events.on("subtitle_show", function () {e.player.template.subtitleButton.dataset.balloon = e.player.tran("Hide subtitle"), e.player.template.subtitleButtonInner.style.opacity = "", e.player.user.set("subtitle", 1);}), this.player.events.on("subtitle_hide", function () {e.player.template.subtitleButton.dataset.balloon = e.player.tran("Show subtitle"), e.player.template.subtitleButtonInner.style.opacity = "0.4", e.player.user.set("subtitle", 0);}), this.player.template.subtitleButton.addEventListener("click", function () {e.player.subtitle.toggle();}));} }, { key: "setAutoHide", value: function value() {var e = this;this.show(), clearTimeout(this.autoHideTimer), this.autoHideTimer = setTimeout(function () {!e.player.video.played.length || e.player.paused || e.disableAutoHide || e.hide();}, 3e3);} }, { key: "show", value: function value() {this.player.container.classList.remove("dplayer-hide-controller");} }, { key: "hide", value: function value() {this.player.container.classList.add("dplayer-hide-controller"), this.player.setting.hide(), this.player.comment && this.player.comment.hide();} }, { key: "isShow", value: function value() {return !this.player.container.classList.contains("dplayer-hide-controller");} }, { key: "toggle", value: function value() {this.isShow() ? this.hide() : this.show();} }, { key: "destroy", value: function value() {clearTimeout(this.autoHideTimer);} }]), e;}();t.default = l;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}();var a = function () {function e(t) {var n = this;!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.container = t, this.container.addEventListener("animationend", function () {n.container.classList.remove("dplayer-bezel-transition");});}return i(e, [{ key: "switch", value: function value(e) {this.container.innerHTML = e, this.container.classList.add("dplayer-bezel-transition");} }]), e;}();t.default = a;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}();var a = function () {function e(t) {!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.player = t, window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (e) {window.setTimeout(e, 1e3 / 60);}, this.types = ["loading", "info", "fps"], this.init();}return i(e, [{ key: "init", value: function value() {var e = this;this.types.map(function (t) {return "fps" !== t && e["init" + t + "Checker"](), t;});} }, { key: "initloadingChecker", value: function value() {var e = this,t = 0,n = 0,i = !1;this.loadingChecker = setInterval(function () {e.enableloadingChecker && (n = e.player.video.currentTime, i || n !== t || e.player.video.paused || (e.player.container.classList.add("dplayer-loading"), i = !0), i && n > t && !e.player.video.paused && (e.player.container.classList.remove("dplayer-loading"), i = !1), t = n);}, 100);} }, { key: "initfpsChecker", value: function value() {var e = this;window.requestAnimationFrame(function () {if (e.enablefpsChecker) {if (e.initfpsChecker(), e.fpsStart) {e.fpsIndex++;var t = new Date();t - e.fpsStart > 1e3 && (e.player.infoPanel.fps(e.fpsIndex / (t - e.fpsStart) * 1e3), e.fpsStart = new Date(), e.fpsIndex = 0);} else e.fpsStart = new Date(), e.fpsIndex = 0;} else e.fpsStart = 0, e.fpsIndex = 0;});} }, { key: "initinfoChecker", value: function value() {var e = this;this.infoChecker = setInterval(function () {e.enableinfoChecker && e.player.infoPanel.update();}, 1e3);} }, { key: "enable", value: function value(e) {this["enable" + e + "Checker"] = !0, "fps" === e && this.initfpsChecker();} }, { key: "disable", value: function value(e) {this["enable" + e + "Checker"] = !1;} }, { key: "destroy", value: function value() {var e = this;this.types.map(function (t) {return e["enable" + t + "Checker"] = !1, e[t + "Checker"] && clearInterval(e[t + "Checker"]), t;});} }]), e;}();t.default = a;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}();var a = function () {function e(t) {!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.elements = {}, this.elements.volume = t.volumeBar, this.elements.played = t.playedBar, this.elements.loaded = t.loadedBar, this.elements.danmaku = t.danmakuOpacityBar;}return i(e, [{ key: "set", value: function value(e, t, n) {t = Math.max(t, 0), t = Math.min(t, 1), this.elements[e].style[n] = 100 * t + "%";} }, { key: "get", value: function value(e) {return parseFloat(this.elements[e].style.width) / 100;} }]), e;}();t.default = a;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}();var a = function () {function e(t, n, i, a) {!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.container = t, this.video = n, this.options = i, this.events = a, this.init();}return i(e, [{ key: "init", value: function value() {var e = this;if (this.container.style.fontSize = this.options.fontSize, this.container.style.bottom = this.options.bottom, this.container.style.color = this.options.color, this.video.textTracks && this.video.textTracks[0]) {var t = this.video.textTracks[0];t.oncuechange = function () {var n = t.activeCues[0];if (n) {e.container.innerHTML = "";var i = document.createElement("p");i.appendChild(n.getCueAsHTML()), e.container.appendChild(i);} else e.container.innerHTML = "";e.events.trigger("subtitle_change");};}} }, { key: "show", value: function value() {this.container.classList.remove("dplayer-subtitle-hide"), this.events.trigger("subtitle_show");} }, { key: "hide", value: function value() {this.container.classList.add("dplayer-subtitle-hide"), this.events.trigger("subtitle_hide");} }, { key: "toggle", value: function value() {this.container.classList.contains("dplayer-subtitle-hide") ? this.show() : this.hide();} }]), e;}();t.default = a;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i,a = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}(),o = n(1),r = (i = o) && i.__esModule ? i : { default: i };var s = function () {function e(t) {!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.storageName = { opacity: "dplayer-danmaku-opacity", volume: "dplayer-volume", unlimited: "dplayer-danmaku-unlimited", danmaku: "dplayer-danmaku-show", subtitle: "dplayer-subtitle-show" }, this.default = { opacity: .7, volume: t.options.hasOwnProperty("volume") ? t.options.volume : .7, unlimited: (t.options.danmaku && t.options.danmaku.unlimited ? 1 : 0) || 0, danmaku: 1, subtitle: 1 }, this.data = {}, this.init();}return a(e, [{ key: "init", value: function value() {for (var e in this.storageName) {var t = this.storageName[e];this.data[e] = parseFloat(r.default.storage.get(t) || this.default[e]);}} }, { key: "get", value: function value(e) {return this.data[e];} }, { key: "set", value: function value(e, t) {this.data[e] = t, r.default.storage.set(this.storageName[e], t);} }]), e;}();t.default = s;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i,a = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}(),o = n(1),r = (i = o) && i.__esModule ? i : { default: i };var s = function () {function e(t) {var n = this;!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.player = t, this.player.events.on("webfullscreen", function () {n.player.resize();}), this.player.events.on("webfullscreen_cancel", function () {n.player.resize(), r.default.setScrollPosition(n.lastScrollPosition);});var i = function i() {n.player.resize(), n.isFullScreen("browser") ? n.player.events.trigger("fullscreen") : (r.default.setScrollPosition(n.lastScrollPosition), n.player.events.trigger("fullscreen_cancel"));},a = function a() {var e = document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;e && e !== n.player.container || (n.player.resize(), e ? n.player.events.trigger("fullscreen") : (r.default.setScrollPosition(n.lastScrollPosition), n.player.events.trigger("fullscreen_cancel")));};/Firefox/.test(navigator.userAgent) ? (document.addEventListener("mozfullscreenchange", a), document.addEventListener("fullscreenchange", a)) : (this.player.container.addEventListener("fullscreenchange", i), this.player.container.addEventListener("webkitfullscreenchange", i), document.addEventListener("msfullscreenchange", a), document.addEventListener("MSFullscreenChange", a));}return a(e, [{ key: "isFullScreen", value: function value() {switch (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "browser") {case "browser":return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;case "web":return this.player.container.classList.contains("dplayer-fulled");}} }, { key: "request", value: function value() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "browser",t = "browser" === e ? "web" : "browser",n = this.isFullScreen(t);switch (n || (this.lastScrollPosition = r.default.getScrollPosition()), e) {case "browser":this.player.container.requestFullscreen ? this.player.container.requestFullscreen() : this.player.container.mozRequestFullScreen ? this.player.container.mozRequestFullScreen() : this.player.container.webkitRequestFullscreen ? this.player.container.webkitRequestFullscreen() : this.player.video.webkitEnterFullscreen ? this.player.video.webkitEnterFullscreen() : this.player.video.webkitEnterFullScreen ? this.player.video.webkitEnterFullScreen() : this.player.container.msRequestFullscreen && this.player.container.msRequestFullscreen();break;case "web":this.player.container.classList.add("dplayer-fulled"), document.body.classList.add("dplayer-web-fullscreen-fix"), this.player.events.trigger("webfullscreen");}n && this.cancel(t);} }, { key: "cancel", value: function value() {switch (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "browser") {case "browser":document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.webkitCancelFullscreen ? document.webkitCancelFullscreen() : document.msCancelFullScreen ? document.msCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen();break;case "web":this.player.container.classList.remove("dplayer-fulled"), document.body.classList.remove("dplayer-web-fullscreen-fix"), this.player.events.trigger("webfullscreen_cancel");}} }, { key: "toggle", value: function value() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "browser";this.isFullScreen(e) ? this.cancel(e) : this.request(e);} }]), e;}();t.default = s;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}();var a = function () {function e() {!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.events = {}, this.videoEvents = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "mozaudioavailable", "pause", "play", "playing", "progress", "ratechange", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], this.playerEvents = ["screenshot", "thumbnails_show", "thumbnails_hide", "danmaku_show", "danmaku_hide", "danmaku_clear", "danmaku_loaded", "danmaku_send", "danmaku_opacity", "contextmenu_show", "contextmenu_hide", "notice_show", "notice_hide", "quality_start", "quality_end", "destroy", "resize", "fullscreen", "fullscreen_cancel", "webfullscreen", "webfullscreen_cancel", "subtitle_show", "subtitle_hide", "subtitle_change"];}return i(e, [{ key: "on", value: function value(e, t) {this.type(e) && "function" == typeof t && (this.events[e] || (this.events[e] = []), this.events[e].push(t));} }, { key: "trigger", value: function value(e, t) {if (this.events[e] && this.events[e].length) for (var n = 0; n < this.events[e].length; n++) {this.events[e][n](t);}} }, { key: "type", value: function value(e) {return -1 !== this.playerEvents.indexOf(e) ? "player" : -1 !== this.videoEvents.indexOf(e) ? "video" : (console.error("Unknown event name: " + e), null);} }]), e;}();t.default = a;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i,a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {return typeof e;} : function (e) {return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;},o = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}(),r = n(1),s = (i = r) && i.__esModule ? i : { default: i };var l = function () {function e(t) {!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.options = t, this.container = this.options.container, this.danTunnel = { right: {}, top: {}, bottom: {} }, this.danIndex = 0, this.dan = [], this.showing = !0, this._opacity = this.options.opacity, this.events = this.options.events, this.unlimited = this.options.unlimited, this._measure(""), this.load();}return o(e, [{ key: "load", value: function value() {var e = this,t = void 0;t = this.options.api.maximum ? this.options.api.address + "v3/?id=" + this.options.api.id + "&max=" + this.options.api.maximum : this.options.api.address + "v3/?id=" + this.options.api.id;var n = (this.options.api.addition || []).slice(0);n.push(t), this.events && this.events.trigger("danmaku_load_start", n), this._readAllEndpoints(n, function (t) {e.dan = [].concat.apply([], t).sort(function (e, t) {return e.time - t.time;}), window.requestAnimationFrame(function () {e.frame();}), e.options.callback(), e.events && e.events.trigger("danmaku_load_end");});} }, { key: "reload", value: function value(e) {this.options.api = e, this.dan = [], this.clear(), this.load();} }, { key: "_readAllEndpoints", value: function value(e, t) {for (var n = this, i = [], a = 0, o = function o(_o) {n.options.apiBackend.read({ url: e[_o], success: function success(n) {i[_o] = n, ++a === e.length && t(i);}, error: function error(r) {n.options.error(r || n.options.tran("Danmaku load failed")), i[_o] = [], ++a === e.length && t(i);} });}, r = 0; r < e.length; ++r) {o(r);}} }, { key: "send", value: function value(e, t) {var n = this,i = { token: this.options.api.token, id: this.options.api.id, author: this.options.api.user, time: this.options.time(), text: e.text, color: e.color, type: e.type };this.options.apiBackend.send({ url: this.options.api.address + "v3/", data: i, success: t, error: function error(e) {n.options.error(e || n.options.tran("Danmaku send failed"));} }), this.dan.splice(this.danIndex, 0, i), this.danIndex++;var a = { text: this.htmlEncode(i.text), color: i.color, type: i.type, border: "2px solid " + this.options.borderColor };this.draw(a), this.events && this.events.trigger("danmaku_send", i);} }, { key: "frame", value: function value() {var e = this;if (this.dan.length && !this.paused && this.showing) {for (var t = this.dan[this.danIndex], n = []; t && this.options.time() > parseFloat(t.time);) {n.push(t), t = this.dan[++this.danIndex];}this.draw(n);}window.requestAnimationFrame(function () {e.frame();});} }, { key: "opacity", value: function value(e) {if (void 0 !== e) {for (var t = this.container.getElementsByClassName("dplayer-danmaku-item"), n = 0; n < t.length; n++) {t[n].style.opacity = e;}this._opacity = e, this.events && this.events.trigger("danmaku_opacity", this._opacity);}return this._opacity;} }, { key: "draw", value: function value(e) {var t = this;if (this.showing) {var n = this.options.height,i = this.container.offsetWidth,o = this.container.offsetHeight,r = parseInt(o / n),l = function l(e) {var n = e.offsetWidth || parseInt(e.style.width),i = e.getBoundingClientRect().right || t.container.getBoundingClientRect().right + n;return t.container.getBoundingClientRect().right - i;},c = function c(e) {return (i + e) / 5;},u = function u(e, n, o) {for (var s = i / c(o), u = function u(a) {var o = t.danTunnel[n][a + ""];if (!o || !o.length) return t.danTunnel[n][a + ""] = [e], e.addEventListener("animationend", function () {t.danTunnel[n][a + ""].splice(0, 1);}), { v: a % r };if ("right" !== n) return "continue";for (var u = 0; u < o.length; u++) {var d = l(o[u]) - 10;if (d <= i - s * c(parseInt(o[u].style.width)) || d <= 0) break;if (u === o.length - 1) return t.danTunnel[n][a + ""].push(e), e.addEventListener("animationend", function () {t.danTunnel[n][a + ""].splice(0, 1);}), { v: a % r };}}, d = 0; t.unlimited || d < r; d++) {var p = u(d);switch (p) {case "continue":continue;default:if ("object" === (void 0 === p ? "undefined" : a(p))) return p.v;}}return -1;};"[object Array]" !== Object.prototype.toString.call(e) && (e = [e]);for (var d = document.createDocumentFragment(), p = function p(a) {e[a].type = s.default.number2Type(e[a].type), e[a].color || (e[a].color = 16777215);var o = document.createElement("div");o.classList.add("dplayer-danmaku-item"), o.classList.add("dplayer-danmaku-" + e[a].type), e[a].border ? o.innerHTML = '<span style="border:' + e[a].border + '">' + e[a].text + "</span>" : o.innerHTML = e[a].text, o.style.opacity = t._opacity, o.style.color = s.default.number2Color(e[a].color), o.addEventListener("animationend", function () {t.container.removeChild(o);});var r = t._measure(e[a].text),l = void 0;switch (e[a].type) {case "right":(l = u(o, e[a].type, r)) >= 0 && (o.style.width = r + 1 + "px", o.style.top = n * l + "px", o.style.transform = "translateX(-" + i + "px)");break;case "top":(l = u(o, e[a].type)) >= 0 && (o.style.top = n * l + "px");break;case "bottom":(l = u(o, e[a].type)) >= 0 && (o.style.bottom = n * l + "px");break;default:console.error("Can't handled danmaku type: " + e[a].type);}l >= 0 && (o.classList.add("dplayer-danmaku-move"), d.appendChild(o));}, h = 0; h < e.length; h++) {p(h);}return this.container.appendChild(d), d;}} }, { key: "play", value: function value() {this.paused = !1;} }, { key: "pause", value: function value() {this.paused = !0;} }, { key: "_measure", value: function value(e) {if (!this.context) {var t = getComputedStyle(this.container.getElementsByClassName("dplayer-danmaku-item")[0], null);this.context = document.createElement("canvas").getContext("2d"), this.context.font = t.getPropertyValue("font");}return this.context.measureText(e).width;} }, { key: "seek", value: function value() {this.clear();for (var e = 0; e < this.dan.length; e++) {if (this.dan[e].time >= this.options.time()) {this.danIndex = e;break;}this.danIndex = this.dan.length;}} }, { key: "clear", value: function value() {this.danTunnel = { right: {}, top: {}, bottom: {} }, this.danIndex = 0, this.options.container.innerHTML = "", this.events && this.events.trigger("danmaku_clear");} }, { key: "htmlEncode", value: function value(e) {return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2f;");} }, { key: "resize", value: function value() {for (var e = this.container.offsetWidth, t = this.container.getElementsByClassName("dplayer-danmaku-item"), n = 0; n < t.length; n++) {t[n].style.transform = "translateX(-" + e + "px)";}} }, { key: "hide", value: function value() {this.showing = !1, this.pause(), this.clear(), this.events && this.events.trigger("danmaku_hide");} }, { key: "show", value: function value() {this.seek(), this.showing = !0, this.play(), this.events && this.events.trigger("danmaku_show");} }, { key: "unlimit", value: function value(e) {this.unlimited = e;} }]), e;}();t.default = l;}, function (e, t, n) {"use strict";(function (t) {e.exports = !1;try {e.exports = "[object process]" === Object.prototype.toString.call(t.process);} catch (e) {}}).call(this, n(4));}, function (e, t, n) {"use strict";(function (t) {var i = n(28),a = Object.create(i ? t : window),o = /["&'<>]/;a.$escape = function (e) {return function (e) {var t = "" + e,n = o.exec(t);if (!n) return e;var i = "",a = void 0,r = void 0,s = void 0;for (a = n.index, r = 0; a < t.length; a++) {switch (t.charCodeAt(a)) {case 34:s = "&#34;";break;case 38:s = "&#38;";break;case 39:s = "&#39;";break;case 60:s = "&#60;";break;case 62:s = "&#62;";break;default:continue;}r !== a && (i += t.substring(r, a)), r = a + 1, i += s;}return r !== a ? i + t.substring(r, a) : i;}(function e(t) {"string" != typeof t && (t = void 0 === t || null === t ? "" : "function" == typeof t ? e(t.call(t)) : JSON.stringify(t));return t;}(e));}, a.$each = function (e, t) {if (Array.isArray(e)) for (var n = 0, i = e.length; n < i; n++) {t(e[n], n);} else for (var a in e) {t(e[a], a);}}, e.exports = a;}).call(this, n(4));}, function (e, t, n) {var i = n(6);e.exports = function (e) {"use strict";e = e || {};var t,a = "",o = (arguments[1], e.video),r = e.options,s = i.$escape,l = e.tran,c = e.icons,u = e.index,d = i.$each;e.$value, e.$index;return a += '<div class="dplayer-mask"></div>\n<div class="dplayer-video-wrap">\n    ', t = n(5)(o), a += t, a += "\n    ", r.logo && (a += '\n    <div class="dplayer-logo">\n        <img src="', a += s(r.logo), a += '">\n    </div>\n    '), a += '\n    <div class="dplayer-danmaku"', r.danmaku && r.danmaku.bottm && (a += ' style="margin-bottom:', a += s(r.danmaku.bottm), a += '"'), a += '>\n        <div class="dplayer-danmaku-item dplayer-danmaku-item--demo"></div>\n    </div>\n    <div class="dplayer-subtitle"></div>\n    <div class="dplayer-bezel">\n        <span class="dplayer-bezel-icon"></span>\n        ', r.danmaku && (a += '\n        <span class="dplayer-danloading">', a += s(l("Danmaku is loading")), a += "</span>\n        "), a += '\n        <span class="diplayer-loading-icon">', a += c.loading, a += '</span>\n    </div>\n</div>\n<div class="dplayer-controller-mask"></div>\n<div class="dplayer-controller">\n    <div class="dplayer-icons dplayer-comment-box">\n        <button class="dplayer-icon dplayer-comment-setting-icon" data-balloon="', a += s(l("Setting")), a += '" data-balloon-pos="up">\n            <span class="dplayer-icon-content">', a += c.pallette, a += '</span>\n        </button>\n        <div class="dplayer-comment-setting-box">\n            <div class="dplayer-comment-setting-color">\n                <div class="dplayer-comment-setting-title">', a += s(l("Set danmaku color")), a += '</div>\n                <label>\n                    <input type="radio" name="dplayer-danmaku-color-', a += s(u), a += '" value="#fff" checked>\n                    <span style="background: #fff;"></span>\n                </label>\n                <label>\n                    <input type="radio" name="dplayer-danmaku-color-', a += s(u), a += '" value="#e54256">\n                    <span style="background: #e54256"></span>\n                </label>\n                <label>\n                    <input type="radio" name="dplayer-danmaku-color-', a += s(u), a += '" value="#ffe133">\n                    <span style="background: #ffe133"></span>\n                </label>\n                <label>\n                    <input type="radio" name="dplayer-danmaku-color-', a += s(u), a += '" value="#64DD17">\n                    <span style="background: #64DD17"></span>\n                </label>\n                <label>\n                    <input type="radio" name="dplayer-danmaku-color-', a += s(u), a += '" value="#39ccff">\n                    <span style="background: #39ccff"></span>\n                </label>\n                <label>\n                    <input type="radio" name="dplayer-danmaku-color-', a += s(u), a += '" value="#D500F9">\n                    <span style="background: #D500F9"></span>\n                </label>\n            </div>\n            <div class="dplayer-comment-setting-type">\n                <div class="dplayer-comment-setting-title">', a += s(l("Set danmaku type")), a += '</div>\n                <label>\n                    <input type="radio" name="dplayer-danmaku-type-', a += s(u), a += '" value="1">\n                    <span>', a += s(l("Top")), a += '</span>\n                </label>\n                <label>\n                    <input type="radio" name="dplayer-danmaku-type-', a += s(u), a += '" value="0" checked>\n                    <span>', a += s(l("Rolling")), a += '</span>\n                </label>\n                <label>\n                    <input type="radio" name="dplayer-danmaku-type-', a += s(u), a += '" value="2">\n                    <span>', a += s(l("Bottom")), a += '</span>\n                </label>\n            </div>\n        </div>\n        <input class="dplayer-comment-input" type="text" placeholder="', a += s(l("Input danmaku, hit Enter")), a += '" maxlength="30">\n        <button class="dplayer-icon dplayer-send-icon" data-balloon="', a += s(l("Send")), a += '" data-balloon-pos="up">\n            <span class="dplayer-icon-content">', a += c.send, a += '</span>\n        </button>\n    </div>\n    <div class="dplayer-icons dplayer-icons-left">\n        <button class="dplayer-icon dplayer-play-icon">\n            <span class="dplayer-icon-content">', a += c.play, a += '</span>\n        </button>\n        <div class="dplayer-volume">\n            <button class="dplayer-icon dplayer-volume-icon">\n                <span class="dplayer-icon-content">', a += c.volumeDown, a += '</span>\n            </button>\n            <div class="dplayer-volume-bar-wrap" data-balloon-pos="up">\n                <div class="dplayer-volume-bar">\n                    <div class="dplayer-volume-bar-inner" style="background: ', a += s(r.theme), a += ';">\n                        <span class="dplayer-thumb" style="background: ', a += s(r.theme), a += '"></span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <span class="dplayer-time">\n            <span class="dplayer-ptime">0:00</span> /\n            <span class="dplayer-dtime">0:00</span>\n        </span>\n        ', r.live && (a += '\n        <span class="dplayer-live-badge"><span class="dplayer-live-dot" style="background: ', a += s(r.theme), a += ';"></span>', a += s(l("Live")), a += "</span>\n        "), a += '\n    </div>\n    <div class="dplayer-icons dplayer-icons-right">\n        ', r.video.quality && (a += '\n        <div class="dplayer-quality">\n            <button class="dplayer-icon dplayer-quality-icon">', a += s(r.video.quality[r.video.defaultQuality].name), a += '</button>\n            <div class="dplayer-quality-mask">\n                <div class="dplayer-quality-list">\n                ', d(r.video.quality, function (e, t) {a += '\n                    <div class="dplayer-quality-item" data-index="', a += s(t), a += '">', a += s(e.name), a += "</div>\n                ";}), a += "\n                </div>\n            </div>\n        </div>\n        "), a += "\n        ", r.screenshot && (a += '\n        <div class="dplayer-icon dplayer-camera-icon" data-balloon="', a += s(l("Screenshot")), a += '" data-balloon-pos="up">\n            <span class="dplayer-icon-content">', a += c.camera, a += "</span>\n        </div>\n        "), a += '\n        <div class="dplayer-comment">\n            <button class="dplayer-icon dplayer-comment-icon" data-balloon="', a += s(l("Send danmaku")), a += '" data-balloon-pos="up">\n                <span class="dplayer-icon-content">', a += c.comment, a += "</span>\n            </button>\n        </div>\n        ", r.subtitle && (a += '\n        <div class="dplayer-subtitle-btn">\n            <button class="dplayer-icon dplayer-subtitle-icon" data-balloon="', a += s(l("Hide subtitle")), a += '" data-balloon-pos="up">\n                <span class="dplayer-icon-content">', a += c.subtitle, a += "</span>\n            </button>\n        </div>\n        "), a += '\n        <div class="dplayer-setting">\n            <button class="dplayer-icon dplayer-setting-icon" data-balloon="', a += s(l("Setting")), a += '" data-balloon-pos="up">\n                <span class="dplayer-icon-content">', a += c.setting, a += '</span>\n            </button>\n            <div class="dplayer-setting-box">\n                <div class="dplayer-setting-origin-panel">\n                    <div class="dplayer-setting-item dplayer-setting-speed">\n                        <span class="dplayer-label">', a += s(l("Speed")), a += '</span>\n                        <div class="dplayer-toggle">', a += c.right, a += '</div>\n                    </div>\n                    <div class="dplayer-setting-item dplayer-setting-loop">\n                        <span class="dplayer-label">', a += s(l("Loop")), a += '</span>\n                        <div class="dplayer-toggle">\n                            <input class="dplayer-toggle-setting-input" type="checkbox" name="dplayer-toggle">\n                            <label for="dplayer-toggle"></label>\n                        </div>\n                    </div>\n                    <div class="dplayer-setting-item dplayer-setting-showdan">\n                        <span class="dplayer-label">', a += s(l("Show danmaku")), a += '</span>\n                        <div class="dplayer-toggle">\n                            <input class="dplayer-showdan-setting-input" type="checkbox" name="dplayer-toggle-dan">\n                            <label for="dplayer-toggle-dan"></label>\n                        </div>\n                    </div>\n                    <div class="dplayer-setting-item dplayer-setting-danunlimit">\n                        <span class="dplayer-label">', a += s(l("Unlimited danmaku")), a += '</span>\n                        <div class="dplayer-toggle">\n                            <input class="dplayer-danunlimit-setting-input" type="checkbox" name="dplayer-toggle-danunlimit">\n                            <label for="dplayer-toggle-danunlimit"></label>\n                        </div>\n                    </div>\n                    <div class="dplayer-setting-item dplayer-setting-danmaku">\n                        <span class="dplayer-label">', a += s(l("Opacity for danmaku")), a += '</span>\n                        <div class="dplayer-danmaku-bar-wrap">\n                            <div class="dplayer-danmaku-bar">\n                                <div class="dplayer-danmaku-bar-inner">\n                                    <span class="dplayer-thumb"></span>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class="dplayer-setting-speed-panel">\n                    <div class="dplayer-setting-speed-item" data-speed="0.5">\n                        <span class="dplayer-label">0.5</span>\n                    </div>\n                    <div class="dplayer-setting-speed-item" data-speed="0.75">\n                        <span class="dplayer-label">0.75</span>\n                    </div>\n                    <div class="dplayer-setting-speed-item" data-speed="1">\n                        <span class="dplayer-label">', a += s(l("Normal")), a += '</span>\n                    </div>\n                    <div class="dplayer-setting-speed-item" data-speed="1.25">\n                        <span class="dplayer-label">1.25</span>\n                    </div>\n                    <div class="dplayer-setting-speed-item" data-speed="1.5">\n                        <span class="dplayer-label">1.5</span>\n                    </div>\n                    <div class="dplayer-setting-speed-item" data-speed="2">\n                        <span class="dplayer-label">2</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="dplayer-full">\n            <button class="dplayer-icon dplayer-full-in-icon" data-balloon="', a += s(l("Web full screen")), a += '" data-balloon-pos="up">\n                <span class="dplayer-icon-content">', a += c.fullWeb, a += '</span>\n            </button>\n            <button class="dplayer-icon dplayer-full-icon" data-balloon="', a += s(l("Full screen")), a += '" data-balloon-pos="up">\n                <span class="dplayer-icon-content">', a += c.full, a += '</span>\n            </button>\n        </div>\n    </div>\n    <div class="dplayer-bar-wrap">\n        <div class="dplayer-bar-time hidden">00:00</div>\n        <div class="dplayer-bar-preview"></div>\n        <div class="dplayer-bar">\n            <div class="dplayer-loaded" style="width: 0;"></div>\n            <div class="dplayer-played" style="width: 0; background: ', a += s(r.theme), a += '">\n                <span class="dplayer-thumb" style="background: ', a += s(r.theme), a += '"></span>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="dplayer-info-panel dplayer-info-panel-hide">\n    <div class="dplayer-info-panel-close">[x]</div>\n    <div class="dplayer-info-panel-item dplayer-info-panel-item-version">\n        <span class="dplayer-info-panel-item-title">Player version</span>\n        <span class="dplayer-info-panel-item-data"></span>\n    </div>\n    <div class="dplayer-info-panel-item dplayer-info-panel-item-fps">\n        <span class="dplayer-info-panel-item-title">Player FPS</span>\n        <span class="dplayer-info-panel-item-data"></span>\n    </div>\n    <div class="dplayer-info-panel-item dplayer-info-panel-item-type">\n        <span class="dplayer-info-panel-item-title">Video type</span>\n        <span class="dplayer-info-panel-item-data"></span>\n    </div>\n    <div class="dplayer-info-panel-item dplayer-info-panel-item-url">\n        <span class="dplayer-info-panel-item-title">Video url</span>\n        <span class="dplayer-info-panel-item-data"></span>\n    </div>\n    <div class="dplayer-info-panel-item dplayer-info-panel-item-resolution">\n        <span class="dplayer-info-panel-item-title">Video resolution</span>\n        <span class="dplayer-info-panel-item-data"></span>\n    </div>\n    <div class="dplayer-info-panel-item dplayer-info-panel-item-duration">\n        <span class="dplayer-info-panel-item-title">Video duration</span>\n        <span class="dplayer-info-panel-item-data"></span>\n    </div>\n    ', r.danmaku && (a += '\n    <div class="dplayer-info-panel-item dplayer-info-panel-item-danmaku-id">\n        <span class="dplayer-info-panel-item-title">Danamku id</span>\n        <span class="dplayer-info-panel-item-data"></span>\n    </div>\n    <div class="dplayer-info-panel-item dplayer-info-panel-item-danmaku-api">\n        <span class="dplayer-info-panel-item-title">Danamku api</span>\n        <span class="dplayer-info-panel-item-data"></span>\n    </div>\n    <div class="dplayer-info-panel-item dplayer-info-panel-item-danmaku-amount">\n        <span class="dplayer-info-panel-item-title">Danamku amount</span>\n        <span class="dplayer-info-panel-item-data"></span>\n    </div>\n    '), a += '\n</div>\n<div class="dplayer-menu">\n    ', d(r.contextmenu, function (e, t) {a += '\n        <div class="dplayer-menu-item">\n            <a', e.link && (a += ' target="_blank"'), a += ' href="', a += s(e.link || "javascript:void(0);"), a += '">', a += s(l(e.text)), a += "</a>\n        </div>\n    ";}), a += '\n</div>\n<div class="dplayer-notice"></div>';};}, function (e, t) {e.exports = '<svg version="1.1" viewBox="0 0 22 22"><svg x="7" y="1"><circle class="diplayer-loading-dot diplayer-loading-dot-0" cx="4" cy="4" r="2"></circle></svg><svg x="11" y="3"><circle class="diplayer-loading-dot diplayer-loading-dot-1" cx="4" cy="4" r="2"></circle></svg><svg x="13" y="7"><circle class="diplayer-loading-dot diplayer-loading-dot-2" cx="4" cy="4" r="2"></circle></svg><svg x="11" y="11"><circle class="diplayer-loading-dot diplayer-loading-dot-3" cx="4" cy="4" r="2"></circle></svg><svg x="7" y="13"><circle class="diplayer-loading-dot diplayer-loading-dot-4" cx="4" cy="4" r="2"></circle></svg><svg x="3" y="11"><circle class="diplayer-loading-dot diplayer-loading-dot-5" cx="4" cy="4" r="2"></circle></svg><svg x="1" y="7"><circle class="diplayer-loading-dot diplayer-loading-dot-6" cx="4" cy="4" r="2"></circle></svg><svg x="3" y="3"><circle class="diplayer-loading-dot diplayer-loading-dot-7" cx="4" cy="4" r="2"></circle></svg></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M26.667 5.333h-21.333c-0 0-0.001 0-0.001 0-1.472 0-2.666 1.194-2.666 2.666 0 0 0 0.001 0 0.001v-0 16c0 0 0 0.001 0 0.001 0 1.472 1.194 2.666 2.666 2.666 0 0 0.001 0 0.001 0h21.333c0 0 0.001 0 0.001 0 1.472 0 2.666-1.194 2.666-2.666 0-0 0-0.001 0-0.001v0-16c0-0 0-0.001 0-0.001 0-1.472-1.194-2.666-2.666-2.666-0 0-0.001 0-0.001 0h0zM5.333 16h5.333v2.667h-5.333v-2.667zM18.667 24h-13.333v-2.667h13.333v2.667zM26.667 24h-5.333v-2.667h5.333v2.667zM26.667 18.667h-13.333v-2.667h13.333v2.667z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M16 23c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zM16 13c-2.206 0-4 1.794-4 4s1.794 4 4 4c2.206 0 4-1.794 4-4s-1.794-4-4-4zM27 28h-22c-1.654 0-3-1.346-3-3v-16c0-1.654 1.346-3 3-3h3c0.552 0 1 0.448 1 1s-0.448 1-1 1h-3c-0.551 0-1 0.449-1 1v16c0 0.552 0.449 1 1 1h22c0.552 0 1-0.448 1-1v-16c0-0.551-0.448-1-1-1h-11c-0.552 0-1-0.448-1-1s0.448-1 1-1h11c1.654 0 3 1.346 3 3v16c0 1.654-1.346 3-3 3zM24 10.5c0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5c0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5zM15 4c0 0.552-0.448 1-1 1h-4c-0.552 0-1-0.448-1-1v0c0-0.552 0.448-1 1-1h4c0.552 0 1 0.448 1 1v0z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M19.357 2.88c1.749 0 3.366 0.316 4.851 0.946 1.485 0.632 2.768 1.474 3.845 2.533s1.922 2.279 2.532 3.661c0.611 1.383 0.915 2.829 0.915 4.334 0 1.425-0.304 2.847-0.915 4.271-0.611 1.425-1.587 2.767-2.928 4.028-0.855 0.813-1.811 1.607-2.869 2.38s-2.136 1.465-3.233 2.075c-1.099 0.61-2.198 1.098-3.296 1.465-1.098 0.366-2.115 0.549-3.051 0.549-1.343 0-2.441-0.438-3.296-1.311-0.854-0.876-1.281-2.41-1.281-4.608 0-0.366 0.020-0.773 0.060-1.221s0.062-0.895 0.062-1.343c0-0.773-0.183-1.353-0.55-1.738-0.366-0.387-0.793-0.58-1.281-0.58-0.652 0-1.21 0.295-1.678 0.886s-0.926 1.23-1.373 1.921c-0.447 0.693-0.905 1.334-1.372 1.923s-1.028 0.886-1.679 0.886c-0.529 0-1.048-0.427-1.556-1.282s-0.763-2.259-0.763-4.212c0-2.197 0.529-4.241 1.587-6.133s2.462-3.529 4.21-4.912c1.75-1.383 3.762-2.471 6.041-3.264 2.277-0.796 4.617-1.212 7.018-1.253zM7.334 15.817c0.569 0 1.047-0.204 1.434-0.611s0.579-0.875 0.579-1.404c0-0.569-0.193-1.047-0.579-1.434s-0.864-0.579-1.434-0.579c-0.529 0-0.987 0.193-1.373 0.579s-0.58 0.864-0.58 1.434c0 0.53 0.194 0.998 0.58 1.404 0.388 0.407 0.845 0.611 1.373 0.611zM12.216 11.79c0.691 0 1.292-0.254 1.8-0.763s0.762-1.107 0.762-1.8c0-0.732-0.255-1.343-0.762-1.831-0.509-0.489-1.109-0.732-1.8-0.732-0.732 0-1.342 0.244-1.831 0.732-0.488 0.488-0.732 1.098-0.732 1.831 0 0.693 0.244 1.292 0.732 1.8s1.099 0.763 1.831 0.763zM16.366 25.947c0.692 0 1.282-0.214 1.77-0.64s0.732-0.987 0.732-1.678-0.244-1.261-0.732-1.709c-0.489-0.448-1.078-0.671-1.77-0.671-0.65 0-1.21 0.223-1.678 0.671s-0.702 1.018-0.702 1.709c0 0.692 0.234 1.25 0.702 1.678s1.027 0.64 1.678 0.64zM19.113 9.592c0.651 0 1.129-0.203 1.433-0.611 0.305-0.406 0.459-0.874 0.459-1.404 0-0.488-0.154-0.947-0.459-1.373-0.304-0.427-0.782-0.641-1.433-0.641-0.529 0-1.008 0.193-1.434 0.58s-0.64 0.865-0.64 1.434c0 0.571 0.213 1.049 0.64 1.434 0.427 0.389 0.905 0.581 1.434 0.581zM24.848 12.826c0.57 0 1.067-0.213 1.495-0.64 0.427-0.427 0.64-0.947 0.64-1.556 0-0.57-0.214-1.068-0.64-1.495-0.428-0.427-0.927-0.64-1.495-0.64-0.611 0-1.129 0.213-1.555 0.64-0.428 0.427-0.642 0.926-0.642 1.495 0 0.611 0.213 1.129 0.642 1.556s0.947 0.64 1.555 0.64z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M13.725 30l3.9-5.325-3.9-1.125v6.45zM0 17.5l11.050 3.35 13.6-11.55-10.55 12.425 11.8 3.65 6.1-23.375-32 15.5z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M27.090 0.131h-22.731c-2.354 0-4.262 1.839-4.262 4.109v16.401c0 2.269 1.908 4.109 4.262 4.109h4.262v-2.706h8.469l-8.853 8.135 1.579 1.451 7.487-6.88h9.787c2.353 0 4.262-1.84 4.262-4.109v-16.401c0-2.27-1.909-4.109-4.262-4.109v0zM28.511 19.304c0 1.512-1.272 2.738-2.841 2.738h-8.425l-0.076-0.070-0.076 0.070h-11.311c-1.569 0-2.841-1.226-2.841-2.738v-13.696c0-1.513 1.272-2.739 2.841-2.739h19.889c1.569 0 2.841-0.142 2.841 1.37v15.064z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M27.128 0.38h-22.553c-2.336 0-4.229 1.825-4.229 4.076v16.273c0 2.251 1.893 4.076 4.229 4.076h4.229v-2.685h8.403l-8.784 8.072 1.566 1.44 7.429-6.827h9.71c2.335 0 4.229-1.825 4.229-4.076v-16.273c0-2.252-1.894-4.076-4.229-4.076zM28.538 19.403c0 1.5-1.262 2.717-2.819 2.717h-8.36l-0.076-0.070-0.076 0.070h-11.223c-1.557 0-2.819-1.217-2.819-2.717v-13.589c0-1.501 1.262-2.718 2.819-2.718h19.734c1.557 0 2.819-0.141 2.819 1.359v14.947zM9.206 10.557c-1.222 0-2.215 0.911-2.215 2.036s0.992 2.035 2.215 2.035c1.224 0 2.216-0.911 2.216-2.035s-0.992-2.036-2.216-2.036zM22.496 10.557c-1.224 0-2.215 0.911-2.215 2.036s0.991 2.035 2.215 2.035c1.224 0 2.215-0.911 2.215-2.035s-0.991-2.036-2.215-2.036zM15.852 10.557c-1.224 0-2.215 0.911-2.215 2.036s0.991 2.035 2.215 2.035c1.222 0 2.215-0.911 2.215-2.035s-0.992-2.036-2.215-2.036z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22 16l-10.105-10.6-1.895 1.987 8.211 8.613-8.211 8.612 1.895 1.988 8.211-8.613z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 28"><path d="M28.633 17.104c0.035 0.21 0.026 0.463-0.026 0.76s-0.14 0.598-0.262 0.904c-0.122 0.306-0.271 0.581-0.445 0.825s-0.367 0.419-0.576 0.524c-0.209 0.105-0.393 0.157-0.55 0.157s-0.332-0.035-0.524-0.105c-0.175-0.052-0.393-0.1-0.655-0.144s-0.528-0.052-0.799-0.026c-0.271 0.026-0.541 0.083-0.812 0.17s-0.502 0.236-0.694 0.445c-0.419 0.437-0.664 0.934-0.734 1.493s0.009 1.092 0.236 1.598c0.175 0.349 0.148 0.699-0.079 1.048-0.105 0.14-0.271 0.284-0.498 0.432s-0.476 0.284-0.747 0.406-0.555 0.218-0.851 0.288c-0.297 0.070-0.559 0.105-0.786 0.105-0.157 0-0.306-0.061-0.445-0.183s-0.236-0.253-0.288-0.393h-0.026c-0.192-0.541-0.52-1.009-0.982-1.402s-1-0.589-1.611-0.589c-0.594 0-1.131 0.197-1.611 0.589s-0.816 0.851-1.009 1.375c-0.087 0.21-0.218 0.362-0.393 0.458s-0.367 0.144-0.576 0.144c-0.244 0-0.52-0.044-0.825-0.131s-0.611-0.197-0.917-0.327c-0.306-0.131-0.581-0.284-0.825-0.458s-0.428-0.349-0.55-0.524c-0.087-0.122-0.135-0.266-0.144-0.432s0.057-0.397 0.197-0.694c0.192-0.402 0.266-0.86 0.223-1.375s-0.266-0.991-0.668-1.428c-0.244-0.262-0.541-0.432-0.891-0.511s-0.681-0.109-0.995-0.092c-0.367 0.017-0.742 0.087-1.127 0.21-0.244 0.070-0.489 0.052-0.734-0.052-0.192-0.070-0.371-0.231-0.537-0.485s-0.314-0.533-0.445-0.838c-0.131-0.306-0.231-0.62-0.301-0.943s-0.087-0.59-0.052-0.799c0.052-0.384 0.227-0.629 0.524-0.734 0.524-0.21 0.995-0.555 1.415-1.035s0.629-1.017 0.629-1.611c0-0.611-0.21-1.144-0.629-1.598s-0.891-0.786-1.415-0.996c-0.157-0.052-0.288-0.179-0.393-0.38s-0.157-0.406-0.157-0.616c0-0.227 0.035-0.48 0.105-0.76s0.162-0.55 0.275-0.812 0.244-0.502 0.393-0.72c0.148-0.218 0.31-0.38 0.485-0.485 0.14-0.087 0.275-0.122 0.406-0.105s0.275 0.052 0.432 0.105c0.524 0.21 1.070 0.275 1.637 0.197s1.070-0.327 1.506-0.747c0.21-0.209 0.362-0.467 0.458-0.773s0.157-0.607 0.183-0.904c0.026-0.297 0.026-0.568 0-0.812s-0.048-0.419-0.065-0.524c-0.035-0.105-0.066-0.227-0.092-0.367s-0.013-0.262 0.039-0.367c0.105-0.244 0.293-0.458 0.563-0.642s0.563-0.336 0.878-0.458c0.314-0.122 0.62-0.214 0.917-0.275s0.533-0.092 0.707-0.092c0.227 0 0.406 0.074 0.537 0.223s0.223 0.301 0.275 0.458c0.192 0.471 0.507 0.886 0.943 1.244s0.952 0.537 1.546 0.537c0.611 0 1.153-0.17 1.624-0.511s0.803-0.773 0.996-1.297c0.070-0.14 0.179-0.284 0.327-0.432s0.301-0.223 0.458-0.223c0.244 0 0.511 0.035 0.799 0.105s0.572 0.166 0.851 0.288c0.279 0.122 0.537 0.279 0.773 0.472s0.423 0.402 0.563 0.629c0.087 0.14 0.113 0.293 0.079 0.458s-0.070 0.284-0.105 0.354c-0.227 0.506-0.297 1.039-0.21 1.598s0.341 1.048 0.76 1.467c0.419 0.419 0.934 0.651 1.546 0.694s1.179-0.057 1.703-0.301c0.14-0.087 0.31-0.122 0.511-0.105s0.371 0.096 0.511 0.236c0.262 0.244 0.493 0.616 0.694 1.113s0.336 1 0.406 1.506c0.035 0.297-0.013 0.528-0.144 0.694s-0.266 0.275-0.406 0.327c-0.542 0.192-1.004 0.528-1.388 1.009s-0.576 1.026-0.576 1.637c0 0.594 0.162 1.113 0.485 1.559s0.747 0.764 1.27 0.956c0.122 0.070 0.227 0.14 0.314 0.21 0.192 0.157 0.323 0.358 0.393 0.602v0zM16.451 19.462c0.786 0 1.528-0.149 2.227-0.445s1.305-0.707 1.821-1.231c0.515-0.524 0.921-1.131 1.218-1.821s0.445-1.428 0.445-2.214c0-0.786-0.148-1.524-0.445-2.214s-0.703-1.292-1.218-1.808c-0.515-0.515-1.122-0.921-1.821-1.218s-1.441-0.445-2.227-0.445c-0.786 0-1.524 0.148-2.214 0.445s-1.292 0.703-1.808 1.218c-0.515 0.515-0.921 1.118-1.218 1.808s-0.445 1.428-0.445 2.214c0 0.786 0.149 1.524 0.445 2.214s0.703 1.297 1.218 1.821c0.515 0.524 1.118 0.934 1.808 1.231s1.428 0.445 2.214 0.445v0z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 33"><path d="M24.965 24.38h-18.132c-1.366 0-2.478-1.113-2.478-2.478v-11.806c0-1.364 1.111-2.478 2.478-2.478h18.132c1.366 0 2.478 1.113 2.478 2.478v11.806c0 1.364-1.11 2.478-2.478 2.478zM6.833 10.097v11.806h18.134l-0.002-11.806h-18.132zM2.478 28.928h5.952c0.684 0 1.238-0.554 1.238-1.239 0-0.684-0.554-1.238-1.238-1.238h-5.952v-5.802c0-0.684-0.554-1.239-1.238-1.239s-1.239 0.556-1.239 1.239v5.802c0 1.365 1.111 2.478 2.478 2.478zM30.761 19.412c-0.684 0-1.238 0.554-1.238 1.238v5.801h-5.951c-0.686 0-1.239 0.554-1.239 1.238 0 0.686 0.554 1.239 1.239 1.239h5.951c1.366 0 2.478-1.111 2.478-2.478v-5.801c0-0.683-0.554-1.238-1.239-1.238zM0 5.55v5.802c0 0.683 0.554 1.238 1.238 1.238s1.238-0.555 1.238-1.238v-5.802h5.952c0.684 0 1.238-0.554 1.238-1.238s-0.554-1.238-1.238-1.238h-5.951c-1.366-0.001-2.478 1.111-2.478 2.476zM32 11.35v-5.801c0-1.365-1.11-2.478-2.478-2.478h-5.951c-0.686 0-1.239 0.554-1.239 1.238s0.554 1.238 1.239 1.238h5.951v5.801c0 0.683 0.554 1.237 1.238 1.237 0.686 0.002 1.239-0.553 1.239-1.236z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 33"><path d="M6.667 28h-5.333c-0.8 0-1.333-0.533-1.333-1.333v-5.333c0-0.8 0.533-1.333 1.333-1.333s1.333 0.533 1.333 1.333v4h4c0.8 0 1.333 0.533 1.333 1.333s-0.533 1.333-1.333 1.333zM30.667 28h-5.333c-0.8 0-1.333-0.533-1.333-1.333s0.533-1.333 1.333-1.333h4v-4c0-0.8 0.533-1.333 1.333-1.333s1.333 0.533 1.333 1.333v5.333c0 0.8-0.533 1.333-1.333 1.333zM30.667 12c-0.8 0-1.333-0.533-1.333-1.333v-4h-4c-0.8 0-1.333-0.533-1.333-1.333s0.533-1.333 1.333-1.333h5.333c0.8 0 1.333 0.533 1.333 1.333v5.333c0 0.8-0.533 1.333-1.333 1.333zM1.333 12c-0.8 0-1.333-0.533-1.333-1.333v-5.333c0-0.8 0.533-1.333 1.333-1.333h5.333c0.8 0 1.333 0.533 1.333 1.333s-0.533 1.333-1.333 1.333h-4v4c0 0.8-0.533 1.333-1.333 1.333z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 17 32"><path d="M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z"></path></svg>';}, function (e, t) {e.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 32"><path d="M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z"></path></svg>';}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}(),a = r(n(2)),o = r(n(30));function r(e) {return e && e.__esModule ? e : { default: e };}var s = function () {function e(t) {!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.container = t.container, this.options = t.options, this.index = t.index, this.tran = t.tran, this.init();}return i(e, [{ key: "init", value: function value() {this.container.innerHTML = (0, o.default)({ options: this.options, index: this.index, tran: this.tran, icons: a.default, video: { current: !0, pic: this.options.video.pic, screenshot: this.options.screenshot, preload: this.options.preload, url: this.options.video.url, subtitle: this.options.subtitle } }), this.volumeBar = this.container.querySelector(".dplayer-volume-bar-inner"), this.volumeBarWrap = this.container.querySelector(".dplayer-volume-bar"), this.volumeBarWrapWrap = this.container.querySelector(".dplayer-volume-bar-wrap"), this.volumeButton = this.container.querySelector(".dplayer-volume"), this.volumeButtonIcon = this.container.querySelector(".dplayer-volume-icon"), this.volumeIcon = this.container.querySelector(".dplayer-volume-icon .dplayer-icon-content"), this.playedBar = this.container.querySelector(".dplayer-played"), this.loadedBar = this.container.querySelector(".dplayer-loaded"), this.playedBarWrap = this.container.querySelector(".dplayer-bar-wrap"), this.playedBarTime = this.container.querySelector(".dplayer-bar-time"), this.danmaku = this.container.querySelector(".dplayer-danmaku"), this.danmakuLoading = this.container.querySelector(".dplayer-danloading"), this.video = this.container.querySelector(".dplayer-video-current"), this.bezel = this.container.querySelector(".dplayer-bezel-icon"), this.playButton = this.container.querySelector(".dplayer-play-icon"), this.videoWrap = this.container.querySelector(".dplayer-video-wrap"), this.controllerMask = this.container.querySelector(".dplayer-controller-mask"), this.ptime = this.container.querySelector(".dplayer-ptime"), this.settingButton = this.container.querySelector(".dplayer-setting-icon"), this.settingBox = this.container.querySelector(".dplayer-setting-box"), this.mask = this.container.querySelector(".dplayer-mask"), this.loop = this.container.querySelector(".dplayer-setting-loop"), this.loopToggle = this.container.querySelector(".dplayer-setting-loop .dplayer-toggle-setting-input"), this.showDanmaku = this.container.querySelector(".dplayer-setting-showdan"), this.showDanmakuToggle = this.container.querySelector(".dplayer-showdan-setting-input"), this.unlimitDanmaku = this.container.querySelector(".dplayer-setting-danunlimit"), this.unlimitDanmakuToggle = this.container.querySelector(".dplayer-danunlimit-setting-input"), this.speed = this.container.querySelector(".dplayer-setting-speed"), this.speedItem = this.container.querySelectorAll(".dplayer-setting-speed-item"), this.danmakuOpacityBar = this.container.querySelector(".dplayer-danmaku-bar-inner"), this.danmakuOpacityBarWrap = this.container.querySelector(".dplayer-danmaku-bar"), this.danmakuOpacityBarWrapWrap = this.container.querySelector(".dplayer-danmaku-bar-wrap"), this.danmakuOpacityBox = this.container.querySelector(".dplayer-setting-danmaku"), this.dtime = this.container.querySelector(".dplayer-dtime"), this.controller = this.container.querySelector(".dplayer-controller"), this.commentInput = this.container.querySelector(".dplayer-comment-input"), this.commentButton = this.container.querySelector(".dplayer-comment-icon"), this.commentSettingBox = this.container.querySelector(".dplayer-comment-setting-box"), this.commentSettingButton = this.container.querySelector(".dplayer-comment-setting-icon"), this.commentSettingFill = this.container.querySelector(".dplayer-comment-setting-icon path"), this.commentSendButton = this.container.querySelector(".dplayer-send-icon"), this.commentSendFill = this.container.querySelector(".dplayer-send-icon path"), this.commentColorSettingBox = this.container.querySelector(".dplayer-comment-setting-color"), this.browserFullButton = this.container.querySelector(".dplayer-full-icon"), this.webFullButton = this.container.querySelector(".dplayer-full-in-icon"), this.menu = this.container.querySelector(".dplayer-menu"), this.menuItem = this.container.querySelectorAll(".dplayer-menu-item"), this.qualityList = this.container.querySelector(".dplayer-quality-list"), this.camareButton = this.container.querySelector(".dplayer-camera-icon"), this.subtitleButton = this.container.querySelector(".dplayer-subtitle-icon"), this.subtitleButtonInner = this.container.querySelector(".dplayer-subtitle-icon .dplayer-icon-content"), this.subtitle = this.container.querySelector(".dplayer-subtitle"), this.qualityButton = this.container.querySelector(".dplayer-quality-icon"), this.barPreview = this.container.querySelector(".dplayer-bar-preview"), this.barWrap = this.container.querySelector(".dplayer-bar-wrap"), this.notice = this.container.querySelector(".dplayer-notice"), this.infoPanel = this.container.querySelector(".dplayer-info-panel"), this.infoPanelClose = this.container.querySelector(".dplayer-info-panel-close"), this.infoVersion = this.container.querySelector(".dplayer-info-panel-item-version .dplayer-info-panel-item-data"), this.infoFPS = this.container.querySelector(".dplayer-info-panel-item-fps .dplayer-info-panel-item-data"), this.infoType = this.container.querySelector(".dplayer-info-panel-item-type .dplayer-info-panel-item-data"), this.infoUrl = this.container.querySelector(".dplayer-info-panel-item-url .dplayer-info-panel-item-data"), this.infoResolution = this.container.querySelector(".dplayer-info-panel-item-resolution .dplayer-info-panel-item-data"), this.infoDuration = this.container.querySelector(".dplayer-info-panel-item-duration .dplayer-info-panel-item-data"), this.infoDanmakuId = this.container.querySelector(".dplayer-info-panel-item-danmaku-id .dplayer-info-panel-item-data"), this.infoDanmakuApi = this.container.querySelector(".dplayer-info-panel-item-danmaku-api .dplayer-info-panel-item-data"), this.infoDanmakuAmount = this.container.querySelector(".dplayer-info-panel-item-danmaku-amount .dplayer-info-panel-item-data");} }]), e;}();t.default = s;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = { "zh-cn": { "Danmaku is loading": "弹幕加载中", Top: "顶部", Bottom: "底部", Rolling: "滚动", "Input danmaku, hit Enter": "输入弹幕，回车发送", "About author": "关于作者", "DPlayer feedback": "播放器意见反馈", "About DPlayer": "关于 DPlayer 播放器", Loop: "洗脑循环", Speed: "速度", "Opacity for danmaku": "弹幕透明度", Normal: "正常", "Please input danmaku content!": "要输入弹幕内容啊喂！", "Set danmaku color": "设置弹幕颜色", "Set danmaku type": "设置弹幕类型", "Show danmaku": "显示弹幕", "Video load failed": "视频加载失败", "Danmaku load failed": "弹幕加载失败", "Danmaku send failed": "弹幕发送失败", "Switching to": "正在切换至", "Switched to": "已经切换至", quality: "画质", FF: "快进", REW: "快退", "Unlimited danmaku": "海量弹幕", "Send danmaku": "发送弹幕", Setting: "设置", "Full screen": "全屏", "Web full screen": "页面全屏", Send: "发送", Screenshot: "截图", s: "秒", "Show subtitle": "显示字幕", "Hide subtitle": "隐藏字幕", Volume: "音量", Live: "直播", "Video info": "视频统计信息" }, "zh-tw": { "Danmaku is loading": "彈幕載入中", Top: "頂部", Bottom: "底部", Rolling: "滾動", "Input danmaku, hit Enter": "輸入彈幕，Enter 發送", "About author": "關於作者", "DPlayer feedback": "播放器意見回饋", "About DPlayer": "關於 DPlayer 播放器", Loop: "循環播放", Speed: "速度", "Opacity for danmaku": "彈幕透明度", Normal: "正常", "Please input danmaku content!": "請輸入彈幕內容啊！", "Set danmaku color": "設定彈幕顏色", "Set danmaku type": "設定彈幕類型", "Show danmaku": "顯示彈幕", "Video load failed": "影片載入失敗", "Danmaku load failed": "彈幕載入失敗", "Danmaku send failed": "彈幕發送失敗", "Switching to": "正在切換至", "Switched to": "已經切換至", quality: "畫質", FF: "快進", REW: "快退", "Unlimited danmaku": "巨量彈幕", "Send danmaku": "發送彈幕", Setting: "設定", "Full screen": "全螢幕", "Web full screen": "頁面全螢幕", Send: "發送", Screenshot: "截圖", s: "秒", "Show subtitle": "顯示字幕", "Hide subtitle": "隱藏字幕", Volume: "音量", Live: "直播", "Video info": "影片統計訊息" } };t.default = function (e) {var t = this;this.lang = e, this.tran = function (e) {return i[t.lang] && i[t.lang][e] ? i[t.lang][e] : e;};};}, function (e, t, n) {"use strict";e.exports = function (e) {return function (t) {return e.apply(null, t);};};}, function (e, t, n) {"use strict";var i = n(7);function a(e) {if ("function" != typeof e) throw new TypeError("executor must be a function.");var t;this.promise = new Promise(function (e) {t = e;});var n = this;e(function (e) {n.reason || (n.reason = new i(e), t(n.reason));});}a.prototype.throwIfRequested = function () {if (this.reason) throw this.reason;}, a.source = function () {var e;return { token: new a(function (t) {e = t;}), cancel: e };}, e.exports = a;}, function (e, t, n) {"use strict";e.exports = function (e, t) {return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;};}, function (e, t, n) {"use strict";e.exports = function (e) {return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);};}, function (e, t, n) {"use strict";var i = n(0);e.exports = function (e, t, n) {return i.forEach(n, function (n) {e = n(e, t);}), e;};}, function (e, t, n) {"use strict";var i = n(0),a = n(53),o = n(8),r = n(3),s = n(52),l = n(51);function c(e) {e.cancelToken && e.cancelToken.throwIfRequested();}e.exports = function (e) {return c(e), e.baseURL && !s(e.url) && (e.url = l(e.baseURL, e.url)), e.headers = e.headers || {}, e.data = a(e.data, e.headers, e.transformRequest), e.headers = i.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers || {}), i.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function (t) {delete e.headers[t];}), (e.adapter || r.adapter)(e).then(function (t) {return c(e), t.data = a(t.data, t.headers, e.transformResponse), t;}, function (t) {return o(t) || (c(e), t && t.response && (t.response.data = a(t.response.data, t.response.headers, e.transformResponse))), Promise.reject(t);});};}, function (e, t, n) {"use strict";var i = n(0);function a() {this.handlers = [];}a.prototype.use = function (e, t) {return this.handlers.push({ fulfilled: e, rejected: t }), this.handlers.length - 1;}, a.prototype.eject = function (e) {this.handlers[e] && (this.handlers[e] = null);}, a.prototype.forEach = function (e) {i.forEach(this.handlers, function (t) {null !== t && e(t);});}, e.exports = a;}, function (e, t, n) {"use strict";var i = n(0);e.exports = i.isStandardBrowserEnv() ? { write: function write(e, t, n, a, o, r) {var s = [];s.push(e + "=" + encodeURIComponent(t)), i.isNumber(n) && s.push("expires=" + new Date(n).toGMTString()), i.isString(a) && s.push("path=" + a), i.isString(o) && s.push("domain=" + o), !0 === r && s.push("secure"), document.cookie = s.join("; ");}, read: function read(e) {var t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));return t ? decodeURIComponent(t[3]) : null;}, remove: function remove(e) {this.write(e, "", Date.now() - 864e5);} } : { write: function write() {}, read: function read() {return null;}, remove: function remove() {} };}, function (e, t, n) {"use strict";var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";function a() {this.message = "String contains an invalid character";}a.prototype = new Error(), a.prototype.code = 5, a.prototype.name = "InvalidCharacterError", e.exports = function (e) {for (var t, n, o = String(e), r = "", s = 0, l = i; o.charAt(0 | s) || (l = "=", s % 1); r += l.charAt(63 & t >> 8 - s % 1 * 8)) {if ((n = o.charCodeAt(s += .75)) > 255) throw new a();t = t << 8 | n;}return r;};}, function (e, t, n) {"use strict";var i = n(0);e.exports = i.isStandardBrowserEnv() ? function () {var e,t = /(msie|trident)/i.test(navigator.userAgent),n = document.createElement("a");function a(e) {var i = e;return t && (n.setAttribute("href", i), i = n.href), n.setAttribute("href", i), { href: n.href, protocol: n.protocol ? n.protocol.replace(/:$/, "") : "", host: n.host, search: n.search ? n.search.replace(/^\?/, "") : "", hash: n.hash ? n.hash.replace(/^#/, "") : "", hostname: n.hostname, port: n.port, pathname: "/" === n.pathname.charAt(0) ? n.pathname : "/" + n.pathname };}return e = a(window.location.href), function (t) {var n = i.isString(t) ? a(t) : t;return n.protocol === e.protocol && n.host === e.host;};}() : function () {return !0;};}, function (e, t, n) {"use strict";var i = n(0),a = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];e.exports = function (e) {var t,n,o,r = {};return e ? (i.forEach(e.split("\n"), function (e) {if (o = e.indexOf(":"), t = i.trim(e.substr(0, o)).toLowerCase(), n = i.trim(e.substr(o + 1)), t) {if (r[t] && a.indexOf(t) >= 0) return;r[t] = "set-cookie" === t ? (r[t] ? r[t] : []).concat([n]) : r[t] ? r[t] + ", " + n : n;}}), r) : r;};}, function (e, t, n) {"use strict";var i = n(0);function a(e) {return encodeURIComponent(e).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");}e.exports = function (e, t, n) {if (!t) return e;var o;if (n) o = n(t);else if (i.isURLSearchParams(t)) o = t.toString();else {var r = [];i.forEach(t, function (e, t) {null !== e && void 0 !== e && (i.isArray(e) ? t += "[]" : e = [e], i.forEach(e, function (e) {i.isDate(e) ? e = e.toISOString() : i.isObject(e) && (e = JSON.stringify(e)), r.push(a(t) + "=" + a(e));}));}), o = r.join("&");}return o && (e += (-1 === e.indexOf("?") ? "?" : "&") + o), e;};}, function (e, t, n) {"use strict";e.exports = function (e, t, n, i, a) {return e.config = t, n && (e.code = n), e.request = i, e.response = a, e;};}, function (e, t, n) {"use strict";var i = n(9);e.exports = function (e, t, n) {var a = n.config.validateStatus;n.status && a && !a(n.status) ? t(i("Request failed with status code " + n.status, n.config, null, n.request, n)) : e(n);};}, function (e, t, n) {"use strict";var i = n(0);e.exports = function (e, t) {i.forEach(e, function (n, i) {i !== t && i.toUpperCase() === t.toUpperCase() && (e[t] = n, delete e[i]);});};}, function (e, t, n) {"use strict";var i = n(3),a = n(0),o = n(55),r = n(54);function s(e) {this.defaults = e, this.interceptors = { request: new o(), response: new o() };}s.prototype.request = function (e) {"string" == typeof e && (e = a.merge({ url: arguments[0] }, arguments[1])), (e = a.merge(i, { method: "get" }, this.defaults, e)).method = e.method.toLowerCase();var t = [r, void 0],n = Promise.resolve(e);for (this.interceptors.request.forEach(function (e) {t.unshift(e.fulfilled, e.rejected);}), this.interceptors.response.forEach(function (e) {t.push(e.fulfilled, e.rejected);}); t.length;) {n = n.then(t.shift(), t.shift());}return n;}, a.forEach(["delete", "get", "head", "options"], function (e) {s.prototype[e] = function (t, n) {return this.request(a.merge(n || {}, { method: e, url: t }));};}), a.forEach(["post", "put", "patch"], function (e) {s.prototype[e] = function (t, n, i) {return this.request(a.merge(i || {}, { method: e, url: t, data: n }));};}), e.exports = s;}, function (e, t, n) {"use strict";function i(e) {return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);}e.exports = function (e) {return null != e && (i(e) || function (e) {return "function" == typeof e.readFloatLE && "function" == typeof e.slice && i(e.slice(0, 0));}(e) || !!e._isBuffer);};}, function (e, t, n) {"use strict";var i = n(0),a = n(11),o = n(64),r = n(3);function s(e) {var t = new o(e),n = a(o.prototype.request, t);return i.extend(n, o.prototype, t), i.extend(n, t), n;}var l = s(r);l.Axios = o, l.create = function (e) {return s(i.merge(r, e));}, l.Cancel = n(7), l.CancelToken = n(50), l.isCancel = n(8), l.all = function (e) {return Promise.all(e);}, l.spread = n(49), e.exports = l, e.exports.default = l;}, function (e, t, n) {"use strict";e.exports = n(66);}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i,a = n(67),o = (i = a) && i.__esModule ? i : { default: i };t.default = { send: function send(e) {o.default.post(e.url, e.data).then(function (t) {var n = t.data;n && 0 === n.code ? e.success && e.success(n) : e.error && e.error(n && n.msg);}).catch(function (t) {console.error(t), e.error && e.error();});}, read: function read(e) {o.default.get(e.url).then(function (t) {var n = t.data;n && 0 === n.code ? e.success && e.success(n.data.map(function (e) {return { time: e[0], type: e[1], color: e[2], author: e[3], text: e[4] };})) : e.error && e.error(n && n.msg);}).catch(function (t) {console.error(t), e.error && e.error();});} };}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i,a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {return typeof e;} : function (e) {return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;},o = n(68),r = (i = o) && i.__esModule ? i : { default: i };t.default = function (e) {var t = { container: e.element || document.getElementsByClassName("dplayer")[0], live: !1, autoplay: !1, theme: "#b7daff", loop: !1, lang: (navigator.language || navigator.browserLanguage).toLowerCase(), screenshot: !1, hotkey: !0, preload: "metadata", volume: .7, apiBackend: r.default, video: {}, contextmenu: [], mutex: !0 };for (var n in t) {t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);}return e.video && !e.video.type && (e.video.type = "auto"), "object" === a(e.danmaku) && e.danmaku && !e.danmaku.user && (e.danmaku.user = "DIYgod"), e.subtitle && (!e.subtitle.type && (e.subtitle.type = "webvtt"), !e.subtitle.fontSize && (e.subtitle.fontSize = "20px"), !e.subtitle.bottom && (e.subtitle.bottom = "40px"), !e.subtitle.color && (e.subtitle.color = "#fff")), e.video.quality && (e.video.url = e.video.quality[e.video.defaultQuality].url), e.lang && (e.lang = e.lang.toLowerCase()), e.contextmenu = e.contextmenu.concat([{ text: "Video info", click: function click(e) {e.infoPanel.triggle();} }, { text: "About author", link: "https://diygod.me" }, { text: "DPlayer v1.25.0", link: "https://github.com/MoePlayer/DPlayer" }]), e;};}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 }), t.default = function (e) {var t = this.constructor;return this.then(function (n) {return t.resolve(e()).then(function () {return n;});}, function (n) {return t.resolve(e()).then(function () {return t.reject(n);});});};}, function (e, t, n) {"use strict";(function (e, t) {!function (e, n) {if (!e.setImmediate) {var i,a,o,r,s,l = 1,c = {},u = !1,d = e.document,p = Object.getPrototypeOf && Object.getPrototypeOf(e);p = p && p.setTimeout ? p : e, "[object process]" === {}.toString.call(e.process) ? i = function i(e) {t.nextTick(function () {f(e);});} : !function () {if (e.postMessage && !e.importScripts) {var t = !0,n = e.onmessage;return e.onmessage = function () {t = !1;}, e.postMessage("", "*"), e.onmessage = n, t;}}() ? e.MessageChannel ? ((o = new MessageChannel()).port1.onmessage = function (e) {f(e.data);}, i = function i(e) {o.port2.postMessage(e);}) : d && "onreadystatechange" in d.createElement("script") ? (a = d.documentElement, i = function i(e) {var t = d.createElement("script");t.onreadystatechange = function () {f(e), t.onreadystatechange = null, a.removeChild(t), t = null;}, a.appendChild(t);}) : i = function i(e) {setTimeout(f, 0, e);} : (r = "setImmediate$" + Math.random() + "$", s = function s(t) {t.source === e && "string" == typeof t.data && 0 === t.data.indexOf(r) && f(+t.data.slice(r.length));}, e.addEventListener ? e.addEventListener("message", s, !1) : e.attachEvent("onmessage", s), i = function i(t) {e.postMessage(r + t, "*");}), p.setImmediate = function (e) {"function" != typeof e && (e = new Function("" + e));for (var t = new Array(arguments.length - 1), n = 0; n < t.length; n++) {t[n] = arguments[n + 1];}var a = { callback: e, args: t };return c[l] = a, i(l), l++;}, p.clearImmediate = h;}function h(e) {delete c[e];}function f(e) {if (u) setTimeout(f, 0, e);else {var t = c[e];if (t) {u = !0;try {!function (e) {var t = e.callback,i = e.args;switch (i.length) {case 0:t();break;case 1:t(i[0]);break;case 2:t(i[0], i[1]);break;case 3:t(i[0], i[1], i[2]);break;default:t.apply(n, i);}}(t);} finally {h(e), u = !1;}}}}}("undefined" == typeof self ? void 0 === e ? void 0 : e : self);}).call(this, n(4), n(12));}, function (e, t, n) {"use strict";var i = Function.prototype.apply;function a(e, t) {this._id = e, this._clearFn = t;}t.setTimeout = function () {return new a(i.call(setTimeout, window, arguments), clearTimeout);}, t.setInterval = function () {return new a(i.call(setInterval, window, arguments), clearInterval);}, t.clearTimeout = t.clearInterval = function (e) {e && e.close();}, a.prototype.unref = a.prototype.ref = function () {}, a.prototype.close = function () {this._clearFn.call(window, this._id);}, t.enroll = function (e, t) {clearTimeout(e._idleTimeoutId), e._idleTimeout = t;}, t.unenroll = function (e) {clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;}, t._unrefActive = t.active = function (e) {clearTimeout(e._idleTimeoutId);var t = e._idleTimeout;t >= 0 && (e._idleTimeoutId = setTimeout(function () {e._onTimeout && e._onTimeout();}, t));}, n(71), t.setImmediate = setImmediate, t.clearImmediate = clearImmediate;}, function (e, t, n) {"use strict";(function (e) {Object.defineProperty(t, "__esModule", { value: !0 });var i,a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {return typeof e;} : function (e) {return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;},o = n(70),r = (i = o) && i.__esModule ? i : { default: i };var s = setTimeout;function l() {}function c(e) {if (!(this instanceof c)) throw new TypeError("Promises must be constructed via new");if ("function" != typeof e) throw new TypeError("not a function");this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], f(e, this);}function u(e, t) {for (; 3 === e._state;) {e = e._value;}0 !== e._state ? (e._handled = !0, c._immediateFn(function () {var n = 1 === e._state ? t.onFulfilled : t.onRejected;if (null !== n) {var i;try {i = n(e._value);} catch (e) {return void p(t.promise, e);}d(t.promise, i);} else (1 === e._state ? d : p)(t.promise, e._value);})) : e._deferreds.push(t);}function d(e, t) {try {if (t === e) throw new TypeError("A promise cannot be resolved with itself.");if (t && ("object" === (void 0 === t ? "undefined" : a(t)) || "function" == typeof t)) {var n = t.then;if (t instanceof c) return e._state = 3, e._value = t, void h(e);if ("function" == typeof n) return void f((i = n, o = t, function () {i.apply(o, arguments);}), e);}e._state = 1, e._value = t, h(e);} catch (t) {p(e, t);}var i, o;}function p(e, t) {e._state = 2, e._value = t, h(e);}function h(e) {2 === e._state && 0 === e._deferreds.length && c._immediateFn(function () {e._handled || c._unhandledRejectionFn(e._value);});for (var t = 0, n = e._deferreds.length; t < n; t++) {u(e, e._deferreds[t]);}e._deferreds = null;}function f(e, t) {var n = !1;try {e(function (e) {n || (n = !0, d(t, e));}, function (e) {n || (n = !0, p(t, e));});} catch (e) {if (n) return;n = !0, p(t, e);}}c.prototype.catch = function (e) {return this.then(null, e);}, c.prototype.then = function (e, t) {var n = new this.constructor(l);return u(this, new function (e, t, n) {this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof t ? t : null, this.promise = n;}(e, t, n)), n;}, c.prototype.finally = r.default, c.all = function (e) {return new c(function (t, n) {if (!e || void 0 === e.length) throw new TypeError("Promise.all accepts an array");var i = Array.prototype.slice.call(e);if (0 === i.length) return t([]);var o = i.length;function r(e, s) {try {if (s && ("object" === (void 0 === s ? "undefined" : a(s)) || "function" == typeof s)) {var l = s.then;if ("function" == typeof l) return void l.call(s, function (t) {r(e, t);}, n);}i[e] = s, 0 == --o && t(i);} catch (e) {n(e);}}for (var s = 0; s < i.length; s++) {r(s, i[s]);}});}, c.resolve = function (e) {return e && "object" === (void 0 === e ? "undefined" : a(e)) && e.constructor === c ? e : new c(function (t) {t(e);});}, c.reject = function (e) {return new c(function (t, n) {n(e);});}, c.race = function (e) {return new c(function (t, n) {for (var i = 0, a = e.length; i < a; i++) {e[i].then(t, n);}});}, c._immediateFn = "function" == typeof e && function (t) {e(t);} || function (e) {s(e, 0);}, c._unhandledRejectionFn = function (e) {"undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", e);}, t.default = c;}).call(this, n(72).setImmediate);}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 });var i = function () {function e(e, t) {for (var n = 0; n < t.length; n++) {var i = t[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);}}return function (t, n, i) {return n && e(t.prototype, n), i && e(t, i), t;};}(),a = L(n(73)),o = L(n(1)),r = L(n(69)),s = L(n(48)),l = L(n(47)),c = L(n(2)),u = L(n(27)),d = L(n(26)),p = L(n(25)),h = L(n(24)),f = L(n(23)),y = L(n(22)),m = L(n(21)),v = L(n(20)),g = L(n(19)),b = L(n(17)),w = L(n(16)),k = L(n(15)),x = L(n(14)),S = L(n(13)),T = L(n(5));function L(e) {return e && e.__esModule ? e : { default: e };}var E = 0,M = [],_ = function () {function e(t) {var n = this;!function (e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}(this, e), this.options = (0, r.default)(t), this.options.video.quality && (this.qualityIndex = this.options.video.defaultQuality, this.quality = this.options.video.quality[this.options.video.defaultQuality]), this.tran = new s.default(this.options.lang).tran, this.events = new d.default(), this.user = new h.default(this), this.container = this.options.container, this.container.classList.add("dplayer"), this.options.danmaku || this.container.classList.add("dplayer-no-danmaku"), this.options.live && this.container.classList.add("dplayer-live"), o.default.isMobile && this.container.classList.add("dplayer-mobile"), this.arrow = this.container.offsetWidth <= 500, this.arrow && this.container.classList.add("dplayer-arrow"), this.template = new l.default({ container: this.container, options: this.options, index: E, tran: this.tran }), this.video = this.template.video, this.bar = new y.default(this.template), this.bezel = new v.default(this.template.bezel), this.fullScreen = new p.default(this), this.controller = new g.default(this), this.options.danmaku && (this.danmaku = new u.default({ container: this.template.danmaku, opacity: this.user.get("opacity"), callback: function callback() {setTimeout(function () {n.template.danmakuLoading.style.display = "none", n.options.autoplay && n.play();}, 0);}, error: function error(e) {n.notice(e);}, apiBackend: this.options.apiBackend, borderColor: this.options.theme, height: this.arrow ? 24 : 30, time: function time() {return n.video.currentTime;}, unlimited: this.user.get("unlimited"), api: { id: this.options.danmaku.id, address: this.options.danmaku.api, token: this.options.danmaku.token, maximum: this.options.danmaku.maximum, addition: this.options.danmaku.addition, user: this.options.danmaku.user }, events: this.events, tran: function tran(e) {return n.tran(e);} }), this.comment = new w.default(this)), this.setting = new b.default(this), document.addEventListener("click", function () {n.focus = !1;}, !0), this.container.addEventListener("click", function () {n.focus = !0;}, !0), this.paused = !0, this.timer = new m.default(this), this.hotkey = new k.default(this), this.contextmenu = new x.default(this), this.initVideo(this.video, this.quality && this.quality.type || this.options.video.type), this.infoPanel = new S.default(this), !this.danmaku && this.options.autoplay && this.play(), E++, M.push(this);}return i(e, [{ key: "seek", value: function value(e) {e = Math.max(e, 0), this.video.duration && (e = Math.min(e, this.video.duration)), this.video.currentTime < e ? this.notice(this.tran("FF") + " " + (e - this.video.currentTime).toFixed(0) + " " + this.tran("s")) : this.video.currentTime > e && this.notice(this.tran("REW") + " " + (this.video.currentTime - e).toFixed(0) + " " + this.tran("s")), this.video.currentTime = e, this.danmaku && this.danmaku.seek(), this.bar.set("played", e / this.video.duration, "width"), this.template.ptime.innerHTML = o.default.secondToTime(e);} }, { key: "play", value: function value() {var e = this;if (this.paused = !1, this.video.paused && this.bezel.switch(c.default.play), this.template.playButton.innerHTML = c.default.pause, a.default.resolve(this.video.play()).catch(function () {e.pause();}).then(function () {}), this.timer.enable("loading"), this.container.classList.remove("dplayer-paused"), this.container.classList.add("dplayer-playing"), this.danmaku && this.danmaku.play(), this.options.mutex) for (var t = 0; t < M.length; t++) {this !== M[t] && M[t].pause();}} }, { key: "pause", value: function value() {this.paused = !0, this.container.classList.remove("dplayer-loading"), this.video.paused || this.bezel.switch(c.default.pause), this.template.playButton.innerHTML = c.default.play, this.video.pause(), this.timer.disable("loading"), this.container.classList.remove("dplayer-playing"), this.container.classList.add("dplayer-paused"), this.danmaku && this.danmaku.pause();} }, { key: "switchVolumeIcon", value: function value() {this.volume() >= .95 ? this.template.volumeIcon.innerHTML = c.default.volumeUp : this.volume() > 0 ? this.template.volumeIcon.innerHTML = c.default.volumeDown : this.template.volumeIcon.innerHTML = c.default.volumeOff;} }, { key: "volume", value: function value(e, t, n) {if (e = parseFloat(e), !isNaN(e)) {e = Math.max(e, 0), e = Math.min(e, 1), this.bar.set("volume", e, "width");var i = (100 * e).toFixed(0) + "%";this.template.volumeBarWrapWrap.dataset.balloon = i, t || this.user.set("volume", e), n || this.notice(this.tran("Volume") + " " + (100 * e).toFixed(0) + "%"), this.video.volume = e, this.video.muted && (this.video.muted = !1), this.switchVolumeIcon();}return this.video.volume;} }, { key: "toggle", value: function value() {this.video.paused ? this.play() : this.pause();} }, { key: "on", value: function value(e, t) {this.events.on(e, t);} }, { key: "switchVideo", value: function value(e, t) {this.pause(), this.video.poster = e.pic ? e.pic : "", this.video.src = e.url, this.initMSE(this.video, e.type || "auto"), t && (this.template.danmakuLoading.style.display = "block", this.bar.set("played", 0, "width"), this.bar.set("loaded", 0, "width"), this.template.ptime.innerHTML = "00:00", this.template.danmaku.innerHTML = "", this.danmaku && this.danmaku.reload({ id: t.id, address: t.api, token: t.token, maximum: t.maximum, addition: t.addition, user: t.user }));} }, { key: "initMSE", value: function value(e, t) {var n = this;if (this.type = t, this.options.video.customType && this.options.video.customType[t]) "[object Function]" === Object.prototype.toString.call(this.options.video.customType[t]) ? this.options.video.customType[t](this.video, this) : console.error("Illegal customType: " + t);else switch ("auto" === this.type && (/m3u8(#|\?|$)/i.exec(e.src) ? this.type = "hls" : /.flv(#|\?|$)/i.exec(e.src) ? this.type = "flv" : /.mpd(#|\?|$)/i.exec(e.src) ? this.type = "dash" : this.type = "normal"), "hls" === this.type && (e.canPlayType("application/x-mpegURL") || e.canPlayType("application/vnd.apple.mpegURL")) && (this.type = "normal"), this.type) {case "hls":if (Hls) {if (Hls.isSupported()) {var i = new Hls();i.loadSource(e.src), i.attachMedia(e);} else this.notice("Error: Hls is not supported.");} else this.notice("Error: Can't find Hls.");break;case "flv":if (flvjs && flvjs.isSupported()) {if (flvjs.isSupported()) {var a = flvjs.createPlayer({ type: "flv", url: e.src });a.attachMediaElement(e), a.load();} else this.notice("Error: flvjs is not supported.");} else this.notice("Error: Can't find flvjs.");break;case "dash":dashjs ? dashjs.MediaPlayer().create().initialize(e, e.src, !1) : this.notice("Error: Can't find dashjs.");break;case "webtorrent":if (WebTorrent) {if (WebTorrent.WEBRTC_SUPPORT) {this.container.classList.add("dplayer-loading");var o = new WebTorrent(),r = e.src;o.add(r, function (e) {e.files.find(function (e) {return e.name.endsWith(".mp4");}).renderTo(n.video, { autoplay: n.options.autoplay }, function () {n.container.classList.remove("dplayer-loading");});});} else this.notice("Error: Webtorrent is not supported.");} else this.notice("Error: Can't find Webtorrent.");}} }, { key: "initVideo", value: function value(e, t) {var n = this;this.initMSE(e, t), this.on("durationchange", function () {1 !== e.duration && e.duration !== 1 / 0 && (n.template.dtime.innerHTML = o.default.secondToTime(e.duration));}), this.on("progress", function () {var t = e.buffered.length ? e.buffered.end(e.buffered.length - 1) / e.duration : 0;n.bar.set("loaded", t, "width");}), this.on("error", function () {n.video.error && n.tran && n.notice && (n.type, n.notice(n.tran("Video load failed"), -1));}), this.on("ended", function () {n.bar.set("played", 1, "width"), n.setting.loop ? (n.seek(0), n.play()) : n.pause(), n.danmaku && (n.danmaku.danIndex = 0);}), this.on("play", function () {n.paused && n.play();}), this.on("pause", function () {n.paused || n.pause();}), this.on("timeupdate", function () {n.bar.set("played", n.video.currentTime / n.video.duration, "width");var e = o.default.secondToTime(n.video.currentTime);n.template.ptime.innerHTML !== e && (n.template.ptime.innerHTML = e);});for (var i = function i(t) {e.addEventListener(n.events.videoEvents[t], function () {n.events.trigger(n.events.videoEvents[t]);});}, a = 0; a < this.events.videoEvents.length; a++) {i(a);}this.volume(this.user.get("volume"), !0, !0), this.options.subtitle && (this.subtitle = new f.default(this.template.subtitle, this.video, this.options.subtitle, this.events), this.user.get("subtitle") || this.subtitle.hide());} }, { key: "switchQuality", value: function value(e) {var t = this;if (this.qualityIndex !== e && !this.switchingQuality) {this.qualityIndex = e, this.switchingQuality = !0, this.quality = this.options.video.quality[e], this.template.qualityButton.innerHTML = this.quality.name;var n = this.video.paused;this.video.pause();var i = (0, T.default)({ current: !1, pic: null, screenshot: this.options.screenshot, preload: "auto", url: this.quality.url, subtitle: this.options.subtitle }),a = new DOMParser().parseFromString(i, "text/html").body.firstChild;this.template.videoWrap.insertBefore(a, this.template.videoWrap.getElementsByTagName("div")[0]), this.prevVideo = this.video, this.video = a, this.initVideo(this.video, this.quality.type || this.options.video.type), this.seek(this.prevVideo.currentTime), this.notice(this.tran("Switching to") + " " + this.quality.name + " " + this.tran("quality"), -1), this.events.trigger("quality_start", this.quality), this.on("canplay", function () {if (t.prevVideo) {if (t.video.currentTime !== t.prevVideo.currentTime) return void t.seek(t.prevVideo.currentTime);t.template.videoWrap.removeChild(t.prevVideo), t.video.classList.add("dplayer-video-current"), n || t.video.play(), t.prevVideo = null, t.notice(t.tran("Switched to") + " " + t.quality.name + " " + t.tran("quality")), t.switchingQuality = !1, t.events.trigger("quality_end");}});}} }, { key: "notice", value: function value(e) {var t = this,n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2e3,i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .8;this.template.notice.innerHTML = e, this.template.notice.style.opacity = i, this.noticeTime && clearTimeout(this.noticeTime), this.events.trigger("notice_show", e), n > 0 && (this.noticeTime = setTimeout(function () {t.template.notice.style.opacity = 0, t.events.trigger("notice_hide");}, n));} }, { key: "resize", value: function value() {this.danmaku && this.danmaku.resize(), this.events.trigger("resize");} }, { key: "speed", value: function value(e) {this.video.playbackRate = e;} }, { key: "destroy", value: function value() {M.splice(M.indexOf(this), 1), this.pause(), this.controller.destroy(), this.timer.destroy(), this.video.src = "", this.container.innerHTML = "", this.events.trigger("destroy");} }], [{ key: "version", get: function get() {return "1.25.0";} }]), e;}();t.default = _;},,, function (e, t, n) {}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 }), n(77);var i,a = n(74),o = (i = a) && i.__esModule ? i : { default: i };console.log("\n %c DPlayer v1.25.0 fdcf45b %c http://dplayer.js.org \n\n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;"), t.default = o.default;}]).default;});

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map