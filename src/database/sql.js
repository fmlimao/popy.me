class Sql {
  constructor (connection) {
    this.connection = connection
  }

  transaction () {
    return this.connection.transaction()
  }

  getAll (query, args = [], trx = null) {
    return (trx ? this.connection.raw(query, args).transacting(trx) : this.connection.raw(query, args))
      .then(data => data[0].map(row => {
        return JSON.parse(JSON.stringify(row))
      }))
  }

  getOne (query, args = [], trx = null) {
    return this.getAll(query, args, trx)
      .then(data => data[0] || false)
  }

  insert (query, args = [], trx = null) {
    return (trx ? this.connection.raw(query, args).transacting(trx) : this.connection.raw(query, args))
      .then(data => data[0].insertId)
  }

  update (query, args = [], trx = null) {
    return (trx ? this.connection.raw(query, args).transacting(trx) : this.connection.raw(query, args))
      .then(data => data[0].affectedRows)
  }

  delete (query, args = [], trx = null) {
    return (trx ? this.connection.raw(query, args).transacting(trx) : this.connection.raw(query, args))
      .then(data => data[0].affectedRows)
  }

  truncate (table, args = [], trx = null) {
    const query = `TRUNCATE ${table}`
    return (trx ? this.connection.raw(query, args).transacting(trx) : this.connection.raw(query, args))
      .then(data => data[0].affectedRows)
  }
}

module.exports = Sql
