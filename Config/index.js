"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var Config = /** @class */ (function () {
    function Config() {
        dotenv_1.default.config();
        this._configVariables = {};
    }
    Config.prototype.has = function (name) {
        return process.env[name.toUpperCase()]
            ? true
            : this._configVariables[name.toUpperCase()]
                ? true
                : false;
    };
    Config.prototype.set = function (name, value) {
        this._configVariables[name.toUpperCase()] = value;
    };
    Config.prototype.get = function (name) {
        if (this._configVariables[name.toUpperCase()] === undefined && process.env[name.toUpperCase()] === undefined)
            return {
                error: true,
                result: name + " doesn't exist!"
            };
        return {
            error: false,
            result: process.env[name.toUpperCase()] ? process.env[name.toUpperCase()] : this._configVariables[name.toUpperCase()]
        };
    };
    return Config;
}());
exports.default = Config;
