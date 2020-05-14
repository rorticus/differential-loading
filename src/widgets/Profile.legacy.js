(window["dojoWebpackJsonpdiff_test"] = window["dojoWebpackJsonpdiff_test"] || []).push([["src/widgets/Profile"],{

/***/ "./node_modules/@dojo/webpack-contrib/static-build-loader/index.js?!./node_modules/umd-compat-loader/index.js?!./node_modules/ts-loader/index.js?!./node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=ts&instanceName=0_dojo!./src/widgets/Profile.tsx":
/*!*************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/static-build-loader??ref--8-0!./node_modules/umd-compat-loader??ref--8-1!./node_modules/ts-loader??ref--8-2!./node_modules/@dojo/webpack-contrib/css-module-dts-loader?type=ts&instanceName=0_dojo!./src/widgets/Profile.tsx ***!
  \*************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vdom_1 = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var css = __webpack_require__(/*! ./styles/Profile.m.css */ "./src/widgets/styles/Profile.m.css");
var factory = vdom_1.create().properties();
exports.default = factory(function Profile(_a) {
    var properties = _a.properties;
    var username = properties().username;
    return vdom_1.tsx("h1", { classes: [css.root] }, "Welcome " + username + "!");
});


/***/ }),

/***/ "./src/widgets/styles/Profile.m.css":
/*!******************************************!*\
  !*** ./src/widgets/styles/Profile.m.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {" _key":"diff-test/Profile","root":"Profile-m__root__df891d180X4"};

/***/ })

}]);
//# sourceMappingURL=Profile.legacy.js.map