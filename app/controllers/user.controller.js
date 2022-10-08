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
const ErrorHander = require("../helper/errorHandler");
const cloudinary  = require("../config/cloudnary.config");

const upload = async (file) => {
  const image = await cloudinary.uploader.upload(
    file,
    { folder: "avatars" },
    (result) => result
  );
  return image;
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { avatar } = req.files;
  const cloudFile = await upload(avatar.tempFilePath);

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
    avatar: {
      public_id: cloudFile.public_id,
      url: cloudFile.secure_url,
    },
  });
  await sendToken(user, StatusCodes?.CREATED, res, "register");
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
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new Error("Password is incorrect", StatusCodes?.UNAUTHORIZED));
  }

  await sendToken(user, 200, res, "login");
});

const forgotPassword = asyncHandler(async (req, res, next) => {});
const resetPassword = asyncHandler(async (req, res, next) => {});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
