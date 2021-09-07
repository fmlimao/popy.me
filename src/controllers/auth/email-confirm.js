const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const sql = require('../../database/conn')

module.exports = async (req, res) => {
  let ret = new JsonResponse()

  try {
    const { emailHash } = req.params

    // busco o usuário pela hash de email e que ainda não tenha sido verificado
    const user = await sql.getOne(`
      SELECT
        user_id
        , hash
        , name
        , email
      FROM users
      WHERE deleted_at IS NULL
      AND verified_at IS NULL
      AND active = 1
      AND email_hash = ?;
    `, [
      emailHash
    ])

    // se nao vier nenhum, "usuário não encontrado"
    if (!user) {
      ret.setError(true)
      ret.setCode(400)
      ret.addMessage('Usuário não encontrado')
      throw ret
    }

    // se vier um usuário, alterar o campo verified_at
    await sql.update('UPDATE users SET verified_at = NOW() WHERE user_id = ? LIMIT 1;', [
      user.user_id
    ])

    ret.addMessage('Usuário ativado com sucesso.')

    ret.setCode(201)
    res.status(ret.getCode()).json(ret.generate())
  } catch (error) {
    ret = errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
