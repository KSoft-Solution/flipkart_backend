const router = require("express").Router();
const { registerUser, loginUser } = require("../controllers/user.controller");
const {
  validateLoginRequest,
  isRequestValidated,
  validateSignupRequest,
} = require("../validator/auth.validator");

router
  .post("/register", validateSignupRequest, isRequestValidated,registerUser)
  .post("/login", validateLoginRequest, isRequestValidated, loginUser);

module.exports = router;
