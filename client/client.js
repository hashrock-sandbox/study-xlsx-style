'use strict';

const Vue = require("vue");
const request = require("superagent");

function j2e(item) {
    return {
        "種別": item.formTitle,
        "内容": item.formContent,
        "作成者": item.formCreateUser,
        "作成日": item.formCreateDate,
        "回答": item.formReply,
        "回答者": item.formReplyUser,
        "回答日": item.formReplyDate,
        "終了": item.formDone,
        "関連No": item.formRelated
    }
}

new Vue({
    el: "body",
    data: {
        tickets: [],
        formTitle: "",
        formContent: "",
        formCreateUser: "",
        formCreateDate: "",
        formReply: "",
        formReplyUser: "",
        formReplyDate: "",
        formDone: "",
        formRelated: "",
        formNo: ""
    },
    ready: function () {
        this.find();
    },
    methods: {
        edit: function (ticket) {
            this.formTitle = ticket["種別"];
            this.formContent = ticket["内容"];
            this.formCreateUser = ticket["作成者"];
            this.formCreateDate = ticket["作成日"];
            this.formReply = ticket["回答"];
            this.formReplyUser = ticket["回答者"];
            this.formReplyDate = ticket["回答日"];
            this.formDone = ticket["終了"];
            this.formRelated = ticket["関連No"];
            this.formNo = ticket["No"]
        },
        find: function(){
            var self = this;            
            request.get("/ticket")
                .end(function (err, res) {
                    self.tickets = res.body;
                })
        },
        update: function () {
            var postdata = j2e(this);
            var self = this;            

            request.put('/ticket/' + this.formNo)
                .type('form')
                .send(postdata)
                .end(function () {
                    self.find();
                })

        },
        create: function () {
            var postdata = j2e(this);
            var self = this;            

            request.post('/ticket')
                .type('form')
                .send(postdata)
                .end(function () {
                    self.find();
                })
        },
        clearForm: function(){
            this.formTitle = "";
            this.formContent = "";
            this.formCreateUser = "";
            this.formCreateDate = "";
            this.formReply = "";
            this.formReplyUser = "";
            this.formReplyDate = "";
            this.formDone = "";
            this.formRelated = "";
            this.formNo = "";
        }
    }
})