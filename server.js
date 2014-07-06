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
	this._setDirectory();
	this._setMiddleware();
	this._setSocket();
	this._setRouter();
};

_._setSocket = function() {
	var that = this;
	
	this.io = socketio.listen(http.createServer(app).listen(80));

	this.io.sockets.on('connection', function(socket) {
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
	app.use('/assets', express.static(path.join(__dirname, '/assets')));
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
			};
			that.socketEvent('join', {id: id, name: params.name});
			
			res.send({
				id: id
			});
		} else {
			res.send('This name is already exist!');
		}
		
	});

	app.post('/button', function(req, res) {
		that.socketEvent('direction', req.body);
		res.send({
			result: req.body.direction
		});
	});

	app.get('/', function(req, res){
		fs.readFile('./assets/game.html', 'utf8', function (err, data) {
			if (err) throw err;
			res.write(data);
			res.end();
		});
	});
}

var server = new Server();





