var Game = function() {
	this.users = {};

	this._initialize();
};	

var _ = Game.prototype;

_._initialize = function() {
	this._setSocket();
	this._setSocketEvent();
	this._bindEvent();
};

_._setSocket = function() {
	this.socket = io.connect('http://192.168.0.217');
};

_._setSocketEvent = function() {
	var that = this;

	this.socket.on('join', function(data){
		that.users[data.id] = new User(data.id, data.name);
	});

	this.socket.on('direction', function(data){
		console.log(that.users);
		that.users[data.id].setPosition(data.id, data.direction);
	});
};

_._bindEvent = function() {
	var that = this;
	// $('.join').click(function() {
	// 	$.post('/join', {name : "slsle..e."}, function(data) {
	// 		console.log('good');
	// 	});
	// });

	// $('.left').click(function() {
	// 	$.post('/button', {direction : 'left', id: 1213123}, function(data) {
	// 		console.log(data);
	// 	})
	// });

	// $('.right').click(function() {
	// 	$.post('/button', {direction : 'right', id: 12121}, function(data) {
	// 		console.log(data);
	// 	});
	// });
};

var User = function(id, name) {
	this.id = id;
	this.name = name;
	this.fPosition = Math.floor(Math.random() * 9);
	this.dom = $('<div id="'+ this.id +'" class="user" />');

	this._initialize();
};

var _ = User.prototype;

_._initialize = function() {
	this._setFirstLocation();
};

_._setFirstLocation = function () {
	this.dom.css('left', this.fPosition * 100);
	this.dom.text(this.name);
	$('.field').append(this.dom);
};

_.setPosition = function(id, d) {
	var direction = (d === 'right')? 100 : -100,
		prevPosition = parseInt($('#'+this.id).css('left'));
		nextPosition = prevPosition + direction;

	if(prevPosition === 0 && d === 'left') {
		$('#'+this.id).css('left', '0px');	
	} else if(prevPosition === 900 && d === 'right') {
		$('#'+this.id).css('left', '900px');
	} else {
		$('#'+this.id).css('left', nextPosition);
	}
	
};


var Mok = function() {
	this.dom = $('<div class="user" />');

}

var _ = Mok.prototype;

_._initialize = function() {

}


