require('dotenv').config();

const upload = require('express-fileupload');
const randomstring = require('randomstring');
const express = require('express');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.DOMAIN || 'localhost:' + PORT;
const SECURE = 'http';

app.set('views', './views');
app.set('view engine', 'pug');
app.use('/static', express.static('files'));
app.use(upload({ limits: { fileSize: 1000 * 1000 * 100 } }));
app.use(express.json());

app.post('/upload', async (req, res) => {
  if (req.body.key === process.env.KEY) {
    const file = req.files.file;
    const randomName = randomstring.generate({ length: 12 });
    const type = file.name.split('.');

    const fileName = await generateFileName(randomName, type);
    file.mv(`./files/${fileName}`, (err) => {
      if (err) return res.status(500).send(err);
      res.send(`${SECURE}://${DOMAIN}/${fileName}`);
    });
  } else {
    res.sendStatus(418);
  }
});

app.get('/:file', async (req, res) => {
  const file = req.params.file;
  const description = fs.stat(`./static/${file}`, (err, fileStats) => {
    if (err) {
      return 'N|A';
    } else {
      return convertBytes(fileStats.size);
    }
  });
  res.render('index', {
    title: DOMAIN,
    domain: DOMAIN,
    url: `${SECURE}://${DOMAIN}/`,
    description: description,
    image: `${SECURE}://${DOMAIN}/static/${file}`,
  });
});

app.get('*', async (req, res) => {
  res.sendStatus(418);
});

const generateFileName = async (str, type) => {
  return str + '.' + type[type.length - 1];
};

const convertBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes == 0) {
    return 'n/a';
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) {
    return bytes + ' ' + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

app.listen(PORT, () => {
  console.log(`Image uploader listening on port: ${PORT}`);
});
