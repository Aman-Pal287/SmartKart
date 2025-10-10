const express = require("express");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const controller = require("../controllers/seller.controller");

const router = express.Router();

// GET /api/seller/dashboard/metrics -> Sales, revenue , top products.
router.get("/metrics", createAuthMiddleware(["seller"]), controller.getMetrics);

// GET /api/seller/dashboard/orders -> Seller's orders.
router.get("/orders", createAuthMiddleware(["seller"]), controller.getOrders);

// GET /api/seller/dashboard/orders -> Seller's products inventory & low stock alerts.
router.get("/orders", createAuthMiddleware(["seller"]), controller.getProducts);

module.exports = router;
