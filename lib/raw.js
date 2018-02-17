'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConfluenceRawApi = undefined;

var _curlrequest = require('curlrequest');

var _curlrequest2 = _interopRequireDefault(_curlrequest);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _config = require('./config');

var _headers = require('./util/headers');

var _url = require('./util/url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HTTP_STATUS_300 = 300;

/**
 * Confluence 5.5 and later
 */
class ConfluenceRawApi {

    constructor(config) {
        (0, _config.checkConfig)(config);

        this.config = config;

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.postFile = this.postFile.bind(this);
        this.put = this.put.bind(this);
        this.delete = this.delete.bind(this);
    }

    get(path, queryParams, callback) {
        _curlrequest2.default.request({
            url: (0, _url.createUrl)(this.config.apiUrl, path, queryParams),
            method: 'GET',
            headers: this.config.requestHeaders,
            pretend: this.config.pretend || false
        }, (error, response, meta) => {
            this.evaluatingCallback(error, response, meta, callback);
        });
    }

    post(path, queryParams, data, callback) {
        (0, _invariant2.default)(data, 'Please add some data to post.');

        _curlrequest2.default.request({
            url: (0, _url.createUrl)(this.config.apiUrl, path, queryParams),
            method: 'POST',
            data: JSON.stringify(data),
            headers: (0, _headers.addJsonContentTypeHeader)(this.config.requestHeaders),
            pretend: this.config.pretend || false
        }, (error, response, meta) => {
            this.evaluatingCallback(error, response, meta, callback);
        });
    }

    postFile(path, queryParams, file, callback) {
        (0, _invariant2.default)(file, 'Please add a file to post.');

        _curlrequest2.default.request({
            url: (0, _url.createUrl)(this.config.apiUrl, path, queryParams),
            method: 'POST',
            form: `file=@${file}`,
            headers: this.config.requestHeaders,
            pretend: this.config.pretend || false
        }, (error, response, meta) => {
            this.evaluatingCallback(error, response, meta, callback);
        });
    }

    put(path, queryParams, data, callback) {
        (0, _invariant2.default)(data, 'Please add some data to put.');

        _curlrequest2.default.request({
            url: (0, _url.createUrl)(this.config.apiUrl, path, queryParams),
            method: 'PUT',
            data: JSON.stringify(data),
            headers: (0, _headers.addJsonContentTypeHeader)(this.config.requestHeaders),
            pretend: this.config.pretend || false
        }, (error, response, meta) => {
            this.evaluatingCallback(error, response, meta, callback);
        });
    }

    delete(path, queryParams, callback) {
        _curlrequest2.default.request({
            url: (0, _url.createUrl)(this.config.apiUrl, path, queryParams),
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

exports.ConfluenceRawApi = ConfluenceRawApi;
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