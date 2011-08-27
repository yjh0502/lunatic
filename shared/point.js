var Point = function(x, y) {
	if(x == undefined && y == undefined) {
		x = 0;
		y = 0;
	}
	this.x = x;
	this.y = y;

	this.add = function(p) {
		return new Point(this.x + p.x, this.y + p.y);
	}

	this.equals = function(p) {
		if(p == null) return false;
		return this.x == p.x && this.y == p.y;
	}

	this.isZero = function() {
		return this.x == 0 && this.y == 0;
	}

	this.setZero = function() {
		this.x = 0;
		this.y = 0;
	}

	this.copy = function() {
		return new Point(this.x, this.y);
	}
}
