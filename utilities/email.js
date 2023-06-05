const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // Activate in gmail "less secure app" option

    })
    // 2) Define the email options
    const mailOptions = {
        from: 'Eray Ates',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
        // '<b>Hello world?</b>'
        // '<p>That was easy!</p>'
        // '<a href="http://localhost:3000/">Click here</a>'
        // '<img src="cid:logo" alt="Eray Ates" />'
    }
    // 3) Actually send the email
    transporter.sendMail(mailOptions);
}

module.exports = sendEmail;