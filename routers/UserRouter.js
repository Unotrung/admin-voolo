const UserController = require('../controllers/UserController');
const MiddlewareController = require('../controllers/MiddlewareController');

const router = require('express').Router();

router.get('/getAllUserProvider', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.getAllUserProvider);
router.get('/getAllBNPLPersonal', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.getAllBNPLPersonal);
router.get('/getAllBNPLCustomer', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.getAllBNPLCustomer);
router.get('/getAllEAP', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.getAllEAP);

router.get('/getUserBNPL/:id', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.getUserBNPL);
router.get('/getUserEAP/:id', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.getUserEAP);

router.get('/searchBNPL', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.searchBNPL);
router.get('/searchEAP', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.searchEAP);
router.get('/search', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.search);

router.post('/register', MiddlewareController.verifySecurity, UserController.register);
router.post('/login', MiddlewareController.verifySecurity, UserController.login);

// Soft Delete
router.delete('/deleteSoftBNPL/:id', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.deleteSoftBNPL);
router.delete('/deleteSoftEAP/:id', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.deleteSoftEAP);

// Force Delete
router.delete('/deleteForceBNPL/:id', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.deleteForceBNPL);
router.delete('/deleteForceEAP/:id', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.deleteForceEAP);

// Restore 
router.put('/restoreBNPL/:id', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.restoreBNPL);
router.put('/restoreEAP/:id', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.restoreEAP);

router.get('/getAllTrashBNPL', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.getAllTrashBNPL);
router.get('/getAllTrashEAP', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.getAllTrashEAP);

router.delete('/deleteAccountBNPL', UserController.deleteAccountBNPL);
router.delete('/deleteAccountEAP', UserController.deleteAccountEAP);

//Report
router.get('/getReportBNPL', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.getReportBNPL);

router.put('/requestRefreshToken', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, UserController.requestRefreshToken);
router.put('/logout', MiddlewareController.verifySecurity, MiddlewareController.verifyTokenByMySelf, UserController.logout);

module.exports = router;