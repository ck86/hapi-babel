export class PluginManager {

    plugins = [];

    async getPlugins() {
        if (this.plugins.length === 0) {
            await this.load();
        }

        return this.plugins;
    }

    async load() {
        try {
            await this.loadFromModules();
            await this.loadFromApp();
        } catch (error) {
            console.error('Error during loading plugins');
            console.error(error);
        }
    }

    async loadFromModules() {
        return new Promise((resolve, reject) => {
            for (let dependency in app.package_info.dependencies) {
                let package_info = require(`${app.base_path}/node_modules/${dependency}/package.json`);

                if (!package_info.keywords) {
                    continue;
                }

                if (package_info.keywords.indexOf('hapi') === -1 || package_info.keywords.indexOf('plugin') === -1) {
                    continue;
                }

                this.plugins.push(require(dependency));
            }

            resolve();
        });
    }

    async loadFromApp() {
        return new Promise((resolve, reject) => {
            console.warn('PluginManager.loadFromApp is not implemented yet');
            resolve();
        });
    }

}