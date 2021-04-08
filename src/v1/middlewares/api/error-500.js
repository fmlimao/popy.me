const errorHandler = require('../../helpers/error-handler');

module.exports = (err, req, res) => {
    const ret = errorHandler(err, req.ret);
    res.status(ret.getCode()).json(ret.generate());
};
