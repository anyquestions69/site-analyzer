const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const siteSchema = new Schema({
  url: {type:String, unique:true}, 
  title: String, 
  description: String,
  domain:String,
  pages:[{
    name:String,
    url:String
  }],
  category:String,
  theme:String,
  keywords:[{word:String,frequency:String}],
  competitors: [{
    url: String, 
    title: String
  }]
}, {versionKey: false});

module.exports = mongoose.model('Site', siteSchema)