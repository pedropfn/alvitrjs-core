import http from 'http';
import path from 'path';
import { ServerOptions } from 'https';

import { IIoc } from "./Contracts/ioc";
import { IServiceProvider } from './Contracts/serviceProvider';
import Ioc from './Container';

export default class Bootstraper {
    private _services: IServiceProvider[];
    private _app: IIoc;
    private _rootPath: string;

    constructor (rootPath: string) {
        this._app = new Ioc();
        this._rootPath = rootPath;

        this._services = [];

        this._setProviders();
    }

    private _startServer () {
        console.log('Starting the server: waiting for initiation!');
        this._app.use('event').once('serverInit', (arg: ServerOptions) => {
            console.log('Initiating server');
            http.createServer(arg).listen(8080, () => {
                console.log(`Server started listening to port: 8080`);
            });
        });
    }

    private _registerCoreProviders () {
        this._services.forEach(service => {
            service.register();
        });
    }

    private _bootCoreProviders () {
        this._services.forEach(service => {
            if (service.boot)
                service.boot()
        });
    }

    private async _setProviders () {
        const coreProvidersPath = {
            path: 'Providers',
            root: path.resolve(__dirname)
        };

        const module = await import(path.join(coreProvidersPath.root, coreProvidersPath.path));

        for (const key in module.default ) {
            const loadedModule = await import(path.join(coreProvidersPath.root, coreProvidersPath.path , module.default[key]));

            const constructor = Object.keys(loadedModule)[0];
            const service = new loadedModule[constructor](this._app);

            this._services.push(service);
        }

        this._registerCoreProviders();
        this._bootCoreProviders();

        this._startServer();
    }
}