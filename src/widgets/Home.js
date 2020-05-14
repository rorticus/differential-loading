(window["dojoWebpackJsonpdiff_test"] = window["dojoWebpackJsonpdiff_test"] || []).push([["src/widgets/Home"],{

/***/ "./node_modules/@dojo/framework/core/middleware/block.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/block.mjs ***!
  \****************************************************************/
/*! exports provided: block, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "block", function() { return block; });
/* harmony import */ var _vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _icache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icache */ "./node_modules/@dojo/framework/core/middleware/icache.mjs");


const blockFactory = Object(_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ defer: _vdom__WEBPACK_IMPORTED_MODULE_0__["defer"], icache: _icache__WEBPACK_IMPORTED_MODULE_1__["default"] });
const block = blockFactory(({ middleware: { icache, defer } }) => {
    let id = 1;
    return (module) => {
        return (...args) => {
            const argsString = JSON.stringify(args);
            const moduleId = icache.get(module) || id++;
            icache.set(module, moduleId, false);
            const cachedValue = icache.getOrSet(`${moduleId}-${argsString}`, async () => {
                Object(_vdom__WEBPACK_IMPORTED_MODULE_0__["incrementBlockCount"])();
                const run = module(...args);
                defer.pause();
                const result = await run;
                Object(_vdom__WEBPACK_IMPORTED_MODULE_0__["decrementBlockCount"])();
                defer.resume();
                return result;
            });
            return cachedValue || null;
        };
    };
});
/* harmony default export */ __webpack_exports__["default"] = (block);


/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/build-time-render/build-bridge-loader.js?modulePath='src/fileList.block'!./node_modules/@dojo/webpack-contrib/build-time-render/bridge.js":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/build-time-render/build-bridge-loader.js?modulePath='src/fileList.block'!./node_modules/@dojo/webpack-contrib/build-time-render/bridge.js ***!
  \**************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dojo_framework_core_has__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dojo/framework/core/has */ "./node_modules/@dojo/framework/core/has.mjs");
/* harmony import */ var _dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dojo/framework/shim/global */ "./node_modules/@dojo/framework/shim/global.mjs");
var modulePath = 'src/fileList.block';



/* harmony default export */ __webpack_exports__["default"] = (function () {
	var args = Array.prototype.slice.call(arguments);
	/** @preserve {{ REPLACE }} **/
	if (Object(_dojo_framework_core_has__WEBPACK_IMPORTED_MODULE_0__["default"])('build-time-render') && _dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1__["default"].__dojoBuildBridge) {
		return _dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1__["default"].__dojoBuildBridge(modulePath, args);
	}
	else {
		var stringifiedArgs = JSON.stringify(args);
		if (_dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1__["default"].__dojoBuildBridgeCache &&
			_dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1__["default"].__dojoBuildBridgeCache[modulePath] &&
			_dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1__["default"].__dojoBuildBridgeCache[modulePath][stringifiedArgs]
		) {
			return _dojo_framework_shim_global__WEBPACK_IMPORTED_MODULE_1__["default"].__dojoBuildBridgeCache[modulePath][stringifiedArgs]();
		}
		return undefined;
	}
});


/***/ }),

/***/ "./src/widgets/Home.tsx":
/*!******************************!*\
  !*** ./src/widgets/Home.tsx ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.mjs");
/* harmony import */ var _dojo_framework_core_middleware_block__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dojo/framework/core/middleware/block */ "./node_modules/@dojo/framework/core/middleware/block.mjs");
/* harmony import */ var _styles_Home_m_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/Home.m.css */ "./src/widgets/styles/Home.m.css");
/* harmony import */ var _styles_Home_m_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_m_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fileList_block__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../fileList.block */ "./node_modules/@dojo/webpack-contrib/build-time-render/build-bridge-loader.js?modulePath='src/fileList.block'!./node_modules/@dojo/webpack-contrib/build-time-render/bridge.js");




const factory = Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["create"])({ block: _dojo_framework_core_middleware_block__WEBPACK_IMPORTED_MODULE_1__["default"] });
/* harmony default export */ __webpack_exports__["default"] = (factory(function Home({ middleware: { block } }) {
    return Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("div", null,
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("h1", { classes: [_styles_Home_m_css__WEBPACK_IMPORTED_MODULE_2__["root"]] }, "Home Page"),
        Object(_dojo_framework_core_vdom__WEBPACK_IMPORTED_MODULE_0__["tsx"])("pre", null, block(_fileList_block__WEBPACK_IMPORTED_MODULE_3__["default"])()));
}));


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
//# sourceMappingURL=Home.js.map