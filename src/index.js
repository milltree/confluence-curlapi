var curl = require('curlrequest');

function getAttachmentPath(options, page) {
	return options.wikiUrl + '/download/attachments/' + page.id + '/';
}

function postNewPage(options, parentPageId, title, callback) {
	var data = {
		type: 'page',
		title: title,
		ancestors: [{
			id: parentPageId,
			type: 'page'
		}],
		space: {
			key: options.wikiSpace
		},
		body: {
			storage: {
				value: '',
				representation: 'storage'
			}
		}
	};

	curl.request({
		url: options.wikiUrl + '/rest/api/content',
		method: 'POST',
		data: JSON.stringify(data),
		headers: createHeadersWithJsonContentType(options)
	}, function (error, response) {
		responseParsingCallback(error, response, callback);
	});
}

function postPageContent(options, page, content, callback) {
	var data = {
		id: page.id,
		type: 'page',
		title: page.title,
		space: {
			key: options.wikiSpace
		},
		version: {
			number: page.version + 1,
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
		url: options.wikiUrl + '/rest/api/content/' + page.id,
		method: 'PUT',
		data: JSON.stringify(data),
		headers: createHeadersWithJsonContentType(options)
	}, function (error, response) {
		responseParsingCallback(error, response, callback);
	});
}

function postFile(options, pageId, file, callback) {
	curl.request({
		url: options.wikiUrl + '/rest/api/content/' + pageId + '/child/attachment',
		method: 'POST',
		form: 'file=@' + file,
		headers: createHeaders(options)
	}, function (error, response) {
		responseParsingCallback(error, response, callback);
	});
}

function createHeaders(options) {
	return {
		Authorization: 'Basic ' + new Buffer(options.wikiUser + ':' + options.wikiPassword).toString('base64'),
		'X-Atlassian-Token': 'no-check',
		'User-Agent': 'xx'
	};
}

function createHeadersWithJsonContentType(options) {
	return Object.assign(createHeaders(options), {
		'Content-Type': 'application/json'
	});
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
			// in this case Confluence probably returned an HTML error page
			console.error(jsonError);
			callback(response, undefined);
		}
	}
	callback(error, jsonResponse);
}
