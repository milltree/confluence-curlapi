import invariant from 'invariant';

export function createUrl(baseUrl, path, queryParams) {
    invariant(path, 'Please provide the path to request from the Rest-API');

    const adjustedBaseUrl = baseUrl.endsWith('/') ? baseUrl.substr(0, baseUrl.length - 1) : baseUrl;
    const adjustedPath = path.startsWith('/') ? path : `/${path}`;

    return adjustedBaseUrl + adjustedPath + buildQueryString(queryParams);
}

function buildQueryString(params) {
    if (!params) {
        return '';
    }

    const queryString = Object.keys(params)
        .reduce((queryParts, key) => {
            let value = params[key];
            if (value !== undefined && value !== null) {
                const valueDecoded = decodeURIComponent(value);
                if (value === valueDecoded) {
                    value = encodeURIComponent(value);
                }
                queryParts.push(`${key}=${value}`);
            }
            return queryParts;
        }, [])
        .join('&');

    return queryString ? `?${queryString}` : '';
}
