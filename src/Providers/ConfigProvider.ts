import path from 'path';

import { Config } from 'config';

import { ServiceProvider } from '../ServiceProvider';
import { IServiceProvider } from '../Contracts/serviceProvider';

export class ConfigProvider extends ServiceProvider implements IServiceProvider {
    register () {
        this._app.singleton('config', () => {
            return new Config();
        });
    }

    boot () {
        this._app.use('config').set('rootPath', path.resolve(path.join('..', __dirname)));
    }
}