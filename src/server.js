const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// enable CORS (http://enable-cors.org/server_expressjs.html), but we may switch to https://github.com/expressjs/cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// for parsing application/json
app.use(bodyParser.json());

require('./routes')(app);

app.listen('8081');
console.log('Magic happens on port 8081');
// exports = module.exports = app;