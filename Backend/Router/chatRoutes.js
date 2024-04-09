const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const CHAT = require('../Schema/CHAT');
const USER = require('../Schema/USER');
const router = express.Router()


router.post('/createChat/:id',verifyToken,async(req,resp)=>{
    const userId = req.userId
    const {id} = req.params
    try {
        if(!userId){
            return resp.status(404).json({error:"Un-authorized,log in first"})
        }
        let userToCHat = await USER.findById(id)
        let chat = await CHAT.findOne({ 
            users: { $all: [id, userId], $size: 2 }
        }).populate('users', '-password');
        if (chat) {
            return resp.status(200).json(chat);
        }else{
            var chatData = {
                chatName:"sender",
                users:[id,userId],
            }
            const createdChat =await CHAT.create(chatData)
                const fullChat = await CHAT.findOne({_id:createdChat._id}).populate("users","email username")
                resp.status(201).json(fullChat)
        }
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({ error: 'Internal server error while creating chat' });
    }
})

router.get('/getChats',verifyToken,async(req,resp)=>{
    const userId = req.userId
    try {
        const getCHats = await CHAT.find({users:{$elemMatch:{$eq:userId}}}).populate("users","username")
        resp.status(200).json(getCHats)
    } catch (error) {
        resp.status(404).json({message:error.message})
    }
})



module.exports = router