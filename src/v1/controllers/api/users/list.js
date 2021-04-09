const errorHandler = require('../../../helpers/error-handler');
const UserRepository = require('../../../repositories/users');

module.exports = async (req, res) => {
    const draw = req.query.draw || null;

    let ret = req.ret;

    let retDatatable = {
        draw: req.query.draw,
        recordsTotal: 0,
        recordsFiltered: 0,
        data: [],
    };

    try {
        const usersRet = await UserRepository.findAll({
            filter: req.query,
        });

        usersRet.content.users = usersRet.content.users.map(user => {
            delete user.password;
            delete user.salt;
            return user;
        });

        if (draw) {
            retDatatable.data = usersRet.content.users;

            retDatatable.recordsTotal = usersRet.content.totalCount;
            retDatatable.recordsFiltered = usersRet.content.filteredCount;

            res.status(200).json(retDatatable);
        } else {
            const meta = {
                recordsTotal: usersRet.content.totalCount,
                recordsFiltered: usersRet.content.filteredCount,
            };

            ret.addContent('meta', meta);
            ret.addContent('users', usersRet.content.users);

            res.status(ret.getCode()).json(ret.generate());
        }

    } catch (err) {
        ret = errorHandler(err, ret);
        res.status(ret.getCode()).json(ret.generate());
    }
};