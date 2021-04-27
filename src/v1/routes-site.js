const express = require('express');

const router = express.Router();

const maintenanceMiddleware = require('./middlewares/site/maintenance');

// Middleware para Site em Manutenção
router.use(maintenanceMiddleware);

router.get('/', require('./controllers/site/home'));

module.exports = router;
