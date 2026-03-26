import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    console.log("🔥 ADD TO CART API HIT"); // 🔥 CRITICAL DEBUG
    console.log("REQ BODY:", req.body); // 🔥 DEBUG LOG
    const { productId, quantity = 1, size, color } = req.body;

    // Check if product exists and has sufficient stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const userId = req.user._id; // 🔥 IMPORTANT: Get actual user ID from auth middleware

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        size,
        color,
        quantity,
      });
    }

    await cart.save();

    console.log("CART SAVED:", cart); // ✅ debug

    // Populate cart with product details
    await cart.populate('items.product', 'name price images stock');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        totalItems: cart.items.length,
        totalAmount: cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      }
    });
  } catch (error) {
    console.log("CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    console.log("🔥 GET CART API HIT"); // 🔥 CRITICAL DEBUG
    const userId = req.user._id; // 🔥 IMPORTANT: Get actual user ID from auth middleware

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    console.log("CART FROM DB:", cart); // Debug log

    res.json({
      success: true,
      cart: {
        items: cart?.items || [],
        totalItems: cart?.items?.length || 0,
        totalAmount: cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0
      }
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const user = await User.findById(req.user._id);
    const cartItem = user.cart.id(itemId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check product stock
    const product = await Product.findById(cartItem.product);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await user.save();

    await user.populate('cart.product', 'name price images stock');

    res.json({
      message: 'Cart updated',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id; // 🔥 IMPORTANT: Get actual user ID

    // 🔥 SECURITY: Find cart by user ID and remove specific item
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Remove the item from the items array
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    await cart.populate('items.product', 'name price images stock');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        totalItems: cart.items.length,
        totalAmount: cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      message: 'Cart cleared',
      cart: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
export const getCartSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'price stock isActive');

    let subtotal = 0;
    let totalItems = 0;
    const availableItems = [];

    for (const cartItem of user.cart) {
      if (cartItem.product && cartItem.product.isActive) {
        const itemTotal = cartItem.product.price * cartItem.quantity;
        subtotal += itemTotal;
        totalItems += cartItem.quantity;
        
        availableItems.push({
          _id: cartItem._id,
          product: cartItem.product,
          quantity: cartItem.quantity,
          size: cartItem.size,
          color: cartItem.color,
          itemTotal
        });
      }
    }

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    res.json({
      items: availableItems,
      subtotal,
      tax,
      shipping,
      total,
      totalItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
