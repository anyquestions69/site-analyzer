const Site = require('../models/user')

class Manager{

    async getAll(req,res){
        try{
            let sites = await Site.find({})
            return res.send(sites)
        }catch(e){
            console.log(e)
        }
    }
   async getMany(req,res){
    try{
        let {sites} = req.body
        let knownSites=[]
        let unknownSites=[]
        for(let site of sites){
            let s = await Site.findOne({url:site.url})
            if(s){
                knownSites.push(s)
            }else{
                unknownSites.push(site)
            }
        }
        
        return res.send({knownSites, unknownSites})
    }catch(e){
        console.log(e)
        return res.status(404).send('Ошибка')
    }
   }
   async getByTheme(req,res){
        try {
            let theme = req.params['theme']
            let s = await Site.find({theme:theme})
            return res.send({competitors:s})
        } catch (error) {
            return res.status(404).send(e)
        }
   }
   
   async uploadMany(req,res){
    let result = await Site.insertMany(req.body.unknownSites)
    return res.send(result)
   }
    async siteInfo(req,res){
        try{
            let {url} = req.body
            let site = await Site.findOne({url:url})
            if(site){
                return res.send(site)
            }
            return res.send({url:url})
        }catch(e){
            console.log(e)
            return res.status(404).send(e)
        }
        
    }

    async updateInfo(req,res){
        try{
            let {url, theme, category, pages, title, domain, keywords } = req.body
            
            let exist = await Site.findOne({url:url})
            let site 
            if(exist){
               site = exist
               return res.send(site)
               
            }else{
                
                site = await Site.create({url, theme, category, pages, title, domain, keywords });
               
            }
            return res.send(site)
        }catch(e){
            console.log(e)
            return res.status(404).send(e)
        }
        
    }

   

    
    
}
let manager = new Manager()
module.exports = manager