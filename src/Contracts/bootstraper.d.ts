import http from 'http';

export interface IServerRequest {
    (req: http.IncomingMessage, res: http.ServerResponse): void
}

export interface IBootstraper {
    createServer (server: IServerRequest): this;
    listen (port: number): void;
}