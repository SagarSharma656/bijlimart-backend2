const express = require('express');
const connectToDB = require('./config/database')
require('dotenv').config();
const multer = require('multer');

const vendorRoutes = require('./routes/vendorRoutes')
const adminRoutes = require('./routes/adminRoutes')
const categoryRoutes = require('./routes/categoryRoutes')


const app = express();

app.use(express.json())

const stroage = multer.diskStorage({
    destination: (req, file, cb)=> {

    }
})

app.listen(process.env.PORT, ()=>{
    console.log('Server start successfully');
});
connectToDB();


app.use('/api/vendor/', vendorRoutes);
app.use('/api/admin/', adminRoutes);
app.use('/api/category/', categoryRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Bijli Mart Backend</h1>')
})