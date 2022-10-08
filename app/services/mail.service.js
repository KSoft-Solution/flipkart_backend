const resetEmail = (host, resetToken) => {
  const message = {
    subject: "Reset Password",
    text:
      `${
        "You are receiving this because you have requested to reset your password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        "http://"
      }${host}/reset-password/${resetToken}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  return message;
};

const confirmResetPasswordEmail = () => {
  const message = {
    subject: "Password Changed",
    text:
      `You are receiving this email because you changed your password. \n\n` +
      `If you did not request this change, please contact us immediately.`,
  };

  return message;
};

const forgotPassword = (url) => {
  const message = {
    subject: "Password Reset link",
    text: `You are receiving this email because you (or someone else ) has
          requested the reset of a password.`,
    html: `<a href=${url}><button>Click Here</button></a>`,
  };
  return message;
};

const registerEmail = (data,token) => {
  const message = {
    subject: "Account Registration",
    text: `Hi ${data}! Thank you for creating an account with us!.`,
    html: `<div style={"width:100%; height:100%;color:green"}><i style={color:'red'}>Hi ${data} ,</i> Welcome to Sri Krishna Bakery<br/><h1>Thanks for Signing up on our app<h3></h3></h1>Your tokenCode is :<b> ${token}</b></div><br/></h3></div><p>If this request is not made by you kindly ignore this mail.</p><p>Regards, <strong>Ashok Sahu(Owner)</strong></p>`,
  };

  return message;
};

const login = (data) => {
  const message = {
    subject: "Welcome To Sri Krishna Bakery",
    text: `Thank you for your Interest In our Shop`,
    html: `Hi, <b style={color:'red'}>${data}</b> Your Login Successfull`,
  };
  return message;
};

const newsletterSubscriptionEmail = () => {
  const message = {
    subject: "Newsletter Subscription",
    text:
      `You are receiving this email because you subscribed to our newsletter. \n\n` +
      `If you did not request this change, please contact us immediately.`,
  };

  return message;
};

const contactEmail = () => {
  const message = {
    subject: "Contact Us",
    text: `We received your message! Our team will contact you soon. \n\n`,
  };

  return message;
};

const merchantApplicationEmail = () => {
  const message = {
    subject: "Sell on MERN Store",
    text: `We received your request! Our team will contact you soon. \n\n`,
  };

  return message;
};

const orderConfirmationEmail = (order) => {
  const message = {
    subject: `Order Confirmation ${order._id}`,
    text:
      `Hi ${order.user.profile.firstName}! Thank you for your order!. \n\n` +
      `We've received your order and will contact you as soon as your package is shipped. \n\n`,
  };

  return message;
};

module.exports = {
  registerEmail,
  login,
};
