const Site = require('../models/user')
const config = process.env;
const jwt = require('jsonwebtoken')

class Auth{
    
    async isAuth(req,res,next){
        const token = req.cookies.site
        
        if(token){
        await jwt.verify(token, process.env.TOKEN_SECRET, async(err, site) => {
            let exists = await Site.findOne({url:site.site})
            if(exists){
                req.site = exists  
                next()
            }else{return res.status(404).send('error')}
            
        })
        }else{
            return res.status(404).send('error')
        }
        
    }
   
}
module.exports = new Auth()