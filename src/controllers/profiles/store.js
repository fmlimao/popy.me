const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const validator = require('fm-validator')
const uniqid = require('uniqid')
const sql = require('../../database/conn')

module.exports = async (req, res) => {
  let ret = new JsonResponse()

  try {
    const { name } = req.body

    ret.addFields(['name'])

    if (!validator(ret, {
      name
    }, {
      name: 'required|string|min:3|max:128'
    })) {
      ret.setError(true)
      ret.setCode(400)
      ret.addMessage('Verifique todos os campos.')
      throw ret
    }

    const profileExists = await sql.getOne(`
      SELECT profile_id
      FROM profiles
      WHERE name = ?;
    `, [
      name
    ])

    if (profileExists) {
      ret.setError(true)
      ret.setCode(400)
      ret.setFieldError('name', true, 'Já existe um perfil com este nome')
      ret.addMessage('Verifique todos os campos.')
      throw ret
    }

    const hash = uniqid()

    const profileId = await sql.insert(`
      INSERT INTO profiles (hash, name)
      VALUES (?, ?);
    `, [
      hash,
      name
    ])

    const profile = await sql.getOne(`
      SELECT
        hash
        , name
        , positive_votes
        , negative_votes
      FROM profiles
      WHERE deleted_at IS NULL
      AND active = 1
      AND profile_id = ?;
    `, [
      profileId
    ])

    ret.addContent('profile', profile)

    ret.setCode(201)
    res.status(ret.getCode()).json(ret.generate())
  } catch (error) {
    ret = errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
