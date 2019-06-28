import path from 'path';

export { Bootstraper } from "./Bootstraper";
export { ServiceProvider } from "./ServiceProvider";

import { Bootstraper } from './Bootstraper';

const boot = new Bootstraper(path.resolve(__dirname));