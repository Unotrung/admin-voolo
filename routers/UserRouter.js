const UserController = require('../controllers/UserController');
const Middleware = require('../middleware/auth');

const router = require('express').Router();

router.get('/getAllUserProvider',Middleware, UserController.getAllUserProvider);
router.get('/getAllBNPLPersonal',Middleware, UserController.getAllBNPLPersonal);
router.get('/getAllBNPLCustomer',Middleware, UserController.getAllBNPLCustomer);
router.get('/getAllEAP',Middleware, UserController.getAllEAP);
router.get('/getUserBNPL/:id',Middleware, UserController.getUserBNPL);
router.get('/getUserEAP/:id',Middleware, UserController.getUserEAP);

router.get('/searchBNPL',Middleware, UserController.searchBNPL);
router.get('/searchEAP',Middleware, UserController.searchEAP);
router.get('/search',Middleware, UserController.search);

router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Soft Delete
router.delete('/deleteSoftBNPL/:id',Middleware, UserController.deleteSoftBNPL);
router.delete('/deleteSoftEAP/:id',Middleware, UserController.deleteSoftEAP);

// Force Delete
router.delete('/deleteForceBNPL/:id',Middleware, UserController.deleteForceBNPL);
router.delete('/deleteForceEAP/:id',Middleware, UserController.deleteForceEAP);

// Restore 
router.put('/restoreBNPL/:id',Middleware, UserController.restoreBNPL);
router.put('/restoreEAP/:id',Middleware, UserController.restoreEAP);

router.get('/getAllTrashBNPL',Middleware, UserController.getAllTrashBNPL);
router.get('/getAllTrashEAP',Middleware, UserController.getAllTrashEAP);

router.delete('/deleteAccountBNPL',Middleware, UserController.deleteAccountBNPL);
router.delete('/deleteAccountEAP',Middleware, UserController.deleteAccountEAP);

//Report
router.get('/getReportBNPL',Middleware,UserController.getReportBNPL);
module.exports = router;