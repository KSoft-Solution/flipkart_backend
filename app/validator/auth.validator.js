const { check, validationResult } = require("express-validator");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

exports.validateSignupRequest = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid Email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];

exports.validateLoginRequest = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("enter a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(StatusCodes?.BAD_REQUEST).json({
      status: ReasonPhrases?.BAD_REQUEST,
      success: false,
      error: errors.array()[0].msg,
    });
  }
  next();
};

function validPhone(phone) {
  const re = /^[+]/g
  return re.test(phone)
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}