const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const MESSAGE = require('../Schema/MESSAGE');
const CHAT = require('../Schema/CHAT');
const USER = require('../Schema/USER');
const router = express.Router();

router.post("/sendMessage/:chatId",verifyToken,async(req,resp)=>{
    const userId=req.userId
    const {message}=req.body
    const {chatId}=req.params
    try {
        if(!userId){
            return resp.status(404).json({error:"Un-authorized,log in first"})
        }
        if(!message){
            return resp.status(404).json({error:"message is required"})
        }
        var newMsg = {
            sender: userId,
            message: message,
            chatId: chatId
          };
    let sendFullMsg = await MESSAGE.create(newMsg);
    sendFullMsg = await MESSAGE.populate(sendFullMsg, { path: "sender", select: "email username" });
    sendFullMsg = await MESSAGE.populate(sendFullMsg, { path:"chatId" });
    sendFullMsg = await USER.populate(sendFullMsg, {
      path: "CHAT.users",
      select: "username email"
    });
    await CHAT.findByIdAndUpdate(chatId, {
        latestMessage: sendFullMsg
      });
      resp.status(200).json(sendFullMsg);

    } catch (error) {
        console.log(error);
        resp.status(500).json({error:"Error while sending message"})
    }
})

router.get('/allMessages/:chatId',verifyToken,async(req,resp)=>{
    const {chatId} = req.params
    try {
      if(!chatId){
        return resp.status(404).json({error:"chatId is required"})
      }
      const messages = await MESSAGE.find({chatId:chatId}).populate("sender","email,username").populate("chatId")
      resp.status(200).json(messages)
    } catch (error) {
        console.log(error);
        resp.status(500).json({error:"Error while fetching message"})
    }
  })




module.exports = router