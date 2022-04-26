const ConfigController = require('../controllers/ConfigController');

const router = require('express').Router();

router.get('/', ConfigController.getOtpConfig);
router.put('/', ConfigController.putOtpConfig);

module.exports = router;