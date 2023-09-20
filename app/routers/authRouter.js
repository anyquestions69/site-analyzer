const express = require("express");
const userController = require("../controllers/siteController.js");
const mw = require('../middleware/auth.js')
const userRouter = express.Router();
 
 
module.exports = userRouter;