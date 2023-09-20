const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const siteSchema = new Schema({
  id:Number,
  url: String, 
  title: String, 
  description: String,
  place:Number,
  category:String,
  keywords:[String],
  competitors: [{
    url: String, 
    title: String, 
    description: String,
    place:Number
  }]
}, {versionKey: false});

module.exports = mongoose.model('Site', siteSchema)