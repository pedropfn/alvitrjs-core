import { Router, Middleware, Request, Response } from 'router';

import { ServiceProvider } from '../ServiceProvider';
import { IServiceProvider } from '../Contracts/serviceProvider';
import { IIoc } from '../Contracts/ioc';

export class RouterProvider extends ServiceProvider implements IServiceProvider {
    register () {
        this._app.singleton('middleware', (app: IIoc) => {
            return new Middleware(app.use('config').get('rootPath'));
        });

        this._app.singleton('router', () => {
            return new Router();
        });

        this._registerHttpClasses();
    }

    boot () {
        // console.log('Boot Router');
    }

    private _registerHttpClasses () {
        this._app.bind('request', () => {
            return new Request();
        });

        this._app.bind('response', () => {
            return new Response();
        });
    }
}