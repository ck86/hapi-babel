import fs from 'fs';
import requireDir from 'require-dir';

export class FileSystem {
    async exists(path) {
        try {
            await this.stat(path);

            return true;
        } catch(e) {
            return false;
        }
    }

    async require(path) {
        try {
            let stat = await this.stat(path);

            if (stat.isDirectory()) {
                try {
                    stat = await this.stat(path + '/index.js');

                    path += '/index.js';
                } catch(e) {}
            }

            if (stat.isDirectory()) {
                return requireDir(path);
            }

            return require(path);
        } catch(e) {
            throw e;
        }
    }

    async stat(path) {
        return new Promise(function(resolve, reject) {
            fs.stat(path, function(error, stats) {
                if (error) {
                    return reject(error);
                }

                resolve(stats);
            });
        });
    }
}