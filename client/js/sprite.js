var Sprite = function(x, y, imgsrc, ctx) {
	this.tag = "";
	this.destroyed = false;

	this.x = x;
	this.y = y;
	this.width = 0;
	this.height = 0;

	this.img = loadImage(imgsrc);
	this.ctx = ctx;

	var _this = this;

	this.img.onload = function() {
		_this.width = this.width;
		_this.height = this.height;
	}

	this.move = function(state) {}
	this.update = function(state) {
		if(this.move != undefined) {
			this.move(state);
		}
	}
	this.draw = function() {
		var img = this.img;
		this.x |= 0;
		this.y |= 0;
		this.ctx.drawImage(img, this.x, this.y, img.width, img.height);
	}

	this.clicked = function() {}
	this.pointInRect = function(x, y) {
		var hw = this.width/2;
		var center = this.getCenter();

		if((center.x - hw) < x && (center.x + hw) > x &&
			this.y < y && (this.y + this.height > y)) {
			return true;
		}
		
		return false;
	}

	this.getCenter = function() {
		return {x:(this.x + this.width/2),
			y:(this.y + this.height/2)};
	}
}


