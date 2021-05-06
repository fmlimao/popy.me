const express = require('express');

const router = express.Router();

const maintenanceMiddleware = require('./middlewares/admin/maintenance');
const authMiddleware = require('./middlewares/admin/auth');

// Middleware para Site em Manutenção
router.use(maintenanceMiddleware);

router.get('/login', require('./controllers/admin/login/get'));
router.post('/login', require('./controllers/admin/login/post'));
router.get('/logout', require('./controllers/admin/login/logout'));

// Middleware de autenticação
router.use(authMiddleware);

router.get('/', require('./controllers/admin/home'));

// Erro 404
router.use(require('./middlewares/admin/error-404'));

// Erro 500
router.use(require('./middlewares/site/error-500'));

module.exports = router;
