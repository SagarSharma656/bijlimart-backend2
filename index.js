const express = require('express');


const app = express();

app.listen(4000, ()=>{
    console.log('Server start successfully')
})

app.get('/', (req, res) => {
    res.send('<h1>Bijli Mart Backend</h1>')
})