var arr_size = 1000;
var iter = 10000;

var arr = [];
for(var i = 0; i < 10000; i++) {
	arr.push(Math.random());
}

var benchmark = function(func) {
	var start = new Date();
	func();
	var end = new Date() - start;

	console.log("time: " + end);
}

var round = function() {
	for(var i = 0; i < iter; i++) {
		for(var j = 0; j < arr.length; j++) {
			Math.floor(arr[j]);
		}
	}
}

var parse = function() {
	for(var i = 0; i < iter; i++) {
		for(var j = 0; j < arr.length; j++) {
			parseInt(arr[j]);
		}
	}
}

var bitwise = function() {
	for(var i = 0; i < iter; i++) {
		for(var j = 0; j < arr.length; j++) {
			var k = arr[j] | 0;
		}
	}
}


benchmark(round);
benchmark(parse);
benchmark(bitwise);
console.log('----');
benchmark(round);
benchmark(parse);
benchmark(bitwise);
console.log('----');
benchmark(round);
benchmark(parse);
benchmark(bitwise);
console.log('----');
benchmark(round);
benchmark(parse);
benchmark(bitwise);
console.log('----');
benchmark(round);
benchmark(parse);
benchmark(bitwise);
console.log('----');
