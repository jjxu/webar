var divvid, arvideo;
var canPlay, isPlaying;
var playerImg, closeImg;
var playerShape = [];

var vidHeight, vidTop;
var playerImgTop, playerImgLeft, closeImgLeft, closeImgTop;
var playerImgWidth, playerImgHeight;

function initVideo() {
    divvid = document.getElementById('div-video');
    arvideo = document.getElementById('arvideo');
    canPlay = false;
    isPlaying = false;

    playerImg = new Image();
    playerImg.src = "./imgs/player.png";
    playerImg.onload = loadPlayer;

    closeImg = new Image();
    closeImg.src = "./imgs/c1.png";

    arvideo.addEventListener("loadedmetadata", function() {
        vidHeight = Math.round(width * arvideo.videoHeight / arvideo.videoWidth);
        vidTop = (height - vidHeight) / 2;
        divvid.style.top = vidTop + 'px';

        playerImgTop = (width - playerImgWidth) / 2;
        playerImgLeft = vidTop + (vidHeight - playerImgHeight) / 2;

        closeImgLeft = width - closeImg.width;
        closeImgTop = vidTop - closeImg.height / 2;
    });
}


function loadPlayer() {
    playerImgWidth = playerImg.width;
    playerImgHeight = playerImg.height;

    baseX = (ptnWidth - playerImgWidth) / 2;
    baseY = (ptnHeight - playerImgHeight) / 2;
    
    playerShape = [ {'x':baseX,'y':baseY}, 
        {'x':playerImgWidth + baseX,'y':baseY}, 
        {'x':playerImgWidth + baseX,'y':playerImgHeight + baseY}, 
        {'x':baseX,'y':playerImgHeight + baseY} ];
}

function drawPlayer(matrix3x3, isReset) {
    if (isReset) {
        playerShape[0].x = baseX;
        playerShape[0].y = baseY;
    /*    playerShape[1].x = playerImgWidth + baseX;
        playerShape[1].y = baseY;
        playerShape[2].x = playerImgWidth + baseX;
        playerShape[2].y = playerImgHeight + baseY;
        playerShape[3].x = baseX;
        playerShape[3].y = playerImgHeight + baseY; */
    }
    transformCorners(matrix3x3.data, playerShape);
    arctx.drawImage(playerImg, playerShape[0].x, playerShape[0].y);
    canPlay = true;
}

function playVideo() {
    arctx.clearRect(0, 0, width, height);
    isPlaying = true;
    divvid.style.display = 'block';
    arvideo.play();
    arctx.drawImage(closeImg, closeImgLeft, closeImgTop);
}

function moveVideo() {
    divvid.style.left = ptnShape[0].x + 'px';
    divvid.style.top = ptnShape[0].y + 'px';
}

function closeVideo(x, y) {
    if (x >= closeImgLeft && x <= (closeImgLeft + closeImg.width) 
        && y >= closeImgTop && y <= (closeImgTop + closeImg.height)) {
        arvideo.pause();
        divvid.style.display = 'none';
        arctx.clearRect(closeImgLeft, closeImgTop, closeImg.width, closeImg.height);
        isPlaying = false;
        canPlay = false;
        isTracking = false;
     //   startScan();
        requestAnimationFrame(imageProcessing);
        return true;
    } else {
        return false;
    }
}

function touchPlayer(x, y) {
    if (!canPlay) {
        return true;
    }

    if (!isPlaying) {
        if (x >= playerShape[0].x && x <= (playerShape[0].x + playerImgWidth) 
            && y >= playerShape[0].y && y <= (playerShape[0].y + playerImgHeight)) {
            playVideo();
        }
    } else {
        var closed = closeVideo(x, y);
        if (!closed) {
            if (y >= vidTop && y <= (vidTop + vidHeight)) {
                if (arvideo.paused) {
                    arctx.clearRect(playerImgTop, playerImgLeft, playerImgWidth, playerImgHeight);
                    arvideo.play();
                } else {
                    arvideo.pause();
                    arctx.drawImage(playerImg, playerImgTop, playerImgLeft);
                }
            }
        }
    }
    
    if (isPlaying)
        return false;
    else
        return true;
}