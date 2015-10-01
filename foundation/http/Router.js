export class Router {

    constructor(server) {
        this.server = server;
    }

}

export function route(method, path) {
    return function route(target, handler) {
        target.routes = target.routes || [];
        target.routes.push({ method, path, handler });
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