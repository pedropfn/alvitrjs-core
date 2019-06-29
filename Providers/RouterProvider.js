"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var router_1 = require("router");
var ServiceProvider_1 = require("../ServiceProvider");
var RouterProvider = /** @class */ (function (_super) {
    __extends(RouterProvider, _super);
    function RouterProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RouterProvider.prototype.register = function () {
        this._registerMiddlewareClass();
        this._registerRoutingClasses();
        this._registerHttpClasses();
    };
    RouterProvider.prototype.boot = function () {
        var routesPath = this._app.use('config').get('ROUTES_PATH');
        var routes = require(path_1.default.join(this._app.use('config').get('rootPath'), routesPath));
        routes.default(this._app.use('router'));
    };
    RouterProvider.prototype._registerMiddlewareClass = function () {
        this._app.singleton('middleware', function (app) {
            return new router_1.Middleware(app.use('config').get('rootPath'));
        });
    };
    RouterProvider.prototype._registerRoutingClasses = function () {
        this._app.singleton('router', function () {
            return new router_1.Router();
        });
        this._app.bind('routing', function (app) {
            var router = app.use('router');
            var middleware = app.use('middleware');
            return new router_1.Routing(router, middleware);
        });
    };
    RouterProvider.prototype._registerHttpClasses = function () {
        this._app.bind('context', function (app) {
            var req = app.use('request');
            var res = app.use('response');
            return {
                req: req,
                res: res,
                ioc: app
            };
        });
        this._app.bind('request', function () {
            return new router_1.Request();
        });
        this._app.bind('response', function () {
            return new router_1.Response();
        });
    };
    return RouterProvider;
}(ServiceProvider_1.ServiceProvider));
exports.RouterProvider = RouterProvider;
