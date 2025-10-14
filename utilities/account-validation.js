// utilities/account-validation.js
const { body, validationResult } = require("express-validator");
const validate = {};

validate.registrationRules = () => {
  return [
    body("firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),
    body("lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),
    body("email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
  ];
};

validate.loginRules = () => {
  return [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

// Middleware to check results
validate.checkData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array().map(err => err.msg);
    return res.status(400).render("account/register", {
      title: "Registration",
      errors: errorArray,
      data: req.body,
    });
  }
  next();
};

module.exports = validate;
