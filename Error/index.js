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
var Event_1 = __importDefault(require("../Event"));
var Error = /** @class */ (function (_super) {
    __extends(Error, _super);
    function Error() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._errors = [];
        _this.errorName = 'System Error';
        return _this;
    }
    Error.prototype.getErrors = function () {
        return this._errors;
    };
    Error.prototype.throw = function (errorMessage) {
        this._errors.push(this.message() + " -> " + errorMessage);
    };
    Error.prototype.message = function () {
        return "There was a unexpected error!: " + this.errorName;
    };
    return Error;
}(Event_1.default));
exports.default = Error;
