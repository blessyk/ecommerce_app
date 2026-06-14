const Order = require("../models/Order");
exports.createOrder = async (req, res) => {
  try {
    const order =
      await Order.create({
        ...req.body,
        user: req.user._id
      });
    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }
};

exports.getOrders = async (req, res) => {

  try {
    const orders =  await Order.find()
      .populate("user")
      .populate("products.product");

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.getOrderById = async (req, res) => {

  const order =
    await Order.findById(
      req.params.id
    );

  res.json(order);
};

exports.updateOrder = async (req, res) => {
  const order =
    await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

  res.json(order);
};

exports.deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Order Deleted"
  });
};