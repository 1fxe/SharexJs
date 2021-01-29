import { ImageAnnotatorClient } from '@google-cloud/vision';
import byteSize from 'byte-size';
import { statSync } from 'fs';

const clientOptions = { apiEndpoint: 'eu-vision.googleapis.com' };

const client = new ImageAnnotatorClient(clientOptions);

const imageOCR = async (path) => {
  try {
    const [result] = await client.textDetection(path);
    const detections = result.textAnnotations;
    const text = detections
      .filter((t) => t.locale === '')
      .map((t) => {
        return t.description;
      })
      .join(' ');
    return text !== '' ? `OCR: ${text}` : await imageLabel(path);
  } catch (err) {
    return '😳';
  }
};

const imageLabel = async (path) => {
  try {
    const [result] = await client.labelDetection(path);
    const label = result.labelAnnotations[0];
    const stats = statSync(path);
    return `Vision API: ${label.description}\nScore: ${
      label.score
    }\nI wasted ${byteSize(stats.size)}`;
  } catch (err) {
    return '😳';
  }
};

export { imageOCR };
