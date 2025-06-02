// utility/mail.js
const nodemailer = require('nodemailer');

// 建立傳送器
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 's9912045@gmail.com',
    pass: 'cmtl okwa hidk ptez',
  },
});

// 具名函式：建立信件內容並寄出
function sendMail(options) {
  const mailOptions = {
    from: '"甜點小舖客服" <s9912045@gmail.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log('信件已送出:', info.response);
      return info;
    })
    .catch((error) => {
      console.error('寄信失敗:', error);
      throw error;
    });
}

module.exports = {
  sendMail,
};
