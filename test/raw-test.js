import { ConfluenceRawApi } from '../src/raw';
import { ConfluenceConfig } from '../src/config';

describe('ConfluenceRawApi', () => {
    let config;
    let api;

    const params = {
        one: '2',
        three: 4
    };

    beforeEach(() => {
        config = new ConfluenceConfig('http://www.test.de', 'tom', 'secret');
        config.setPretend(true);

        api = new ConfluenceRawApi(config);
    });

    describe('create instance', () => {
        test('with missing configuration', () => {
            let caughtError;
            let unexpectedApi;
            try {
                unexpectedApi = new ConfluenceRawApi(undefined);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
            expect(unexpectedApi).toBeUndefined();
        });

        test('with invalid configuration', () => {
            config.url = undefined;

            let caughtError;
            let unexpectedApi;
            try {
                unexpectedApi = new ConfluenceRawApi(config);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
            expect(unexpectedApi).toBeUndefined();
        });

        test('with valid configuration', () => {
            expect(new ConfluenceRawApi(config)).not.toBeUndefined();
        });
    });

    describe('get()', () => {
        test('without parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content `;

            api.get('content', undefined, (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content?one=2&three=4 `;

            api.get('content', params, (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });
    });

    describe('post()', () => {
        const data = {
            hello: 'world',
            some: {
                any: 'thing',
                more: {
                    number: 34
                }
            },
            items: [
                'one',
                'two'
            ]
        };

        test('without data', () => {
            let caughtError;
            try {
                api.post('content/123', undefined, undefined);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
        });

        test('without parameters', () => {
            const expectedUrl = `--data ${JSON.stringify(data)} `;

            api.post('content/123', undefined, data, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(`--url ${config.apiUrl}/content/123 `);
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch('--header Content-Type: application/json');
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123?one=2&three=4 `;

            api.post('content/123', params, data, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(data)} `);
                expect(command).toMatch('--header Content-Type: application/json');
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });
    });

    describe('postFile()', () => {
        const file = '/Users/home/user/file.txt';

        test('without file', () => {
            let caughtError;
            try {
                api.postFile('content/123/attachments', undefined, undefined);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
        });

        test('without parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123/attachments `;

            api.postFile('content/123/attachments', undefined, file, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--form file=@${file} `);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123/attachments?one=2&three=4 `;

            api.postFile('content/123/attachments', params, file, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--form file=@${file} `);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });
    });

    describe('put()', () => {
        const data = {
            hello: 'world',
            flagged: true
        };

        test('without data', () => {
            let caughtError;
            try {
                api.put('content/123', undefined, undefined);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
        });

        test('without parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123 `;

            api.put('content/123', undefined, data, (command) => {
                expect(command).toMatch('--request PUT');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(data)} `);
                expect(command).toMatch('--header Content-Type: application/json');
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123?one=2&three=4 `;

            api.put('content/123', params, data, (command) => {
                expect(command).toMatch('--request PUT');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(data)} `);
                expect(command).toMatch('--header Content-Type: application/json');
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });
    });

    describe('delete()', () => {
        test('without parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123 `;

            api.delete('content/123', undefined, (command) => {
                expect(command).toMatch('--request DELETE');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123?one=2&three=4 `;

            api.delete('content/123', params, (command) => {
                expect(command).toMatch('--request DELETE');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });
    });

    describe('evaluatingCallback()', () => {
        beforeEach(() => {
            config.setPretend(false);
        });

        test('with pretend mode', () => {
            config.setPretend(true);

            const meta = {
                cmd: 'curl',
                args: [
                    '--request',
                    'GET',
                    '--url',
                    'http://www.test.de/rest/api/content'
                ]
            };

            api.evaluatingCallback(undefined, undefined, meta, (error, response) => {
                expect(error).toBe('curl --request GET --url http://www.test.de/rest/api/content');
                expect(response).toBeUndefined();
            });
        });

        test('with error', () => {
            const errorMessage = 'Some error message';
            const responseData = '{some:data}';

            api.evaluatingCallback(errorMessage, responseData, undefined, (error, response) => {
                expect(error).toBe(errorMessage);
                expect(response).toBeUndefined();
            });
        });

        test('with invalid response', () => {
            const responseData = '<html><body>Error 403</body></html>';

            api.evaluatingCallback(undefined, responseData, undefined, (error, response) => {
                expect(error).toBe(responseData);
                expect(response).toBeUndefined();
            });
        });

        test('with response containing invalid statuscode', () => {
            const responseData = '{statusCode:502}';

            api.evaluatingCallback(undefined, responseData, undefined, (error, response) => {
                expect(error).toBe(responseData);
                expect(response).toBeUndefined();
            });
        });

        test('with valid response', () => {
            const responseData = {
                hello: 'world',
                one: 2,
                three: {
                    text: 'something',
                    items: [
                        'one',
                        'two'
                    ],
                    flag: true
                }
            };

            api.evaluatingCallback(undefined, JSON.stringify(responseData), undefined,
                (error, response) => {
                    expect(error).toBeUndefined();
                    expect(response).toEqual(responseData);
                }
            );
        });
    });

});
