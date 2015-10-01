export class Controller {
    dispatch(handler, request, reply) {
        return reply(this[handler]());
    }

    //init(server) {
    //    this.routes.forEach((route) => {
    //        let { method, path, handler } = route;
    //
    //        handler = this.dispatch.bind(this, handler);
    //
    //        server.route({ method, path, handler });
    //    });
    //}
}