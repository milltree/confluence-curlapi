'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createUrl = createUrl;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createUrl(baseUrl, path, queryParams) {
    (0, _invariant2.default)(path, 'Please provide the path to request from the Rest-API');

    const adjustedBaseUrl = baseUrl.endsWith('/') ? baseUrl.substr(0, baseUrl.length - 1) : baseUrl;
    const adjustedPath = path.startsWith('/') ? path : `/${path}`;

    return adjustedBaseUrl + adjustedPath + buildQueryString(queryParams);
}

function buildQueryString(params) {
    if (!params) {
        return '';
    }

    const queryString = Object.keys(params).reduce((queryParts, key) => {
        let value = params[key];
        if (value !== undefined && value !== null) {
            const valueDecoded = decodeURIComponent(value);
            if (value === valueDecoded) {
                value = encodeURIComponent(value);
            }
            queryParts.push(`${key}=${value}`);
        }
        return queryParts;
    }, []).join('&');

    return queryString ? `?${queryString}` : '';
}