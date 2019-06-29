"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var formidable_1 = __importDefault(require("formidable"));
var Ioc_1 = require("./Ioc");
var Bootstraper = /** @class */ (function () {
    function Bootstraper(rootPath, providersPath) {
        this._ioc = new Ioc_1.Ioc();
        this._rootPath = rootPath;
        var pp = providersPath ? providersPath : 'config/providers.js';
        this._providersPath = path_1.default.join(this._rootPath, pp);
        this._alvitrjsProvidersPath = path_1.default.join(path_1.default.resolve(__dirname), 'config', 'providers.js');
        this._services = [];
        this._setRegisteredProviders();
        this._resolveAllProviders();
    }
    Bootstraper.prototype.createServer = function () {
        var _this = this;
        this._server = http_1.default.createServer(function (req, res) {
            var context = _this._ioc.use('context');
            var form = new formidable_1.default.IncomingForm();
            form.parse(req, function (err, fields, files) {
                context.req.setFields(fields);
                context.req.setIncomingMessage(req);
                context.res.setServerResponse(res);
                var routing = _this._ioc.use('routing');
                routing.setContext(context);
                routing.resolve();
                return;
            });
        });
        return this;
    };
    Bootstraper.prototype.listen = function (port) {
        port = port ? port : this._ioc.use('config').get('PORT') ? this._ioc.use('config').get('PORT') : 3000;
        this._server ?
            this._server.listen(port, function () {
                console.log("Listening to port " + port);
            }) :
            null;
    };
    Bootstraper.prototype._setRegisteredProviders = function () {
        if (this._fileForProvidersExists(this._alvitrjsProvidersPath))
            this._constructAndSetProviders(this._alvitrjsProvidersPath, path_1.default.resolve(__dirname));
        if (this._fileForProvidersExists(this._providersPath))
            this._constructAndSetProviders(this._providersPath, this._rootPath);
    };
    Bootstraper.prototype._constructAndSetProviders = function (servicePath, rootPath) {
        try {
            var application = require(servicePath);
            for (var key in application) {
                try {
                    var app = require(path_1.default.join(rootPath, application[key]));
                    var constructor = Object.keys(app)[0];
                    var service = new app[constructor](this._ioc);
                    this._services.push(service);
                }
                catch (err) {
                    // Catch Error
                }
            }
        }
        catch (err) {
            // Catch Error
        }
    };
    Bootstraper.prototype._registerProviders = function () {
        this._services.forEach(function (service) {
            service.register();
        });
    };
    Bootstraper.prototype._bootProviders = function () {
        this._services.forEach(function (service) {
            service.boot ? service.boot() : null;
        });
    };
    Bootstraper.prototype._cleanProviders = function () {
        this._services = [];
    };
    Bootstraper.prototype._fileForProvidersExists = function (path) {
        return fs_1.default.existsSync(path);
    };
    Bootstraper.prototype._resolveAllProviders = function () {
        this._registerProviders();
        this._ioc.use('config').set('rootPath', this._rootPath);
        this._bootProviders();
        this._cleanProviders();
    };
    return Bootstraper;
}());
exports.Bootstraper = Bootstraper;
