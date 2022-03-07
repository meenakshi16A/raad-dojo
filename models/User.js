const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { number } = require('joi');

const UserSchema = new mongoose.Schema({
  first_name: {
    type:String,
 
    required: [true, 'Please provide first name'],
    minlength: 3,
    maxlength: 50,
  },
  middle_name: {
    type:String,
    required: [true, 'Please provide middle name'],
    minlength: 3,
    maxlength: 50,
  },
  last_name: {
    type:String,
    required: [true, 'Please provide last name'],
    minlength: 3,
    maxlength: 50,
  },
  user_name: {
    type:String,
    required: [true, 'Please provide user name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  address:{
    type: String,
    required: [true, 'Please provide address']
  },
  country:{
    type: String,
    required: [true, 'Please provide address']
  },
  city:{
    type: String,
    required: [true, 'Please provide address']
  },
  country_code:{
    type: number,
    required: [true, 'Please provide Country code']
  },
  phone_number:{
    type: number,
    required: [true, 'Please provide Phone number']
  },
  // role: {
  //   type: String,
  //   enum: ['admin', 'user','trainer'],
  //   default: 'user',
  // },
});

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
