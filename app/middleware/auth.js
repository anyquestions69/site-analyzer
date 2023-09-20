const Site = require('../models/user')
const config = process.env;
const jwt = require('jsonwebtoken')

class Auth{
    async getUser(req,res,next){
        const token = req.cookies.user
        
        if(token){
        await jwt.verify(token, process.env.TOKEN_SECRET, async(err, user) => {
            let exists = await Site.findOne({where:{id:user.id}})
            if(exists)
                req.site = exists  
        })
        }
        next()
    }
    async isAuth(req,res,next){
        const token = req.cookies.user
        
        if(token){
        await jwt.verify(token, process.env.TOKEN_SECRET, async(err, user) => {
            let exists = await Site.findOne({where:{id:user.id}})
            if(exists)
                req.site = exists  
        })
        }
        next()
    }
   
}
module.exports = new Auth()