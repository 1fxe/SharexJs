import {
  checkForKey,
  checkIfFileExists,
  detectImageColor,
  imageLabel,
} from './functions';
import { DIR, DOMAIN, URL } from './constants';
import { generate } from 'randomstring';
import { Router } from 'express';

const homeRouter = Router();

homeRouter.route('/upload').post(checkForKey, async (req, res) => {
  const randomName = generate({ length: 6 });
  const file = req.files.file;
  const type = file.mimetype.split('/')[1];
  const name = randomName + '.' + type;

  file.mv(`${DIR}/${name}`);
  res.send(`${URL}${name}`);
});

homeRouter.route('/:file').get(checkIfFileExists, async (req, res) => {
  const file = res.locals.file;
  const path = res.locals.path;

  const description = await imageLabel(path);
  const color = await detectImageColor(path);
  res.render('index', {
    title: file,
    domain: DOMAIN,
    url: URL,
    description: description,
    image: `${URL}static/${file}`,
    color: color,
  });
});

export { homeRouter };
