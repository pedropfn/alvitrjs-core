"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ioc = /** @class */ (function () {
    function Ioc() {
        this._bindings = {};
    }
    Ioc.prototype.bind = function (namespace, closure) {
        this._isExpected(closure);
        this._bindings[namespace] = this._registerToNamespace(closure, false);
    };
    Ioc.prototype.singleton = function (namespace, closure) {
        this._isExpected(closure);
        this._bindings[namespace] = this._registerToNamespace(closure, true);
    };
    Ioc.prototype.use = function (namespace) {
        var object = this._bindings[namespace];
        if (object.singleton) {
            return object.cachedValue = object.cachedValue || object.closure(this);
        }
        return object.closure(this);
    };
    Ioc.prototype._isExpected = function (closure) {
        if (typeof (closure) !== 'function') {
            throw Error('IoC.bind expects second parameter to be a closure: ' + closure);
        }
    };
    Ioc.prototype._registerToNamespace = function (closure, singleton) {
        return {
            closure: closure,
            singleton: singleton,
            cachedValue: null
        };
    };
    return Ioc;
}());
exports.Ioc = Ioc;
