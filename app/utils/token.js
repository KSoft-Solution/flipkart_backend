// Create Token and saving in cookie
const sendEmail = require("../utils/mail.util");
const sendToken = (user, statusCode, res,option) => {
  const token = user.getJWTToken();
  let templete;

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if(option === 'login') templete = 'login'
  else if(option === 'register') templete = 'register'


  sendEmail(user.email, templete, "", user.name, token);
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
