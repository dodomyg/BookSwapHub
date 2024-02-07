const express=require('express')
const USER = require('../Schema/USER')
const bcrypt = require('bcrypt')
const router = express.Router()


router.post('/register',async(req,resp)=>{
    const {username,email,password,adhaarNum}=req.body
    try {
        if(!username || !email || !password || !adhaarNum){
            return resp.status(422).json({message:"Fill all credentials"})
        }
        const alreadyUser = await USER.findOne({username})
        if(alreadyUser){
            return resp.status(422).json({message:"User exists now login"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hash(password,salt)
        const newUser = await USER.create({username,email,adhaarNum,password:hashedPassword})
        resp.status(201).json({message:"Registration complete",newUser})
    } catch (error) {
        resp.status(404).json({message:error.message})
    }
})


module.exports=router