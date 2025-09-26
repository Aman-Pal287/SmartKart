const cartModel = require("../models/cart.model");

async function getCart(req, res) {
  const user = req.user;

  let cart = await cartModel.findOne({ user: user.id });

  if (!cart) {
    cart = new cartModel({ user: user._id, items: [] });
    await cart.save();
  }

  res.status(200).json({
    cart,
    totals: {
      itemCount: cart.items.length,
      totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    },
  });
}

async function addItemToCart(req, res) {
  const { productId, qty } = req.body;

  const user = req.user;

  let cart = await cartModel.findOne({ user: user._id });

  if (!cart) {
    cart = new cartModel({ user: user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += qty;
  } else {
    cart.items.push({ productId, quantity: qty });
  }

  await cart.save();

  res.status(200).json({
    message: "item added to cart",
    cart,
  });
}

async function updateItemQuantity(req, res) {
  const { productId } = req.params;
  const { qty } = req.body;
  const user = req.user;
  const cart = await cartModel.findOne({ user: user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex < 0) {
    return res.status(404).json({ message: "Item not found" });
  }
  cart.items[existingItemIndex].quantity = qty;
  await cart.save();
  res.status(200).json({ message: "Item updated" }, cart);
}

async function removeItemFromCart(req, res) {
  const { productId } = req.params;
  const user = req.user;

  let cart = await cartModel.findOne({ user: user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  // Remove the item from the cart
  cart.items.splice(itemIndex, 1);
  await cart.save();

  res.status(200).json({
    message: "Item removed from cart",
    cart,
  });
}

async function clearCart(req, res) {
  const user = req.user;

  let cart = await cartModel.findOne({ user: user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Clear all items from the cart
  cart.items = [];
  await cart.save();

  res.status(200).json({
    message: "Cart cleared successfully",
    cart,
  });
}

module.exports = {
  addItemToCart,
  updateItemQuantity,
  getCart,
  removeItemFromCart,
  clearCart,
};
