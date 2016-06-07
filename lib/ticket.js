'use strict';

const NeDB = require('nedb-promise');
let db = {};

class Ticket {
    constructor() {
        db.ticket = new NeDB({
            filename: 'db.json',
            autoload: true
        });
    }

    find(params) {
        return db.ticket.cfind({}).sort({id: 1}).exec();
    }

    update(idstr, data, params) {
        var id = parseInt(idstr, 10);
        data.id = id;
        return db.ticket.update({ id: id }, data);
    }

    get(id, params) {
    }

    create(data, params) {
        const co = require('co');
        co(function* () {
            var id = yield db.ticket.count({});
            data.id = id + 1;
            console.log(data);
            return db.ticket.insert(data);
        });
    }
}

module.exports = Ticket;