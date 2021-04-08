const JsonReturn = require('../helpers/json-return');
const connRead = require('../database/conn-read');

class UsersRepository {

    static findAll() {
        return new Promise(resolve => {
            // tratamento do datatable
            resolve({
            });
        })
            .then(async next => {
                // busco o total
                next.totalCount = (await connRead.getOne(`SELECT COUNT(user_id) AS total FROM users`)).total;
                return next;
            })
            .then(async next => {
                // busco o total filtrado
                next.filteredCount = (await connRead.getOne(`SELECT COUNT(user_id) AS total FROM users`)).total;
                return next;
            })
            .then(async next => {
                // busco a listagem
                next.users = await connRead.getAll(`SELECT * FROM users`);
                return next;
            })
            .then(next => {
                // retorno o json do padrao
                const ret = new JsonReturn();
                ret.addContent('totalCount', next.totalCount);
                ret.addContent('filteredCount', next.filteredCount);
                ret.addContent('users', next.users);
                return ret.generate();
            })
    }

}

module.exports = UsersRepository;