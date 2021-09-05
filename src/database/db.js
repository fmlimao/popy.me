require('dotenv-safe').config()

const knex = require('knex')

module.exports = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    charset: 'utf8',
    dateStrings: true
  },
  useNullAsDefault: true
})
