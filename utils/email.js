// 導入 Nodemailer 來傳送 Email。
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) 設定使用的服務、帳號、密碼
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) 設定傳信者、收信者、標題、內容
  const mailOptions = {
    from: 'KunYuChang <hello@kunyu.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Email 傳送出去
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
