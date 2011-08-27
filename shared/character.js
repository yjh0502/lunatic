var Character = function() {
	this.id = 1;
	this.pos = new Point(40, 40);
	this.coord = new Point(1, 1);
	this.movingDir = new Point();
	this.dead = false;

	this.update = function(state) {
		this.pos.x += this.movingDir.x * 20;
		this.pos.y += this.movingDir.y * 20;

		if(this.pos.x % TILE_SIZE == 0 && this.pos.y % TILE_SIZE == 0) {
			this.coord = this.coord.add(this.movingDir);
			this.movingDir.x = 0;
			this.movingDir.y = 0;
		}
	}

	this.updateDir = function(dir) {
		if(this.movingDir.x == 0 && this.movingDir.y == 0) {
			this.movingDir = dir;
		}
	}
}
