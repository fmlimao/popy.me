const express = require('express');

const router = express.Router();

router.use('/', require('./v1/routes-site'));
router.use('/api/v1', require('./v1/routes-api'));

module.exports = router;
