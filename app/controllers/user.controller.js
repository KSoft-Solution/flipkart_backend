const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const crypto = require("crypto");
const sendEmail = require("../utils/mail.util");
const sendToken = require("../utils/token");
const Error = require("../helper/errorHandler");
const cloudinary = require("../config/cloudnary.config");

const upload = async (file) => {
  const image = await cloudinary.uploader.upload(
    file,
    { folder: "avatars" },
    (result) => result
  );
  return image;
};

const registerUser = asyncHandler(async (req, res, next) => {
  // const { avatar } = req.files;
  // const cloudFile = await upload(avatar.tempFilePath);

  // const file = req.files.avatar;
  // const myCloud = await upload(file.tempFilePath, {
  //   folder: "avatars",
  //   public_id: `${Date.now()}`,
  //   width: 150,
  //   crop: "scale",
  //   resource_type: "auto",
  // });

  const { name, email, gender, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    gender,
    // avatar: {
    //   public_id: cloudFile.public_id,
    //   url: cloudFile.secure_url,
    // },
  });
  await sendToken(user, StatusCodes?.CREATED, res, "register",req);
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new Error(
        "No user found for this email  and password",
        StatusCodes?.UNAUTHORIZED
      )
    );
  }
  const isPasswordMatched = await user.comparePassword(password, user.password);
  if (!isPasswordMatched) {
    return next(new Error("Password is incorrect", StatusCodes?.UNAUTHORIZED));
  }

  await sendToken(user, StatusCodes.CREATED, res, "login",req);
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    // res.redirect("back");
    return next(new Error("User Not Found", StatusCodes?.NOT_FOUND));
  }

  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}${process.env.API_URL}/user/password/reset/${resetToken}`;
  try {
    await sendEmail(user.email, "forgotPassword", "", resetPasswordUrl, "");
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
      resetPasswordUrl
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Error(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  // create hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Error("Invalid reset password token", StatusCodes.NOT_FOUND));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, StatusCodes.OK, res,'reset',req);
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
