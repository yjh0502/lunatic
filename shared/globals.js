var globals = {};

globals.targetFps = 60;
globals.tickPerFrame = 100;
globals.tickPerSecond = globals.targetFps * globals.tickPerFrame;

globals.updateTickPerFrame = function(tpf) {
	globals.tickPerFrame = tpf;
}

var loadImage = function(src) {
	var img = new Image();
	img.src = src;

	return img;
}

var Button = function(normal, active, clicked) {
	this.update = function(state) {
		var mouseX = state.mousepos.x;
		var mouseY = state.mousepos.y;

		if(normal.pointInRect(mouseX, mouseY)) {
			active.draw();
			if(state.mousestate) {
				return clicked();
			}
		} else {
			normal.draw();
		}
	}
}

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 480;

var TILE_NONE = 0;
var TILE_INDEST = 1;

var TILE_SIZE = 40;

var MOVE_TIME = 0.25;
var INDEST_RATIO = 0.5;

var getMapSize = function(n) {
	if(n < 5) {
		return 20;
	} else if(n < 10) {
		return 30;
	} else {
		return 40;
	}
}
