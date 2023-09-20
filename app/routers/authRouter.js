const express = require("express");
const userController = require("../controllers/userController.js");
const mw = require('../middleware/auth.js')
const userRouter = express.Router();
 
userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.post('/logout', mw.isAuth, userController.logout)

 
module.exports = userRouter;