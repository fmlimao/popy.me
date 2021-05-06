const express = require('express');
const path = require('path');

const router = express.Router();

const maintenanceMiddleware = require('./middlewares/api/maintenance');
const aclMiddleware = require('./middlewares/api/acl');
const routeAclMiddleware = require('./middlewares/api/route-acl');
const authMiddleware = require('./middlewares/api/auth');
const getUserMiddleware = require('./middlewares/api/get-user');

router.get('/doc', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../public/swagger/index.html'));
});

router.get('/doc.yaml', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../docs/fmlimao-PopyMe-1.0.0-resolved.yaml'));
});

// Middleware para API em Manutenção
router.use(maintenanceMiddleware);

// Rota de Autenticação
router.post('/auth', require('./controllers/api/auth/auth'));

// Middleware de ACL
router.use(aclMiddleware);

// Middleware de Autenticação
router.use(authMiddleware);

// Rota de dados do Usuário do Token
router.get('/me', routeAclMiddleware('users', 'me'), require('./controllers/api/users/me'));

// Rotas de controle de Usuários
router.get('/users', routeAclMiddleware('users', 'list'), require('./controllers/api/users/list'));
router.post('/users', routeAclMiddleware('users', 'store'), require('./controllers/api/users/store'));
router.get('/users/:user_id', routeAclMiddleware('users', 'show'), getUserMiddleware, require('./controllers/api/users/show'));
router.put('/users/:user_id', routeAclMiddleware('users', 'update'), getUserMiddleware, require('./controllers/api/users/update'));
router.put('/users/:user_id/active/:active', routeAclMiddleware('users', 'active'), getUserMiddleware, require('./controllers/api/users/active'));
router.delete('/users/:user_id', routeAclMiddleware('users', 'remove'), getUserMiddleware, require('./controllers/api/users/remove'));

// Erro 404
router.use(require('./middlewares/api/error-404'));

// Erro 500
router.use(require('./middlewares/api/error-500'));

module.exports = router;
