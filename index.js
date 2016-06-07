'use strict';

const feathers = require('feathers');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const Ticket = require("./lib/ticket")

const app = feathers()
    .configure(rest())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

app.use("/", feathers.static(__dirname + '/public'));

app.get("/export", function(req, res){
    var fs = require("fs");
    var co = require("co");
    var xlsService = require("./lib/xls-service");
    const NeDB = require('nedb-promise');
    let db = {};
    co(function*(){
        db.ticket = new NeDB({
            filename: 'db.json',
            autoload: true
        });
        var tickets = yield db.ticket.cfind({}).sort({id: 1}).exec();
        var outfile = "out.xlsx";
        xlsService.writeData(outfile, tickets);
        res.setHeader('Content-disposition', 'attachment; filename=export.xlsx');
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var filestream = fs.createReadStream(outfile);
        filestream.pipe(res);
    })

})

app.use('/ticket', new Ticket());
app.listen(3000);