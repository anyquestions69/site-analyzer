const express = require("express");
const siteController = require("../controllers/siteController.js");
const siteRouter = express.Router();


siteRouter.post('/', siteController.updateInfo)
siteRouter.post("/info",siteController.siteInfo);
siteRouter.get("/all", siteController.getAll);
siteRouter.post('/getmany', siteController.getMany)

siteRouter.post('/addmany', siteController.uploadMany)

siteRouter.get('/theme/:theme', siteController.getByTheme)
 
module.exports = siteRouter;