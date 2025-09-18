const express = require("express");
const validator = require("../middlewares/validator.middleware");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// POST /api/auth/register
router.post(
  "/register",
  validator.registerUserValidations,
  validator.responseWithValidationErrors,
  authController.registerUser
);

// POST /api/auth/login
router.post(
  "/login",
  validator.loginUserValidations,
  validator.responseWithValidationErrors,
  authController.loginUser
);

// GET /api/auth/me
router.get("/me", authMiddleware.authMiddleware, authController.getCurrentUser);

//GET /api/auth/logout
router.get("/logout", authController.logoutUser);

router.get(
  "/me/addresses",
  authMiddleware.authMiddleware,
  authController.getUserAddress
);

router.post(
  "/me/addresses",
  validator.loginUserValidations,
  validator.addUserAddressValidations,
  authMiddleware.authMiddleware,
  authController.addUserAddress
);

router.delete(
  "/me/addresses/:addressId",
  authMiddleware.authMiddleware,
  authController.deleteUserAddress
);

module.exports = router;
