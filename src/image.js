const byteSize = require('byte-size');
const fs = require('fs');

module.exports.imageClassification = async (path) => {
  try {
    const stats = fs.statSync(path);
    return `I wasted ${byteSize(stats.size)}`;
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
