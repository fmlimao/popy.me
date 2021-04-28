const errorHandler = require('../../helpers/error-handler');

module.exports = (resource = null, privilege = null) => {
    return async (req, res, next) => {
        let ret = req.ret;

        try {
            if (!req.acl.isAllowed(req.auth.user.roles, resource, privilege)) {
                ret.setCode(403);
                throw new Error('Usuário sem autorização para acessar essa rota.');
            }

            next();
        } catch (err) {
            ret = errorHandler(err, ret);
            return res.status(ret.getCode()).json(ret.generate());
        }
    };
};
