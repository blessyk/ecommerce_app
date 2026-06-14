/**
 * Script to test category-based
 * product recommendations
 * 
 * Usage: node scripts/testRecommendations.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const recommendationService =
  require("../services/recommendationService");

// Sample products with categories
const sampleProducts = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    price: 79.99,
    description:
      "High-quality wireless headphones",
    stock: 50
  },
  {
    name: "USB-C Cable",
    category: "Electronics",
    price: 15.99,
    description: "Durable USB-C charging cable",
    stock: 100
  },
  {
    name: "Laptop Stand",
    category: "Electronics",
    price: 49.99,
    description: "Adjustable laptop stand",
    stock: 30
  },
  {
    name: "Smartphone Screen Protector",
    category: "Electronics",
    price: 12.99,
    description: "Tempered glass protector",
    stock: 80
  },
  {
    name: "Winter Jacket",
    category: "Clothing",
    price: 129.99,
    description:
      "Warm winter jacket for cold weather",
    stock: 20
  },
  {
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: 24.99,
    description: "Comfortable cotton t-shirt",
    stock: 80
  },
  {
    name: "Denim Jeans",
    category: "Clothing",
    price: 69.99,
    description: "Classic denim jeans",
    stock: 45
  },
  {
    name: "JavaScript Guide",
    category: "Books",
    price: 34.99,
    description:
      "Complete guide to JavaScript",
    stock: 15
  },
  {
    name: "Node.js Handbook",
    category: "Books",
    price: 39.99,
    description: "Advanced Node.js patterns",
    stock: 12
  },
  {
    name: "Coffee Maker",
    category: "Home",
    price: 89.99,
    description: "Programmable coffee maker",
    stock: 25
  },
  {
    name: "Wall Clock",
    category: "Home",
    price: 29.99,
    description: "Modern wall clock",
    stock: 40
  },
  {
    name: "Running Shoes",
    category: "Sports",
    price: 129.99,
    description: "Professional running shoes",
    stock: 35
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/ecommerce"
    );
    console.log("✓ MongoDB connected\n");
  } catch (error) {
    console.error(
      "✗ MongoDB connection error:",
      error.message
    );
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log("Seeding database...\n");

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    // Create sample user
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "hashed_password",
      role: "user"
    });

    console.log(`✓ Created user: ${user.name}`);

    // Create sample products
    const products = await Product.insertMany(
      sampleProducts
    );
    console.log(
      `✓ Created ${products.length} products\n`
    );

    // Display products by category
    console.log("Products created by category:");
    const categorized = {};
    products.forEach(p => {
      if (!categorized[p.category]) {
        categorized[p.category] = [];
      }
      categorized[p.category].push(p.name);
    });

    Object.entries(categorized).forEach(
      ([cat, items]) => {
        console.log(
          `  ${cat}: ${items.join(", ")}`
        );
      }
    );

    // Create sample orders
    // User ordered Electronics and Books
    const orders = [
      {
        user: user._id,
        products: [
          {
            product: products[0]._id,
            quantity: 1
          },
          {
            product: products[1]._id,
            quantity: 2
          }
        ],
        totalAmount: 111.97,
        status: "Delivered"
      },
      {
        user: user._id,
        products: [
          {
            product: products[2]._id,
            quantity: 1
          }
        ],
        totalAmount: 49.99,
        status: "Delivered"
      },
      {
        user: user._id,
        products: [
          {
            product: products[7]._id,
            quantity: 1
          },
          {
            product: products[8]._id,
            quantity: 1
          }
        ],
        totalAmount: 74.98,
        status: "Processing"
      }
    ];

    await Order.insertMany(orders);
    console.log(
      `\n✓ Created ${orders.length} orders`
    );
    console.log("\nOrdered items:");
    orders.forEach((order, i) => {
      console.log(
        `  Order ${i + 1}: ${
          order.products
            .map((p, idx) => {
              const prod = products.find(
                product =>
                  product._id.toString() ===
                  p.product.toString()
              );
              return prod
                ? prod.name
                : "Unknown";
            })
            .join(", ")
        }`
      );
    });

    return {
      user,
      products
    };
  } catch (error) {
    console.error(
      "Error seeding database:",
      error.message
    );
    throw error;
  }
};

const testRecommendations = async (userId) => {
  try {
    console.log(
      "\n" +
      "═".repeat(60) +
      "\n"
    );
    console.log("TESTING RECOMMENDATIONS\n");
    console.log(
      "═".repeat(60) +
      "\n"
    );

    // Test 1: Basic recommendations
    console.log("1️⃣  Basic Recommendations:");
    console.log(
      "   (Products from same categories " +
      "as ordered items)\n"
    );

    const recommendations =
      await recommendationService
      .getRecommendations(userId);

    console.log(
      `   ✓ Found ${recommendations.length} ` +
      "recommendations:\n"
    );

    recommendations.forEach(
      (product, index) => {
        console.log(
          `   ${index + 1}. ${product.name}`
        );
        console.log(
          `      Category: ${product.category}`
        );
        console.log(
          `      Price: $${product.price}`
        );
        console.log(
          `      Stock: ${product.stock}\n`
        );
      }
    );

    // Test 2: Recommendations with reason
    console.log(
      "2️⃣  Recommendations with Reason:\n"
    );

    const recommendationsWithReason =
      await recommendationService
      .getRecommendationsWithReason(userId);

    recommendationsWithReason.forEach(
      (product, index) => {
        console.log(
          `   ${index + 1}. ${product.name}`
        );
        console.log(
          `      Category: ${product.category}`
        );
        console.log(
          `      Price: $${product.price}`
        );
        console.log(
          `      Why: ${product.reason}\n`
        );
      }
    );
  } catch (error) {
    console.error(
      "Error testing recommendations:",
      error.message
    );
  }
};

const main = async () => {
  try {
    console.log(
      "\n" +
      "╔" +
      "═".repeat(58) +
      "╗\n" +
      "║" +
      " Category-Based " +
      "Recommendation System".padEnd(57) +
      "║\n" +
      "╚" +
      "═".repeat(58) +
      "╝\n"
    );

    await connectDB();

    const {
      user,
      products
    } = await seedDatabase();

    await testRecommendations(user._id);

    console.log(
      "═".repeat(60) +
      "\n"
    );
    console.log("✓ Test completed successfully\n");

    process.exit(0);
  } catch (error) {
    console.error(
      "✗ Test failed:",
      error.message
    );
    process.exit(1);
  }
};

main();

