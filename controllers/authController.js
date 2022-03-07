const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const register = async (req, res) => {
  const {email} = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const user = await User.create(req.body);
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const tokenUser = createTokenUser(user);
  const cooki=attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({user:tokenUser,token:cooki});
};
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const forgetpassword = async (req,res) => {
 
  const userinfo = await User.findOne({ email: req.body.email });
if(!userinfo)
{
  throw new CustomError.BadRequestError('Please provide valid email');
}

  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
          user: 'harsh.sws2020@gmail.com',
          pass: 'alfypvcofofrwdap'
      }
  });
  var otp = Math.floor(100000 + Math.random() * 900000);
  const mailid = req.body.email;
  const uinfo = await User.findOneAndUpdate({email:mailid},{otp:otp})

       ejs.renderFile("./view/forget_email.ejs", { name: uinfo.user_name,'otp':otp }, function (err, data) {
      if (err) {
          console.log(err);
      } else {
          var mainOptions = {
              from: '"Tester" harsh123@yopmail.com',
              to: uinfo.email,
              subject: 'Hello, world',
              html: data
          };
         // console.log("html data ======================>", mainOptions.html);
          transporter.sendMail(mainOptions, function (err, info) {
              if (err) {
                  res.send(err);
              } else {
                res.status(StatusCodes.OK).json({ msg: 'OTP send successfully on your mail please verify!',email:req.body.email});
              }
          });
      }
      });
}
const otpverify = async (req,res) => {
  const userinfo = await User.findOne({email:req.body.email,otp:req.body.otp});
  if(!userinfo)
  {
    throw new CustomError.BadRequestError('Invalid OTP');
  }
  else {
    res.status(StatusCodes.OK).json({ msg: 'You are successfully verified',email : req.body.email });
  }
}

const setpassword =async (res,req)=>{
  console.log(req.body.email)
  const uinfo = await User.findOneAndUpdate({email:`meenakshiibr@gmail.com`},{password:req.body.password})
  if(!uinfo)
  {
    throw new CustomError.BadRequestError('Failed');
  }
  else {
    res.status(StatusCodes.OK).json({ msg: 'Your password successfully changed' });
  }

}


module.exports = {
  register,
  login,
  logout,
  forgetpassword,
  otpverify,
  setpassword
};
