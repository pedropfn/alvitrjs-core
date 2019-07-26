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
    1. [What is a Service Provider](#what-is-a-service-provider)
    2. [Setting your Providers](#setting-your-providers)
    3. [Creating a Provider](#creating-a-provider)
4. [Router](#router)
    1. [Methods](#methods)
    2. [Fields from Request](#fields-from-request)
    3. [Aliases](#aliases)
    4. [Middlewares](#middleware)
5. [Context](#context)
    1. [Request](#request)
    2. [Response](#response)
6. [Middlewares](#middlewares)
    1. [Global](#global)
    2. [Named](#named)
7. [Config](#config)

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

// You can use other classes inside
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

### What is a Service Provider

A service provider is a way of creating pieces of application in a modular way and 'injecting' into the framework,
it works by calling all services and registering them by IoC Container and Dependecy Injection.

### Setting your Providers

To use a service provider you should first create a folder called config and inside it a file called providers.js.
```
config/
    provider.js
index.js
```
That file is just an object with providers to call

```javascript
module.exports = {
    foo: 'Folder\FooProvider'
}
```

### Creating a Provider

Every provider should extend the ServiceProvider class and obey to an implementation of IServiceProvider, that is a register function and possible a boot function.

```javascript
import Foo from './foo';
import { ServiceProvider, IServiceProvider } from 'alvitrjs';

class FooProvider extends ServiceProvider implements IServiceProvider {
    register () {
        // Here you can use the IoC container to register services to your application
        this._app.singleton('foo' () => {
            return new Foo();
        });
    }
    
    boot () {
        // Here you can use any service from the application, because boot runs after all providers are registered.
        const config = this._app.use('config');
        const fooValue = config.get('FOO_VALUE');
        
        const foo = this._app.use('foo');
        foo.setValue(fooValue);
    }
}
```

## Router

The router class is being created by the service provider by calling a singleton, so anywhere you can use the IoC you can create routes,
but its recommended to create inside the config folder a route file that has a export default function, you can change this folder and file by changing inside the .env the ROUTES_PATH variable.

```javascript
module.exports.default = (router) => {
    // Here you can use the router to create your routes
}
```

### Methods

You can create any routes using those methods: GET, POST, PUT, PATCH, DELETE. The second parameter is going to be a closure that is going to be executed when the route is matched, it receives a context with the request, response and the ioc container.

```javascript
route.get('/', (context) => {
    context.res.sendJson({hello: 'hello world'});
});

// You can use : so it can receive a variable when that route match
route.post('/:id', (context) => {
    context.req.getParam('id');
});
```

### Fields from Request

You can get the fields that you send by request using the context request object.

```javascript
route.post('/', (context) => {
    // Get all the fields
    context.req.getFields();
    // Get a single field by name
    context.req.getField('id');
});
```

### Aliases

You can set aliases to your routes by using as inside the route.

```javascript
route.post('/', (context) => {
    context.res.sendJson({helloworld: 'hello world'});
}).as('hello world');
```

### Middleware

You can use named middlewares before the route controller is called by using middleware.

```javascript
route.post('/', (context) => {
    context.res.sendJson({helloworld: 'hello world'});
}).middlewares('foo');  // This is going to call the foo middleware
```

```javascript
route.post('/', (context) => {
    context.res.sendJson({helloworld: 'hello world'});
}).middlewares(['foo', 'bar']);  // You can also pass an array of named middlewares
```

## Context

The context object is passed to multiple classes when that class needs a request, response and the IoC Container.

### Request

The request class receives the fields from any form that sends data, and also receives the parameters from the class that matches the route call.

#### Properties

```javascript
route.get('/', (context) => {
    // you can get the url that was called in any method or class that has a context
    const url = context.req.url;
    
    // you can also get the method that was called
    const method = context.req.method;
    
    // you also have the status code
    const method = context.req.statusCode;
});
```

```javascript
// inside the middleware you can also set those for subsequent calls.
(context) => { context.req.method = "POST" }
```

#### Fields from Forms

```javascript
route.post('/', (context) => {
    // if the route receives fields from a form you can get all those fields and its values
    const fields = context.req.getFields();
    
    // or you can get a specific field by name
    const foo = context.req.getField('foo');
});
```

#### Params from a Route

```javascript
route.get('/:foo/:bar', (context) => {
    // if the route has parameters you can get all of them
    const params = context.req.getParams();
    
    // or you can get a specific param by name
    const foo = context.req.getParam('foo');
});
```

### Response

#### Header

```javascript
route.get('/', (context) => {
    // you can set headers to the response object
    context.res.setHeader('foo', 'fooValue');
    
    // headers can also receive objects as a value
    context.res.setHeader('foo-bar', {
        foo: 'foo',
        bar: 'bar'
    });
});
```

#### Status

```javascript
route.get('/', (context) => {
    // if you need to set a status code
    context.res.setStatusCode(404);
    
    // you can also set a message
    context.res.setStatusMessage('Page not Found');
});
```

#### Responses

Responses are used to send back to the client a response, so you should always only have one response at the end.

```javascript
route.get('/', (context) => {
    // you can send an html file back to a server, it uses the rootPath plus the path you set
    context.res.sendHtml('foo/foo.html');
});
```

```javascript
route.get('/', (context) => {
    // you can also send a JSON response
    context.res.sendJson({
        foo: 'foo',
        bar: 'bar'
    });
});
```

## Middlewares

Middlewares are functions that run before to upcoming requests, they can make some changes to upcoming requests and responses.
To use them you should create a config folder and add a file called middlewares.js.

```
config/
    middlewares.js
index.js
```

### Global

Global middlewares are functions that run before every request.

```javascript
module.exports.global = [
    (context) => { console.log('global middleware') }
]
```

### Named

The named middleware is an object with a name and a function that run before a matched route that has those middlewares.

```javascript
module.exports.named = {
    foo: (context) => { console.log('named middleware') }
}
```

## Config

The config service is a class that can store values with names, and get values from the .env file. You can easily use by just using the IoC to get the instance of the Config class.

```javascript
const config = ioc.use('config');

config.set('FOO', 'FOO VALUE');
// This will receive FOO VALUE
const foo = config.get('FOO');
```

### Note

> This readme is currently being written.

## In development

> Currently these are what i'm currently thinking on adding and working on it.

- [ ] Error Handling
- [ ] Router Groups
- [ ] Controllers
- [ ] Better Http Requests and Responses
- [ ] Getting Aliases
- [ ] Rendering Template Engines
- [ ] Better Middlewares
- [ ] Refactoring
- [ ] Optimization
- [ ] Security

## License
[MIT](https://choosealicense.com/licenses/mit/)
