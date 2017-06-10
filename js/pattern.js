var isPatternReady = false;
var ptnWidth, ptnHeight;
var ptnShape = [];
var ptnCorners = [];

function initPattern() {
	var patternImg = new Image();
	patternImg.src = "./imgs/hb.jpg";
	patternImg.onload = function() {
		loadPattern(patternImg);
	}
}

function loadPattern(patternImg) {
	ptnWidth = patternImg.width;
	ptnHeight = patternImg.height;
	bufctx.drawImage(patternImg, 0, 0, ptnWidth, ptnHeight);
	var ptnImgData = bufctx.getImageData(0, 0, ptnWidth, ptnHeight);
	var ptnGrayImg = new jsfeat.matrix_t(ptnWidth, ptnHeight, jsfeat.U8_t | jsfeat.C1_t);
	jsfeat.imgproc.grayscale(ptnImgData.data, ptnWidth, ptnHeight, ptnGrayImg);
	//jsfeat.imgproc.gaussian_blur(grayImg, blurImg, 5);
	//drawGrayImage(ptnImgData, ptnGrayImg);	
			
	for (var i = 0; i < ptnWidth * ptnHeight; i++) {
	    ptnCorners.push(new jsfeat.keypoint_t(0, 0, 0, 0));
	}
	var count = detectKeypoints(ptnGrayImg, ptnCorners, 120);
	//console.log("keypoint size:" + count);
	//drawKeypoints(ptnCorners, count);
	ptnDescs = new jsfeat.matrix_t(32, count, jsfeat.U8_t | jsfeat.C1_t);
	jsfeat.orb.describe(ptnGrayImg, ptnCorners, count, ptnDescs);

	ptnShape = [ {'x':0,'y':0}, {'x':ptnWidth,'y':0}, {'x':ptnWidth,'y':ptnHeight}, {'x':0,'y':ptnHeight} ];
	isPatternReady = true;

	//initModel(width, height);
	//initAiming(width, height, arctx);
	initVideo();
}

function resetPatternShape() {
	ptnShape[0].x = 0;
	ptnShape[0].y = 0;
	ptnShape[1].x = ptnWidth;
	ptnShape[1].y = 0;
	ptnShape[2].x = ptnWidth;
	ptnShape[2].y = ptnHeight;
	ptnShape[3].x = 0;
	ptnShape[3].y = ptnHeight;
}

function direction(pi, pj, pk) {
	return (pi.x - pk.x) * (pi.y - pj.y) - (pi.y - pk.y) * (pi.x - pj.x);
}

function isValidMatch(corners) {
	var d1 = direction(corners[1], corners[3], corners[0]);
	var d2 = direction(corners[1], corners[3], corners[2]);
	var d3 = direction(corners[0], corners[2], corners[1]);
	var d4 = direction(corners[0], corners[2], corners[3]);
	if ((d1 * d2 < 0) && (d3 * d4 < 0))
		return true;
	else 
		return false;
}

// project/transform rectangle corners with 3x3 Matrix
function transformCorners(M, corners) {
    //var pt = [ {'x':0,'y':0}, {'x':w,'y':0}, {'x':w,'y':h}, {'x':0,'y':h} ];
    var z=0.0, px=0.0, py=0.0;
    for (var i = 0; i < 4; i++) {
        px = M[0]*corners[i].x + M[1]*corners[i].y + M[2];
        py = M[3]*corners[i].x + M[4]*corners[i].y + M[5];
        z = M[6]*corners[i].x + M[7]*corners[i].y + M[8];
        corners[i].x = px / z;
        corners[i].y = py / z;
    }
    return;
}