const express = require('express');

const router = express.Router();

const maintenanceMiddleware = require('./middlewares/api/maintenance');
const authMiddleware = require('./middlewares/api/auth');
const getUserMiddleware = require('./middlewares/api/get-user');

router.use(require('./middlewares/api/json-return'));

// Middleware para API em Manutenção
router.use(maintenanceMiddleware);

// Rota de Autenticação
router.post('/auth', require('./controllers/api/auth/auth'));

// Middleware de Autenticação
router.use(authMiddleware);

// Rotas de controle de Usuários
router.get('/users', require('./controllers/api/users/list'));
router.post('/users', require('./controllers/api/users/store'));
router.get('/users/:user_id', getUserMiddleware, require('./controllers/api/users/show'));
router.put('/users/:user_id', getUserMiddleware, require('./controllers/api/users/update'));
router.put('/users/:user_id/active/:active', getUserMiddleware, require('./controllers/api/users/active'));
router.delete('/users/:user_id', getUserMiddleware, require('./controllers/api/users/remove'));

// Erro 404
router.use(require('./middlewares/api/error-404'));

// Erro 500
router.use(require('./middlewares/api/error-500'));

module.exports = router;
