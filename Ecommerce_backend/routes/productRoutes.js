const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

router.post("/", protect, authorize("admin"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;