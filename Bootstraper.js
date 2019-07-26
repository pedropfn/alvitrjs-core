"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var Container_1 = __importDefault(require("./Container"));
var Bootstraper = /** @class */ (function () {
    function Bootstraper(rootPath) {
        this._app = new Container_1.default();
        this._rootPath = rootPath;
        this._services = [];
        this._setProviders();
    }
    Bootstraper.prototype._startServer = function () {
        console.log('Starting the server: waiting for initiation!');
        var PORT = this._app.use('config').has('port') ? this._app.use('config').get('port').result : 8080;
        this._app.use('event').once('serverInit', function (arg) {
            console.log('Initiating server');
            http_1.default.createServer(arg).listen(PORT, function () {
                console.log("Server started listening to port: " + PORT);
            });
        });
    };
    Bootstraper.prototype._registerCoreProviders = function () {
        this._services.forEach(function (service) {
            service.register();
        });
    };
    Bootstraper.prototype._bootCoreProviders = function () {
        this._services.forEach(function (service) {
            if (service.boot)
                service.boot();
        });
    };
    Bootstraper.prototype._setProviders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var coreProvidersPath, config, providersPath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        coreProvidersPath = {
                            path: 'Providers',
                            root: path_1.default.resolve(__dirname)
                        };
                        console.log('Loading core modules');
                        return [4 /*yield*/, this._loadModules(coreProvidersPath)];
                    case 1:
                        _a.sent();
                        this._registerCoreProviders();
                        this._bootCoreProviders();
                        config = this._app.use('config');
                        config.set('root_path', this._rootPath);
                        this._startServer();
                        providersPath = {
                            path: '',
                            root: this._rootPath
                        };
                        config.has('providers_path') ? providersPath.path = config.get('providers_path').result : providersPath.path = 'config/providers';
                        this._loadModules(providersPath).catch(function (err) {
                            var error = _this._app.use('error');
                            error.throw(providersPath.path + " could not be found or load!");
                            console.log(error.getErrors());
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Bootstraper.prototype._loadModules = function (providersPath) {
        return __awaiter(this, void 0, void 0, function () {
            var module, _a, _b, _i, key, loadedModule, constructor, service;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(path_1.default.join(providersPath.root, providersPath.path))); })];
                    case 1:
                        module = _c.sent();
                        _a = [];
                        for (_b in module.default)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        key = _a[_i];
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(path_1.default.join(providersPath.root, providersPath.path, module.default[key]))); })];
                    case 3:
                        loadedModule = _c.sent();
                        constructor = Object.keys(loadedModule)[0];
                        service = new loadedModule[constructor](this._app);
                        this._services.push(service);
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Bootstraper;
}());
exports.default = Bootstraper;
