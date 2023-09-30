const express = require("express");
const siteController = require("../controllers/siteController.js");
const mw = require('../middleware/auth.js')
const siteRouter = express.Router();

siteRouter.post("/info",siteController.siteInfo);
siteRouter.get("/all", siteController.getAll);

siteRouter.post('/', siteController.updateInfo)
siteRouter.post('/add', siteController.add)
siteRouter.post('/addmany', siteController.uploadMany)
siteRouter.get('/:theme', siteController.getByTheme)
 
module.exports = siteRouter;