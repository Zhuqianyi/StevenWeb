var can = document.querySelector('#can');
var ctx = can.getContext('2d');

// 预加载页面
var im1 = new Image();
im1.src = 'img/loading.gif';
im1.className = 'circle';
im1.onload = function() {
	document.body.appendChild(im1);
	loading({
		bg: 'img/background.png',
		bullet1: 'img/bullet1.png',
		bullet2: 'img/bullet2.png',
		enemy1: 'img/enemy1.png',
		enemy2: 'img/enemy2.png',
		enemy3: 'img/enemy3.png',
		hero: 'img/herofly.png',
		pro: 'img/prop.png'
	}, {
		bullet: 'audio/bullet.mp3',
		enemy1: 'audio/enemy1_down.mp3',
		enemy2: 'audio/enemy2_down.mp3',
		enemy3: 'audio/enemy3_down.mp3',
		game: 'audio/game_music.mp3',
		dead: 'audio/game_over.mp3'
	}, game);
}

//---封装预加载函数
function loading(imgSrc_obj, auSrc_obj, game) {
	//用来存储音频对象
	var audios = {};
	//用来存储图片对象
	var imgs = {};
	for(var i in auSrc_obj) {
		var au = document.createElement('audio');
		au.src = auSrc_obj[i];
		audios[i] = au;
	}
	//图片的预加载
	//记录图片的总数
	var len = 0;
	//记录已加载的图片数量
	var count = 0;
	for(var i in imgSrc_obj) {
		len++;
		var im = new Image();
		im.src = imgSrc_obj[i];
		imgs[i] = im;
		im.onload = function() {
			count++;
			if(count == len) {
				im1.remove();
				game(imgs, audios);
			}
		}
	}
}

//----封装game函数
function game(imgs, audios) {
	//画布尺寸
	can.width = document.documentElement.clientWidth;
	can.height = document.documentElement.clientHeight;
	//播放背景音乐
	audios.game.play();
	audios.game.loop = true;
	var bg = imgs.bg;
	//----英雄机
	function Hero() {
		this.img = imgs.hero;
		this.w = this.img.width / 5;
		this.h = this.img.height;
		this.x = (can.width - this.w) / 2;
		this.y = can.height - this.h * 1.5;
		//数字0表示死亡  数字1表示存活
		this.life = 1;
		//数字1表示单行子弹 数字2表示双行子弹
		this.bulletType = 1;
		//用来截取飞机的状态图片
		this.index = 0;
		//设置缓动效果
		this.num = 0;
	}
	Hero.prototype.draw = function() {
		ctx.drawImage(this.img, this.index * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
	}
	var hero = new Hero();
	document.addEventListener('touchstart', function(e) {
		var e = e || window.event;
		if(e.touches.length == 1) {
			var disX = e.touches[0].clientX - hero.x;
			var disY = e.touches[0].clientY - hero.y;
			document.addEventListener('touchmove', function(e) {
				var e = e || window.event;
				hero.x = e.touches[0].clientX - disX;
				hero.y = e.touches[0].clientY - disY;
				hero.x = hero.x < 0 ? 0 : hero.x;
				hero.x = hero.x > can.width - hero.w ? can.width - hero.w : hero.x;
				hero.y = hero.y < 0 ? 0 : hero.y;
				hero.y = hero.y > can.height - hero.h ? can.height - hero.h : hero.y;
				e.preventDefault();
			}, false);
		}
	}, false);

	//---------------------子弹
	//用来存储实例化后的子弹
	var bullets = [];

	function Bullet(type) {
		if(type == 1) {
			this.img = imgs.bullet1;
			//记录子弹的杀伤力
			this.power = 1;
		} else {
			this.img = imgs.bullet2;
			this.power = 2;
		}
		this.w = this.img.width;
		this.h = this.img.height;
		this.x = hero.x + (hero.w - this.w) / 2;
		this.y = hero.y - this.h;
		//子弹向上运动的速度
		this.speed = 2;
	}
	Bullet.prototype = {
		constructor: Bullet,
		draw: function() {
			ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
		},
		move: function() {
			this.y -= this.speed;
		}
	}

	//敌机
	//存放敌机对象的数组
	var enemies = [];

	function Enemy() {
		var rd = rand(1, 100);
		if(rd <= 60) {
			this.img = imgs.enemy1;
			this.w = this.img.width / 5;
			this.speed = 3;
			this.life = 1;
			this.type = 1;
		} else if(rd < 90) {
			this.img = imgs.enemy2;
			this.w = this.img.width / 6;
			this.speed = 2;
			this.life = 3;
			this.type = 2;
		} else {
			this.img = imgs.enemy3;
			this.w = this.img.width / 10;
			this.speed = 1;
			this.life = 8;
			this.type = 3;
		}
		this.h = this.img.height;
		this.index = 0;
		this.x = rand(0, can.width - this.w);
		this.y = -this.h;
		this.num = 0;
	}

	Enemy.prototype = {
		constructor: Enemy,
		draw: function() {
			ctx.drawImage(this.img, this.index * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
		},
		move: function() {
			this.y += this.speed;
		}
	}

	// 背景模块
	var moves = 0;
	var moves2 = 0;
	ani();

	function ani() {
		moves++;
		moves2++;
		ctx.clearRect(0, 0, can.width, can.height);
		//----背景的动画
		ctx.drawImage(bg, 0, moves, can.width, can.height);
		ctx.drawImage(bg, 0, moves - can.height, can.width, can.height);
		moves = moves > can.height ? 0 : moves;
		//------英雄机
		if(hero.life != 0) {
			hero.draw();
		}
		//-----------------bullet
		if(hero.life != 0) {
			if(moves2 % 20 == 0) {
				var b = new Bullet(hero.bulletType);
				bullets.push(b);
				audios.bullet.play();
			}
		}
		for(var i = 0; i < bullets.length; i++) {
			bullets[i].draw();
			bullets[i].move();
		}
		for(var i = 0; i < bullets.length; i++) {
			if(bullets[i].y < -bullets[i].h) {
				bullets.splice(i, 1);
				i--;
			}
		}

		//-----------------敌机们
		if(moves2 % 40 == 0) {
			enemies.push(new Enemy());
		}
		for(var i = 0; i < enemies.length; i++) {
			if(enemies[i].y > can.height) {
				enemies.splice(i, 1);
				i--;
				continue;
			}
			enemies[i].draw();
			enemies[i].move();
		}

		//				-------------碰撞检测
		//1.英雄机与敌机
		for(var i = 0; i < enemies.length; i++) {
			if(enemies[i].life > 0 && hero.life != 0) {
				if(hero.x >= enemies[i].x - hero.w && hero.x <= enemies[i].x + enemies[i].w &&
					hero.y >= enemies[i].y - hero.h && hero.y <= enemies[i].y + enemies[i].h) {
					hero.num++;
					if(hero.num % 5 == 0) {
						hero.index++;
					}
					if(hero.index >= 4) {
						hero.life = 0;
						audios.dead.play();
					}
				}
			}
		}

		//----------子弹与敌机
		for(var i = 0; i < enemies.length; i++) {
			if(enemies[i].life > 0) {
				for(var j = 0; j < bullets.length; j++) {
					if(bullets[j].x >= enemies[i].x - bullets[j].w && bullets[j].x <= enemies[i].x + enemies[i].w &&
						bullets[j].y >= enemies[i].y - bullets[j].h && bullets[j].y <= enemies[i].y + enemies[i].h) {
						enemies[i].life -= bullets[j].power;
						bullets.splice(j, 1);
						j--;
					}
				}
			}
		}

		//================敌机进入爆炸程序
		for(var i = 0; i < enemies.length; i++) {
			if(enemies[i].life <= 0) {
				enemies[i].num++;
				if(enemies[i].num % 5 == 0) {
					enemies[i].index++;
				}
				if(enemies[i].index * enemies[i].w == enemies[i].img.width) {
					switch(enemies[i].type) {
						case 1:
							audios.enemy1.play();
							break;
						case 2:
							audios.enemy2.play();
							break;
						case 3:
							audios.enemy3.play();
							break;
						default:
							break;
					}
					enemies.splice(i, 1);
					i++;
				}
			}
		}
		window.requestAnimationFrame(ani);
	}
}

//随机函数
function rand(min, max) {
	return Math.floor(Math.random() * (max + 1 - min) + min);
}