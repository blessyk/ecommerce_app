const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * Get product recommendations based on
 * ordered item categories
 * 
 * Algorithm:
 * 1. Find all orders by the user
 * 2. Extract categories from ordered items
 * 3. Count category frequency
 * 4. Find products in those categories
 * 5. Exclude already purchased items
 * 6. Sort by category match strength
 */
exports.getRecommendations = async (
  userId
) => {
  try {
    // Get user's complete order history
    const orders = await Order.find({
      user: userId
    }).populate("products.product");

    if (!orders.length) {
      // If no orders, return popular products
      const allProducts =
        await Product.find().limit(5);
      return allProducts;
    }

    // Extract categories and count frequency
    const categoryCount = {};
    const purchasedIds = new Set();
    const purchasedProducts = [];

    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.product) {
          // Track category frequency
          const category = item.product.category;
          categoryCount[category] =
            (categoryCount[category] || 0) +
            item.quantity;

          // Track purchased product IDs
          purchasedIds.add(
            item.product._id.toString()
          );

          // Store purchased products
          purchasedProducts.push(
            item.product
          );
        }
      });
    });

    // Sort categories by frequency
    const sortedCategories =
      Object.entries(categoryCount)
        .sort(
          (a, b) => b[1] - a[1]
        )
        .map(entry => entry[0]);

    console.log(
      "User ordered categories:",
      sortedCategories
    );
    console.log(
      "Category frequency:",
      categoryCount
    );

    // Find products in these categories
    // (excluding already purchased items)
    const recommendations = [];

    for (const category of sortedCategories) {
      if (recommendations.length >= 5) {
        break;
      }

      const categoryProducts =
        await Product.find({
          category: category,
          _id: {
            $nin: Array.from(purchasedIds)
          }
        }).limit(5 - recommendations.length);

      recommendations.push(...categoryProducts);
    }

    // If not enough from main categories,
    // add from other categories
    if (recommendations.length < 5) {
      const otherProducts =
        await Product.find({
          _id: {
            $nin: Array.from(purchasedIds)
          }
        }).limit(5 - recommendations.length);

      recommendations.push(...otherProducts);
    }

    console.log(
      `Returning ${recommendations.length} ` +
      "recommendations based on categories: " +
      sortedCategories.join(", ")
    );

    return recommendations.slice(0, 5);
  } catch (error) {
    console.error(
      "Error in getRecommendations:",
      error
    );
    return [];
  }
};

/**
 * Get recommendations with detailed info
 * showing why each product is recommended
 */
exports.getRecommendationsWithReason = async (
  userId
) => {
  try {
    const orders = await Order.find({
      user: userId
    }).populate("products.product");

    if (!orders.length) {
      const allProducts =
        await Product.find().limit(5);
      return allProducts.map(product => ({
        ...product.toObject(),
        reason:
          "Popular product - No purchase history"
      }));
    }

    const categoryCount = {};
    const purchasedIds = new Set();

    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.product) {
          const category = item.product.category;
          categoryCount[category] =
            (categoryCount[category] || 0) +
            item.quantity;

          purchasedIds.add(
            item.product._id.toString()
          );
        }
      });
    });

    const sortedCategories =
      Object.entries(categoryCount)
        .sort(
          (a, b) => b[1] - a[1]
        )
        .map(entry => entry[0]);

    const recommendations = [];

    for (const category of sortedCategories) {
      if (recommendations.length >= 5) {
        break;
      }

      const categoryProducts =
        await Product.find({
          category: category,
          _id: {
            $nin: Array.from(purchasedIds)
          }
        }).limit(5 - recommendations.length);

      categoryProducts.forEach(product => {
        recommendations.push({
          ...product.toObject(),
          reason:
            `Based on your ${category} ` +
            "purchases (similar category)",
          matchCategory: category
        });
      });
    }

    if (recommendations.length < 5) {
      const otherProducts =
        await Product.find({
          _id: {
            $nin: Array.from(purchasedIds)
          }
        }).limit(5 - recommendations.length);

      otherProducts.forEach(product => {
        recommendations.push({
          ...product.toObject(),
          reason:
            "Recommended based on " +
            "customer preference",
          matchCategory: "general"
        });
      });
    }

    return recommendations.slice(0, 5);
  } catch (error) {
    console.error(
      "Error in getRecommendationsWithReason:",
      error
    );
    return [];
  }
};