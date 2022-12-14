const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const {generateOtp} = require('../services/otp');
const {sendMail} = require('../services/mail');
const {generateToken} = require('../services/jwt');
const secret = 'olalekan';


module.exports.register = async (req,res) => {
    try {
        const {password,username,email} = req.body;
        const findByEmail = await User.findOne({email});
        const findByUsername =  await User.findOne({username});
        if(findByEmail){
            return res.status(419).send({message:'User with the given email already exist'})
        }
        if(findByUsername){
            return res.status(419).send({message:'User with the given username exist'})
        }
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const code = generateOtp();
        const otp = OTP.create({
          otp:code,
          userId : findByEmail._id || findByUsername._id,
        })
        const user = new User({
            password:hashedPassword,
            username,
            email,
            otp:otp._id,
        })
        try {
            await sendMail(email,code)
        } catch (error) {
         return   res.status(error?.status || 500)
               .send({message:error?.message || error})
        }
        await user.save();
        const token = generateToken(user);
      return res.status(200).send({auth:true,data:token})
       } catch (error) {
         return  res.status(error?.status || 500)
              .send({message:error?.message || error,error:error?.stack})
       }   
}

module.exports.registeredUser = async (req,res) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId,{password : 0})
        if(!user) {
          return  res.status(400).send({status:false,message:'Invalid Token'})
        }
        return res.status(200).send({status:true,data:user})
    } catch (error) {
      return  res.status(error?.staus || 500)
           .send({message:error?.message || error})         
    }    
}

module.exports.login = async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
          return  res.status(404).send({message:'User with the provided email does not exist'})
        }
        const passwordIsValid = bcrypt.compareSync(password,user.password);
        if(!passwordIsValid){
         return   res.status(401).send({auth:false,token:null,message:'Email or password Incorrect'});
        }
        const token = generateToken(user);  
      return res.status(200).send({auth:true,data:token})
    } catch (error) {
      return  res.status(error?.status || 500)
           .send({message:error?.message || error});
    }
}

module.exports.verifyOtp = async (req,res) => {
   try {
    const {otp,email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
      return  res.status(400).send({message:'User does not exist'});
    }
    if(user&&user.otp !== otp) {
      return res.status(400).send({message:'Invalid Otp'})
    }
    return  res.status(200).send({status:'OK',message:'OTP verified sucessful'});

   } catch(error) {
    return res.status(error?.status || 500)
       .send({message:error?.message || error})
   }
}

module.exports.logout = (req,res) => {
  res.status(200).send({auth:false,token:null})
}