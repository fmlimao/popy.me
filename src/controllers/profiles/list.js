const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const getQueryVar = require('../../helpers/query-var')
const sql = require('../../database/conn')

module.exports = async (req, res) => {
  let ret = new JsonResponse()

  try {
    let { hash, name, start, length } = req.query

    hash = hash || ''
    name = name || ''
    start = start || 0
    length = length || 10

    hash = getQueryVar(hash)
    name = getQueryVar(name)

    const filteredWhere = []
    const filteredArgs = []

    if (hash.length) {
      filteredWhere.push('AND hash IN(?)')
      filteredArgs.push(hash)
    }

    if (name.length) {
      filteredWhere.push('AND name IN(?)')
      filteredArgs.push(name)
    }

    const totalCount = await sql.getOne(`
      SELECT COUNT(profile_id) AS total
      FROM profiles
      WHERE deleted_at IS NULL
      AND active = 1;
    `)

    const filteredCount = await sql.getOne(`
      SELECT COUNT(profile_id) AS total
      FROM profiles
      WHERE deleted_at IS NULL
      AND active = 1
      ${filteredWhere.join(' ')};
    `, filteredArgs)

    const profiles = await sql.getAll(`
      SELECT
        hash
        , name
        , positive_votes
        , negative_votes
      FROM profiles
      WHERE deleted_at IS NULL
      AND active = 1
      ${filteredWhere.join(' ')}
      ORDER BY name
      LIMIT ?, ?;
    `, filteredArgs.concat([
      start,
      length
    ]))

    const meta = {
      recordsTotal: totalCount || 0,
      recordsFiltered: filteredCount || 0
    }

    ret.addContent('meta', meta)

    ret.addContent('profiles', profiles)

    res.status(ret.getCode()).json(ret.generate())
  } catch (error) {
    ret = errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
