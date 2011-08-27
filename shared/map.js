var Map = function(size) {
	this.size = size;

	this.map = [];
	this.chars = [];
	this.bombs = [];
	this.flames = [];

	for(var x = 0; x < this.size; x++) {
		var col = [];
		for(var y = 0; y < this.size; y++) {
			if(x == 0 || x == this.size-1 || 
				y == 0 || y == this.size-1) {
				col.push(TILE_INDEST);
			} else if(x%2 == 0 && y%2 == 0) {
				if(Math.random() < INDEST_RATIO) {
					col.push(TILE_INDEST);
				} else {
					col.push(TILE_NONE);
				}
			} else {
				col.push(TILE_NONE);
			}
		}
		this.map.push(col);
	}

	this.canMove = function(p) {
		if(p.x < 0 || p.y < 0 || p.x >= this.size || p.y >= this.size) {
			return false;
		}

		if(this.map[p.x][p.y] != 0) {
			return false;
		}
		for(var i = 0, n = this.bombs.length; i < n; i++) {
			if(this.bombs[i].pos.equals(p)) {
				return false;
			}
		}
		return true;
	}

	this.canFlame = function(p) {
		if(p.x < 0 || p.y < 0 || p.x >= this.size || p.y >= this.size) {
			return false;
		}

		if(this.map[p.x][p.y] == 0) {
			return true;
		}
		return false;
	}

	this.placeBomb = function(p) {
		for(var i = 0; i < this.bombs.length; i++) {
			if(this.bombs[i].pos.equals(p)) {
				return;
			}
		}
		this.bombs.push(new Bomb(p));
	}

	this.extractExploded = function(bombList, posList) {
		var exploded = [];
		for(var i = 0, n = posList.length; i < n; i++) {
			var pos = posList[i];
			for(var j = 0, m = bombList.length; j < m; j++) {
				if(bombList[j].pos.equals(pos)) {
					exploded.push(bombList.splice(j, 1)[0]);
					break;
				}
			}
		}

		return exploded;
	}

	this.bombExploded = function(bombs, posList, bomb) {
		posList = posList.concat(this.getFlamePos(bomb));
		var exploded = this.extractExploded(bombs, posList);

		for(var j = 0; j < exploded.length; j++) {
			posList = posList.concat(this.getFlamePos(exploded[j]));
		}

		var preserved = bombs;

		return {
			posList:posList,
			exploded:exploded,
			preserved:preserved
		};
	}

	this.checkExploded = function(bombs, posList) {
		var preserved;
		var exploded;

		for(var i = 0; i < bombs.length; i++) {
			var bomb = bombs[i];
			if(bomb.exploded) {
				return this.bombExploded(bombs, posList, bomb);
			} else {
				for(var j = 0; j < posList.length; j++) {
					if(bomb.pos.equals(posList[j])) {
						return this.bombExploded(bombs, posList, bomb);
					}
				}
			}
		}

		return {
			posList:posList,
			exploded:[],
			preserved:bombs
		};
	}

	this.update = function(state) {
		for(var i = 0; i < this.chars.length; i++) {
			this.chars[i].update(state);
		}

		var newFlames = [];

		for(var i = 0; i < this.bombs.length; i++) {
			this.bombs[i].update(state);
		}

		var posList = [];
		while(true) {
			var res = this.checkExploded(this.bombs, posList);
			posList = res.posList;
			if(res.exploded.length == 0) {
				break;
			} else {
				this.bombs = res.preserved;
			}
		}

		for(var i = 0; i < posList.length; i++) {
			newFlames.push(new Flame(posList[i]));
		}

		for(var i = 0; i < this.flames.length; i++) {
			var flame = this.flames[i];
			if(!flame.update(state)) {
				var added = false;
				for(var j = 0; j < newFlames.length; j++) {
					var newFlame = newFlames[j];
					if(flame.pos.equals(newFlame.pos)) {
						newFlame.time = Math.max(newFlame.time, flame.time);	
						added = true;
						break;
					}
				}
				if(!added) {
					newFlames.push(flame);
				}
			}
		}

		this.flames = newFlames;

		var aliveCount = 0;
		for(var i = 0; i < this.chars.length; i++) {
			var ch = this.chars[i];
			if(this.isFlamed(ch.coord)) {
				ch.dead = true;
			} else if(!ch.dead) {
				aliveCount += 1;
			}
		}
		return aliveCount;
	}


	this.isFlamed = function(p) {
		for(var i = 0, n = this.flames.length; i < n; i++) {
			var pos = this.flames[i].pos;
			if(pos.equals(p)) {
				return true;
			}
		}
		return false;
	}

	var dirs = [new Point(1, 0), new Point(-1, 0),
		new Point(0, 1), new Point(0, -1)];
	this.getFlamePos = function(bomb, list) {
		list = [bomb.pos.copy()];

		for(var j = 0; j < dirs.length; j++) {
			var dir = dirs[j];
			var pos = bomb.pos.add(dir);

			for(var i = 0; i < bomb.power; i++) {
				if(this.canFlame(pos)) {
					list.push(pos);
					pos = pos.add(dir);
				} else {
					break;
				}
			}
		}
		return list;
	}

	this.getVisibleArea = function(centerX, centerY) {
		var startX = centerX;
		var endX = startX + SCREEN_WIDTH;
		var startY = centerY;
		var endY = startY + SCREEN_HEIGHT;

		var area = {
			startX	: ((startX / TILE_SIZE)|0) - 1,
			startY	: ((startY / TILE_SIZE)|0) - 1,
			endX	: ((endX / TILE_SIZE)|0) + 2,
			endY	: ((endY / TILE_SIZE)|0) + 2,
		}

		for(var key in area) {
			if(area[key] < 0) area[key] = 0;
			else if(area[key] > this.size) {
				area[key] = this.size;
			}
		}
		return area;
	}

	this.updateToRandPos = function(ch) {
		while(true) {
			var p = new Point((this.size * Math.random()|0),
				(this.size * Math.random())|0);
			if(this.canMove(p)) {
				ch.coord = p;
				ch.pos.x = p.x * TILE_SIZE;
				ch.pos.y = p.y * TILE_SIZE;
				break;
			}
		}
	}

	this.serialize = function(area) {
		var map = [];
		for(var x = area.startX; x < area.endX; x++) {
			var col = [];
			for(var y = area.startY; y < area.endY; y++) {
				col.push(this.map[x][y]);
			}
			map.push(col);
		}
		return {
			area:area,
			map:map,
			chars:this.chars,
			bombs:this.bombs,
			flames:this.flames
		};
	};
}
