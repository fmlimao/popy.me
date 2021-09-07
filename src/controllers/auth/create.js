const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const validator = require('fm-validator')
const uniqid = require('uniqid')
const bcrypt = require('bcrypt')
const base64 = require('base-64')
const { sendMail, getContent } = require('../../helpers/mail')
const sql = require('../../database/conn')

module.exports = async (req, res) => {
  let ret = new JsonResponse()

  try {
    const { name, email, password } = req.body

    ret.addFields(['name', 'email', 'password'])

    if (!validator(ret, {
      name,
      email,
      password
    }, {
      name: 'required|string|min:3|max:128',
      email: 'required|string|email|max:128',
      password: 'required|string|max:32'
    })) {
      ret.setError(true)
      ret.setCode(400)
      ret.addMessage('Verifique todos os campos.')
      throw ret
    }

    const userExists = await sql.getOne(`
      SELECT user_id, name, email
      FROM users
      WHERE name = ? OR email = ?;
    `, [
      name,
      email
    ])

    if (userExists) {
      ret.setError(true)
      ret.setCode(400)

      if (userExists.name === name) {
        ret.setFieldError('name', true, 'Já existe um usuário com este nome')
      }

      if (userExists.email === email) {
        ret.setFieldError('email', true, 'Já existe um usuário com este e-mail')
      }

      ret.addMessage('Verifique todos os campos.')
      throw ret
    }

    const hash = uniqid()
    for (let i = 0; i < 100; i++) uniqid()
    const emailHash = base64.encode(uniqid())

    const saltLength = Number(process.env.AUTH_SALT_LENGTH)

    const saltPassword = bcrypt.genSaltSync(saltLength)
    const newPassword = bcrypt.hashSync(password, saltPassword)

    const emailContent = await getContent(res, 'mail/email-confirm.ejs', {
      host: process.env.APP_HOST,
      name: 'Lele',
      emailHash: emailHash
    })

    const trx = await sql.transaction()

    await sql.insert(`
      INSERT INTO users (hash, name, email, password, salt, email_hash)
      VALUES (?, ?, ?, ?, ?, ?);
    `, [
      hash,
      name,
      email,
      newPassword,
      saltPassword,
      emailHash
    ], trx)

    const mailOptions = {
      from: 'atendimento@popy.me <fmlimao@gmail.com>',
      to: `${name} <${email}>`,
      subject: 'Popy.Me - Confirmação de Cadastro',
      html: emailContent
    }

    try {
      await sendMail(mailOptions)
      trx.commit()
      ret.addMessage('Enviamos um e-mail com os próximos passos para finalizar o seu cadastro.')
      ret.addMessage(emailHash)
    } catch (emailError) {
      trx.rollback()
      ret.setError(true)
      ret.setCode(400)
      ret.addMessage('Tivemos um problema durante o cadastro do usuário. Por favor, tente novamente.')
      throw ret
    }

    ret.setCode(201)
    res.status(ret.getCode()).json(ret.generate())
  } catch (error) {
    ret = errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
