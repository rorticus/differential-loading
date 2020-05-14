(window["dojoWebpackJsonpdiff_test"] = window["dojoWebpackJsonpdiff_test"] || []).push([["src/widgets/Home"],{

/***/ "./node_modules/@dojo/framework/core/middleware/block.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/block.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var vdom_1 = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var icache_1 = __webpack_require__(/*! ./icache */ "./node_modules/@dojo/framework/core/middleware/icache.js");
var blockFactory = vdom_1.create({ defer: vdom_1.defer, icache: icache_1.default });
exports.block = blockFactory(function (_a) {
    var _b = _a.middleware, icache = _b.icache, defer = _b.defer;
    var id = 1;
    return function (module) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var argsString = JSON.stringify(args);
            var moduleId = icache.get(module) || id++;
            icache.set(module, moduleId, false);
            var cachedValue = icache.getOrSet(moduleId + "-" + argsString, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var run, result;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vdom_1.incrementBlockCount();
                            run = module.apply(void 0, tslib_1.__spread(args));
                            defer.pause();
                            return [4 /*yield*/, run];
                        case 1:
                            result = _a.sent();
                            vdom_1.decrementBlockCount();
                            defer.resume();
                            return [2 /*return*/, result];
                    }
                });
            }); });
            return cachedValue || null;
        };
    };
});
exports.default = exports.block;


/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/build-time-render/build-bridge-loader.js?modulePath='src/fileList.block'!./node_modules/@dojo/webpack-contrib/build-time-render/bridge.js":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/build-time-render/build-bridge-loader.js?modulePath='src/fileList.block'!./node_modules/@dojo/webpack-contrib/build-time-render/bridge.js ***!
  \**************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dojo_framework_core_has__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dojo/framework/core/has */ "./node_modules/@dojo/framework/core/has.js");
/* harmony import */ var _dojo_framework_core_has__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dojo_framework_core_has__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dojo/framework/shim/global */ "./node_modules/@dojo/framework/shim/global.js");
/* harmony import */ var _dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1__);
var modulePath = 'src/fileList.block';



/* harmony default export */ __webpack_exports__["default"] = (function () {
	var args = Array.prototype.slice.call(arguments);
	/** @preserve {{ REPLACE }} **/
	if (_dojo_framework_core_has__WEBPACK_IMPORTED_MODULE_0___default()('build-time-render') && _dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1___default.a.__dojoBuildBridge) {
		return _dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1___default.a.__dojoBuildBridge(modulePath, args);
	}
	else {
		var stringifiedArgs = JSON.stringify(args);
		if (_dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1___default.a.__dojoBuildBridgeCache &&
			_dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1___default.a.__dojoBuildBridgeCache[modulePath] &&
			_dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1___default.a.__dojoBuildBridgeCache[modulePath][stringifiedArgs]
		) {
			return _dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1___default.a.__dojoBuildBridgeCache[modulePath][stringifiedArgs]();
		}
		return undefined;
	}
});


/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/static-build-loader/index.js?!./node_modules/umd-compat-loader/index.js?!./node_modules/ts-loader/index.js?!./node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=ts&instanceName=0_dojo!./src/widgets/Home.tsx":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/static-build-loader??ref--8-0!./node_modules/umd-compat-loader??ref--8-1!./node_modules/ts-loader??ref--8-2!./node_modules/@dojo/webpack-contrib/css-module-dts-loader?type=ts&instanceName=0_dojo!./src/widgets/Home.tsx ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vdom_1 = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var block_1 = __webpack_require__(/*! @dojo/framework/core/middleware/block */ "./node_modules/@dojo/framework/core/middleware/block.js");
var css = __webpack_require__(/*! ./styles/Home.m.css */ "./src/widgets/styles/Home.m.css");
var fileList_block_1 = __webpack_require__(/*! ../fileList.block */ "./node_modules/@dojo/webpack-contrib/build-time-render/build-bridge-loader.js?modulePath='src/fileList.block'!./node_modules/@dojo/webpack-contrib/build-time-render/bridge.js");
var factory = vdom_1.create({ block: block_1.default });
exports.default = factory(function Home(_a) {
    var block = _a.middleware.block;
    return vdom_1.tsx("div", null,
        vdom_1.tsx("h1", { classes: [css.root] }, "Home Page"),
        vdom_1.tsx("pre", null, block(fileList_block_1.default)()));
});


/***/ }),

/***/ "./src/widgets/styles/Home.m.css":
/*!***************************************!*\
  !*** ./src/widgets/styles/Home.m.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {" _key":"diff-test/Home","root":"Home-m__root__df891dZELU5"};

/***/ })

}]);
//# sourceMappingURL=Home.legacy.js.map