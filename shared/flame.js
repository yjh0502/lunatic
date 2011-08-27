var Flame = function(p) {
	this.pos = p;
	this.time = 1000;

	this.update = function(state) {
		this.time -= state.delta;
		if(this.time < 0) {
			return true;
		}
		return false;
	}
}
