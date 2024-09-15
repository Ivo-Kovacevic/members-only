const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.indexGet);

indexRouter.get("/register", indexController.registerGet);
indexRouter.post("/register", indexController.registerPost);

indexRouter.get("/login", indexController.loginGet);
indexRouter.post("/login", indexController.loginPost);

indexRouter.get("/logout", indexController.logoutGet);

indexRouter.get("/add-message", indexController.addMessageGet);
indexRouter.post("/add-message", indexController.addMessagePost);

indexRouter.get("/delete/:id", indexController.deleteMessageGet);

module.exports = indexRouter;
