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
2. [IoC Container](#ioc-container)
    1. [What is IoC and DI](#what-is-ioc-and-di)
    2. [Binding and Singleton](#binding-and-singleton)
    3. [Use the container](#use-the-container)
3. [Service Providers](#service-providers)
4. [Router](#router)
    1. [Methods](#methods)
    2. [Aliases](#aliases)
    3. [Middlewares](#router-middlewares)
5. [Middlewares](#middlewares)
6. [Env](#env)

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

## IoC Container

Before using the IoC and DI we need to know what are they.

### What is IoC and DI

IoC stands for Inversion of Control, meaning that the creation of new classes should be controlled by another
source instead of the class that needs, why? because this way you can depend on abstractions making it easier to test your code.

DI stands for Dependency Injection, is a pattern to enhance IoC by injecting dependencies when a class need it, without you
actually needing to instantiate it.

### Binding and Singleton

You can use both bind and singleton, when using the IoC container.
Bind works by creating a new class every time you call the IoC for that class, it uses a closure to know what you need,
you can use any other class inside the bind or singleton by using the passed ioc to it.

```javascript
// This creates a binding for the class
ioc.bind('foo', (app) => {
    return new foo();
});

// You can use another classes inside
ioc.bind('foo', (app) => {
    const bar = app.use('bar');
    return new foo(bar);
});
```
the same goes for singleton, but singleton creates a class only on the first call, the other calls will be using the first created class.

```javascript
// This creates a binding for the class
ioc.singleton('foo', (app) => {
    return new foo();
});

// You can use another classes inside
ioc.singleton('foo', (app) => {
    const bar = app.use('bar');
    return new foo(bar);
});
```
### Use the container

After your IoC container has the class you need using bind or singleton, you can use the use method to return that instance.

```javascript
// This is going to return a instance of the Foo class
const foo = app.use('foo');
```

## Service Providers

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
