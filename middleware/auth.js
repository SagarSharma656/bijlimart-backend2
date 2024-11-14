const JWT = require('jsonwebtoken');
require('dotenv').config();


const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace('Bearer ', "");

        if(!token){
            return res.status(401).json({
                success: false,
                message: "User not loggedIn"
            });
        }

        try {
            const decodeData = JWT.verify(token, process.env.JWT_SECRET);
            req.user = decodeData

        } catch (error) {
            console.log(error);

            return res.status(401).json({
                success: false,
                message: "Token not verify try again"
            });
        }

        next();

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`,
        });
    }
}


const isAdmin = (req, res, next) => {
    try {
        const user = req.user;

        console.log('user : ', user);

        if (user.accountType !== 'admin') {

            console.log('User is not admin');

            return res.status(401).json({
                success: false,
                message: 'This route for Admin only'
            })
        }
        next()

    } catch (error) {
        console.log(error);
    }
}

const isVendor = (req, res, next) => {

    try {
        const user = req.user;

        if(user.accountType !== 'vendor'){
            return res.status(401).json({
                success: false,
                message: 'This route for Vendor only'
            })
        }
        next()

    } catch (error) {
        console.log(error);
    }
}


const isUser = (req, res, next) => {
    try {
        const user = req.user;

        if (user.accountType !== 'user'){
            return res.status(401).json({
                success: false,
                message: 'This route for registerd User only'
            })
        }
        next()

    } catch (error) {
        console.log(error);
    }
}

module.exports = {auth, isAdmin, isVendor, isUser}