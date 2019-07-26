# AlvitrJS's Core

> AlvitrJS's Core is a modular microframework for nodejs, that works using IOC and Service Providers to give you a better way of creating and handling websites.

### Warning

> This is not a production ready framework, its a working in progress build.

## Getting Started

### Prerequisites

- NodeJS : ^10

### Instalation

You can use NPM to install alvitrjs's core

```bash
npm install --save https://github.com/GustavoFenilli/alvitrjs-core
```

### Usage

Using Typescript

```typescript
import path from 'path'
import Bootstraper from 'alvitrjs-core';

new Bootstraper(path.resolve(__dirname));
```

Using Javascript

```javascript
const path = require('path');
const Bootstraper = require('alvitrjs');

new Bootstraper(path.resolve(__dirname));
```

## Table of Contents

1. [Bootstraper](#bootstraper)
    1. [Creating a Server](#creating-a-server)
    2. [Listening to a port](#listening-to-a-port)
2. [IoC Container](#ioc-container)
    1. [What is IoC and DI](#what-is-ioc-and-di)
    2. [Binding and Singleton](#binding-and-singleton)
    3. [Use the container](#use-the-container)
3. [Service Providers](#service-providers)
    1. [What is a Service Provider](#what-is-a-service-provider)
    2. [Creating a Provider](#creating-a-provider)
    3. [Setting your Providers](#setting-your-providers)
4. [Event Service](#event-service)
    1. [How to use the Event Service](#how-to-use-the-event-service)
    2. [Creating your own Event](#creating-your-own-event)
    3. [The Server Event](#the-server-event)
5. [Error Service](#error-service)
    1. [How to use the Error Service](#how-to-use-the-error-service)
    2. [Creating your own Error Service](#creating-your-own-error-service)
6. [Config Service](#config-service)

## Bootstraper

```typescript
import path from 'path'
import Bootstraper from 'alvitrjs-core';

new Bootstraper(path.resolve(__dirname))
```

### Creating a server

After the bootstraper is instantiated a event is set to start a server when everything is ready.

```typescript
this._app.use('event').once('serverInit', (arg: ServerOptions) => {
    http.createServer(arg); // the server is created when serverInit is emited with the arguments of ServerOptions passed to it.
});
```

### Listening to a port

A port is set by checking if there is a PORT variable in the config module, if not the port is always going to be 8080.

```javascript
const PORT = this._app.use('config').has('port') ? this._app.use('config').get('port').result : 8080;
this._app.use('event').once('serverInit', (arg: ServerOptions) => {
    http.createServer(arg).listen(PORT); // Starts to listen to the PORT
});
```

You can change the PORT by creating a .env file at the root of the application and setting it up.

```.env
PORT=80
```

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

```typescript
// This creates a binding for the class foo
ioc.bind('foo', () => {
    return new foo();
});

// You can also use the container inside the bind to pass a class to another class if needed
ioc.bind('foo', (app) => {
    const bar = app.use('bar');
    return new foo(bar);
});
```

The same goes for singleton, but the singleton method creates a class only on the first call, the other calls will be using the cached object.

```typescript
ioc.singleton('foo', (app) => {
    return new foo();
});
```

### Using the container

After your IoC container has the class you need using bind or singleton, you can use the use method to return that instance.

```typescript
// This is going to return a instance of the Foo class
const foo = app.use('foo');
```

## Service Providers

### What is a Service Provider

A service provider is a way of creating pieces of application in a modular way and injecting into the framework,
it works by calling all services and registering them using the [IoC Container](#ioc-container).

### Creating a Provider

Every provider should extend the ServiceProvider class and obey to an implementation of IServiceProvider, that is a register method and possible a boot method.

```typescript
import ServiceProvider, { IServiceProvider } from 'alvitrjs-core';

import Foo from './foo';

export default class FooProvider extends ServiceProvider implements IServiceProvider {
    register () {
        // Here you should use the IoC Container to register this service to your application
        this._app.singleton('foo' () => {
            return new Foo();
        });
    }
    
    // the boot method is meant to set values that you class need or should change inside the application and modules.
    boot () {
        // Here you can use any service from the application, because boot runs after all providers are registered.
        const config = this._app.use('config');
        const fooValue = config.get('FOO_VALUE');
        
        const foo = this._app.use('foo');
        foo.setValue(fooValue);
    }
}
```

### Setting your Providers

After creating your provider you have to set it to the application by exporting a object with name and path to your service.

```typescript
export default {
    // The path is relative to the root path passed to the bootstraper.
    foo: 'FooFolder\FooProvider'
}
```

by default the folder structure and file name should be as follow:

```
config/
    providers
```

It is relative to the root path that was used to create the bootstraper, you can also change this by creating a .env file at the root of the application and setting it PROVIDERS_PATH.

```.env
PROVIDERS_PATH='foo/bar'
```

## Event Service

The event service is just a extended EventEmmiter from Node itself, it is meant to be a way of creating reactive elements that work when they are needed and called.

### How to use the Event Service

You can use the event from the [IoC Container](#ioc-container) where it is available, it has the same methods as the EventEmmiter.

```typescript
const event = app.use('event');

// You can create an event to be called, giving it a name and a closure to be executed.
event.on('foo', () => {
    // This is going to be called only when foo is emited.
    console.log('foo was called!');
});

// This is going to emit a foo call to the event stack.
event.emit('foo');
// The result will be: foo was called!
```

### Creating your own Event

Because the event could be used by the core, you should try to avoid to use directly.

You can create a [Service Providers](#service-providers) to provide a new instance of event:

```typescript
import Event, ServiceProvider, { IServiceProvider } from 'alvitrjs-core';

export default class EventsProvider extends ServiceProvider implements IServiceProvider {
    register () {
        // A new instance of event to be used by your application.
        this._app.singleton('fooEvent' () => {
            return new Event();
        });

        // A new instance of event to be used by your application.
        this._app.singleton('barEvent' () => {
            return new Event();
        });
    }
}
```

After is created you should [Set your new Provider](#setting-your-providers) and you can use it by calling the [IoC Container](#ioc-container) where it is available.

```typescript
const fooEvent = app.use('fooEvent');

// You can create an event to be called, giving it a name and a closure to be executed.
fooEvent.on('foo', () => {
    // This is going to be called only when foo is emited.
    console.log('foo was called!');
});

// This is going to emit a foo call to the event stack.
fooEvent.emit('foo');
// The result will be: foo was called!
```

### The Server Event

The server event is a important part of AlvitrJS's Core, its by calling it that you can [Create a Server](#creating-a-server).

```typescript
const event = app.use('event');

// serverInit is a special case that will emit a call to start a new server, you need to pass a closure with request and response.
event.emit('serverInit', (req, res) => {
    // Here goes your code for each request call to the server
});
// This is going to start a new server
```

## Error Service

### How to use the Error Service

The error service extends the event class, so you can [use the event methods](#how-to-use-the-event-service) to be able to react to errors when they are called.

```typescript
const error = app.use('error');

// You can create an error to be called, giving it a name and a closure to be executed.
error.on('validationError', () => {
    // This is going to be called only when validationError is emited.
    console.log('it was not valid');
});

// This is going to emit a validationError call to the event stack.
error.emit('validationError');
// The result will be: it was not valid
```

You can also throw errors and get an array of those errors when you need them.

```typescript
// Validation.ts
const error = app.use('error');

// You throw an error 
error.throw('validationError', 'it was not valid');

// Controller.ts
const error = app.use('error');

// You get the errors array.
error.getErrors();
```

### Creating your own Error Service

You can create a [Service Providers](#service-providers) to provide a new instance of error:

```typescript
import Error, ServiceProvider, { IServiceProvider } from 'alvitrjs-core';

export default class ErrorsProvider extends ServiceProvider implements IServiceProvider {
    register () {
        // A new instance of error to be used by your application.
        this._app.singleton('fooError' () => {
            return new Error();
        });

        // A new instance of error to be used by your application.
        this._app.singleton('barError' () => {
            return new Error();
        });
    }
}
```

After is created you should [Set your new Provider](#setting-your-providers) and you can use it by calling the [IoC Container](#ioc-container) where it is available.

## Config Service

The config service is a class that can store values with names, and get values from the .env file. You can easily use by just using the IoC to get the instance of the Config class.

```typescript
const config = ioc.use('config');

config.set('FOO', 'FOO VALUE');
// This will receive FOO VALUE
const foo = config.get('FOO');
```

### Note

> This readme is currently being written.

## In development

> These are what I'm currently working on it.

- [x] Error Handling
- [ ] Better Error Handling
- [ ] Refactoring
- [ ] Optimization
- [ ] Security

## License
[MIT](https://choosealicense.com/licenses/mit/)
