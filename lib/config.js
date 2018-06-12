'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConfluenceConfig = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.checkConfig = checkConfig;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _headers = require('./util/headers');

var _url = require('./util/url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConfluenceConfig {

    constructor(url, user, password) {
        (0, _invariant2.default)(url, 'Please provide the base URL of the Confluence instance');
        (0, _invariant2.default)(user, 'Please provide the Confluence username to use for authorization');
        (0, _invariant2.default)(password, 'Please provide the Confluence password to use for authorization');

        this.url = url;
        this.apiUrl = (0, _url.createUrl)(url, '/rest/api');

        this.requestHeaders = (0, _headers.createHeaders)(user, password);

        this.pretend = false;
    }

    addRequestHeaders(additionalHeaders) {
        if (additionalHeaders) {
            this.requestHeaders = _extends({}, this.requestHeaders, additionalHeaders);
        }
    }

    setPretend(pretend) {
        this.pretend = pretend;
    }
}

exports.ConfluenceConfig = ConfluenceConfig;
function checkConfig(config) {
    (0, _invariant2.default)(config, 'Please set a valid ConfluenceConfig object');
    (0, _invariant2.default)(config.url, 'Please create the ConfluenceConfig object with a base URL');
    (0, _invariant2.default)(config.apiUrl, 'Please create the ConfluenceConfig object with a Rest-API URL');
    (0, _invariant2.default)(config.requestHeaders, 'Please create the ConfluenceConfig object with request headers');
    (0, _invariant2.default)(config.requestHeaders.Authorization, 'Please create the ConfluenceConfig object with an authorization request header');
}