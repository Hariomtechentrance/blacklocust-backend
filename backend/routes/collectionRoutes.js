import express from 'express';
import mongoose from 'mongoose';
import Collection from "../models/Collection.js";
import Product from "../models/Product.js";

const router = express.Router();

/** Slug-only ids must not be passed as _id — Mongoose throws CastError → 500 */
function isStrictObjectId(id) {
  if (!id || typeof id !== 'string') return false;
  return (
    mongoose.Types.ObjectId.isValid(id) &&
    String(new mongoose.Types.ObjectId(id)) === id
  );
}

function collectionLookupFilter(identifier) {
  const slug = String(identifier || '').trim().toLowerCase();
  const conditions = [{ slug }];
  if (isStrictObjectId(identifier)) {
    conditions.push({ _id: identifier });
  }
  return { $or: conditions };
}

// Get all collections with filtering options
router.get("/", async (req, res) => {
  try {
    const { 
      showInNavbar, 
      isActive, 
      collectionType, 
      sortBy = 'order',
      sortOrder = 'asc' 
    } = req.query;
    
    // Build query
    const query = {};
    if (showInNavbar !== undefined) query.showInNavbar = showInNavbar === 'true';
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (collectionType) query.collectionType = collectionType;
    
    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const collections = await Collection.find(query)
      .sort(sort)
      .populate('parentCollection', 'name');
    
    res.json({ 
      success: true, 
      collections,
      count: collections.length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single collection by slug or ID
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by slug first, then by ID
    const collection = await Collection.findOne(
      collectionLookupFilter(identifier)
    ).populate('parentCollection', 'name slug');
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    res.json({ success: true, collection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products in a collection
router.get("/:identifier/products", async (req, res) => {
  try {
    const { identifier } = req.params;
    const { page = 1, limit = 500, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Find collection
    const collection = await Collection.findOne(collectionLookupFilter(identifier));

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Build product query
    const query = { collection: collection._id, isActive: true };
    
    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('category', 'name slug')
      .populate('collection', 'name slug');
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new collection
router.post("/", async (req, res) => {
  try {
    const collectionData = {
      ...req.body,
      order: req.body.order || (await Collection.countDocuments()) + 1
    };
    
    const collection = await Collection.create(collectionData);
    
    // Populate parent collection if exists
    await collection.populate('parentCollection', 'name');
    
    res.status(201).json({ 
      success: true, 
      collection,
      message: 'Collection created successfully' 
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ 
        error: 'Collection with this name or slug already exists' 
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// Reorder must be registered before PUT /:id so "reorder" is not treated as an id
router.put("/reorder", async (req, res) => {
  try {
    const { orders } = req.body; // Expected format: [{ id: "collectionId", order: 1 }]

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'Orders must be an array' });
    }

    const updatePromises = orders.map(({ id, order }) =>
      Collection.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Collections reordered successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update collection
router.put("/:id", async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('parentCollection', 'name');

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({
      success: true,
      collection,
      message: 'Collection updated successfully'
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Collection with this name or slug already exists'
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// Delete collection
router.delete("/:id", async (req, res) => {
  try {
    // Check if collection has products
    const productCount = await Product.countDocuments({ collection: req.params.id });
    
    if (productCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete collection. It contains ${productCount} products. Please move or delete products first.` 
      });
    }
    
    const collection = await Collection.findByIdAndDelete(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    res.json({ 
      success: true, 
      collection,
      message: 'Collection deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get collection statistics
router.get("/:identifier/stats", async (req, res) => {
  try {
    const { identifier } = req.params;
    
    const collection = await Collection.findOne(collectionLookupFilter(identifier));

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const stats = await Product.aggregate([
      { $match: { collection: collection._id, isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$totalStock' },
          averagePrice: { $avg: '$price' },
          featuredCount: {
            $sum: { $cond: ['$isFeatured', 1, 0] }
          },
          newArrivalCount: {
            $sum: { $cond: ['$isNewArrival', 1, 0] }
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalProducts: 0,
      totalStock: 0,
      averagePrice: 0,
      featuredCount: 0,
      newArrivalCount: 0
    };
    
    res.json({
      success: true,
      collection: collection.name,
      stats: result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
