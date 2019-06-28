import path from 'path';

import { Router, Middleware, Request, Response, Routing } from 'router';

import { ServiceProvider } from '../ServiceProvider';
import { IServiceProvider } from '../Contracts/serviceProvider';
import { IIoc } from '../Contracts/ioc';

export class RouterProvider extends ServiceProvider implements IServiceProvider {
    register () {
        this._registerMiddlewareClass();        

        this._registerRoutingClasses();

        this._registerHttpClasses();
    }

    boot () {
        const routesPath = this._app.use('config').get('ROUTES_PATH');
        const routes = require(path.join(this._app.use('config').get('rootPath') , routesPath));

        routes.default(this._app.use('router'));
    }

    private _registerMiddlewareClass () {
        this._app.singleton('middleware', (app: IIoc) => {
            return new Middleware(app.use('config').get('rootPath'));
        });
    }

    private _registerRoutingClasses () {
        this._app.singleton('router', () => {
            return new Router();
        });

        this._app.bind('routing', (app: IIoc) => {
            const router = app.use('router');
            const middleware = app.use('middleware');

            return new Routing(router, middleware);
        });
    }

    private _registerHttpClasses () {
        this._app.bind('context', (app: IIoc) => {
            const req = app.use('request');
            const res = app.use('response');

            return {
                req: req,
                res: res,
                ioc: app
            }
        })

        this._app.bind('request', () => {
            return new Request();
        });

        this._app.bind('response', () => {
            return new Response();
        });
    }
}