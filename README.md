# AlvitrJS

> AlvitrJS is a modular microframework for nodejs, that works using IOC and Service Providers to give you a better way of creating and handling websites.

### Warning

> This is not a production ready framework, its a working in progress build.

## Getting Started

### Prerequisites

- NodeJS : ^10

### Instalation

Use NPM to install the package

```bash
npm install --save https://github.com/GustavoFenilli/alvitrjs
```

### Usage

Using Typescript

```typescript
import path from 'path'
import { Bootstraper } from 'alvitrjs';

new Bootstraper(path.resolve(__dirname)).createServer().listen();
```

Using Javascript

```javascript
const path = require('path');
const { Bootstraper } = require('alvitrjs');

new Bootstraper(path.resolve(__dirname)).createServer().listen();
```

## Table of Contents

1. [Bootstraper](#bootstraper)
    1. [Create Server](#create-server)
    2. [Listen](#listen)
2. [Service Providers](#service-providers)
3. [Router](#router)
    1. [Methods](#methods)
    2. [Aliases](#aliases)
    3. [Middlewares](#router-middlewares)
4. [Middlewares](#middlewares)
5. [Env](#env)

## Bootstraper

```typescript
import path from 'path'
import { Bootstraper } from 'alvitrjs';

const boot = new Bootstraper(path.resolve(__dirname))
```
### Create server

You can create a new server by simpling calling the createServer method in the bootstraper class.

```javascript
boot.createServer();
```

### Listen

You can start to listen to your server by calling listen, listen by itself runs on por 3000

```javascript
// Starts to listen on port 3000
boot.listen();
```

You can change this behaviour by creating a .env file at the root of the application with PORT

### Note

> This readme is currently being written.

## In development

> Currently these are what i'm currently thinking on adding and working on it.

- [ ] Error Handling
- [ ] Getting Aliases
- [ ] Rendering Template Engines
- [ ] Better Middlewares

## License
[MIT](https://choosealicense.com/licenses/mit/)
