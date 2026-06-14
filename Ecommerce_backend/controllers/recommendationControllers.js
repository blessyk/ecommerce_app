const recommendationService =
require("../services/recommendationService");

/**
 * Get product recommendations based on
 * ordered item categories
 */
exports.getRecommendations =
async (req, res) => {

  try {

    const data =
      await recommendationService
      .getRecommendations(
        req.params.userId
      );

    res.json({
      success: true,
      count: data.length,
      recommendations: data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/**
 * Get recommendations with reason
 * explaining why each product is recommended
 */
exports.getRecommendationsWithReason =
async (req, res) => {

  try {

    const data =
      await recommendationService
      .getRecommendationsWithReason(
        req.params.userId
      );

    res.json({
      success: true,
      count: data.length,
      recommendations: data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};