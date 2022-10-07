const nodemailer = require("nodemailer");

const sendMail = async (recipient, message) => {
  let transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE, 
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    secureConnection: false, // TLS requires secureConnection to be false
    secure: false,
    // logger: true,
    debug: true,
    ignoreTLS: true,
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    requireTLS: true,
  });

  const data = {
    from: `SriKrishna Bakery <${process.env.SMPT_MAIL}>`,
    to: recipient,
    subject: `${message.subject}`,
    text: `${message.text}`,
    html: `${message.html}`,
  };
  transporter.verify((err, success) => {
    if (err) console.error(err);
    console.log("Your config is correct");
  });

  await transporter
    .sendMail(data)
    .then((info) => console.log(`Message sent: ${info.response}`))
    .catch((err) => console.log(`Problem sending email: ${err}`));
};

module.exports = sendMail;
