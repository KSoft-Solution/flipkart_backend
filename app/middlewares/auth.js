const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const User = require('../models/user.model');
const Error = require('./error');

exports.isAuthenticatedUser = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new Error("Please Login to Access", 401))
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new Error(`Role: ${req.user.role} is not allowed`, 403));
        }
        next();
    }
}