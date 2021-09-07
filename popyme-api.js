console.clear()
require('dotenv-safe').config()

const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./public'))

app.set('views', './src/views')
app.set('view engine', 'ejs')

// Rotas
app.use(require('./src/routes'))

// Erros
app.use(require('./src/middlewares/error-404'))
app.use(require('./src/middlewares/error-500'))

const port = process.env.APP_PORT || 10500

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
