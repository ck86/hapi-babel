import path from 'path';

import {PluginManager} from './plugins/PluginManager.js';
import {PortFinder} from './utililities/PortFinder.js';
import Hapi from 'hapi';

export class Application {

    /**
     * @type {Hapi.Server}
     */
    server = null;

    /**
     * @type {PluginManager}
     */
    pluginManager = null;

    /**
     * @type {int}
     */
    port = null;

    get app_path() {
        return this._app_path || (this._app_path = path.normalize(`${this.base_path}/app`));
    }

    get base_path() {
        return this._base_path || (this._base_path = path.dirname(require.main.filename));
    }

    get core_path() {
        return this._core_path || (this._core_path = path.normalize(`${this.base_path}/foundation`));
    }

    get package_info() {
        return this._package_info || (this._package_info = require(`${this.base_path}/package.json`));
    }

    constructor() {
        this.server = new Hapi.Server();
        this.pluginManager = new PluginManager();
    }

    async bootstrap() {
        try {
            this.port = process.env.PORT || await PortFinder.getFreePort();
            this.plugins = await this.pluginManager.getPlugins();

            await this.run();

            console.log(`The server is running on http://localhost:${this.port}`);
        } catch (error) {
            console.error('Error during booting the application.');
            console.error(error);
        }
    }

    async run() {
        return new Promise((resolve) => {
            this.server.connection({
                port: this.port
            });

            this.server.register(this.plugins, () => {
                this.server.start(resolve);
            });
        });
    }
}
