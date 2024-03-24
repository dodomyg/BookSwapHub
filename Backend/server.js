const express = require('express')
const mongoose = require('mongoose')
const userRoutes=require('./Router/userRoutes')
const bookRoutes=require('./Router/bookRoutes')
const chatRoutes=require('./Router/chatRoutes')
const messageRoutes=require('./Router/messageRoute')

require('dotenv').config()
const cors = require('cors')
const cookieParser=require('cookie-parser')



const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api/users",userRoutes)
app.use("/api/books",bookRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)


const PORT = process.env.PORT || 8080


mongoose.connect(process.env.MONGO_LINK).then(()=>{
    app.listen(PORT,()=>{
        console.log('====================================');
        console.log(`Backend is running on ${PORT} and mongodb connected`);
        console.log('====================================');
    })
}).catch((err)=>{
    console.log(err);
})
