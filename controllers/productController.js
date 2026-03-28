import mongoose from "mongoose";
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
    const { category, minPrice, maxPrice, search, sortBy, season } = req.query;

    const filters = [{ isActive: true }];

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category) && String(new mongoose.Types.ObjectId(category)) === String(category)) {
        filters.push({ category });
      } else {
        const catDoc = await Category.findOne({
          $or: [
            { name: new RegExp(`^${category}$`, "i") },
            { slug: String(category).toLowerCase() }
          ]
        }).select("_id").lean();

        if (catDoc) {
          filters.push({ category: catDoc._id });
        } else {
          return res.json({ success: true, products: [] });
        }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const range = {};
      if (minPrice !== undefined && minPrice !== "") range.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "") range.$lte = Number(maxPrice);
      filters.push({ price: range });
    }

    if (search) {
      filters.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      });
    }

    if (season) {
      filters.push({
        $or: [
          { tags: { $regex: season, $options: "i" } },
          { name: { $regex: season, $options: "i" } }
        ]
      });
    }

    const query = filters.length === 1 ? filters[0] : { $and: filters };

    let sort = { createdAt: -1 };
    if (sortBy === "price-asc" || sortBy === "price-low") sort = { price: 1 };
    else if (sortBy === "price-desc" || sortBy === "price-high") sort = { price: -1 };
    else if (sortBy === "name") sort = { name: 1 };
    else if (sortBy === "oldest") sort = { createdAt: 1 };
    else if (sortBy === "newest") sort = { createdAt: -1 };

    const products = await Product.find(query)
      .populate("category", "name slug")
      .select("name description price category collection brand images sizes colors totalStock isFeatured isNewArrival isTrending rating numReviews tags material careInstructions isActive createdAt")
      .sort(sort)
      .lean()
      .limit(500);

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