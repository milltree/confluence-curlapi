'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createHeaders = createHeaders;
exports.addJsonContentTypeHeader = addJsonContentTypeHeader;
function createHeaders(user, password) {
    const encodedCredentials = Buffer.from(`${user}:${password}`).toString('base64');

    return {
        Authorization: `Basic ${encodedCredentials}`,
        'X-Atlassian-Token': 'no-check',
        'User-Agent': 'xx'
    };
}

function addJsonContentTypeHeader(requestHeaders) {
    return _extends({}, requestHeaders, {
        'Content-Type': 'application/json'
    });
}