const UserController = require('../controllers/UserController');

const router = require("express").Router();

router.get("/getAllUserProvider", UserController.getAllUserProvider);
router.get("/getAllBNPL", UserController.getAllBNPL);
router.get("/getAllEAP", UserController.getAllEAP);

router.get("/searchBNPL", UserController.searchBNPL);
router.get("/searchEAP", UserController.searchEAP);

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.delete("/deleteBNPL/:id", UserController.deleteBNPL);
router.delete("/deleteEAP/:id", UserController.deleteEAP);

module.exports = router;