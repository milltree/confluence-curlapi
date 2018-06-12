import curl from 'curlrequest';
import invariant from 'invariant';

import { checkConfig } from './config';
import { addJsonContentTypeHeader } from './util/headers';
import { createUrl } from './util/url';

const HTTP_STATUS_300 = 300;

/**
 * Confluence 5.5 and later
 */
export class ConfluenceRawApi {

    constructor(config) {
        checkConfig(config);

        this.config = config;

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.postFile = this.postFile.bind(this);
        this.put = this.put.bind(this);
        this.delete = this.delete.bind(this);
    }

    get(path, queryParams, callback) {
        curl.request({
            url: createUrl(this.config.apiUrl, path, queryParams),
            method: 'GET',
            headers: this.config.requestHeaders,
            pretend: this.config.pretend || false
        }, (error, response, meta) => {
            this.evaluatingCallback(error, response, meta, callback);
        });
    }

    post(path, queryParams, data, callback) {
        invariant(data, 'Please add some data to post.');

        curl.request({
            url: createUrl(this.config.apiUrl, path, queryParams),
            method: 'POST',
            data: JSON.stringify(data),
            headers: addJsonContentTypeHeader(this.config.requestHeaders),
            pretend: this.config.pretend || false
        }, (error, response, meta) => {
            this.evaluatingCallback(error, response, meta, callback);
        });
    }

    postFile(path, queryParams, file, callback) {
        invariant(file, 'Please add a file to post.');

        curl.request({
            url: createUrl(this.config.apiUrl, path, queryParams),
            method: 'POST',
            form: `file=@${file}`,
            headers: this.config.requestHeaders,
            pretend: this.config.pretend || false
        }, (error, response, meta) => {
            this.evaluatingCallback(error, response, meta, callback);
        });
    }

    put(path, queryParams, data, callback) {
        invariant(data, 'Please add some data to put.');

        curl.request({
            url: createUrl(this.config.apiUrl, path, queryParams),
            method: 'PUT',
            data: JSON.stringify(data),
            headers: addJsonContentTypeHeader(this.config.requestHeaders),
            pretend: this.config.pretend || false
        }, (error, response, meta) => {
            this.evaluatingCallback(error, response, meta, callback);
        });
    }

    delete(path, queryParams, callback) {
        curl.request({
            url: createUrl(this.config.apiUrl, path, queryParams),
            method: 'DELETE',
            headers: this.config.requestHeaders,
            pretend: this.config.pretend || false
        }, (error, response, meta) => {
            this.evaluatingCallback(error, response, meta, callback);
        });
    }

    evaluatingCallback(error, response, meta, callback) {
        if (this.config.pretend && callback) {
            const command = `${meta.cmd} ${meta.args.join(' ')}`;
            callback(command, undefined);
        } else {
            responseParsingCallback(error, response, callback);
        }
    }
}

function responseParsingCallback(error, response, callback) {
    if (callback) {
        let errorMessage;
        let jsonResponse;

        if (!error && response) {
            try {
                jsonResponse = JSON.parse(response);
                if (jsonResponse.statusCode >= HTTP_STATUS_300) {
                    errorMessage = response;
                    jsonResponse = undefined;
                }
            } catch (jsonError) {
                // in this case Confluence usually returned an HTML error page
                errorMessage = response;
            }
        } else {
            errorMessage = error;
        }

        callback(errorMessage, jsonResponse);
    }
}
