'use strict';

const xlsService = require("./xls-service");

function copyTicket(old, data){
    old["種別"] = data["種別"];
    old["内容"] = data["内容"];
    old["作成者"] = data["作成者"];
    old["作成日"] = data["作成日"];
    old["回答"] = data["回答"];
    old["回答者"] = data["回答者"];
    old["回答日"] = data["回答日"];
    old["終了"] = data["終了"];
    old["関連No"] = data["関連No"];
}

class Ticket {
    constructor() {
        this.tickets = xlsService.readData("out.xlsx");
    }

    find(params) {
        return Promise.resolve(this.tickets);
    }
    
    update(id, data, params){
        var matched = this.tickets.filter(function(item){
            return item["No"] === id
        });
        
        if(matched.length > 0){
            var old = matched[0];
            copyTicket(old, data);
        }
        xlsService.writeData("out.xlsx", this.tickets);
        return Promise.resolve(old);
    }
    
    get(id, params) {
    }

    create(data, params) {
        data["No"] = this.tickets.length + 1;
        this.tickets.push(data);
        xlsService.writeData("out.xlsx", this.tickets);
        return Promise.resolve(data);
    }
}

module.exports = Ticket;