const express = require('express');
const connectToDB = require('./config/database')
require('dotenv').config();

const vendorRoutes = require('./routes/vendorRoutes')
const adminRoutes = require('./routes/adminRoutes')


const app = express();

app.use(express.json())

app.listen(process.env.PORT, ()=>{
    console.log('Server start successfully');
});
connectToDB();


app.use('/api/vendor/', vendorRoutes);
app.use('/api/admin/', adminRoutes)

app.get('/', (req, res) => {
    res.send('<h1>Bijli Mart Backend</h1>')
})