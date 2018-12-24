// 获取需要用到标签
var score = document.querySelector('#score');
var time = document.querySelector('#time');
var wolfs = document.querySelector('#wolfs');
var start = document.querySelector('#start');
var over = document.querySelector('#over');
var p = document.querySelector('#start p');
var cou = 0;
var test = [];

//预加载
var imgArray = [
	'img/game_bg.jpg',
	'img/h0.png',
	'img/h1.png',
	'img/h2.png',
	'img/h3.png',
	'img/h4.png',
	'img/h5.png',
	'img/h6.png',
	'img/h7.png',
	'img/h8.png',
	'img/h9.png',
	'img/progress.png',
	'img/x0.png',
	'img/x1.png',
	'img/x2.png',
	'img/x3.png',
	'img/x4.png',
	'img/x5.png',
	'img/x6.png',
	'img/x7.png',
	'img/x8.png',
	'img/x9.png'
];
//预加载
window.onload = function() {
	var len = imgArray.length;
	for(var i = 0; i < len; i++) {
		var img = new Image();
		img.src = imgArray[i];
		test.push(img);
		img.onload = function() {
			cou++;
			if(cou == len) {
				p.style.opacity = 1;
				gameStart();
			}
		}
	}
}

var wolfPoints = [
	["98px", "115px"],
	["17px", "160px"],
	["15px", "220px"],
	["30px", "293px"],
	["122px", "273px"],
	["207px", "295px"],
	["200px", "211px"],
	["187px", "141px"],
	["100px", "185px"]
];

// 生成随机数的函数
function randomNum() {
	return Math.floor(Math.random() * 9);
}

// 记录得分的全局变量
var scoreNum = 0;

// 创建狼的部分
// 创建狼的计时器，之所以定义全局变量是因为在倒计时的计时器中需要关闭它
var timer;

function createWolf() {
	// 1.创建大狼还是小狼:随机数范围0-8，其中0,1为小狼，其余为大狼
	// 用来存放当前页面上所有的狼
	var wolfArr = [];
	timer = setInterval(function() {
		// 获取狼坑位置
		var n = randomNum();
		// 约定如果bool为true就是坑里没狼
		var bool = true;
		// 判断该位置上是否已经存在狼
		for(var i = 0; i < wolfArr.length; i++) {
			if(wolfArr[i].index == n) {
				// 说明该狼坑已经存在狼
				bool = false;
				break;
			}
		}
		// 对于狼坑是否的结果
		if(bool) {
			var wolf = document.createElement('img');
			// 为每一个狼添加种类属性，用来判断种类
			wolf.type = randomNum();
			if(wolf.type <= 1) {
				// 小狼
				wolf.src = 'img/x0.png';
			} else {
				// 大狼
				wolf.src = 'img/h0.png';
			}
			// 狼运动
			// 图片下标
			var index = 0;
			// 换图速度
			var speed = 1;
			// 为每一个狼添加属于自己的计时器
			wolf.move = setInterval(function() {
				index += speed;
				if(index == 5) {
					speed *= -1;
				}
				if(index <= 0) {
					clearInterval(wolf.move);
					// 从数组和父级中移除
					wolfArr.shift();
					wolfs.removeChild(wolf);
				}
				if(wolf.type <= 1) {
					// 小狼
					wolf.src = 'img/x' + index + '.png';
				} else {
					// 大狼
					wolf.src = 'img/h' + index + '.png';
				}
			}, 200);
			// 设置参数并添加
			wolf.style.left = wolfPoints[n][0];
			wolf.style.top = wolfPoints[n][1];
			// 添加属性用来记录狼位置，判断狼坑
			wolf.index = n;
			// 添加到父级并且添加到数组
			wolfs.appendChild(wolf);
			wolfArr.push(wolf);
			// 为狼添加点击事件
			wolf.onclick = function() {
				// 0.关闭之前狼运动的计时器
				clearInterval(wolf.move);
				// 1.判断类型，确定是加分还是减分
				if(wolf.type <= 1) {
					// 小狼
					scoreNum -= 10;
				} else {
					// 大狼
					scoreNum += 10;
				}
				score.innerHTML = scoreNum;

				// 2.换成被揍的图
				var index = 5;
				wolf.hurt = setInterval(function() {
					index++;
					if(index == 9) {
						clearInterval(wolf.hurt);
						wolfArr.shift();
						wolfs.removeChild(wolf);
					}
					if(wolf.type <= 1) {
						// 小狼
						wolf.src = 'img/x' + index + '.png';
					} else {
						// 大狼
						wolf.src = 'img/h' + index + '.png';
					}
				}, 200);

				// 防止重复点击
				this.onclick = null;
			}
		}
	}, 1000);
}

// 倒计时部分
function gameTime() {
	// 开始创建狼
	createWolf();
	// 初始倒计时18秒
	var timeNum = 180;
	var startTimer = setInterval(function() {
		timeNum--;
		// 改变计时进度条宽度
		var w = time.offsetWidth;
		time.style.width = (w - 1) + 'px';
		if(timeNum <= 0) {
			clearInterval(startTimer);
			startTimer = null;
			// 倒计时结束要进行的操作
			clearInterval(timer);
			timer = null;
			// 显示游戏结束
			over.style.display = 'block';
		}
	}, 100);
}

// 游戏开始
function gameStart() {
	start.onclick = function() {
		// 调用倒计时
		gameTime();
		// 隐藏开始
		this.style.display = 'none';
	}
}