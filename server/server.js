var fs = require('fs'),
	app = require('http').createServer(handler),
	io = require('socket.io').listen(app);
io.configure(function() {
	io.set('transports', ['websocket', 'xhr-polling']);
});

app.listen(80);

function handler(req, res) {
	if(req.url == '/') req.url = '/index.html';
	fs.readFile(__dirname + '/../client' + req.url, function(err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading ' + req.url);
		}

		res.writeHead(200);
		res.end(data);
	});
}

var imports = ['globals', 'point', 'bomb', 'flame', 'character', 'map'];
for(var i = 0, n = imports.length; i < n; i++) {
	eval(fs.readFileSync('shared/' + imports[i] + '.js', 'utf-8'));
}

var charid = 1;
var map = new Map(getMapSize(0));
var sockets = [];

io.sockets.on('connection', function (socket) {
	sockets.push(socket);

	var ch = new Character();
	map.updateToRandPos(ch);

	ch.id = charid++;
	socket.ch = ch;

	map.chars.push(ch);

	socket.emit('init', {id:ch.id, pos:ch.pos});

	socket.on('update', function(data) {
		var movingDir = data.movingDir;

		if(!map.canMove(ch.coord.add(movingDir))) {
			movingDir = new Point();
		}

		ch.updateDir(movingDir);

		if(!ch.dead && data.bomb) {
			map.placeBomb(ch.coord);
		}
	});

	infoPlayerNumbers();

	socket.on('disconnect', function(data) {
		sockets.splice(sockets.indexOf(socket), 1);
		map.chars.splice(map.chars.indexOf(ch), 1);
	
		infoPlayerNumbers();
	});
});

var infoPlayerNumbers = function() {
	var obj = {info:"Total " + sockets.length  + " Players"};
	for(var i = 0; i < sockets.length; i++) {
		sockets[i].emit('info', obj);
	}
}

var update_msec = 125;

var update = function(delay) {
	setTimeout(function() {
		var last_update = new Date();

		for(var i = 0; i < sockets.length; i++) {
			var socket = sockets[i];
			var ch = socket.ch;
			var area = map.getVisibleArea(
				ch.pos.x - SCREEN_WIDTH/2,
				ch.pos.y - SCREEN_HEIGHT/2
			);
			socket.emit('map', {map:map.serialize(area)});
		}

		var alive = map.update({delta:update_msec});
		if((sockets.length == 1 && alive == 0) ||
			(sockets.length > 1 && alive < 2)) {
			var newMap = new Map(getMapSize(sockets.length));
			for(var i = 0; i < map.chars.length; i++) {
				var ch = map.chars[i];
				ch.dead = false;
				newMap.updateToRandPos(ch);
				newMap.chars.push(ch);
			}
			map = newMap;
		}

		var diff = update_msec - (new Date() - last_update);
		if(diff < 0) {
			console.log("WARNING: update too slow!");
			diff = 1;
		}
		update(diff);
	}, delay);
};
update(update_msec);
