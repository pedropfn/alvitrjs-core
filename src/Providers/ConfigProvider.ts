import ServiceProvider from "../ServiceProvider";

import { IServiceProvider } from "../Contracts/serviceProvider";
import Config from "../Config";

export default class ConfigProvider extends ServiceProvider implements IServiceProvider {
    register () {
        this._app.singleton('config', () => {
            return new Config();
        })
    }
}