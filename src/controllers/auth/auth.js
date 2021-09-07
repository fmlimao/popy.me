const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const validator = require('fm-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sql = require('../../database/conn')

module.exports = async (req, res) => {
  let ret = new JsonResponse()

  try {
    const { email, password } = req.body

    ret.addFields(['email', 'password'])

    if (!validator(ret, {
      email,
      password
    }, {
      email: 'required|string|email|max:128',
      password: 'required|string|max:32'
    })) {
      ret.setError(true)
      ret.setCode(400)
      ret.addMessage('Verifique todos os campos.')
      throw ret
    }

    const user = await sql.getOne(`
      SELECT user_id, hash, name, email, password, salt
      FROM users
      WHERE deleted_at IS NULL
      AND active = 1
      AND email = ?;
    `, [
      email
    ])

    if (!user) {
      ret.setError(true)
      ret.setCode(404)
      ret.addMessage('Usuário não encontrada.')
      throw ret
    }

    const passwordVerify = bcrypt.compareSync(password, user.password)

    if (!passwordVerify) {
      ret.setError(true)
      ret.setCode(404)
      ret.addMessage('Usuário não encontrada.')
      throw ret
    }

    const login = {
      hash: user.hash
    }

    const exp = Number(process.env.TOKEN_EXPIRATION_SEC)
    if (exp) {
      login.exp = Math.floor(Date.now() / 1000) + exp
    }

    const key = process.env.TOKEN_SECRET
    const token = jwt.sign(login, key)

    ret.addContent('token', token)

    res.status(ret.getCode()).json(ret.generate())
  } catch (error) {
    ret = errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
