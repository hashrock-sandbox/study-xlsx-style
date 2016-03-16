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


app.use('/ticket', new Ticket());
app.listen(3000);