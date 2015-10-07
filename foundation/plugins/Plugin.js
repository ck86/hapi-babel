import path from 'path';

import {FileSystem} from '../utililities/FileSystem.js';

export class Plugin {
    fs = new FileSystem();

    get path() {
        throw 'Path is not defined';
    }

    get controllerPath() {
        return path.join(this.path, 'controllers');
    }

    constructor() {
        this.register.attributes = this.getAttributes();
    }

    async init() {
        try {
            await this.initControllers();
        } catch(e) {
            throw e;
        }
    }

    async initControllers() {
        try {
            if (await this.fs.exists(this.controllerPath)) {
                await this.fs.require(this.controllerPath);
            }
        } catch(e) {
            throw e;
        }
    }

    getName() {
        return this.constructor.name;
    }

    getAttributes() {
        return {
            name: this.getName()
        }
    }

    register(server, options, done) {
        done();
    }
}