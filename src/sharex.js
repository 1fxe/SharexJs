import { PORT } from './constants';
import { homeRouter } from './home';
import upload from 'express-fileupload';
import express from 'express';

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.use(
  upload({
    limits: { fileSize: 1000 * 1000 * 100 },
    safeFileNames: true,
    createParentPath: true,
  })
);
app.use(express.json());

app.use('/', homeRouter);

app.get('*', async (req, res) => {
  res.status(405).send('😠 What are you doing here?');
});

app.listen(PORT, () => {
  console.log(`Image uploader listening on port: ${PORT}`);
});
