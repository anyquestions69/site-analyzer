const express = require("express");
const siteController = require("../controllers/siteController.js");
const mw = require('../middleware/auth.js')
const siteRouter = express.Router();

siteRouter.get("/info",mw.isAuth, siteController.siteInfo);
siteRouter.get("/all", siteController.getAll);

siteRouter.post('/', siteController.updateInfo)
siteRouter.post('/add', siteController.add)
 
module.exports = siteRouter;