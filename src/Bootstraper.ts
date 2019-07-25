import http from 'http';
import path from 'path';
import fs from 'fs';
import { ServerOptions } from 'https';

import { IIoc } from "./Contracts/ioc";
import { IServiceProvider, IProviderPath } from './Contracts/serviceProvider';
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
        const PORT = this._app.use('config').has('port') ? this._app.use('config').get('port').result : 8080;
        this._app.use('event').once('serverInit', (arg: ServerOptions) => {
            console.log('Initiating server');
            http.createServer(arg).listen(PORT, () => {
                console.log(`Server started listening to port: ${PORT}`);
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
        
        console.log('Loading core modules');
        await this._loadModules(coreProvidersPath);
        
        this._registerCoreProviders();
        this._bootCoreProviders();

        const config = this._app.use('config');
        
        config.set('root_path', this._rootPath);

        this._startServer();

        let providersPath = {
            path: '',
            root: this._rootPath
        };

        config.has('providers_path') ? providersPath.path = config.get('providers_path').result : providersPath.path = 'config/providers';

        this._loadModules(providersPath).catch(err => {
            const error = this._app.use('error');
            error.throw(`${providersPath.path} could not be found or load!`);

            console.log(error.getErrors());
        });
    }

    private async _loadModules (providersPath: IProviderPath) {
        const module = await import(path.join(providersPath.root, providersPath.path));

        for (const key in module.default ) {
            const loadedModule = await import(path.join(providersPath.root, providersPath.path , module.default[key]));

            const constructor = Object.keys(loadedModule)[0];
            const service = new loadedModule[constructor](this._app);

            this._services.push(service);
        }
    }
}