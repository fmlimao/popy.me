const express = require('express');

const router = express.Router();

router.use(require('./middlewares/api/json-return'));

router.get('/users', require('./controllers/api/users/list'));

// Erro 404
router.use(require('./middlewares/api/error-404'));

// Erro 500
router.use(require('./middlewares/api/error-500'));

module.exports = router;
