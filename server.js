'use strict';

var socketio = require('socket.io'),
	express = require('express'),
	http = require('http'),
	fs = require('fs'),
	path = require('path'),
	bodyParser = require('body-parser'),
	app = express();

var Server = function() {
	this.users = {};

	this._initialize();
};

var _ = Server.prototype;

_._initialize = function() {
	this._setSocket();
};

_._setSocket = function() {
	var that = this;
	
	this.io = socketio.listen(http.createServer(app).listen(80));

	this.io.sockets.on('connection', function(socket) {
		that._setDirectory();
	that._setMiddleware();
	that._setRouter();
		that.socketEvent = function(fName, data) {
			switch (fName) {
				case 'join':
					socket.emit('join', data);
					break;
				case 'direction':
					socket.emit('direction', data);
					break;
			}
		};
	});

	
}

_._setDirectory = function() {
	app.use('/', express.static(path.join(__dirname, '/')));
};

_._setMiddleware = function() {
	app.use(bodyParser());
};

_._setRouter = function() {
	var that = this;

	app.post('/join', function(req, res) {
		var params = req.body,
			id = id = Math.floor(Math.random() * 1000000);

		if(!that.users.hasOwnProperty(params.name)) {
			that.users[params.name] = {
				id: id
			}
			that.socketEvent('join', {id: id, name: params.name});
		
			res.send({
				id: id
			});
		} else {
			res.send('This name is already exist!');
		}
		
	});

	app.post('/button', function(req, res) {
		console.log(req.body.direction);
		that.socketEvent('direction', req.body);
		res.send({
			result: req.body.direction
		});
	});

	app.get('/', function(req, res){
		fs.readFile('./game.html', 'utf8', function (err, data) {
			if (err) throw err;
			res.write(data);
			res.end();
		});
	});
}

var server = new Server();





