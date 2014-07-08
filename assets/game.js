var Game = function() {
	this.users = {};
	this.timer = null;
	this.doing = null;
	this.defaultTime = 10;
	this.moks = [];
	this.isDone = false;

	this._initialize();
};	

var _ = Game.prototype;

_._initialize = function() {
	this._setSocket();
	this._setSocketEvent();
	this._bindEvent();
	this._startTimer();
};

_._setSocket = function() {
	this.socket = io.connect('http://192.168.0.217');
};

_._setSocketEvent = function() {
	var that = this;

	this.socket.on('join', function(data){
		that.users[data.id] = new User(data.id, data.name, that);
	});

	this.socket.on('direction', function(data){
		that.users[data.id].setPosition(data.id, data.direction);
	});
};

_._bindEvent = function() {
	var that = this,
		id = null;
	// $('.join').click(function() {
	// 	$.post('/join', {name : Math.floor(Math.random() * 100000000)}, function(data) {
	// 		id = data.id
	// 	});
	// });

	// $('.left').click(function() {
	// 	$.post('/button', {direction : 'left', id: (id)? id : 1112}, function(data) {
	// 		//console.log(data);
	// 	})
	// });

	// $('.right').click(function() {
	// 	$.post('/button', {direction : 'right', id: (id)? id : 1111}, function(data) {
	// 		//console.log(data);
	// 	});
	// });
	// $('.join').trigger('click');
};

_._startTimer = function() {
	var that = this;
	
	this.timer = setTimeout(function() {
		that._setTime();
	}, 1000);
};

_._setTime = function() {
	var that = this,
		cnt = 0;

	$('.timer').text(this.defaultTime);

	for(var i in this.users) {
		cnt++;
	}
	
	if(this.defaultTime === 0 && cnt > 0) {
		this._startGame();
	} else if(this.defaultTime === 0 && cnt === 0) {
		this.defaultTime = 10;
		this._startTimer();
	} else {
		this.defaultTime--;
		this._startTimer();
	}
};

_._startGame = function() {
	var that = this;

	setTimeout(function() {
		that._isOver();
	}, 500);
};

_._isOver = function() {
	if(!this.isDone) {
		this._createMok();
		this._startGame();
	} else {
		this._gameOver();
	}
};

_.checkPoint = function() {
	var that = this;

	for(var i in this.users) {
		if(this.users[i].point === 100) {
			$('h1').text('우승 : ' +this.users[i].name);
			that.isDone = true;
		}
	}
};

_._createMok = function() {
	var id = Math.floor(Math.random() * 10000000);

	if(!this.moks.hasOwnProperty(id)) {
		this.moks.push(new Mok(this, id));	
	} else {
		this._createMok();
	}
};

_.checkCrash = function() {
	for(var i in this.users) {
		for(var j = 0; j < this.moks.length; j++) {
			
			if(this.users[i].position.left === this.moks[j].position.left) {
				
				if(Math.abs(this.moks[j].position.top - this.users[i].position.top) < 60) {

					if(this.moks[j].dom.hasClass('ceo')) {
						this._gameComment('ceo');
						this.users[i].stop(this.users[i].position.left);
						this.moks[j].dom.remove();
						this.moks.splice(j, 1);
						j--;

					} else {
						this._gameComment('mok');
						this.users[i].point += 10;
						this.users[i].countPt();
						this.moks[j].dom.remove();
						this.moks.splice(j, 1);
						j--;
					}

				}

			}

		}

	}
};

_._gameComment = function(mode) {
	var num = Math.floor(Math.random() * 5),
		comment = '';
	if(mode === 'mok') {
		switch (num) {
			case 1:
				comment = "목쌤 삼계탕 사주세요";
				break;
			case 2:
				comment = "Where is mok?";
				break;
			case 3:
				comment = "끼릭 끼릭(침대 접는 소리)";
				break;
			case 4:
				comment = "상목쌤 일어나세요";
				break;
			case 5:
				comment = "상목쌤 같이 퇴근해요";
				break;
		}
		$('.commentUser').text(comment);
	} else {
		switch (num) {
			case 1:
				comment = "영기씨 이거 고쳐주세요.";
				break;
			case 2:
				comment = "승건쌤, 그~";
				break;
			case 3:
				comment = "경호씨 이거~ 잘 안되는데..";
				break;
			case 4:
				comment = "조승연씨가 해주겠죠 뭐 ㅎㅎ";
				break;
			case 5:
				comment = "재원씨 스크롤이 이상해요";
				break;
		}
		$('.commentCeo').text(comment);
	}
};

_._gameOver = function() {
	$('.field').find('.mok').remove();
};

var User = function(id, name, game) {
	this.game = game;
	this.id = id;
	this.name = name;
	this.point = 0;
	this.isStop = false;
	this.fPosition = Math.floor(Math.random() * 9);
	this.dom = $('<div id="'+ this.id +'" class="user" />');
	this.list = $('<li class="list" id="'+this.name+'" />');
	this.position = {
		'top': 0,
		'left': 0
	};

	this._initialize();
};

var _ = User.prototype;

_._initialize = function() {
	this._creatList();
	this._setFirstLocation();
};

_._creatList = function() {
	var name = $('<span class="name" />'),
		point = $('<span class="point" />');
		
	$('.userList').append(this.list);

	name.text(this.name+ ": ");
	this.list.append(name);
	this.list.append(point);
};

_.countPt = function() {
	$('li#' + this.name).find('.point').text(this.point);	
};	

_._setFirstLocation = function () {
	this.position.left = this.fPosition * 100;
	this.position.top = 540;
	this.dom.css('left', this.fPosition * 100);
	this.dom.text(this.name);

	$('.field').append(this.dom);
};

_.setPosition = function(id, d) {
	if(!this.isStop) {
		var direction = (d === 'right')? 100 : -100,
			prevPosition = parseInt($('#'+this.id).css('left'));
			nextPosition = prevPosition + direction;
		
		if(prevPosition === 0 && d === 'left') {
			$('#'+this.id).css('left', '0px');	
			this.position.left = 0;
		} else if(prevPosition === 900 && d === 'right') {
			$('#'+this.id).css('left', '900px');
			this.position.left = 900;
		} else {
			$('#'+this.id).css('left', nextPosition);
			this.position.left = nextPosition;
		}
	}
};

_.stop = function(left) {
	var that = this;

	this.isStop = true;

	setTimeout(function() {
		that.isStop = false;
	}, 2000);
};


var Mok = function(game, id) {
	this.game = game;
	this.dom = null;
	this.id= id;
	this.fPosition = Math.floor(Math.random() * 9);
	this.timer = null;
	this.currPosition = null;
	this.position = {
		'top': 0,
		'left': 0
	};

	this._initialize();
};

var _ = Mok.prototype;

_._initialize = function() {
	this._setDom();
};

_._setDom = function() {
	this.dom = $('<div class="mok" id ="'+ this.id +'" />');
	
	this._setFirstLocation();
};

_._setFirstLocation = function () {
	this.position.left = this.fPosition * 100;
	this.dom.css('left', this.fPosition * 100);
	this.dom.text(this.name);
	$('.field').append(this.dom);

	this._moveDom();
};

_._moveDom = function() {
	var that = this;

	this.timer = setInterval(function() {
		that.currPosition++;
		that.position.top = that.currPosition;
		that.game.checkCrash();
		that.game.checkPoint();
		that._checkPosition();
		that.dom.css('top', that.currPosition + 'px');
	}, 5);
};

_._checkPosition = function() {
	if(this.currPosition > 540) {
		this.timer = clearInterval();
		this.dom.remove();
	} else {
		if(this.currPosition === 440) {
			var extra = Math.floor(Math.random() * 10);
			if(extra <= 3) {
				this.dom.addClass('ceo');
			}
		}
	}
};





















