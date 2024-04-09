const express=require('express')
const bcrypt =require('bcrypt')
const USER = require('../Schema/USER')

const cookieParser=require('cookie-parser')
const jwt=require('jsonwebtoken')
const verifyToken = require('../middleware/verifyToken')
const BOOK = require('../Schema/BOOK')
const router = express.Router()


//register
router.post("/register",async(req,resp)=>{
    const { adhaarNum,username, email, password } = req.body;
    try {
        if (!username || !email || !adhaarNum || !password) {
            return resp.status(400).json({ error: "Please fill all credentials" });
        }
        const existingUsername = await USER.findOne({ $or: [{ username }, { email }] });
        if (existingUsername) {
            return resp.status(400).json({ error: "Username or email already taken" });
        }
        const salt =await bcrypt.genSalt(10)
        const hashedPassword =await bcrypt.hash(password,salt);

        const newUser = new USER({
            username,
            email,
            password: hashedPassword,
            adhaarNum
        });
        await newUser.save();
        resp.status(201).json({ message: "User registered successfully",newUser});
    } catch (error) {
        console.log("error in user registration",error);
        resp.status(500).json({ error: "Internal server error in User registration" });
    }
})

router.post('/login', async (req, resp) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return resp.status(400).json({ error: "Enter all credentials" });
        }
        const alreadyUser = await USER.findOne({ username });
        if (!alreadyUser) {
            return resp.status(404).json({ error: "No user found with this username, register first" });
        }
        const comparePw = await bcrypt.compare(password, alreadyUser.password);
        if (!comparePw) {
            return resp.status(400).json({ error: "Incorrect Password" });
        }
        const token = await jwt.sign({id:alreadyUser._id},process.env.KEY,{expiresIn:'5h'})
        resp.cookie("jwtToken",token,{path:'/',httpOnly:true,sameSite:'lax',expires:new Date(Date.now()+1000*21600)})
        resp.status(201).json({ message: "User Logged In", alreadyUser, token });

    } catch (error) {
        console.log("error in user login : ",error);
        resp.status(500).json({ error: "Internal server error in User login" });
    }
});

router.get("/jwt",verifyToken,async(req,resp)=>{
    const userId=req.userId
    try {
        if(!userId){
            return resp.status(404).json({error:"Un-authorized,log in first"})
        }
        const getFullUser = await USER.findById(userId);
        resp.status(200).json(getFullUser);
    } catch (error) {
        console.log("error in jwt fetching : ",error);
        resp.status(500).json({ error: "Internal server error in jwt" });
    }
})


router.put('/update', verifyToken, async (req, resp) => {
    const {username,password,email} = req.body;
    const userId = req.userId;

    try {
        if (!userId) {
            return resp.status(404).json({ error: "Un-authorized,log in first" });
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPw = await bcrypt.hash(password, salt);
            req.body.password = hashedPw;
        }
        const upDateUser = await USER.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true });
        const getFullUser = await USER.findById(userId);
        resp.status(200).json(getFullUser);
    } catch (error) {
        resp.status(404).json({ message: error.message });
    }
});


router.post("/logout",verifyToken,async(req,resp)=>{
    const userId=req.userId
    try {
        if(!userId){
            return  resp.status(500).json({ error: "Un-authorized" });   
        }
        await resp.clearCookie('jwtToken', { path: '/' });
        resp.status(201).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error in logout : ",error);
        resp.status(500).json({ error: "Internal server error in logout" });
    }
})


router.get("/myBooks",verifyToken,async(req,resp)=>{
    const userId=req.userId
    try {
       if(!userId){
        return resp.status(404).json({error:"Un-authorized,log in first"}) 
       }
       const books=await BOOK.find({owner:userId}).populate("holder","username email")
       if(!books || books.length===0){
        return resp.status(404).json({message:"No books found"})
       }
       resp.status(200).json(books);
    } catch (error) {
        console.log("error in myBooks : ",error);
        resp.status(500).json({ error: "Internal server error in myBooks" });
    }
})





module.exports=router