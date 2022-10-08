const router = require("express").Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} = require("../controllers/user.controller");
const {
  validateLoginRequest,
  isRequestValidated,
  validateSignupRequest,
  validateForgotPasswordRequest,
  validateResetPasswordRequest
} = require("../validator/auth.validator");

router
  .post("/register", validateSignupRequest, isRequestValidated, registerUser)
  .post("/login", validateLoginRequest, isRequestValidated, loginUser)
  .post(
    "/password/forgot",
    validateForgotPasswordRequest,
    isRequestValidated,
    forgotPassword
  )
  .put("/password/reset/:token",validateResetPasswordRequest,isRequestValidated,resetPassword);

module.exports = router;
