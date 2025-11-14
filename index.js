require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

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

  try {
    new URL(inputUrl);
  } catch {
    return res.json({ error: 'invalid url' });
  }

  const hostname = urlParser.parse(inputUrl).hostname;

  dns.lookup(hostname, (err) => {
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
