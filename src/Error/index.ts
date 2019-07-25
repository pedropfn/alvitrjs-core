import Event from "../Event";

export default class Error extends Event {
    private _errors: string[] = [];
    errorName: string = 'error';

    getErrors () {
        return this._errors;
    }

    throw (errorMessage: string) {
        this._errors.push(`${this.message()} -> ${errorMessage}`);
    }
    
    message (): string {
        return `There was a unexpected error!: ${this.errorName}`;
    }
}