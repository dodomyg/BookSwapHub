const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatName:{type:String,required:true}, 
    users:[{type:mongoose.Schema.Types.ObjectId,ref:"USER"}],
},{timestamps:true});

module.exports = mongoose.model('CHAT', chatSchema);
