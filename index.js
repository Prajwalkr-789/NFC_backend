const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const User = require('./models/User'); 
const connection = require('./DB/database')
const route = require('./routes/route')

const app = express();
app.use(bodyParser.json());

connection()

app.use('/api',route)

app.get('health',(req,res)=>{
    res.status(201).send("Hi i am working")
})
app.get('/',(req,res)=>{
    res.send("Jeevan is jeevan")
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}....`));
