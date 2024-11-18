const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, subject, body) => {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })
        
        const emailInfo = await transport.sendMail({
            from: "BijliMart - delivered in 10 minutes",
            to: `${email}`,
            subject: `${subject}`,
            html: `${body}`,
        }) 

        return emailInfo;

    } catch (error) {
        console.log('Something went wrong to send email : ',error)
    }
}

module.exports = mailSender;