const router = require("express").Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  logoutUser,
} = require("../controllers/user.controller");
const {
  validateLoginRequest,
  isRequestValidated,
  validateSignupRequest,
  validateForgotPasswordRequest,
  validateResetPasswordRequest,
} = require("../validator/auth.validator");
const { isAuthenticatedUser } = require("../middlewares/auth");

router
  .get("/me", isAuthenticatedUser, getUserDetails)
  .get("/logout", logoutUser)
  .post("/register", validateSignupRequest, isRequestValidated, registerUser)
  .post("/login", validateLoginRequest, isRequestValidated, loginUser)
  .post(
    "/password/forgot",
    validateForgotPasswordRequest,
    isRequestValidated,
    forgotPassword
  )
  .put(
    "/password/reset/:token",
    validateResetPasswordRequest,
    isRequestValidated,
    resetPassword
  )
  .put("/password/update", isAuthenticatedUser, updatePassword)
  .put("/me/update", isAuthenticatedUser, updateProfile);

module.exports = router;
