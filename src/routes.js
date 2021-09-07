const express = require('express')
const path = require('path')
const router = express.Router()
const { getContent } = require('./helpers/mail')

// Rotas Públicas

router.get('/doc', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/swagger/index.html'))
})

router.get('/doc.yaml', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../docs/fmlimao-PopyMe-1.0.0-resolved.yaml'))
})

router.get('/', require('./controllers/version/index'))

router.get('/profiles', require('./controllers/profiles/list'))
router.get('/profiles/:profileHash', require('./controllers/profiles/show'))
router.post('/profiles', require('./controllers/profiles/store'))

router.post('/auth/create', require('./controllers/auth/create'))
router.get('/auth/email-confirm/:emailHash', require('./controllers/auth/email-confirm'))

router.get('/mail', async (req, res) => {
  const emailContent = await getContent(res, 'mail/email-confirm.ejs', {
    host: 'http://localhost:10500',
    name: 'Lele',
    emailHash: 'emailHash'
  })
  res.send(emailContent)
})

// Rotas Privadas

module.exports = router
