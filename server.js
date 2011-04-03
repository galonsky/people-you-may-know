function exists(item, array) {
    for(i in array) {
        if(array[i] == item)
            return true
    }
    return false;
}

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
            var friends = {};
            var functions = [];
            var numcalls = data.users.length;
            var counter = 0;
            for(i in data.users) {
            
                rest.get('http://github.com/api/v2/json/user/show/' + data.users[i] + '/following').on('complete', function(newdata) {
                    counter = counter + 1;
                    for(j in newdata.users) {
                        
                        if(friends[newdata.users[j]])
                            friends[newdata.users[j]] = friends[newdata.users[j]] + 1;
                        else
                            friends[newdata.users[j]] = 1;
                    }
                    if(counter == numcalls)
                    {
                        data.users.push(req.query.username);
                        var realfriends = [];
                        for(var property in friends){
                            if(!exists(property, data.users)) {
                                realfriends.push({
                                    username: property,
                                    value: friends[property]
                                });
                            }
                        }
                        realfriends.sort(function(a, b) {
                            return b.value - a.value;
                        });
                        console.log(realfriends);
                    }
                });
            }
        });
    }
    res.render('main');
});

app.listen(4000);