const jwt = require("jsonwebtoken");
const {userSchema} = require('./schema');
const secret = 'olalekan';

module.exports.verifyToken = (req,res,next) => {
    try{
        const token = req.headers['x-access-token'];
        if(!token){
            res.status(401).send({auth:false,message:'You have to be Autheticated'});
        }
      const decoded = jwt.verify(token,secret)
      req.userId = decoded.id;
      next();
    } catch(error){
        res.status(error?.status || 500)
           .send({message:error?.message})
    }
}

// module.exports.isLoggedIn  = (req,res,next)  => {
//     try{

//     }
// }
module.exports.validateUser = (req,res,next) => {
    const {error} = userSchema.validate(req.body);
    if(error) {
       return res.status(error?.status || 400)
                 .send({message:error?.message || error}) 
    }
    next();
}