const JsonResponse = require('fm-json-response')

module.exports = (req, res, next) => {
  const ret = new JsonResponse()
  ret.setError(true)
  ret.setCode(404)
  ret.addMessage('Rota não encontrada')
  res.status(ret.getCode()).json(ret.generate())
}
