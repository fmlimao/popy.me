const JsonResponse = require('fm-json-response')
const errorHandler = require('fm-express-error-handler')
const version = require('../../helpers/version')

module.exports = (req, res) => {
  let ret = new JsonResponse()

  try {
    ret.addContent('version', version.getVersion())
    res.status(ret.getCode()).json(ret.generate())
  } catch (error) {
    ret = errorHandler(error, ret)
    res.status(ret.getCode()).json(ret.generate())
  }
}
