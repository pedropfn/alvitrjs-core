import dotenv from 'dotenv';
import { IConfigVariables } from '../Contracts/config';

export default class Config {
    private _configVariables: IConfigVariables;

    constructor () {
        dotenv.config();
        this._configVariables = {};
    }

    has (name: string): boolean {
        return process.env[name.toUpperCase()]
            ? true
            : this._configVariables[name.toUpperCase()]
                ? true
                : false;
    }

    set (name: string, value: string): void {
        this._configVariables[name.toUpperCase()] = value;
    }

    get (name: string): {error: boolean, result: string | undefined} {
        if (this._configVariables[name.toUpperCase()] === undefined && process.env[name.toUpperCase()] === undefined)
            return {
                error: true,
                result: `${name} doesn't exist!`
            }

        return {
            error: false,
            result: process.env[name.toUpperCase()] ? process.env[name.toUpperCase()] : this._configVariables[name.toUpperCase()]
        }
    }
}