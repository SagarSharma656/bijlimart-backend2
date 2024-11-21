const express = require('express');
const connectToDB = require('./config/database')
require('dotenv').config();
const connectToCloudinary = require('./config/cloudinary')
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const warehouseRoutes = require('./routes/warehouseRoutes')
const adminRoutes = require('./routes/adminRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const unitRoutes = require('./routes/unitRoutes')
const deliveryBoyRoutes = require('./routes/deliveryBoyRoutes')
const subCategoryRoutes = require('./routes/subCategoryRoutes')


const app = express();

app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/'
}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
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
app.use('/api/deliveryBoy/', deliveryBoyRoutes);
app.use('/api/subCategory/', subCategoryRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Bijli Mart Backend</h1>')
})