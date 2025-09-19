const express = require("express");
const multer = require("multer");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const productController = require("../controller/product.controller");
const {
  createProductValidator,
} = require("../middlewares/validator.middleware");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

/* POST /api/products */
router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  createProductValidator,
  productController.createProduct
);

module.exports = router;