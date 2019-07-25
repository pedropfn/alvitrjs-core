export interface IConfigVariables {
    [name: string]: string
}

export interface IConfig {
    has (name: string) : boolean;
    get (name: string): string | {error: string} | undefined 
    set (name: string, value: string): void;
}