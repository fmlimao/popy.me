const express = require('express')
const router = express.Router()

router.get('/', require('./controllers/version/index'))

router.get('/profiles', require('./controllers/profiles/list'))
router.get('/profiles/:profileHash', require('./controllers/profiles/show'))
router.post('/profiles', require('./controllers/profiles/store'))

module.exports = router
