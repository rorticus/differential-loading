var shimFeatures = {"no-bootstrap":true,"intersection-observer":false,"resize-observer":false,"web-animations":false,"build-fetch":false,"inert":false,"build-blocks":true};
if (window.DojoHasEnvironment && window.DojoHasEnvironment.staticFeatures) {
	Object.keys(window.DojoHasEnvironment.staticFeatures).forEach(function (key) {
		shimFeatures[key] = window.DojoHasEnvironment.staticFeatures[key];
	});
}
window.DojoHasEnvironment = { staticFeatures: shimFeatures };(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("lib_diff_test", [], factory);
	else if(typeof exports === 'object')
		exports["lib_diff_test"] = factory();
	else
		root["lib_diff_test"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded CSS chunks
/******/ 	var installedCssChunks = {
/******/ 		"bootstrap": 0
/******/ 	}
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"bootstrap": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({"main":"main","runtime/IntersectionObserver":"runtime/IntersectionObserver","runtime/ResizeObserver":"runtime/ResizeObserver","runtime/WebAnimations":"runtime/WebAnimations","runtime/blocks":"runtime/blocks","runtime/client":"runtime/client","runtime/fetch":"runtime/fetch","runtime/inert":"runtime/inert","runtime/pointerEvents":"runtime/pointerEvents","src/widgets/About":"src/widgets/About","src/widgets/Home":"src/widgets/Home","src/widgets/Profile":"src/widgets/Profile"}[chunkId]||chunkId) + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// mini-css-extract-plugin CSS loading
/******/ 		var cssChunks = {"main":1,"src/widgets/About":1,"src/widgets/Home":1,"src/widgets/Profile":1};
/******/ 		if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);
/******/ 		else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {
/******/ 			promises.push(installedCssChunks[chunkId] = new Promise(function(resolve, reject) {
/******/ 				var href = "" + ({"main":"main","runtime/IntersectionObserver":"runtime/IntersectionObserver","runtime/ResizeObserver":"runtime/ResizeObserver","runtime/WebAnimations":"runtime/WebAnimations","runtime/blocks":"runtime/blocks","runtime/client":"runtime/client","runtime/fetch":"runtime/fetch","runtime/inert":"runtime/inert","runtime/pointerEvents":"runtime/pointerEvents","src/widgets/About":"src/widgets/About","src/widgets/Home":"src/widgets/Home","src/widgets/Profile":"src/widgets/Profile"}[chunkId]||chunkId) + ".css";
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var existingLinkTags = document.getElementsByTagName("link");
/******/ 				for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 					var tag = existingLinkTags[i];
/******/ 					var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 					if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return resolve();
/******/ 				}
/******/ 				var existingStyleTags = document.getElementsByTagName("style");
/******/ 				for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 					var tag = existingStyleTags[i];
/******/ 					var dataHref = tag.getAttribute("data-href");
/******/ 					if(dataHref === href || dataHref === fullhref) return resolve();
/******/ 				}
/******/ 				var linkTag = document.createElement("link");
/******/ 				linkTag.rel = "stylesheet";
/******/ 				linkTag.type = "text/css";
/******/ 				linkTag.onload = resolve;
/******/ 				linkTag.onerror = function(event) {
/******/ 					var request = event && event.target && event.target.src || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + request + ")");
/******/ 					err.request = request;
/******/ 					reject(err);
/******/ 				};
/******/ 				linkTag.href = fullhref;
/******/ 				var head = document.getElementsByTagName("head")[0];
/******/ 				head.appendChild(linkTag);
/******/ 			}).then(function() {
/******/ 				installedCssChunks[chunkId] = 0;
/******/ 			}));
/******/ 		}
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var head = document.getElementsByTagName('head')[0];
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["dojoWebpackJsonpdiff_test"] = window["dojoWebpackJsonpdiff_test"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@dojo/framework/core/has.mjs":
/*!***************************************************!*\
  !*** ./node_modules/@dojo/framework/core/has.mjs ***!
  \***************************************************/
/*! exports provided: testCache, testFunctions, normalize, exists, add, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "testCache", function() { return testCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "testFunctions", function() { return testFunctions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalize", function() { return normalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exists", function() { return exists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return has; });
/* harmony import */ var _shim_global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shim/global */ "./node_modules/@dojo/framework/shim/global.mjs");

/**
 * A cache of results of feature tests
 */
const testCache = {};
/**
 * A cache of the un-resolved feature tests
 */
const testFunctions = {};
/* Grab the staticFeatures if there are available */
const { staticFeatures } = _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].DojoHasEnvironment || {};
/* Cleaning up the DojoHasEnviornment */
if ('DojoHasEnvironment' in _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    delete _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].DojoHasEnvironment;
}
/**
 * Custom type guard to narrow the `staticFeatures` to either a map or a function that
 * returns a map.
 *
 * @param value The value to guard for
 */
function isStaticFeatureFunction(value) {
    return typeof value === 'function';
}
/**
 * The cache of asserted features that were available in the global scope when the
 * module loaded
 */
const staticCache = staticFeatures
    ? isStaticFeatureFunction(staticFeatures)
        ? staticFeatures.apply(_shim_global__WEBPACK_IMPORTED_MODULE_0__["default"])
        : staticFeatures
    : {}; /* Providing an empty cache, if none was in the environment


/**
* AMD plugin function.
*
* Resolves resourceId into a module id based on possibly-nested tenary expression that branches on has feature test
* value(s).
*
* @param resourceId The id of the module
* @param normalize Resolves a relative module id into an absolute module id
*/
function normalize(resourceId, normalize) {
    const tokens = resourceId.match(/[\?:]|[^:\?]*/g) || [];
    let i = 0;
    function get(skip) {
        const term = tokens[i++];
        if (term === ':') {
            // empty string module name, resolves to null
            return null;
        }
        else {
            // postfixed with a ? means it is a feature to branch on, the term is the name of the feature
            if (tokens[i++] === '?') {
                if (!skip && has(term)) {
                    // matched the feature, get the first value from the options
                    return get();
                }
                else {
                    // did not match, get the second value, passing over the first
                    get(true);
                    return get(skip);
                }
            }
            // a module
            return term;
        }
    }
    const id = get();
    return id && normalize(id);
}
/**
 * Check if a feature has already been registered
 *
 * @param feature the name of the feature
 */
function exists(feature) {
    const normalizedFeature = feature.toLowerCase();
    return Boolean(normalizedFeature in staticCache || normalizedFeature in testCache || testFunctions[normalizedFeature]);
}
/**
 * Register a new test for a named feature.
 *
 * @example
 * has.add('dom-addeventlistener', !!document.addEventListener);
 *
 * @example
 * has.add('touch-events', function () {
 *    return 'ontouchstart' in document
 * });
 *
 * @param feature the name of the feature
 * @param value the value reported of the feature, or a function that will be executed once on first test
 * @param overwrite if an existing value should be overwritten. Defaults to false.
 */
function add(feature, value, overwrite = false) {
    const normalizedFeature = feature.toLowerCase();
    if (exists(normalizedFeature) && !overwrite && !(normalizedFeature in staticCache)) {
        throw new TypeError(`Feature "${feature}" exists and overwrite not true.`);
    }
    if (typeof value === 'function') {
        testFunctions[normalizedFeature] = value;
    }
    else {
        testCache[normalizedFeature] = value;
        delete testFunctions[normalizedFeature];
    }
}
/**
 * Return the current value of a named feature.
 *
 * @param feature The name of the feature to test.
 */
function has(feature, strict = false) {
    let result;
    const normalizedFeature = feature.toLowerCase();
    if (normalizedFeature in staticCache) {
        result = staticCache[normalizedFeature];
    }
    else if (testFunctions[normalizedFeature]) {
        result = testCache[normalizedFeature] = testFunctions[normalizedFeature].call(null);
        delete testFunctions[normalizedFeature];
    }
    else if (normalizedFeature in testCache) {
        result = testCache[normalizedFeature];
    }
    else if (strict) {
        throw new TypeError(`Attempt to detect unregistered has feature "${feature}"`);
    }
    return result;
}
/*
 * Out of the box feature tests
 */
add('public-path', undefined);
/* flag for dojo debug, default to false */
add('dojo-debug', true);
/* Detects if the environment is "browser like" */
add('host-browser', true);
/* Detects if the environment is "jsdom" */
add('host-jsdom',  true && typeof navigator !== 'undefined' && navigator.userAgent.indexOf('jsdom') !== -1);
/* Detects if the environment appears to be NodeJS */
add('host-node', false);
add('fetch', true);
add('es6-array', true);
add('es6-array-fill', true);
add('es7-array', true);
add('es2019-array', true);
/* Map */
add('es6-map', true);
add('es6-iterator', true);
/* Math */
add('es6-math', true);
add('es6-math-imul', true);
/* Object */
add('es6-object', true);
add('es2017-object', true);
/* Observable */
add('es-observable', false);
/* Promise */
add('es6-promise', true);
add('es2018-promise-finally', () =>  true && typeof _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].Promise.prototype.finally !== 'undefined', true);
/* Set */
add('es6-set', true);
/* String */
add('es6-string', true);
add('es6-string-raw', true);
add('es2017-string', true);
/* Symbol */
add('es6-symbol', true);
/* WeakMap */
add('es6-weakmap', true);
/* Miscellaneous features */
add('microtasks', true);
add('postmessage', true);
add('raf', true);
add('setimmediate', false);
/* DOM Features */
add('dom-mutationobserver', true);
add('dom-webanimation', () =>  true && _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].Animation !== undefined && _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].KeyframeEffect !== undefined, true);
add('abort-controller', () => typeof _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].AbortController !== 'undefined');
add('abort-signal', () => typeof _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].AbortSignal !== 'undefined');
add('dom-intersection-observer', () =>  true && _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].IntersectionObserver !== undefined, true);
add('dom-resize-observer', () =>  true && _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].ResizeObserver !== undefined, true);
add('dom-pointer-events', () =>  true && _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].onpointerdown !== undefined, true);
add('dom-css-variables', true);
add('dom-inert', () =>  true && Element.prototype.hasOwnProperty('inert'), true);
add('build-elide', false);
add('test', false);
add('global-this', () => typeof _shim_global__WEBPACK_IMPORTED_MODULE_0__["default"].globalThis !== 'undefined');


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/Promise.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/Promise.mjs ***!
  \*******************************************************/
/*! exports provided: ShimPromise, isThenable, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShimPromise", function() { return ShimPromise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isThenable", function() { return isThenable; });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ "./node_modules/@dojo/framework/shim/global.mjs");
/* harmony import */ var _core_has__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.mjs");
var _a;

var queueMicroTask = undefined;
// !has('microtasks')
// elided: import './support/queue'
// !has('es6-symbol')
// elided: import './Symbol'

let ShimPromise = _global__WEBPACK_IMPORTED_MODULE_0__["default"].Promise;
const isThenable = function isThenable(value) {
    return value && typeof value.then === 'function';
};
if (false) {}
if (!Object(_core_has__WEBPACK_IMPORTED_MODULE_1__["default"])('es2018-promise-finally')) {
    _global__WEBPACK_IMPORTED_MODULE_0__["default"].Promise.prototype.finally = function (onFinally) {
        return this.then(onFinally && ((value) => Promise.resolve(onFinally()).then(() => value)), onFinally &&
            ((reason) => Promise.resolve(onFinally()).then(() => {
                throw reason;
            })));
    };
}
/* harmony default export */ __webpack_exports__["default"] = (ShimPromise);


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/global.mjs":
/*!******************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/global.mjs ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {const globalObject = (function () {
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof window !== 'undefined' && window.navigator.userAgent.indexOf('jsdom') > -1) {
        return window;
    }
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
})();
/* harmony default export */ __webpack_exports__["default"] = (globalObject);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/bootstrap-plugin/async.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/bootstrap-plugin/async.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! @dojo/framework/core/has */ "./node_modules/@dojo/framework/core/has.mjs");
var cldrLoader = __webpack_require__(/*! ../cldr/bootstrap */ "./node_modules/@dojo/webpack-contrib/cldr/bootstrap.js").default;
__webpack_require__(/*! ./common */ "./node_modules/@dojo/webpack-contrib/bootstrap-plugin/common.js");

var modules = [];

if (has.default('build-serve')) {
	modules.push(__webpack_require__.e(/*! import() | runtime/client */ "runtime/client").then(__webpack_require__.t.bind(null, /*! eventsource-polyfill */ "./node_modules/eventsource-polyfill/dist/browserify-eventsource.js", 7)));
	modules.push(__webpack_require__.e(/*! import() | runtime/client */ "runtime/client").then(__webpack_require__.t.bind(null, /*! ../webpack-hot-client/client */ "./node_modules/@dojo/webpack-contrib/webpack-hot-client/client.js", 7)));
}

if (has.default("build-blocks")) {
	modules.push(__webpack_require__.e(/*! import() | runtime/blocks */ "runtime/blocks").then(__webpack_require__.t.bind(null, /*! ../build-time-render/blocks */ "./node_modules/@dojo/webpack-contrib/build-time-render/blocks.js", 7)));
}

if (has.default("intersection-observer") && !has.default('dom-intersection-observer')) {
	modules.push(
		__webpack_require__.e(/*! import() | runtime/IntersectionObserver */ "runtime/IntersectionObserver").then(__webpack_require__.bind(null, /*! @dojo/framework/shim/IntersectionObserver */ "./node_modules/@dojo/framework/shim/IntersectionObserver.mjs"))
	);
}

if (has.default("build-fetch") && !true) {
	modules.push(__webpack_require__.e(/*! import() | runtime/fetch */ "runtime/fetch").then(__webpack_require__.bind(null, /*! @dojo/framework/shim/fetch */ "./node_modules/@dojo/framework/shim/fetch.mjs")));
}

if (has.default("web-animations") && !has.default('dom-webanimation')) {
	modules.push(__webpack_require__.e(/*! import() | runtime/WebAnimations */ "runtime/WebAnimations").then(__webpack_require__.bind(null, /*! @dojo/framework/shim/WebAnimations */ "./node_modules/@dojo/framework/shim/WebAnimations.mjs")));
}

if (has.default("resize-observer") && !has.default('dom-resize-observer')) {
	modules.push(__webpack_require__.e(/*! import() | runtime/ResizeObserver */ "runtime/ResizeObserver").then(__webpack_require__.bind(null, /*! @dojo/framework/shim/ResizeObserver */ "./node_modules/@dojo/framework/shim/ResizeObserver.mjs")));
}

if (has.default("inert") && !has.default('dom-inert')) {
	modules.push(__webpack_require__.e(/*! import() | runtime/inert */ "runtime/inert").then(__webpack_require__.t.bind(null, /*! @dojo/framework/shim/inert */ "./node_modules/@dojo/framework/shim/inert.mjs", 7)));
}

if (!has.default('dom-pointer-events')) {
	modules.push(__webpack_require__.e(/*! import() | runtime/pointerEvents */ "runtime/pointerEvents").then(__webpack_require__.bind(null, /*! @dojo/framework/shim/pointerEvents */ "./node_modules/@dojo/framework/shim/pointerEvents.mjs")));
}

modules.push(cldrLoader);

module.exports = Promise.all(modules).then(function() {
	return __webpack_require__.e(/*! import() | main */ "main").then(__webpack_require__.bind(null, /*! ./src/main.tsx */ "./src/main.tsx"));
});


/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/bootstrap-plugin/common.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/bootstrap-plugin/common.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! @dojo/framework/core/has */ "./node_modules/@dojo/framework/core/has.mjs");
var global = __webpack_require__(/*! @dojo/framework/shim/global */ "./node_modules/@dojo/framework/shim/global.mjs");

if (!global.default['diff_test']) {
	global.default['diff_test'] = {};
}

if (!has.exists('build-time-render')) {
	has.add('build-time-render', false, false);
}

if (!has.exists('build-serve')) {
	has.add('build-serve', false, false);
}

var appBase = global.default['diff_test'].base ? global.default['diff_test'].base : global.default.__app_base__;

var initialPublicPath = global.default['diff_test'].publicPath
	? global.default['diff_test'].publicPath
	: global.default.__public_path__;

var initialPublicOrigin = global.default['diff_test'].publicOrigin
	? global.default['diff_test'].publicOrigin
	: global.default.__public_origin__;

has.add('app-base', appBase || '/', true);

if (initialPublicPath || initialPublicOrigin) {
	var publicPath = initialPublicOrigin || window.location.origin;
	if (initialPublicPath) {
		publicPath = publicPath + initialPublicPath;
		has.add('public-path', initialPublicPath, true);
	}
	__webpack_require__.p = publicPath;
}


/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/cldr/bootstrap.js":
/*!**************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/cldr/bootstrap.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (Promise.resolve());


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
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
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 0:
/*!******************************************************************************************************!*\
  !*** multi ./src/main.css @dojo/framework/shim/Promise @dojo/webpack-contrib/bootstrap-plugin/async ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/rory/Desktop/Projects/diff-test/src/main.css */"./src/main.css");
__webpack_require__(/*! @dojo/framework/shim/Promise */"./node_modules/@dojo/framework/shim/Promise.mjs");
module.exports = __webpack_require__(/*! @dojo/webpack-contrib/bootstrap-plugin/async */"./node_modules/@dojo/webpack-contrib/bootstrap-plugin/async.js");


/***/ })

/******/ });
});
//# sourceMappingURL=bootstrap.js.map