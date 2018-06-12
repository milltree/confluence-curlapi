import { ConfluenceConfig, checkConfig } from '../src/config';

describe('Configuration', () => {

    describe('ConfluenceConfig', () => {
        describe('Create instance', () => {
            test('without base URL', () => {
                let caughtError;
                let unexpectedConfig;
                try {
                    // eslint:disable-next-line
                    unexpectedConfig = new ConfluenceConfig(undefined, 'tom', 'secret');
                } catch (error) {
                    caughtError = error;
                }
                expect(caughtError).not.toBeUndefined();
                expect(unexpectedConfig).toBeUndefined();
            });

            test('without username', () => {
                let caughtError;
                let unexpectedConfig;
                try {
                    unexpectedConfig = new ConfluenceConfig('http://www.test.de', undefined, 'secret');
                } catch (error) {
                    caughtError = error;
                }
                expect(caughtError).not.toBeUndefined();
                expect(unexpectedConfig).toBeUndefined();
            });

            test('without password', () => {
                let caughtError;
                let unexpectedConfig;
                try {
                    unexpectedConfig = new ConfluenceConfig('http://www.test.de', 'tom', undefined);
                } catch (error) {
                    caughtError = error;
                }
                expect(caughtError).not.toBeUndefined();
                expect(unexpectedConfig).toBeUndefined();
            });

            test('with valid parameters', () => {
                const config = new ConfluenceConfig('http://www.test.de', 'tom', 'secret');

                expect(config.url).toBe('http://www.test.de');
                expect(config.apiUrl).toBe('http://www.test.de/rest/api');
                expect(config.requestHeaders).toEqual({
                    Authorization: `Basic ${Buffer.from('tom:secret').toString('base64')}`,
                    'X-Atlassian-Token': 'no-check',
                    'User-Agent': 'xx'
                });
                expect(config.pretend).toBeFalsy();
            });
        });

        test('setPretend()', () => {
            const config = new ConfluenceConfig('http://www.test.de', 'tom', 'secret');
            config.setPretend(true);

            expect(config.pretend).toBeTruthy();
        });

        describe('addRequestHeaders()', () => {
            test('with overwriting and new headers', () => {
                const config = new ConfluenceConfig('http://www.test.de', 'tom', 'secret');

                config.addRequestHeaders({
                    'User-Agent': 'firefox',
                    'Content-Type': 'whatever',
                    'Custom-Header': 'something'
                });

                expect(config.requestHeaders).toEqual({
                    Authorization: `Basic ${Buffer.from('tom:secret').toString('base64')}`,
                    'X-Atlassian-Token': 'no-check',
                    'User-Agent': 'firefox',
                    'Content-Type': 'whatever',
                    'Custom-Header': 'something'
                });
            });

            test('with undefined', () => {
                const config = new ConfluenceConfig('http://www.test.de', 'tom', 'secret');
                const previousHeaders = config.requestHeaders;

                config.addRequestHeaders(undefined);

                expect(config.requestHeaders).toEqual(previousHeaders);
            });
        });
    });


    describe('checkConfig()', () => {
        let config;

        beforeEach(() => {
            config = new ConfluenceConfig('http://www.test.de', 'tom', 'secret');
        });

        test('with undefined configuration', () => {
            let caughtError;
            try {
                checkConfig(undefined);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
        });

        test('with missing base URL', () => {
            config.url = undefined;

            let caughtError;
            try {
                checkConfig(config);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
        });

        test('with missing API URL', () => {
            config.apiUrl = undefined;

            let caughtError;
            try {
                checkConfig(config);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
        });

        test('without any request headers', () => {
            config.requestHeaders = undefined;

            let caughtError;
            try {
                checkConfig(config);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
        });

        test('with missing authorization request header', () => {
            config.requestHeaders = {
                'X-Atlassian-Token': 'no-check',
                'User-Agent': 'xx'
            };

            let caughtError;
            try {
                checkConfig(config);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
        });

        test('with valid parameters', () => {
            let caughtError;
            try {
                checkConfig(config);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).toBeUndefined();
        });
    });
});
