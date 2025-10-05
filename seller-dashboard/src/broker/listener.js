const { subscribeToQueue } = require("../broker/broker");
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");

module.exports = async function () {
  subscribeToQueue("AUTH_SELLER_DASHBOARD.USER_CREATED", async (user) => {
    try {
      // agar user already hai, to skip kar
      const existingUser = await userModel.findOne({ email: user.email });
      if (existingUser) {
        console.log(
          `User already exists with email: ${user.email}, skipping insert`
        );
        return;
      }

      await userModel.create(user);
      console.log(`User created successfully: ${user.email}`);
    } catch (error) {
      if (error.code === 11000) {
        console.log("Duplicate user detected from queue:", user.email);
      } else {
        console.error("Error inserting user from queue:", error);
      }
    }
  });

  subscribeToQueue(
    "PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED",
    async (product) => {
      await productModel.create(product);
    }
  );

  subscribeToQueue("ORDER_SELLER_DASHBOARD.ORDER_CREATED", async (order) => {
    await orderModel.create(order);
  });

  subscribeToQueue(
    "PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED",
    async (payment) => {
      await paymentModel.create(payment);
    }
  );

  subscribeToQueue(
    "PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATE",
    async (payment) => {
      await paymentModel.findOneAndUpdate(
        { orderId: payment.orderId },
        { ...payment }
      );
    }
  );

  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_INITIATED", async () => {});
};
