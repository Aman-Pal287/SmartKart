const orderModel = require("../models/order.model");
const axios = require("axios");

async function createOrder(req, res) {
  const user = req.user;
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  try {
    //fetch user cart form cart service
    const cartResponse = await axios.get(`http://localhost:3002/api/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await Promise.all(
      cartResponse.data.cart.items.map(async (item) => {
        return (
          await axios.get(
            `http://localhost:3001/api/products/${item.productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        ).data.product;
      })
    );

    let priceAmount = 0;

    const orderItems = cartResponse.data.cart.items.map((item) => {
      const product = products.find((p) => p._id === item.productId);

      // if not in stock, does not allow order creation
      if (!product.stock || product.stock < item.quantity) {
        throw new Error(
          `Product ${product.title} is out of stock or insufficient stock`
        );
      }

      const itemTotal = product.price.amount * item.quantity;
      priceAmount += itemTotal;

      return {
        product: item.productId,
        quantity: item.quantity,
        price: {
          amount: itemTotal,
          currency: product.price.currency,
        },
      };
    });

    const order = await orderModel.create({
      user: user.id,
      items: orderItems,
      status: "PENDING",
      totalPrice: {
        amount: priceAmount,
        currency: "INR",
      },
      shippingAddress: req.body.shippingAddress,
    });

    res.status(200).json({ message: "Order created successfully", order });
  } catch (err) {
    console.log(err);

    res
      .status(500)
      .json({ message: "Internal server error: ", err: err.message });
  }
}

module.exports = {
  createOrder,
};
