import { PORT, DOMAIN, SECURE, URL } from './constants';
import { generate } from 'randomstring';
import { randomColor } from 'randomcolor';
import { imageOCR } from './image';
import { existsSync } from 'fs';

import upload from 'express-fileupload';
import express from 'express';

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.use('/static', express.static('files'));
app.use(upload({ limits: { fileSize: 1000 * 1000 * 100 } }));
app.use(express.json());

app.post('/upload', async (req, res) => {
  if (req.body.key === process.env.KEY) {
    const file = req.files.file;
    const randomName = generate({ length: 12 });
    const type = file.name.split('.');
    const fileName = await generateFileName(randomName, type);

    file.mv(`./files/${fileName}`, (err) => {
      if (err) return res.status(500).send(err);
      res.send(`${URL}${fileName}`);
    });
  } else {
    res.sendStatus(418);
  }
});

app.get('/:file', async (req, res) => {
  const file = req.params.file;
  const path = `files/${file}`;

  if (!existsSync(path)) {
    return res.sendStatus(418);
  }

  const description = await imageOCR(path);

  res.render('index', {
    title: file,
    domain: DOMAIN,
    url: URL,
    description: description,
    image: `${SECURE}://${DOMAIN}/static/${file}`,
    color: randomColor(),
  });
});

app.get('*', async (req, res) => {
  res.sendStatus(418);
});

app.listen(PORT, () => {
  console.log(`Image uploader listening on port: ${PORT}`);
});

const generateFileName = async (str, type) => {
  return str + '.' + type[type.length - 1];
};
