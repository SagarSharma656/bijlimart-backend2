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
        console.log('Something went wrong to send email : ', error)
    }
}

const lowStockMailSend = async (lowStockProducts) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        const productDetails = lowStockProducts
            .map((product) => {
                return `<li><strong>${product.name}</strong> (ID: ${product.productId}) - Stock: ${product.stock}</li>`;
            })
            .join('');

        const mailOptions = {
                            from: 'your-email@gmail.com',
                            to: 'admin-email@example.com',
                            subject: 'Low Stock Alert',
                            html: `
                                <h2>Low Stock Alert</h2>
                                <p>The following products have low stock:</p>
                                <ul>${productDetails}</ul>
                                <p>Please reorder the products as needed.</p>
                            `,
                        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email: ', error);
            } else {
                console.log('Low stock alert email sent: ' + info.response);
            }
        });


    } catch (error) {
        console.log('Something went wrong to send email : ', error)
    }
}

module.exports = { mailSender, lowStockMailSend };