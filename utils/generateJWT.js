const Jwt = require('jsonwebtoken')

module.exports = async (payload) =>{
   const token = await Jwt.sign(
    payload ,
    process.env.JWT_SECRET_KEY,
    {expiresIn:"10m"})
    return token;
}