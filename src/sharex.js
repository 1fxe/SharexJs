require('dotenv').config();

const upload = require('express-fileupload');
const randomstring = require('randomstring');
const express = require('express');
const app = express();

// your domain
const domain = 'localhost:5000';

//Serve static files from ./files directory
app.use(express.static('files'));

//Specify file upload limit 100mb (may need to change on cloudflare/nginx)
app.use(upload({ limits: { fileSize: 1000 * 1000 * 100 } }));
app.use(express.json());

app.post('/upload', (req, res) => {
  if (req.body.key === process.env.KEY) {
    const file = req.files.file;
    const randomName = randomstring.generate({ length: 12 });
    const type = file.name.split('.');

    const fileName = randomName + '.' + type[type.length - 1];
    file.mv(`./files/${fileName}`, (err) => {
      if (err) return res.status(500).send(err);
      res.send(`http://${domain}/${fileName}`);
    });
  } else {
    res.sendStatus(418);
  }
});

// Catch all
app.get('*', (req, res) => {
  res.sendStatus(418);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Image uploader listening on port: ${PORT}`);
});
