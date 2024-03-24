const mongoose=require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"USER"},
    message:{type:String},
    chatId:{type:mongoose.Schema.Types.ObjectId,ref:"CHAT"}
},{timestamps:true})


const MESSAGE=mongoose.model("MESSAGE",MessageSchema)
module.exports=MESSAGE