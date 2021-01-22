const vision = require('@google-cloud/vision');
const byteSize = require('byte-size');
const fs = require('fs');

const client = new vision.ImageAnnotatorClient();

module.exports.imageClassification = async (path) => {
  try {
    const [result] = await client.labelDetection(path);
    const label = result.labelAnnotations[0];
    const stats = fs.statSync(path);
    return `Vision API: ${label.description}\nScore: ${
      label.score
    }\nI wasted ${byteSize(stats.size)}`;
  } catch (err) {
    return '😳';
  }
};

/**
 * Tensorflow not supported on my cpu *cries*
 * 
 *  const mobilenet = require('@tensorflow-models/mobilenet');
    const tfnode = require('@tensorflow/tfjs-node');
    const readImage = (path) => {
      const imageBuffer = fs.readFileSync(path);
      const tfimage = tfnode.node.decodeImage(imageBuffer);
      return tfimage;
    };
 *
 *  try {
    const image = readImage(path);
    const mobilenetModel = await mobilenet.load();
    const predictions = await mobilenetModel.classify(image);
    return `TensorFlow: ${predictions[0]['className']}`;
  } catch (err) {}
 */
