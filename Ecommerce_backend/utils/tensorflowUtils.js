const tf = require("@tensorflow/tfjs");

/**
 * TensorFlow utility functions
 * for recommendation system
 */

/**
 * Normalize price value
 */
exports.normalizePrice = (price, maxPrice = 1000) => {
  return Math.min(price / maxPrice, 1);
};

/**
 * Encode categorical features to vectors
 */
exports.encodeCategory = (category) => {
  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Sports",
    "Beauty",
    "Food",
    "Toys"
  ];
  return (
    categories.indexOf(category) /
    categories.length
  );
};

/**
 * Create feature vector for a product
 */
exports.createProductVector = (product) => {
  const categoryVector =
    exports.encodeCategory(
      product.category
    );
  const priceNormalized =
    exports.normalizePrice(product.price);

  return [categoryVector, priceNormalized];
};

/**
 * Build neural network model
 * for recommendations
 */
exports.buildModel = () => {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [2],
        units: 64,
        activation: "relu",
        kernelRegularizer: tf.regularizers
          .l2({
            l2: 0.001
          })
      }),
      tf.layers.batchNormalization(),
      tf.layers.dropout({
        rate: 0.2
      }),
      tf.layers.dense({
        units: 32,
        activation: "relu",
        kernelRegularizer: tf.regularizers
          .l2({
            l2: 0.001
          })
      }),
      tf.layers.batchNormalization(),
      tf.layers.dropout({
        rate: 0.2
      }),
      tf.layers.dense({
        units: 16,
        activation: "relu"
      }),
      tf.layers.dense({
        units: 1,
        activation: "sigmoid"
      })
    ]
  });

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"]
  });

  return model;
};

/**
 * Calculate cosine similarity between
 * two vectors
 */
exports.cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce(
    (sum, val, i) => sum + val * b[i],
    0
  );
  const magnitudeA = Math.sqrt(
    a.reduce((sum, val) => sum + val * val, 0)
  );
  const magnitudeB = Math.sqrt(
    b.reduce((sum, val) => sum + val * val, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Prepare batch of training data
 */
exports.prepareBatch = (features, labels) => {
  return {
    features: tf.tensor2d(features),
    labels: tf.tensor2d(
      labels.map(l => [l])
    )
  };
};

/**
 * Cleanup TensorFlow tensors
 */
exports.disposeTensors = (...tensors) => {
  tensors.forEach(tensor => {
    if (tensor && tensor.dispose) {
      tensor.dispose();
    }
  });
};

/**
 * Get memory info
 */
exports.getMemoryInfo = () => {
  return tf.memory();
};
