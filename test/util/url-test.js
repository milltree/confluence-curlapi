import { createUrl } from '../../src/util/url';

describe('Create URL', () => {
    test('without path', () => {
        let caughtError;
        try {
            createUrl('http://www.test.de', '');
        } catch (error) {
            caughtError = error;
        }
        expect(caughtError).not.toBeUndefined();
    });

    test('with base URL ending with a slash', () => {
        const url = createUrl('http://www.test.de', 'context');

        expect(url).toBe('http://www.test.de/context');
    });

    test('with path not starting with a slash', () => {
        const url = createUrl('http://www.test.de/', '/context');

        expect(url).toBe('http://www.test.de/context');
    });

    test('with base URL already containing a path', () => {
        const url = createUrl('http://www.test.de/some', '/context');

        expect(url).toBe('http://www.test.de/some/context');
    });

    test('without parameters', () => {
        const url = createUrl('http://www.test.de', '/context');

        expect(url).toBe('http://www.test.de/context');
    });

    test('with only NULL or undefined parameters', () => {
        const url = createUrl('http://www.test.de', '/context', {
            one: null,
            two: undefined
        });

        expect(url).toBe('http://www.test.de/context');
    });

    test('with valid parameters', () => {
        const url = createUrl('http://www.test.de', '/context', {
            one: null,
            two: 'hello',
            three: 'world',
            four: 5
        });

        expect(url).toBe('http://www.test.de/context?two=hello&three=world&four=5');
    });
});
