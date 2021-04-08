const errorHandler = require('../../../helpers/error-handler');
const UserRepository = require('../../../respositories/users');

module.exports = async (req, res) => {
    const draw = req.query.draw || null;
    const searchValue = req.query.search || null;
    console.log('searchValue', searchValue);

    let ret = req.ret;

    let retDatatable = {
        draw: req.query.draw,
        recordsTotal: 0,
        recordsFiltered: 0,
        data: [],
    };

    try {
        const users = await UserRepository.findAll();

        if (draw) {
            retDatatable.data = users.content.users;

            retDatatable.recordsTotal = users.content.totalCount;
            retDatatable.recordsFiltered = users.content.filteredCount;

            res.status(200).json(retDatatable);
        } else {
            const meta = {
                recordsTotal: users.content.totalCount,
                recordsFiltered: users.content.filteredCount,
            };

            ret.addContent('meta', meta);
            ret.addContent('users', users.content.users);

            res.status(ret.getCode()).json(ret.generate());
        }

    } catch (err) {
        ret = errorHandler(err, ret);
        res.status(ret.getCode()).json(ret.generate());
    }
};