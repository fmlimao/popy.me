module.exports = (req, res, next) => {
    const versions = require('../../../versions');

    req.versions = versions;
    res.locals.versions = versions;

    next();
};