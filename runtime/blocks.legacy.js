(window["dojoWebpackJsonpdiff_test"] = window["dojoWebpackJsonpdiff_test"] || []).push([["runtime/blocks"],{

/***/ "./node_modules/@dojo/webpack-contrib/build-time-render/blocks.js":
/*!************************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/build-time-render/blocks.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

window.blockCacheEntry = function (modulePath, args, hash) {
    window.__dojoBuildBridgeCache = window.__dojoBuildBridgeCache || {};
    window.__dojoBuildBridgeCache[modulePath] = window.__dojoBuildBridgeCache[modulePath] || {};
    window.__dojoBuildBridgeCache[modulePath][args] = function () {
        return __webpack_require__.e(hash).then(__webpack_require__.bind(null, hash + '.js')).then(function (module) {
			return module.default;
		});
    };
};
/** @preserve APPEND_BLOCK_CACHE_ENTRY **/
blockCacheEntry('src/fileList.block', '[]', 'runtime/block-85a283bdf68d7fd35542.legacy')


/***/ })

}]);
//# sourceMappingURL=blocks.legacy.js.map