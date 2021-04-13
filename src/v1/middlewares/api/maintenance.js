module.exports = (req, res, next) => {
    if (process.env.API_MAINTENANCE == 1) {
        const ret = req.ret;
        ret.setError(true);
        ret.setCode(503);
        ret.addMessage('API em manutenção. Tente novamente mais tarde.');
        return res.status(ret.getCode()).json(ret.generate());
    }

    next();
};
