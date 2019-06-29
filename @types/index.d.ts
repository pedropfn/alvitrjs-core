import http from 'http';

declare module "alvitrjs" {
    interface IServerRequest {
        (req: http.IncomingMessage, res: http.ServerResponse): void
    }

    interface IIoc {
        bind (namespace: string, closure: Function): void;
    
        singleton (namespace: string, closure: Function): void;
    
        use (namespace: string): any;
    }

    interface IServiceProvider {
        register (): void;
        boot? (): void;
    }

    class Bootstraper {
        constructor(rootPath: string, providersPath?: string);
    
        createServer(): this;
        listen(port?: number): void;
    }

    class Ioc implements IIoc {
        bind (namespace: string, closure: Function): void;
    
        singleton (namespace: string, closure: Function): void;
    
        use (namespace: string): any;
    }

    abstract class ServiceProvider {
        constructor (app: IIoc);
    }
}