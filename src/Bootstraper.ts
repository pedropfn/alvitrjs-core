import fs from 'fs';
import path from 'path';
import http from 'http';

import formidable from 'formidable';

import { IIoc } from './Contracts/ioc';
import { Ioc } from './Ioc';
import { IServiceProvider, IProviderPath } from './Contracts/serviceProvider';
import { IContext, Routing } from 'router';

export class Bootstraper {
    private _server: http.Server | undefined;
    private _ioc: IIoc;
    private _services: IServiceProvider[];
    private _providersPath: IProviderPath;
    private _alvitrjsProvidersPath: IProviderPath;

    constructor(rootPath: string, providersPath?: string) {
        this._ioc = new Ioc();

        const pp = providersPath ? providersPath : 'config/providers';
        this._providersPath = {
            path: pp,
            root: rootPath
        };

        this._alvitrjsProvidersPath = {
            path: 'config/providers',
            root: path.resolve(__dirname)
        };

        this._services = [];

        this._setRegisteredProviders();
        this._resolveAllProviders();
    }

    createServer(): this {
        this._server = http.createServer((req, res) => {
            const context: IContext = this._ioc.use('context');
            const form = new formidable.IncomingForm();

            form.parse(req, (err, fields, files) => {
                context.req.setFields(fields);
                context.req.setIncomingMessage(req);
                context.res.setServerResponse(res);
                
                const routing: Routing = this._ioc.use('routing');
                routing.setContext(context);
                routing.resolve();

                return;
            });
        });

        return this;
    }

    listen(port?: number): void {
        port = port ? port : this._ioc.use('config').get('PORT') ? this._ioc.use('config').get('PORT') : 3000;

        this._server 
            ? this._server.listen(port, () => {
                console.log(`Listening to port ${port}`)
            })
            : null;
    }

    private _setRegisteredProviders(): void {
        this._constructAndSetProviders(this._alvitrjsProvidersPath);
        this._constructAndSetProviders(this._providersPath);
    }

    private _constructAndSetProviders(servicePath: IProviderPath): void {
        try {
            const application = require(path.join(servicePath.root, servicePath.path));
            for (const key in application) {
                try {
                    const app = require(path.join(servicePath.root, application[key]));
                    const constructor = Object.keys(app)[0];

                    const service: IServiceProvider = new app[constructor](this._ioc);
                    this._services.push(service);
                } catch (err) {
                    // Catch Error
                }
            }
        } catch (err) {
            // Catch Error
        }
    }

    private _registerProviders(): void {
        this._services.forEach(service => {
            service.register();
        });
    }

    private _bootProviders(): void {
       this._services.forEach(service => {
           service.boot ? service.boot() : null;
       });
    }
    
    private _cleanProviders(): void {
        this._services = [];
    }

    private _resolveAllProviders() {
        this._registerProviders();
        this._bootProviders();
        this._cleanProviders();
    }
}