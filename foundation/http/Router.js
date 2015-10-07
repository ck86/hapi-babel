import {Controller} from './Controller.js';

class Router {
    controllers = {};
    options = [];

    get server() {
        return this.__server || null;
    }

    set server(server) {
        this.__server = server;

        server.on('start', this.onServerStarted.bind(this));
    }

    add(options) {
        this.options.push(options);
    }

    onServerStarted() {
        for (let options of this.options) {
            let { controller } = options;

            delete options.controller;

            if (controller instanceof Controller) {
                options.handler = controller.dispatch.bind(controller, options.handler);
            } else if (typeof controller[options.handler] !== 'undefined') {
                options.handler = controller[options.handler].bind(controller);
            }

            this.server.route(options);
        }
    }
}

Router = new Router();

export { Router };

export function route(method, path) {
    return function route(controller, handler) {
        Router.add({ method, path, handler, controller });
    }
}

export function get(path) {
    return route('GET', path);
}

export function post(path) {
    return route('POST', path);
}

export function put(path) {
    return route('PUT', path);
}

export function del(path) {
    return route('delete', path);
}