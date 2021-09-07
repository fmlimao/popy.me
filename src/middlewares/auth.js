const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const jwt = require('jsonwebtoken')
const sql = require('../database/conn')

module.exports = async (req, res, next) => {
  let ret = new JsonResponse()

  try {
    const token = req.header('x-access-token')

    if (!token) {
      ret.setCode(401)
      throw new Error('Token inválido.')
    }

    const key = process.env.TOKEN_SECRET
    const decodedToken = jwt.verify(token, key)

    const user = await sql.getOne(`
      SELECT user_id, hash, name, email
      FROM users
      WHERE deleted_at IS NULL
      AND verified_at IS NOT NULL
      AND active = 1
      AND hash = ?;
    `, [
      decodedToken.hash
    ])

    if (!user) {
      ret.setCode(401)
      throw new Error('Token inválido.')
    }

    // user.roles = (await UsersRepository.findAllRoles(decodedToken.id)).content.roles
    //     .map(role => {
    //         return role.slug;
    //     });

    // delete user.password;
    // delete user.salt;

    req.auth = {
      user
    }

    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      err.message = 'Token inválido.'
      ret.setCode(401)
      ret = errorHandler(err, ret)
      return res.status(ret.getCode()).json(ret.generate())
    } else if (err.name === 'TokenExpiredError') {
      ret.setCode(401)
      ret.addMessage('Token expirado.')
      return res.status(ret.getCode()).json(ret.generate())
    }

    ret = errorHandler(err, ret)
    return res.status(ret.getCode()).json(ret.generate())
  }
}
