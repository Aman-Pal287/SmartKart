const express = require("express");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");
const validation = require("../middlewares/validation.middleware");

const router = express.Router();

/* POST /api/orders/ */
router.post(
  "/",
  createAuthMiddleware(["user"]),
  validation.createOrderValidation,
  orderController.createOrder
);

/* GET /api/orders/me */
router.get("/me", createAuthMiddleware(["user"]), orderController.getMyOrders);

module.exports = router;
