const express = require("express");

const router = express.Router();

const {
  getRecommendations,
  getRecommendationsWithReason
} = require(
  "../controllers/recommendationControllers"
);

// Get recommendations based on
// ordered item categories
router.get("/:userId", getRecommendations);

// Get recommendations with reason
// explaining each suggestion
router.get(
  "/:userId/with-reason",
  getRecommendationsWithReason
);

module.exports = router;