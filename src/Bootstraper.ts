import { IIoc } from "./Contracts/ioc";
import Ioc from "./Container";

export default class Bootstraper {
    private _app: IIoc;

    constructor (rootPath: string) {
        this._app = new Ioc();
    }
}