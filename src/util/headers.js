export function createHeaders(user, password) {
    const encodedCredentials = Buffer.from(`${user}:${password}`).toString('base64');

    return {
        Authorization: `Basic ${encodedCredentials}`,
        'X-Atlassian-Token': 'no-check',
        'User-Agent': 'xx'
    };
}

export function addJsonContentTypeHeader(requestHeaders) {
    return {
        ...requestHeaders,
        'Content-Type': 'application/json'
    };
}
