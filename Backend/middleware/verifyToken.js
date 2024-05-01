const jwt =require('jsonwebtoken')
const cookieParser=require('cookie-parser')

const USER = require('../Schema/USER')



const verifyToken=async(req,resp,next)=>{
    
try {
    const token = req.cookies.jwtToken
    if(!token){
        return resp.status(404).json({message:"Un-authorized"})
    }
    const decoded=jwt.verify(token,'minProject16')
    const loggedInUser = await USER.findById(decoded.id).select("-password")
    req.userId = loggedInUser._id


    next()
} catch (error) {
    resp.status(404).json({message:error.message})
}

}




module.exports=verifyToken