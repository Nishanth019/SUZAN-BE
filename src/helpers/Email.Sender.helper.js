// const AWS = require('aws-sdk');
// const nodemailer = require('nodemailer')

const nodemailer = require("nodemailer");
const { apiKey } = require("../config/sendInBlue.json");
const prodApiKey = process.env.BREVO_API_KEY;
const sendinBlueTransport = require("nodemailer-sendinblue-transport");
const transporter = nodemailer.createTransport(
  new sendinBlueTransport({
    apiKey: prodApiKey,
  })
);

async function sendMail(receiver, subject, msg) {
  try {
    const mailOptions = {
      from: "suzanorganisation@gmail.com",
      to: receiver,
      subject: subject,
      text: msg,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email: " + error);
  }
}

module.exports = { sendMail };

// const sendMail = async (email, subject, text) => {
//     AWS.config.update({
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//         region:process.env.AWS_REGION
//     });
//     // create Nodemailer SES transporter
//     let transporter = nodemailer.createTransport({
//         SES: new AWS.SES(),
//         host: process.env.HOST,
//         service: process.env.SERVICE,
//         port: 55,
//         secure: true,
//         auth: {
//             user: process.env.USER,
//             pass: process.env.PASS,
//         },
//     });
//      transporter.sendMail({
//         from: "bot@sundaysforever.com",
//         to:email,
//         subject,
//         html:text,
//     }, (err, info) => {
//         if(err) console.log('email sent failed',err)
//         console.log('email sent successfully')
//     });
// }

// module.exports = sendMail;
