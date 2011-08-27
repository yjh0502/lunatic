var Key_Spacebar = 32;
var Key_Left = 37;
var Key_Up = 38;
var Key_Right = 39;
var Key_Down = 40;
var Key_One = 49;
var Key_Two = 50;

var KeyDict = {
	Key_Spacebar:Key_Spacebar,
	Key_Left:Key_Left,
	Key_Up:Key_Up,
	Key_Right:Key_Right,
	Key_Down:Key_Down,
	Key_Two:Key_Two
}

var Input = new (function() {
	this.prevState = [];
	this.curState = [];

	this.update = function(keystate) {
		this.prevState = this.curState;
		this.curState = keystate;
	}

	var keyInArray = function(key, map) {
		return map.indexOf(key) != -1;
	}

	this.isKeyDown = function(key) {
		return !keyInArray(key, this.prevState) &&
			keyInArray(key, this.curState);
	}

	this.isKeyUp = function(key) {
		return keyInArray(key, this.prevState) &&
			!keyInArray(key, this.curState);
	}

	this.isKeyPressed = function(key) {
		return keyInArray(key, this.curState);
	}
})();
