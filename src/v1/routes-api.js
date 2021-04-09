const express = require('express');

const router = express.Router();

const getUserMiddleware = require('./middlewares/api/get-user');

router.use(require('./middlewares/api/json-return'));

router.get('/users', require('./controllers/api/users/list'));
router.get('/users/:user_id', getUserMiddleware, require('./controllers/api/users/show'));

// Erro 404
router.use(require('./middlewares/api/error-404'));

// Erro 500
router.use(require('./middlewares/api/error-500'));

module.exports = router;
