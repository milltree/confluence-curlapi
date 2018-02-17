import invariant from 'invariant';

import { createHeaders } from './util/headers';
import { createUrl } from './util/url';

export class ConfluenceConfig {

    constructor(url, user, password) {
        invariant(url, 'Please provide the base URL of the Confluence instance');
        invariant(user, 'Please provide the Confluence username to use for authorization');
        invariant(password, 'Please provide the Confluence password to use for authorization');

        this.url = url;
        this.apiUrl = createUrl(url, '/rest/api');

        this.requestHeaders = createHeaders(user, password);

        this.pretend = false;
    }

    addRequestHeaders(additionalHeaders) {
        if (additionalHeaders) {
            this.requestHeaders = {
                ...this.requestHeaders,
                ...additionalHeaders
            };
        }
    }

    setPretend(pretend) {
        this.pretend = pretend;
    }
}

export function checkConfig(config) {
    invariant(config, 'Please set a valid ConfluenceConfig object');
    invariant(config.url, 'Please create the ConfluenceConfig object with a base URL');
    invariant(config.apiUrl, 'Please create the ConfluenceConfig object with a Rest-API URL');
    invariant(config.requestHeaders,
        'Please create the ConfluenceConfig object with request headers');
    invariant(config.requestHeaders.Authorization,
        'Please create the ConfluenceConfig object with an authorization request header');
}
