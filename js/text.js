var texts = [];
var tPoints = [];
var cPoints = [];

function initText() {
/*	texts[0] = {'cx':142, 'cy':30, 'tx':10, 'ty':10, 'text':'刷卡槽'};
	texts[1] = {'cx':80, 'cy':260, 'tx':100, 'ty':100, 'text':'开关键'};
	texts[2] = {'cx':135, 'cy':460, 'tx':50, 'ty':50, 'text':'USB接口'};
	texts[3] = {'cx':250, 'cy':295, 'tx':150, 'ty':150, 'text':'IC卡插口'};
*/
	texts[0] = {'cx':120, 'cy':245, 'tx':10, 'ty':10, 'text':'美国Schiff氨糖维骨力红瓶'};
	texts[1] = {'cx':125, 'cy':350, 'tx':100, 'ty':100, 'text':'氨糖软骨素,适用于关节需保养人群'};
	texts[2] = {'cx':200, 'cy':440, 'tx':50, 'ty':50, 'text':'每日2粒,1次或多次随餐服用'};
	texts[3] = {'cx':265, 'cy':270, 'tx':150, 'ty':150, 'text':'主要成分:盐酸氨基葡萄糖,硫酸软骨素,关节液'};

	tPoints[0] = {'x':0, 'y': 0};
    tPoints[1] = {'x':0, 'y': 0};
    tPoints[2] = {'x':0, 'y': 0};
    tPoints[3] = {'x':0, 'y': 0};

    cPoints[0] = {'x':0, 'y': 0};
    cPoints[1] = {'x':0, 'y': 0};
    cPoints[2] = {'x':0, 'y': 0};
    cPoints[3] = {'x':0, 'y': 0};
}

function drawText(matrix3x3, isReset) {
	if (isReset) {
		for (var i = 0; i < 4; i++) {
			cPoints[i].x = texts[i].cx;
			cPoints[i].y = texts[i].cy;
			tPoints[i].x = texts[i].cx + 30;
			tPoints[i].y = texts[i].cy - 20;
	    }
	}

	transformCorners(matrix3x3.data, cPoints);
	transformCorners(matrix3x3.data, tPoints);

	
//	arctx.strokeStyle="green";
	for (var i = 0; i < 4; i++) {
		arctx.beginPath();
   		//arctx.fillText(texts[i].text, tPoints[i].x, tPoints[i].y);
   		draw_long_text(texts[i].text, arctx, tPoints[i].x, tPoints[i].y);
		arctx.arc(cPoints[i].x, cPoints[i].y, 10, 0, 360, false);
		arctx.moveTo(cPoints[i].x, cPoints[i].y);
   		arctx.lineTo(tPoints[i].x, tPoints[i].y);
   		arctx.stroke();//画空心圆
		arctx.closePath();
	}
//	
//	arctx.stroke();
}

function draw_long_text(longtext, cxt, begin_width, begin_height) { 
  var linelenght = 20;
  var text = "";
  var count = 0;
  var begin_width = begin_width;
  var begin_height = begin_height;
  var stringLenght = longtext.length;
  var newtext = longtext.split("");
  
  for(i = 0; i <= stringLenght ; i++) {
    if(count == 10) {
		cxt.fillText(text, begin_width,begin_height);
		begin_height = begin_height + 25;
		text = "";
		count = 0;
	}

	if(i == stringLenght) {
		cxt.fillText(text,begin_width,begin_height);
	}

    var text = text + newtext[0];
	count ++;
	newtext.shift();	
  }
}