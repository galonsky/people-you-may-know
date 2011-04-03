var express = require('express');
var http = require('http');
var app = express.createServer();
var rest = require('restler');

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
	app.use(express.logger());
	app.use(express.static(__dirname + '/static'));
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    if(req.query.username)
    {
        rest.get('http://github.com/api/v2/json/user/show/' + req.query.username + '/following').on('complete', function(data) {
            console.log(data);
        });
    }
    res.render('main');
});

app.listen(4000);