import { ImageAnnotatorClient } from '@google-cloud/vision';
import { statSync, existsSync } from 'fs';
import { DIR } from './constants';
import byteSize from 'byte-size';

const client = new ImageAnnotatorClient();

const detectImageColor = async (path) => {
  try {
    const [result] = await client.imageProperties(path);
    const colors = result.imagePropertiesAnnotation.dominantColors.colors;
    colors.sort((a, b) => {
      a.score - b.score;
    });
    const dominant = colors[0].color;
    return rgbToHex(dominant.red, dominant.green, dominant.blue);
  } catch (err) {
    return '#fff';
  }
};

const imageOCR = async (path) => {
  try {
    const [result] = await client.textDetection(path);
    const detections = result.textAnnotations;

    if (detections.length < 1) {
      const text = await getFileStats(path);
      return text;
    }
    const text = detections
      .filter((t) => t.locale === '')
      .map((t) => {
        return t.description;
      })
      .join(' ');
    return `OCR: ${text}`;
  } catch (err) {
    const text = await getFileStats(path);
    return text;
  }
};

const imageLabel = async (path) => {
  try {
    const [result] = await client.labelDetection(path);
    result.labelAnnotations.sort((a, b) => {
      a.score - b.score;
    });

    if (result.labelAnnotations.length < 3) {
      const topLabels = result.labelAnnotations
        .splice(3)
        .map((l) => l.description)
        .join(', ');
      return `Vision API: ${topLabels}`;
    } else return await imageOCR(path);
  } catch (err) {
    const text = await getFileStats(path);
    return text;
  }
};

const getFileStats = async (path) => {
  const stats = statSync(path);
  return `😓 I wasted ${byteSize(stats.size)}`;
};

const checkForKey = (req, res, next) => {
  const key = req.body.key;

  if (key === process.env.KEY) next();
  else res.status(405).end('😦 Unauthorized');
};

const checkIfFileExists = (req, res, next) => {
  const file = req.params.file;
  const path = `${DIR}/${file}`;
  res.locals.file = file;
  res.locals.path = path;
  if (!existsSync(path)) return res.status(404).send('😓 File not found');
  else next();
};

const componentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

const rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export { detectImageColor, imageLabel, checkForKey, checkIfFileExists };
