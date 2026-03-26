import express from "express";
import multer from "multer";
const router = express.Router();

import {
  createProduct,
  getProductsSimple,
  getSingleProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Product routes - FIXED (removed duplicate)
router.post("/", upload.array("images"), createProduct); // ✅ KEEP ONLY THIS
router.get("/", getProductsSimple);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// ✅ TEMPORARY: Simple categories endpoint for navbar
router.get("/categories/navbar", (req, res) => {
  try {
    // Mock categories for now - replace with actual database query later
    const categories = [
      { _id: "cat1", name: "Shirts", slug: "shirts", type: "category", isFeatured: true },
      { _id: "cat2", name: "Pants", slug: "pants", type: "category", isFeatured: true },
      { _id: "cat3", name: "Dresses", slug: "dresses", type: "category", isFeatured: false },
      { _id: "cat4", name: "Accessories", slug: "accessories", type: "category", isFeatured: false }
    ];
    
    res.json({
      success: true,
      categories: categories
    });
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

export default router;
