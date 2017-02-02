const cache = require('memory-cache');

class Scraper {

    /**
     * Get html code from a url.
     *
     * @param url
     * @return {Promise}
     */
    getContent(url) {

        // return new pending promise
        return new Promise((resolve, reject) => {
            let html = cache.get(url);

            if (html !== null) {
                return resolve(html);
            } else {
                // select http or https module, depending on requested url
                const lib = url.startsWith('https') ? require('https') : require('http');
                const request = lib.get(url, (response) => {
                    // handle http errors
                    if (response.statusCode < 200 || response.statusCode > 299) {
                        reject(new Error('Failed to load page, status code: ' + response.statusCode));
                    }
                    // temporary data holder
                    let body = [];
                    // on every content chunk, push it to the data array
                    response.on('data', (chunk) => body.push(chunk));
                    // we are done, resolve promise with those joined chunks
                    response.on('end', () => {
                        html = body.join('');
                        cache.put(url, html, 60 * 1000 * 60); // cache for 1h
                        resolve(html);
                    });
                });
                // handle connection errors of the request
                request.on('error', (err) => reject(err))
            }
        })
    };
}

module.exports = Scraper;