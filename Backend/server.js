const express = require('express')
const mongoose = require('mongoose')
const userRoutes=require('./Router/userRoutes')
require('dotenv').config()
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/users",userRoutes)


const PORT = process.env.PORT || 8080


mongoose.connect(process.env.MONGO_LINK).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Backend is running on ${PORT} and mongodb connected`);
    })
}).catch((err)=>{
    console.log(err);
})
