var isPatternReady = false;
var ptnWidth, ptnHeight;
var ptnShape = [];
var ptnCorners = [];

function initPattern() {
	var patternImg = new Image();
	patternImg.src = "./imgs/hb.jpg";
	if (patternImg.complete) {
		loadPattern(patternImg);
	} else {
		patternImg.onload = function() {
			loadPattern(patternImg);
		}
	}
}

function loadPattern(patternImg) {
	ptnWidth = patternImg.width;
	ptnHeight = patternImg.height;
	arctx.drawImage(patternImg, 0, 0, ptnWidth, ptnHeight);
	var ptnImgData = arctx.getImageData(0, 0, ptnWidth, ptnHeight);
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