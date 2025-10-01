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

/* POST /api/orders/:id/cancel */
router.post(
  "/:id/cancel",
  createAuthMiddleware(["user"]),
  orderController.cancelOrderById
);

/* GET /api/orders/:id */
router.get(
  "/:id",
  createAuthMiddleware(["user", "admin"]),
  orderController.getOrderById
);

module.exports = router;
