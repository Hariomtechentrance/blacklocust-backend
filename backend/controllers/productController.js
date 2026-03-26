import Product from "../models/Product.js";
import Category from "../models/Category.js";

/*
---------------------------------------------------------
CREATE PRODUCT
POST /api/products/create
---------------------------------------------------------
*/
export const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const sizes = data.sizes || [];
    const totalStock = sizes.reduce(
      (sum, s) => sum + (s.stock || 0),
      0
    );

    const product = await Product.create({
      ...data,
      totalStock,
    });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/*
---------------------------------------------------------
GET SINGLE PRODUCT
GET /api/products/:id
---------------------------------------------------------
*/
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/*
---------------------------------------------------------
GET PRODUCTS (Simple Version)
GET /api/products
---------------------------------------------------------
*/
export const getProductsSimple = async (req, res) => {
  try {
    const { category } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .select("name description price category collection brand images sizes colors totalStock isFeatured isNewArrival isTrending rating numReviews tags material careInstructions isActive")
      .lean()
      .limit(50);

    console.log('Backend - Products Query:', query); // 🔥 DEBUG LOG
    console.log('Backend - Products Found:', products.length); // 🔥 DEBUG LOG

    res.json({
      success: true,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/*
---------------------------------------------------------
UPDATE PRODUCT
PUT /api/products/:id
---------------------------------------------------------
*/
export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/*
---------------------------------------------------------
DELETE PRODUCT
DELETE /api/products/:id
---------------------------------------------------------
*/
export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};