import portscanner from 'portscanner';

export class PortFinder {
    static async getFreePort() {
        try {
            let port = await PortFinder.findPort(3000, 3010);

            return port;
        } catch(error) {
            throw error;
        }
    }

    static findPort(from, to) {
        return new Promise(function (resolve, reject) {
            portscanner.findAPortNotInUse(from, to, '127.0.0.1', function (error, port) {
                if (error) {
                    reject(error);
                } else {
                    resolve(port);
                }
            });
        });
    }
}