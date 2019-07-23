import { IIoc } from '../Contracts/ioc';

export default abstract class ServiceProvider {
    protected _app: IIoc;

    constructor (app: IIoc) {
        this._app = app;
    }
}