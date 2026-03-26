import express from "express";
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart, getCartSummary } from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All cart routes are protected
router.post('/add', protect, addToCart); // 🔥 IMPORTANT: Add protect middleware
router.get('/', protect, getCart); // 🔥 IMPORTANT: Add protect middleware
router.get('/summary', protect, getCartSummary);
router.put('/:itemId', protect, updateCartItem);
router.delete('/:itemId', protect, removeFromCart);
router.delete('/', protect, clearCart);

export default router;
