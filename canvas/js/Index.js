//获取元素
var scores = document.getElementById("scores");
var record = document.getElementById("record");
var size = document.getElementById("size");
var btn1 = document.getElementById("btn1");
var can = document.getElementById("can");
var ctx = can.getContext("2d");
var foodArr = []; //食物坐标
var score = 0; //本次游戏成绩
var speed = 300; //蛇的运动速度
record.innerHTML = localStorage.getItem("records") || 0;
//---画网格
function Grid(s) {
	this.s = s;
}
Grid.prototype.draw = function() {
	for(var i = 1; i < can.width / this.s; i++) {
		ctx.beginPath();
		ctx.moveTo(this.s * i, 0);
		ctx.lineTo(i * this.s, can.height);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, this.s * i);
		ctx.lineTo(can.width, i * this.s);
		ctx.stroke();
	}
}
//------实例化
var grid = new Grid(15);
grid.draw();

//------方框的构造函数

function Rec(x, y, color) {
	this.x = x;
	this.y = y;
	if(color) {
		this.color = color;
	} else {
		this.color = "gray";
	}
	this.w = this.h = grid.s;
}
Rec.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(this.x, this.y, this.w, this.h);
}
//------snake构造函数与原型
function Snake() {
	this.body = []; //存储蛇头和蛇身；
	for(var i = 2; i >= 0; i--) {
		this.body.push(new Rec((i - 1) * grid.s, 0));
	}
	this.body[0].color = "red";
	this.dir = 39; //默认向右运动；
	this.canChange = true;
}
Snake.prototype = {
	constructor: Snake,
	draw: function() {
		for(var i = 0; i < this.body.length; i++) {
			this.body[i].draw();
		}
	},
	move: function() {
		for(var i = this.body.length - 1; i > 0; i--) {
			this.body[i].x = this.body[i - 1].x;
			this.body[i].y = this.body[i - 1].y;
		}
		switch(this.dir) {
			case 39:
				this.body[0].x += grid.s;
				break;
			case 37:
				this.body[0].x -= grid.s;
				break;
			case 38:
				this.body[0].y -= grid.s;
				break;
			case 40:
				this.body[0].y += grid.s;
				break;
		}
		if(this.body[0].x > can.width - grid.s) {
			this.body[0].x = 0;
		} else if(this.body[0].x < 0) {
			this.body[0].x = can.width - grid.s;
		}
		if(this.body[0].y > can.height - grid.s) {
			this.body[0].y = 0;
		} else if(this.body[0].y < 0) {
			this.body[0].y = can.height - grid.s;
		}
		//和食物碰撞
		if(this.body[0].x == foodArr[0] && this.body[0].y == foodArr[1]) {
			score++;
			food = newFood();
			food.draw();
			scores.innerHTML = score;
			this.body.push(new Rec(this.body[this.body.length - 1].x, this.body[this.body.length - 1].y));
		}
		//和自身碰撞
		for(i = 4; i < this.body.length; i++) {
			if(this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
				clearInterval(timer);
				//					
				if(score > localStorage.getItem("records")) {
					localStorage.setItem("records", score);
				}
				record.innerHTML = localStorage.getItem("records");
				alert("游戏结束");
				window.location.reload(); 
			}
		}
	}

}
var snake = new Snake();
//键盘操作
document.onkeydown = function(e) {
	var e = e || window.event;
	if(!snake.canChange) {
		return;
	}
	snake.canChange = false;
	switch(e.keyCode) {
		case 39:
			if(snake.dir != 37) {
				snake.dir = 39;
			}
			break;
		case 37:
			if(snake.dir != 39) {
				snake.dir = 37;
			}
			break;
		case 38:
			if(snake.dir != 40) {
				snake.dir = 38;
			}
			break;
		case 40:
			if(snake.dir != 38) {
				snake.dir = 40;
			}
			break;
		case 16:
			if(speed > 100) {
				speed -= 10;
			}
			break;
		case 17:
			if(speed < 450) {
				speed += 10;
			}
			break;
	}
	clearInterval(timer);
	timer = setInterval(function() {
		snake.canChange = true;
		ctx.clearRect(0, 0, can.width, can.height);
		grid.draw();
		snake.move();
		snake.draw();
		food.draw();
	}, speed);
	console.log(speed);

}
//食物模块
function newFood() {
	var bool = true;
	while(bool) {
		var x = rand(0, can.width / grid.s - 1) * grid.s;
		var y = rand(0, can.height / grid.s - 1) * grid.s;
		for(var i = 0; i < snake.body.length; i++) {
			if(x == snake.body[i].x && y == snake.body[i].y) {
				bool = true;
				break;
			} else {
				bool = false;
			}
		}
	}
	foodArr = [x, y];
	return new Rec(x, y, "green");
}
var food = newFood();
food.draw();
var timer = setInterval(function() {
	snake.canChange = true;
	ctx.clearRect(0, 0, can.width, can.height);
	grid.draw();
	snake.move();
	snake.draw();
	food.draw();
}, speed);

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
//网格部分
btn1.onclick = function() {
	clearInterval(timer);
	var num = Number(size.value);
	grid = new Grid(num);
	grid.draw();
	snake = new Snake();
	food = newFood();
	food.draw();
	timer = setInterval(function() {
		snake.canChange = true;
		ctx.clearRect(0, 0, can.width, can.height);
		grid.draw();
		snake.move();
		snake.draw();
		food.draw();
	}, speed);
}