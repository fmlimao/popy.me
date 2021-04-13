console.clear();
require('dotenv-safe').config();

const express = require('express');
const logger = require('morgan');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

app.use(require('./src/routes'));

const port = process.env.APP_PORT || 10500;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});