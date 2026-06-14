/**
 * Configuration for TensorFlow
 * Recommendation System
 * 
 * Adjust these parameters to tune
 * recommendation quality
 */

module.exports = {
  // Model Configuration
  model: {
    // Neural network architecture
    layers: {
      input: 2,           // Number of input features
      hidden1: 64,        // First hidden layer neurons
      hidden2: 32,        // Second hidden layer neurons
      hidden3: 16,        // Third hidden layer neurons
      output: 1           // Output layer (probability)
    },

    // Training parameters
    training: {
      epochs: 10,         // Number of training iterations
      batchSize: 32,      // Samples per batch
      learningRate: 0.01, // Adam optimizer learning rate
      dropoutRate: 0.2    // Dropout probability
    },

    // Regularization
    regularization: {
      l2: 0.001          // L2 regularization coefficient
    }
  },

  // Feature Engineering
  features: {
    // Supported product categories
    categories: [
      "Electronics",
      "Clothing",
      "Books",
      "Home",
      "Sports",
      "Beauty",
      "Food",
      "Toys"
    ],

    // Price normalization
    maxPrice: 1000,      // Max price for normalization

    // Feature scaling
    scaling: {
      category: 1.0,     // Category feature weight
      price: 1.0         // Price feature weight
    }
  },

  // Recommendation Parameters
  recommendations: {
    // Number of recommendations to return
    topN: 5,

    // Score calculation weights
    weights: {
      modelScore: 0.7,      // Neural network prediction
      categoryPreference: 0.3 // User's category preference
    },

    // Minimum score threshold (0-1)
    minScore: 0.0,

    // Exclude already purchased items
    excludePurchased: true
  },

  // Model Caching
  caching: {
    // Cache model between requests
    enabled: true,

    // Cache expiration time (ms)
    // Set to 0 for never expire
    ttl: 0,

    // Retrain frequency (ms)
    // Set to 0 to disable auto-retrain
    retrainInterval: 86400000 // 24 hours
  },

  // Data Preparation
  data: {
    // Minimum products to train model
    minProducts: 10,

    // Minimum orders to train model
    minOrders: 5,

    // Negative sampling ratio
    negativeSampleRatio: 1.0,

    // Remove outlier prices
    removeOutliers: true,
    outlierThreshold: 3 // Standard deviations
  },

  // Logging
  logging: {
    // Enable detailed logging
    verbose: true,

    // Log training progress
    logTraining: false,

    // Log memory usage
    logMemory: false,

    // Log recommendations
    logRecommendations: true
  },

  // Performance
  performance: {
    // Timeout for model training (ms)
    trainTimeout: 30000,

    // Timeout for prediction (ms)
    predictTimeout: 5000,

    // Max concurrent operations
    maxConcurrent: 2
  },

  // Fallback Strategy
  fallback: {
    // When model fails, return top products
    useTopProducts: true,

    // When no personalization, recommend
    // by category
    useCategoryFallback: true,

    // Default number of fallback items
    fallbackCount: 5
  }
};
