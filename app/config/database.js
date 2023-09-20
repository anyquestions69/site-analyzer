const mongoose = require("mongoose");
const config = process.env;
const URL = process.env.MONGODB_URL


const connectDB = ()=>{
  mongoose.connect(URL)
}
module.exports = connectDB