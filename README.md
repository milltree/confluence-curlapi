# Confluence Curl API

This is a wrapper for Atlassian's Confluence Rest API based on Node.js and `curl`.

[Overview of the Confluence Rest API](https://docs.atlassian.com/atlassian-confluence/REST)

[Example requests for the Confluence Rest API](https://developer.atlassian.com/server/confluence/confluence-rest-api-examples/)

## Getting started

Install confluence-curlapi via npm:

`$ npm install confluence-curlapi`

The API provides the following implementations:

- `ConfluenceConfig`: Wraps and prepares the configuration required by all Rest API calls, e.g. username, password and URL. This configuration needs to be provided to the concrete API instance to be used.
- `ConfluenceContentApi`: Provides convenience methods for searching, fetching and manipulating page contents including attachments. This API is based on the `ConfluenceRawApi`.
- `ConfluenceRawApi`: Provides methods on the most basic level for general GET/POST/PUT/DELETE requests to the Rest API. These methods should be sufficient to use all methods offered by the Confluence Rest API.

## Configuration

Create an instance of `ConfluenceConfig` by providing a username and password (Confluence uses basic HTTP authentication) and a URL used as base URL for all Rest API calls. For example:

```
import { ConfluenceConfig } from 'confluence-curlapi';

var config = new ConfluenceConfig('https://confluence.somecompany.de', 'username', 'password');
```

`ConfluenceConfig` provides the following methods:

### new ConfluenceConfig(url, username, password)

Creates a new instance of `ConfluenceConfig`.

| Parameter |  Type  |  Description                                                 |
| --------- | ------ | ------------------------------------------------------------ |
| url       | string | The base URL of Confluence without the Rest-API context path |
| username  | string |                                                              |
| password  | string |                                                              |

### config.addRequestHeaders(additionalHeaders)

Via this method you can add additional request headers that shall be used for every Rest API call. Furthermore you can also overwrite the automatically generated request headers if you need to.

| Parameter         |  Type  |  Description                 |
| ----------------- | ------ | ---------------------------- |
| additionalHeaders | Object | {<headerName>:<headerValue>} |

### config.setPretend(pretend)

If set to true, the requests to the Confluence Rest API will not be actually sent. Instead the created `curl` command for the request will be provided to the corresponding callback function within the `error` parameter. The `response` parameter will be empty in this case.

| Parameter |  Type   |  Description |
| --------- | ------- | ------------ |
| pretend   | boolean |

## Content API

Create an instance of `ConfluenceContentApi` by providing a `ConfluenceConfig` instance. For example:

```
import { ConfluenceConfig, ConfluenceContentApi } from 'confluence-curlapi';

var config = new ConfluenceConfig('https://confluence.somecompany.de', 'username', 'password');
var api = new ConfluenceContentApi(config);
```

`ConfluenceContentApi` provides the following methods:

### new ConfluenceContentApi(config)

Creates a new instance of `ConfluenceContentApi`.

| Parameter |  Type            |  Description |
| --------- | ---------------- | ------------ |
| config    | ConfluenceConfig |              |

### findPageByTitle(spaceKey, title, callback, expand, pages)

Find all pages matching the given title within the given Confluence space.

| Parameter |  Type    |  Description                                                  |
| --------- | -------- | ------------------------------------------------------------- |
| spaceKey  | string   |                                                               |
| title     | string   |                                                               |
| callback  | function | function(error,response)                                      |
| expand    | string   | Optional                                                      |
| pages     | Object   | Optional, {start:<start-index>,limit:<max-number-of-results>} |

### getPageContent(pageId, callback, expand)

Fetch the content of the page with the given ID.

| Parameter |  Type         |  Description             |
| --------- | ------------- | ------------------------ |
| pageId    | string,number |                          |
| callback  | function      | function(error,response) |
| expand    | string        | Optional                 |

### getSubPages(pageId, callback, expand, pages)

Fetch the sub-pages of the page with the given ID.

| Parameter |  Type         |  Description                                                  |
| --------- | ------------- | ------------------------------------------------------------- |
| pageId    | string,number |                                                               |
| callback  | function      | function(error,response)                                      |
| expand    | string        | Optional                                                      |
| pages     | Object        | Optional, {start:<start-index>,limit:<max-number-of-results>} |

### createPage(spaceKey, parentPageId, title, content, callback, expand)

Create a new page in the given Confluence space either as sub-page of the given parent page or as direct sub-page of the space.

| Parameter    |  Type         |  Description                       |
| ------------ | ------------- | ---------------------------------- |
| spaceKey     | string        |                                    |
| parentPageId | string,number | Optional                           |
| title        | string        | Plain text                         |
| content      | string        | Content in storage format          |
| callback     | function      | Optional, function(error,response) |
| expand       | string        | Optional                           |

### updatePageContent(pageId, title, content, nextPageVersion, callback)

Update content and title of the page with the given ID.

| Parameter       |  Type         |  Description                       |
| --------------- | ------------- | ---------------------------------- |
| pageId          | string,number |                                    |
| title           | string        | Plain text                         |
| content         | string        | Content in storage format          |
| nextPageVersion | number        | Must be the next page version      |
| callback        | function      | Optional, function(error,response) |

### movePage(pageId, spaceKey, parentPageId, title, nextPageVersion, callback)

Move the page with the given page ID to a new parent page within the same Confluence space.

| Parameter       |  Type         |  Description                                      |
| --------------- | ------------- | ------------------------------------------------- |
| pageId          | string,number |                                                   |
| spaceKey        | string        | Optional, Confluence space of the new parent page |
| parentPageId    | string,number | ID of the new parent page                         |
| title           | string        |                                                   |
| nextPageVersion | number        | Must be the next page version                     |
| callback        | function      | Optional, function(error,response)                |

### deletePage(pageId, callback)

Delete the page with the given ID.

| Parameter |  Type         |  Description                       |
| --------- | ------------- | ---------------------------------- |
| pageId    | string,number |                                    |
| callback  | function      | Optional, function(error,response) |

### getAttachmentPathForPage(pageId)

Returns the attachment base path required to refer to an attachment of the page with the given ID.

| Parameter |  Type         |  Description |
| --------- | ------------- | ------------ |
| pageId    | string,number |              |

### getAttachments(pageId, filename, callback, expand, pages)

Fetch the attachments of the page with the given ID, optionally filtered by a given filename.

| Parameter |  Type         |  Description                                                      |
| --------- | ------------- | ----------------------------------------------------------------- |
| pageId    | string,number |                                                                   |
| filename  | string        | Optional                                                          |
| callback  | function      | function(error,response)                                          |
| expand    | string        | Optional                                                          |
| pages     | Object        | Optional, {start:<start-index>,limit:<max-number-of-attachments>} |

### createAttachment(pageId, file, callback)

Upload a new attachment to the page with the given ID.

| Parameter |  Type         |  Description                        |
| --------- | ------------- | ----------------------------------- |
| pageId    | string,number |                                     |
| file      | string        | Absolute path to the file to upload |
| callback  | function      | Optional, function(error,response)  |

### updateAttachment(pageId, attachmentId, file, callback)

Upload a new version of an attachment with the given ID to the corresponding page.

| Parameter    |  Type         |  Description                        |
| ------------ | ------------- | ----------------------------------- |
| pageId       | string,number |                                     |
| attachmentId | string,number |                                     |
| file         | string        | Absolute path to the file to upload |
| callback     | function      | Optional, function(error,response)  |

### search(cql, callback, expand, pages)

Search all contents by the given CQL (Confluence Query Language).

| Parameter |  Type    |  Description                                                |
| --------- | -------- | ----------------------------------------------------------- |
| cql       | string   | CQL search query                                            |
| callback  | function | function(error,response)                                    |
| expand    | string   | Optional                                                    |
| pages     | Object   | Optional, {start:<start-index>,limit:<max-number-of-items>} |

### convertStorageToEditorFormat(content, callback, expand)

Convert the given content from storage format to editor format.

| Parameter |  Type    |  Description              |
| --------- | -------- | ------------------------- |
| content   | string   | Content in storage format |
| callback  | function | function(error,response)  |
| expand    | string   | Optional                  |

### convertEditorToStorageFormat(content, callback, expand)

Convert the given content from editor format to storage format.

| Parameter |  Type    |  Description             |
| --------- | -------- | ------------------------ |
| content   | string   | Content in editor format |
| callback  | function | function(error,response) |
| expand    | string   | Optional                 |

### convertFormats(sourceFormat, targetFormat, content, callback, expand)

Convert the given content from a given source format to a given target format.

| Parameter    |  Type    |  Description                                                              |
| ------------ | -------- | ------------------------------------------------------------------------- |
| sourceFormat | string   | One of the supported source formats as defined by the Confluence Rest API |
| targetFormat | string   | One of the supported target formats as defined by the Confluence Rest API |
| content      | string   | Content in source format                                                  |
| callback     | function | function(error,response)                                                  |
| expand       | string   | Optional                                                                  |

## Raw API

Create an instance of `ConfluenceRawApi` by providing a `ConfluenceConfig` instance. For example:

```
import { ConfluenceConfig, ConfluenceRawApi } from 'confluence-curlapi';

var config = new ConfluenceConfig('https://confluence.somecompany.de', 'username', 'password');
var api = new ConfluenceRawApi(config);
```

`ConfluenceRawApi` provides the following methods:

### new ConfluenceRawApi(config)

Creates a new instance of `ConfluenceRawApi`.

| Parameter |  Type            |  Description |
| --------- | ---------------- | ------------ |
| config    | ConfluenceConfig |              |

### get(path, queryParams, callback)

Sends a GET request to the given path of the Rest API.

| Parameter   |  Type    |  Description                                             |
| ----------- | -------- | -------------------------------------------------------- |
| path        | string   | Sub-path of the Rest API method to call, e.g. '/content' |
| queryParams | Object   | Optional, {<param-name>:<param-value>}                   |
| callback    | function | function(error,response)                                 |

### post(path, queryParams, data, callback)

Sends a POST request with form data to the given path of the Rest API.

| Parameter   |  Type    |  Description                                             |
| ----------- | -------- | -------------------------------------------------------- |
| path        | string   | Sub-path of the Rest API method to call, e.g. '/content' |
| queryParams | Object   | Optional, {<param-name>:<param-value>}                   |
| data        | Object   | JSON-compatible data object                              |
| callback    | function | Optional, function(error,response)                       |

### postFile(path, queryParams, file, callback)

Sends a POST request with a file to the given path of the Rest API.

| Parameter   |  Type    |  Description                                             |
| ----------- | -------- | -------------------------------------------------------- |
| path        | string   | Sub-path of the Rest API method to call, e.g. '/content' |
| queryParams | Object   | Optional, {<param-name>:<param-value>}                   |
| file        | string   | Absolute path to the file to upload                      |
| callback    | function | Optional, function(error,response)                       |

### put(path, queryParams, data, callback)

Sends a PUT request with form data to the given path of the Rest API.

| Parameter   |  Type    |  Description                                             |
| ----------- | -------- | -------------------------------------------------------- |
| path        | string   | Sub-path of the Rest API method to call, e.g. '/content' |
| queryParams | Object   | Optional, {<param-name>:<param-value>}                   |
| data        | Object   | JSON-compatible data object                              |
| callback    | function | Optional, function(error,response)                       |

### delete(path, queryParams, callback)

Sends a DELETE request to the given path of the Rest API.

| Parameter   |  Type    |  Description                                             |
| ----------- | -------- | -------------------------------------------------------- |
| path        | string   | Sub-path of the Rest API method to call, e.g. '/content' |
| queryParams | Object   | Optional, {<param-name>:<param-value>}                   |
| callback    | function | Optional, function(error,response)                       |
