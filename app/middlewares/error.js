const ErrorHandler = require("../helper/errorHandler");
const {
  StatusCodes,
  getReasonPhrase,
} = require("http-status-codes");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes?.INTERNAL_SERVER_ERROR;
  err.message = err.message || getReasonPhrase(500);

  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, StatusCodes?.BAD_REQUEST);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, StatusCodes?.BAD_REQUEST);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, StatusCodes?.BAD_REQUEST);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = getReasonPhrase(401);
    err = new ErrorHandler(message, StatusCodes?.UNAUTHORIZED);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

