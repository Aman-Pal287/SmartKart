const { body, validationResult } = require("express-validator");

const responseWithValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const registerUserValidations = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3 })
    .withMessage("User must be at least 3 character"),

  body("email").isEmail().withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),

  body("fullName.firstName")
    .isString()
    .withMessage("first name is must be and string")
    .notEmpty()
    .withMessage("First name is required"),
  body("fullName.lastName")
    .isString()
    .withMessage("Last name is must be and string")
    .notEmpty()
    .withMessage("Last name is required"),
  body("role")
    .optional()
    .isIn(["user", "seller"])
    .withMessage("Role must be either user or seller"),
  responseWithValidationErrors,
];

const loginUserValidations = [
  body("email").optional().isEmail().withMessage("Invalid email address"),

  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),
  (req, res, next) => {
    if (!req.body.email && !req.body.username) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Either email or username is required" }] });
    }
    responseWithValidationErrors(req, res, next);
  },
];

const addUserAddressValidations = [
  body("street")
    .isString()
    .withMessage("Street must be a string")
    .notEmpty()
    .withMessage("Street is required"),
  body("city")
    .isString()
    .withMessage("City must be a string")
    .notEmpty()
    .withMessage("City is required"),
  body("state")
    .isString()
    .withMessage("State must be a string")
    .notEmpty()
    .withMessage("State is required"),
  body("country")
    .isString()
    .withMessage("Country must be a string")
    .notEmpty()
    .withMessage("Country is required"),
  body("pincode")
    .isString()
    .withMessage("pincode must be a string")
    .notEmpty()
    .withMessage("pincode is required"),
  body("phone")
    .optional()
    .isString()
    .withMessage("Phone must be a string")
    .bail()
    .matches(/^\d{10}$/)
    .withMessage("Phone must be a valid 10-digit number"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
  responseWithValidationErrors,
];

module.exports = {
  registerUserValidations,
  responseWithValidationErrors,
  loginUserValidations,
  addUserAddressValidations,
};
