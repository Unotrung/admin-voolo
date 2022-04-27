const ConfigController = require('../controllers/ConfigController');

const router = require('express').Router();

router.get('/', ConfigController.getConfig);
router.put('/', ConfigController.putConfig);

module.exports = router;