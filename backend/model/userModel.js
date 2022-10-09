const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
name:{
    type: String,
    required: [true, "Please enter name"],
    maxlength:[30,"Name cannot exceed 30 characters"],
    minlength:[4,"Name should have more than 4 charcters"]
},
email:{
    type: String,
    required: [true,"Please enter your email"],
    unique: true,
    validate:[validator.isEmail,"Please enter a valid Email"]
},
password:{
    type: String,
    required:[true,"Please enter your password"],
    minlength:[8,"Password should be greater than 8 charcters"],
    select: false
},
avatar:{
    public_id: {
         type: String,
         required:true
        },
     url:{
        type: String,
         required:true
        }
       },
role:{
    type: String,
    default:"user"
},
createdAt: {
    type: Date,
    default: Date.now,
  },
resetPasswordToken: String,    
resetPasswordExpire: Date
})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){      //password modified ya change hua hai to hash karega aur agar nai modified ya change hua to hash nai karega
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})
// Generate Jwt Token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id : this._id },process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}
// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword,this.password);
}
// Generating password reset token
userSchema.methods.getResetPasswordToken = function() {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hashing and adding resetPasswordToken and resetPasswordExpire to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken
}

module.exports = mongoose.model("User",userSchema);