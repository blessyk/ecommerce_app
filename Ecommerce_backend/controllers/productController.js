const Product = require("../models/Product");

exports.createProduct = async(req,res)=>{

    const product = await Product.create(req.body);
    res.status(201).json(product);
};

// exports.getProducts = async(req,res)=>{

//     const products = await Product.find();
//     res.json(products);
// };

exports.getProducts = async (req, res) => {
    try {
    const { category, search, minPrice, maxPrice, sort } = req.query
    let query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.name = {
        $regex: search,
        $options: "i"
      };
    }
    if (minPrice || maxPrice) {

      query.price = {};
      if (minPrice) {
        query.price.$gte =
          Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte =
          Number(maxPrice);
      }
    }
    let products =
      Product.find(query);

    if (sort) {
      products =
        products.sort(sort);
    }

    const result =
      await products;

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.getProductById = async (req, res) => {

    const product = await Product.findById(
        req.params.id
    );

    res.json(product);
};

exports.getProduct = async(req,res)=>{

    const product = await Product.findById(
        req.params.id
    );

    res.json(product);
};

exports.updateProduct =
async(req,res)=>{

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );

    res.json(product);
};

exports.deleteProduct = async(req,res)=>{

    await Product.findByIdAndDelete(
        req.params.id
    );

    res.json({
        message:"Deleted"
    });
};