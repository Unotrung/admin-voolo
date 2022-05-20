const UserController = require('../controllers/UserController');
const MiddlewareController = require('../controllers/MiddlewareController');

const router = require('express').Router();

router.get('/getAllUserProvider', MiddlewareController.verifyToken, UserController.getAllUserProvider);
router.get('/getAllBNPLPersonal', MiddlewareController.verifyToken, UserController.getAllBNPLPersonal);
router.get('/getAllBNPLCustomer', MiddlewareController.verifyToken, UserController.getAllBNPLCustomer);
router.get('/getAllEAP', MiddlewareController.verifyToken, UserController.getAllEAP);

router.get('/getUserBNPL/:id', MiddlewareController.verifyToken, UserController.getUserBNPL);
router.get('/getUserEAP/:id', MiddlewareController.verifyToken, UserController.getUserEAP);

router.get('/searchBNPL', MiddlewareController.verifyToken, UserController.searchBNPL);
router.get('/searchEAP', MiddlewareController.verifyToken, UserController.searchEAP);
router.get('/search', MiddlewareController.verifyToken, UserController.search);

router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Soft Delete
router.delete('/deleteSoftBNPL/:id', MiddlewareController.verifyToken, UserController.deleteSoftBNPL);
router.delete('/deleteSoftEAP/:id', MiddlewareController.verifyToken, UserController.deleteSoftEAP);

// Force Delete
router.delete('/deleteForceBNPL/:id', MiddlewareController.verifyToken, UserController.deleteForceBNPL);
router.delete('/deleteForceEAP/:id', MiddlewareController.verifyToken, UserController.deleteForceEAP);

// Restore 
router.put('/restoreBNPL/:id', MiddlewareController.verifyToken, UserController.restoreBNPL);
router.put('/restoreEAP/:id', MiddlewareController.verifyToken, UserController.restoreEAP);

router.get('/getAllTrashBNPL', MiddlewareController.verifyToken, UserController.getAllTrashBNPL);
router.get('/getAllTrashEAP', MiddlewareController.verifyToken, UserController.getAllTrashEAP);

router.delete('/deleteAccountBNPL', UserController.deleteAccountBNPL);
router.delete('/deleteAccountEAP', UserController.deleteAccountEAP);

//Report
router.get('/getReportBNPL', MiddlewareController.verifyToken, UserController.getReportBNPL);

router.put('/requestRefreshToken', MiddlewareController.verifyToken, UserController.requestRefreshToken);
router.put('/logout', MiddlewareController.verifyTokenByMySelf, UserController.logout);

module.exports = router;