const errorHandler = require('../../helpers/error-handler');
const Acl = require('../../helpers/acl');

module.exports = async (req, res, next) => {
    let ret = req.ret;

    try {
        const acl = new Acl();

        acl.addRole('administrator');
        acl.addRole('user');

        acl.allow('administrator');

        acl.allow('user', 'users', 'me');

        req.acl = acl;

        next();
    } catch (err) {
        ret = errorHandler(err, ret);
        return res.status(ret.getCode()).json(ret.generate());
    }
};
