import fs from 'fs';
import path from 'path';
import requireDir from 'require-dir';

export class PluginManager {

    packages = {};
    plugins = [];

    async getPlugins() {
        if (this.plugins.length === 0) {
            await this.load();
        }

        return this.plugins;
    }

    async load() {
        try {
            await this.loadPackages();
            await this.loadFromModules();
            await this.loadFromApp();
        } catch (e) {
            throw e;
        }
    }

    async loadPackages() {
        try {
            for (let dependency in app.package_info.dependencies) {
                let package_info = require(`${app.base_path}/node_modules/${dependency}/package.json`);
                let {name, dependencies, keywords, devDependencies} = package_info;
                let is_plugin = package_info.keywords && package_info.keywords.indexOf('hapi') !== -1;

                Object.assign(dependencies, devDependencies);

                this.packages[name] = {name, dependencies, keywords, is_plugin};
            }
        } catch(e) {
            throw e;
        }
    }

    async loadFromModules() {
        try {
            let canidates = {};
            let queue = [];
            let plugins = [];

            for (let name in this.packages) {
                let plugin = this.packages[name];

                if (!plugin.is_plugin) {
                    continue;
                }

                canidates[name] = plugin;
                queue.push(plugin);
            }

            let getNames = function(names, plugin) {
                names += plugin.name;

                return names;
            };

            let lastQueue = '';

            while (queue.length) {
                let currentQueue = queue.reduce(getNames, '');

                if (lastQueue === currentQueue) {
                    while (queue.length) {
                        plugins.push(queue.shift());
                    }

                    break;
                }

                lastQueue = currentQueue;

                let plugin = queue.shift();

                dependencies:
                for (let dependency in plugin.dependencies) {
                    if (typeof canidates[dependency] === 'undefined') {
                        continue dependencies;
                    }

                    if (this.plugins.indexOf(canidates[dependency]) === -1) {
                        queue.push(plugin);

                        break dependencies;
                    }
                }

                if (queue.indexOf(plugin) === -1) {
                    plugins.push(plugin);
                }
            }

            this.plugins = plugins.map(function(plugin) {
                return require(plugin.name);
            });
        } catch(e) {
            throw e;
        }
    }

    async getAppModules() {
        return new Promise(function(resolve, reject) {
            fs.readdir(app.app_path, function(error, files) {
                if (error) {
                    return reject(error);
                }

                let modules = files.map(function(file) {
                    return require(path.join(app.app_path, file));
                });

                resolve(modules);
            });
        });
    }

    async loadFromApp() {
        try {
            let modules = await this.getAppModules();

            for (let module of modules) {
                module = new module;

                await module.init();

                this.plugins.push(module);
            }
        } catch(e) {
            throw e;
        }
    }

}