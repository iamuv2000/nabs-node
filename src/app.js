const express = require('express');
const app = express();
const bodyParser = require("body-parser")
var cors = require('cors');
app.use(cors());
const chalk = require('chalk');
const dotenv = require("dotenv");
dotenv.config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Route imports
const userRoute = require('./routes/user');

//Use Routes
app.use('/user',userRoute);

const port = process.env.PORT
app.listen(port,()=>{
    console.log('Server is up on port ',port)
})