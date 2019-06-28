import { Config } from 'config';

import { ServiceProvider } from '../ServiceProvider';
import { IServiceProvider } from '../Contracts/serviceProvider';

export class ConfigProvider extends ServiceProvider implements IServiceProvider {
    register () {
        this._app.singleton('config', () => {
            return new Config();
        });
    }
}