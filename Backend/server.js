const express = require('express')
const mongoose = require('mongoose')
const userRoutes=require('./Router/userRoutes')
const bookRoutes=require('./Router/bookRoutes')
const chatRoutes=require('./Router/chatRoutes')
const messageRoutes=require('./Router/messageRoute')
const aiChat = require('./Router/aiChatRoutes')

require('dotenv').config()
const cors = require('cors')
const cookieParser=require('cookie-parser')



const app = express()
origins = [
    "http://localhost:3000",
    "https://bookswaphub-76z3sxdar-dodomygs-projects.vercel.app/"
]
app.use(cors({
    origin: origins,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/users",userRoutes)
app.use("/api/books",bookRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)
app.use("/api/aichat",aiChat)

app.get("/",(req,resp)=>{
    try {
        resp.send("SERVER RUNNING 🔥")
    } catch (error) {
        console.log(error)
    }
},)


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
