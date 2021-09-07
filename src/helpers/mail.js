const nodemailer = require('nodemailer')

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USERNAME = process.env.SMTP_USERNAME
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const SMTP_DEBUG = Boolean(Number(process.env.SMTP_DEBUG))
const SMTP_LOGGER = Boolean(Number(process.env.SMTP_LOGGER))

const options = {
  debug: SMTP_DEBUG,
  logger: SMTP_LOGGER,
  host: SMTP_HOST,
  port: SMTP_PORT
}

if (SMTP_USERNAME && SMTP_PASSWORD) {
  options.secure = Number(SMTP_PORT) === 465
  options.auth = {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
} else {
  options.tls = {
    rejectUnauthorized: false
  }
}

const transporter = nodemailer.createTransport(options)

function sendMail (mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error)
      } else {
        resolve(info.response)
      }
    })
  })
}

function getContent (res, file, data) {
  return new Promise((resolve, reject) => {
    res.render(file, data, function (err, finalHtml) {
      if (err) reject(err)
      resolve(finalHtml)
    })
  })
}

module.exports = {
  sendMail,
  getContent
}
