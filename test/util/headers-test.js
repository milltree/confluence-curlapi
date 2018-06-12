import { addJsonContentTypeHeader, createHeaders } from '../../src/util/headers';

describe('Header utilities', () => {
    test('createHeaders()', () => {
        const headers = createHeaders('hello', 'world');

        expect(Object.keys(headers)).toHaveLength(3);
        expect(headers.Authorization).toBe(
            `Basic ${Buffer.from('hello:world').toString('base64')}`
        );
        expect(headers['X-Atlassian-Token']).toBe('no-check');
        expect(headers['User-Agent']).toBe('xx');
    });

    describe('addJsonContentTypeHeader()', () => {
        test('with empty headers', () => {
            const headers = addJsonContentTypeHeader({});

            expect(Object.keys(headers)).toHaveLength(1);
            expect(headers['Content-Type']).toBe('application/json');
        });

        test('with default headers', () => {
            const previousHeaders = {
                Authorization: 'Basic abc:xyz',
                'X-Atlassian-Token': 'no-check',
                'User-Agent': 'xx'
            };

            const headers = addJsonContentTypeHeader(previousHeaders);

            expect(Object.keys(headers)).toHaveLength(4);
            expect(headers.Authorization).toBe(previousHeaders.Authorization);
            expect(headers['X-Atlassian-Token']).toBe(previousHeaders['X-Atlassian-Token']);
            expect(headers['User-Agent']).toBe(previousHeaders['User-Agent']);
            expect(headers['Content-Type']).toBe('application/json');
        });

        test('with customized headers', () => {
            const previousHeaders = {
                Authorization: 'Basic abc:xyz',
                'X-Atlassian-Token': 'no-check',
                'User-Agent': 'firefox',
                'Content-Type': 'whatever',
                'Custom-Header': 'something'
            };

            const headers = addJsonContentTypeHeader(previousHeaders);

            expect(Object.keys(headers)).toHaveLength(5);
            expect(headers.Authorization).toBe(previousHeaders.Authorization);
            expect(headers['X-Atlassian-Token']).toBe(previousHeaders['X-Atlassian-Token']);
            expect(headers['User-Agent']).toBe(previousHeaders['User-Agent']);
            expect(headers['Custom-Header']).toBe(previousHeaders['Custom-Header']);
            expect(headers['Content-Type']).toBe('application/json');
        });
    });
});
