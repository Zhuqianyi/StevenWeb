//获取元素
var can = document.querySelector('#can');
var ctx = can.getContext('2d');
var deg = Math.PI / 180;

function draw() {
	//----画表盘
	ctx.beginPath();
	ctx.arc(250, 250, 200, 0, 360 * deg, false);
	ctx.fill();

	ctx.save(); //保存最原始的画布状态；
	ctx.translate(250, 250);

	//---画刻度
	for(var i = 0; i < 60; i++) {
		ctx.save();
		ctx.rotate(i * 6 * deg);
		ctx.beginPath();
		ctx.lineCap = 'round';
		ctx.strokeStyle = 'white';
		if(i % 5 == 0) {
			ctx.moveTo(170, 0);
			ctx.lineTo(190, 0);
			ctx.lineWidth = 10;
		} else {
			ctx.moveTo(170, 0);
			ctx.lineTo(185, 0);
			ctx.lineWidth = 3;
		}
		ctx.stroke();
		ctx.restore();
	}

	//--画数字
	ctx.font = '30px Georgia';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.strokeStyle = 'white';
	for(var i = 1; i <= 12; i++) {
		var x = 140 * Math.sin(30 * i * deg);
		var y = -140 * Math.cos(30 * i * deg);
		ctx.strokeText(i, x, y);
	}
	//获取时间
	var hours = new Date().getHours();
	var minutes = new Date().getMinutes();
	var seconds = new Date().getSeconds();
	//---时针
	ctx.save();
	ctx.rotate(hours * 30 * deg - 90 * deg + minutes / 60 * 30 * deg);
	ctx.moveTo(-10, 0);
	ctx.lineTo(30, 0);
	ctx.lineCap = 'round';
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'white';
	ctx.stroke();
	ctx.restore();
	//--分针
	ctx.save();
	ctx.rotate(minutes * 6 * deg - 90 * deg + seconds / 60 * 6 * deg);
	ctx.moveTo(-10, 0);
	ctx.lineTo(60, 0);
	ctx.lineCap = 'round';
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'white';
	ctx.stroke();
	ctx.restore();
	//---秒针
	ctx.save();
	ctx.rotate(seconds * 6 * deg - 90 * deg);
	ctx.moveTo(-10, 0);
	ctx.lineTo(90, 0);
	ctx.lineCap = 'round';
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'white';
	ctx.stroke();
	ctx.restore();
	ctx.font = '48px Georgia';
	ctx.strokeText('CANVAS', 0, 50);
	ctx.restore();

}

draw();
setInterval(function() {
	ctx.clearRect(0, 0, 500, 500);
	draw();
}, 500);