const mongoose = require('mongoose');
require('dotenv').config();
 
const connectToDB = () => {
    mongoose.connect(process.env.MONGODB_URL,{})
    .then(() => console.log('DB Connection successful'))
    .catch((error) => {
        console.log('Something went wrong in DB connection', error);
        process.exit(1);
    })
}

module.exports = connectToDB;