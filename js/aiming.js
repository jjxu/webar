
var aimingBox = [];
var fairyShape = [];
var cell;
var fairyImg, captureImg;
var baseX = 92, baseY = 176;

function initAiming(width, height, context) {
    cell = width / 16;
    aimingBox[0] = {'x':cell * 6, 'y':height / 2 - (cell << 1)};
    aimingBox[1] = {'x':cell * 10, 'y':height / 2 - (cell << 1)};
    aimingBox[2] = {'x':cell * 10, 'y':height / 2 + (cell << 1)};
    aimingBox[3] = {'x':cell * 6, 'y':height / 2 + (cell << 1)};

    fairyImg = new Image();
    fairyImg.src = "./imgs/rp0.jpg";

    captureImg = new Image();
    //captureImg.src = "./imgs/rp4.gif";
    captureImg.src = "./imgs/rp1.jpg";
    isCaptured = false;
    if (fairyImg.complete) {
        loadFairy(context, fairyImg);
    } else {
        fairyImg.onload = function() {
            loadFairy(context, fairyImg);
        }
    }
}

var fairyWidth, fairyHeight;
var channels = [];
var fairyImgData;
function loadFairy(context, fairyImg) {
    fairyWidth = fairyImg.width;
    fairyHeight = fairyImg.height;
    
    fairyShape = [ {'x':baseX,'y':baseY}, 
        {'x':fairyWidth + baseX,'y':baseY}, 
        {'x':fairyWidth + baseX,'y':fairyHeight + baseY}, 
        {'x':baseX,'y':fairyHeight + baseY} ];
    /*
    context.drawImage(fairyImg, 0, 0);
    fairyImgData = context.getImageData(0, 0, fairyWidth, fairyHeight);

    for (var i = 0; i < 5; i++) {
        channels.push(new jsfeat.matrix_t(fairyWidth, fairyHeight, jsfeat.U8_t | jsfeat.C1_t));
    }
    var data = new Uint32Array(fairyImgData.data.buffer);
    for (var j = 0; j < fairyWidth * fairyHeight; j++) {
        channels[0].data[j] = data[j];
        channels[1].data[j] = (data[j] >> 8);
        channels[2].data[j] = (data[j] >> 16);
        channels[3].data[j] = (data[j] >> 24);
    }
    trans3x3 = new jsfeat.matrix_t(3, 3, jsfeat.F32C1_t);*/
}

var isAiming, isCaptured;
var startAimingTime;
var trans3x3;
function drawAiming(context, matrix3x3, isReset) {
        
    if (isReset) {
        fairyShape[0].x = baseX;
        fairyShape[0].y = baseY;
        fairyShape[1].x = fairyWidth + baseX;
        fairyShape[1].y = baseY;
        fairyShape[2].x = fairyWidth + baseX;
        fairyShape[2].y = fairyHeight + baseY;
        fairyShape[3].x = baseX;
        fairyShape[3].y = fairyHeight + baseY;
        isAiming = false;
    }
/*        for (var i = 0; i < 9; i++)
            trans3x3.data[i] = matrix3x3.data[i];
    } else {
        jsfeat.matmath.multiply_3x3(trans3x3, trans3x3, matrix3x3);
    }
   // console.log(trans3x3.data[1] + "-" + matrix3x3.data[1]); 
    transformCorners(trans3x3.data, fairyShape);
    
    var data = new Uint32Array(fairyImgData.data.buffer);
    for (var j = 0; j < fairyWidth * fairyHeight; j++) {
        data[j] = 0;
    }
    for (var i = 0; i < 4; i++) {
        jsfeat.imgproc.warp_perspective(channels[i], channels[4], trans3x3, 0);
        for (var j = 0; j < fairyWidth * fairyHeight; j++) {
            data[j] = data[j] | (channels[4].data[j] << (i * 8));
        }
    }
   // console.log(data[0] + "-" + channels[4].data[0]);
    context.putImageData(fairyImgData, fairyShape[0].x, fairyShape[0].y);
    */
    transformCorners(matrix3x3.data, fairyShape);
    context.drawImage(fairyImg, fairyShape[0].x, fairyShape[0].y);
    drawAimingBox(context);

    /*
    context.beginPath();
    context.moveTo(fairyShape[0].x, fairyShape[0].y);
    context.lineTo(fairyShape[1].x, fairyShape[1].y);
    context.lineTo(fairyShape[2].x, fairyShape[2].y);
    context.lineTo(fairyShape[3].x, fairyShape[3].y);
    context.lineTo(fairyShape[0].x, fairyShape[0].y);
    context.stroke();*/

    if (isAimed()) {
        if (!isAiming) {
            startAimingTime = Date.now();
            isAiming = true;
        }
        drawProgress(context);
    } else {
        isAiming = false;
    }
}

function isAimed() {
    /*for (var i = 0; i < 4; i++) {
        if ((fairyShape[i].x < aimingBox[0].x) || (fairyShape[i].x > aimingBox[2].x)
            || (fairyShape[i].y < aimingBox[0].y) || (fairyShape[i].y > aimingBox[2].y))
            return false;
    }
    return true;*/
    if ((fairyShape[0].x < aimingBox[0].x) || (fairyShape[0].x > (aimingBox[2].x - fairyWidth))
        || (fairyShape[0].y < aimingBox[0].y) || (fairyShape[0].y > (aimingBox[2].y - fairyHeight)))
        return false;
    else
        return true;
}

function drawAimingBox(context) {
    context.beginPath();
    context.moveTo(aimingBox[0].x, aimingBox[0].y + cell); //|-
    context.lineTo(aimingBox[0].x, aimingBox[0].y);
    context.lineTo(aimingBox[0].x + cell, aimingBox[0].y);
 
    context.moveTo(aimingBox[1].x - cell, aimingBox[1].y); //-|
    context.lineTo(aimingBox[1].x, aimingBox[1].y);
    context.lineTo(aimingBox[1].x, aimingBox[1].y + cell);
 
    context.moveTo(aimingBox[2].x, aimingBox[2].y - cell); //-|
    context.lineTo(aimingBox[2].x, aimingBox[2].y);
    context.lineTo(aimingBox[2].x - cell, aimingBox[2].y);
 
    context.moveTo(aimingBox[3].x + cell, aimingBox[3].y);//-|
    context.lineTo(aimingBox[3].x, aimingBox[3].y);
    context.lineTo(aimingBox[3].x, aimingBox[3].y - cell);
    context.stroke();
}

function drawProgress(context) {
    var elapsedTime = Date.now() - startAimingTime;
    var percent = 1.0 - (elapsedTime / 3000.0);
    if (percent <= 0) {
        isCaptured = true;
        setInterval(drawCapture(context), 100);
        //drawCapture(context);
    } else {
        context.fillRect(0, height - 20, width * percent, 20);
    }
}

function drawCapture(context) {
    context.clearRect(0, 0, width, height);
    context.drawImage(captureImg, (width - captureImg.width) / 2, (height - captureImg.height) / 2);
    //context.drawImage(captureimg, 0, 0);
}

function captureFairy(event) {
    if (isCaptured) {
        isCaptured = false;
        isTracking = false;
    }
}
