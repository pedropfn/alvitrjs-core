export interface IIoc {
    bind (namespace: string, closure: Function): void;

    singleton (namespace: string, closure: Function): void;

    use (namespace: string): any;
}

export interface IBindings {
    [namespace: string]: {
        closure: Function,
        singleton: boolean,
        cachedValue: Function | null
    }
}