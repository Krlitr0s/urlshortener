require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = []; 
app.post('/api/shorturl', (req, res) => {
  const inputUrl = req.body.url;

  let urlObject;
  try {
    urlObject = new URL(inputUrl);
  } catch (e) {
    return res.json({ error: 'invalid url' });
  }
  if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(urlObject.hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const id = urls.length + 1;
    urls.push({ id, original_url: inputUrl });

    res.json({
      original_url: inputUrl,
      short_url: id
    });
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = Number(req.params.id);

  const entry = urls.find((u) => u.id === id);

  if (!entry) {
    return res.json({ error: 'No short URL found' });
  }

  res.redirect(entry.original_url);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
