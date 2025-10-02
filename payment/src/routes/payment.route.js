const express = require("express");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");
const { create } = require("../models/payment.model");

const router = express.Router();

/* POST /api/payments/create/:orderId */
router.post(
  "/create/:orderId",
  createAuthMiddleware(["user"]),
  paymentController.createPayment
);

/* POST /api/payments/verify */
router.post(
  "/verify",
  createAuthMiddleware(["user"]),
  paymentController.verifyPayment
);

module.exports = router;
