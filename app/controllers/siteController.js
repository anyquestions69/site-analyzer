const Site = require('../models/user')
const jwt = require('jsonwebtoken')

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, users, totalPages, currentPage };
  };

class Manager{

    async getAll(req,res){
        try{
            let sites = await Site.find({})
            return res.send(sites)
        }catch(e){
            console.log(e)
        }
    }
   
    async siteInfo(req,res){
        try{
            let site = await Site.find({id:req.params['id']})
            return res.send(site)
        }catch(e){
            console.log(e)
        }
        
    }

    async updateInfo(req,res){
        let {title,url, description, category, competitors}=req.body
       let site = await Site.findOneAndUpdate({url}, {title, description,category, competitors}, {new: true});
        return res.send(site)
    }

   

    async add(req, res){
        try{
            let {url} = req.body
            
                  let site = await Site.create({url})
            const token = jwt.sign({id:site.id, site:site.url}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
            return res.cookie('site',token, { maxAge: 900000, httpOnly: true }).send(token)
        }catch(e){
            console.log(e)
            return res.status(404).send('Ошибка')
        }
    }

    

    async logout(req,res){
        return res.clearCookie("site").status(200);
    }

    
    
}
let manager = new Manager()
module.exports = manager