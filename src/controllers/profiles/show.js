const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const sql = require('../../database/conn')

module.exports = async (req, res) => {
  let ret = new JsonResponse()

  try {
    const { profileHash } = req.params

    const profile = await sql.getOne(`
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
      profileHash
    ])

    if (!profile) {
      ret.setCode(404)
      ret.addMessage('Perfil não encontrado')
      throw ret
    }

    ret.addContent('profile', profile)
    res.status(ret.getCode()).json(ret.generate())
  } catch (error) {
    ret = errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
