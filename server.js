const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const util = require('util');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'text/plain' }));
// Uncomment this out once you've made your first route.
//app.use(express.static(path.join(__dirname, 'client', 'build')));

// some helper functions you can use
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);

// some more helper functions
const DATA_DIR = 'data';
const TAG_RE = /#\w+/g;
function slugToPath(slug) {
  const filename = `${slug}.md`;
  return path.join(DATA_DIR, filename);
}
function jsonOK(res, data) {
  res.json({ status: 'ok', ...data });
}
function jsonError(res, message) {
  res.json({ status: 'error', message });
}


app.use(express.static(path.join(__dirname, 'client', 'build')));

// GET: '/api/pages/all'
// success response: {status:'ok', pages: ['fileName', 'otherFileName']}
//  file names do not have .md, just the name!
// failure response: no failure response
app.get('/api/pages/all', (req, res) => {
  readDir(DATA_DIR)
    .then((names) => {
      console.log(names);
      console.log({ status: 'ok', pages: names });
      res.send({ status: 'ok', pages: names });
    })
    .catch((err) => {
      console.log('Error', err);
      res.send({ status: 'error', pages: 'Pages do not exist.' });
    });
});
// GET: '/api/page/:slug'
// success response: {status: 'ok', body: '<file contents>'}
// failure response: {status: 'error', message: 'Page does not exist.'}
app.get('/api/page/:slug', (req, res) => {

  let slugParam = req.params.slug;
  console.log(slugParam);
  const slugPath = slugToPath(slugParam.replace('.md', '').toLowerCase());
  readFile(slugPath, 'utf8')
    .then((text) => {
      console.log(text);
      res.send({ status: 'ok', body: text });
    })
    .catch((err) => {
      console.log('Error', err);
      res.send({ status: 'error', message: 'Page does not exist.' });
    });

});
// POST: '/api/page/:slug'
// body: {body: '<file text content>'}
// success response: {status: 'ok'}
// failure response: {status: 'error', message: 'Could not write page.'}
app.post('/api/page/:slug', (req, res) => {

  let body = req.body;
  const slugParam = req.params.slug;
  console.log(slugParam);
  const slugPath = slugToPath(slugParam.replace('.md', '').toLowerCase());
  console.log(slugPath, body);
  writeFile(slugPath, body.body, 'utf8')
    .then(() => {
      res.send({ status: 'ok' });
    })
    .catch((err) => {
      console.log('Error', err);
      res.send({ status: 'error', message: 'Could not write page.' });
    });

});


// GET: '/api/tags/all'
// success response: {status:'ok', tags: ['tagName', 'otherTagName']}
//  tags are any word in all documents with a # in front of it
// failure response: no failure response
app.get('/api/tags/all', (req, res) => {
  console.log(DATA_DIR);
  readDir(DATA_DIR, 'utf8')
    .then((list) => {
      let listFilesTags = [];
      list.forEach(file => {
        const slugPath = slugToPath(file.replace('.md', '').toLowerCase());
        const fileContent = fs.readFileSync(slugPath, 'utf8');

        // We want full words, so we use full word boundary in regex.
        const regex = new RegExp(TAG_RE);
        if (regex.test(fileContent)) {
          console.log('file content is ' + fileContent);
          let tagList = fileContent.match(regex);
          console.log('tag is ' + tagList)
          tagList.forEach((item) => {
            if (!listFilesTags.includes(item.replace('#', '')))
              listFilesTags.push(item.replace('#', ''))
          });
        }
      });
      console.log(listFilesTags);
      res.send({ status: 'ok', tags: listFilesTags });
    })
    .catch((err) => {
      console.log('Error', err);
      res.send({ status: 'error', message: 'error happened !' });
    });

});
// GET: '/api/tags/:tag'
// success response: {status:'ok', tag: 'tagName', pages: ['tagName', 'otherTagName']}
//  file names do not have .md, just the name!
// failure response: no failure response
app.get('/api/tags/:tag', (req, res) => {

  const tagParam = req.params.tag;
  console.log(tagParam);
  readDir(DATA_DIR, 'utf8')
    .then((list) => {
      let listFilesTags = [];
      list.forEach(file => {
        const slugPath = slugToPath(file.replace('.md', '').toLowerCase());
        const fileContent = fs.readFileSync(slugPath, 'utf8');

        // We want full words, so we use full word boundary in regex.
        console.log('#' + tagParam);
        //const regex = new RegExp('# ' + tagParam);
        if (fileContent.indexOf('#' + tagParam) >= 0) {
          listFilesTags.push(file)
          console.log(`Your word was found in file: ${file}`);
        }
      });
      console.log(listFilesTags);
      res.send({ status: 'ok', tag: tagParam, pages: listFilesTags });
    })
    .catch((err) => {
      console.log('Error', err);
      res.send({ status: 'error', message: 'error happened !' });
    });
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));

});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Wiki app is serving at http://localhost:${port}`));
