const express = require("express");
const siteController = require("../controllers/siteController.js");
const mw = require('../middleware/auth.js')
const siteRouter = express.Router();
 
siteRouter.get("/", siteController.getAll);
siteRouter.get("/:id", siteController.siteInfo);
siteRouter.post('/', siteController.updateInfo)
siteRouter.post('/add', siteController.add)
 
module.exports = siteRouter;