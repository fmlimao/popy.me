const express = require('express');

const router = express.Router();

const maintenanceMiddleware = require('./middlewares/site/maintenance');

// Middleware para Site em Manutenção
router.use(maintenanceMiddleware);

router.get('/', require('./controllers/site/home'));

// Erro 404
router.use(require('./middlewares/site/error-404'));

// Erro 500
router.use(require('./middlewares/site/error-500'));

module.exports = router;
