import { ConfluenceContentApi } from '../src/content';
import { ConfluenceConfig } from '../src/config';

// eslint-disable-next-line max-statements
describe('ConfluenceContentApi', () => {
    let config;
    let api;

    const expand = 'body.view,version';
    const pages = { start: 1, limit: 20 };

    const expectedExpand = 'expand=body.view%2Cversion';
    const expectedExpandPages = `${expectedExpand}&start=1&limit=20`;

    beforeEach(() => {
        config = new ConfluenceConfig('http://www.test.de', 'tom', 'secret');
        config.setPretend(true);

        api = new ConfluenceContentApi(config);
    });

    describe('create instance', () => {
        test('with missing configuration', () => {
            let caughtError;
            let unexpectedApi;
            try {
                unexpectedApi = new ConfluenceContentApi(undefined);
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
                unexpectedApi = new ConfluenceContentApi(config);
            } catch (error) {
                caughtError = error;
            }
            expect(caughtError).not.toBeUndefined();
            expect(unexpectedApi).toBeUndefined();
        });

        test('with valid configuration', () => {
            expect(new ConfluenceContentApi(config)).not.toBeUndefined();
        });
    });

    describe('findPageByTitle()', () => {
        test('with minimal parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content?spaceKey=KEY&title=Title `;

            api.findPageByTitle('KEY', 'Title', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with additional expand and pages parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content?` +
                `${expectedExpandPages}&spaceKey=KEY&title=Title `;

            api.findPageByTitle('KEY', 'Title', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            }, expand, pages);
        });
    });

    describe('getPageContent()', () => {
        test('with minimal parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123 `;

            api.getPageContent('123', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with additional expand parameter', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123?${expectedExpand} `;

            api.getPageContent('123', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            }, expand);
        });
    });

    describe('getSubPages()', () => {
        test('with minimal parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123/child/page `;

            api.getSubPages('123', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with additional expand and pages parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123/child/page?` +
                `${expectedExpandPages} `;

            api.getSubPages('123', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            }, expand, pages);
        });
    });

    describe('createPage()', () => {
        const spaceKey = 'KEY';
        const parentPage = '123';
        const title = 'Title';
        const content = '<p>Some content.</p>';

        let expectedUrl;
        let expectedData;

        beforeEach(() => {
            expectedUrl = `--url ${config.apiUrl}/content `;

            expectedData = {
                type: 'page',
                title,
                ancestors: [{
                    id: parentPage,
                    type: 'page'
                }],
                space: {
                    key: spaceKey
                },
                body: {
                    storage: {
                        value: content,
                        representation: 'storage'
                    }
                }
            };
        });

        test('without parent page', () => {
            expectedData.ancestors = [];

            api.createPage(spaceKey, undefined, title, content, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with parent page', () => {
            api.createPage(spaceKey, parentPage, title, content, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with additional expand parameter', () => {
            expectedUrl = `--url ${config.apiUrl}/content?${expectedExpand} `;

            api.createPage(spaceKey, parentPage, title, content, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
                expect(command).toContainHeaders(config.requestHeaders);
            }, expand);
        });
    });

    test('updatePageContent()', () => {
        const page = '123';
        const title = 'Title';
        const content = '<p>Some content.</p>';
        const version = 2;

        const expectedData = {
            id: page,
            type: 'page',
            title,
            version: {
                number: version,
                minorEdit: false
            },
            body: {
                storage: {
                    value: content,
                    representation: 'storage'
                }
            }
        };

        const expectedUrl = `--url ${config.apiUrl}/content/123 `;

        api.updatePageContent(page, title, content, version, (command) => {
            expect(command).toMatch('--request PUT');
            expect(command).toMatch(expectedUrl);
            expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
            expect(command).toContainHeaders(config.requestHeaders);
        });
    });

    describe('movePage()', () => {
        const spaceKey = 'KEY';
        const page = '123';
        const title = 'Title';
        const parent = '456';
        const version = 2;

        let expectedUrl;
        let expectedData;

        beforeEach(() => {
            expectedUrl = `--url ${config.apiUrl}/content/123 `;

            expectedData = {
                id: page,
                type: 'page',
                title,
                space: {
                    key: spaceKey
                },
                ancestors: [
                    {
                        id: parent
                    }
                ],
                version: {
                    number: version,
                    minorEdit: false
                }
            };
        });

        test('without space key', () => {
            expectedData.space = {};

            api.movePage(page, undefined, parent, title, version, (command) => {
                expect(command).toMatch('--request PUT');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with space key', () => {
            api.movePage(page, spaceKey, parent, title, version, (command) => {
                expect(command).toMatch('--request PUT');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });
    });

    test('deletePage()', () => {
        const expectedUrl = `--url ${config.apiUrl}/content/123 `;

        api.deletePage('123', (command) => {
            expect(command).toMatch('--request DELETE');
            expect(command).toMatch(expectedUrl);
            expect(command).toContainHeaders(config.requestHeaders);
        });
    });

    test('getAttachmentPathForPage()', () => {
        const expectedUrl = `${config.url}/download/attachments/123/`;

        expect(api.getAttachmentPathForPage('123')).toBe(expectedUrl);
    });

    describe('getAttachments()', () => {
        test('without filename parameter', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123/child/attachment `;

            api.getAttachments('123', undefined, (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with filename parameter', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123/child/attachment?` +
                'filename=file.txt';

            api.getAttachments('123', 'file.txt', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with additional expand and pages parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/123/child/attachment?` +
                `${expectedExpandPages}&filename=file.txt `;

            api.getAttachments('123', 'file.txt', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            }, expand, pages);
        });
    });

    test('createAttachment()', () => {
        const file = '/Users/home/user/file.txt';
        const expectedUrl = `--url ${config.apiUrl}/content/123/child/attachment `;

        api.createAttachment('123', file, (command) => {
            expect(command).toMatch('--request POST');
            expect(command).toMatch(expectedUrl);
            expect(command).toMatch(`--form file=@${file} `);
            expect(command).toContainHeaders(config.requestHeaders);
        });
    });

    test('updateAttachment()', () => {
        const file = '/Users/home/user/file.txt';
        const expectedUrl = `--url ${config.apiUrl}/content/123/child/attachment/456/data `;

        api.updateAttachment('123', '456', file, (command) => {
            expect(command).toMatch('--request POST');
            expect(command).toMatch(expectedUrl);
            expect(command).toMatch(`--form file=@${file} `);
            expect(command).toContainHeaders(config.requestHeaders);
        });
    });

    describe('search()', () => {
        test('with minimal parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/search?` +
                `cql=something%20i%20need`;

            api.search('something i need', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with additional expand and pages parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/content/search?` +
                `${expectedExpandPages}&cql=something%20i%20need `;

            api.search('something i need', (command) => {
                expect(command).toMatch('--request GET');
                expect(command).toMatch(expectedUrl);
                expect(command).toContainHeaders(config.requestHeaders);
            }, expand, pages);
        });
    });

    describe('convertStorageToEditorFormat()', () => {
        const content = '<p>Some content.</p>';

        let expectedData;

        beforeEach(() => {
            expectedData = {
                value: content,
                representation: 'storage'
            };
        });

        test('with minimal parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/contentbody/convert/editor `;

            api.convertStorageToEditorFormat(content, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with additional expand parameter', () => {
            const expectedUrl = `--url ${config.apiUrl}/contentbody/convert/editor?` +
                `${expectedExpand} `;

            api.convertStorageToEditorFormat(content, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
                expect(command).toContainHeaders(config.requestHeaders);
            }, expand);
        });
    });

    describe('convertEditorToStorageFormat()', () => {
        const content = 'h1. Some content';

        let expectedData;

        beforeEach(() => {
            expectedData = {
                value: content,
                representation: 'editor'
            };
        });

        test('with minimal parameters', () => {
            const expectedUrl = `--url ${config.apiUrl}/contentbody/convert/storage `;

            api.convertEditorToStorageFormat(content, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
                expect(command).toContainHeaders(config.requestHeaders);
            });
        });

        test('with additional expand parameter', () => {
            const expectedUrl = `--url ${config.apiUrl}/contentbody/convert/storage?` +
                `${expectedExpand} `;

            api.convertEditorToStorageFormat(content, (command) => {
                expect(command).toMatch('--request POST');
                expect(command).toMatch(expectedUrl);
                expect(command).toMatch(`--data ${JSON.stringify(expectedData)} `);
                expect(command).toContainHeaders(config.requestHeaders);
            }, expand);
        });
    });
});
