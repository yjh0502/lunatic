var MapRenderer = function(ctx) {
	var tile_none = new Sprite(0, 0, "./img/TILE_NONE.PNG", ctx);
	var tile_indest = new Sprite(0, -30, "./img/WALL_INDESTRUCTIBLE.PNG", ctx);

	var tile_bomb_red = new Sprite(0, 0, "./img/BOMB_RED.PNG", ctx);
	var tile_flame = new Sprite(0, 0, "./img/TILE_BLUE.PNG", ctx);

	var sprite_ch = new Sprite(TILE_SIZE, TILE_SIZE, "./img/SLIME_BLUE.PNG", ctx);
	var sprite_ch_gray = new Sprite(TILE_SIZE, TILE_SIZE, "./img/SLIME_GRAY.PNG", ctx);

	this.draw = function(obj) {
		var area = obj.area;

		this.drawFloor(obj, area);
		this.drawChars(obj, area);

		this.drawBomb(obj, area);
		this.drawFlame(obj, area);
		this.drawObstacle(obj, area);
	}

	//draw calls
	this.drawFloor = function(map, area) {
		for(var x = area.startX; x < area.endX; x++) {
			for(var y = area.startY; y < area.endY; y++) {
				var tile = map.map[x-area.startX][y-area.startY];
				if(tile == 0) {
					tile_none.x = x * TILE_SIZE;
					tile_none.y = y * TILE_SIZE;
					tile_none.draw();
				}
			}
		}
	}

	this.drawBomb = function(map, area) {
		for(var i = 0; i < map.bombs.length; i++) {
			var bomb = map.bombs[i];
			var p = bomb.pos;

			if(p.x < area.startX || p.x > area.endX ||
				p.y < area.startY || p.y > area.endY) {
				continue;
			} else {
				tile_bomb_red.x = p.x * TILE_SIZE;
				tile_bomb_red.y = p.y * TILE_SIZE;

				tile_bomb_red.draw();
			}
		}
	}

	this.drawChars = function(map, area) {
		for(var i = 0; i < map.chars.length; i++) {
			var ch = map.chars[i];
			var sprite = sprite_ch;
			if(ch.dead) {
				sprite = sprite_ch_gray;
			}
		
			sprite.x = ch.pos.x;
			sprite.y = ch.pos.y;
			sprite.draw();
		}
	}

	this.drawFlame = function(map, area) {
		for(var i = 0; i < map.flames.length; i++) {
			var flame = map.flames[i];
			var p = flame.pos;

			if(p.x < area.startX || p.x > area.endX ||
				p.y < area.startY || p.y > area.endY) {
				continue;
			} else {
				tile_flame.x = p.x * TILE_SIZE;
				tile_flame.y = p.y * TILE_SIZE;

				tile_flame.draw();
			}
		}
	}

	this.drawObstacle = function(map, area) {
		for(var x = area.startX; x < area.endX; x++) {
			for(var y = area.startY; y < area.endY; y++) {
				var tile = map.map[x-area.startX][y-area.startY];
				if(tile == 1) {
					tile_indest.x = x * TILE_SIZE;
					tile_indest.y = -30 + y * TILE_SIZE;
					tile_indest.draw();
				}
			}
		}
	}
}
