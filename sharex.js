const express = require('express');
const upload = require('express-fileupload');
const randomstring = require('randomstring');
const app = express();

const domain = 'images.example.com';

//You can specify your own direcoty and change the upload directory
app.use(express.static(__dirname));

//Specify file upload limit
app.use(upload({ limits: { fileSize: 20000000000 } }));
app.use(express.json());

app.get('/', (req, res) => {
	res.sendStatus(403);
});

app.post('/upload', (req, res) => {
	if (req.body.key === process.env.KEY) {
		const file = req.files.file;
		const randomName = randomstring.generate({ length: 12 });
		const type = file.name.split('.');
		const fileName = randomName + '.' + type[1];
		file.mv(`./${fileName}`, (err) => {
			if (err) return res.status(500).send(err);
			res.send(`https://${domain}/${fileName}`);
		});
	} else {
		res.sendStatus(403);
	}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Image uploader listening on port: ${PORT}`);
});
