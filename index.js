"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var Bootstraper_1 = __importDefault(require("./Bootstraper"));
new Bootstraper_1.default(path_1.default.resolve(__dirname));
