export interface IServiceProvider {
    register (): void;
    boot? (): void;
}

export interface IProviderPath {
    path: string,
    root: string
}