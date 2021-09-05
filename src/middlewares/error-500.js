const errorHandler = require('fm-express-error-handler')

module.exports = (error, req, res, next) => {
  const ret = errorHandler(error, req.ret)
  res.status(ret.getCode()).json(ret.generate())
}
