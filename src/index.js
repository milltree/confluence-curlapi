const curl = require('curlrequest');

/**
 * Confluence 5.5 and later
 */
export class Confluence {

	constructor(url, user, password) {
		this.url = url;
		this.apiUrl = url + '/rest/api';

		this.requestHeaders = createHeaders(user, password);

		this.pretend = false;

		this.createPage = this.createPage.bind(this);
		this.updatePageContent = this.updatePageContent.bind(this);
		this.getAttachmentPath = this.getAttachmentPath.bind(this);
		this.uploadAttachment = this.uploadAttachment.bind(this);
	}

	function setAdditionalRequestHeaders(additionalHeaders) {
		this.requestHeaders = {
			...this.requestHeaders,
			...additionalHeaders
		};
	}

	function setPretend(pretend) {
		this.pretend = pretend;
	}

	function findPageByTitle() {
		// TODO url encode title?

		// params: start, limit, expand

		curl.request({
			url: this.url + '/rest/api/content?title=' + title + '&spaceKey=' + spaceKey + '&expand=body.storage,version',
			method: 'GET',
			data: JSON.stringify(data),
			headers: this.requestHeaders,
			pretend: this.pretend
		}, (error, response) => {
			responseParsingCallback(error, response, callback);
		});
	}

	function getPageContent() {
		curl.request({
			url: this.url + '/rest/api/content/' + pageId + '?expand=body.storage,version',
			method: 'GET',
			data: JSON.stringify(data),
			headers: this.requestHeaders,
			pretend: this.pretend
		}, (error, response) => {
			responseParsingCallback(error, response, callback);
		});
	}

	function createSpace(spaceKey, title, description) {
		var data = {
			type: 'global',
			key: spaceKey,
			name: title,
			description: {
				plain: {
					value: description,
					representation: 'plain'
				}
			}
		};

		curl.request({
			url: this.url + '/rest/api/space',
			method: 'POST',
			data: JSON.stringify(data),
			headers: addJsonContentTypeHeader(this.requestHeaders),
			pretend: this.pretend
		}, (error, response) => {
			responseParsingCallback(error, response, callback);
		});
	}

	function createPage(spaceKey, parentPageId, title, content, callback) {
		var data = {
			type: 'page',
			title: title,
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

		curl.request({
			url: this.url + '/rest/api/content',
			method: 'POST',
			data: JSON.stringify(data),
			headers: addJsonContentTypeHeader(this.requestHeaders),
			pretend: this.pretend
		}, (error, response) => {
			responseParsingCallback(error, response, callback);
		});
	}

	function updatePageContent(spaceKey, pageId, title, content, newPageVersion, callback) {
		var data = {
			id: pageId,
			type: 'page',
			title: title,
			space: {
				key: spaceKey
			},
			version: {
				number: newPageVersion,
				minorEdit: false
			},
			body: {
				storage: {
					value: content,
					representation: 'storage'
				}
			}
		};

		curl.request({
			url: this.url + '/rest/api/content/' + pageId,
			method: 'PUT',
			data: JSON.stringify(data),
			headers: addJsonContentTypeHeader(this.requestHeaders),
			pretend: this.pretend
		}, (error, response) => {
			responseParsingCallback(error, response, callback);
		});
	}

	function movePage(spaceKey, pageId, title, newParentPageId, newPageVersion, callback) {
		var data = {
			id: pageId,
			type: 'page',
			title: title,
			space: {
				key: spaceKey
			},
			ancestors: [
				{
					id: newParentPageId
				}
			],
			version: {
				number: newPageVersion,
				minorEdit: false
			}
		};

		curl.request({
			url: this.url + '/rest/api/content/' + pageId,
			method: 'PUT',
			data: JSON.stringify(data),
			headers: addJsonContentTypeHeader(this.requestHeaders),
			pretend: this.pretend
		}, (error, response) => {
			responseParsingCallback(error, response, callback);
		});
	}

	function deletePage() {
		curl.request({
			url: this.url + '/rest/api/content/' + pageId,
			method: 'DELETE',
			headers: this.requestHeaders,
			pretend: this.pretend
		}, (error, response) => {
			responseParsingCallback(error, response, callback);
		});
	}

	function getAttachmentPathForPage(pageId) {
		return this.url + '/download/attachments/' + pageId + '/';
	}

	function uploadAttachment(pageId, file, callback) {
		curl.request({
			url: this.url + '/rest/api/content/' + pageId + '/child/attachment',
			method: 'POST',
			form: 'file=@' + file,
			headers: this.requestHeaders,
			pretend: this.pretend
		}, (error, response) => {
			responseParsingCallback(error, response, callback);
		});
	}

	function convertStorageToViewFormat() {
		curl -u admin:admin -X POST -H 'Content-Type: application/json' -d'{"value":"<ac:structured-macro 
ac:name=\"cheese\" />","representation":"storage"}' 
"http://localhost:8080/confluence/rest/api/contentbody/convert/view" | python -mjson.tool

	}

	function convertStorageToViewFormatWithContext() {
		curl -u admin:admin -X POST -H 'Content-Type: application/json' -d'{"representation":"storage",
"value":"<p><ac:structured-macro ac:name=\"space-attachments\"/></p>","content":{"id":"1448805348"}}' 
"http://localhost:8080/confluence/rest/api/contentbody/convert/view" | python -mjson.tool

	}

	function convertViewToStorageFormat() {
		curl -u admin:admin -X POST -H 'Content-Type: application/json' -d'{"value":"{cheese}",
"representation":"wiki"}' "http://localhost:8080/confluence/rest/api/contentbody/convert/storage" 
| python -mjson.tool

	}
}

function createHeaders(user, password) {
	const encodedCredentials = new Buffer(options.wikiUser + ':' + options.wikiPassword).toString('base64');

	return {
		Authorization: 'Basic ' + encodedCredentials,
		'X-Atlassian-Token': 'no-check',
		'User-Agent': 'xx'
	};
}

function addJsonContentTypeHeader(requestHeaders) {
	return {
		...requestHeaders,
		'Content-Type': 'application/json'
	};
}

function responseParsingCallback(error, response, callback) {
	var jsonResponse;
	if (!error && response) {
		try {
			jsonResponse = JSON.parse(response);
			if (jsonResponse.statusCode > 300) {
				callback(response, undefined);
			}
		} catch (jsonError) {
			// in this case Confluence usually returned an HTML error page
			callback(response, undefined);
		}
	}
	callback(error, jsonResponse);
}
