const express = require("express");
const userController = require("../controllers/userController.js");
const mw = require('../middleware/auth.js')
const userRouter = express.Router();
 
userRouter.get("/", userController.getAll);
userRouter.get('/self',  mw.isAuth, userController.getName)
userRouter.get('/:id', userController.getOne)
 
module.exports = userRouter;