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
var ServiceProvider_1 = __importDefault(require("../ServiceProvider"));
var Error_1 = __importDefault(require("../Error"));
var ErrorProvider = /** @class */ (function (_super) {
    __extends(ErrorProvider, _super);
    function ErrorProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorProvider.prototype.register = function () {
        this._app.singleton('error', function () {
            return new Error_1.default();
        });
    };
    return ErrorProvider;
}(ServiceProvider_1.default));
exports.default = ErrorProvider;
