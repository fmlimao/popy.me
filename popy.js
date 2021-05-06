console.clear();
require('dotenv-safe').config();

const express = require('express');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

const app = express();
app.use(logger('dev', {
    skip: function (req) {
        return req.url.indexOf('bower_components') !== -1;
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));
app.use(cookieParser());

app.set('views', './src/v1/views');
app.set('view engine', 'ejs');

app.use('/admin', expressLayouts);
app.set('layout', 'admin/layout');

app.use(require('./src/v1/middlewares/api/json-return'));

app.use(require('./src/routes'));

// Erros 404 e 500
app.use(require('./src/v1/middlewares/site/error-404'));
app.use(require('./src/v1/middlewares/site/error-500'));

const port = process.env.APP_PORT || 10500;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});