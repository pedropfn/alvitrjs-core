export interface IServiceProvider {
    register (): void;
    boot? (): void;
}