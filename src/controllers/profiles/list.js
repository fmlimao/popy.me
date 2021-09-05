const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const ProfilesRepository = require('../../repositories/profiles')

module.exports = async (req, res) => {
  let ret = new JsonResponse()

  try {
    const { hash, name, start, length } = req.query

    const profiles = await ProfilesRepository.getAll({
      hash,
      name,
      start,
      length
    })

    const meta = {
      recordsTotal: profiles.content.totalCount || 0,
      recordsFiltered: profiles.content.filteredCount || 0
    }

    ret.addContent('meta', meta)

    ret.addContent('profiles', profiles.content.profiles)
    res.status(ret.getCode()).json(ret.generate())
  } catch (error) {
    ret = errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
