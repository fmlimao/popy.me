const JsonReturn = require('../helpers/json-return');
const connRead = require('../database/conn-read');

class UsersRepository {

    static findAll({ filter }) {
        return new Promise(resolve => {
            // Essa promise serve para recuperar os filtros da busca

            const queryOptions = connRead.generateOptions(filter);

            const querySearch = queryOptions.searchValue.length ? ` AND (${[
                `user_id LIKE '%${queryOptions.searchValue}%'`,
                `name LIKE '%${queryOptions.searchValue}%'`,
                `email LIKE '%${queryOptions.searchValue}%'`,
                `created_at LIKE '%${queryOptions.searchValue}%'`,
                `DATE_FORMAT(created_at, '%d/%m/%Y %H:%i:%s') LIKE '%${queryOptions.searchValue}%'`,
            ].join(' OR ')})` : '';

            const next = {
                filter,
                queryOptions,
                querySearch,
            };

            resolve(next);
        })
            .then(async next => {
                // Essa promise recupera o total de registros (sem filtro)

                next.totalCount = (await connRead.getOne(`
                    SELECT COUNT(user_id) AS total
                    FROM users
                    WHERE deleted_at IS NULL;
                `)).total;
                return next;
            })
            .then(async next => {
                // Essa promise recupera o total de registros (com filtro)

                next.filteredCount = (await connRead.getOne(`
                    SELECT COUNT(user_id) AS total
                    FROM users
                    WHERE deleted_at IS NULL
                    ${next.querySearch}
                    ;
                `)).total;
                return next;
            })
            .then(async next => {
                // Essa promise recupera os registros (com filtro)

                next.users = await connRead.getAll(`
                    SELECT
                        user_id
                        , name
                        , email
                        , created_at
                    FROM users
                    WHERE deleted_at IS NULL
                    ${next.querySearch}
                    ${next.queryOptions.orderBy ? next.queryOptions.orderBy : 'ORDER BY name'}
                    ${next.queryOptions.limit ? next.queryOptions.limit : ''}
                    ;
                `);
                return next;
            })
            .then(next => {
                // Essa promise retorna os dados no padrão do sistema

                const ret = new JsonReturn();
                ret.addContent('totalCount', next.totalCount);
                ret.addContent('filteredCount', next.filteredCount);
                ret.addContent('users', next.users);
                return ret.generate();
            })
    }

}

module.exports = UsersRepository;