var divvid, arvideo;
var canPlay, isPlaying;
var playerImg;
var playerShape = [];

function initVideo() {
    divvid = document.getElementById('div-video');
    arvideo = document.getElementById('arvideo');
    canPlay = false;
    isPlaying = false;

    playerImg = new Image();
    playerImg.src = "./imgs/player.jpg";
    if (playerImg.complete) {
        loadPlayer(playerImg);
    } else {
        playerImg.onload = function() {
            loadPlayer(playerImg);
        }
    }
}

var playerWidth, playerHeight;
function loadPlayer(playerImg) {
    playerWidth = playerImg.width;
    playerHeight = playerImg.height;
    
    playerShape = [ {'x':baseX,'y':baseY}, 
        {'x':playerWidth + baseX,'y':baseY}, 
        {'x':playerWidth + baseX,'y':playerHeight + baseY}, 
        {'x':baseX,'y':playerHeight + baseY} ];
}

function drawPlayer(context, matrix3x3, isReset) {
    if (isReset) {
        playerShape[0].x = baseX;
        playerShape[0].y = baseY;
        playerShape[1].x = playerWidth + baseX;
        playerShape[1].y = baseY;
        playerShape[2].x = playerWidth + baseX;
        playerShape[2].y = playerHeight + baseY;
        playerShape[3].x = baseX;
        playerShape[3].y = playerHeight + baseY;
    }
    transformCorners(matrix3x3.data, playerShape);
    context.drawImage(playerImg, playerShape[0].x, playerShape[0].y);
    canPlay = true;
}

function playVideo() {
    if (canPlay) {
        divvid.style.display = 'block';
        arvideo.play();
        isPlaying = true;
        canPlay = false;
        return;
    }  

    if (isPlaying) {
        arvideo.stop();
        divvid.style.display = 'none';
        isPlaying = false;
        canPlay = false;
        return;
    }
}

function stopVideo() {
    if (isPlayed) {
        arvideo.stop();
        divvid.style.display = 'none';
        isPlayed = false;
    }
}

function moveVideo() {
    divvid.style.left = ptnShape[0].x + 'px';
    divvid.style.top = ptnShape[0].y + 'px';
}