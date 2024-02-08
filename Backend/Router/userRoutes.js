const express=require('express')
const bcrypt =require('bcrypt')
const USER = require('../Schema/USER')

const cookieParser=require('cookie-parser')
const jwt=require('jsonwebtoken')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()


//register
router.post("/register",async(req,resp)=>{
    const {adhaarNum,username,email,password}=req.body
    try {
        if(!username || !adhaarNum || !password || !email){
            return resp.status(422).json({message:"Enter all credentials"})
        }
        const alreadyUser = await USER.findOne({$or:[{email},{username}]})
        if(alreadyUser){
            return resp.status(422).json({message:"User already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPw = await bcrypt.hash(password,salt)
        const newUser = await USER.create({adhaarNum,email,username,password:hashedPw})
        if(newUser){
            const token = jwt.sign({id:newUser._id},process.env.KEY,{expiresIn:'10d'})
            resp.cookie("jwtToken",token,{httpOnly:true,maxAge:10*24*60*60*1000,sameSite:"strict"})
            resp.status(201).json({message:"User Created",newUser,token})
        }else{
            resp.status(404).json({message:"Error Occured"})
        }
    } catch (error) {
        resp.status(404).json({message:error.message})
    }
})

router.post('/login', async (req, resp) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return resp.status(400).json({ message: "Enter all credentials" });
        }
        const alreadyUser = await USER.findOne({ username });
        if (!alreadyUser) {
            return resp.status(404).json({ message: "No user found with this username, register first" });
        }
        const comparePw = await bcrypt.compare(password, alreadyUser.password);
        if (!comparePw) {
            return resp.status(400).json({ message: "Incorrect Password" });
        }
        const token = jwt.sign({id:alreadyUser._id},process.env.KEY,{expiresIn:'10d'})
        resp.cookie("jwtToken",token,{httpOnly:true,maxAge:10*24*60*60*1000,sameSite:"strict"})
        resp.status(201).json({ message: "User Logged In", alreadyUser, token });

    } catch (error) {
        resp.status(500).json({ message: error.message }); // Internal Server Error
    }
});



router.put('/update', verifyToken, async (req, resp) => {
    const {username,password,email } = req.body;
    const userId = req.userId;

    try {
        if (!userId) {
            return resp.status(404).json({ message: "Un-authorized,log in first" });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPw = await bcrypt.hash(password, salt);
            req.body.password = hashedPw;
        }

        
        const upDateUser = await USER.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true });

        
        const getFullUser = await USER.findById(userId)

        resp.status(200).json(getFullUser);
    } catch (error) {
        resp.status(404).json({ message: error.message });
    }
});



router.post('/logout',verifyToken,async(req,resp)=>{
    try {
        resp.cookie("jwtToken","",{maxAge:1})
        resp.status(200).json({message:"User logged out!!"})
    } catch (error) {
        resp.status(404).json({message:error.message})
    }
})




module.exports=router