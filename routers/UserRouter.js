const UserController = require('../controllers/UserController');

const router = require("express").Router();

router.get("/getAllUserProvider", UserController.getAllUserProvider);
router.get("/getAllBNPLPersonal", UserController.getAllBNPLPersonal);
router.get("/getAllBNPLCustomer", UserController.getAllBNPLCustomer);
router.get("/getAllEAP", UserController.getAllEAP);
router.get("/getUserBNPL/:id", UserController.getUserBNPL);
router.get("/getUserEAP/:id", UserController.getUserEAP);

router.get("/searchBNPL", UserController.searchBNPL);
router.get("/searchEAP", UserController.searchEAP);
router.get("/search", UserController.search);

router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Soft Delete
router.delete("/deleteSoftBNPL/:id", UserController.deleteSoftBNPL);
router.delete("/deleteSoftEAP/:id", UserController.deleteSoftEAP);

// Force Delete
router.delete("/deleteForceBNPL/:id", UserController.deleteForceBNPL);
router.delete("/deleteForceEAP/:id", UserController.deleteForceEAP);

// Restore 
router.put("/restoreBNPL/:id", UserController.restoreBNPL);
router.put("/restoreEAP/:id", UserController.restoreEAP);

router.get("/getAllTrashBNPL", UserController.getAllTrashBNPL);
router.get("/getAllTrashEAP", UserController.getAllTrashEAP);

router.delete("/deleteAccountBNPL", UserController.deleteAccountBNPL);
router.delete("/deleteAccountEAP", UserController.deleteAccountEAP);

module.exports = router;