import fs from 'fs';
import path from 'path';
import http from 'http';

import { IIoc } from './Contracts/ioc';
import { IServerRequest } from './Contracts/bootstraper';
import { Ioc } from './Ioc';
import { IServiceProvider } from './Contracts/serviceProvider';

export class Bootstraper {
    private _server: http.Server | undefined;
    private _ioc: IIoc;
    private _services: IServiceProvider[];
    private _rootPath: string;
    private _providersPath: string;
    private _alvitrjsProvidersPath: string;

    constructor(rootPath: string, providersPath?: string) {
        this._ioc = new Ioc();

        this._rootPath = rootPath;

        let pp = providersPath ? providersPath : 'config/providers.js';
        this._providersPath = path.join(this._rootPath, pp);
        this._alvitrjsProvidersPath = path.join(path.resolve(__dirname), 'config', 'providers.js');

        this._services = [];

        this._setRegisteredProviders();
        this._resolveAllProviders();

        this._ioc.use('config').set('rootPath', rootPath);
    }

    createServer(server: IServerRequest): this {
        this._server = http.createServer(server);

        return this;
    }

    listen(port?: number): void {
        port = port ? port : this._ioc.use('config').get('PORT') ? this._ioc.use('config').get('PORT') : 3000;

        this._server ?
            this._server.listen(port, () => {
                console.log(`Listening to port ${port}`)
            }) :
            null;
    }

    private _setRegisteredProviders(): void {
        if (this._fileForProvidersExists(this._alvitrjsProvidersPath))
            this._constructAndSetProviders(this._alvitrjsProvidersPath);
        // if (this._fileForProvidersExists(this._providersPath))
        //     this._constructAndSetProviders(this._providersPath);
    }

    private _constructAndSetProviders(servicePath: string): void {
        try {
            const application = require(servicePath);
            for (const key in application) {
                try {
                    const app = require(path.join(this._rootPath, application[key]));
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

    private _fileForProvidersExists(path: string): boolean {
        return fs.existsSync(path);
    }

    private _resolveAllProviders() {
        this._registerProviders();
        this._bootProviders();
        this._cleanProviders();
    }
}