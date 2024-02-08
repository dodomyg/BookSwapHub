const mongoose=require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    adhaarNum: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (value) => /^[0-9]{12}$/.test(value),
          message: 'Invalid Aadhaar number. It must be a 12-digit numeric value.',
        },
      },
    
},{timestamps:true})

module.exports=mongoose.model('USER',UserSchema)