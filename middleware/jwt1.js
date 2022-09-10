const jwt = require('jsonwebtoken');
const knex = require('../dbconnection/DB')
const generateToken = ((id)=>{
    return jwt.sign(id,'slskdfj987436uhkjsdkjsdf8746sdf')
})
const verifyToken = async(req,res,next)=>{
    if(req.headers.cookie){
        const Token = req.headers.cookie.split('=')[1]
        const UserId = jwt.verify(Token,'slskdfj987436uhkjsdkjsdf8746sdf')
        const UserData = await knex('userData').where({id:UserId})
        req.UserData = UserData
        next()
    }
    else{
        res.status(401).json({msg:'login first'})
    }
}
module.exports = {generateToken,verifyToken}