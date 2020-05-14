# Do-It-Yourself Wiki: Development Strategy

Building this site one step at a time

---

## 0. README

- Write the `README.md`, including the final screen shot
- Include a License
- Include this `development-strategy.md` file

## 1. User Story:Get an Existing Page

Calling this route should return a response with a property called `body` containing the text stored inside the file with the name `:slug`

- _method_: GET
- _path_: `"/api/page/:slug"`
- _success response_: `{status: 'ok', body: '<file contents>'}`
- _failure response_: `{status: 'error', message: 'Page does not exist.'}`

## 2. User Story: Post a New Page

Calling this route with a `body` property in the body of your HTTP Request, and a file name in the `:slug` URL parameter will add a new markdown file to the `./wiki-server/data` directory

- _method_: POST
- _path_: `"/api/page/:slug"`
- _body_: `{body: '<file content>'}`
- _success response_: `{status: 'ok'}`
- _failure response_: `{status: 'error', message: 'Could not write page.'}`

## 3. User Story:Get All Page Names

Calling this route will return a response with a property called `pages` which is an array containing all of the file names in `./wiki-server/data`.

- _method_: GET
- _path_: `"/api/page/all"`
- _success response_: `{status:'ok', pages: ['fileName', 'otherFileName']}`
- _failure response_: (none)

## 4. User Story: Get All tags

Calling this route will return a response with a property called `tags` which is an array containing all of the tagged words in all of the files of `./wiki-server/data`. Tagged words are any word in a file with a # in front of it, like so `#tree`. Or `#table`,

- _method_: GET
- _path_: `"/api/tags/all"`
- _success response_: `{status:'ok', tags: ['tagName', 'otherTagName']}`
- _failure response_: (none)

## 5. User Story: Get Page Names by Tag

Calling this route will return a response with a property called `tag` which indicates which tag was used to search, and a property called `pages` which is an array of all the file names containing that tag

- _method_: GET
- _path_: `"/api/tags/:tag"`
- _success response_: `{status:'ok', tag: 'tagName', pages: ['tagName', 'otherTagName']}`
- _failure response_: (none)
