var texts = [];
var tPoints = [];
var cPoints = [];

function initText() {
	texts[0] = {'cx':142, 'cy':30, 'tx':10, 'ty':10, 'text':'刷卡槽'};
	texts[1] = {'cx':80, 'cy':260, 'tx':100, 'ty':100, 'text':'开关键'};
	texts[2] = {'cx':135, 'cy':460, 'tx':50, 'ty':50, 'text':'USB接口'};
	texts[3] = {'cx':250, 'cy':295, 'tx':150, 'ty':150, 'text':'IC卡插口'};

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
   		arctx.fillText(texts[i].text, tPoints[i].x, tPoints[i].y);
		arctx.arc(cPoints[i].x, cPoints[i].y, 10, 0, 360, false);
		arctx.moveTo(cPoints[i].x, cPoints[i].y);
   		arctx.lineTo(tPoints[i].x, tPoints[i].y);
   		arctx.stroke();//画空心圆
		arctx.closePath();
	}
//	
//	arctx.stroke();
}