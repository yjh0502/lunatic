var Gameplay = function(ctx) {
	var socket = io.connect();
	var renderer = new MapRenderer(ctx);

	var tw = new Sprite(500, 400, "./img/BT_TW.PNG", ctx);
	var tw_active = new Sprite(500, 400, "./img/BT_TW.PNG", ctx);

	var fb = new Sprite(560, 400, "./img/BT_FB.PNG", ctx);
	var fb_active = new Sprite(560, 400, "./img/BT_FB.PNG", ctx);

	var btns = [
		new Button(tw, tw_active, function() {
			window.open("http://twitter.com/intent/tweet?text=%23bvfj%20%EC%82%B0%EC%B6%9C%EB%AC%BC%20%EC%A4%91%20%ED%95%98%EB%82%98%EC%9D%B8%20XXX%20Birds%EB%A5%BC%20%EC%86%8C%EA%B0%9C%ED%95%A9%EB%8B%88%EB%8B%A4!&url=http%3A%2F%2Fdesti.ruree.net%2Fxxx%2F&via=Tisde", "_self");
		}),
		new Button(fb, fb_active, function() {
			window.open("http://www.facebook.com/sharer/sharer.php?u=http://desti.ruree.net/xxx/&t=XXX+Birds", "_self");
		}),
	];

	var id = -1;
	var delay = 0.0;
	var storedDir = new Point();
	var spacePressed = false;
	var map = null;
	this.update = function(state) {
		if(id < 0) return;

		Input.update(state.keystate);

		delay += state.delta / 1000.0;

		var movingDir = new Point();

		if(Input.isKeyPressed(Key_Right)) {
			movingDir = new Point(1, 0);
		} else if(Input.isKeyPressed(Key_Left)) {
			movingDir = new Point(-1, 0);
		} else if(Input.isKeyPressed(Key_Up)) {
			movingDir = new Point(0, -1);
		} else if(Input.isKeyPressed(Key_Down)) {
			movingDir = new Point(0, 1);
		}

		storedDir = movingDir;
		if(Input.isKeyPressed(Key_Spacebar)) {
			spacePressed = true;
		}

		if(delay > 0.1) {
			socket.emit('update', {
				movingDir:movingDir,
				bomb:spacePressed
			});

			delay = 0;
			movingDir = new Point();
			spacePressed = false;
		}
	}

	this.draw = function(state) {
		if(map == null) 
			return;

		var ch;
		for(var i = 0; i < map.chars.length; i++) {
			if(map.chars[i].id == id) {
				ch = map.chars[i];
			}
		}
		this.centerX = ch.pos.x - SCREEN_WIDTH / 2;
		this.centerY = ch.pos.y - SCREEN_HEIGHT / 2;

		ctx.translate(-this.centerX, -this.centerY);
		renderer.draw(map, state);
		ctx.translate(this.centerX, this.centerY);
		map.prediction(state.delta);

		for(var i = 0; i < btns.length; i++) {
			var ret = btns[i].update(state);
			if(ret != null) return ret;
		}
	}

	socket.on('info', function(data) {
		$('#info').text(data.info);
	});

	socket.on('init', function(data) {
		id = data.id;
	});

	socket.on('map', function(data) {
		map = data.map;
		map.prediction = function(delta) {
			var mul = TILE_SIZE * delta / 1000.0 / MOVE_TIME;
			for(var i = 0; i < map.chars.length; i++) {
				var ch = map.chars[i];
				ch.pos.x += ch.movingDir.x * mul;
				ch.pos.y += ch.movingDir.y * mul;
			}
		}
	});
};
