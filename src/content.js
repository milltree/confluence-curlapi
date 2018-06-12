import { ConfluenceRawApi } from './raw';

import { createUrl } from './util/url';

/**
 * Provides basic methods:
 * <ul>
 * <li>to find, create, modify and delete pages</li>
 * <li>to find, create and modify attachments</li>
 * <li>to convert page content between different formats</li>
 * </ul>
 */
export class ConfluenceContentApi extends ConfluenceRawApi {

    constructor(config) {
        super(config);

        this.findPageByTitle = this.findPageByTitle.bind(this);
        this.getPageContent = this.getPageContent.bind(this);
        this.createPage = this.createPage.bind(this);
        this.updatePageContent = this.updatePageContent.bind(this);
        this.movePage = this.movePage.bind(this);
        this.deletePage = this.deletePage.bind(this);
        this.getAttachmentPathForPage = this.getAttachmentPathForPage.bind(this);
        this.createAttachment = this.createAttachment.bind(this);
        this.convertEditorToStorageFormat = this.convertEditorToStorageFormat.bind(this);
        this.convertStorageToEditorFormat = this.convertStorageToEditorFormat.bind(this);
        this.convertFormats = this.convertFormats.bind(this);
    }

    findPageByTitle(spaceKey, title, callback, expand, pages) {
        const params = buildParameters(expand, pages, { spaceKey, title });

        this.get('/content', params, callback);
    }

    getPageContent(pageId, callback, expand) {
        const params = buildParameters(expand);

        this.get(`/content/${pageId}`, params, callback);
    }

    getSubPages(pageId, callback, expand, pages) {
        const params = buildParameters(expand, pages);

        this.get(`/content/${pageId}/child/page`, params, callback);
    }

    createPage(spaceKey, parentPageId, title, content, callback, expand) {
        const params = buildParameters(expand);

        const data = {
            type: 'page',
            title,
            ancestors: parentPageId ? [{
                id: parentPageId,
                type: 'page'
            }] : [],
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

        this.post('/content', params, data, callback);
    }

    updatePageContent(pageId, title, content, nextPageVersion, callback) {
        const data = {
            id: pageId,
            type: 'page',
            title,
            version: {
                number: nextPageVersion,
                minorEdit: false
            },
            body: {
                storage: {
                    value: content,
                    representation: 'storage'
                }
            }
        };

        this.put(`/content/${pageId}`, undefined, data, callback);
    }

    movePage(pageId, spaceKey, parentPageId, title, nextPageVersion, callback) {
        const data = {
            id: pageId,
            type: 'page',
            title,
            space: spaceKey ? {
                key: spaceKey
            } : {},
            ancestors: [
                {
                    id: parentPageId
                }
            ],
            version: {
                number: nextPageVersion,
                minorEdit: false
            }
        };

        this.put(`/content/${pageId}`, undefined, data, callback);
    }

    deletePage(pageId, callback) {
        this.delete(`/content/${pageId}`, undefined, callback);
    }

    getAttachmentPathForPage(pageId) {
        return createUrl(this.config.url, `/download/attachments/${pageId}/`);
    }

    getAttachments(pageId, filename, callback, expand, pages) {
        const params = buildParameters(expand, pages, { filename });

        this.get(`/content/${pageId}/child/attachment`, params, callback);
    }

    createAttachment(pageId, file, callback) {
        this.postFile(`/content/${pageId}/child/attachment`, undefined, file, callback);
    }

    updateAttachment(pageId, attachmentId, file, callback) {
        this.postFile(`/content/${pageId}/child/attachment/${attachmentId}/data`,
            undefined, file, callback);
    }

    search(cql, callback, expand, pages) {
        const params = buildParameters(expand, pages, { cql });

        this.get('/content/search', params, callback);
    }

    convertStorageToEditorFormat(content, callback, expand) {
        this.convertFormats('storage', 'editor', content, callback, expand);
    }

    convertEditorToStorageFormat(content, callback, expand) {
        this.convertFormats('editor', 'storage', content, callback, expand);
    }

    convertFormats(sourceFormat, targetFormat, content, callback, expand) {
        const params = buildParameters(expand);

        const data = {
            value: content,
            representation: sourceFormat
        };

        this.post(`/contentbody/convert/${targetFormat}`, params, data, callback);
    }
}

function buildParameters(expand, pages, rest) {
    return {
        expand,
        start: pages ? pages.start : undefined,
        limit: pages ? pages.limit : undefined,
        ...rest
    };
}
