var Bomb = function(p) {
	this.pos = p;
	this.power = 3;
	this.time = 3000;
	this.exploded = false;

	this.update = function(state) {
		this.time -= state.delta;
		if(this.time < 0) {
			this.exploded = true;
		}
	}
}
