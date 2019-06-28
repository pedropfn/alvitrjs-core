import { IIoc, IBindings } from './Contracts/ioc';

export class Ioc implements IIoc{
    private _bindings: IBindings;

    constructor () {
        this._bindings = {};
    }
    
    bind (namespace: string, closure: Function) {
        this._isExpected(closure);

        this._bindings[namespace] = this._registerToNamespace(closure, false);
    }

    singleton (namespace: string, closure: Function) {
        this._isExpected(closure);

        this._bindings[namespace] = this._registerToNamespace(closure, true);
    }

    use (namespace: string) {
        const object = this._bindings[namespace];

        if (object.singleton) {
            return object.cachedValue = object.cachedValue || object.closure(this);
        }

        return object.closure(this);
    }

    private _isExpected (closure: Function) {
        if (typeof (closure) !== 'function') {
            throw Error('IoC.bind expects second parameter to be a closure: ' + closure);
        }
    }

    private _registerToNamespace (closure: Function, singleton: boolean) {
        return {
            closure: closure,
            singleton: singleton,
            cachedValue: null
        }
    }
}