const express = require('express');

const router = express.Router();

// Rotas especificas precisam vir antes das rotas genericas,
// pois algumas funcionalidades (middlewares, por exemplo) pode
// acabar funcionando em rotas indevidas.

// Rodas da V1 da API
router.use('/api/v1', require('./v1/routes-api'));

// Rotas do Site
router.use('/', require('./v1/routes-site'));

module.exports = router;
