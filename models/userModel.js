const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


mongoose.set('strictQuery', false);

// create a userSchema with name,email,photo,password and passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please tell us your email address!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address."]
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minlength: 8,
    select: false // password have never shown in any output
  },
  passwordConfirm: {
    type: String,
    required: [true,"Please confirm your password."],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords do not match."
    }
  },
});

userSchema.pre('save', async function(next) {
  const user = this;

  // Only run this function if password was actually modified
  if (!user.isModified('password')) return next();
  
  // Hash the password with cost of 12
  user.password = await bcrypt.hash(user.password, 12);
  
  // Delete passwordConfirm field
  user.passwordConfirm = undefined;
  next();
});


userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
  return await bcrypt.compare(candidatePassword,userPassword);
}


const User = mongoose.model('User', userSchema);
module.exports = User;