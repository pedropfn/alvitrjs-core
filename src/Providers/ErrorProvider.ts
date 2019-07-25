import ServiceProvider from "../ServiceProvider";

import { IServiceProvider } from "../Contracts/serviceProvider";
import Error from "../Error";

export default class ErrorProvider extends ServiceProvider implements IServiceProvider {
    register () {
        this._app.singleton('error', () => {
            return new Error();
        })
    }
}