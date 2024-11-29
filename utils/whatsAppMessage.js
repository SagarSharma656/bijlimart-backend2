
require('dotenv').config();
const axios = require('axios');

const whatAppMessage = async (mobileNumber, message) => {
    try {
        const whatsAppRes = await axios.get(`${process.env.WHATSAPP_API_BASE_URL}api_key=${process.env.WHATSAPP_API_KEY}&sender=${process.env.WHATSAPP_MSG_SENDER}&number=91${mobileNumber}&message=${message}`);

        return whatsAppRes;
        
    } catch (error) {
        console.log(error.message);
    }
} 

module.exports = whatAppMessage;