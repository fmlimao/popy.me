const express = require('express')
const path = require('path')
const router = express.Router()

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

module.exports = router
