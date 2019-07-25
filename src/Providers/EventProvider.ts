import ServiceProvider from "../ServiceProvider";

import { IServiceProvider } from "../Contracts/serviceProvider";
import Event from "../Event";

export default class EventProvider extends ServiceProvider implements IServiceProvider {
    register () {
        this._app.singleton('event', () => {
            return new Event();
        });
    }
}