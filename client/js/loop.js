var Loop = function(canvas, update) {
	var fps = 0;
	var last_update = new Date();
	var totalSeconds = 0;

	var isRunning = false;

	var _i = 0;
	document.onkeydown = function(e) {
		keyevent_down(e);
		return false;
	};

	document.onkeyup = function(e) {
		keyevent_up(e);
		return false;
	};

	document.onmousemove = function(e) {
		var x;
		var y;
		if (e.pageX || e.pageY) { 
			x = e.pageX;
			y = e.pageY;
		}
		else { 
			x = e.clientX + document.body.scrollLeft + 
				document.documentElement.scrollLeft; 
			y = e.clientY + document.body.scrollTop + 
				document.documentElement.scrollTop; 
		} 
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;

		mousepos.x = x;
		mousepos.y = y;
	}

	document.onclick = function(e) {
		mousestate = true;
	}

	var mousepos = new (function() {
		this.x = 0;
		this.y = 0;
	})();

	var mousestate = false;

	var keymap = [];
	function keyevent_down(e) {
		if(keymap.indexOf(e.keyCode) == -1) {
			keymap.push(e.keyCode);
		}
	}

	function keyevent_up(e) {
		while(true) {
			var idx = keymap.indexOf(e.keyCode);
			if(idx == -1)
				break;
			keymap.splice(idx, 1);
		}
	}

	var mainLoop = function() {
		if(!isRunning) {
			return;
		}

		var time_diff = new Date() - last_update;
		last_update = new Date();
		update({delta:time_diff,	//update diff in milliseconds
			keystate:keymap,
			mousepos:mousepos,
			mousestate:mousestate,
		});
		if(mousestate == true) {
			mousestate = false;
		}
		totalSeconds += time_diff / 1000.0;

		var delay = 1000 / globals.targetFps - (new Date() - last_update);
		setTimeout(mainLoop, Math.max(delay, 0));

		if(delay > 0) {
			fps = globals.targetFps;
		} else {
			var update_time = -delay + 1000 / globals.targetFps;
			fps = (1000 / update_time)|0;
		}
		document.title = fps + " fps";
	}

	this.startLoop = function() {
		isRunning = true;
		last_update = new Date();
		totalSeconds = 0.0;
		mainLoop();
	}

	this.stopLoop = function() {
		isRunning = false;
	}

	this.TotalSeconds = function() {
		return totalSeconds;
	}
}
