const nodemailer = require('../config/nodemailer.config')
const template = require('../services/mail.service')

const sendEmail = async (email, type, host, data, token) => {
  let result;
  let response;

  try {
    const message = prepareTemplate(type, host, data, token);
    response = await nodemailer(email, message);
  } catch (error) {
    console.log(error);
  }
  if (response) {
    result = response;
  }
  return result;
};

const prepareTemplate = (type, host, data, token) => {
  let message;

  switch (type) {
    case "reset":
      message = template.resetEmail(host, data);
      break;

    case "login":
      message = template.login(data);
      break;

    case "forgotPassword":
      message = template.forgotPassword(data);
      break;

    case "reset-confirmation":
      message = template.confirmResetPasswordEmail();
      break;

    case "register":
      message = template.registerEmail(data,token);
      break;

    case "newsletter-subscription":
      message = template.newsletterSubscriptionEmail();
      break;

    case "contact":
      message = template.contactEmail();
      break;

    default:
      message = "";
  }

  return message;
};

module.exports = sendEmail