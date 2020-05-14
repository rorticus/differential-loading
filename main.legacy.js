(window["dojoWebpackJsonpdiff_test"] = window["dojoWebpackJsonpdiff_test"] || []).push([["main"],{

/***/ "./node_modules/@dojo/framework/core/Destroyable.js":
/*!**********************************************************!*\
  !*** ./node_modules/@dojo/framework/core/Destroyable.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Promise_1 = __webpack_require__(/*! ../shim/Promise */ "./node_modules/@dojo/framework/shim/Promise.js");
/**
 * No op function used to replace a Destroyable instance's `destroy` method, once the instance has been destroyed
 */
function noop() {
    return Promise_1.default.resolve(false);
}
/**
 * No op function used to replace a Destroyable instance's `own` method, once the instance has been destroyed
 */
function destroyed() {
    throw new Error('Call made to destroyed method');
}
var Destroyable = /** @class */ (function () {
    /**
     * @constructor
     */
    function Destroyable() {
        this.handles = [];
    }
    /**
     * Register handles for the instance that will be destroyed when `this.destroy` is called
     *
     * @param {Handle} handle The handle to add for the instance
     * @returns {Handle} A wrapper Handle. When the wrapper Handle's `destroy` method is invoked, the original handle is
     *                   removed from the instance, and its `destroy` method is invoked.
     */
    Destroyable.prototype.own = function (handle) {
        var _handles = this.handles;
        _handles.push(handle);
        return {
            destroy: function () {
                _handles.splice(_handles.indexOf(handle));
                handle.destroy();
            }
        };
    };
    /**
     * Destroys all handlers registered for the instance
     *
     * @returns {Promise<any} A Promise that resolves once all handles have been destroyed
     */
    Destroyable.prototype.destroy = function () {
        var _this = this;
        return new Promise_1.default(function (resolve) {
            _this.handles.forEach(function (handle) {
                handle && handle.destroy && handle.destroy();
            });
            _this.destroy = noop;
            _this.own = destroyed;
            resolve(true);
        });
    };
    return Destroyable;
}());
exports.Destroyable = Destroyable;
exports.default = Destroyable;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/Evented.js":
/*!******************************************************!*\
  !*** ./node_modules/@dojo/framework/core/Evented.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var Map_1 = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.js");
var Destroyable_1 = __webpack_require__(/*! ./Destroyable */ "./node_modules/@dojo/framework/core/Destroyable.js");
/**
 * Map of computed regular expressions, keyed by string
 */
var regexMap = new Map_1.default();
/**
 * Determines if the event type glob has been matched
 *
 * @returns boolean that indicates if the glob is matched
 */
function isGlobMatch(globString, targetString) {
    if (typeof targetString === 'string' && typeof globString === 'string' && globString.indexOf('*') !== -1) {
        var regex = void 0;
        if (regexMap.has(globString)) {
            regex = regexMap.get(globString);
        }
        else {
            regex = new RegExp("^" + globString.replace(/\*/g, '.*') + "$");
            regexMap.set(globString, regex);
        }
        return regex.test(targetString);
    }
    else {
        return globString === targetString;
    }
}
exports.isGlobMatch = isGlobMatch;
/**
 * Event Class
 */
var Evented = /** @class */ (function (_super) {
    tslib_1.__extends(Evented, _super);
    function Evented() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * map of listeners keyed by event type
         */
        _this.listenersMap = new Map_1.default();
        return _this;
    }
    Evented.prototype.emit = function (event) {
        var _this = this;
        this.listenersMap.forEach(function (methods, type) {
            if (isGlobMatch(type, event.type)) {
                tslib_1.__spread(methods).forEach(function (method) {
                    method.call(_this, event);
                });
            }
        });
    };
    Evented.prototype.on = function (type, listener) {
        var _this = this;
        if (Array.isArray(listener)) {
            var handles_1 = listener.map(function (listener) { return _this._addListener(type, listener); });
            return {
                destroy: function () {
                    handles_1.forEach(function (handle) { return handle.destroy(); });
                }
            };
        }
        return this._addListener(type, listener);
    };
    Evented.prototype._addListener = function (type, listener) {
        var _this = this;
        var listeners = this.listenersMap.get(type) || [];
        listeners.push(listener);
        this.listenersMap.set(type, listeners);
        return {
            destroy: function () {
                var listeners = _this.listenersMap.get(type) || [];
                listeners.splice(listeners.indexOf(listener), 1);
            }
        };
    };
    return Evented;
}(Destroyable_1.Destroyable));
exports.Evented = Evented;
exports.default = Evented;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/Injector.js":
/*!*******************************************************!*\
  !*** ./node_modules/@dojo/framework/core/Injector.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var Evented_1 = __webpack_require__(/*! ../core/Evented */ "./node_modules/@dojo/framework/core/Evented.js");
var Injector = /** @class */ (function (_super) {
    tslib_1.__extends(Injector, _super);
    function Injector(payload) {
        var _this = _super.call(this) || this;
        _this._payload = payload;
        return _this;
    }
    Injector.prototype.setInvalidator = function (invalidator) {
        this._invalidator = invalidator;
    };
    Injector.prototype.get = function () {
        return this._payload;
    };
    Injector.prototype.set = function (payload) {
        this._payload = payload;
        if (this._invalidator) {
            this._invalidator();
        }
    };
    return Injector;
}(Evented_1.Evented));
exports.Injector = Injector;
exports.default = Injector;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/Registry.js":
/*!*******************************************************!*\
  !*** ./node_modules/@dojo/framework/core/Registry.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var Promise_1 = __webpack_require__(/*! ../shim/Promise */ "./node_modules/@dojo/framework/shim/Promise.js");
var Map_1 = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.js");
var Evented_1 = __webpack_require__(/*! ../core/Evented */ "./node_modules/@dojo/framework/core/Evented.js");
/**
 * Widget base type
 */
exports.WIDGET_BASE_TYPE = '__widget_base_type';
/**
 * Checks is the item is a subclass of WidgetBase (or a WidgetBase)
 *
 * @param item the item to check
 * @returns true/false indicating if the item is a WidgetBaseConstructor
 */
function isWidgetBaseConstructor(item) {
    return Boolean(item && item._type === exports.WIDGET_BASE_TYPE);
}
exports.isWidgetBaseConstructor = isWidgetBaseConstructor;
function isWidgetFunction(item) {
    return Boolean(item && item.isWidget);
}
exports.isWidgetFunction = isWidgetFunction;
function isWNodeFactory(node) {
    if (typeof node === 'function' && node.isFactory) {
        return true;
    }
    return false;
}
exports.isWNodeFactory = isWNodeFactory;
function isWidget(item) {
    return isWidgetBaseConstructor(item) || isWidgetFunction(item);
}
exports.isWidget = isWidget;
function isWidgetConstructorDefaultExport(item) {
    return Boolean(item &&
        item.hasOwnProperty('__esModule') &&
        item.hasOwnProperty('default') &&
        (isWidget(item.default) || isWNodeFactory(item.default)));
}
exports.isWidgetConstructorDefaultExport = isWidgetConstructorDefaultExport;
/**
 * The Registry implementation
 */
var Registry = /** @class */ (function (_super) {
    tslib_1.__extends(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Emit loaded event for registry label
     */
    Registry.prototype.emitLoadedEvent = function (widgetLabel, item) {
        this.emit({
            type: widgetLabel,
            action: 'loaded',
            item: item
        });
    };
    Registry.prototype.define = function (label, item) {
        var _this = this;
        if (this._widgetRegistry === undefined) {
            this._widgetRegistry = new Map_1.default();
        }
        if (this._widgetRegistry.has(label)) {
            throw new Error("widget has already been registered for '" + label.toString() + "'");
        }
        this._widgetRegistry.set(label, item);
        if (item instanceof Promise_1.default) {
            item.then(function (widgetCtor) {
                _this._widgetRegistry.set(label, widgetCtor);
                _this.emitLoadedEvent(label, widgetCtor);
                return widgetCtor;
            }, function (error) {
                throw error;
            });
        }
        else if (isWidgetBaseConstructor(item)) {
            this.emitLoadedEvent(label, item);
        }
    };
    Registry.prototype.defineInjector = function (label, injectorFactory) {
        if (this._injectorRegistry === undefined) {
            this._injectorRegistry = new Map_1.default();
        }
        if (this._injectorRegistry.has(label)) {
            throw new Error("injector has already been registered for '" + label.toString() + "'");
        }
        var invalidator = new Evented_1.Evented();
        var injectorItem = {
            injector: injectorFactory(function () { return invalidator.emit({ type: 'invalidate' }); }),
            invalidator: invalidator
        };
        this._injectorRegistry.set(label, injectorItem);
        this.emitLoadedEvent(label, injectorItem);
    };
    Registry.prototype.get = function (label) {
        var _this = this;
        if (!this._widgetRegistry || !this.has(label)) {
            return null;
        }
        var item = this._widgetRegistry.get(label);
        if (isWidget(item) || isWNodeFactory(item)) {
            return item;
        }
        if (item instanceof Promise_1.default) {
            return null;
        }
        var promise = item();
        this._widgetRegistry.set(label, promise);
        promise.then(function (widgetCtor) {
            if (isWidgetConstructorDefaultExport(widgetCtor)) {
                widgetCtor = widgetCtor.default;
            }
            _this._widgetRegistry.set(label, widgetCtor);
            _this.emitLoadedEvent(label, widgetCtor);
            return widgetCtor;
        }, function (error) {
            throw error;
        });
        return null;
    };
    Registry.prototype.getInjector = function (label) {
        if (!this._injectorRegistry || !this.hasInjector(label)) {
            return null;
        }
        return this._injectorRegistry.get(label);
    };
    Registry.prototype.has = function (label) {
        return Boolean(this._widgetRegistry && this._widgetRegistry.has(label));
    };
    Registry.prototype.hasInjector = function (label) {
        return Boolean(this._injectorRegistry && this._injectorRegistry.has(label));
    };
    return Registry;
}(Evented_1.Evented));
exports.Registry = Registry;
exports.default = Registry;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/RegistryHandler.js":
/*!**************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/RegistryHandler.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var Map_1 = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.js");
var Evented_1 = __webpack_require__(/*! ../core/Evented */ "./node_modules/@dojo/framework/core/Evented.js");
var Registry_1 = __webpack_require__(/*! ./Registry */ "./node_modules/@dojo/framework/core/Registry.js");
var RegistryHandler = /** @class */ (function (_super) {
    tslib_1.__extends(RegistryHandler, _super);
    function RegistryHandler() {
        var _this = _super.call(this) || this;
        _this._registry = new Registry_1.Registry();
        _this._registryWidgetLabelMap = new Map_1.Map();
        _this._registryInjectorLabelMap = new Map_1.Map();
        _this.own(_this._registry);
        var destroy = function () {
            if (_this.baseRegistry) {
                _this._registryWidgetLabelMap.delete(_this.baseRegistry);
                _this._registryInjectorLabelMap.delete(_this.baseRegistry);
                _this.baseRegistry = undefined;
            }
        };
        _this.own({ destroy: destroy });
        return _this;
    }
    Object.defineProperty(RegistryHandler.prototype, "base", {
        get: function () {
            return this.baseRegistry;
        },
        set: function (baseRegistry) {
            if (this.baseRegistry) {
                this._registryWidgetLabelMap.delete(this.baseRegistry);
                this._registryInjectorLabelMap.delete(this.baseRegistry);
            }
            this.baseRegistry = baseRegistry;
        },
        enumerable: true,
        configurable: true
    });
    RegistryHandler.prototype.define = function (label, widget) {
        this._registry.define(label, widget);
    };
    RegistryHandler.prototype.defineInjector = function (label, injector) {
        this._registry.defineInjector(label, injector);
    };
    RegistryHandler.prototype.has = function (label) {
        return this._registry.has(label) || Boolean(this.baseRegistry && this.baseRegistry.has(label));
    };
    RegistryHandler.prototype.hasInjector = function (label) {
        return this._registry.hasInjector(label) || Boolean(this.baseRegistry && this.baseRegistry.hasInjector(label));
    };
    RegistryHandler.prototype.get = function (label, globalPrecedence) {
        if (globalPrecedence === void 0) { globalPrecedence = false; }
        return this._get(label, globalPrecedence, 'get', this._registryWidgetLabelMap);
    };
    RegistryHandler.prototype.getInjector = function (label, globalPrecedence) {
        if (globalPrecedence === void 0) { globalPrecedence = false; }
        return this._get(label, globalPrecedence, 'getInjector', this._registryInjectorLabelMap);
    };
    RegistryHandler.prototype._get = function (label, globalPrecedence, getFunctionName, labelMap) {
        var _this = this;
        var registries = globalPrecedence ? [this.baseRegistry, this._registry] : [this._registry, this.baseRegistry];
        for (var i = 0; i < registries.length; i++) {
            var registry = registries[i];
            if (!registry) {
                continue;
            }
            var item = registry[getFunctionName](label);
            var registeredLabels = labelMap.get(registry) || [];
            if (item) {
                return item;
            }
            else if (registeredLabels.indexOf(label) === -1) {
                var handle = registry.on(label, function (event) {
                    if (event.action === 'loaded' &&
                        _this[getFunctionName](label, globalPrecedence) === event.item) {
                        _this.emit({ type: 'invalidate' });
                    }
                });
                this.own(handle);
                labelMap.set(registry, tslib_1.__spread(registeredLabels, [label]));
            }
        }
        return null;
    };
    return RegistryHandler;
}(Evented_1.Evented));
exports.RegistryHandler = RegistryHandler;
exports.default = RegistryHandler;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/ThemeInjector.js":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/ThemeInjector.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__(/*! ../shim/global */ "./node_modules/@dojo/framework/shim/global.js");
var Injector_1 = __webpack_require__(/*! ./Injector */ "./node_modules/@dojo/framework/core/Injector.js");
var cssVariables_1 = __webpack_require__(/*! ../shim/cssVariables */ "./node_modules/@dojo/framework/shim/cssVariables.js");
var Map_1 = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.js");
var has_1 = __webpack_require__(/*! ./has */ "./node_modules/@dojo/framework/core/has.js");
function isVariantModule(variant) {
    return typeof variant !== 'string';
}
exports.isVariantModule = isVariantModule;
function isThemeWithVariant(theme) {
    return theme && theme.hasOwnProperty('variant');
}
exports.isThemeWithVariant = isThemeWithVariant;
function isThemeWithVariants(theme) {
    return theme && theme.hasOwnProperty('variants');
}
exports.isThemeWithVariants = isThemeWithVariants;
function isThemeInjectorPayloadWithVariant(theme) {
    return !!theme && theme.hasOwnProperty('variant');
}
exports.isThemeInjectorPayloadWithVariant = isThemeInjectorPayloadWithVariant;
var processCssVariant = function (_) { };
if (!has_1.default('dom-css-variables')) {
    var setUpCssVariantSupport = function () {
        var styleId = '__dojo_processed_styles';
        var processedCssMap = new Map_1.default();
        var variantStyleElement;
        function applyStyles(css) {
            var style = document.createElement('style');
            style.textContent = css;
            style.setAttribute('id', styleId);
            if (variantStyleElement && variantStyleElement.parentNode) {
                variantStyleElement.parentNode.replaceChild(style, variantStyleElement);
            }
            else {
                global_1.default.document.head.appendChild(style);
            }
            variantStyleElement = style;
        }
        return function processCssVariant(variantName) {
            var processedCss = processedCssMap.get(variantName);
            if (processedCss) {
                applyStyles(processedCss);
            }
            else {
                cssVariables_1.default({
                    exclude: "style[id=" + styleId + "]",
                    onSuccess: function (css) {
                        var temp = css;
                        var index = temp.indexOf(variantName);
                        var variantCss = '';
                        while (index !== -1) {
                            temp = temp.substring(index + variantName.length);
                            var match = temp.match(/\{([^}]+)\}/);
                            if (match) {
                                if (variantCss) {
                                    variantCss = "" + variantCss.substring(0, variantCss.length - 1) + match[0].substring(1);
                                }
                                else {
                                    variantCss = match[0];
                                }
                            }
                            index = temp.indexOf(variantName);
                        }
                        if (variantCss) {
                            css = ":root " + variantCss + css;
                        }
                        return css;
                    },
                    onComplete: function (css) {
                        processedCssMap.set(variantName, css);
                        applyStyles(css);
                    },
                    updateDOM: false,
                    silent: true
                });
            }
        };
    };
    processCssVariant = setUpCssVariantSupport();
}
function createThemeInjectorPayload(theme, variant) {
    if (isThemeWithVariant(theme)) {
        if (typeof theme.variant === 'string') {
            return {
                theme: theme.theme,
                variant: { name: theme.variant, value: theme.theme.variants[theme.variant] }
            };
        }
        return { theme: theme.theme, variant: theme.variant };
    }
    else if (isThemeWithVariants(theme)) {
        variant = variant || 'default';
        if (isVariantModule(variant)) {
            if (!has_1.default('dom-css-variables')) {
                processCssVariant(variant.value.root);
            }
            return { theme: theme, variant: variant };
        }
        if (!has_1.default('dom-css-variables')) {
            processCssVariant(theme.variants[variant].root);
        }
        return { theme: theme, variant: { name: variant, value: theme.variants[variant] } };
    }
    return { theme: theme };
}
var ThemeInjector = /** @class */ (function (_super) {
    tslib_1.__extends(ThemeInjector, _super);
    function ThemeInjector(theme) {
        return _super.call(this, theme ? createThemeInjectorPayload(theme) : theme) || this;
    }
    ThemeInjector.prototype.set = function (theme, variant) {
        _super.prototype.set.call(this, createThemeInjectorPayload(theme, variant));
    };
    ThemeInjector.prototype.get = function () {
        return _super.prototype.get.call(this);
    };
    return ThemeInjector;
}(Injector_1.default));
exports.ThemeInjector = ThemeInjector;
exports.default = ThemeInjector;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/diff.js":
/*!***************************************************!*\
  !*** ./node_modules/@dojo/framework/core/diff.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = __webpack_require__(/*! ./Registry */ "./node_modules/@dojo/framework/core/Registry.js");
function isObjectOrArray(value) {
    return Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value);
}
function always(previousProperty, newProperty) {
    return {
        changed: true,
        value: newProperty
    };
}
exports.always = always;
function ignore(previousProperty, newProperty) {
    return {
        changed: false,
        value: newProperty
    };
}
exports.ignore = ignore;
function reference(previousProperty, newProperty) {
    return {
        changed: previousProperty !== newProperty,
        value: newProperty
    };
}
exports.reference = reference;
function shallow(previousProperty, newProperty, depth) {
    if (depth === void 0) { depth = 0; }
    var changed = false;
    var validOldProperty = previousProperty && isObjectOrArray(previousProperty);
    var validNewProperty = newProperty && isObjectOrArray(newProperty);
    if (!validOldProperty || !validNewProperty) {
        return {
            changed: true,
            value: newProperty
        };
    }
    var previousKeys = Object.keys(previousProperty);
    var newKeys = Object.keys(newProperty);
    if (previousKeys.length !== newKeys.length) {
        changed = true;
    }
    else {
        changed = newKeys.some(function (key) {
            if (depth > 0) {
                return shallow(newProperty[key], previousProperty[key], depth - 1).changed;
            }
            return newProperty[key] !== previousProperty[key];
        });
    }
    return {
        changed: changed,
        value: newProperty
    };
}
exports.shallow = shallow;
function auto(previousProperty, newProperty) {
    var result;
    if (typeof newProperty === 'function') {
        if (newProperty._type === Registry_1.WIDGET_BASE_TYPE) {
            result = reference(previousProperty, newProperty);
        }
        else {
            result = ignore(previousProperty, newProperty);
        }
    }
    else if (isObjectOrArray(newProperty)) {
        result = shallow(previousProperty, newProperty);
    }
    else {
        result = reference(previousProperty, newProperty);
    }
    return result;
}
exports.auto = auto;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/middleware/icache.js":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/icache.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:interface-name */
var Map_1 = __webpack_require__(/*! ../../shim/Map */ "./node_modules/@dojo/framework/shim/Map.js");
var vdom_1 = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var factory = vdom_1.create({ invalidator: vdom_1.invalidator, destroy: vdom_1.destroy });
function createICacheMiddleware() {
    var icache = factory(function (_a) {
        var _b = _a.middleware, invalidator = _b.invalidator, destroy = _b.destroy;
        var cacheMap = new Map_1.default();
        destroy(function () {
            cacheMap.clear();
        });
        var api = {
            get: function (key) {
                var cachedValue = cacheMap.get(key);
                if (!cachedValue || cachedValue.status === 'pending') {
                    return undefined;
                }
                return cachedValue.value;
            }
        };
        api.set = function (key, value, invalidate) {
            if (invalidate === void 0) { invalidate = true; }
            var current = api.get(key);
            if (typeof value === 'function') {
                value = value(current);
                if (value && typeof value.then === 'function') {
                    cacheMap.set(key, {
                        status: 'pending',
                        value: value
                    });
                    value.then(function (result) {
                        var cachedValue = cacheMap.get(key);
                        if (cachedValue && cachedValue.value === value) {
                            cacheMap.set(key, {
                                status: 'resolved',
                                value: result
                            });
                            invalidate && invalidator();
                        }
                    });
                    return undefined;
                }
            }
            cacheMap.set(key, {
                status: 'resolved',
                value: value
            });
            invalidate && invalidator();
            return value;
        };
        api.has = function (key) {
            return cacheMap.has(key);
        };
        api.delete = function (key, invalidate) {
            if (invalidate === void 0) { invalidate = true; }
            cacheMap.delete(key);
            invalidate && invalidator();
        };
        api.clear = function (invalidate) {
            if (invalidate === void 0) { invalidate = true; }
            cacheMap.clear();
            invalidate && invalidator();
        };
        api.getOrSet = function (key, value, invalidate) {
            if (invalidate === void 0) { invalidate = true; }
            var cachedValue = cacheMap.get(key);
            if (!cachedValue) {
                api.set(key, value, invalidate);
            }
            cachedValue = cacheMap.get(key);
            if (!cachedValue || cachedValue.status === 'pending') {
                return undefined;
            }
            return cachedValue.value;
        };
        return api;
    });
    return icache;
}
exports.createICacheMiddleware = createICacheMiddleware;
exports.icache = createICacheMiddleware();
exports.default = exports.icache;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/middleware/injector.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/injector.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vdom_1 = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var injectorFactory = vdom_1.create({ getRegistry: vdom_1.getRegistry, invalidator: vdom_1.invalidator, destroy: vdom_1.destroy });
exports.injector = injectorFactory(function (_a) {
    var _b = _a.middleware, getRegistry = _b.getRegistry, invalidator = _b.invalidator, destroy = _b.destroy;
    var handles = [];
    destroy(function () {
        var handle;
        while ((handle = handles.pop())) {
            handle.destroy();
        }
    });
    var registry = getRegistry();
    return {
        subscribe: function (label, callback) {
            if (callback === void 0) { callback = invalidator; }
            if (registry) {
                var item = registry.getInjector(label);
                if (item) {
                    var handle_1 = item.invalidator.on('invalidate', function () {
                        callback();
                    });
                    handles.push(handle_1);
                    return function () {
                        var index = handles.indexOf(handle_1);
                        if (index !== -1) {
                            handles.splice(index, 1);
                            handle_1.destroy();
                        }
                    };
                }
            }
        },
        get: function (label) {
            if (registry) {
                var item = registry.getInjector(label);
                if (item) {
                    return item.injector();
                }
            }
            return null;
        }
    };
});
exports.default = exports.injector;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/middleware/theme.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/framework/core/middleware/theme.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var vdom_1 = __webpack_require__(/*! ../vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var icache_1 = __webpack_require__(/*! ./icache */ "./node_modules/@dojo/framework/core/middleware/icache.js");
var injector_1 = __webpack_require__(/*! ./injector */ "./node_modules/@dojo/framework/core/middleware/injector.js");
var Set_1 = __webpack_require__(/*! ../../shim/Set */ "./node_modules/@dojo/framework/shim/Set.js");
var diff_1 = __webpack_require__(/*! ../diff */ "./node_modules/@dojo/framework/core/diff.js");
var ThemeInjector_1 = __webpack_require__(/*! ../ThemeInjector */ "./node_modules/@dojo/framework/core/ThemeInjector.js");
exports.THEME_KEY = ' _key';
exports.INJECTED_THEME_KEY = '__theme_injector';
function registerThemeInjector(theme, themeRegistry) {
    var themeInjector = new ThemeInjector_1.ThemeInjector(theme);
    themeRegistry.defineInjector(exports.INJECTED_THEME_KEY, function (invalidator) {
        themeInjector.setInvalidator(invalidator);
        return function () { return themeInjector; };
    });
    return themeInjector;
}
var factory = vdom_1.create({ invalidator: vdom_1.invalidator, icache: icache_1.default, diffProperty: vdom_1.diffProperty, injector: injector_1.default, getRegistry: vdom_1.getRegistry }).properties();
exports.theme = factory(function (_a) {
    var _b = _a.middleware, invalidator = _b.invalidator, icache = _b.icache, diffProperty = _b.diffProperty, injector = _b.injector, getRegistry = _b.getRegistry, properties = _a.properties;
    var themeKeys = new Set_1.default();
    diffProperty('theme', properties, function (current, next) {
        var themeInjector = injector.get(exports.INJECTED_THEME_KEY);
        var diffResult = diff_1.auto(current.theme, next.theme);
        if (diffResult.changed) {
            icache.clear();
            invalidator();
        }
        if (!next.theme && themeInjector) {
            var themePayload = themeInjector.get();
            if (ThemeInjector_1.isThemeInjectorPayloadWithVariant(themePayload)) {
                return { theme: themePayload.theme, variant: themePayload.variant };
            }
            else if (themePayload) {
                return themePayload.theme;
            }
        }
    });
    diffProperty('classes', function (current, next) {
        var result = false;
        if ((current.classes && !next.classes) || (!current.classes && next.classes)) {
            result = true;
        }
        else if (current.classes && next.classes) {
            var keys = tslib_1.__spread(themeKeys.values());
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                result = diff_1.shallow(current.classes[key], next.classes[key], 1).changed;
                if (result) {
                    break;
                }
            }
        }
        if (result) {
            icache.clear();
            invalidator();
        }
    });
    var themeInjector = injector.get(exports.INJECTED_THEME_KEY);
    if (!themeInjector) {
        var registry = getRegistry();
        if (registry) {
            registerThemeInjector(undefined, registry.base);
        }
    }
    injector.subscribe(exports.INJECTED_THEME_KEY, function () {
        icache.clear();
        invalidator();
    });
    function set(theme, variant) {
        var currentTheme = injector.get(exports.INJECTED_THEME_KEY);
        if (currentTheme) {
            if (ThemeInjector_1.isThemeWithVariants(theme)) {
                currentTheme.set(theme, variant);
            }
            else {
                currentTheme.set(theme);
            }
        }
    }
    return {
        classes: function (css) {
            var cachedTheme = icache.get(css);
            if (cachedTheme) {
                return cachedTheme;
            }
            var _a = exports.THEME_KEY, key = css[_a], classes = tslib_1.__rest(css, [typeof _a === "symbol" ? _a : _a + ""]);
            themeKeys.add(key);
            var theme = classes;
            var _b = properties(), currentTheme = _b.theme, currentClasses = _b.classes;
            if (currentTheme && ThemeInjector_1.isThemeWithVariant(currentTheme)) {
                currentTheme = ThemeInjector_1.isThemeWithVariants(currentTheme.theme)
                    ? currentTheme.theme.theme
                    : currentTheme.theme;
            }
            if (currentTheme && currentTheme[key]) {
                theme = tslib_1.__assign({}, theme, currentTheme[key]);
            }
            if (currentClasses && currentClasses[key]) {
                var classKeys = Object.keys(currentClasses[key]);
                for (var i = 0; i < classKeys.length; i++) {
                    var classKey = classKeys[i];
                    if (theme[classKey]) {
                        theme[classKey] = theme[classKey] + " " + currentClasses[key][classKey].join(' ');
                    }
                }
            }
            icache.set(css, theme, false);
            return theme;
        },
        variant: function () {
            var theme = properties().theme;
            if (theme && ThemeInjector_1.isThemeWithVariant(theme)) {
                return theme.variant.value.root;
            }
        },
        set: set,
        get: function () {
            var currentTheme = injector.get(exports.INJECTED_THEME_KEY);
            if (currentTheme) {
                return currentTheme.get();
            }
        }
    };
});
exports.default = exports.theme;


/***/ }),

/***/ "./node_modules/@dojo/framework/core/vdom.js":
/*!***************************************************!*\
  !*** ./node_modules/@dojo/framework/core/vdom.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__(/*! ../shim/global */ "./node_modules/@dojo/framework/shim/global.js");
var has_1 = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.js");
var WeakMap_1 = __webpack_require__(/*! ../shim/WeakMap */ "./node_modules/@dojo/framework/shim/WeakMap.js");
var Set_1 = __webpack_require__(/*! ../shim/Set */ "./node_modules/@dojo/framework/shim/Set.js");
var Map_1 = __webpack_require__(/*! ../shim/Map */ "./node_modules/@dojo/framework/shim/Map.js");
var array_1 = __webpack_require__(/*! ../shim/array */ "./node_modules/@dojo/framework/shim/array.js");
var Registry_1 = __webpack_require__(/*! ./Registry */ "./node_modules/@dojo/framework/core/Registry.js");
var diff_1 = __webpack_require__(/*! ./diff */ "./node_modules/@dojo/framework/core/diff.js");
var RegistryHandler_1 = __webpack_require__(/*! ./RegistryHandler */ "./node_modules/@dojo/framework/core/RegistryHandler.js");
var EMPTY_ARRAY = [];
var nodeOperations = ['focus', 'blur', 'scrollIntoView', 'click'];
var NAMESPACE_W3 = 'http://www.w3.org/';
var NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
var NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
var WNODE = '__WNODE_TYPE';
var VNODE = '__VNODE_TYPE';
var DOMVNODE = '__DOMVNODE_TYPE';
// @ts-ignore
var scope =  true ? 'diff_test' : undefined;
if (!global_1.default[scope]) {
    global_1.default[scope] = {};
}
function setRendering(value) {
    global_1.default[scope].rendering = value;
}
exports.setRendering = setRendering;
function incrementBlockCount() {
    var blocksPending = global_1.default[scope].blocksPending || 0;
    global_1.default[scope].blocksPending = blocksPending + 1;
}
exports.incrementBlockCount = incrementBlockCount;
function decrementBlockCount() {
    var blocksPending = global_1.default[scope].blocksPending || 0;
    global_1.default[scope].blocksPending = blocksPending - 1;
}
exports.decrementBlockCount = decrementBlockCount;
function isTextNode(item) {
    return item && item.nodeType === 3;
}
exports.isTextNode = isTextNode;
function isLazyDefine(item) {
    return Boolean(item && item.label);
}
function isWNodeWrapper(child) {
    return child && isWNode(child.node);
}
function isVNodeWrapper(child) {
    return !!child && isVNode(child.node);
}
function isVirtualWrapper(child) {
    return isVNodeWrapper(child) && child.node.tag === 'virtual';
}
function isBodyWrapper(wrapper) {
    return isVNodeWrapper(wrapper) && wrapper.node.tag === 'body';
}
function isAttachApplication(value) {
    return !!value.type;
}
function isWNode(child) {
    return Boolean(child && child !== true && typeof child !== 'string' && child.type === WNODE);
}
exports.isWNode = isWNode;
function isVNode(child) {
    return Boolean(child && child !== true && typeof child !== 'string' && (child.type === VNODE || child.type === DOMVNODE));
}
exports.isVNode = isVNode;
function isDomVNode(child) {
    return Boolean(child && child !== true && typeof child !== 'string' && child.type === DOMVNODE);
}
exports.isDomVNode = isDomVNode;
function isElementNode(value) {
    return !!value.tagName;
}
exports.isElementNode = isElementNode;
function toTextVNode(data) {
    return {
        tag: '',
        properties: {},
        children: undefined,
        text: "" + data,
        type: VNODE
    };
}
function updateAttributes(domNode, previousAttributes, attributes, namespace) {
    var attrNames = Object.keys(attributes);
    var attrCount = attrNames.length;
    for (var i = 0; i < attrCount; i++) {
        var attrName = attrNames[i];
        var attrValue = attributes[attrName];
        var previousAttrValue = previousAttributes[attrName];
        if (attrValue !== previousAttrValue) {
            updateAttribute(domNode, attrName, attrValue, namespace);
        }
    }
}
function w(widgetConstructorOrNode, properties, children) {
    if (properties.__children__) {
        delete properties.__children__;
    }
    if (Registry_1.isWNodeFactory(widgetConstructorOrNode)) {
        return widgetConstructorOrNode(properties, children);
    }
    if (isWNode(widgetConstructorOrNode)) {
        properties = tslib_1.__assign({}, widgetConstructorOrNode.properties, properties);
        children = children ? children : widgetConstructorOrNode.children;
        widgetConstructorOrNode = widgetConstructorOrNode.widgetConstructor;
    }
    return {
        children: children || [],
        widgetConstructor: widgetConstructorOrNode,
        properties: properties,
        type: WNODE
    };
}
exports.w = w;
function v(tag, propertiesOrChildren, children) {
    if (propertiesOrChildren === void 0) { propertiesOrChildren = {}; }
    if (children === void 0) { children = undefined; }
    var properties = propertiesOrChildren;
    var deferredPropertiesCallback;
    if (typeof tag.tag === 'function') {
        return tag.tag(properties, children);
    }
    if (Array.isArray(propertiesOrChildren)) {
        children = propertiesOrChildren;
        properties = {};
    }
    if (typeof properties === 'function') {
        deferredPropertiesCallback = properties;
        properties = {};
    }
    if (isVNode(tag)) {
        var _a = properties.classes, classes = _a === void 0 ? [] : _a, _b = properties.styles, styles = _b === void 0 ? {} : _b, newProperties = tslib_1.__rest(properties, ["classes", "styles"]);
        var _c = tag.properties, _d = _c.classes, nodeClasses = _d === void 0 ? [] : _d, _e = _c.styles, nodeStyles = _e === void 0 ? {} : _e, nodeProperties = tslib_1.__rest(_c, ["classes", "styles"]);
        nodeClasses = Array.isArray(nodeClasses) ? nodeClasses : [nodeClasses];
        classes = Array.isArray(classes) ? classes : [classes];
        styles = tslib_1.__assign({}, nodeStyles, styles);
        properties = tslib_1.__assign({}, nodeProperties, newProperties, { classes: tslib_1.__spread(nodeClasses, classes), styles: styles });
        children = children ? children : tag.children;
        tag = tag.tag;
    }
    return {
        tag: tag,
        deferredPropertiesCallback: deferredPropertiesCallback,
        children: children,
        properties: properties,
        type: VNODE
    };
}
exports.v = v;
/**
 * Create a VNode for an existing DOM Node.
 */
function dom(_a, children) {
    var node = _a.node, _b = _a.attrs, attrs = _b === void 0 ? {} : _b, _c = _a.props, props = _c === void 0 ? {} : _c, _d = _a.on, on = _d === void 0 ? {} : _d, _e = _a.diffType, diffType = _e === void 0 ? 'none' : _e, onAttach = _a.onAttach;
    return {
        tag: isElementNode(node) ? node.tagName.toLowerCase() : '',
        properties: props,
        attributes: attrs,
        events: on,
        children: children,
        type: DOMVNODE,
        domNode: node,
        text: isElementNode(node) ? undefined : node.data,
        diffType: diffType,
        onAttach: onAttach
    };
}
exports.dom = dom;
exports.REGISTRY_ITEM = '__registry_item';
var FromRegistry = /** @class */ (function () {
    function FromRegistry() {
        /* tslint:disable-next-line:variable-name */
        this.__properties__ = {};
    }
    FromRegistry.type = exports.REGISTRY_ITEM;
    return FromRegistry;
}());
exports.FromRegistry = FromRegistry;
function fromRegistry(tag) {
    var _a;
    return _a = /** @class */ (function (_super) {
            tslib_1.__extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.properties = {};
                _this.name = tag;
                return _this;
            }
            return class_1;
        }(FromRegistry)),
        _a.type = exports.REGISTRY_ITEM,
        _a;
}
exports.fromRegistry = fromRegistry;
function tsx(tag, properties) {
    if (properties === void 0) { properties = {}; }
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    children = array_1.flat(children, Infinity);
    properties = properties === null ? {} : properties;
    if (typeof tag === 'string') {
        return v(tag, properties, children);
    }
    else if (tag.type === 'registry' && properties.__autoRegistryItem) {
        var name_1 = properties.__autoRegistryItem;
        delete properties.__autoRegistryItem;
        return w(name_1, properties, children);
    }
    else if (tag.type === exports.REGISTRY_ITEM) {
        var registryItem = new tag();
        return w(registryItem.name, properties, children);
    }
    else {
        return w(tag, properties, children);
    }
}
exports.tsx = tsx;
function propertiesDiff(current, next, invalidator, ignoreProperties) {
    var propertyNames = tslib_1.__spread(Object.keys(current), Object.keys(next));
    for (var i = 0; i < propertyNames.length; i++) {
        if (ignoreProperties.indexOf(propertyNames[i]) > -1) {
            continue;
        }
        var result = diff_1.auto(current[propertyNames[i]], next[propertyNames[i]]);
        if (result.changed) {
            invalidator();
            break;
        }
        ignoreProperties.push(propertyNames[i]);
    }
}
exports.propertiesDiff = propertiesDiff;
function buildPreviousProperties(domNode, current) {
    var _a = current.node, diffType = _a.diffType, properties = _a.properties, attributes = _a.attributes;
    if (!diffType || diffType === 'vdom') {
        return {
            properties: current.deferredProperties
                ? tslib_1.__assign({}, current.deferredProperties, current.node.properties) : current.node.properties,
            attributes: current.node.attributes,
            events: current.node.events
        };
    }
    else if (diffType === 'none') {
        return {
            properties: {},
            attributes: current.node.attributes ? {} : undefined,
            events: current.node.events
        };
    }
    var newProperties = {
        properties: {}
    };
    if (attributes) {
        newProperties.attributes = {};
        newProperties.events = current.node.events;
        Object.keys(properties).forEach(function (propName) {
            newProperties.properties[propName] = domNode[propName];
        });
        Object.keys(attributes).forEach(function (attrName) {
            newProperties.attributes[attrName] = domNode.getAttribute(attrName);
        });
        return newProperties;
    }
    newProperties.properties = Object.keys(properties).reduce(function (props, property) {
        props[property] = domNode.getAttribute(property) || domNode[property];
        return props;
    }, {});
    return newProperties;
}
function checkDistinguishable(wrappers, index, parentWNodeWrapper) {
    var wrapperToCheck = wrappers[index];
    if (isVNodeWrapper(wrapperToCheck) && !wrapperToCheck.node.tag) {
        return;
    }
    var key = wrapperToCheck.node.properties.key;
    var parentName = 'unknown';
    if (parentWNodeWrapper) {
        var widgetConstructor = parentWNodeWrapper.node.widgetConstructor;
        parentName = widgetConstructor.name || 'unknown';
    }
    if (key === undefined || key === null) {
        for (var i = 0; i < wrappers.length; i++) {
            if (i !== index) {
                var wrapper = wrappers[i];
                if (same(wrapper, wrapperToCheck)) {
                    var nodeIdentifier = void 0;
                    if (isWNodeWrapper(wrapper)) {
                        nodeIdentifier = wrapper.node.widgetConstructor.name || 'unknown';
                    }
                    else {
                        nodeIdentifier = wrapper.node.tag;
                    }
                    console.warn("A widget (" + parentName + ") has had a child added or removed, but they were not able to uniquely identified. It is recommended to provide a unique 'key' property when using the same widget or element (" + nodeIdentifier + ") multiple times as siblings");
                    break;
                }
            }
        }
    }
}
function same(dnode1, dnode2) {
    if (isVNodeWrapper(dnode1) && isVNodeWrapper(dnode2)) {
        if (isDomVNode(dnode1.node) && isDomVNode(dnode2.node)) {
            if (dnode1.node.domNode !== dnode2.node.domNode) {
                return false;
            }
        }
        if (dnode1.node.tag !== dnode2.node.tag) {
            return false;
        }
        if (dnode1.node.properties.key !== dnode2.node.properties.key) {
            return false;
        }
        return true;
    }
    else if (isWNodeWrapper(dnode1) && isWNodeWrapper(dnode2)) {
        var widgetConstructor1 = dnode1.registryItem || dnode1.node.widgetConstructor;
        var widgetConstructor2 = dnode2.registryItem || dnode2.node.widgetConstructor;
        var props1_1 = dnode1.node.properties;
        var props2_1 = dnode2.node.properties;
        if (dnode1.instance === undefined && typeof widgetConstructor2 === 'string') {
            return false;
        }
        if (widgetConstructor1 !== widgetConstructor2) {
            return false;
        }
        if (props1_1.key !== props2_1.key) {
            return false;
        }
        if (!(widgetConstructor1.keys || []).every(function (key) { return props1_1[key] === props2_1[key]; })) {
            return false;
        }
        return true;
    }
    return false;
}
function findIndexOfChild(children, sameAs, start) {
    for (var i = start; i < children.length; i++) {
        if (same(children[i], sameAs)) {
            return i;
        }
    }
    return -1;
}
function createClassPropValue(classes) {
    if (classes === void 0) { classes = []; }
    var classNames = '';
    if (Array.isArray(classes)) {
        for (var i = 0; i < classes.length; i++) {
            var className = classes[i];
            if (className && className !== true) {
                classNames = classNames ? classNames + " " + className : className;
            }
        }
        return classNames;
    }
    if (classes && classes !== true) {
        classNames = classes;
    }
    return classNames;
}
function updateAttribute(domNode, attrName, attrValue, namespace) {
    if (namespace === NAMESPACE_SVG && attrName === 'href' && attrValue) {
        domNode.setAttributeNS(NAMESPACE_XLINK, attrName, attrValue);
    }
    else if ((attrName === 'role' && attrValue === '') || attrValue === undefined) {
        domNode.removeAttribute(attrName);
    }
    else {
        domNode.setAttribute(attrName, attrValue);
    }
}
function arrayFrom(arr) {
    return Array.prototype.slice.call(arr);
}
function createFactory(callback, middlewares, key) {
    var factory = function (properties, children) {
        if (properties) {
            var result = w(callback, properties, children);
            callback.isWidget = true;
            callback.middlewares = middlewares;
            return result;
        }
        return {
            middlewares: middlewares,
            callback: callback
        };
    };
    var keys = Object.keys(middlewares).reduce(function (keys, middlewareName) {
        var middleware = middlewares[middlewareName];
        if (middleware.keys) {
            keys = tslib_1.__spread(keys, middleware.keys);
        }
        return keys;
    }, key ? [key] : []);
    callback.keys = keys;
    factory.keys = keys;
    factory.isFactory = true;
    return factory;
}
function create(middlewares) {
    if (middlewares === void 0) { middlewares = {}; }
    function properties() {
        function returns(callback) {
            return createFactory(callback, middlewares);
        }
        function key(key) {
            function returns(callback) {
                return createFactory(callback, middlewares, key);
            }
            return returns;
        }
        function children() {
            function returns(callback) {
                return createFactory(callback, middlewares);
            }
            function key(key) {
                function returns(callback) {
                    return createFactory(callback, middlewares, key);
                }
                return returns;
            }
            returns.key = key;
            return returns;
        }
        returns.children = children;
        returns.key = key;
        return returns;
    }
    function children() {
        function properties() {
            function returns(callback) {
                return createFactory(callback, middlewares);
            }
            function key(key) {
                function returns(callback) {
                    return createFactory(callback, middlewares, key);
                }
                return returns;
            }
            returns.key = key;
            return returns;
        }
        function returns(callback) {
            return createFactory(callback, middlewares);
        }
        returns.properties = properties;
        return returns;
    }
    function returns(callback) {
        return createFactory(callback, middlewares);
    }
    returns.children = children;
    returns.properties = properties;
    return returns;
}
exports.create = create;
var factory = create();
function wrapNodes(renderer) {
    var result = renderer();
    var isWNodeWrapper = isWNode(result);
    var callback = function () {
        return result;
    };
    callback.isWNodeWrapper = isWNodeWrapper;
    return factory(callback);
}
exports.widgetInstanceMap = new WeakMap_1.default();
var widgetMetaMap = new Map_1.default();
var requestedDomNodes = new Set_1.default();
var wrapperId = 0;
var metaId = 0;
function addNodeToMap(id, key, node) {
    var widgetMeta = widgetMetaMap.get(id);
    if (widgetMeta) {
        widgetMeta.nodeMap = widgetMeta.nodeMap || new Map_1.default();
        widgetMeta.nodeMap.set(key, node);
        if (requestedDomNodes.has(id + "-" + key)) {
            widgetMeta.invalidator();
            requestedDomNodes.delete(id + "-" + key);
        }
    }
}
function destroyHandles(meta) {
    var destroyMap = meta.destroyMap, middlewareIds = meta.middlewareIds;
    if (!destroyMap) {
        return;
    }
    for (var i = 0; i < middlewareIds.length; i++) {
        var id = middlewareIds[i];
        var destroy_1 = destroyMap.get(id);
        destroy_1 && destroy_1();
        destroyMap.delete(id);
        if (destroyMap.size === 0) {
            break;
        }
    }
    destroyMap.clear();
}
function runDiffs(meta, current, next) {
    var customProperties = {};
    meta.customDiffMap = meta.customDiffMap || new Map_1.default();
    if (meta.customDiffMap.size) {
        meta.customDiffMap.forEach(function (diffMap) {
            diffMap.forEach(function (diff, propertyName) {
                var result = diff(tslib_1.__assign({}, current), tslib_1.__assign({}, next));
                if (result) {
                    customProperties[propertyName] = result;
                }
            });
        });
    }
    return customProperties;
}
exports.invalidator = factory(function (_a) {
    var id = _a.id;
    var _b = tslib_1.__read(id.split('-'), 1), widgetId = _b[0];
    return function () {
        var widgetMeta = widgetMetaMap.get(widgetId);
        if (widgetMeta) {
            return widgetMeta.invalidator();
        }
    };
});
exports.node = factory(function (_a) {
    var id = _a.id;
    return {
        get: function (key) {
            var _a = tslib_1.__read(id.split('-'), 1), widgetId = _a[0];
            var widgetMeta = widgetMetaMap.get(widgetId);
            if (widgetMeta) {
                widgetMeta.nodeMap = widgetMeta.nodeMap || new Map_1.default();
                var mountNode = widgetMeta.mountNode;
                var node_1 = widgetMeta.nodeMap.get(key);
                if (node_1 &&
                    (mountNode.contains(node_1) ||
                        (global_1.default.document.body !== mountNode && global_1.default.document.body.contains(node_1)))) {
                    return node_1;
                }
                requestedDomNodes.add(widgetId + "-" + key);
            }
            return null;
        }
    };
});
exports.diffProperty = factory(function (_a) {
    var id = _a.id;
    function callback(propertyName, propertiesOrDiff, diff) {
        var _a;
        var _b = tslib_1.__read(id.split('-'), 1), widgetId = _b[0];
        var widgetMeta = widgetMetaMap.get(widgetId);
        if (!diff) {
            diff = propertiesOrDiff;
        }
        if (widgetMeta) {
            widgetMeta.customDiffMap = widgetMeta.customDiffMap || new Map_1.default();
            widgetMeta.customDiffProperties = widgetMeta.customDiffProperties || new Set_1.default();
            var propertyDiffMap = widgetMeta.customDiffMap.get(id) || new Map_1.default();
            if (!propertyDiffMap.has(propertyName)) {
                var result = diff({}, widgetMeta.originalProperties);
                if (result !== undefined) {
                    if (true) {
                        if (widgetMeta.propertiesCalled) {
                            console.warn("Calling \"propertyDiff\" middleware after accessing properties in \"" + widgetMeta.widgetName + "\", can result in referencing stale properties.");
                        }
                    }
                    widgetMeta.properties = tslib_1.__assign({}, widgetMeta.properties, (_a = {}, _a[propertyName] = result, _a));
                }
                propertyDiffMap.set(propertyName, diff);
                widgetMeta.customDiffProperties.add(propertyName);
            }
            widgetMeta.customDiffMap.set(id, propertyDiffMap);
        }
    }
    return callback;
});
exports.destroy = factory(function (_a) {
    var id = _a.id;
    return function (destroyFunction) {
        var _a = tslib_1.__read(id.split('-'), 1), widgetId = _a[0];
        var widgetMeta = widgetMetaMap.get(widgetId);
        if (widgetMeta) {
            widgetMeta.destroyMap = widgetMeta.destroyMap || new Map_1.default();
            if (!widgetMeta.destroyMap.has(id)) {
                widgetMeta.destroyMap.set(id, destroyFunction);
            }
        }
    };
});
exports.getRegistry = factory(function (_a) {
    var id = _a.id;
    var _b = tslib_1.__read(id.split('-'), 1), widgetId = _b[0];
    return function () {
        var widgetMeta = widgetMetaMap.get(widgetId);
        if (widgetMeta) {
            if (!widgetMeta.registryHandler) {
                widgetMeta.registryHandler = new RegistryHandler_1.default();
                widgetMeta.registryHandler.base = widgetMeta.registry;
                widgetMeta.registryHandler.on('invalidate', widgetMeta.invalidator);
            }
            widgetMeta.registryHandler = widgetMeta.registryHandler || new RegistryHandler_1.default();
            return widgetMeta.registryHandler;
        }
        return null;
    };
});
exports.defer = factory(function (_a) {
    var id = _a.id;
    var _b = tslib_1.__read(id.split('-'), 1), widgetId = _b[0];
    var isDeferred = false;
    return {
        pause: function () {
            var widgetMeta = widgetMetaMap.get(widgetId);
            if (!isDeferred && widgetMeta) {
                widgetMeta.deferRefs = widgetMeta.deferRefs + 1;
                isDeferred = true;
            }
        },
        resume: function () {
            var widgetMeta = widgetMetaMap.get(widgetId);
            if (isDeferred && widgetMeta) {
                widgetMeta.deferRefs = widgetMeta.deferRefs - 1;
                isDeferred = false;
            }
        }
    };
});
function wrapFunctionProperties(id, properties) {
    var props = {};
    var propertyNames = Object.keys(properties);
    var _loop_1 = function (i) {
        var propertyName = propertyNames[i];
        if (typeof properties[propertyName] === 'function') {
            props[propertyName] = function WrappedProperty() {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var widgetMeta = widgetMetaMap.get(id);
                if (widgetMeta) {
                    return (_a = widgetMeta.originalProperties)[propertyName].apply(_a, tslib_1.__spread(args));
                }
                return properties[propertyName].apply(properties, tslib_1.__spread(args));
            };
            props[propertyName].unwrap = function () {
                var widgetMeta = widgetMetaMap.get(id);
                if (widgetMeta) {
                    return widgetMeta.originalProperties[propertyName];
                }
                return properties[propertyName];
            };
        }
        else {
            props[propertyName] = properties[propertyName];
        }
    };
    for (var i = 0; i < propertyNames.length; i++) {
        _loop_1(i);
    }
    return props;
}
function renderer(renderer) {
    var _mountOptions = {
        sync: false,
        merge: true,
        transition: undefined,
        domNode: global_1.default.document.body,
        registry: new Registry_1.Registry()
    };
    var _invalidationQueue = [];
    var _processQueue = [];
    var _deferredProcessQueue = [];
    var _applicationQueue = [];
    var _eventMap = new WeakMap_1.default();
    var _idToWrapperMap = new Map_1.default();
    var _wrapperSiblingMap = new WeakMap_1.default();
    var _idToChildrenWrappers = new Map_1.default();
    var _insertBeforeMap = new WeakMap_1.default();
    var _nodeToWrapperMap = new WeakMap_1.default();
    var _renderScheduled;
    var _deferredRenderCallbacks = [];
    var parentInvalidate;
    var _allMergedNodes = [];
    var _appWrapperId;
    var _deferredProcessIds = new Map_1.default();
    function nodeOperation(propName, propValue, previousValue, domNode) {
        var result = propValue && !previousValue;
        if (typeof propValue === 'function') {
            result = propValue();
        }
        if (result === true) {
            _deferredRenderCallbacks.push(function () {
                domNode[propName]();
            });
        }
    }
    function updateEvent(domNode, eventName, currentValue, previousValue) {
        if (previousValue) {
            var previousEvent = _eventMap.get(previousValue);
            previousEvent && domNode.removeEventListener(eventName, previousEvent);
        }
        var callback = currentValue;
        if (eventName === 'input') {
            callback = function (evt) {
                currentValue.call(this, evt);
                evt.target['oninput-value'] = evt.target.value;
            };
        }
        domNode.addEventListener(eventName, callback);
        _eventMap.set(currentValue, callback);
    }
    function removeOrphanedEvents(domNode, previousProperties, properties, onlyEvents) {
        if (onlyEvents === void 0) { onlyEvents = false; }
        Object.keys(previousProperties).forEach(function (propName) {
            var isEvent = propName.substr(0, 2) === 'on' || onlyEvents;
            var eventName = onlyEvents ? propName : propName.substr(2);
            if (isEvent && !properties[propName]) {
                var eventCallback = _eventMap.get(previousProperties[propName]);
                if (eventCallback) {
                    domNode.removeEventListener(eventName, eventCallback);
                }
            }
        });
    }
    function resolveRegistryItem(wrapper, instance, id) {
        if (!Registry_1.isWidget(wrapper.node.widgetConstructor)) {
            var owningNode = _nodeToWrapperMap.get(wrapper.node);
            if (owningNode) {
                if (owningNode.instance) {
                    instance = owningNode.instance;
                }
                else {
                    id = owningNode.id;
                }
            }
            var registry = void 0;
            if (instance) {
                var instanceData = exports.widgetInstanceMap.get(instance);
                if (instanceData) {
                    registry = instanceData.registry;
                }
            }
            else if (id !== undefined) {
                var widgetMeta = widgetMetaMap.get(id);
                if (widgetMeta) {
                    if (!widgetMeta.registryHandler) {
                        widgetMeta.registryHandler = new RegistryHandler_1.default();
                        widgetMeta.registryHandler.base = widgetMeta.registry;
                        widgetMeta.registryHandler.on('invalidate', widgetMeta.invalidator);
                    }
                    registry = widgetMeta.registryHandler;
                }
            }
            if (registry) {
                var registryLabel = void 0;
                if (isLazyDefine(wrapper.node.widgetConstructor)) {
                    var _a = wrapper.node.widgetConstructor, label = _a.label, registryItem = _a.registryItem;
                    if (!registry.has(label)) {
                        registry.define(label, registryItem);
                    }
                    registryLabel = label;
                }
                else {
                    registryLabel = wrapper.node.widgetConstructor;
                }
                var item = registry.get(registryLabel);
                if (Registry_1.isWNodeFactory(item)) {
                    var node_2 = item(wrapper.node.properties, wrapper.node.children);
                    if (Registry_1.isWidgetFunction(node_2.widgetConstructor)) {
                        wrapper.registryItem = node_2.widgetConstructor;
                    }
                }
                else {
                    wrapper.registryItem = item;
                }
            }
        }
    }
    function mapNodeToInstance(nodes, wrapper) {
        while (nodes.length) {
            var node_3 = nodes.pop();
            if (isWNode(node_3) || isVNode(node_3)) {
                if (!_nodeToWrapperMap.has(node_3)) {
                    _nodeToWrapperMap.set(node_3, wrapper);
                    if (node_3.children && node_3.children.length) {
                        nodes = tslib_1.__spread(nodes, node_3.children);
                    }
                }
            }
        }
    }
    function renderedToWrapper(rendered, parent, currentParent) {
        var requiresInsertBefore = parent.requiresInsertBefore, hasPreviousSiblings = parent.hasPreviousSiblings, namespace = parent.namespace, depth = parent.depth;
        var wrappedRendered = [];
        var hasParentWNode = isWNodeWrapper(parent);
        var hasVirtualParentNode = isVirtualWrapper(parent);
        var currentParentChildren = (isVNodeWrapper(currentParent) && _idToChildrenWrappers.get(currentParent.id)) || [];
        var hasCurrentParentChildren = currentParentChildren.length > 0;
        var insertBefore = ((requiresInsertBefore || hasPreviousSiblings !== false) && (hasParentWNode || hasVirtualParentNode)) ||
            (hasCurrentParentChildren && rendered.length > 1);
        var previousItem;
        if (isWNodeWrapper(parent) && rendered.length) {
            mapNodeToInstance(tslib_1.__spread(rendered), parent);
        }
        for (var i = 0; i < rendered.length; i++) {
            var renderedItem = rendered[i];
            if (!renderedItem || renderedItem === true) {
                continue;
            }
            if (typeof renderedItem === 'string') {
                renderedItem = toTextVNode(renderedItem);
            }
            var owningNode = _nodeToWrapperMap.get(renderedItem);
            var wrapper = {
                node: renderedItem,
                depth: depth + 1,
                order: i,
                parentId: parent.id,
                requiresInsertBefore: insertBefore,
                hasParentWNode: hasParentWNode,
                namespace: namespace
            };
            if (isVNode(renderedItem)) {
                if (renderedItem.deferredPropertiesCallback) {
                    wrapper.deferredProperties = renderedItem.deferredPropertiesCallback(false);
                }
                if (renderedItem.properties.exitAnimation) {
                    parent.hasAnimations = true;
                    var nextParent = _idToWrapperMap.get(parent.parentId);
                    while (nextParent) {
                        if (nextParent.hasAnimations) {
                            break;
                        }
                        nextParent.hasAnimations = true;
                        nextParent = _idToWrapperMap.get(nextParent.parentId);
                    }
                }
            }
            if (owningNode) {
                wrapper.owningId = owningNode.id;
            }
            if (isWNode(renderedItem)) {
                resolveRegistryItem(wrapper, parent.instance, parent.id);
            }
            if (previousItem) {
                _wrapperSiblingMap.set(previousItem, wrapper);
            }
            wrappedRendered.push(wrapper);
            previousItem = wrapper;
        }
        return wrappedRendered;
    }
    function findParentDomNode(currentNode) {
        var parentDomNode;
        var parentWrapper = _idToWrapperMap.get(currentNode.parentId);
        while (!parentDomNode && parentWrapper) {
            if (!parentDomNode &&
                isVNodeWrapper(parentWrapper) &&
                !isVirtualWrapper(parentWrapper) &&
                parentWrapper.domNode) {
                parentDomNode = parentWrapper.domNode;
            }
            parentWrapper = _idToWrapperMap.get(parentWrapper.parentId);
        }
        return parentDomNode;
    }
    function runDeferredProperties(next) {
        var deferredPropertiesCallback = next.node.deferredPropertiesCallback;
        if (deferredPropertiesCallback) {
            var properties_1 = next.node.properties;
            _deferredRenderCallbacks.push(function () {
                if (_idToWrapperMap.has(next.owningId)) {
                    var deferredProperties = next.deferredProperties;
                    next.deferredProperties = deferredPropertiesCallback(true);
                    processProperties(next, {
                        properties: tslib_1.__assign({}, deferredProperties, properties_1)
                    });
                }
            });
        }
    }
    function findInsertBefore(next) {
        var insertBefore = null;
        var searchNode = next;
        while (!insertBefore) {
            var nextSibling = _wrapperSiblingMap.get(searchNode);
            if (nextSibling) {
                var domNode = nextSibling.domNode;
                if (isWNodeWrapper(nextSibling) || isVirtualWrapper(nextSibling)) {
                    if (!nextSibling.childDomWrapperId) {
                        nextSibling.childDomWrapperId = findDomNodeOnParentWrapper(nextSibling.id);
                    }
                    if (nextSibling.childDomWrapperId) {
                        var childWrapper = _idToWrapperMap.get(nextSibling.childDomWrapperId);
                        if (childWrapper && !isBodyWrapper(childWrapper)) {
                            domNode = childWrapper.domNode;
                        }
                    }
                }
                if (domNode && domNode.parentNode) {
                    insertBefore = domNode;
                    break;
                }
                searchNode = nextSibling;
                continue;
            }
            searchNode = searchNode && _idToWrapperMap.get(searchNode.parentId);
            if (!searchNode || (isVNodeWrapper(searchNode) && !isVirtualWrapper(searchNode))) {
                break;
            }
        }
        return insertBefore;
    }
    function setValue(domNode, propValue, previousValue) {
        var domValue = domNode.value;
        var onInputValue = domNode['oninput-value'];
        var onSelectValue = domNode['select-value'];
        if (onSelectValue && domValue !== onSelectValue) {
            domNode.value = onSelectValue;
            if (domNode.value === onSelectValue) {
                domNode['select-value'] = undefined;
            }
        }
        else if ((onInputValue && domValue === onInputValue) || propValue !== previousValue) {
            domNode.value = propValue;
            domNode['oninput-value'] = undefined;
        }
    }
    function setProperties(domNode, currentProperties, nextWrapper, includesEventsAndAttributes) {
        if (currentProperties === void 0) { currentProperties = {}; }
        if (includesEventsAndAttributes === void 0) { includesEventsAndAttributes = true; }
        var properties = nextWrapper.deferredProperties
            ? tslib_1.__assign({}, nextWrapper.deferredProperties, nextWrapper.node.properties) : nextWrapper.node.properties;
        var propNames = Object.keys(properties);
        var propCount = propNames.length;
        if (propNames.indexOf('classes') === -1 && currentProperties.classes) {
            domNode.removeAttribute('class');
        }
        includesEventsAndAttributes && removeOrphanedEvents(domNode, currentProperties, properties);
        for (var i = 0; i < propCount; i++) {
            var propName = propNames[i];
            var propValue = properties[propName];
            var previousValue = currentProperties[propName];
            if (propName === 'classes') {
                var previousClassString = createClassPropValue(previousValue);
                var currentClassString = createClassPropValue(propValue);
                if (previousClassString !== currentClassString) {
                    if (currentClassString) {
                        if (nextWrapper.merged) {
                            var domClasses = (domNode.getAttribute('class') || '').split(' ');
                            for (var i_1 = 0; i_1 < domClasses.length; i_1++) {
                                if (currentClassString.indexOf(domClasses[i_1]) === -1) {
                                    currentClassString = domClasses[i_1] + " " + currentClassString;
                                }
                            }
                        }
                        domNode.setAttribute('class', currentClassString);
                    }
                    else {
                        domNode.removeAttribute('class');
                    }
                }
            }
            else if (nodeOperations.indexOf(propName) !== -1) {
                nodeOperation(propName, propValue, previousValue, domNode);
            }
            else if (propName === 'styles') {
                var styleNames = Object.keys(propValue);
                var styleCount = styleNames.length;
                for (var j = 0; j < styleCount; j++) {
                    var styleName = styleNames[j];
                    var newStyleValue = propValue[styleName];
                    var oldStyleValue = previousValue && previousValue[styleName];
                    if (newStyleValue === oldStyleValue) {
                        continue;
                    }
                    domNode.style[styleName] = newStyleValue || '';
                }
            }
            else {
                if (!propValue && typeof previousValue === 'string') {
                    propValue = '';
                }
                if (propName === 'value') {
                    if (domNode.tagName === 'SELECT') {
                        domNode['select-value'] = propValue;
                    }
                    setValue(domNode, propValue, previousValue);
                }
                else if (propName !== 'key' && propValue !== previousValue) {
                    var type = typeof propValue;
                    if (type === 'function' && propName.lastIndexOf('on', 0) === 0 && includesEventsAndAttributes) {
                        updateEvent(domNode, propName.substr(2), propValue, previousValue);
                    }
                    else if (type === 'string' && propName !== 'innerHTML' && includesEventsAndAttributes) {
                        updateAttribute(domNode, propName, propValue, nextWrapper.namespace);
                    }
                    else if (propName === 'scrollLeft' || propName === 'scrollTop') {
                        if (domNode[propName] !== propValue) {
                            domNode[propName] = propValue;
                        }
                    }
                    else {
                        domNode[propName] = propValue;
                    }
                }
            }
        }
    }
    function _createDeferredRenderCallback() {
        var callbacks = _deferredRenderCallbacks;
        _deferredRenderCallbacks = [];
        if (callbacks.length) {
            return function () {
                var callback;
                while ((callback = callbacks.shift())) {
                    callback();
                }
            };
        }
    }
    function _scheduleDeferredRenderCallbacks() {
        var sync = _mountOptions.sync;
        var run = _createDeferredRenderCallback();
        if (run) {
            if (sync) {
                run();
            }
            else {
                var id_1;
                id_1 = global_1.default.requestAnimationFrame(function () {
                    _deferredProcessIds.delete(id_1);
                    run();
                });
                _deferredProcessIds.set(id_1, run);
            }
        }
    }
    function processProperties(next, previousProperties) {
        if (next.node.attributes && next.node.events) {
            updateAttributes(next.domNode, previousProperties.attributes || {}, next.node.attributes, next.namespace);
            setProperties(next.domNode, previousProperties.properties, next, false);
            var events_1 = next.node.events || {};
            if (previousProperties.events) {
                removeOrphanedEvents(next.domNode, previousProperties.events || {}, next.node.events, true);
            }
            previousProperties.events = previousProperties.events || {};
            Object.keys(events_1).forEach(function (event) {
                updateEvent(next.domNode, event, events_1[event], previousProperties.events[event]);
            });
        }
        else {
            setProperties(next.domNode, previousProperties.properties, next);
        }
    }
    function unmount() {
        _processQueue.push({
            current: [_idToWrapperMap.get(_appWrapperId)],
            next: [],
            meta: {}
        });
        if (_renderScheduled) {
            global_1.default.cancelAnimationFrame(_renderScheduled);
        }
        _runProcessQueue();
        _runDomInstructionQueue();
        _deferredProcessIds.forEach(function (callback, id) {
            global_1.default.cancelAnimationFrame(id);
            callback();
        });
        var run = _createDeferredRenderCallback();
        run && run();
        _invalidationQueue = [];
        _processQueue = [];
        _deferredProcessQueue = [];
        _applicationQueue = [];
        _deferredRenderCallbacks = [];
        _allMergedNodes = [];
        _eventMap = new WeakMap_1.default();
        _idToWrapperMap.clear();
        _idToChildrenWrappers.clear();
        _wrapperSiblingMap = new WeakMap_1.default();
        _nodeToWrapperMap = new WeakMap_1.default();
        _insertBeforeMap = undefined;
    }
    function mount(mountOptions) {
        if (mountOptions === void 0) { mountOptions = {}; }
        var domNode = mountOptions.domNode;
        if (!domNode) {
            if ( true && domNode === null) {
                console.warn('Unable to find node to mount the application, defaulting to the document body.');
            }
            domNode = global_1.default.document.body;
        }
        _mountOptions = tslib_1.__assign({}, _mountOptions, mountOptions, { domNode: domNode });
        var renderResult = wrapNodes(renderer)({}, []);
        _appWrapperId = "" + wrapperId++;
        var nextWrapper = {
            id: _appWrapperId,
            node: renderResult,
            order: 0,
            depth: 1,
            owningId: '-1',
            parentId: '-1',
            siblingId: '-1',
            properties: {}
        };
        _idToWrapperMap.set('-1', {
            id: "-1",
            depth: 0,
            order: 0,
            owningId: '',
            domNode: domNode,
            node: v('fake'),
            parentId: '-1'
        });
        _processQueue.push({
            current: [],
            next: [nextWrapper],
            meta: { mergeNodes: arrayFrom(domNode.childNodes) }
        });
        _runProcessQueue();
        _runDomInstructionQueue();
        _cleanUpMergedNodes();
        _insertBeforeMap = undefined;
        _scheduleDeferredRenderCallbacks();
        if (!_renderScheduled) {
            setRendering(false);
        }
    }
    function invalidate() {
        parentInvalidate && parentInvalidate();
    }
    function _schedule() {
        var sync = _mountOptions.sync;
        if (sync) {
            _runInvalidationQueue();
        }
        else if (!_renderScheduled) {
            setRendering(true);
            _renderScheduled = global_1.default.requestAnimationFrame(function () {
                _runInvalidationQueue();
            });
        }
    }
    function getWNodeWrapper(id) {
        var wrapper = _idToWrapperMap.get(id);
        if (wrapper && isWNodeWrapper(wrapper)) {
            return wrapper;
        }
    }
    function _runInvalidationQueue() {
        _renderScheduled = undefined;
        var invalidationQueue = tslib_1.__spread(_invalidationQueue);
        var previouslyRendered = [];
        _invalidationQueue = [];
        invalidationQueue.sort(function (a, b) {
            var result = b.depth - a.depth;
            if (result === 0) {
                result = b.order - a.order;
            }
            return result;
        });
        if (_deferredProcessQueue.length) {
            _processQueue = tslib_1.__spread(_deferredProcessQueue);
            _deferredProcessQueue = [];
            _runProcessQueue();
            if (_deferredProcessQueue.length) {
                _invalidationQueue = tslib_1.__spread(invalidationQueue);
                invalidationQueue = [];
            }
        }
        var item;
        while ((item = invalidationQueue.pop())) {
            var id = item.id;
            var current = getWNodeWrapper(id);
            if (!current || previouslyRendered.indexOf(id) !== -1 || !_idToWrapperMap.has(current.parentId)) {
                continue;
            }
            previouslyRendered.push(id);
            var sibling = _wrapperSiblingMap.get(current);
            var next = {
                node: {
                    type: WNODE,
                    widgetConstructor: current.node.widgetConstructor,
                    properties: current.properties || {},
                    children: current.node.children || []
                },
                instance: current.instance,
                id: current.id,
                properties: current.properties,
                depth: current.depth,
                order: current.order,
                owningId: current.owningId,
                parentId: current.parentId,
                registryItem: current.registryItem
            };
            sibling && _wrapperSiblingMap.set(next, sibling);
            var result = _updateWidget({ current: current, next: next });
            if (result && result.item) {
                _processQueue.push(result.item);
                _idToWrapperMap.set(id, next);
                _runProcessQueue();
            }
        }
        _runDomInstructionQueue();
        _cleanUpMergedNodes();
        _scheduleDeferredRenderCallbacks();
        if (!_renderScheduled) {
            setRendering(false);
        }
    }
    function _cleanUpMergedNodes() {
        if (_deferredProcessQueue.length === 0) {
            var mergedNode = void 0;
            while ((mergedNode = _allMergedNodes.pop())) {
                mergedNode.parentNode && mergedNode.parentNode.removeChild(mergedNode);
            }
            _mountOptions.merge = false;
        }
    }
    function _runProcessQueue() {
        var item;
        while ((item = _processQueue.pop())) {
            if (isAttachApplication(item)) {
                item.instance && _applicationQueue.push(item);
            }
            else {
                var current = item.current, next = item.next, meta = item.meta;
                _process(current || EMPTY_ARRAY, next || EMPTY_ARRAY, meta);
            }
        }
    }
    function _runDomInstructionQueue() {
        _applicationQueue.reverse();
        var item;
        while ((item = _applicationQueue.pop())) {
            if (item.type === 'create') {
                var parentDomNode = item.parentDomNode, next = item.next, _a = item.next, domNode = _a.domNode, merged = _a.merged, requiresInsertBefore = _a.requiresInsertBefore, node_4 = _a.node;
                processProperties(next, { properties: {} });
                runDeferredProperties(next);
                if (!merged) {
                    var insertBefore = void 0;
                    if (requiresInsertBefore) {
                        insertBefore = findInsertBefore(next);
                    }
                    else if (_insertBeforeMap) {
                        insertBefore = _insertBeforeMap.get(next);
                    }
                    parentDomNode.insertBefore(domNode, insertBefore);
                    if (isDomVNode(next.node) && next.node.onAttach) {
                        next.node.onAttach();
                    }
                }
                if (domNode.tagName === 'OPTION' && domNode.parentElement) {
                    setValue(domNode.parentElement);
                }
                var _b = node_4.properties, enterAnimation = _b.enterAnimation, enterAnimationActive = _b.enterAnimationActive;
                if (_mountOptions.transition && enterAnimation && enterAnimation !== true) {
                    _mountOptions.transition.enter(domNode, enterAnimation, enterAnimationActive);
                }
                var owningWrapper = _nodeToWrapperMap.get(next.node);
                if (owningWrapper && node_4.properties.key != null) {
                    if (owningWrapper.instance) {
                        var instanceData = exports.widgetInstanceMap.get(owningWrapper.instance);
                        instanceData && instanceData.nodeHandler.add(domNode, "" + node_4.properties.key);
                    }
                    else {
                        addNodeToMap(owningWrapper.id, node_4.properties.key, domNode);
                    }
                }
                item.next.inserted = true;
            }
            else if (item.type === 'update') {
                var next = item.next, domNode = item.next.domNode, current = item.current, currentDomNode = item.current.domNode;
                if (isTextNode(domNode) && isTextNode(currentDomNode) && domNode !== currentDomNode) {
                    currentDomNode.parentNode && currentDomNode.parentNode.replaceChild(domNode, currentDomNode);
                }
                else {
                    var previousProperties = buildPreviousProperties(domNode, current);
                    processProperties(next, previousProperties);
                    runDeferredProperties(next);
                }
            }
            else if (item.type === 'delete') {
                var current = item.current;
                var _c = current.node.properties, exitAnimation = _c.exitAnimation, exitAnimationActive = _c.exitAnimationActive;
                if (_mountOptions.transition && exitAnimation && exitAnimation !== true) {
                    _mountOptions.transition.exit(current.domNode, exitAnimation, exitAnimationActive);
                }
                else {
                    current.domNode.parentNode.removeChild(current.domNode);
                }
            }
            else if (item.type === 'attach') {
                var instance = item.instance, attached = item.attached;
                var instanceData = exports.widgetInstanceMap.get(instance);
                if (instanceData) {
                    instanceData.nodeHandler.addRoot();
                    attached && instanceData.onAttach();
                }
            }
            else if (item.type === 'detach') {
                if (item.current.instance) {
                    var instanceData = exports.widgetInstanceMap.get(item.current.instance);
                    instanceData && instanceData.onDetach();
                }
                item.current.instance = undefined;
            }
        }
        if (_deferredProcessQueue.length === 0) {
            _nodeToWrapperMap = new WeakMap_1.default();
        }
    }
    function _processMergeNodes(next, mergeNodes) {
        var merge = _mountOptions.merge;
        if (merge && mergeNodes.length) {
            if (isVNodeWrapper(next)) {
                var tag = next.node.tag;
                for (var i = 0; i < mergeNodes.length; i++) {
                    var domElement = mergeNodes[i];
                    var tagName = domElement.tagName || '';
                    if (tag.toUpperCase() === tagName.toUpperCase()) {
                        var mergeNodeIndex = _allMergedNodes.indexOf(domElement);
                        if (mergeNodeIndex !== -1) {
                            _allMergedNodes.splice(mergeNodeIndex, 1);
                        }
                        mergeNodes.splice(i, 1);
                        next.domNode = domElement;
                        break;
                    }
                }
            }
            else {
                next.mergeNodes = mergeNodes;
            }
        }
    }
    function distinguishableCheck(childNodes, index) {
        var parentWNodeWrapper = getWNodeWrapper(childNodes[index].owningId);
        checkDistinguishable(childNodes, index, parentWNodeWrapper);
    }
    function createKeyMap(wrappers) {
        var keys = [];
        for (var i = 0; i < wrappers.length; i++) {
            var wrapper = wrappers[i];
            if (wrapper.node.properties.key != null) {
                keys.push(wrapper.node.properties.key);
            }
            else {
                return false;
            }
        }
        return keys;
    }
    function _process(current, next, meta) {
        if (meta === void 0) { meta = {}; }
        var _a = meta.mergeNodes, mergeNodes = _a === void 0 ? [] : _a, _b = meta.oldIndex, oldIndex = _b === void 0 ? 0 : _b, _c = meta.newIndex, newIndex = _c === void 0 ? 0 : _c;
        var currentLength = current.length;
        var nextLength = next.length;
        var hasPreviousSiblings = currentLength > 1 || (currentLength > 0 && currentLength < nextLength);
        var instructions = [];
        var replace = false;
        if (oldIndex === 0 && newIndex === 0 && currentLength) {
            var currentKeys = createKeyMap(current);
            if (currentKeys) {
                var nextKeys = createKeyMap(next);
                if (nextKeys) {
                    for (var i = 0; i < currentKeys.length; i++) {
                        if (nextKeys.indexOf(currentKeys[i]) !== -1) {
                            instructions = [];
                            replace = false;
                            break;
                        }
                        replace = true;
                        instructions.push({ current: current[i], next: undefined });
                    }
                }
            }
        }
        if (replace || (currentLength === 0 && !_mountOptions.merge)) {
            for (var i = 0; i < next.length; i++) {
                instructions.push({ current: undefined, next: next[i] });
            }
        }
        else {
            if (newIndex < nextLength) {
                var currentWrapper = oldIndex < currentLength ? current[oldIndex] : undefined;
                var nextWrapper = next[newIndex];
                nextWrapper.hasPreviousSiblings = hasPreviousSiblings;
                _processMergeNodes(nextWrapper, mergeNodes);
                if (currentWrapper && same(currentWrapper, nextWrapper)) {
                    oldIndex++;
                    newIndex++;
                    if (isVNodeWrapper(currentWrapper) && isVNodeWrapper(nextWrapper)) {
                        nextWrapper.inserted = currentWrapper.inserted;
                    }
                    instructions.push({ current: currentWrapper, next: nextWrapper });
                }
                else if (!currentWrapper || findIndexOfChild(current, nextWrapper, oldIndex + 1) === -1) {
                     true && current.length && distinguishableCheck(next, newIndex);
                    instructions.push({ current: undefined, next: nextWrapper });
                    newIndex++;
                }
                else if (findIndexOfChild(next, currentWrapper, newIndex + 1) === -1) {
                     true && distinguishableCheck(current, oldIndex);
                    instructions.push({ current: currentWrapper, next: undefined });
                    oldIndex++;
                }
                else {
                     true && distinguishableCheck(next, newIndex);
                     true && distinguishableCheck(current, oldIndex);
                    instructions.push({ current: currentWrapper, next: undefined });
                    instructions.push({ current: undefined, next: nextWrapper });
                    oldIndex++;
                    newIndex++;
                }
            }
            if (newIndex < nextLength) {
                _processQueue.push({ current: current, next: next, meta: { mergeNodes: mergeNodes, oldIndex: oldIndex, newIndex: newIndex } });
            }
            if (currentLength > oldIndex && newIndex >= nextLength) {
                for (var i = oldIndex; i < currentLength; i++) {
                     true && distinguishableCheck(current, i);
                    instructions.push({ current: current[i], next: undefined });
                }
            }
        }
        for (var i = 0; i < instructions.length; i++) {
            var result = _processOne(instructions[i]);
            if (result === false) {
                if (_mountOptions.merge && mergeNodes.length) {
                    if (newIndex < nextLength) {
                        _processQueue.pop();
                    }
                    _processQueue.push({ next: next, current: current, meta: meta });
                    _deferredProcessQueue = _processQueue;
                    _processQueue = [];
                    break;
                }
                continue;
            }
            var widget = result.widget, item = result.item, dom_1 = result.dom;
            widget && _processQueue.push(widget);
            item && _processQueue.push(item);
            dom_1 && _applicationQueue.push(dom_1);
        }
    }
    function _processOne(_a) {
        var current = _a.current, next = _a.next;
        if (current !== next) {
            if (!current && next) {
                if (isVNodeWrapper(next)) {
                    return _createDom({ next: next });
                }
                else {
                    return _createWidget({ next: next });
                }
            }
            else if (current && next) {
                if (isVNodeWrapper(current) && isVNodeWrapper(next)) {
                    return _updateDom({ current: current, next: next });
                }
                else if (isWNodeWrapper(current) && isWNodeWrapper(next)) {
                    return _updateWidget({ current: current, next: next });
                }
            }
            else if (current && !next) {
                if (isVNodeWrapper(current)) {
                    return _removeDom({ current: current });
                }
                else if (isWNodeWrapper(current)) {
                    return _removeWidget({ current: current });
                }
            }
        }
        return {};
    }
    function createWidgetOptions(id, widgetId, middleware) {
        return {
            id: id,
            properties: function () {
                var widgetMeta = widgetMetaMap.get(widgetId);
                if (widgetMeta) {
                    widgetMeta.propertiesCalled = true;
                    return tslib_1.__assign({}, widgetMeta.properties);
                }
                return {};
            },
            children: function () {
                var widgetMeta = widgetMetaMap.get(widgetId);
                if (widgetMeta) {
                    return widgetMeta.children;
                }
                return [];
            },
            middleware: middleware
        };
    }
    function resolveMiddleware(middlewares, id, middlewareIds) {
        if (middlewareIds === void 0) { middlewareIds = []; }
        var keys = Object.keys(middlewares);
        var results = {};
        var uniqueId = id + "-" + metaId++;
        for (var i = 0; i < keys.length; i++) {
            var middleware = middlewares[keys[i]]();
            var payload = createWidgetOptions(uniqueId, id);
            if (middleware.middlewares) {
                var resolvedMiddleware = resolveMiddleware(middleware.middlewares, id, middlewareIds).middlewares;
                payload.middleware = resolvedMiddleware;
                results[keys[i]] = middleware.callback(payload);
            }
            else {
                results[keys[i]] = middleware.callback(payload);
            }
        }
        middlewareIds.push(uniqueId);
        return { middlewares: results, ids: middlewareIds };
    }
    function _createWidget(_a) {
        var next = _a.next;
        var widgetConstructor = next.node.widgetConstructor;
        var registry = _mountOptions.registry;
        var Constructor = next.registryItem || widgetConstructor;
        if (!Registry_1.isWidget(Constructor)) {
            resolveRegistryItem(next);
            if (!next.registryItem) {
                return false;
            }
            Constructor = next.registryItem;
        }
        var rendered;
        var invalidate;
        next.properties = tslib_1.__assign({}, next.node.properties);
        next.id = next.id || "" + wrapperId++;
        _idToWrapperMap.set(next.id, next);
        var id = next.id, depth = next.depth, order = next.order;
        if (!Registry_1.isWidgetBaseConstructor(Constructor)) {
            var widgetMeta = widgetMetaMap.get(id);
            if (!widgetMeta) {
                invalidate = function () {
                    var widgetMeta = widgetMetaMap.get(id);
                    if (widgetMeta) {
                        widgetMeta.dirty = true;
                        if (!widgetMeta.rendering && _idToWrapperMap.has(id)) {
                            _invalidationQueue.push({ id: id, depth: depth, order: order });
                            _schedule();
                        }
                    }
                };
                widgetMeta = {
                    widgetName: Constructor.name || 'unknown',
                    mountNode: _mountOptions.domNode,
                    dirty: false,
                    invalidator: invalidate,
                    properties: wrapFunctionProperties(id, next.node.properties),
                    originalProperties: tslib_1.__assign({}, next.node.properties),
                    children: next.node.children,
                    deferRefs: 0,
                    rendering: true,
                    middleware: {},
                    middlewareIds: [],
                    registry: _mountOptions.registry,
                    propertiesCalled: false
                };
                widgetMetaMap.set(next.id, widgetMeta);
                if (Constructor.middlewares && Object.keys(Constructor.middlewares).length) {
                    var _b = resolveMiddleware(Constructor.middlewares, id), middlewares = _b.middlewares, ids = _b.ids;
                    widgetMeta.middleware = middlewares;
                    widgetMeta.middlewareIds = ids;
                }
            }
            else {
                invalidate = widgetMeta.invalidator;
            }
            rendered = Constructor(createWidgetOptions(id, id, widgetMeta.middleware));
            widgetMeta.rendering = false;
            widgetMeta.propertiesCalled = false;
            if (widgetMeta.deferRefs > 0) {
                return false;
            }
        }
        else {
            var instance = new Constructor();
            instance.registry.base = registry;
            var instanceData_1 = exports.widgetInstanceMap.get(instance);
            invalidate = function () {
                instanceData_1.dirty = true;
                if (!instanceData_1.rendering && _idToWrapperMap.has(id)) {
                    _invalidationQueue.push({ id: id, depth: depth, order: order });
                    _schedule();
                }
            };
            instanceData_1.invalidate = invalidate;
            instanceData_1.rendering = true;
            instance.__setProperties__(next.node.properties);
            instance.__setChildren__(next.node.children);
            next.instance = instance;
            rendered = instance.__render__();
            instanceData_1.rendering = false;
        }
        var children;
        if (rendered) {
            rendered = Array.isArray(rendered) ? rendered : [rendered];
            children = renderedToWrapper(rendered, next, null);
            _idToChildrenWrappers.set(id, children);
        }
        if (!parentInvalidate && !Constructor.isWNodeWrapper) {
            parentInvalidate = invalidate;
        }
        return {
            item: {
                next: children,
                meta: { mergeNodes: next.mergeNodes }
            },
            widget: { type: 'attach', instance: next.instance, id: id, attached: true }
        };
    }
    function _updateWidget(_a) {
        var current = _a.current, next = _a.next;
        current = getWNodeWrapper(current.id) || current;
        var instance = current.instance, domNode = current.domNode, hasAnimations = current.hasAnimations, id = current.id;
        var widgetConstructor = next.node.widgetConstructor;
        var Constructor = next.registryItem || widgetConstructor;
        if (!Registry_1.isWidget(Constructor)) {
            return {};
        }
        var rendered;
        var processResult = {};
        var didRender = false;
        var currentChildren = _idToChildrenWrappers.get(current.id);
        next.hasAnimations = hasAnimations;
        next.id = id;
        next.properties = tslib_1.__assign({}, next.node.properties);
        _wrapperSiblingMap.delete(current);
        if (domNode && domNode.parentNode) {
            next.domNode = domNode;
        }
        if (!Registry_1.isWidgetBaseConstructor(Constructor)) {
            var widgetMeta_1 = widgetMetaMap.get(id);
            if (widgetMeta_1) {
                widgetMeta_1.originalProperties = tslib_1.__assign({}, next.properties);
                widgetMeta_1.properties = wrapFunctionProperties(id, widgetMeta_1.originalProperties);
                widgetMeta_1.children = next.node.children;
                widgetMeta_1.rendering = true;
                var customProperties = runDiffs(widgetMeta_1, current.properties, widgetMeta_1.originalProperties);
                widgetMeta_1.properties = tslib_1.__assign({}, widgetMeta_1.properties, customProperties);
                if (current.node.children.length > 0 || next.node.children.length > 0) {
                    widgetMeta_1.dirty = true;
                }
                if (!widgetMeta_1.dirty) {
                    propertiesDiff(current.properties, next.properties, function () {
                        widgetMeta_1.dirty = true;
                    }, widgetMeta_1.customDiffProperties ? tslib_1.__spread(widgetMeta_1.customDiffProperties.values()) : []);
                }
                if (widgetMeta_1.dirty) {
                    _idToChildrenWrappers.delete(id);
                    didRender = true;
                    rendered = Constructor(createWidgetOptions(id, id, widgetMeta_1.middleware));
                    widgetMeta_1.dirty = false;
                    if (widgetMeta_1.deferRefs > 0) {
                        rendered = null;
                    }
                }
                widgetMeta_1.rendering = false;
                widgetMeta_1.propertiesCalled = false;
            }
        }
        else {
            var instanceData = exports.widgetInstanceMap.get(instance);
            next.instance = instance;
            instanceData.rendering = true;
            instance.__setProperties__(next.node.properties);
            instance.__setChildren__(next.node.children);
            if (instanceData.dirty) {
                didRender = true;
                _idToChildrenWrappers.delete(id);
                rendered = instance.__render__();
            }
            instanceData.rendering = false;
        }
        _idToWrapperMap.set(next.id, next);
        processResult.widget = { type: 'attach', instance: instance, id: id, attached: false };
        var children;
        if (rendered) {
            rendered = Array.isArray(rendered) ? rendered : [rendered];
            children = renderedToWrapper(rendered, next, current);
            _idToChildrenWrappers.set(id, children);
        }
        if (didRender) {
            processResult.item = {
                current: currentChildren,
                next: children,
                meta: {}
            };
        }
        return processResult;
    }
    function _removeWidget(_a) {
        var current = _a.current;
        current = getWNodeWrapper(current.id) || current;
        _idToWrapperMap.delete(current.id);
        var meta = widgetMetaMap.get(current.id);
        var currentChildren = _idToChildrenWrappers.get(current.id);
        _idToChildrenWrappers.delete(current.id);
        _wrapperSiblingMap.delete(current);
        var processResult = {
            item: {
                current: currentChildren,
                meta: {}
            }
        };
        if (meta) {
            meta.registryHandler && meta.registryHandler.destroy();
            destroyHandles(meta);
            widgetMetaMap.delete(current.id);
        }
        else {
            processResult.widget = { type: 'detach', current: current, instance: current.instance };
        }
        return processResult;
    }
    function findDomNodeOnParentWrapper(id) {
        var children = _idToChildrenWrappers.get(id) || [];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.domNode) {
                return child.id;
            }
            var childId = findDomNodeOnParentWrapper(child.id);
            if (childId) {
                return childId;
            }
        }
    }
    function _createDom(_a) {
        var next = _a.next;
        var parentDomNode = findParentDomNode(next);
        var isVirtual = isVirtualWrapper(next);
        var isBody = isBodyWrapper(next);
        var mergeNodes = [];
        next.id = "" + wrapperId++;
        _idToWrapperMap.set(next.id, next);
        if (!next.domNode) {
            if (next.node.domNode) {
                next.domNode = next.node.domNode;
            }
            else {
                if (next.node.tag === 'svg') {
                    next.namespace = NAMESPACE_SVG;
                }
                if (isBody) {
                    next.domNode = global_1.default.document.body;
                }
                else if (next.node.tag && !isVirtual) {
                    if (next.namespace) {
                        next.domNode = global_1.default.document.createElementNS(next.namespace, next.node.tag);
                    }
                    else {
                        next.domNode = global_1.default.document.createElement(next.node.tag);
                    }
                }
                else if (next.node.text != null) {
                    next.domNode = global_1.default.document.createTextNode(next.node.text);
                }
            }
            if (_insertBeforeMap && _allMergedNodes.length) {
                if (parentDomNode === _allMergedNodes[0].parentNode) {
                    _insertBeforeMap.set(next, _allMergedNodes[0]);
                }
            }
        }
        else if (_mountOptions.merge) {
            next.merged = true;
            if (isTextNode(next.domNode)) {
                if (next.domNode.data !== next.node.text) {
                    _allMergedNodes = tslib_1.__spread([next.domNode], _allMergedNodes);
                    next.domNode = global_1.default.document.createTextNode(next.node.text);
                    next.merged = false;
                }
            }
            else {
                mergeNodes = arrayFrom(next.domNode.childNodes);
                _allMergedNodes = tslib_1.__spread(_allMergedNodes, mergeNodes);
            }
        }
        var children;
        if (next.domNode || isVirtual) {
            if (next.node.children && next.node.children.length) {
                children = renderedToWrapper(next.node.children, next, null);
                _idToChildrenWrappers.set(next.id, children);
            }
        }
        var dom = isVirtual || isBody
            ? undefined
            : {
                next: next,
                parentDomNode: parentDomNode,
                type: 'create'
            };
        if (children) {
            return {
                item: {
                    current: [],
                    next: children,
                    meta: { mergeNodes: mergeNodes }
                },
                dom: dom,
                widget: isVirtual ? { type: 'attach', id: next.id, attached: false } : undefined
            };
        }
        return { dom: dom };
    }
    function _updateDom(_a) {
        var current = _a.current, next = _a.next;
        next.domNode = current.domNode;
        next.namespace = current.namespace;
        next.id = current.id;
        next.childDomWrapperId = current.childDomWrapperId;
        var children;
        var currentChildren = _idToChildrenWrappers.get(next.id);
        if (next.node.text != null && next.node.text !== current.node.text) {
            next.domNode = global_1.default.document.createTextNode(next.node.text);
        }
        else if (next.node.children) {
            children = renderedToWrapper(next.node.children, next, current);
            _idToChildrenWrappers.set(next.id, children);
        }
        _wrapperSiblingMap.delete(current);
        _idToWrapperMap.set(next.id, next);
        return {
            item: {
                current: currentChildren,
                next: children,
                meta: {}
            },
            dom: { type: 'update', next: next, current: current }
        };
    }
    function _removeDom(_a) {
        var current = _a.current;
        var isVirtual = isVirtualWrapper(current);
        var isBody = isBodyWrapper(current);
        var children = _idToChildrenWrappers.get(current.id);
        _idToChildrenWrappers.delete(current.id);
        _idToWrapperMap.delete(current.id);
        _wrapperSiblingMap.delete(current);
        if (current.node.properties.key) {
            var widgetMeta = widgetMetaMap.get(current.owningId);
            var parentWrapper = getWNodeWrapper(current.owningId);
            if (widgetMeta) {
                widgetMeta.nodeMap && widgetMeta.nodeMap.delete(current.node.properties.key);
            }
            else if (parentWrapper && parentWrapper.instance) {
                var instanceData = exports.widgetInstanceMap.get(parentWrapper.instance);
                instanceData && instanceData.nodeHandler.remove(current.node.properties.key);
            }
        }
        if (current.hasAnimations || isVirtual || isBody) {
            return {
                item: { current: children, meta: {} },
                dom: isVirtual || isBody ? undefined : { type: 'delete', current: current }
            };
        }
        if (children) {
            _deferredRenderCallbacks.push(function () {
                var wrappers = children || [];
                var wrapper;
                var bodyIds = [];
                while ((wrapper = wrappers.pop())) {
                    if (isWNodeWrapper(wrapper)) {
                        wrapper = getWNodeWrapper(wrapper.id) || wrapper;
                        if (wrapper.instance) {
                            var instanceData = exports.widgetInstanceMap.get(wrapper.instance);
                            instanceData && instanceData.onDetach();
                            wrapper.instance = undefined;
                        }
                        else {
                            var meta = widgetMetaMap.get(wrapper.id);
                            if (meta) {
                                meta.registryHandler && meta.registryHandler.destroy();
                                destroyHandles(meta);
                                widgetMetaMap.delete(wrapper.id);
                            }
                        }
                    }
                    var wrapperChildren = _idToChildrenWrappers.get(wrapper.id);
                    if (wrapperChildren) {
                        wrappers.push.apply(wrappers, tslib_1.__spread(wrapperChildren));
                    }
                    if (isBodyWrapper(wrapper)) {
                        bodyIds.push(wrapper.id);
                    }
                    else if (bodyIds.indexOf(wrapper.parentId) !== -1) {
                        if (isWNodeWrapper(wrapper) || isVirtualWrapper(wrapper)) {
                            bodyIds.push(wrapper.id);
                        }
                        else if (wrapper.domNode && wrapper.domNode.parentNode) {
                            wrapper.domNode.parentNode.removeChild(wrapper.domNode);
                        }
                    }
                    _idToChildrenWrappers.delete(wrapper.id);
                    _idToWrapperMap.delete(wrapper.id);
                }
            });
        }
        return {
            dom: { type: 'delete', current: current }
        };
    }
    return {
        mount: mount,
        unmount: unmount,
        invalidate: invalidate
    };
}
exports.renderer = renderer;
exports.default = renderer;


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/ActiveLink.js":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/ActiveLink.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var vdom_1 = __webpack_require__(/*! ../core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var injector_1 = __webpack_require__(/*! ../core/middleware/injector */ "./node_modules/@dojo/framework/core/middleware/injector.js");
var icache_1 = __webpack_require__(/*! ../core/middleware/icache */ "./node_modules/@dojo/framework/core/middleware/icache.js");
var Link_1 = __webpack_require__(/*! ./Link */ "./node_modules/@dojo/framework/routing/Link.js");
function paramsEqual(linkParams, contextParams) {
    if (linkParams === void 0) { linkParams = {}; }
    if (contextParams === void 0) { contextParams = {}; }
    return Object.keys(linkParams).every(function (key) { return linkParams[key] === contextParams[key]; });
}
var factory = vdom_1.create({ injector: injector_1.default, diffProperty: vdom_1.diffProperty, icache: icache_1.default, invalidator: vdom_1.invalidator }).properties();
exports.ActiveLink = factory(function ActiveLink(_a) {
    var _b = _a.middleware, diffProperty = _b.diffProperty, injector = _b.injector, icache = _b.icache, invalidator = _b.invalidator, properties = _a.properties, children = _a.children;
    var _c = properties(), to = _c.to, _d = _c.routerKey, routerKey = _d === void 0 ? 'router' : _d, params = _c.params;
    var _e = properties(), activeClasses = _e.activeClasses, isExact = _e.isExact, _f = _e.classes, classes = _f === void 0 ? [] : _f, props = tslib_1.__rest(_e, ["activeClasses", "isExact", "classes"]);
    diffProperty('to', function (current, next) {
        if (current.to !== next.to) {
            var router_1 = injector.get(routerKey);
            var currentHandle = icache.get('handle');
            if (currentHandle) {
                currentHandle.destroy();
            }
            if (router_1) {
                var handle_1 = router_1.on('route', function (_a) {
                    var route = _a.route;
                    if (route.id === to) {
                        invalidator();
                    }
                });
                icache.set('handle', function () { return handle_1; });
            }
            invalidator();
        }
    });
    var router = injector.get(routerKey);
    if (router) {
        if (!icache.get('handle')) {
            var handle_2 = router.on('route', function (_a) {
                var route = _a.route;
                if (route.id === to) {
                    invalidator();
                }
            });
            icache.set('handle', function () { return handle_2; });
        }
        var context = router.getRoute(to);
        var isActive = context && paramsEqual(params, tslib_1.__assign({}, context.params, context.queryParams));
        var contextIsExact = context && context.isExact();
        classes = Array.isArray(classes) ? classes : [classes];
        if (isActive && (!isExact || contextIsExact)) {
            classes = tslib_1.__spread(classes, activeClasses);
        }
        props = tslib_1.__assign({}, props, { classes: classes });
    }
    return vdom_1.w(Link_1.default, props, children());
});
exports.default = exports.ActiveLink;


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/Link.js":
/*!******************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/Link.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var vdom_1 = __webpack_require__(/*! ../core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var has_1 = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.js");
var injector_1 = __webpack_require__(/*! ../core/middleware/injector */ "./node_modules/@dojo/framework/core/middleware/injector.js");
var factory = vdom_1.create({ injector: injector_1.default }).properties();
exports.Link = factory(function Link(_a) {
    var injector = _a.middleware.injector, properties = _a.properties, children = _a.children;
    var _b = properties(), _c = _b.routerKey, routerKey = _c === void 0 ? 'router' : _c, to = _b.to, _d = _b.isOutlet, isOutlet = _d === void 0 ? true : _d, target = _b.target, _e = _b.params, params = _e === void 0 ? {} : _e, onClick = _b.onClick, props = tslib_1.__rest(_b, ["routerKey", "to", "isOutlet", "target", "params", "onClick"]);
    var router = injector.get(routerKey);
    var href = to;
    var linkProps;
    if (router) {
        if (isOutlet) {
            href = router.link(href, params);
        }
        var onclick_1 = function (event) {
            onClick && onClick(event);
            if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !target) {
                if (!has_1.default('build-serve') || !true) {
                    event.preventDefault();
                    href !== undefined && router.setPath(href);
                }
            }
        };
        linkProps = tslib_1.__assign({}, props, { onclick: onclick_1, href: href });
    }
    else {
        linkProps = tslib_1.__assign({}, props, { href: href });
    }
    return vdom_1.v('a', linkProps, children());
});
exports.default = exports.Link;


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/Outlet.js":
/*!********************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/Outlet.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var vdom_1 = __webpack_require__(/*! ../core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var injector_1 = __webpack_require__(/*! ../core/middleware/injector */ "./node_modules/@dojo/framework/core/middleware/injector.js");
var icache_1 = __webpack_require__(/*! ../core/middleware/icache */ "./node_modules/@dojo/framework/core/middleware/icache.js");
var ROUTER_KEY = 'router';
var factory = vdom_1.create({ icache: icache_1.default, injector: injector_1.default, diffProperty: vdom_1.diffProperty, invalidator: vdom_1.invalidator })
    .properties()
    .children();
exports.Outlet = factory(function Outlet(_a) {
    var _b = _a.middleware, icache = _b.icache, injector = _b.injector, diffProperty = _b.diffProperty, invalidator = _b.invalidator, properties = _a.properties, children = _a.children;
    diffProperty('routerKey', function (current, next) {
        var _a = current.routerKey, currentRouterKey = _a === void 0 ? ROUTER_KEY : _a;
        var _b = next.routerKey, routerKey = _b === void 0 ? ROUTER_KEY : _b;
        if (routerKey !== currentRouterKey) {
            var currentHandle_1 = icache.get('handle');
            if (currentHandle_1) {
                currentHandle_1();
            }
            var handle_1 = injector.subscribe(routerKey);
            if (handle_1) {
                icache.set('handle', function () { return handle_1; });
            }
        }
        invalidator();
    });
    var _c = properties(), id = _c.id, matcher = _c.matcher, _d = _c.routerKey, routerKey = _d === void 0 ? ROUTER_KEY : _d;
    var _e = tslib_1.__read(children(), 1), outletChildren = _e[0];
    var currentHandle = icache.get('handle');
    if (!currentHandle) {
        var handle_2 = injector.subscribe(routerKey);
        if (handle_2) {
            icache.set('handle', function () { return handle_2; });
        }
    }
    var router = injector.get(routerKey);
    if (router) {
        var currentRouteContext_1 = router.getMatchedRoute();
        var routeContextMap_1 = router.getOutlet(id);
        if (routeContextMap_1 && currentRouteContext_1) {
            if (typeof outletChildren === 'function') {
                return outletChildren(tslib_1.__assign({}, currentRouteContext_1, { router: router }));
            }
            var matches_1 = Object.keys(outletChildren).reduce(function (matches, key) {
                matches[key] = !!routeContextMap_1.get(key);
                return matches;
            }, {});
            if (matcher) {
                matches_1 = matcher(matches_1, routeContextMap_1);
            }
            return (vdom_1.tsx("virtual", null, Object.keys(matches_1)
                .filter(function (key) { return matches_1[key]; })
                .map(function (key) {
                var renderer = outletChildren[key];
                if (typeof renderer === 'function') {
                    var context = routeContextMap_1.get(key) || currentRouteContext_1;
                    return renderer(tslib_1.__assign({}, context, { router: router }));
                }
                return renderer;
            })));
        }
    }
    return null;
});
exports.default = exports.Outlet;


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/Router.js":
/*!********************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/Router.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__(/*! ../shim/global */ "./node_modules/@dojo/framework/shim/global.js");
var Evented_1 = __webpack_require__(/*! ../core/Evented */ "./node_modules/@dojo/framework/core/Evented.js");
var HashHistory_1 = __webpack_require__(/*! ./history/HashHistory */ "./node_modules/@dojo/framework/routing/history/HashHistory.js");
var PARAM = '__PARAM__';
var paramRegExp = new RegExp(/^{.+}$/);
var ROUTE_SEGMENT_SCORE = 7;
var DYNAMIC_SEGMENT_PENALTY = 2;
function matchingParams(_a, _b) {
    var previousParams = _a.params;
    var params = _b.params;
    var matching = Object.keys(previousParams).every(function (key) { return previousParams[key] === params[key]; });
    if (!matching) {
        return false;
    }
    return Object.keys(params).every(function (key) { return previousParams[key] === params[key]; });
}
var Router = /** @class */ (function (_super) {
    tslib_1.__extends(Router, _super);
    function Router(config, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this._routes = [];
        _this._routeMap = Object.create(null);
        _this._matchedRoutes = Object.create(null);
        _this._matchedOutletMap = new Map();
        _this._currentParams = {};
        _this._currentQueryParams = {};
        /**
         * Called on change of the route by the the registered history manager. Matches the path against
         * the registered outlets.
         *
         * @param requestedPath The path of the requested route
         */
        _this._onChange = function (requestedPath) {
            requestedPath = _this._stripLeadingSlash(requestedPath);
            var previousMatchedRoutes = _this._matchedRoutes;
            _this._matchedRoutes = Object.create(null);
            _this._matchedOutletMap.clear();
            var _a = tslib_1.__read(requestedPath.split('?'), 2), path = _a[0], queryParamString = _a[1];
            _this._currentQueryParams = _this._getQueryParams(queryParamString);
            var segments = path.split('/');
            var routeConfigs = _this._routes.map(function (route) { return ({
                route: route,
                segments: tslib_1.__spread(segments),
                parent: undefined,
                params: {},
                type: 'index'
            }); });
            var routeConfig;
            var matchedRoutes = [];
            var _loop_1 = function () {
                var route = routeConfig.route, parent_1 = routeConfig.parent, segments_1 = routeConfig.segments, params = routeConfig.params;
                var segmentIndex = 0;
                var type = 'index';
                var paramIndex = 0;
                var routeMatch = true;
                if (segments_1.length < route.segments.length) {
                    routeMatch = false;
                }
                else {
                    while (segments_1.length > 0) {
                        if (route.segments[segmentIndex] === undefined) {
                            type = 'partial';
                            break;
                        }
                        var segment = segments_1.shift();
                        if (route.segments[segmentIndex] === PARAM) {
                            params[route.params[paramIndex++]] = segment;
                            _this._currentParams = tslib_1.__assign({}, _this._currentParams, params);
                        }
                        else if (route.segments[segmentIndex] !== segment) {
                            routeMatch = false;
                            break;
                        }
                        segmentIndex++;
                    }
                }
                if (routeMatch) {
                    routeConfig.type = type;
                    matchedRoutes.push({ route: route, parent: parent_1, type: type, params: params, segments: [] });
                    if (segments_1.length) {
                        routeConfigs = tslib_1.__spread(routeConfigs, route.children.map(function (childRoute) { return ({
                            route: childRoute,
                            segments: tslib_1.__spread(segments_1),
                            parent: routeConfig,
                            type: type,
                            params: tslib_1.__assign({}, params)
                        }); }));
                    }
                }
            };
            while ((routeConfig = routeConfigs.pop())) {
                _loop_1();
            }
            var matchedRouteId = undefined;
            var matchedRoute = matchedRoutes.shift();
            while (matchedRoute && matchedRoutes.length) {
                var currentMatch = matchedRoutes.shift();
                if (currentMatch && currentMatch.route.score > matchedRoute.route.score) {
                    matchedRoute = currentMatch;
                }
            }
            if (matchedRoute) {
                if (matchedRoute.type === 'partial') {
                    matchedRoute.type = 'error';
                }
                matchedRouteId = matchedRoute.route.id;
                var title = _this._options.setDocumentTitle
                    ? _this._options.setDocumentTitle({
                        id: matchedRouteId,
                        title: matchedRoute.route.title,
                        params: matchedRoute.params,
                        queryParams: _this._currentQueryParams
                    })
                    : matchedRoute.route.title;
                if (title) {
                    global_1.default.document.title = title;
                }
                var _loop_2 = function () {
                    var type = matchedRoute.type, params = matchedRoute.params, route = matchedRoute.route;
                    var parent_2 = matchedRoute.parent;
                    var matchedRouteContext = {
                        id: route.id,
                        outlet: route.outlet,
                        queryParams: _this._currentQueryParams,
                        params: params,
                        type: type,
                        isError: function () { return type === 'error'; },
                        isExact: function () { return type === 'index'; }
                    };
                    var previousMatchedOutlet = previousMatchedRoutes[route.id];
                    var routeMap = _this._matchedOutletMap.get(route.outlet) || new Map();
                    routeMap.set(route.id, matchedRouteContext);
                    _this._matchedOutletMap.set(route.outlet, routeMap);
                    _this._matchedRoutes[route.id] = matchedRouteContext;
                    if (!previousMatchedOutlet || !matchingParams(previousMatchedOutlet, matchedRouteContext)) {
                        _this.emit({ type: 'route', route: matchedRouteContext, action: 'enter' });
                        _this.emit({ type: 'outlet', outlet: matchedRouteContext, action: 'enter' });
                    }
                    matchedRoute = parent_2;
                };
                while (matchedRoute) {
                    _loop_2();
                }
            }
            else {
                _this._matchedRoutes.errorRoute = {
                    id: 'errorRoute',
                    outlet: 'errorRoute',
                    queryParams: {},
                    params: {},
                    isError: function () { return true; },
                    isExact: function () { return false; },
                    type: 'error'
                };
            }
            var previousMatchedOutletKeys = Object.keys(previousMatchedRoutes);
            for (var i = 0; i < previousMatchedOutletKeys.length; i++) {
                var key = previousMatchedOutletKeys[i];
                var matchedRoute_1 = _this._matchedRoutes[key];
                if (!matchedRoute_1 || !matchingParams(previousMatchedRoutes[key], matchedRoute_1)) {
                    _this.emit({ type: 'route', route: previousMatchedRoutes[key], action: 'exit' });
                    _this.emit({ type: 'outlet', outlet: previousMatchedRoutes[key], action: 'exit' });
                }
            }
            _this._currentMatchedRoute = matchedRouteId ? _this._matchedRoutes[matchedRouteId] : undefined;
            _this.emit({
                type: 'nav',
                outlet: matchedRouteId,
                context: _this._currentMatchedRoute
            });
        };
        _this._options = options;
        _this._register(config);
        var autostart = options.autostart === undefined ? true : options.autostart;
        if (autostart) {
            _this.start();
        }
        return _this;
    }
    /**
     * Sets the path against the registered history manager
     *
     * @param path The path to set on the history manager
     */
    Router.prototype.setPath = function (path) {
        this._history.set(path);
    };
    Router.prototype.start = function () {
        var _a = this._options, _b = _a.HistoryManager, HistoryManager = _b === void 0 ? HashHistory_1.HashHistory : _b, base = _a.base, window = _a.window;
        this._history = new HistoryManager({ onChange: this._onChange, base: base, window: window });
        if (this._matchedRoutes.errorRoute && this._defaultRoute) {
            var path = this.link(this._defaultRoute);
            if (path) {
                this.setPath(path);
            }
        }
    };
    /**
     * Generate a link for a given outlet identifier and optional params.
     *
     * @param outlet The outlet to generate a link for
     * @param params Optional Params for the generated link
     */
    Router.prototype.link = function (outlet, params) {
        if (params === void 0) { params = {}; }
        var route = this._routeMap[outlet];
        if (route === undefined) {
            return;
        }
        var linkPath = route.fullPath;
        if (route.fullQueryParams.length > 0) {
            var queryString = route.fullQueryParams.reduce(function (queryParamString, param, index) {
                if (index > 0) {
                    return queryParamString + "&" + param + "={" + param + "}";
                }
                return "?" + param + "={" + param + "}";
            }, '');
            linkPath = "" + linkPath + queryString;
        }
        params = tslib_1.__assign({}, route.defaultParams, this._currentQueryParams, this._currentParams, params);
        if (Object.keys(params).length === 0 && route.fullParams.length > 0) {
            return undefined;
        }
        var fullParams = tslib_1.__spread(route.fullParams, route.fullQueryParams);
        for (var i = 0; i < fullParams.length; i++) {
            var param = fullParams[i];
            if (params[param]) {
                linkPath = linkPath.replace("{" + param + "}", params[param]);
            }
            else {
                return undefined;
            }
        }
        return this._history.prefix(linkPath);
    };
    /**
     * Returns the route context for the route identifier if one has been matched
     *
     * @param routeId The route identifer
     */
    Router.prototype.getRoute = function (routeId) {
        return this._matchedRoutes[routeId];
    };
    Router.prototype.getOutlet = function (outletId) {
        return this._matchedOutletMap.get(outletId);
    };
    Router.prototype.getMatchedRoute = function () {
        return this._currentMatchedRoute;
    };
    Object.defineProperty(Router.prototype, "currentParams", {
        /**
         * Returns all the params for the current matched outlets
         */
        get: function () {
            return this._currentParams;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Strips the leading slash on a path if one exists
     *
     * @param path The path to strip a leading slash
     */
    Router.prototype._stripLeadingSlash = function (path) {
        if (path[0] === '/') {
            return path.slice(1);
        }
        return path;
    };
    /**
     * Registers the routing configuration
     *
     * @param config The configuration
     * @param routes The routes
     * @param parentRoute The parent route
     */
    Router.prototype._register = function (config, routes, parentRoute) {
        routes = routes ? routes : this._routes;
        for (var i = 0; i < config.length; i++) {
            var _a = config[i], path = _a.path, outlet = _a.outlet, children = _a.children, _b = _a.defaultRoute, defaultRoute = _b === void 0 ? false : _b, _c = _a.defaultParams, defaultParams = _c === void 0 ? {} : _c, id = _a.id, title = _a.title;
            var _d = tslib_1.__read(path.split('?'), 2), parsedPath = _d[0], queryParamString = _d[1];
            var queryParams = [];
            parsedPath = this._stripLeadingSlash(parsedPath);
            var segments = parsedPath.split('/');
            var route = {
                params: [],
                id: id,
                outlet: outlet,
                title: title,
                path: parsedPath,
                segments: segments,
                defaultParams: parentRoute ? tslib_1.__assign({}, parentRoute.defaultParams, defaultParams) : defaultParams,
                children: [],
                fullPath: parentRoute ? parentRoute.fullPath + "/" + parsedPath : parsedPath,
                fullParams: [],
                fullQueryParams: [],
                score: parentRoute ? parentRoute.score : 0
            };
            if (defaultRoute) {
                this._defaultRoute = id;
            }
            for (var i_1 = 0; i_1 < segments.length; i_1++) {
                var segment = segments[i_1];
                route.score += ROUTE_SEGMENT_SCORE;
                if (paramRegExp.test(segment)) {
                    route.score -= DYNAMIC_SEGMENT_PENALTY;
                    route.params.push(segment.replace('{', '').replace('}', ''));
                    segments[i_1] = PARAM;
                }
            }
            if (queryParamString) {
                queryParams = queryParamString.split('&').map(function (queryParam) {
                    return queryParam.replace('{', '').replace('}', '');
                });
            }
            route.fullQueryParams = parentRoute ? tslib_1.__spread(parentRoute.fullQueryParams, queryParams) : queryParams;
            route.fullParams = parentRoute ? tslib_1.__spread(parentRoute.fullParams, route.params) : route.params;
            if (children && children.length > 0) {
                this._register(children, route.children, route);
            }
            this._routeMap[id] = route;
            routes.push(route);
        }
    };
    /**
     * Returns an object of query params
     *
     * @param queryParamString The string of query params, e.g `paramOne=one&paramTwo=two`
     */
    Router.prototype._getQueryParams = function (queryParamString) {
        var queryParams = {};
        if (queryParamString) {
            var queryParameters = queryParamString.split('&');
            for (var i = 0; i < queryParameters.length; i++) {
                var _a = tslib_1.__read(queryParameters[i].split('='), 2), key = _a[0], value = _a[1];
                queryParams[key] = value;
            }
        }
        return queryParams;
    };
    return Router;
}(Evented_1.default));
exports.Router = Router;
exports.default = Router;


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/RouterInjector.js":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/RouterInjector.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var Router_1 = __webpack_require__(/*! ./Router */ "./node_modules/@dojo/framework/routing/Router.js");
/**
 * Creates a router instance for a specific History manager (default is `HashHistory`) and registers
 * the route configuration.
 *
 * @param config The route config to register for the router
 * @param registry An optional registry that defaults to the global registry
 * @param options The router injector options
 */
function registerRouterInjector(config, registry, options) {
    if (options === void 0) { options = {}; }
    var _a = options.key, key = _a === void 0 ? 'router' : _a, routerOptions = tslib_1.__rest(options, ["key"]);
    if (registry.hasInjector(key)) {
        throw new Error('Router has already been defined');
    }
    var router = new Router_1.Router(config, routerOptions);
    registry.defineInjector(key, function (invalidator) {
        router.on('nav', function () { return invalidator(); });
        return function () { return router; };
    });
    return router;
}
exports.registerRouterInjector = registerRouterInjector;


/***/ }),

/***/ "./node_modules/@dojo/framework/routing/history/HashHistory.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@dojo/framework/routing/history/HashHistory.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__(/*! ../../shim/global */ "./node_modules/@dojo/framework/shim/global.js");
var HashHistory = /** @class */ (function () {
    function HashHistory(_a) {
        var _this = this;
        var _b = _a.window, window = _b === void 0 ? global_1.default.window : _b, onChange = _a.onChange;
        this._onChange = function () {
            var path = _this.normalizePath(_this._window.location.hash);
            if (path !== _this._current) {
                _this._current = path;
                _this._onChangeFunction(_this._current);
            }
        };
        this._onChangeFunction = onChange;
        this._window = window;
        this._window.addEventListener('hashchange', this._onChange, false);
        this._current = this.normalizePath(this._window.location.hash);
        this._onChangeFunction(this._current);
    }
    HashHistory.prototype.normalizePath = function (path) {
        return path.replace('#', '');
    };
    HashHistory.prototype.prefix = function (path) {
        if (path[0] !== '#') {
            return "#" + path;
        }
        return path;
    };
    HashHistory.prototype.set = function (path) {
        this._window.location.hash = this.prefix(path);
        this._onChange();
    };
    Object.defineProperty(HashHistory.prototype, "current", {
        get: function () {
            return this._current;
        },
        enumerable: true,
        configurable: true
    });
    HashHistory.prototype.destroy = function () {
        this._window.removeEventListener('hashchange', this._onChange);
    };
    return HashHistory;
}());
exports.HashHistory = HashHistory;
exports.default = HashHistory;


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/Map.js":
/*!**************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/Map.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var _a;
"use strict";
// !has('es6-iterator')
var iterator_1 = __webpack_require__(/*! ./iterator */ "./node_modules/@dojo/framework/shim/iterator.js");
var global_1 = __webpack_require__(/*! ./global */ "./node_modules/@dojo/framework/shim/global.js");
var object_1 = __webpack_require__(/*! ./object */ "./node_modules/@dojo/framework/shim/object.js");
var has_1 = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.js");
// !has('es6-symbol')
__webpack_require__(/*! ./Symbol */ "./node_modules/@dojo/framework/shim/Symbol.js");
exports.Map = global_1.default.Map;
if (!has_1.default('es6-map')) {
    exports.Map = global_1.default.Map = (_a = /** @class */ (function () {
            function Map(iterable) {
                var e_1, _b;
                this._keys = [];
                this._values = [];
                this[Symbol.toStringTag] = 'Map';
                if (iterable) {
                    if (iterator_1.isArrayLike(iterable)) {
                        for (var i = 0; i < iterable.length; i++) {
                            var value = iterable[i];
                            this.set(value[0], value[1]);
                        }
                    }
                    else {
                        try {
                            for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                                var value = iterable_1_1.value;
                                this.set(value[0], value[1]);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (iterable_1_1 && !iterable_1_1.done && (_b = iterable_1.return)) _b.call(iterable_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
            }
            /**
             * An alternative to Array.prototype.indexOf using Object.is
             * to check for equality. See http://mzl.la/1zuKO2V
             */
            Map.prototype._indexOfKey = function (keys, key) {
                for (var i = 0, length_1 = keys.length; i < length_1; i++) {
                    if (object_1.is(keys[i], key)) {
                        return i;
                    }
                }
                return -1;
            };
            Object.defineProperty(Map.prototype, "size", {
                get: function () {
                    return this._keys.length;
                },
                enumerable: true,
                configurable: true
            });
            Map.prototype.clear = function () {
                this._keys.length = this._values.length = 0;
            };
            Map.prototype.delete = function (key) {
                var index = this._indexOfKey(this._keys, key);
                if (index < 0) {
                    return false;
                }
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
                return true;
            };
            Map.prototype.entries = function () {
                var _this = this;
                var values = this._keys.map(function (key, i) {
                    return [key, _this._values[i]];
                });
                return new iterator_1.ShimIterator(values);
            };
            Map.prototype.forEach = function (callback, context) {
                var keys = this._keys;
                var values = this._values;
                for (var i = 0, length_2 = keys.length; i < length_2; i++) {
                    callback.call(context, values[i], keys[i], this);
                }
            };
            Map.prototype.get = function (key) {
                var index = this._indexOfKey(this._keys, key);
                return index < 0 ? undefined : this._values[index];
            };
            Map.prototype.has = function (key) {
                return this._indexOfKey(this._keys, key) > -1;
            };
            Map.prototype.keys = function () {
                return new iterator_1.ShimIterator(this._keys);
            };
            Map.prototype.set = function (key, value) {
                var index = this._indexOfKey(this._keys, key);
                index = index < 0 ? this._keys.length : index;
                this._keys[index] = key;
                this._values[index] = value;
                return this;
            };
            Map.prototype.values = function () {
                return new iterator_1.ShimIterator(this._values);
            };
            Map.prototype[Symbol.iterator] = function () {
                return this.entries();
            };
            return Map;
        }()),
        _a[Symbol.species] = _a,
        _a);
}
exports.default = exports.Map;


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/Set.js":
/*!**************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/Set.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var _a;
"use strict";
var global_1 = __webpack_require__(/*! ./global */ "./node_modules/@dojo/framework/shim/global.js");
// !has('es6-iterator')
var iterator_1 = __webpack_require__(/*! ./iterator */ "./node_modules/@dojo/framework/shim/iterator.js");
var has_1 = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.js");
// !has('es6-symbol')
__webpack_require__(/*! ./Symbol */ "./node_modules/@dojo/framework/shim/Symbol.js");
exports.Set = global_1.default.Set;
if (!has_1.default('es6-set')) {
    exports.Set = global_1.default.Set = (_a = /** @class */ (function () {
            function Set(iterable) {
                var e_1, _b;
                this._setData = [];
                this[Symbol.toStringTag] = 'Set';
                if (iterable) {
                    if (iterator_1.isArrayLike(iterable)) {
                        for (var i = 0; i < iterable.length; i++) {
                            this.add(iterable[i]);
                        }
                    }
                    else {
                        try {
                            for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                                var value = iterable_1_1.value;
                                this.add(value);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (iterable_1_1 && !iterable_1_1.done && (_b = iterable_1.return)) _b.call(iterable_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
            }
            Set.prototype.add = function (value) {
                if (this.has(value)) {
                    return this;
                }
                this._setData.push(value);
                return this;
            };
            Set.prototype.clear = function () {
                this._setData.length = 0;
            };
            Set.prototype.delete = function (value) {
                var idx = this._setData.indexOf(value);
                if (idx === -1) {
                    return false;
                }
                this._setData.splice(idx, 1);
                return true;
            };
            Set.prototype.entries = function () {
                return new iterator_1.ShimIterator(this._setData.map(function (value) { return [value, value]; }));
            };
            Set.prototype.forEach = function (callbackfn, thisArg) {
                var iterator = this.values();
                var result = iterator.next();
                while (!result.done) {
                    callbackfn.call(thisArg, result.value, result.value, this);
                    result = iterator.next();
                }
            };
            Set.prototype.has = function (value) {
                return this._setData.indexOf(value) > -1;
            };
            Set.prototype.keys = function () {
                return new iterator_1.ShimIterator(this._setData);
            };
            Object.defineProperty(Set.prototype, "size", {
                get: function () {
                    return this._setData.length;
                },
                enumerable: true,
                configurable: true
            });
            Set.prototype.values = function () {
                return new iterator_1.ShimIterator(this._setData);
            };
            Set.prototype[Symbol.iterator] = function () {
                return new iterator_1.ShimIterator(this._setData);
            };
            return Set;
        }()),
        _a[Symbol.species] = _a,
        _a);
}
exports.default = exports.Set;


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/WeakMap.js":
/*!******************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/WeakMap.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__(/*! ./global */ "./node_modules/@dojo/framework/shim/global.js");
// !has('es6-iterator')
var iterator_1 = __webpack_require__(/*! ./iterator */ "./node_modules/@dojo/framework/shim/iterator.js");
var has_1 = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.js");
// !has('es6-symbol')
__webpack_require__(/*! ./Symbol */ "./node_modules/@dojo/framework/shim/Symbol.js");
exports.WeakMap = global_1.default.WeakMap;
if (!has_1.default('es6-weakmap')) {
    var DELETED_1 = {};
    var getUID_1 = function getUID() {
        return Math.floor(Math.random() * 100000000);
    };
    var generateName_1 = (function () {
        var startId = Math.floor(Date.now() % 100000000);
        return function generateName() {
            return '__wm' + getUID_1() + (startId++ + '__');
        };
    })();
    exports.WeakMap = global_1.default.WeakMap = /** @class */ (function () {
        function WeakMap(iterable) {
            var e_1, _a;
            this[Symbol.toStringTag] = 'WeakMap';
            this._name = generateName_1();
            this._frozenEntries = [];
            if (iterable) {
                if (iterator_1.isArrayLike(iterable)) {
                    for (var i = 0; i < iterable.length; i++) {
                        var item = iterable[i];
                        this.set(item[0], item[1]);
                    }
                }
                else {
                    try {
                        for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                            var _b = tslib_1.__read(iterable_1_1.value, 2), key = _b[0], value = _b[1];
                            this.set(key, value);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
        }
        WeakMap.prototype._getFrozenEntryIndex = function (key) {
            for (var i = 0; i < this._frozenEntries.length; i++) {
                if (this._frozenEntries[i].key === key) {
                    return i;
                }
            }
            return -1;
        };
        WeakMap.prototype.delete = function (key) {
            if (key === undefined || key === null) {
                return false;
            }
            var entry = key[this._name];
            if (entry && entry.key === key && entry.value !== DELETED_1) {
                entry.value = DELETED_1;
                return true;
            }
            var frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                this._frozenEntries.splice(frozenIndex, 1);
                return true;
            }
            return false;
        };
        WeakMap.prototype.get = function (key) {
            if (key === undefined || key === null) {
                return undefined;
            }
            var entry = key[this._name];
            if (entry && entry.key === key && entry.value !== DELETED_1) {
                return entry.value;
            }
            var frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                return this._frozenEntries[frozenIndex].value;
            }
        };
        WeakMap.prototype.has = function (key) {
            if (key === undefined || key === null) {
                return false;
            }
            var entry = key[this._name];
            if (Boolean(entry && entry.key === key && entry.value !== DELETED_1)) {
                return true;
            }
            var frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                return true;
            }
            return false;
        };
        WeakMap.prototype.set = function (key, value) {
            if (!key || (typeof key !== 'object' && typeof key !== 'function')) {
                throw new TypeError('Invalid value used as weak map key');
            }
            var entry = key[this._name];
            if (!entry || entry.key !== key) {
                entry = Object.create(null, {
                    key: { value: key }
                });
                if (Object.isFrozen(key)) {
                    this._frozenEntries.push(entry);
                }
                else {
                    Object.defineProperty(key, this._name, {
                        value: entry
                    });
                }
            }
            entry.value = value;
            return this;
        };
        return WeakMap;
    }());
}
exports.default = exports.WeakMap;


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/array.js":
/*!****************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/array.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// !has('es6-iterator')
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var iterator_1 = __webpack_require__(/*! ./iterator */ "./node_modules/@dojo/framework/shim/iterator.js");
var has_1 = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.js");
var util_1 = __webpack_require__(/*! ./support/util */ "./node_modules/@dojo/framework/shim/support/util.js");
var toLength;
var toInteger;
var normalizeOffset;
if (!has_1.default('es6-array') || !has_1.default('es6-array-fill') || !has_1.default('es7-array')) {
    var MAX_SAFE_INTEGER_1 = Math.pow(2, 53) - 1;
    /**
     * Ensures a non-negative, non-infinite, safe integer.
     *
     * @param length The number to validate
     * @return A proper length
     */
    toLength = function toLength(length) {
        if (isNaN(length)) {
            return 0;
        }
        length = Number(length);
        if (isFinite(length)) {
            length = Math.floor(length);
        }
        // Ensure a non-negative, real, safe integer
        return Math.min(Math.max(length, 0), MAX_SAFE_INTEGER_1);
    };
    /**
     * From ES6 7.1.4 ToInteger()
     *
     * @param value A value to convert
     * @return An integer
     */
    toInteger = function toInteger(value) {
        value = Number(value);
        if (isNaN(value)) {
            return 0;
        }
        if (value === 0 || !isFinite(value)) {
            return value;
        }
        return (value > 0 ? 1 : -1) * Math.floor(Math.abs(value));
    };
    /**
     * Normalizes an offset against a given length, wrapping it if negative.
     *
     * @param value The original offset
     * @param length The total length to normalize against
     * @return If negative, provide a distance from the end (length); otherwise provide a distance from 0
     */
    normalizeOffset = function normalizeOffset(value, length) {
        return value < 0 ? Math.max(length + value, 0) : Math.min(value, length);
    };
}
if (!has_1.default('es6-array')) {
    Array.from = function from(arrayLike, mapFunction, thisArg) {
        var e_1, _a;
        if (arrayLike == null) {
            throw new TypeError('from: requires an array-like object');
        }
        if (mapFunction && thisArg) {
            mapFunction = mapFunction.bind(thisArg);
        }
        /* tslint:disable-next-line:variable-name */
        var Constructor = this;
        var length = toLength(arrayLike.length);
        // Support extension
        var array = typeof Constructor === 'function' ? Object(new Constructor(length)) : new Array(length);
        if (!iterator_1.isArrayLike(arrayLike) && !iterator_1.isIterable(arrayLike)) {
            return array;
        }
        // if this is an array and the normalized length is 0, just return an empty array. this prevents a problem
        // with the iteration on IE when using a NaN array length.
        if (iterator_1.isArrayLike(arrayLike)) {
            if (length === 0) {
                return [];
            }
            for (var i = 0; i < arrayLike.length; i++) {
                array[i] = mapFunction ? mapFunction(arrayLike[i], i) : arrayLike[i];
            }
        }
        else {
            var i = 0;
            try {
                for (var arrayLike_1 = tslib_1.__values(arrayLike), arrayLike_1_1 = arrayLike_1.next(); !arrayLike_1_1.done; arrayLike_1_1 = arrayLike_1.next()) {
                    var value = arrayLike_1_1.value;
                    array[i] = mapFunction ? mapFunction(value, i) : value;
                    i++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (arrayLike_1_1 && !arrayLike_1_1.done && (_a = arrayLike_1.return)) _a.call(arrayLike_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (arrayLike.length !== undefined) {
            array.length = length;
        }
        return array;
    };
    Array.of = function of() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return Array.prototype.slice.call(items);
    };
    Array.prototype.copyWithin = function copyWithin(offset, start, end) {
        if (this == null) {
            throw new TypeError('copyWithin: target must be an array-like object');
        }
        var length = toLength(this.length);
        offset = normalizeOffset(toInteger(offset), length);
        start = normalizeOffset(toInteger(start), length);
        end = normalizeOffset(end === undefined ? length : toInteger(end), length);
        var count = Math.min(end - start, length - offset);
        var direction = 1;
        if (offset > start && offset < start + count) {
            direction = -1;
            start += count - 1;
            offset += count - 1;
        }
        while (count > 0) {
            if (start in this) {
                this[offset] = this[start];
            }
            else {
                delete this[offset];
            }
            offset += direction;
            start += direction;
            count--;
        }
        return this;
    };
    Array.prototype.find = function find(callback, thisArg) {
        var index = this.findIndex(callback, thisArg);
        return index !== -1 ? this[index] : undefined;
    };
    Array.prototype.findIndex = function findIndex(callback, thisArg) {
        var length = toLength(this.length);
        if (!callback) {
            throw new TypeError('find: second argument must be a function');
        }
        if (thisArg) {
            callback = callback.bind(thisArg);
        }
        for (var i = 0; i < length; i++) {
            if (callback(this[i], i, this)) {
                return i;
            }
        }
        return -1;
    };
}
if (!has_1.default('es6-array-fill')) {
    Array.prototype.fill = function fill(value, start, end) {
        var length = toLength(this.length);
        var i = normalizeOffset(toInteger(start), length);
        end = normalizeOffset(end === undefined ? length : toInteger(end), length);
        while (i < (end || 0)) {
            this[i++] = value;
        }
        return this;
    };
}
if (!has_1.default('es7-array')) {
    Array.prototype.includes = function includes(searchElement, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        var len = toLength(this.length);
        for (var i = fromIndex; i < len; ++i) {
            var currentElement = this[i];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
        }
        return false;
    };
}
if (!has_1.default('es2019-array')) {
    Array.prototype.flat = function flat(depth) {
        if (depth === void 0) { depth = 1; }
        return depth > 0
            ? this.reduce(function (acc, val) { return acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val); }, [])
            : this.slice();
    };
    Array.prototype.flatMap = function flatMap(callback) {
        return this.map(callback).flat();
    };
}
exports.from = Array.from;
exports.of = Array.of;
exports.copyWithin = util_1.wrapNative(Array.prototype.copyWithin);
exports.fill = util_1.wrapNative(Array.prototype.fill);
exports.find = util_1.wrapNative(Array.prototype.find);
exports.flat = util_1.wrapNative(Array.prototype.flat);
exports.flatMap = util_1.wrapNative(Array.prototype.flatMap);
exports.findIndex = util_1.wrapNative(Array.prototype.findIndex);
exports.includes = util_1.wrapNative(Array.prototype.includes);
exports.default = Array;


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/cssVariables.js":
/*!***********************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/cssVariables.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// !has('dom-css-variables')
Object.defineProperty(exports, "__esModule", { value: true });
var cssVars = __webpack_require__(/*! css-vars-ponyfill */ "./node_modules/css-vars-ponyfill/dist/css-vars-ponyfill.esm.js");
exports.default = (typeof cssVars !== 'undefined' && typeof cssVars.default === 'function'
    ? cssVars.default
    : (function () { }));


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/iterator.js":
/*!*******************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/iterator.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// !has('es6-symbol')
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(/*! ./Symbol */ "./node_modules/@dojo/framework/shim/Symbol.js");
var string_1 = __webpack_require__(/*! ./string */ "./node_modules/@dojo/framework/shim/string.js");
var staticDone = { done: true, value: undefined };
var ShimIterator = /** @class */ (function () {
    function ShimIterator(list) {
        this._nextIndex = -1;
        if (isIterable(list)) {
            this._nativeIterator = list[Symbol.iterator]();
        }
        else {
            this._list = list;
        }
    }
    /**
     * Return the next iteration result for the Iterator
     */
    ShimIterator.prototype.next = function () {
        if (this._nativeIterator) {
            return this._nativeIterator.next();
        }
        if (!this._list) {
            return staticDone;
        }
        if (++this._nextIndex < this._list.length) {
            return {
                done: false,
                value: this._list[this._nextIndex]
            };
        }
        return staticDone;
    };
    ShimIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    return ShimIterator;
}());
exports.ShimIterator = ShimIterator;
function isIterable(value) {
    return value && typeof value[Symbol.iterator] === 'function';
}
exports.isIterable = isIterable;
function isArrayLike(value) {
    return value && typeof value.length === 'number';
}
exports.isArrayLike = isArrayLike;
function get(iterable) {
    if (isIterable(iterable)) {
        return iterable[Symbol.iterator]();
    }
    else if (isArrayLike(iterable)) {
        return new ShimIterator(iterable);
    }
}
exports.get = get;
function forOf(iterable, callback, thisArg) {
    var broken = false;
    function doBreak() {
        broken = true;
    }
    /* We need to handle iteration of double byte strings properly */
    if (isArrayLike(iterable) && typeof iterable === 'string') {
        var l = iterable.length;
        for (var i = 0; i < l; ++i) {
            var char = iterable[i];
            if (i + 1 < l) {
                var code = char.charCodeAt(0);
                if (code >= string_1.HIGH_SURROGATE_MIN && code <= string_1.HIGH_SURROGATE_MAX) {
                    char += iterable[++i];
                }
            }
            callback.call(thisArg, char, iterable, doBreak);
            if (broken) {
                return;
            }
        }
    }
    else {
        var iterator = get(iterable);
        if (iterator) {
            var result = iterator.next();
            while (!result.done) {
                callback.call(thisArg, result.value, iterable, doBreak);
                if (broken) {
                    return;
                }
                result = iterator.next();
            }
        }
    }
}
exports.forOf = forOf;


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/object.js":
/*!*****************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/object.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var has_1 = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.js");
if (!has_1.default('es6-object')) {
    var keys_1 = Object.keys.bind(Object);
    Object.keys = function symbolAwareKeys(o) {
        return keys_1(o).filter(function (key) { return !Boolean(key.match(/^@@.+/)); });
    };
    Object.assign = function assign(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        if (target == null) {
            // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        sources.forEach(function (nextSource) {
            if (nextSource) {
                // Skip over if undefined or null
                keys_1(nextSource).forEach(function (nextKey) {
                    to[nextKey] = nextSource[nextKey];
                });
            }
        });
        return to;
    };
    var getOwnPropertyNames_1 = Object.getOwnPropertyNames.bind(Object);
    Object.getOwnPropertyNames = function symbolAwareGetOwnPropertyNames(o) {
        return getOwnPropertyNames_1(o).filter(function (key) { return !Boolean(key.match(/^@@.+/)); });
    };
    Object.getOwnPropertySymbols = function getOwnPropertySymbols(o) {
        return getOwnPropertyNames_1(o)
            .filter(function (key) { return Boolean(key.match(/^@@.+/)); })
            .map(function (key) { return Symbol.for(key.substring(2)); });
    };
    Object.is = function is(value1, value2) {
        if (value1 === value2) {
            return value1 !== 0 || 1 / value1 === 1 / value2; // -0
        }
        return value1 !== value1 && value2 !== value2; // NaN
    };
}
if (!has_1.default('es2017-object')) {
    Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(o) {
        return Object.getOwnPropertyNames(o).reduce(function (previous, key) {
            previous[key] = Object.getOwnPropertyDescriptor(o, key);
            return previous;
        }, {});
    };
    Object.entries = function entries(o) {
        return exports.keys(o).map(function (key) { return [key, o[key]]; });
    };
    Object.values = function values(o) {
        return exports.keys(o).map(function (key) { return o[key]; });
    };
}
exports.assign = Object.assign;
exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
exports.getOwnPropertyNames = Object.getOwnPropertyNames;
exports.getOwnPropertySymbols = Object.getOwnPropertySymbols;
exports.is = Object.is;
exports.keys = Object.keys;
exports.getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
exports.entries = Object.entries;
exports.values = Object.values;
exports.default = Object;


/***/ }),

/***/ "./node_modules/@dojo/framework/shim/string.js":
/*!*****************************************************!*\
  !*** ./node_modules/@dojo/framework/shim/string.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var has_1 = __webpack_require__(/*! ../core/has */ "./node_modules/@dojo/framework/core/has.js");
var util_1 = __webpack_require__(/*! ./support/util */ "./node_modules/@dojo/framework/shim/support/util.js");
/**
 * The minimum location of high surrogates
 */
exports.HIGH_SURROGATE_MIN = 0xd800;
/**
 * The maximum location of high surrogates
 */
exports.HIGH_SURROGATE_MAX = 0xdbff;
/**
 * The minimum location of low surrogates
 */
exports.LOW_SURROGATE_MIN = 0xdc00;
/**
 * The maximum location of low surrogates
 */
exports.LOW_SURROGATE_MAX = 0xdfff;
if (!has_1.default('es6-string')) {
    /**
     * Validates that text is defined, and normalizes position (based on the given default if the input is NaN).
     * Used by startsWith, includes, and endsWith.
     *
     * @return Normalized position.
     */
    var normalizeSubstringArgs_1 = function (name, text, search, position, isEnd) {
        if (isEnd === void 0) { isEnd = false; }
        if (text == null) {
            throw new TypeError('string.' + name + ' requires a valid string to search against.');
        }
        var length = text.length;
        position = position !== position ? (isEnd ? length : 0) : position;
        return [text, String(search), Math.min(Math.max(position, 0), length)];
    };
    String.fromCodePoint = function fromCodePoint() {
        var codePoints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            codePoints[_i] = arguments[_i];
        }
        // Adapted from https://github.com/mathiasbynens/String.fromCodePoint
        var length = arguments.length;
        if (!length) {
            return '';
        }
        var fromCharCode = String.fromCharCode;
        var MAX_SIZE = 0x4000;
        var codeUnits = [];
        var index = -1;
        var result = '';
        while (++index < length) {
            var codePoint = Number(arguments[index]);
            // Code points must be finite integers within the valid range
            var isValid = isFinite(codePoint) && Math.floor(codePoint) === codePoint && codePoint >= 0 && codePoint <= 0x10ffff;
            if (!isValid) {
                throw RangeError('string.fromCodePoint: Invalid code point ' + codePoint);
            }
            if (codePoint <= 0xffff) {
                // BMP code point
                codeUnits.push(codePoint);
            }
            else {
                // Astral code point; split in surrogate halves
                // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                codePoint -= 0x10000;
                var highSurrogate = (codePoint >> 10) + exports.HIGH_SURROGATE_MIN;
                var lowSurrogate = (codePoint % 0x400) + exports.LOW_SURROGATE_MIN;
                codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += fromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
            }
        }
        return result;
    };
    String.prototype.codePointAt = function codePointAt(position) {
        if (position === void 0) { position = 0; }
        // Adapted from https://github.com/mathiasbynens/String.prototype.codePointAt
        if (this == null) {
            throw new TypeError('string.codePointAt requries a valid string.');
        }
        var length = this.length;
        if (position !== position) {
            position = 0;
        }
        if (position < 0 || position >= length) {
            return undefined;
        }
        // Get the first code unit
        var first = this.charCodeAt(position);
        if (first >= exports.HIGH_SURROGATE_MIN && first <= exports.HIGH_SURROGATE_MAX && length > position + 1) {
            // Start of a surrogate pair (high surrogate and there is a next code unit); check for low surrogate
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            var second = this.charCodeAt(position + 1);
            if (second >= exports.LOW_SURROGATE_MIN && second <= exports.LOW_SURROGATE_MAX) {
                return (first - exports.HIGH_SURROGATE_MIN) * 0x400 + second - exports.LOW_SURROGATE_MIN + 0x10000;
            }
        }
        return first;
    };
    String.prototype.endsWith = function endsWith(search, endPosition) {
        var _a;
        var text = this.toString();
        if (search === '') {
            return true;
        }
        if (typeof endPosition === 'undefined') {
            endPosition = text.length;
        }
        else if (endPosition === null || isNaN(endPosition)) {
            return false;
        }
        _a = tslib_1.__read(normalizeSubstringArgs_1('endsWith', text, search, endPosition, true), 3), text = _a[0], search = _a[1], endPosition = _a[2];
        var start = endPosition - search.length;
        if (start < 0) {
            return false;
        }
        return text.slice(start, endPosition) === search;
    };
    String.prototype.includes = function includes(search, position) {
        var _a;
        if (position === void 0) { position = 0; }
        var text = this.toString();
        _a = tslib_1.__read(normalizeSubstringArgs_1('includes', text, search, position), 3), text = _a[0], search = _a[1], position = _a[2];
        return text.indexOf(search, position) !== -1;
    };
    String.prototype.repeat = function repeat(count) {
        if (count === void 0) { count = 0; }
        // Adapted from https://github.com/mathiasbynens/String.prototype.repeat
        var text = this.toString();
        if (text == null) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (count !== count) {
            count = 0;
        }
        if (count < 0 || count === Infinity) {
            throw new RangeError('string.repeat requires a non-negative finite count.');
        }
        var result = '';
        while (count) {
            if (count % 2) {
                result += text;
            }
            if (count > 1) {
                text += text;
            }
            count >>= 1;
        }
        return result;
    };
    String.prototype.startsWith = function startsWith(search, position) {
        var _a;
        if (position === void 0) { position = 0; }
        var text = this.toString();
        search = String(search);
        _a = tslib_1.__read(normalizeSubstringArgs_1('startsWith', text, search, position), 3), text = _a[0], search = _a[1], position = _a[2];
        var end = position + search.length;
        if (end > text.length) {
            return false;
        }
        return text.slice(position, end) === search;
    };
}
if (!has_1.default('es6-string-raw')) {
    String.raw = function raw(callSite) {
        var substitutions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            substitutions[_i - 1] = arguments[_i];
        }
        var rawStrings = callSite.raw;
        var result = '';
        var numSubstitutions = substitutions.length;
        if (callSite == null || callSite.raw == null) {
            throw new TypeError('string.raw requires a valid callSite object with a raw value');
        }
        for (var i = 0, length_1 = rawStrings.length; i < length_1; i++) {
            result += rawStrings[i] + (i < numSubstitutions && i < length_1 - 1 ? substitutions[i] : '');
        }
        return result;
    };
}
if (!has_1.default('es2017-string')) {
    String.prototype.padEnd = function padEnd(maxLength, fillString) {
        if (fillString === void 0) { fillString = ' '; }
        if (this === null || this === undefined) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (maxLength === Infinity) {
            throw new RangeError('string.padEnd requires a non-negative finite count.');
        }
        if (maxLength === null || maxLength === undefined || maxLength < 0) {
            maxLength = 0;
        }
        var strText = String(this);
        var padding = maxLength - strText.length;
        if (padding > 0) {
            strText +=
                exports.repeat(fillString, Math.floor(padding / fillString.length)) +
                    fillString.slice(0, padding % fillString.length);
        }
        return strText;
    };
    String.prototype.padStart = function padStart(maxLength, fillString) {
        if (fillString === void 0) { fillString = ' '; }
        if (this === null || this === undefined) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (maxLength === Infinity) {
            throw new RangeError('string.padStart requires a non-negative finite count.');
        }
        if (maxLength === null || maxLength === undefined || maxLength < 0) {
            maxLength = 0;
        }
        var strText = String(this);
        var padding = maxLength - strText.length;
        if (padding > 0) {
            strText =
                exports.repeat(fillString, Math.floor(padding / fillString.length)) +
                    fillString.slice(0, padding % fillString.length) +
                    strText;
        }
        return strText;
    };
}
exports.fromCodePoint = String.fromCodePoint;
exports.raw = String.raw;
exports.codePointAt = util_1.wrapNative(String.prototype.codePointAt);
exports.endsWith = util_1.wrapNative(String.prototype.endsWith);
exports.includes = util_1.wrapNative(String.prototype.includes);
exports.normalize = util_1.wrapNative(String.prototype.normalize);
exports.repeat = util_1.wrapNative(String.prototype.repeat);
exports.startsWith = util_1.wrapNative(String.prototype.startsWith);
exports.padEnd = util_1.wrapNative(String.prototype.padEnd);
exports.padStart = util_1.wrapNative(String.prototype.padStart);
exports.default = String;


/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/promise-loader/index.js?global,src/widgets/About!./src/widgets/About.tsx":
/*!************************************************************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/promise-loader?global,src/widgets/About!./src/widgets/About.tsx ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


module.exports = function () {
	return new Promise(function (resolve) {
	__webpack_require__.e(/*! require.ensure | src/widgets/About */ "src/widgets/About").then((function (require) {
		resolve(__webpack_require__(/*! !../../node_modules/@dojo/webpack-contrib/static-build-loader??ref--8-0!../../node_modules/umd-compat-loader??ref--8-1!../../node_modules/ts-loader??ref--8-2!../../node_modules/@dojo/webpack-contrib/css-module-dts-loader?type=ts&instanceName=0_dojo!./About.tsx */ "./node_modules/@dojo/webpack-contrib/static-build-loader/index.js?!./node_modules/umd-compat-loader/index.js?!./node_modules/ts-loader/index.js?!./node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=ts&instanceName=0_dojo!./src/widgets/About.tsx"));
	}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
	});
}

/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/promise-loader/index.js?global,src/widgets/Home!./src/widgets/Home.tsx":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/promise-loader?global,src/widgets/Home!./src/widgets/Home.tsx ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


module.exports = function () {
	return new Promise(function (resolve) {
	__webpack_require__.e(/*! require.ensure | src/widgets/Home */ "src/widgets/Home").then((function (require) {
		resolve(__webpack_require__(/*! !../../node_modules/@dojo/webpack-contrib/static-build-loader??ref--8-0!../../node_modules/umd-compat-loader??ref--8-1!../../node_modules/ts-loader??ref--8-2!../../node_modules/@dojo/webpack-contrib/css-module-dts-loader?type=ts&instanceName=0_dojo!./Home.tsx */ "./node_modules/@dojo/webpack-contrib/static-build-loader/index.js?!./node_modules/umd-compat-loader/index.js?!./node_modules/ts-loader/index.js?!./node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=ts&instanceName=0_dojo!./src/widgets/Home.tsx"));
	}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
	});
}

/***/ }),

/***/ "./node_modules/@dojo/webpack-contrib/promise-loader/index.js?global,src/widgets/Profile!./src/widgets/Profile.tsx":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/@dojo/webpack-contrib/promise-loader?global,src/widgets/Profile!./src/widgets/Profile.tsx ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


module.exports = function () {
	return new Promise(function (resolve) {
	__webpack_require__.e(/*! require.ensure | src/widgets/Profile */ "src/widgets/Profile").then((function (require) {
		resolve(__webpack_require__(/*! !../../node_modules/@dojo/webpack-contrib/static-build-loader??ref--8-0!../../node_modules/umd-compat-loader??ref--8-1!../../node_modules/ts-loader??ref--8-2!../../node_modules/@dojo/webpack-contrib/css-module-dts-loader?type=ts&instanceName=0_dojo!./Profile.tsx */ "./node_modules/@dojo/webpack-contrib/static-build-loader/index.js?!./node_modules/umd-compat-loader/index.js?!./node_modules/ts-loader/index.js?!./node_modules/@dojo/webpack-contrib/css-module-dts-loader/index.js?type=ts&instanceName=0_dojo!./src/widgets/Profile.tsx"));
	}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
	});
}

/***/ }),

/***/ "./node_modules/@dojo/widgets/header/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@dojo/widgets/header/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var css = __webpack_require__(/*! ../theme/default/header.m.css */ "./node_modules/@dojo/widgets/theme/default/header.m.css.js");
var theme_1 = __webpack_require__(/*! ../middleware/theme */ "./node_modules/@dojo/widgets/middleware/theme.js");
var vdom_1 = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var factory = vdom_1.create({ theme: theme_1.default })
    .properties()
    .children();
exports.Header = factory(function Header(_a) {
    var children = _a.children, properties = _a.properties, theme = _a.middleware.theme;
    var classes = theme.classes(css);
    var sticky = properties().sticky;
    var _b = children()[0], actions = _b.actions, leading = _b.leading, title = _b.title, trailing = _b.trailing;
    return (vdom_1.tsx("header", { key: "header", classes: [theme.variant(), sticky ? classes.spacer : undefined] },
        vdom_1.tsx("div", { classes: [classes.root, sticky && classes.sticky], key: "root" },
            vdom_1.tsx("div", { classes: classes.row },
                vdom_1.tsx("div", { classes: classes.primary, key: "primary" },
                    leading && vdom_1.tsx("div", { classes: classes.leading }, leading),
                    vdom_1.tsx("div", { classes: classes.title, key: "title" }, title && title)),
                vdom_1.tsx("div", { classes: classes.secondary, key: "secondary" },
                    vdom_1.tsx("nav", { classes: classes.actions, key: "actions" }, actions &&
                        (Array.isArray(actions) ? actions : [actions]).map(function (action) { return (vdom_1.tsx("div", { classes: classes.action }, action)); })),
                    trailing && vdom_1.tsx("div", { classes: classes.trailing }, trailing))))));
});
exports.default = exports.Header;



/***/ }),

/***/ "./node_modules/@dojo/widgets/middleware/theme.js":
/*!********************************************************!*\
  !*** ./node_modules/@dojo/widgets/middleware/theme.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var vdom_1 = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var theme_1 = __webpack_require__(/*! @dojo/framework/core/middleware/theme */ "./node_modules/@dojo/framework/core/middleware/theme.js");
var factory = vdom_1.create({ coreTheme: theme_1.default });
exports.THEME_KEY = ' _key';
function uppercaseFirstChar(value) {
    return "" + value.charAt(0).toUpperCase() + value.slice(1);
}
function lowercaseFirstChar(value) {
    return "" + value.charAt(0).toLowerCase() + value.slice(1);
}
function isThemeWithVariant(theme) {
    return theme && theme.hasOwnProperty('variant');
}
exports.theme = factory(function (_a) {
    var coreTheme = _a.middleware.coreTheme, properties = _a.properties;
    return tslib_1.__assign({ compose: function (baseCss, css, prefix) {
            var _a, _b, _c, _d, _e;
            var theme = properties().theme;
            var baseKey = baseCss[exports.THEME_KEY];
            var variantKey = css[exports.THEME_KEY];
            var virtualCss = Object.keys(baseCss).reduce(function (virtualCss, key) {
                if (key === exports.THEME_KEY) {
                    return virtualCss;
                }
                if (prefix && !virtualCss["" + prefix + uppercaseFirstChar(key)]) {
                    virtualCss["" + prefix + uppercaseFirstChar(key)] = ' ';
                }
                if (!css[key]) {
                    virtualCss[key] = ' ';
                }
                return virtualCss;
            }, (_a = {}, _a[exports.THEME_KEY] = variantKey, _a));
            var virtualTheme = coreTheme.classes(virtualCss);
            var variantTheme = coreTheme.classes(css);
            var baseTheme = coreTheme.classes(baseCss);
            if (prefix) {
                var prefixedCss = Object.keys(tslib_1.__assign({}, virtualTheme, variantTheme)).reduce(function (prefixCss, key) {
                    if (key.indexOf(prefix) === 0 && key !== prefix) {
                        var classKey = lowercaseFirstChar(key.replace(prefix, ''));
                        if (!variantTheme[key] &&
                            virtualTheme[key] &&
                            virtualTheme[key].trim()) {
                            prefixCss[classKey] = baseTheme[classKey] + " " + virtualTheme[key].trim();
                        }
                        if (variantTheme[key]) {
                            prefixCss[classKey] = variantTheme[key];
                        }
                    }
                    return prefixCss;
                }, {});
                baseTheme = tslib_1.__assign({}, baseTheme, prefixedCss);
                if (isThemeWithVariant(theme)) {
                    return {
                        theme: tslib_1.__assign({}, theme.theme, (_b = {}, _b[baseKey] = baseTheme, _b)),
                        variant: theme.variant
                    };
                }
                return tslib_1.__assign({}, theme, (_c = {}, _c[baseKey] = baseTheme, _c));
            }
            var constructedTheme = Object.keys(baseTheme).reduce(function (theme, key) {
                if (key === exports.THEME_KEY) {
                    return theme;
                }
                var variantComposesClass = variantTheme[key] && variantTheme[key].trim();
                if (variantTheme[key]) {
                    theme[key] = variantComposesClass;
                }
                else if (virtualTheme[key] && virtualTheme[key].trim()) {
                    theme[key] = theme[key] + " " + virtualTheme[key].trim();
                }
                return theme;
            }, tslib_1.__assign({}, baseTheme));
            if (isThemeWithVariant(theme)) {
                return {
                    theme: tslib_1.__assign({}, theme.theme, (_d = {}, _d[baseKey] = constructedTheme, _d)),
                    variant: theme.variant
                };
            }
            return tslib_1.__assign({}, theme, (_e = {}, _e[baseKey] = constructedTheme, _e));
        } }, coreTheme);
});
exports.default = exports.theme;



/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/default/header.m.css":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/default/header.m.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/default/header.m.css.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/default/header.m.css.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/default/header.m.css */ "./node_modules/@dojo/widgets/theme/default/header.m.css");
module.exports = {" _key":"@dojo/widgets/header","root":"header-m__root__1Wu1d","row":"header-m__row__3e0zv","primary":"header-m__primary__2eL4c","secondary":"header-m__secondary__keWQu","sticky":"header-m__sticky__3Rxub","leading":"header-m__leading__EGBZf","title":"header-m__title__3AvG7","actions":"header-m__actions__3MCfn","action":"header-m__action__1tpKL","trailing":"header-m__trailing__1qern","spacer":"header-m__spacer__3HogK"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/accordion.m.css":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/accordion.m.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/accordion.m.css.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/accordion.m.css.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/accordion.m.css */ "./node_modules/@dojo/widgets/theme/dojo/accordion.m.css");
module.exports = {" _key":"@dojo/widgets/accordion","root":"accordion-m__root__Rxs8b"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/avatar.m.css":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/avatar.m.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/avatar.m.css.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/avatar.m.css.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/avatar.m.css */ "./node_modules/@dojo/widgets/theme/dojo/avatar.m.css");
module.exports = {" _key":"@dojo/widgets/avatar","root":"avatar-m__root__1VkSv","avatarColor":"avatar-m__avatarColor__3OmuK","avatarColorSecondary":"avatar-m__avatarColorSecondary__vkqqN","small":"avatar-m__small__2Tqpi","medium":"avatar-m__medium__2_v9Q","large":"avatar-m__large__1bumt","circle":"avatar-m__circle__2IbnP","square":"avatar-m__square__32U8B","rounded":"avatar-m__rounded__dtC5b"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/breadcrumb-group.m.css":
/*!**********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/breadcrumb-group.m.css ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/breadcrumb-group.m.css.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/breadcrumb-group.m.css.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/breadcrumb-group.m.css */ "./node_modules/@dojo/widgets/theme/dojo/breadcrumb-group.m.css");
module.exports = {" _key":"@dojo/widgets/breadcrumb-group","root":"breadcrumb-group-m__root__2c_G5","listItem":"breadcrumb-group-m__listItem__3N7sj"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/button.m.css":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/button.m.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/button.m.css.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/button.m.css.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/button.m.css */ "./node_modules/@dojo/widgets/theme/dojo/button.m.css");
module.exports = {" _key":"@dojo/widgets/button","root":"button-m__root__28pvq","pressed":"button-m__pressed__3sV_C","disabled":"button-m__disabled__f4Azn","label":"button-m__label__mkUVZ"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/calendar.m.css":
/*!**************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/calendar.m.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/calendar.m.css.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/calendar.m.css.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/calendar.m.css */ "./node_modules/@dojo/widgets/theme/dojo/calendar.m.css");
module.exports = {" _key":"@dojo/widgets/calendar","root":"calendar-m__root__1tLGM","dateGrid":"calendar-m__dateGrid__3Deul","weekday":"calendar-m__weekday__IVdDz","date":"calendar-m__date__2HZ0l","abbr":"calendar-m__abbr__NAXva","todayDate":"calendar-m__todayDate__1X8CM","inactiveDate":"calendar-m__inactiveDate__2Gk9b","selectedDate":"calendar-m__selectedDate__2X9KT","topMatter":"calendar-m__topMatter__3N546","monthTrigger":"calendar-m__monthTrigger__3PjRC","yearTrigger":"calendar-m__yearTrigger__iE25Z","previous":"calendar-m__previous__ScgW3","next":"calendar-m__next__3VwlS","monthTriggerActive":"calendar-m__monthTriggerActive__17804","yearTriggerActive":"calendar-m__yearTriggerActive__2SWmn","calendarPagingIcon":"calendar-m__calendarPagingIcon__EmDza icon-m__icon__2JzPg","monthGrid":"calendar-m__monthGrid__D5Viu","yearGrid":"calendar-m__yearGrid__2btl0","monthFields":"calendar-m__monthFields__25gUW","yearFields":"calendar-m__yearFields__316-R","monthRadio":"calendar-m__monthRadio__q9SIE","yearRadio":"calendar-m__yearRadio__1KTig","monthRadioLabel":"calendar-m__monthRadioLabel__1FkZH","yearRadioLabel":"calendar-m__yearRadioLabel__16Ui_","monthRadioChecked":"calendar-m__monthRadioChecked__3uX63","yearRadioChecked":"calendar-m__yearRadioChecked__SkQUn","monthRadioInput":"calendar-m__monthRadioInput__3p-Ha","yearRadioInput":"calendar-m__yearRadioInput__1jypV"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/card.m.css":
/*!**********************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/card.m.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/card.m.css.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/card.m.css.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/card.m.css */ "./node_modules/@dojo/widgets/theme/dojo/card.m.css");
module.exports = {" _key":"@dojo/widgets/card","root":"card-m__root__2O8hE","actions":"card-m__actions__16a2H","actionButtons":"card-m__actionButtons__I3DkN","actionIcons":"card-m__actionIcons__1txrb","primary":"card-m__primary__X0sgt","content":"card-m__content__1yyco","media":"card-m__media__2VVB0","mediaSquare":"card-m__mediaSquare__1V7A9","media16by9":"card-m__media16by9__2iLHJ","header":"card-m__header__294wg","titleWrapper":"card-m__titleWrapper__1vlU9","contentWrapper":"card-m__contentWrapper__2XDys","title":"card-m__title__1st_D","subtitle":"card-m__subtitle__2a3KJ"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/checkbox-group.m.css":
/*!********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/checkbox-group.m.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/checkbox-group.m.css.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/checkbox-group.m.css.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/checkbox-group.m.css */ "./node_modules/@dojo/widgets/theme/dojo/checkbox-group.m.css");
module.exports = {" _key":"@dojo/widgets/checkbox-group","root":"checkbox-group-m__root__1BVCZ","legend":"checkbox-group-m__legend__2lYxD label-m__root__2OY2Q"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/checkbox.m.css":
/*!**************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/checkbox.m.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/checkbox.m.css.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/checkbox.m.css.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/checkbox.m.css */ "./node_modules/@dojo/widgets/theme/dojo/checkbox.m.css");
module.exports = {" _key":"@dojo/widgets/checkbox","root":"checkbox-m__root__25_UT","input":"checkbox-m__input__k7une","inputWrapper":"checkbox-m__inputWrapper__J_orM icon-m__checkIcon___SgNE icon-m__icon__2JzPg","checked":"checkbox-m__checked__2GgYs","focused":"checkbox-m__focused__1ox0Y","onLabel":"checkbox-m__onLabel__2S2Uj","offLabel":"checkbox-m__offLabel__3YMm8","disabled":"checkbox-m__disabled__1rzbj","readonly":"checkbox-m__readonly__1z_i8","invalid":"checkbox-m__invalid__3uIrz","valid":"checkbox-m__valid__3n96h"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/chip-typeahead.m.css":
/*!********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/chip-typeahead.m.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/chip-typeahead.m.css.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/chip-typeahead.m.css.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/chip-typeahead.m.css */ "./node_modules/@dojo/widgets/theme/dojo/chip-typeahead.m.css");
module.exports = {" _key":"@dojo/widgets/chip-typeahead","root":"chip-typeahead-m__root__sjZeg","value":"chip-typeahead-m__value__2uqjJ","selectedIcon":"chip-typeahead-m__selectedIcon__3Y90y","input":"chip-typeahead-m__input__2EPdN","inputWrapper":"chip-typeahead-m__inputWrapper__2u6zp","values":"chip-typeahead-m__values__ebPIz"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/chip.m.css":
/*!**********************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/chip.m.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/chip.m.css.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/chip.m.css.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/chip.m.css */ "./node_modules/@dojo/widgets/theme/dojo/chip.m.css");
module.exports = {" _key":"@dojo/widgets/chip","root":"chip-m__root__38BHL","label":"chip-m__label__qUnxa","closeIcon":"chip-m__closeIcon__1SV6f","clickable":"chip-m__clickable__1N1eC","disabled":"chip-m__disabled__2k7b5"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/date-input.m.css":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/date-input.m.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/date-input.m.css.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/date-input.m.css.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/date-input.m.css */ "./node_modules/@dojo/widgets/theme/dojo/date-input.m.css");
module.exports = {" _key":"@dojo/widgets/date-input","root":"date-input-m__root__2Yzvp","input":"date-input-m__input__3TdOm","toggleCalendarButton":"date-input-m__toggleCalendarButton__3qDqH","popup":"date-input-m__popup__1ZIaA"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/dialog.m.css":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/dialog.m.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/dialog.m.css.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/dialog.m.css.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/dialog.m.css */ "./node_modules/@dojo/widgets/theme/dojo/dialog.m.css");
module.exports = {" _key":"@dojo/widgets/dialog","root":"dialog-m__root__NAZCT","main":"dialog-m__main__3spJM","underlayVisible":"dialog-m__underlayVisible__3Eqbz","title":"dialog-m__title__1P-PZ","content":"dialog-m__content__6tbsZ","close":"dialog-m__close__2sN1M","closeIcon":"dialog-m__closeIcon__3LrDH","actions":"dialog-m__actions__sY9bD"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/floating-action-button.m.css":
/*!****************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/floating-action-button.m.css ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/floating-action-button.m.css.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/floating-action-button.m.css.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/floating-action-button.m.css */ "./node_modules/@dojo/widgets/theme/dojo/floating-action-button.m.css");
module.exports = {" _key":"@dojo/widgets/floating-action-button","root":"floating-action-button-m__root__2piV7","icon":"floating-action-button-m__icon__2DAWn","extended":"floating-action-button-m__extended__2XVgZ","pressed":"floating-action-button-m__pressed__2TjQj button-m__pressed__3sV_C","label":"floating-action-button-m__label__2Cyv7 button-m__label__mkUVZ","disabled":"floating-action-button-m__disabled__1eqKe"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-body.m.css":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-body.m.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-body.m.css.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-body.m.css.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/grid-body.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-body.m.css");
module.exports = {" _key":"@dojo/widgets/grid-body","root":"grid-body-m__root__2zbEx"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-cell.m.css":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-cell.m.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-cell.m.css.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-cell.m.css.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/grid-cell.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-cell.m.css");
module.exports = {" _key":"@dojo/widgets/grid-cell","root":"grid-cell-m__root__34wXf","input":"grid-cell-m__input__2g0he","edit":"grid-cell-m__edit__3hH3_"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-footer.m.css":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-footer.m.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-footer.m.css.js":
/*!********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-footer.m.css.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/grid-footer.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-footer.m.css");
module.exports = {" _key":"@dojo/widgets/grid-footer","root":"grid-footer-m__root__3p2-L"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-header.m.css":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-header.m.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-header.m.css.js":
/*!********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-header.m.css.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/grid-header.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-header.m.css");
module.exports = {" _key":"@dojo/widgets/grid-header","root":"grid-header-m__root__HYjsh","cell":"grid-header-m__cell__2HBju","sortable":"grid-header-m__sortable__Cdm4W","sorted":"grid-header-m__sorted__280sg","sort":"grid-header-m__sort__31J7s","-webkit-filter":"grid-header-m__filter__2Yr-S","filter":"grid-header-m__filter__2Yr-S"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-paginated-footer.m.css":
/*!***************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-paginated-footer.m.css ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-paginated-footer.m.css.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-paginated-footer.m.css.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/grid-paginated-footer.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-paginated-footer.m.css");
module.exports = {" _key":"@dojo/widgets/grid-paginated-footer","root":"grid-paginated-footer-m__root__23Cev","details":"grid-paginated-footer-m__details__3Fazr","more":"grid-paginated-footer-m__more__1mDXK","pageNav":"grid-paginated-footer-m__pageNav__2afTM","pageNumber":"grid-paginated-footer-m__pageNumber__2lhSZ","active":"grid-paginated-footer-m__active__iaKed"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-placeholder-row.m.css":
/*!**************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-placeholder-row.m.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-placeholder-row.m.css.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-placeholder-row.m.css.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/grid-placeholder-row.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-placeholder-row.m.css");
module.exports = {" _key":"@dojo/widgets/grid-placeholder-row","root":"grid-placeholder-row-m__root__UivAF grid-row-m__root__NKTOq","loading":"grid-placeholder-row-m__loading__2UpDv","spin":"grid-placeholder-row-m__spin__11VRU"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-row.m.css":
/*!**************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-row.m.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid-row.m.css.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid-row.m.css.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/grid-row.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-row.m.css");
module.exports = {" _key":"@dojo/widgets/grid-row","root":"grid-row-m__root__NKTOq"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid.m.css":
/*!**********************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid.m.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/grid.m.css.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/grid.m.css.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/grid.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid.m.css");
module.exports = {" _key":"@dojo/widgets/grid","root":"grid-m__root__3e-Fb","header":"grid-m__header__Xgbwh","filterGroup":"grid-m__filterGroup__lccgY"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/header-card.m.css":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/header-card.m.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/header-card.m.css.js":
/*!********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/header-card.m.css.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/header-card.m.css */ "./node_modules/@dojo/widgets/theme/dojo/header-card.m.css");
module.exports = {" _key":"@dojo/widgets/header-card","root":"header-card-m__root__l4KKu","header":"header-card-m__header__3iFIG","headerContent":"header-card-m__headerContent__2Kz4-","avatar":"header-card-m__avatar__kU5oC","title":"header-card-m__title__3M9XE","subtitle":"header-card-m__subtitle__2o1Ge"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/header.m.css":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/header.m.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/header.m.css.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/header.m.css.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/header.m.css */ "./node_modules/@dojo/widgets/theme/dojo/header.m.css");
module.exports = {" _key":"@dojo/widgets/header","root":"header-m__root__1WDVi","row":"header-m__row__3ZCgD","primary":"header-m__primary__1cNeA","secondary":"header-m__secondary__3uElU","sticky":"header-m__sticky__1tiQe","leading":"header-m__leading__1C73V","title":"header-m__title__2xNxF","actions":"header-m__actions__3hd87","action":"header-m__action__3QPqq","trailing":"header-m__trailing__r7k1p","spacer":"header-m__spacer__1njcI"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/helper-text.m.css":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/helper-text.m.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/helper-text.m.css.js":
/*!********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/helper-text.m.css.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/helper-text.m.css */ "./node_modules/@dojo/widgets/theme/dojo/helper-text.m.css");
module.exports = {" _key":"@dojo/widgets/helper-text","root":"helper-text-m__root__2HclM","text":"helper-text-m__text__2vI1Z","valid":"helper-text-m__valid__Qigz0","invalid":"helper-text-m__invalid__zjI0U"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/icon.m.css":
/*!**********************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/icon.m.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/icon.m.css.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/icon.m.css.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/icon.m.css */ "./node_modules/@dojo/widgets/theme/dojo/icon.m.css");
module.exports = {" _key":"@dojo/widgets/icon","icon":"icon-m__icon__2JzPg","clockIcon":"icon-m__clockIcon__2S5I7","eyeIcon":"icon-m__eyeIcon__2UFzR","eyeSlashIcon":"icon-m__eyeSlashIcon__1-jQ3","plusIcon":"icon-m__plusIcon__C2hAP","minusIcon":"icon-m__minusIcon__3yz6D","checkIcon":"icon-m__checkIcon___SgNE","closeIcon":"icon-m__closeIcon__60eFq","leftIcon":"icon-m__leftIcon__86k5d","rightIcon":"icon-m__rightIcon__2jTr-","upIcon":"icon-m__upIcon__C6vkW","downIcon":"icon-m__downIcon__3YfxA","upAltIcon":"icon-m__upAltIcon__2h5Ff","downAltIcon":"icon-m__downAltIcon__1A_IX","searchIcon":"icon-m__searchIcon__1GW-J","barsIcon":"icon-m__barsIcon__33nJG","settingsIcon":"icon-m__settingsIcon__mUrFB","alertIcon":"icon-m__alertIcon__tXYqM","helpIcon":"icon-m__helpIcon__AWIZ1","infoIcon":"icon-m__infoIcon__2nM8O","cancelIcon":"icon-m__cancelIcon__1gsBL","checkedBoxIcon":"icon-m__checkedBoxIcon__31wsd","phoneIcon":"icon-m__phoneIcon__2SYAN","editIcon":"icon-m__editIcon__3z6EX","dateIcon":"icon-m__dateIcon__2Olo4","linkIcon":"icon-m__linkIcon__1NOjY","locationIcon":"icon-m__locationIcon__2MwHF","secureIcon":"icon-m__secureIcon__2AVyP","mailIcon":"icon-m__mailIcon__10-91","starIcon":"icon-m__starIcon__1FwGO"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var accordionPane = __webpack_require__(/*! ./accordion.m.css */ "./node_modules/@dojo/widgets/theme/dojo/accordion.m.css.js");
var avatar = __webpack_require__(/*! ./avatar.m.css */ "./node_modules/@dojo/widgets/theme/dojo/avatar.m.css.js");
var breadcrumbGroup = __webpack_require__(/*! ./breadcrumb-group.m.css */ "./node_modules/@dojo/widgets/theme/dojo/breadcrumb-group.m.css.js");
var button = __webpack_require__(/*! ./button.m.css */ "./node_modules/@dojo/widgets/theme/dojo/button.m.css.js");
var calendar = __webpack_require__(/*! ./calendar.m.css */ "./node_modules/@dojo/widgets/theme/dojo/calendar.m.css.js");
var card = __webpack_require__(/*! ./card.m.css */ "./node_modules/@dojo/widgets/theme/dojo/card.m.css.js");
var checkboxGroup = __webpack_require__(/*! ./checkbox-group.m.css */ "./node_modules/@dojo/widgets/theme/dojo/checkbox-group.m.css.js");
var checkbox = __webpack_require__(/*! ./checkbox.m.css */ "./node_modules/@dojo/widgets/theme/dojo/checkbox.m.css.js");
var chip = __webpack_require__(/*! ./chip.m.css */ "./node_modules/@dojo/widgets/theme/dojo/chip.m.css.js");
var dateInput = __webpack_require__(/*! ./date-input.m.css */ "./node_modules/@dojo/widgets/theme/dojo/date-input.m.css.js");
var dialog = __webpack_require__(/*! ./dialog.m.css */ "./node_modules/@dojo/widgets/theme/dojo/dialog.m.css.js");
var floatingActionButton = __webpack_require__(/*! ./floating-action-button.m.css */ "./node_modules/@dojo/widgets/theme/dojo/floating-action-button.m.css.js");
var grid = __webpack_require__(/*! ./grid.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid.m.css.js");
var gridBody = __webpack_require__(/*! ./grid-body.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-body.m.css.js");
var gridCell = __webpack_require__(/*! ./grid-cell.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-cell.m.css.js");
var gridFooter = __webpack_require__(/*! ./grid-footer.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-footer.m.css.js");
var gridHeader = __webpack_require__(/*! ./grid-header.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-header.m.css.js");
var gridPlaceholderRow = __webpack_require__(/*! ./grid-placeholder-row.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-placeholder-row.m.css.js");
var gridPaginatedFooter = __webpack_require__(/*! ./grid-paginated-footer.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-paginated-footer.m.css.js");
var gridRow = __webpack_require__(/*! ./grid-row.m.css */ "./node_modules/@dojo/widgets/theme/dojo/grid-row.m.css.js");
var headerCard = __webpack_require__(/*! ./header-card.m.css */ "./node_modules/@dojo/widgets/theme/dojo/header-card.m.css.js");
var header = __webpack_require__(/*! ./header.m.css */ "./node_modules/@dojo/widgets/theme/dojo/header.m.css.js");
var helperText = __webpack_require__(/*! ./helper-text.m.css */ "./node_modules/@dojo/widgets/theme/dojo/helper-text.m.css.js");
var icon = __webpack_require__(/*! ./icon.m.css */ "./node_modules/@dojo/widgets/theme/dojo/icon.m.css.js");
var label = __webpack_require__(/*! ./label.m.css */ "./node_modules/@dojo/widgets/theme/dojo/label.m.css.js");
var listItem = __webpack_require__(/*! ./list-item.m.css */ "./node_modules/@dojo/widgets/theme/dojo/list-item.m.css.js");
var loadingIndicator = __webpack_require__(/*! ./loading-indicator.m.css */ "./node_modules/@dojo/widgets/theme/dojo/loading-indicator.m.css.js");
var list = __webpack_require__(/*! ./list.m.css */ "./node_modules/@dojo/widgets/theme/dojo/list.m.css.js");
var menuItem = __webpack_require__(/*! ./menu-item.m.css */ "./node_modules/@dojo/widgets/theme/dojo/menu-item.m.css.js");
var chipTypeahead = __webpack_require__(/*! ./chip-typeahead.m.css */ "./node_modules/@dojo/widgets/theme/dojo/chip-typeahead.m.css.js");
var outlinedButton = __webpack_require__(/*! ./outlined-button.m.css */ "./node_modules/@dojo/widgets/theme/dojo/outlined-button.m.css.js");
var nativeSelect = __webpack_require__(/*! ./native-select.m.css */ "./node_modules/@dojo/widgets/theme/dojo/native-select.m.css.js");
var pagination = __webpack_require__(/*! ./pagination.m.css */ "./node_modules/@dojo/widgets/theme/dojo/pagination.m.css.js");
var passwordInput = __webpack_require__(/*! ./password-input.m.css */ "./node_modules/@dojo/widgets/theme/dojo/password-input.m.css.js");
var progress = __webpack_require__(/*! ./progress.m.css */ "./node_modules/@dojo/widgets/theme/dojo/progress.m.css.js");
var radioGroup = __webpack_require__(/*! ./radio-group.m.css */ "./node_modules/@dojo/widgets/theme/dojo/radio-group.m.css.js");
var radio = __webpack_require__(/*! ./radio.m.css */ "./node_modules/@dojo/widgets/theme/dojo/radio.m.css.js");
var raisedButton = __webpack_require__(/*! ./raised-button.m.css */ "./node_modules/@dojo/widgets/theme/dojo/raised-button.m.css.js");
var rangeSlider = __webpack_require__(/*! ./range-slider.m.css */ "./node_modules/@dojo/widgets/theme/dojo/range-slider.m.css.js");
var result = __webpack_require__(/*! ./result.m.css */ "./node_modules/@dojo/widgets/theme/dojo/result.m.css.js");
var select = __webpack_require__(/*! ./select.m.css */ "./node_modules/@dojo/widgets/theme/dojo/select.m.css.js");
var slidePane = __webpack_require__(/*! ./slide-pane.m.css */ "./node_modules/@dojo/widgets/theme/dojo/slide-pane.m.css.js");
var slider = __webpack_require__(/*! ./slider.m.css */ "./node_modules/@dojo/widgets/theme/dojo/slider.m.css.js");
var snackbar = __webpack_require__(/*! ./snackbar.m.css */ "./node_modules/@dojo/widgets/theme/dojo/snackbar.m.css.js");
var switchControl = __webpack_require__(/*! ./switch.m.css */ "./node_modules/@dojo/widgets/theme/dojo/switch.m.css.js");
var tabContainer = __webpack_require__(/*! ./tab-container.m.css */ "./node_modules/@dojo/widgets/theme/dojo/tab-container.m.css.js");
var textArea = __webpack_require__(/*! ./text-area.m.css */ "./node_modules/@dojo/widgets/theme/dojo/text-area.m.css.js");
var textInput = __webpack_require__(/*! ./text-input.m.css */ "./node_modules/@dojo/widgets/theme/dojo/text-input.m.css.js");
var threeColumnLayout = __webpack_require__(/*! ./three-column-layout.m.css */ "./node_modules/@dojo/widgets/theme/dojo/three-column-layout.m.css.js");
var timePicker = __webpack_require__(/*! ./time-picker.m.css */ "./node_modules/@dojo/widgets/theme/dojo/time-picker.m.css.js");
var titlePane = __webpack_require__(/*! ./title-pane.m.css */ "./node_modules/@dojo/widgets/theme/dojo/title-pane.m.css.js");
var tooltip = __webpack_require__(/*! ./tooltip.m.css */ "./node_modules/@dojo/widgets/theme/dojo/tooltip.m.css.js");
var twoColumnLayout = __webpack_require__(/*! ./two-column-layout.m.css */ "./node_modules/@dojo/widgets/theme/dojo/two-column-layout.m.css.js");
var typeahead = __webpack_require__(/*! ./typeahead.m.css */ "./node_modules/@dojo/widgets/theme/dojo/typeahead.m.css.js");
var defaultVariant = __webpack_require__(/*! ./variants/default.m.css */ "./node_modules/@dojo/widgets/theme/dojo/variants/default.m.css.js");
var darkVariant = __webpack_require__(/*! ./variants/dark.m.css */ "./node_modules/@dojo/widgets/theme/dojo/variants/dark.m.css.js");
exports.default = {
    theme: {
        '@dojo/widgets/accordion': accordionPane,
        '@dojo/widgets/avatar': avatar,
        '@dojo/widgets/breadcrumb-group': breadcrumbGroup,
        '@dojo/widgets/button': button,
        '@dojo/widgets/calendar': calendar,
        '@dojo/widgets/card': card,
        '@dojo/widgets/checkbox-group': checkboxGroup,
        '@dojo/widgets/checkbox': checkbox,
        '@dojo/widgets/chip': chip,
        '@dojo/widgets/date-input': dateInput,
        '@dojo/widgets/dialog': dialog,
        '@dojo/widgets/floating-action-button': floatingActionButton,
        '@dojo/widgets/grid-body': gridBody,
        '@dojo/widgets/grid-cell': gridCell,
        '@dojo/widgets/grid-footer': gridFooter,
        '@dojo/widgets/grid-header': gridHeader,
        '@dojo/widgets/grid-placeholder-row': gridPlaceholderRow,
        '@dojo/widgets/grid-paginated-footer': gridPaginatedFooter,
        '@dojo/widgets/grid-row': gridRow,
        '@dojo/widgets/grid': grid,
        '@dojo/widgets/header-card': headerCard,
        '@dojo/widgets/header': header,
        '@dojo/widgets/helper-text': helperText,
        '@dojo/widgets/icon': icon,
        '@dojo/widgets/label': label,
        '@dojo/widgets/list-item': listItem,
        '@dojo/widgets/loading-indicator': loadingIndicator,
        '@dojo/widgets/menu-item': menuItem,
        '@dojo/widgets/chip-typeahead': chipTypeahead,
        '@dojo/widgets/list': list,
        '@dojo/widgets/outlined-button': outlinedButton,
        '@dojo/widgets/native-select': nativeSelect,
        '@dojo/widgets/pagination': pagination,
        '@dojo/widgets/password-input': passwordInput,
        '@dojo/widgets/progress': progress,
        '@dojo/widgets/radio-group': radioGroup,
        '@dojo/widgets/radio': radio,
        '@dojo/widgets/raised-button': raisedButton,
        '@dojo/widgets/range-slider': rangeSlider,
        '@dojo/widgets/result': result,
        '@dojo/widgets/select': select,
        '@dojo/widgets/slide-pane': slidePane,
        '@dojo/widgets/slider': slider,
        '@dojo/widgets/snackbar': snackbar,
        '@dojo/widgets/switch': switchControl,
        '@dojo/widgets/tab-container': tabContainer,
        '@dojo/widgets/text-area': textArea,
        '@dojo/widgets/text-input': textInput,
        '@dojo/widgets/three-column-layout': threeColumnLayout,
        '@dojo/widgets/time-picker': timePicker,
        '@dojo/widgets/title-pane': titlePane,
        '@dojo/widgets/tooltip': tooltip,
        '@dojo/widgets/two-column-layout': twoColumnLayout,
        '@dojo/widgets/typeahead': typeahead
    },
    variants: {
        default: defaultVariant,
        dark: darkVariant
    }
};



/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/label.m.css":
/*!***********************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/label.m.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/label.m.css.js":
/*!**************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/label.m.css.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/label.m.css */ "./node_modules/@dojo/widgets/theme/dojo/label.m.css");
module.exports = {" _key":"@dojo/widgets/label","root":"label-m__root__2OY2Q","secondary":"label-m__secondary__2JgjM","required":"label-m__required__2p83z"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/list-item.m.css":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/list-item.m.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/list-item.m.css.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/list-item.m.css.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/list-item.m.css */ "./node_modules/@dojo/widgets/theme/dojo/list-item.m.css");
module.exports = {" _key":"@dojo/widgets/list-item","root":"list-item-m__root__dUG_o","active":"list-item-m__active__3tRcp","selected":"list-item-m__selected__1sHW5","disabled":"list-item-m__disabled__3VhQD"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/list.m.css":
/*!**********************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/list.m.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/list.m.css.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/list.m.css.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/list.m.css */ "./node_modules/@dojo/widgets/theme/dojo/list.m.css");
module.exports = {" _key":"@dojo/widgets/list","root":"list-m__root__3ee5s","menu":"list-m__menu___jE2c","divider":"list-m__divider__2pf5q"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/loading-indicator.m.css":
/*!***********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/loading-indicator.m.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/loading-indicator.m.css.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/loading-indicator.m.css.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/loading-indicator.m.css */ "./node_modules/@dojo/widgets/theme/dojo/loading-indicator.m.css");
module.exports = {" _key":"@dojo/widgets/loading-indicator","root":"loading-indicator-m__root__1S_Do","buffer":"loading-indicator-m__buffer__2N8zx","bar":"loading-indicator-m__bar__2QYHV","primary":"loading-indicator-m__primary__1OxUO","progress":"loading-indicator-m__progress__EoLqt","inner":"loading-indicator-m__inner__3GTa2"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/menu-item.m.css":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/menu-item.m.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/menu-item.m.css.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/menu-item.m.css.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/menu-item.m.css */ "./node_modules/@dojo/widgets/theme/dojo/menu-item.m.css");
module.exports = {" _key":"@dojo/widgets/menu-item","root":"menu-item-m__root__1HFs_","active":"menu-item-m__active__2iRtR"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/native-select.m.css":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/native-select.m.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/native-select.m.css.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/native-select.m.css.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/native-select.m.css */ "./node_modules/@dojo/widgets/theme/dojo/native-select.m.css");
module.exports = {" _key":"@dojo/widgets/native-select","root":"native-select-m__root__2A2KN","inputWrapper":"native-select-m__inputWrapper__3v5as","select":"native-select-m__select__7f8t5","arrow":"native-select-m__arrow__3m49y","disabled":"native-select-m__disabled__1TaDk"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/outlined-button.m.css":
/*!*********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/outlined-button.m.css ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/outlined-button.m.css.js":
/*!************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/outlined-button.m.css.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/outlined-button.m.css */ "./node_modules/@dojo/widgets/theme/dojo/outlined-button.m.css");
module.exports = {" _key":"@dojo/widgets/outlined-button","root":"outlined-button-m__root__1j7qa","pressed":"outlined-button-m__pressed__2iuy5","label":"outlined-button-m__label__SD9Eo","disabled":"outlined-button-m__disabled__3POiK"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/pagination.m.css":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/pagination.m.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/pagination.m.css.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/pagination.m.css.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/pagination.m.css */ "./node_modules/@dojo/widgets/theme/dojo/pagination.m.css");
module.exports = {" _key":"@dojo/widgets/pagination","root":"pagination-m__root__L7VlA","linksWrapper":"pagination-m__linksWrapper__2jtOw","prev":"pagination-m__prev__vFB9g","next":"pagination-m__next__xfQUm","icon":"pagination-m__icon__31lQc","label":"pagination-m__label__HE0yp","link":"pagination-m__link__3db0U","currentPage":"pagination-m__currentPage__InwXB","selectWrapper":"pagination-m__selectWrapper__3vqQT"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/password-input.m.css":
/*!********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/password-input.m.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/password-input.m.css.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/password-input.m.css.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/password-input.m.css */ "./node_modules/@dojo/widgets/theme/dojo/password-input.m.css");
module.exports = {" _key":"@dojo/widgets/password-input","root":"password-input-m__root__gH-Hk text-input-m__root__2yKLO","toggleButton":"password-input-m__toggleButton__3vybc"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/progress.m.css":
/*!**************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/progress.m.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/progress.m.css.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/progress.m.css.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/progress.m.css */ "./node_modules/@dojo/widgets/theme/dojo/progress.m.css");
module.exports = {" _key":"@dojo/widgets/progress","root":"progress-m__root__2XHXH","output":"progress-m__output__vKJw-","bar":"progress-m__bar__sB2fc","progress":"progress-m__progress__2V0hS"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/radio-group.m.css":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/radio-group.m.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/radio-group.m.css.js":
/*!********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/radio-group.m.css.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/radio-group.m.css */ "./node_modules/@dojo/widgets/theme/dojo/radio-group.m.css");
module.exports = {" _key":"@dojo/widgets/radio-group","root":"radio-group-m__root__3VCTl","legend":"radio-group-m__legend__ZiCRP"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/radio.m.css":
/*!***********************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/radio.m.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/radio.m.css.js":
/*!**************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/radio.m.css.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/radio.m.css */ "./node_modules/@dojo/widgets/theme/dojo/radio.m.css");
module.exports = {" _key":"@dojo/widgets/radio","root":"radio-m__root__VefZS","input":"radio-m__input__3HytW","inputWrapper":"radio-m__inputWrapper__1Zous","radioBackground":"radio-m__radioBackground__8HvZ0","radioOuter":"radio-m__radioOuter__2v-Zg","radioInner":"radio-m__radioInner__3f5tV","focused":"radio-m__focused__3nJo1","checked":"radio-m__checked__2yRzd","disabled":"radio-m__disabled__B3g_v","readonly":"radio-m__readonly__5rLlH","invalid":"radio-m__invalid__EfJNI","valid":"radio-m__valid__1-Pzb"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/raised-button.m.css":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/raised-button.m.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/raised-button.m.css.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/raised-button.m.css.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/raised-button.m.css */ "./node_modules/@dojo/widgets/theme/dojo/raised-button.m.css");
module.exports = {" _key":"@dojo/widgets/raised-button","root":"raised-button-m__root__8rmm4","pressed":"raised-button-m__pressed__3Yr5d","label":"raised-button-m__label__3lT-j","disabled":"raised-button-m__disabled__1M-Lp"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/range-slider.m.css":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/range-slider.m.css ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/range-slider.m.css.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/range-slider.m.css.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/range-slider.m.css */ "./node_modules/@dojo/widgets/theme/dojo/range-slider.m.css");
module.exports = {" _key":"@dojo/widgets/range-slider","root":"range-slider-m__root__104A-","inputWrapper":"range-slider-m__inputWrapper__lTUjE","filled":"range-slider-m__filled__XRsjH","thumb":"range-slider-m__thumb__qHz5U","input":"range-slider-m__input__3dB_q","focused":"range-slider-m__focused__355WG","hasOutput":"range-slider-m__hasOutput__3mwgj","outputTooltip":"range-slider-m__outputTooltip__2RQbx","output":"range-slider-m__output__2IwRP","disabled":"range-slider-m__disabled__3wxJ-","readonly":"range-slider-m__readonly__2W81l","invalid":"range-slider-m__invalid__3jnT9"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/result.m.css":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/result.m.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/result.m.css.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/result.m.css.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/result.m.css */ "./node_modules/@dojo/widgets/theme/dojo/result.m.css");
module.exports = {" _key":"@dojo/widgets/result","root":"result-m__root__1s4Al","iconWrapper":"result-m__iconWrapper__1nmlS","statusIcon":"result-m__statusIcon__3PF2C","iconIcon":"result-m__iconIcon__Nu6vI icon-m__icon__2JzPg","actions":"result-m__actions__22GMb","actionButtons":"result-m__actionButtons__1epeV","contentWrapper":"result-m__contentWrapper__2esbQ","content":"result-m__content__3eBjD","titleWrapper":"result-m__titleWrapper__EmGbs","title":"result-m__title__1yfPE","subtitle":"result-m__subtitle__3e_ij","alert":"result-m__alert__3NSTh","error":"result-m__error__1KZCT","info":"result-m__info__2T1qW","success":"result-m__success__3deJM"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/select.m.css":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/select.m.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/select.m.css.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/select.m.css.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/select.m.css */ "./node_modules/@dojo/widgets/theme/dojo/select.m.css");
module.exports = {" _key":"@dojo/widgets/select","root":"select-m__root__vSQDW","trigger":"select-m__trigger__cQJRQ","value":"select-m__value__9wfTg","placeholder":"select-m__placeholder__2UlZ1","arrow":"select-m__arrow__3p83i","menuWrapper":"select-m__menuWrapper__OePaS","disabled":"select-m__disabled__3zDEP","readonly":"select-m__readonly__3yUii","invalid":"select-m__invalid__2G3mI","valid":"select-m__valid__3Kr6J"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/slide-pane.m.css":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/slide-pane.m.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/slide-pane.m.css.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/slide-pane.m.css.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/slide-pane.m.css */ "./node_modules/@dojo/widgets/theme/dojo/slide-pane.m.css");
module.exports = {" _key":"@dojo/widgets/slide-pane","root":"slide-pane-m__root__2TQzV","underlayVisible":"slide-pane-m__underlayVisible__2dXLD","pane":"slide-pane-m__pane__2_qpl","content":"slide-pane-m__content__3B7wz","title":"slide-pane-m__title__2Dwsi","close":"slide-pane-m__close__2Tp8H","closeIcon":"slide-pane-m__closeIcon__2mfZI","left":"slide-pane-m__left__3pSsl","right":"slide-pane-m__right__1qBIY","top":"slide-pane-m__top__2Ouqt","bottom":"slide-pane-m__bottom__2Wm48","slideIn":"slide-pane-m__slideIn__QKvGX","slideOut":"slide-pane-m__slideOut__3C58O"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/slider.m.css":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/slider.m.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/slider.m.css.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/slider.m.css.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/slider.m.css */ "./node_modules/@dojo/widgets/theme/dojo/slider.m.css");
module.exports = {" _key":"@dojo/widgets/slider","root":"slider-m__root__1fQ-Q","inputWrapper":"slider-m__inputWrapper__1HBJS","track":"slider-m__track__2DGhE","fill":"slider-m__fill__4FdQ9","thumb":"slider-m__thumb__26xCj","input":"slider-m__input__2DrOc","outputTooltip":"slider-m__outputTooltip__yLzFO","output":"slider-m__output__KwPnR","vertical":"slider-m__vertical__1lBx-","disabled":"slider-m__disabled__LideH","readonly":"slider-m__readonly__14OUb","invalid":"slider-m__invalid__2uaAc","valid":"slider-m__valid__1F6U5"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/snackbar.m.css":
/*!**************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/snackbar.m.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/snackbar.m.css.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/snackbar.m.css.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/snackbar.m.css */ "./node_modules/@dojo/widgets/theme/dojo/snackbar.m.css");
module.exports = {" _key":"@dojo/widgets/snackbar","root":"snackbar-m__root__3DYwa","content":"snackbar-m__content__2dPUv","label":"snackbar-m__label__D1Lkn","actions":"snackbar-m__actions__fQHb6","open":"snackbar-m__open__1trii","success":"snackbar-m__success__FTGZN","error":"snackbar-m__error__1sGDA","leading":"snackbar-m__leading__342U0","stacked":"snackbar-m__stacked__1Wgqe"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/switch.m.css":
/*!************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/switch.m.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/switch.m.css.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/switch.m.css.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/switch.m.css */ "./node_modules/@dojo/widgets/theme/dojo/switch.m.css");
module.exports = {" _key":"@dojo/widgets/switch","root":"switch-m__root__1GFoq","inputWrapper":"switch-m__inputWrapper__37KNw","label":"switch-m__label__2IMGM","thumb":"switch-m__thumb__3xB-N","track":"switch-m__track__1U4WH","underlay":"switch-m__underlay__1_0bA","nativeControl":"switch-m__nativeControl__3isSL","checked":"switch-m__checked__o1Lvq","disabled":"switch-m__disabled__1Mmee","readonly":"switch-m__readonly__o78hN","focused":"switch-m__focused__w-VpX","offLabel":"switch-m__offLabel__2b7ED","onLabel":"switch-m__onLabel__2nH4q"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/tab-container.m.css":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/tab-container.m.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/tab-container.m.css.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/tab-container.m.css.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/tab-container.m.css */ "./node_modules/@dojo/widgets/theme/dojo/tab-container.m.css");
module.exports = {" _key":"@dojo/widgets/tab-container","root":"tab-container-m__root__3r_9I","tabButtons":"tab-container-m__tabButtons__3D03V","tabButton":"tab-container-m__tabButton__1Rtmj","disabledTabButton":"tab-container-m__disabledTabButton__-3pyN","activeTabButton":"tab-container-m__activeTabButton__3O1dt","close":"tab-container-m__close__2R550","closeable":"tab-container-m__closeable__2ZpGe","tab":"tab-container-m__tab__14Gr-","alignLeft":"tab-container-m__alignLeft__3uIbQ","tabs":"tab-container-m__tabs__2dU3y","alignRight":"tab-container-m__alignRight__NCc1f","alignBottom":"tab-container-m__alignBottom__3hOao"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/text-area.m.css":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/text-area.m.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/text-area.m.css.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/text-area.m.css.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/text-area.m.css */ "./node_modules/@dojo/widgets/theme/dojo/text-area.m.css");
module.exports = {" _key":"@dojo/widgets/text-area","root":"text-area-m__root__2NVkd","input":"text-area-m__input__Vx3AV","disabled":"text-area-m__disabled__ZjqlP","readonly":"text-area-m__readonly__3NoH6","invalid":"text-area-m__invalid__3Z9ZA","valid":"text-area-m__valid__2mAxH"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/text-input.m.css":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/text-input.m.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/text-input.m.css.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/text-input.m.css.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/text-input.m.css */ "./node_modules/@dojo/widgets/theme/dojo/text-input.m.css");
module.exports = {" _key":"@dojo/widgets/text-input","root":"text-input-m__root__2yKLO","wrapper":"text-input-m__wrapper__2yH16","input":"text-input-m__input__2OqON","inputWrapper":"text-input-m__inputWrapper__Bf3IL","focused":"text-input-m__focused__Bz5Ku","disabled":"text-input-m__disabled__1KyyV","readonly":"text-input-m__readonly__2dMQl","invalid":"text-input-m__invalid__wejhD","valid":"text-input-m__valid__2CP3A","addonRoot":"text-input-m__addonRoot__DQCsb","addonFilled":"text-input-m__addonFilled__18Yy8"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/three-column-layout.m.css":
/*!*************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/three-column-layout.m.css ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/three-column-layout.m.css.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/three-column-layout.m.css.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/three-column-layout.m.css */ "./node_modules/@dojo/widgets/theme/dojo/three-column-layout.m.css");
module.exports = {" _key":"@dojo/widgets/three-column-layout","leading":"three-column-layout-m__leading__10E32","trailing":"three-column-layout-m__trailing__1__Yd"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/time-picker.m.css":
/*!*****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/time-picker.m.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/time-picker.m.css.js":
/*!********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/time-picker.m.css.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/time-picker.m.css */ "./node_modules/@dojo/widgets/theme/dojo/time-picker.m.css");
module.exports = {" _key":"@dojo/widgets/time-picker","root":"time-picker-m__root__2uRZv","input":"time-picker-m__input__3e4IV","toggleMenuButton":"time-picker-m__toggleMenuButton__1eb2P","popup":"time-picker-m__popup__3ANpm"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/title-pane.m.css":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/title-pane.m.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/title-pane.m.css.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/title-pane.m.css.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/title-pane.m.css */ "./node_modules/@dojo/widgets/theme/dojo/title-pane.m.css");
module.exports = {" _key":"@dojo/widgets/title-pane","root":"title-pane-m__root__1cmLi","titleButton":"title-pane-m__titleButton__hMwuO","content":"title-pane-m__content__33Ft6","contentTransition":"title-pane-m__contentTransition__1GWDf","open":"title-pane-m__open__2GqTv","arrow":"title-pane-m__arrow__1RFCq"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/tooltip.m.css":
/*!*************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/tooltip.m.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/tooltip.m.css.js":
/*!****************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/tooltip.m.css.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/tooltip.m.css */ "./node_modules/@dojo/widgets/theme/dojo/tooltip.m.css");
module.exports = {" _key":"@dojo/widgets/tooltip","root":"tooltip-m__root__1j6Iv","content":"tooltip-m__content__1N9s1","bottom":"tooltip-m__bottom__2dGm7","top":"tooltip-m__top__2QOyL","left":"tooltip-m__left__2vQ3o","right":"tooltip-m__right__j1o47"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/two-column-layout.m.css":
/*!***********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/two-column-layout.m.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/two-column-layout.m.css.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/two-column-layout.m.css.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/two-column-layout.m.css */ "./node_modules/@dojo/widgets/theme/dojo/two-column-layout.m.css");
module.exports = {" _key":"@dojo/widgets/two-column-layout","small":"two-column-layout-m__small__2sTw2"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/typeahead.m.css":
/*!***************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/typeahead.m.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/typeahead.m.css.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/typeahead.m.css.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/typeahead.m.css */ "./node_modules/@dojo/widgets/theme/dojo/typeahead.m.css");
module.exports = {" _key":"@dojo/widgets/typeahead","root":"typeahead-m__root__2Em3D","triggerWrapper":"typeahead-m__triggerWrapper__3ijZT"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/variants/dark.m.css":
/*!*******************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/variants/dark.m.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/variants/dark.m.css.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/variants/dark.m.css.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/variants/dark.m.css */ "./node_modules/@dojo/widgets/theme/dojo/variants/dark.m.css");
module.exports = {" _key":"@dojo/widgets/dark","root":"dark-m__root__36GXf"};;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/variants/default.m.css":
/*!**********************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/variants/default.m.css ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/dojo/variants/default.m.css.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@dojo/widgets/theme/dojo/variants/default.m.css.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./node_modules/@dojo/widgets/theme/dojo/variants/default.m.css */ "./node_modules/@dojo/widgets/theme/dojo/variants/default.m.css");
module.exports = {" _key":"@dojo/widgets/default","root":"default-m__root__1h1rO"};;

/***/ }),

/***/ "./node_modules/css-vars-ponyfill/dist/css-vars-ponyfill.esm.js":
/*!**********************************************************************!*\
  !*** ./node_modules/css-vars-ponyfill/dist/css-vars-ponyfill.esm.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*!
 * css-vars-ponyfill
 * v2.3.0
 * https://jhildenbiddle.github.io/css-vars-ponyfill/
 * (c) 2018-2020 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
function _extends() {
    _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/*!
 * get-css-data
 * v1.8.0
 * https://github.com/jhildenbiddle/get-css-data
 * (c) 2018-2020 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */ function getUrls(urls) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var settings = {
        mimeType: options.mimeType || null,
        onBeforeSend: options.onBeforeSend || Function.prototype,
        onSuccess: options.onSuccess || Function.prototype,
        onError: options.onError || Function.prototype,
        onComplete: options.onComplete || Function.prototype
    };
    var urlArray = Array.isArray(urls) ? urls : [ urls ];
    var urlQueue = Array.apply(null, Array(urlArray.length)).map((function(x) {
        return null;
    }));
    function isValidCss() {
        var cssText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var isHTML = cssText.trim().charAt(0) === "<";
        return !isHTML;
    }
    function onError(xhr, urlIndex) {
        settings.onError(xhr, urlArray[urlIndex], urlIndex);
    }
    function onSuccess(responseText, urlIndex) {
        var returnVal = settings.onSuccess(responseText, urlArray[urlIndex], urlIndex);
        responseText = returnVal === false ? "" : returnVal || responseText;
        urlQueue[urlIndex] = responseText;
        if (urlQueue.indexOf(null) === -1) {
            settings.onComplete(urlQueue);
        }
    }
    var parser = document.createElement("a");
    urlArray.forEach((function(url, i) {
        parser.setAttribute("href", url);
        parser.href = String(parser.href);
        var isIElte9 = Boolean(document.all && !window.atob);
        var isIElte9CORS = isIElte9 && parser.host.split(":")[0] !== location.host.split(":")[0];
        if (isIElte9CORS) {
            var isSameProtocol = parser.protocol === location.protocol;
            if (isSameProtocol) {
                var xdr = new XDomainRequest;
                xdr.open("GET", url);
                xdr.timeout = 0;
                xdr.onprogress = Function.prototype;
                xdr.ontimeout = Function.prototype;
                xdr.onload = function() {
                    if (isValidCss(xdr.responseText)) {
                        onSuccess(xdr.responseText, i);
                    } else {
                        onError(xdr, i);
                    }
                };
                xdr.onerror = function(err) {
                    onError(xdr, i);
                };
                setTimeout((function() {
                    xdr.send();
                }), 0);
            } else {
                console.warn("Internet Explorer 9 Cross-Origin (CORS) requests must use the same protocol (".concat(url, ")"));
                onError(null, i);
            }
        } else {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url);
            if (settings.mimeType && xhr.overrideMimeType) {
                xhr.overrideMimeType(settings.mimeType);
            }
            settings.onBeforeSend(xhr, url, i);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 && isValidCss(xhr.responseText)) {
                        onSuccess(xhr.responseText, i);
                    } else {
                        onError(xhr, i);
                    }
                }
            };
            xhr.send();
        }
    }));
}

/**
 * Gets CSS data from <style> and <link> nodes (including @imports), then
 * returns data in order processed by DOM. Allows specifying nodes to
 * include/exclude and filtering CSS data using RegEx.
 *
 * @preserve
 * @param {object}   [options] The options object
 * @param {object}   [options.rootElement=document] Root element to traverse for
 *                   <link> and <style> nodes.
 * @param {string}   [options.include] CSS selector matching <link> and <style>
 *                   nodes to include
 * @param {string}   [options.exclude] CSS selector matching <link> and <style>
 *                   nodes to exclude
 * @param {object}   [options.filter] Regular expression used to filter node CSS
 *                   data. Each block of CSS data is tested against the filter,
 *                   and only matching data is included.
 * @param {boolean}  [options.skipDisabled=true] Determines if disabled
 *                   stylesheets will be skipped while collecting CSS data.
 * @param {boolean}  [options.useCSSOM=false] Determines if CSS data will be
 *                   collected from a stylesheet's runtime values instead of its
 *                   text content. This is required to get accurate CSS data
 *                   when a stylesheet has been modified using the deleteRule()
 *                   or insertRule() methods because these modifications will
 *                   not be reflected in the stylesheet's text content.
 * @param {function} [options.onBeforeSend] Callback before XHR is sent. Passes
 *                   1) the XHR object, 2) source node reference, and 3) the
 *                   source URL as arguments.
 * @param {function} [options.onSuccess] Callback on each CSS node read. Passes
 *                   1) CSS text, 2) source node reference, and 3) the source
 *                   URL as arguments.
 * @param {function} [options.onError] Callback on each error. Passes 1) the XHR
 *                   object for inspection, 2) soure node reference, and 3) the
 *                   source URL that failed (either a <link> href or an @import)
 *                   as arguments
 * @param {function} [options.onComplete] Callback after all nodes have been
 *                   processed. Passes 1) concatenated CSS text, 2) an array of
 *                   CSS text in DOM order, and 3) an array of nodes in DOM
 *                   order as arguments.
 *
 * @example
 *
 *   getCssData({
 *     rootElement : document,
 *     include     : 'style,link[rel="stylesheet"]',
 *     exclude     : '[href="skip.css"]',
 *     filter      : /red/,
 *     skipDisabled: true,
 *     useCSSOM    : false,
 *     onBeforeSend(xhr, node, url) {
 *       // ...
 *     }
 *     onSuccess(cssText, node, url) {
 *       // ...
 *     }
 *     onError(xhr, node, url) {
 *       // ...
 *     },
 *     onComplete(cssText, cssArray, nodeArray) {
 *       // ...
 *     }
 *   });
 */ function getCssData(options) {
    var regex = {
        cssComments: /\/\*[\s\S]+?\*\//g,
        cssImports: /(?:@import\s*)(?:url\(\s*)?(?:['"])([^'"]*)(?:['"])(?:\s*\))?(?:[^;]*;)/g
    };
    var settings = {
        rootElement: options.rootElement || document,
        include: options.include || 'style,link[rel="stylesheet"]',
        exclude: options.exclude || null,
        filter: options.filter || null,
        skipDisabled: options.skipDisabled !== false,
        useCSSOM: options.useCSSOM || false,
        onBeforeSend: options.onBeforeSend || Function.prototype,
        onSuccess: options.onSuccess || Function.prototype,
        onError: options.onError || Function.prototype,
        onComplete: options.onComplete || Function.prototype
    };
    var sourceNodes = Array.apply(null, settings.rootElement.querySelectorAll(settings.include)).filter((function(node) {
        return !matchesSelector(node, settings.exclude);
    }));
    var cssArray = Array.apply(null, Array(sourceNodes.length)).map((function(x) {
        return null;
    }));
    function handleComplete() {
        var isComplete = cssArray.indexOf(null) === -1;
        if (isComplete) {
            var cssText = cssArray.join("");
            settings.onComplete(cssText, cssArray, sourceNodes);
        }
    }
    function handleSuccess(cssText, cssIndex, node, sourceUrl) {
        var returnVal = settings.onSuccess(cssText, node, sourceUrl);
        cssText = returnVal !== undefined && Boolean(returnVal) === false ? "" : returnVal || cssText;
        resolveImports(cssText, node, sourceUrl, (function(resolvedCssText, errorData) {
            if (cssArray[cssIndex] === null) {
                errorData.forEach((function(data) {
                    return settings.onError(data.xhr, node, data.url);
                }));
                if (!settings.filter || settings.filter.test(resolvedCssText)) {
                    cssArray[cssIndex] = resolvedCssText;
                } else {
                    cssArray[cssIndex] = "";
                }
                handleComplete();
            }
        }));
    }
    function parseImportData(cssText, baseUrl) {
        var ignoreRules = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var importData = {};
        importData.rules = (cssText.replace(regex.cssComments, "").match(regex.cssImports) || []).filter((function(rule) {
            return ignoreRules.indexOf(rule) === -1;
        }));
        importData.urls = importData.rules.map((function(rule) {
            return rule.replace(regex.cssImports, "$1");
        }));
        importData.absoluteUrls = importData.urls.map((function(url) {
            return getFullUrl(url, baseUrl);
        }));
        importData.absoluteRules = importData.rules.map((function(rule, i) {
            var oldUrl = importData.urls[i];
            var newUrl = getFullUrl(importData.absoluteUrls[i], baseUrl);
            return rule.replace(oldUrl, newUrl);
        }));
        return importData;
    }
    function resolveImports(cssText, node, baseUrl, callbackFn) {
        var __errorData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
        var __errorRules = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
        var importData = parseImportData(cssText, baseUrl, __errorRules);
        if (importData.rules.length) {
            getUrls(importData.absoluteUrls, {
                onBeforeSend: function onBeforeSend(xhr, url, urlIndex) {
                    settings.onBeforeSend(xhr, node, url);
                },
                onSuccess: function onSuccess(cssText, url, urlIndex) {
                    var returnVal = settings.onSuccess(cssText, node, url);
                    cssText = returnVal === false ? "" : returnVal || cssText;
                    var responseImportData = parseImportData(cssText, url, __errorRules);
                    responseImportData.rules.forEach((function(rule, i) {
                        cssText = cssText.replace(rule, responseImportData.absoluteRules[i]);
                    }));
                    return cssText;
                },
                onError: function onError(xhr, url, urlIndex) {
                    __errorData.push({
                        xhr: xhr,
                        url: url
                    });
                    __errorRules.push(importData.rules[urlIndex]);
                    resolveImports(cssText, node, baseUrl, callbackFn, __errorData, __errorRules);
                },
                onComplete: function onComplete(responseArray) {
                    responseArray.forEach((function(importText, i) {
                        cssText = cssText.replace(importData.rules[i], importText);
                    }));
                    resolveImports(cssText, node, baseUrl, callbackFn, __errorData, __errorRules);
                }
            });
        } else {
            callbackFn(cssText, __errorData);
        }
    }
    if (sourceNodes.length) {
        sourceNodes.forEach((function(node, i) {
            var linkHref = node.getAttribute("href");
            var linkRel = node.getAttribute("rel");
            var isLink = node.nodeName === "LINK" && linkHref && linkRel && linkRel.toLowerCase().indexOf("stylesheet") !== -1;
            var isSkip = settings.skipDisabled === false ? false : node.disabled;
            var isStyle = node.nodeName === "STYLE";
            if (isLink && !isSkip) {
                getUrls(linkHref, {
                    mimeType: "text/css",
                    onBeforeSend: function onBeforeSend(xhr, url, urlIndex) {
                        settings.onBeforeSend(xhr, node, url);
                    },
                    onSuccess: function onSuccess(cssText, url, urlIndex) {
                        var sourceUrl = getFullUrl(linkHref);
                        handleSuccess(cssText, i, node, sourceUrl);
                    },
                    onError: function onError(xhr, url, urlIndex) {
                        cssArray[i] = "";
                        settings.onError(xhr, node, url);
                        handleComplete();
                    }
                });
            } else if (isStyle && !isSkip) {
                var cssText = node.textContent;
                if (settings.useCSSOM) {
                    cssText = Array.apply(null, node.sheet.cssRules).map((function(rule) {
                        return rule.cssText;
                    })).join("");
                }
                handleSuccess(cssText, i, node, location.href);
            } else {
                cssArray[i] = "";
                handleComplete();
            }
        }));
    } else {
        settings.onComplete("", []);
    }
}

function getFullUrl(url, base) {
    var d = document.implementation.createHTMLDocument("");
    var b = d.createElement("base");
    var a = d.createElement("a");
    d.head.appendChild(b);
    d.body.appendChild(a);
    b.href = base || document.baseURI || (document.querySelector("base") || {}).href || location.href;
    a.href = url;
    return a.href;
}

function matchesSelector(elm, selector) {
    var matches = elm.matches || elm.matchesSelector || elm.webkitMatchesSelector || elm.mozMatchesSelector || elm.msMatchesSelector || elm.oMatchesSelector;
    return matches.call(elm, selector);
}

var balancedMatch = balanced;

function balanced(a, b, str) {
    if (a instanceof RegExp) a = maybeMatch(a, str);
    if (b instanceof RegExp) b = maybeMatch(b, str);
    var r = range(a, b, str);
    return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
    };
}

function maybeMatch(reg, str) {
    var m = str.match(reg);
    return m ? m[0] : null;
}

balanced.range = range;

function range(a, b, str) {
    var begs, beg, left, right, result;
    var ai = str.indexOf(a);
    var bi = str.indexOf(b, ai + 1);
    var i = ai;
    if (ai >= 0 && bi > 0) {
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
            if (i == ai) {
                begs.push(i);
                ai = str.indexOf(a, i + 1);
            } else if (begs.length == 1) {
                result = [ begs.pop(), bi ];
            } else {
                beg = begs.pop();
                if (beg < left) {
                    left = beg;
                    right = bi;
                }
                bi = str.indexOf(b, i + 1);
            }
            i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
            result = [ left, right ];
        }
    }
    return result;
}

function parseCss(css) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var defaults = {
        preserveStatic: true,
        removeComments: false
    };
    var settings = _extends({}, defaults, options);
    var errors = [];
    function error(msg) {
        throw new Error("CSS parse error: ".concat(msg));
    }
    function match(re) {
        var m = re.exec(css);
        if (m) {
            css = css.slice(m[0].length);
            return m;
        }
    }
    function open() {
        return match(/^{\s*/);
    }
    function close() {
        return match(/^}/);
    }
    function whitespace() {
        match(/^\s*/);
    }
    function comment() {
        whitespace();
        if (css[0] !== "/" || css[1] !== "*") {
            return;
        }
        var i = 2;
        while (css[i] && (css[i] !== "*" || css[i + 1] !== "/")) {
            i++;
        }
        if (!css[i]) {
            return error("end of comment is missing");
        }
        var str = css.slice(2, i);
        css = css.slice(i + 2);
        return {
            type: "comment",
            comment: str
        };
    }
    function comments() {
        var cmnts = [];
        var c;
        while (c = comment()) {
            cmnts.push(c);
        }
        return settings.removeComments ? [] : cmnts;
    }
    function selector() {
        whitespace();
        while (css[0] === "}") {
            error("extra closing bracket");
        }
        var m = match(/^(("(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^{])+)/);
        if (m) {
            return m[0].trim().replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, (function(m) {
                return m.replace(/,/g, "‌");
            })).split(/\s*(?![^(]*\)),\s*/).map((function(s) {
                return s.replace(/\u200C/g, ",");
            }));
        }
    }
    function declaration() {
        if (css[0] === "@") {
            return at_rule();
        }
        match(/^([;\s]*)+/);
        var comment_regexp = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
        var prop = match(/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (!prop) {
            return;
        }
        prop = prop[0].trim();
        if (!match(/^:\s*/)) {
            return error("property missing ':'");
        }
        var val = match(/^((?:\/\*.*?\*\/|'(?:\\'|.)*?'|"(?:\\"|.)*?"|\((\s*'(?:\\'|.)*?'|"(?:\\"|.)*?"|[^)]*?)\s*\)|[^};])+)/);
        var ret = {
            type: "declaration",
            property: prop.replace(comment_regexp, ""),
            value: val ? val[0].replace(comment_regexp, "").trim() : ""
        };
        match(/^[;\s]*/);
        return ret;
    }
    function declarations() {
        if (!open()) {
            return error("missing '{'");
        }
        var d;
        var decls = comments();
        while (d = declaration()) {
            decls.push(d);
            decls = decls.concat(comments());
        }
        if (!close()) {
            return error("missing '}'");
        }
        return decls;
    }
    function keyframe() {
        whitespace();
        var vals = [];
        var m;
        while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
            vals.push(m[1]);
            match(/^,\s*/);
        }
        if (vals.length) {
            return {
                type: "keyframe",
                values: vals,
                declarations: declarations()
            };
        }
    }
    function at_keyframes() {
        var m = match(/^@([-\w]+)?keyframes\s*/);
        if (!m) {
            return;
        }
        var vendor = m[1];
        m = match(/^([-\w]+)\s*/);
        if (!m) {
            return error("@keyframes missing name");
        }
        var name = m[1];
        if (!open()) {
            return error("@keyframes missing '{'");
        }
        var frame;
        var frames = comments();
        while (frame = keyframe()) {
            frames.push(frame);
            frames = frames.concat(comments());
        }
        if (!close()) {
            return error("@keyframes missing '}'");
        }
        return {
            type: "keyframes",
            name: name,
            vendor: vendor,
            keyframes: frames
        };
    }
    function at_page() {
        var m = match(/^@page */);
        if (m) {
            var sel = selector() || [];
            return {
                type: "page",
                selectors: sel,
                declarations: declarations()
            };
        }
    }
    function at_page_margin_box() {
        var m = match(/@(top|bottom|left|right)-(left|center|right|top|middle|bottom)-?(corner)?\s*/);
        if (m) {
            var name = "".concat(m[1], "-").concat(m[2]) + (m[3] ? "-".concat(m[3]) : "");
            return {
                type: "page-margin-box",
                name: name,
                declarations: declarations()
            };
        }
    }
    function at_fontface() {
        var m = match(/^@font-face\s*/);
        if (m) {
            return {
                type: "font-face",
                declarations: declarations()
            };
        }
    }
    function at_supports() {
        var m = match(/^@supports *([^{]+)/);
        if (m) {
            return {
                type: "supports",
                supports: m[1].trim(),
                rules: rules()
            };
        }
    }
    function at_host() {
        var m = match(/^@host\s*/);
        if (m) {
            return {
                type: "host",
                rules: rules()
            };
        }
    }
    function at_media() {
        var m = match(/^@media([^{]+)*/);
        if (m) {
            return {
                type: "media",
                media: (m[1] || "").trim(),
                rules: rules()
            };
        }
    }
    function at_custom_m() {
        var m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
        if (m) {
            return {
                type: "custom-media",
                name: m[1].trim(),
                media: m[2].trim()
            };
        }
    }
    function at_document() {
        var m = match(/^@([-\w]+)?document *([^{]+)/);
        if (m) {
            return {
                type: "document",
                document: m[2].trim(),
                vendor: m[1] ? m[1].trim() : null,
                rules: rules()
            };
        }
    }
    function at_x() {
        var m = match(/^@(import|charset|namespace)\s*([^;]+);/);
        if (m) {
            return {
                type: m[1],
                name: m[2].trim()
            };
        }
    }
    function at_rule() {
        whitespace();
        if (css[0] === "@") {
            var ret = at_x() || at_fontface() || at_media() || at_keyframes() || at_supports() || at_document() || at_custom_m() || at_host() || at_page() || at_page_margin_box();
            if (ret && !settings.preserveStatic) {
                var hasVarFunc = false;
                if (ret.declarations) {
                    hasVarFunc = ret.declarations.some((function(decl) {
                        return /var\(/.test(decl.value);
                    }));
                } else {
                    var arr = ret.keyframes || ret.rules || [];
                    hasVarFunc = arr.some((function(obj) {
                        return (obj.declarations || []).some((function(decl) {
                            return /var\(/.test(decl.value);
                        }));
                    }));
                }
                return hasVarFunc ? ret : {};
            }
            return ret;
        }
    }
    function rule() {
        if (!settings.preserveStatic) {
            var balancedMatch$1 = balancedMatch("{", "}", css);
            if (balancedMatch$1) {
                var hasVarDecl = /:(?:root|host)(?![.:#(])/.test(balancedMatch$1.pre) && /--\S*\s*:/.test(balancedMatch$1.body);
                var hasVarFunc = /var\(/.test(balancedMatch$1.body);
                if (!hasVarDecl && !hasVarFunc) {
                    css = css.slice(balancedMatch$1.end + 1);
                    return {};
                }
            }
        }
        var sel = selector() || [];
        var decls = settings.preserveStatic ? declarations() : declarations().filter((function(decl) {
            var hasVarDecl = sel.some((function(s) {
                return /:(?:root|host)(?![.:#(])/.test(s);
            })) && /^--\S/.test(decl.property);
            var hasVarFunc = /var\(/.test(decl.value);
            return hasVarDecl || hasVarFunc;
        }));
        if (!sel.length) {
            error("selector missing");
        }
        return {
            type: "rule",
            selectors: sel,
            declarations: decls
        };
    }
    function rules(core) {
        if (!core && !open()) {
            return error("missing '{'");
        }
        var node;
        var rules = comments();
        while (css.length && (core || css[0] !== "}") && (node = at_rule() || rule())) {
            if (node.type) {
                rules.push(node);
            }
            rules = rules.concat(comments());
        }
        if (!core && !close()) {
            return error("missing '}'");
        }
        return rules;
    }
    return {
        type: "stylesheet",
        stylesheet: {
            rules: rules(true),
            errors: errors
        }
    };
}

function parseVars(cssData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var defaults = {
        parseHost: false,
        store: {},
        onWarning: function onWarning() {}
    };
    var settings = _extends({}, defaults, options);
    var reVarDeclSelectors = new RegExp(":".concat(settings.parseHost ? "host" : "root", "$"));
    if (typeof cssData === "string") {
        cssData = parseCss(cssData, settings);
    }
    cssData.stylesheet.rules.forEach((function(rule) {
        if (rule.type !== "rule" || !rule.selectors.some((function(s) {
            return reVarDeclSelectors.test(s);
        }))) {
            return;
        }
        rule.declarations.forEach((function(decl, i) {
            var prop = decl.property;
            var value = decl.value;
            if (prop && prop.indexOf("--") === 0) {
                settings.store[prop] = value;
            }
        }));
    }));
    return settings.store;
}

function stringifyCss(tree) {
    var delim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var cb = arguments.length > 2 ? arguments[2] : undefined;
    var renderMethods = {
        charset: function charset(node) {
            return "@charset " + node.name + ";";
        },
        comment: function comment(node) {
            return node.comment.indexOf("__CSSVARSPONYFILL") === 0 ? "/*" + node.comment + "*/" : "";
        },
        "custom-media": function customMedia(node) {
            return "@custom-media " + node.name + " " + node.media + ";";
        },
        declaration: function declaration(node) {
            return node.property + ":" + node.value + ";";
        },
        document: function document(node) {
            return "@" + (node.vendor || "") + "document " + node.document + "{" + visit(node.rules) + "}";
        },
        "font-face": function fontFace(node) {
            return "@font-face" + "{" + visit(node.declarations) + "}";
        },
        host: function host(node) {
            return "@host" + "{" + visit(node.rules) + "}";
        },
        import: function _import(node) {
            return "@import " + node.name + ";";
        },
        keyframe: function keyframe(node) {
            return node.values.join(",") + "{" + visit(node.declarations) + "}";
        },
        keyframes: function keyframes(node) {
            return "@" + (node.vendor || "") + "keyframes " + node.name + "{" + visit(node.keyframes) + "}";
        },
        media: function media(node) {
            return "@media " + node.media + "{" + visit(node.rules) + "}";
        },
        namespace: function namespace(node) {
            return "@namespace " + node.name + ";";
        },
        page: function page(node) {
            return "@page " + (node.selectors.length ? node.selectors.join(", ") : "") + "{" + visit(node.declarations) + "}";
        },
        "page-margin-box": function pageMarginBox(node) {
            return "@" + node.name + "{" + visit(node.declarations) + "}";
        },
        rule: function rule(node) {
            var decls = node.declarations;
            if (decls.length) {
                return node.selectors.join(",") + "{" + visit(decls) + "}";
            }
        },
        supports: function supports(node) {
            return "@supports " + node.supports + "{" + visit(node.rules) + "}";
        }
    };
    function visit(nodes) {
        var buf = "";
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (cb) {
                cb(n);
            }
            var txt = renderMethods[n.type](n);
            if (txt) {
                buf += txt;
                if (txt.length && n.selectors) {
                    buf += delim;
                }
            }
        }
        return buf;
    }
    return visit(tree.stylesheet.rules);
}

function walkCss(node, fn) {
    node.rules.forEach((function(rule) {
        if (rule.rules) {
            walkCss(rule, fn);
            return;
        }
        if (rule.keyframes) {
            rule.keyframes.forEach((function(keyframe) {
                if (keyframe.type === "keyframe") {
                    fn(keyframe.declarations, rule);
                }
            }));
            return;
        }
        if (!rule.declarations) {
            return;
        }
        fn(rule.declarations, node);
    }));
}

var VAR_PROP_IDENTIFIER = "--";

var VAR_FUNC_IDENTIFIER = "var";

function transformCss(cssData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var defaults = {
        preserveStatic: true,
        preserveVars: false,
        variables: {},
        onWarning: function onWarning() {}
    };
    var settings = _extends({}, defaults, options);
    if (typeof cssData === "string") {
        cssData = parseCss(cssData, settings);
    }
    walkCss(cssData.stylesheet, (function(declarations, node) {
        for (var i = 0; i < declarations.length; i++) {
            var decl = declarations[i];
            var type = decl.type;
            var prop = decl.property;
            var value = decl.value;
            if (type !== "declaration") {
                continue;
            }
            if (!settings.preserveVars && prop && prop.indexOf(VAR_PROP_IDENTIFIER) === 0) {
                declarations.splice(i, 1);
                i--;
                continue;
            }
            if (value.indexOf(VAR_FUNC_IDENTIFIER + "(") !== -1) {
                var resolvedValue = resolveValue(value, settings);
                if (resolvedValue !== decl.value) {
                    resolvedValue = fixNestedCalc(resolvedValue);
                    if (!settings.preserveVars) {
                        decl.value = resolvedValue;
                    } else {
                        declarations.splice(i, 0, {
                            type: type,
                            property: prop,
                            value: resolvedValue
                        });
                        i++;
                    }
                }
            }
        }
    }));
    return stringifyCss(cssData);
}

function fixNestedCalc(value) {
    var reCalcVal = /calc\(([^)]+)\)/g;
    (value.match(reCalcVal) || []).forEach((function(match) {
        var newVal = "calc".concat(match.split("calc").join(""));
        value = value.replace(match, newVal);
    }));
    return value;
}

function resolveValue(value) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var __recursiveFallback = arguments.length > 2 ? arguments[2] : undefined;
    if (value.indexOf("var(") === -1) {
        return value;
    }
    var valueData = balancedMatch("(", ")", value);
    function resolveFunc(value) {
        var name = value.split(",")[0].replace(/[\s\n\t]/g, "");
        var fallback = (value.match(/(?:\s*,\s*){1}(.*)?/) || [])[1];
        var match = Object.prototype.hasOwnProperty.call(settings.variables, name) ? String(settings.variables[name]) : undefined;
        var replacement = match || (fallback ? String(fallback) : undefined);
        var unresolvedFallback = __recursiveFallback || value;
        if (!match) {
            settings.onWarning('variable "'.concat(name, '" is undefined'));
        }
        if (replacement && replacement !== "undefined" && replacement.length > 0) {
            return resolveValue(replacement, settings, unresolvedFallback);
        } else {
            return "var(".concat(unresolvedFallback, ")");
        }
    }
    if (!valueData) {
        if (value.indexOf("var(") !== -1) {
            settings.onWarning('missing closing ")" in the value "'.concat(value, '"'));
        }
        return value;
    } else if (valueData.pre.slice(-3) === "var") {
        var isEmptyVarFunc = valueData.body.trim().length === 0;
        if (isEmptyVarFunc) {
            settings.onWarning("var() must contain a non-whitespace string");
            return value;
        } else {
            return valueData.pre.slice(0, -3) + resolveFunc(valueData.body) + resolveValue(valueData.post, settings);
        }
    } else {
        return valueData.pre + "(".concat(resolveValue(valueData.body, settings), ")") + resolveValue(valueData.post, settings);
    }
}

var isBrowser = typeof window !== "undefined";

var isNativeSupport = isBrowser && window.CSS && window.CSS.supports && window.CSS.supports("(--a: 0)");

var counters = {
    group: 0,
    job: 0
};

var defaults = {
    rootElement: isBrowser ? document : null,
    shadowDOM: false,
    include: "style,link[rel=stylesheet]",
    exclude: "",
    variables: {},
    onlyLegacy: true,
    preserveStatic: true,
    preserveVars: false,
    silent: false,
    updateDOM: true,
    updateURLs: true,
    watch: null,
    onBeforeSend: function onBeforeSend() {},
    onError: function onError() {},
    onWarning: function onWarning() {},
    onSuccess: function onSuccess() {},
    onComplete: function onComplete() {},
    onFinally: function onFinally() {}
};

var regex = {
    cssComments: /\/\*[\s\S]+?\*\//g,
    cssKeyframes: /@(?:-\w*-)?keyframes/,
    cssMediaQueries: /@media[^{]+\{([\s\S]+?})\s*}/g,
    cssUrls: /url\((?!['"]?(?:data|http|\/\/):)['"]?([^'")]*)['"]?\)/g,
    cssVarDeclRules: /(?::(?:root|host)(?![.:#(])[\s,]*[^{]*{\s*[^}]*})/g,
    cssVarDecls: /(?:[\s;]*)(-{2}\w[\w-]*)(?:\s*:\s*)([^;]*);/g,
    cssVarFunc: /var\(\s*--[\w-]/,
    cssVars: /(?:(?::(?:root|host)(?![.:#(])[\s,]*[^{]*{\s*[^;]*;*\s*)|(?:var\(\s*))(--[^:)]+)(?:\s*[:)])/
};

var variableStore = {
    dom: {},
    job: {},
    user: {}
};

var cssVarsIsRunning = false;

var cssVarsObserver = null;

var cssVarsSrcNodeCount = 0;

var debounceTimer = null;

var isShadowDOMReady = false;

/**
 * Fetches, parses, and transforms CSS custom properties from specified
 * <style> and <link> elements into static values, then appends a new <style>
 * element with static values to the DOM to provide CSS custom property
 * compatibility for legacy browsers. Also provides a single interface for
 * live updates of runtime values in both modern and legacy browsers.
 *
 * @preserve
 * @param {object}   [options] Options object
 * @param {object}   [options.rootElement=document] Root element to traverse for
 *                   <link> and <style> nodes
 * @param {boolean}  [options.shadowDOM=false] Determines if shadow DOM <link>
 *                   and <style> nodes will be processed.
 * @param {string}   [options.include="style,link[rel=stylesheet]"] CSS selector
 *                   matching <link re="stylesheet"> and <style> nodes to
 *                   process
 * @param {string}   [options.exclude] CSS selector matching <link
 *                   rel="stylehseet"> and <style> nodes to exclude from those
 *                   matches by options.include
 * @param {object}   [options.variables] A map of custom property name/value
 *                   pairs. Property names can omit or include the leading
 *                   double-hyphen (—), and values specified will override
 *                   previous values
 * @param {boolean}  [options.onlyLegacy=true] Determines if the ponyfill will
 *                   only generate legacy-compatible CSS in browsers that lack
 *                   native support (i.e., legacy browsers)
 * @param {boolean}  [options.preserveStatic=true] Determines if CSS
 *                   declarations that do not reference a custom property will
 *                   be preserved in the transformed CSS
 * @param {boolean}  [options.preserveVars=false] Determines if CSS custom
 *                   property declarations will be preserved in the transformed
 *                   CSS
 * @param {boolean}  [options.silent=false] Determines if warning and error
 *                   messages will be displayed on the console
 * @param {boolean}  [options.updateDOM=true] Determines if the ponyfill will
 *                   update the DOM after processing CSS custom properties
 * @param {boolean}  [options.updateURLs=true] Determines if the ponyfill will
 *                   convert relative url() paths to absolute urls
 * @param {boolean}  [options.watch=false] Determines if a MutationObserver will
 *                   be created that will execute the ponyfill when a <link> or
 *                   <style> DOM mutation is observed
 * @param {function} [options.onBeforeSend] Callback before XHR is sent. Passes
 *                   1) the XHR object, 2) source node reference, and 3) the
 *                   source URL as arguments
 * @param {function} [options.onError] Callback after a CSS parsing error has
 *                   occurred or an XHR request has failed. Passes 1) an error
 *                   message, and 2) source node reference, 3) xhr, and 4 url as
 *                   arguments.
 * @param {function} [options.onWarning] Callback after each CSS parsing warning
 *                   has occurred. Passes 1) a warning message as an argument.
 * @param {function} [options.onSuccess] Callback after CSS data has been
 *                   collected from each node and before CSS custom properties
 *                   have been transformed. Allows modifying the CSS data before
 *                   it is transformed by returning any string value (or false
 *                   to skip). Passes 1) CSS text, 2) source node reference, and
 *                   3) the source URL as arguments.
 * @param {function} [options.onComplete] Callback after all CSS has been
 *                   processed, legacy-compatible CSS has been generated, and
 *                   (optionally) the DOM has been updated. Passes 1) a CSS
 *                   string with CSS variable values resolved, 2) an array of
 *                   output <style> node references that have been appended to
 *                   the DOM, 3) an object containing all custom properies names
 *                   and values, and 4) the ponyfill execution time in
 *                   milliseconds.
 * @param {function} [options.onFinally] Callback in modern and legacy browsers
 *                   after the ponyfill has finished all tasks. Passes 1) a
 *                   boolean indicating if the last ponyfill call resulted in a
 *                   style change, 2) a boolean indicating if the current
 *                   browser provides native support for CSS custom properties,
 *                   and 3) the ponyfill execution time in milliseconds.
 * @example
 *
 *   cssVars({
 *     rootElement   : document,
 *     shadowDOM     : false,
 *     include       : 'style,link[rel="stylesheet"]',
 *     exclude       : '',
 *     variables     : {},
 *     onlyLegacy    : true,
 *     preserveStatic: true,
 *     preserveVars  : false,
 *     silent        : false,
 *     updateDOM     : true,
 *     updateURLs    : true,
 *     watch         : false,
 *     onBeforeSend(xhr, node, url) {},
 *     onError(message, node, xhr, url) {},
 *     onWarning(message) {},
 *     onSuccess(cssText, node, url) {},
 *     onComplete(cssText, styleNode, cssVariables, benchmark) {},
 *     onFinally(hasChanged, hasNativeSupport, benchmark)
 *   });
 */ function cssVars() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var msgPrefix = "cssVars(): ";
    var settings = _extends({}, defaults, options);
    function handleError(message, sourceNode, xhr, url) {
        if (!settings.silent && window.console) {
            console.error("".concat(msgPrefix).concat(message, "\n"), sourceNode);
        }
        settings.onError(message, sourceNode, xhr, url);
    }
    function handleWarning(message) {
        if (!settings.silent && window.console) {
            console.warn("".concat(msgPrefix).concat(message));
        }
        settings.onWarning(message);
    }
    function handleFinally(hasChanged) {
        settings.onFinally(Boolean(hasChanged), isNativeSupport, getTimeStamp() - settings.__benchmark);
    }
    if (!isBrowser) {
        return;
    }
    if (settings.watch) {
        settings.watch = defaults.watch;
        addMutationObserver(settings);
        cssVars(settings);
        return;
    } else if (settings.watch === false && cssVarsObserver) {
        cssVarsObserver.disconnect();
        cssVarsObserver = null;
    }
    if (!settings.__benchmark) {
        if (cssVarsIsRunning === settings.rootElement) {
            cssVarsDebounced(options);
            return;
        }
        settings.__benchmark = getTimeStamp();
        settings.exclude = [ cssVarsObserver ? '[data-cssvars]:not([data-cssvars=""])' : '[data-cssvars="out"]', settings.exclude ].filter((function(selector) {
            return selector;
        })).join(",");
        settings.variables = fixVarNames(settings.variables);
        if (!cssVarsObserver) {
            var outNodes = Array.apply(null, settings.rootElement.querySelectorAll('[data-cssvars="out"]'));
            outNodes.forEach((function(outNode) {
                var dataGroup = outNode.getAttribute("data-cssvars-group");
                var srcNode = dataGroup ? settings.rootElement.querySelector('[data-cssvars="src"][data-cssvars-group="'.concat(dataGroup, '"]')) : null;
                if (!srcNode) {
                    outNode.parentNode.removeChild(outNode);
                }
            }));
            if (cssVarsSrcNodeCount) {
                var srcNodes = settings.rootElement.querySelectorAll('[data-cssvars]:not([data-cssvars="out"])');
                if (srcNodes.length < cssVarsSrcNodeCount) {
                    cssVarsSrcNodeCount = srcNodes.length;
                    variableStore.dom = {};
                }
            }
        }
    }
    if (document.readyState !== "loading") {
        if (isNativeSupport && settings.onlyLegacy) {
            var hasVarChange = false;
            if (settings.updateDOM) {
                var targetElm = settings.rootElement.host || (settings.rootElement === document ? document.documentElement : settings.rootElement);
                Object.keys(settings.variables).forEach((function(key) {
                    var varValue = settings.variables[key];
                    hasVarChange = hasVarChange || varValue !== getComputedStyle(targetElm).getPropertyValue(key);
                    targetElm.style.setProperty(key, varValue);
                }));
            }
            handleFinally(hasVarChange);
        } else if (!isShadowDOMReady && (settings.shadowDOM || settings.rootElement.shadowRoot || settings.rootElement.host)) {
            getCssData({
                rootElement: defaults.rootElement,
                include: defaults.include,
                exclude: settings.exclude,
                skipDisabled: false,
                onSuccess: function onSuccess(cssText, node, url) {
                    cssText = cssText.replace(regex.cssComments, "").replace(regex.cssMediaQueries, "");
                    cssText = (cssText.match(regex.cssVarDeclRules) || []).join("");
                    return cssText || false;
                },
                onComplete: function onComplete(cssText, cssArray, nodeArray) {
                    parseVars(cssText, {
                        store: variableStore.dom,
                        onWarning: handleWarning
                    });
                    isShadowDOMReady = true;
                    cssVars(settings);
                }
            });
        } else {
            cssVarsIsRunning = settings.rootElement;
            getCssData({
                rootElement: settings.rootElement,
                include: settings.include,
                exclude: settings.exclude,
                skipDisabled: false,
                onBeforeSend: settings.onBeforeSend,
                onError: function onError(xhr, node, url) {
                    var responseUrl = xhr.responseURL || getFullUrl$1(url, location.href);
                    var statusText = xhr.statusText ? "(".concat(xhr.statusText, ")") : "Unspecified Error" + (xhr.status === 0 ? " (possibly CORS related)" : "");
                    var errorMsg = "CSS XHR Error: ".concat(responseUrl, " ").concat(xhr.status, " ").concat(statusText);
                    handleError(errorMsg, node, xhr, responseUrl);
                },
                onSuccess: function onSuccess(cssText, node, url) {
                    var returnVal = settings.onSuccess(cssText, node, url);
                    cssText = returnVal !== undefined && Boolean(returnVal) === false ? "" : returnVal || cssText;
                    if (settings.updateURLs) {
                        cssText = fixRelativeCssUrls(cssText, url);
                    }
                    return cssText;
                },
                onComplete: function onComplete(cssText, cssArray) {
                    var nodeArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
                    var currentVars = _extends({}, variableStore.dom, variableStore.user);
                    var hasVarChange = false;
                    variableStore.job = {};
                    nodeArray.forEach((function(node, i) {
                        var nodeCSS = cssArray[i];
                        if (regex.cssVars.test(nodeCSS)) {
                            try {
                                var cssTree = parseCss(nodeCSS, {
                                    preserveStatic: settings.preserveStatic,
                                    removeComments: true
                                });
                                parseVars(cssTree, {
                                    parseHost: Boolean(settings.rootElement.host),
                                    store: variableStore.dom,
                                    onWarning: handleWarning
                                });
                                node.__cssVars = {
                                    tree: cssTree
                                };
                            } catch (err) {
                                handleError(err.message, node);
                            }
                        }
                    }));
                    _extends(variableStore.job, variableStore.dom);
                    if (settings.updateDOM) {
                        _extends(variableStore.user, settings.variables);
                        _extends(variableStore.job, variableStore.user);
                    } else {
                        _extends(variableStore.job, variableStore.user, settings.variables);
                        _extends(currentVars, settings.variables);
                    }
                    hasVarChange = counters.job > 0 && Boolean(Object.keys(variableStore.job).length > Object.keys(currentVars).length || Boolean(Object.keys(currentVars).length && Object.keys(variableStore.job).some((function(key) {
                        return variableStore.job[key] !== currentVars[key];
                    }))));
                    if (hasVarChange) {
                        resetCssNodes(settings.rootElement);
                        cssVars(settings);
                    } else {
                        var outCssArray = [];
                        var outNodeArray = [];
                        var hasKeyframesWithVars = false;
                        if (settings.updateDOM) {
                            counters.job++;
                        }
                        nodeArray.forEach((function(node, i) {
                            var isSkip = !node.__cssVars;
                            if (node.__cssVars) {
                                try {
                                    transformCss(node.__cssVars.tree, _extends({}, settings, {
                                        variables: variableStore.job,
                                        onWarning: handleWarning
                                    }));
                                    var outCss = stringifyCss(node.__cssVars.tree);
                                    if (settings.updateDOM) {
                                        var nodeCSS = cssArray[i];
                                        var hasCSSVarFunc = regex.cssVarFunc.test(nodeCSS);
                                        if (!node.getAttribute("data-cssvars")) {
                                            node.setAttribute("data-cssvars", "src");
                                        }
                                        if (outCss.length && hasCSSVarFunc) {
                                            var dataGroup = node.getAttribute("data-cssvars-group") || ++counters.group;
                                            var outCssNoSpaces = outCss.replace(/\s/g, "");
                                            var outNode = settings.rootElement.querySelector('[data-cssvars="out"][data-cssvars-group="'.concat(dataGroup, '"]')) || document.createElement("style");
                                            hasKeyframesWithVars = hasKeyframesWithVars || regex.cssKeyframes.test(outCss);
                                            if (settings.preserveStatic) {
                                                node.sheet.disabled = true;
                                            }
                                            if (!outNode.hasAttribute("data-cssvars")) {
                                                outNode.setAttribute("data-cssvars", "out");
                                            }
                                            if (outCssNoSpaces === node.textContent.replace(/\s/g, "")) {
                                                isSkip = true;
                                                if (outNode && outNode.parentNode) {
                                                    node.removeAttribute("data-cssvars-group");
                                                    outNode.parentNode.removeChild(outNode);
                                                }
                                            } else if (outCssNoSpaces !== outNode.textContent.replace(/\s/g, "")) {
                                                [ node, outNode ].forEach((function(n) {
                                                    n.setAttribute("data-cssvars-job", counters.job);
                                                    n.setAttribute("data-cssvars-group", dataGroup);
                                                }));
                                                outNode.textContent = outCss;
                                                outCssArray.push(outCss);
                                                outNodeArray.push(outNode);
                                                if (!outNode.parentNode) {
                                                    node.parentNode.insertBefore(outNode, node.nextSibling);
                                                }
                                            }
                                        }
                                    } else {
                                        if (node.textContent.replace(/\s/g, "") !== outCss) {
                                            outCssArray.push(outCss);
                                        }
                                    }
                                } catch (err) {
                                    handleError(err.message, node);
                                }
                            }
                            if (isSkip) {
                                node.setAttribute("data-cssvars", "skip");
                            }
                            if (!node.hasAttribute("data-cssvars-job")) {
                                node.setAttribute("data-cssvars-job", counters.job);
                            }
                        }));
                        cssVarsSrcNodeCount = settings.rootElement.querySelectorAll('[data-cssvars]:not([data-cssvars="out"])').length;
                        if (settings.shadowDOM) {
                            var elms = [ settings.rootElement ].concat(_toConsumableArray(settings.rootElement.querySelectorAll("*")));
                            for (var i = 0, elm; elm = elms[i]; ++i) {
                                if (elm.shadowRoot && elm.shadowRoot.querySelector("style")) {
                                    var shadowSettings = _extends({}, settings, {
                                        rootElement: elm.shadowRoot
                                    });
                                    cssVars(shadowSettings);
                                }
                            }
                        }
                        if (settings.updateDOM && hasKeyframesWithVars) {
                            fixKeyframes(settings.rootElement);
                        }
                        cssVarsIsRunning = false;
                        settings.onComplete(outCssArray.join(""), outNodeArray, JSON.parse(JSON.stringify(variableStore.job)), getTimeStamp() - settings.__benchmark);
                        handleFinally(outNodeArray.length);
                    }
                }
            });
        }
    } else {
        document.addEventListener("DOMContentLoaded", (function init(evt) {
            cssVars(options);
            document.removeEventListener("DOMContentLoaded", init);
        }));
    }
}

cssVars.reset = function() {
    counters.job = 0;
    counters.group = 0;
    cssVarsIsRunning = false;
    if (cssVarsObserver) {
        cssVarsObserver.disconnect();
        cssVarsObserver = null;
    }
    cssVarsSrcNodeCount = 0;
    debounceTimer = null;
    isShadowDOMReady = false;
    for (var prop in variableStore) {
        variableStore[prop] = {};
    }
};

function addMutationObserver(settings) {
    function isLink(node) {
        var isStylesheet = node.tagName === "LINK" && (node.getAttribute("rel") || "").indexOf("stylesheet") !== -1;
        return isStylesheet && !node.sheet.disabled;
    }
    function isStyle(node) {
        return node.tagName === "STYLE" && !node.sheet.disabled;
    }
    function isValidAddMutation(mutationNodes) {
        return Array.apply(null, mutationNodes).some((function(node) {
            var isElm = node.nodeType === 1;
            var hasAttr = isElm && node.hasAttribute("data-cssvars");
            var isStyleWithVars = isStyle(node) && regex.cssVars.test(node.textContent);
            var isValid = !hasAttr && (isLink(node) || isStyleWithVars);
            return isValid;
        }));
    }
    function isValidRemoveMutation(mutationNodes) {
        return Array.apply(null, mutationNodes).some((function(node) {
            var isElm = node.nodeType === 1;
            var isOutNode = isElm && node.getAttribute("data-cssvars") === "out";
            var isSrcNode = isElm && node.getAttribute("data-cssvars") === "src";
            var isValid = isSrcNode;
            if (isSrcNode || isOutNode) {
                var dataGroup = node.getAttribute("data-cssvars-group");
                var orphanNode = settings.rootElement.querySelector('[data-cssvars-group="'.concat(dataGroup, '"]'));
                if (isSrcNode) {
                    resetCssNodes(settings.rootElement);
                    variableStore.dom = {};
                }
                if (orphanNode) {
                    orphanNode.parentNode.removeChild(orphanNode);
                }
            }
            return isValid;
        }));
    }
    if (!window.MutationObserver) {
        return;
    }
    if (cssVarsObserver) {
        cssVarsObserver.disconnect();
        cssVarsObserver = null;
    }
    cssVarsObserver = new MutationObserver((function(mutations) {
        var hasValidMutation = mutations.some((function(mutation) {
            var isValid = false;
            if (mutation.type === "attributes") {
                isValid = isLink(mutation.target);
            } else if (mutation.type === "childList") {
                isValid = isValidAddMutation(mutation.addedNodes) || isValidRemoveMutation(mutation.removedNodes);
            }
            return isValid;
        }));
        if (hasValidMutation) {
            cssVars(settings);
        }
    }));
    cssVarsObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [ "disabled", "href" ],
        childList: true,
        subtree: true
    });
}

function cssVarsDebounced(settings) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout((function() {
        settings.__benchmark = null;
        cssVars(settings);
    }), delay);
}

function fixKeyframes(rootElement) {
    var animationNameProp = [ "animation-name", "-moz-animation-name", "-webkit-animation-name" ].filter((function(prop) {
        return getComputedStyle(document.body)[prop];
    }))[0];
    if (animationNameProp) {
        var allNodes = rootElement.getElementsByTagName("*");
        var keyframeNodes = [];
        var nameMarker = "__CSSVARSPONYFILL-KEYFRAMES__";
        for (var i = 0, len = allNodes.length; i < len; i++) {
            var node = allNodes[i];
            var animationName = getComputedStyle(node)[animationNameProp];
            if (animationName !== "none") {
                node.style[animationNameProp] += nameMarker;
                keyframeNodes.push(node);
            }
        }
        void document.body.offsetHeight;
        for (var _i = 0, _len = keyframeNodes.length; _i < _len; _i++) {
            var nodeStyle = keyframeNodes[_i].style;
            nodeStyle[animationNameProp] = nodeStyle[animationNameProp].replace(nameMarker, "");
        }
    }
}

function fixRelativeCssUrls(cssText, baseUrl) {
    var cssUrls = cssText.replace(regex.cssComments, "").match(regex.cssUrls) || [];
    cssUrls.forEach((function(cssUrl) {
        var oldUrl = cssUrl.replace(regex.cssUrls, "$1");
        var newUrl = getFullUrl$1(oldUrl, baseUrl);
        cssText = cssText.replace(cssUrl, cssUrl.replace(oldUrl, newUrl));
    }));
    return cssText;
}

function fixVarNames() {
    var varObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var reLeadingHyphens = /^-{2}/;
    return Object.keys(varObj).reduce((function(obj, value) {
        var key = reLeadingHyphens.test(value) ? value : "--".concat(value.replace(/^-+/, ""));
        obj[key] = varObj[value];
        return obj;
    }), {});
}

function getFullUrl$1(url) {
    var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : location.href;
    var d = document.implementation.createHTMLDocument("");
    var b = d.createElement("base");
    var a = d.createElement("a");
    d.head.appendChild(b);
    d.body.appendChild(a);
    b.href = base;
    a.href = url;
    return a.href;
}

function getTimeStamp() {
    return isBrowser && (window.performance || {}).now ? window.performance.now() : (new Date).getTime();
}

function resetCssNodes(rootElement) {
    var resetNodes = Array.apply(null, rootElement.querySelectorAll('[data-cssvars="skip"],[data-cssvars="src"]'));
    resetNodes.forEach((function(node) {
        return node.setAttribute("data-cssvars", "");
    }));
}

/* harmony default export */ __webpack_exports__["default"] = (cssVars);
//# sourceMappingURL=css-vars-ponyfill.esm.js.map


/***/ }),

/***/ "./src/App.m.css":
/*!***********************!*\
  !*** ./src/App.m.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {" _key":"diff-test/App","root":"App-m__root__df891dLaFAR"};

/***/ }),

/***/ "./src/App.tsx":
/*!*********************!*\
  !*** ./src/App.tsx ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __syncRequire =  true && typeof module.exports === "object";
Object.defineProperty(exports, "__esModule", { value: true });
var vdom_1 = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var theme_1 = __webpack_require__(/*! @dojo/framework/core/middleware/theme */ "./node_modules/@dojo/framework/core/middleware/theme.js");
var Outlet_1 = __webpack_require__(/*! @dojo/framework/routing/Outlet */ "./node_modules/@dojo/framework/routing/Outlet.js");
var dojo_1 = __webpack_require__(/*! @dojo/widgets/theme/dojo */ "./node_modules/@dojo/widgets/theme/dojo/index.js");
var Menu_1 = __webpack_require__(/*! ./widgets/Menu */ "./src/widgets/Menu.tsx");
var css = __webpack_require__(/*! ./App.m.css */ "./src/App.m.css");
var Loadable__ = { type: "registry" };
var __autoRegistryItems = { Home: function () { return __syncRequire ? Promise.resolve().then(function () { return __webpack_require__(/*! @dojo/webpack-contrib/promise-loader?global,src/widgets/Home!./widgets/Home */ "./node_modules/@dojo/webpack-contrib/promise-loader/index.js?global,src/widgets/Home!./src/widgets/Home.tsx")(); }) : false; }, About: function () { return __syncRequire ? Promise.resolve().then(function () { return __webpack_require__(/*! @dojo/webpack-contrib/promise-loader?global,src/widgets/About!./widgets/About */ "./node_modules/@dojo/webpack-contrib/promise-loader/index.js?global,src/widgets/About!./src/widgets/About.tsx")(); }) : false; }, Profile: function () { return __syncRequire ? Promise.resolve().then(function () { return __webpack_require__(/*! @dojo/webpack-contrib/promise-loader?global,src/widgets/Profile!./widgets/Profile */ "./node_modules/@dojo/webpack-contrib/promise-loader/index.js?global,src/widgets/Profile!./src/widgets/Profile.tsx")(); }) : false; } };
var factory = vdom_1.create({ theme: theme_1.default });
exports.default = factory(function App(_a) {
    var theme = _a.middleware.theme;
    if (!theme.get()) {
        theme.set(dojo_1.default);
    }
    return (vdom_1.tsx("div", { classes: [css.root] },
        vdom_1.tsx(Menu_1.default, null),
        vdom_1.tsx(Outlet_1.default, { id: "main" }, {
            home: vdom_1.tsx(Loadable__, { __autoRegistryItem: { label: "__autoRegistryItem_Home", registryItem: __autoRegistryItems.Home } }),
            about: vdom_1.tsx(Loadable__, { __autoRegistryItem: { label: "__autoRegistryItem_About", registryItem: __autoRegistryItems.About } }),
            profile: vdom_1.tsx(Loadable__, { username: "Dojo User", __autoRegistryItem: { label: "__autoRegistryItem_Profile", registryItem: __autoRegistryItems.Profile } })
        })));
});


/***/ }),

/***/ "./src/main.tsx":
/*!**********************!*\
  !*** ./src/main.tsx ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vdom_1 = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var Registry_1 = __webpack_require__(/*! @dojo/framework/core/Registry */ "./node_modules/@dojo/framework/core/Registry.js");
var RouterInjector_1 = __webpack_require__(/*! @dojo/framework/routing/RouterInjector */ "./node_modules/@dojo/framework/routing/RouterInjector.js");
var routes_1 = __webpack_require__(/*! ./routes */ "./src/routes.ts");
var App_1 = __webpack_require__(/*! ./App */ "./src/App.tsx");
var registry = new Registry_1.default();
RouterInjector_1.registerRouterInjector(routes_1.default, registry);
var r = vdom_1.default(function () { return vdom_1.tsx(App_1.default, null); });
r.mount({ registry: registry, domNode: document.getElementById('app') });


/***/ }),

/***/ "./src/routes.ts":
/*!***********************!*\
  !*** ./src/routes.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        id: 'home',
        path: 'home',
        outlet: 'main',
        defaultRoute: true
    },
    {
        id: 'about',
        path: 'about',
        outlet: 'main'
    },
    {
        id: 'profile',
        path: 'profile',
        outlet: 'main'
    }
];


/***/ }),

/***/ "./src/widgets/Menu.tsx":
/*!******************************!*\
  !*** ./src/widgets/Menu.tsx ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vdom_1 = __webpack_require__(/*! @dojo/framework/core/vdom */ "./node_modules/@dojo/framework/core/vdom.js");
var ActiveLink_1 = __webpack_require__(/*! @dojo/framework/routing/ActiveLink */ "./node_modules/@dojo/framework/routing/ActiveLink.js");
var header_1 = __webpack_require__(/*! @dojo/widgets/header */ "./node_modules/@dojo/widgets/header/index.js");
var css = __webpack_require__(/*! ./styles/Menu.m.css */ "./src/widgets/styles/Menu.m.css");
var factory = vdom_1.create();
exports.default = factory(function Menu() {
    return (vdom_1.tsx("div", { classes: css.root },
        vdom_1.tsx(header_1.default, null, {
            title: 'My Dojo App!',
            actions: (vdom_1.tsx("virtual", null,
                vdom_1.tsx(ActiveLink_1.default, { to: "home", classes: [css.link], activeClasses: [css.selected] }, "Home"),
                vdom_1.tsx(ActiveLink_1.default, { to: "about", classes: [css.link], activeClasses: [css.selected] }, "About"),
                vdom_1.tsx(ActiveLink_1.default, { to: "profile", classes: [css.link], activeClasses: [css.selected] }, "Profile")))
        })));
});


/***/ }),

/***/ "./src/widgets/styles/Menu.m.css":
/*!***************************************!*\
  !*** ./src/widgets/styles/Menu.m.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {" _key":"diff-test/Menu","root":"Menu-m__root__df891d3jZMJ","link":"Menu-m__link__df891d1c9_f","selected":"Menu-m__selected__df891d3pg72"};

/***/ })

}]);
//# sourceMappingURL=main.legacy.js.map