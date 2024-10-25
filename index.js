require('dotenv').config();
const express = require('express');
const app = express();
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const httpStatusText = require('./utils/httpStatusText')
const cors = require('cors')
const path = require('path')

const url = process.env.MONGO_URL

mongoose.connect(url).then(()=>{
    console.log("mongodb connect success")
})

app.use(cors())
app.use(express.json());
const menuRouter= require("./Routes/menuRoutes")
const TableRouter= require("./Routes/tableRoutes")
const userRouter= require("./Routes/userRoutes")
app.use('/api/tables', TableRouter);
app.use('/api/menus', menuRouter);
app.use('/api/users',userRouter)
//glopal middleware 

app.all("*", (req, res,next) => {
    return res.status(404).json({status :httpStatusText.ERROR,message:"this resource is not available"})
})
//glopal error handling
app.use((error,req, res, next) => {
    res.status(error.statusCode||500)
    .json(
        {status :error.statusText ||httpStatusText.ERROR,
         message:error.message,
         code :error.statusCode||500,
         data:null  }
    )
})


app.listen(process.env.PORT|| 7000, () => {
    console.log(`listening on port ${process.env.PORT}`);
})
 