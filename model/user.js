const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required: true,
        trim: true,
    },
    email:{
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error('Invalid Email') 
            }
        }
    },
    password:{
        type : String,
        required : true,
        trim : true,
        min : 7
    },
    name : {
        type : String,
        required : true
    },
    university :{
        type : String,
        required : true
    },
    course:{
        type : String,
        required : true    
    },
    location : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required : false
    }   
})


userSchema.methods.getAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user.id.toString()},process.env.SECRET_KEY)
    return token

}

userSchema.statics.findByCredentials = async (username,password)=>{
    const user = await User.findOne({username})
    if(!user){
        throw new Error('Login Error')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Password Mismathced')
    }
    return user
    
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,5)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = {
    User
}