const UserController = require('../controllers/UserController');

const router = require("express").Router();

router.get("/getAllBNPL", UserController.getAllBNPL);
router.get("/search", UserController.search);
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;