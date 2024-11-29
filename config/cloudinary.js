const cloudinary = require('cloudinary').v2;
require('dotenv').config();


const connectToCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        });

        console.log('Cloudinary connection succesful'); 
        
    } catch (error) {
        console.log(`Error in Cloudinary connection : ${error}`);
    }
    
}

module.exports = connectToCloudinary