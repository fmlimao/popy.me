const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const ProfilesRepository = require('../../repositories/profiles')

module.exports = async (req, res) => {
  let ret = new JsonResponse()

  try {
    const { name } = req.body

    const profile = await ProfilesRepository.create({
      name
    })

    ret.setCode(201)
    ret.addContent('profile', profile.content.profile)
    res.status(ret.getCode()).json(ret.generate())
  } catch (error) {
    ret = errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
