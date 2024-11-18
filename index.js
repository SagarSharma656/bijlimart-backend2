const express = require('express');
const connectToDB = require('./config/database')
require('dotenv').config();
const connectToCloudinary = require('./config/cloudinary')
const fileUpload = require('express-fileupload');


const warehouseRoutes = require('./routes/warehouseRoutes')
const adminRoutes = require('./routes/adminRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const unitRoutes = require('./routes/unitRoutes')


const app = express();

app.use(express.json())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/'
}));

app.listen(process.env.PORT, ()=>{
    console.log('Server start successfully');
});
connectToDB();
connectToCloudinary();


app.use('/api/warehouse/', warehouseRoutes);
app.use('/api/admin/', adminRoutes);
app.use('/api/category/', categoryRoutes);
app.use('/api/product/', productRoutes);
app.use('/api/unit/', unitRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Bijli Mart Backend</h1>')
})