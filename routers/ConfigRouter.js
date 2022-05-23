const ConfigController = require('../controllers/ConfigController');
const MiddlewareController = require('../controllers/MiddlewareController');

const router = require('express').Router();

router.get('/', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, ConfigController.getConfig);
router.put('/', MiddlewareController.verifySecurity, MiddlewareController.verifyToken, ConfigController.putConfig);

module.exports = router;