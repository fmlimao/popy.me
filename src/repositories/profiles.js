const JsonResponse = require('fm-json-response')
const validator = require('fm-validator')
const uniqid = require('uniqid')
const sql = require('../database/conn')

function getQueryVar (value) {
  value = String(value)
    .split(',')
    .map(item => item.trim())
    .filter(item => item)
  return value
}

class Profile {
  static async getAll ({
    hash,
    name,
    start,
    length
  }) {
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

    const ret = new JsonResponse()

    try {
      const totalCount = await sql.getOne(`
        SELECT COUNT(profile_id) AS total
        FROM profiles
        WHERE deleted_at IS NULL
        AND active = 1;
      `)
      ret.addContent('totalCount', totalCount.total)

      const filteredCount = await sql.getOne(`
        SELECT COUNT(profile_id) AS total
        FROM profiles
        WHERE deleted_at IS NULL
        AND active = 1
        ${filteredWhere.join(' ')};
      `, filteredArgs)
      ret.addContent('filteredCount', filteredCount.total)

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

      ret.addContent('profiles', profiles)
      return ret.generate()
    } catch (error) {
      ret.setCode(400)
      ret.setError(true)
      ret.addMessage('Erro ao buscar perfis')
      ret.addMessage(error.message)

      throw ret
    }
  }

  static async getOne (profileId) {
    const ret = new JsonResponse()

    try {
      const profile = await sql.getAll(`
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
      return ret.generate()
    } catch (error) {
      ret.setCode(400)
      ret.setError(true)
      ret.addMessage('Erro ao buscar perfil')

      throw ret
    }
  }

  static async getOneByHash (hash) {
    const ret = new JsonResponse()

    try {
      const profile = await sql.getAll(`
        SELECT
          hash
          , name
          , positive_votes
          , negative_votes
        FROM profiles
        WHERE deleted_at IS NULL
        AND active = 1
        AND hash = ?;
      `, [
        hash
      ])

      ret.addContent('profile', profile)
      return ret.generate()
    } catch (error) {
      ret.setCode(400)
      ret.setError(true)
      ret.addMessage('Erro ao buscar perfil')

      throw ret
    }
  }

  static async create (fields) {
    const ret = new JsonResponse()

    ret.addFields(['name'])

    const { name } = fields

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

    const profile = await Profile.getOne(profileId)

    ret.addContent('profile', profile.content.profile)
    return ret.generate()
  }
}

module.exports = Profile
