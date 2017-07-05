// our point match structure
var match_t = (function () {
    function match_t(screen_idx, pattern_lev, pattern_idx, distance) {
        if (typeof screen_idx === "undefined") { screen_idx=0; }
        if (typeof pattern_lev === "undefined") { pattern_lev=0; }
        if (typeof pattern_idx === "undefined") { pattern_idx=0; }
        if (typeof distance === "undefined") { distance=0; }

        this.screen_idx = screen_idx;
        this.pattern_lev = pattern_lev;
        this.pattern_idx = pattern_idx;
        this.distance = distance;
    }
    return match_t;
})();

var grayImg;
var corners = [];
var matches = [];
var homo3x3, match_mask;
function initWebar() {
	grayImg = new jsfeat.matrix_t(width, height, jsfeat.U8_t | jsfeat.C1_t);
	//blurImg = new jsfeat.matrix_t(width, height, jsfeat.U8_t | jsfeat.C1_t);
	// you should use preallocated keypoint_t array
	for (var i = 0; i < size; i++) {
		corners[i] = new jsfeat.keypoint_t(0, 0, 0, 0);
		matches[i] = new match_t();
	}
	homo3x3 = new jsfeat.matrix_t(3, 3, jsfeat.F32C1_t);
	match_mask = new jsfeat.matrix_t(500, 1, jsfeat.U8C1_t);
}

function detecting(imageData) {
	jsfeat.imgproc.grayscale(imageData, width, height, grayImg);
	var count = detectKeypoints(grayImg, corners, 160);
	//console.log("keypoint size:" + count);
	//	drawKeypoints(corners, count);

	//	var cols = 32; // 32 Bytes / 256 BIT descriptor
	//	var rows = count; // descriptors stored per row
	scnDescs = new jsfeat.matrix_t(32, count, jsfeat.U8_t | jsfeat.C1_t);
	jsfeat.orb.describe(grayImg, corners, count, scnDescs);
	var candMatches = matchPattern(ptnDescs, scnDescs);
	return findTransform(matches, candMatches);
}

var canPause = true;
function touch(event) {
    var x = event.changedTouches[0].clientX;
    var y = event.changedTouches[0].clientY;
    if (canPause) {
        if (x >= ctrlImgLeft && x <= (ctrlImgLeft + 64) 
            && y >= ctrlImgTop && y <= (ctrlImgTop + 64)) {
            if (isPaused) {
                var imgPause = document.getElementById('img-ctrl-pause');
                imgPause.style.display = 'block';
                var imgPlay = document.getElementById('img-ctrl-play');
                imgPlay.style.display = 'none';
                webcam.play();
                isPaused = false;
                requestAnimationFrame(imageProcessing);
            } else {
                var imgPlay = document.getElementById('img-ctrl-play');
                imgPlay.style.display = 'block';
                var imgPause = document.getElementById('img-ctrl-pause');
                imgPause.style.display = 'none';
                webcam.pause();
                isPaused = true;

                orbit();
            }
            return;
        }
    }

    if (arType === 0)
    	canPause = touchPlayer(x, y);
    if (arType === 1)
    	captureFairy(x, y);
}

function drawGrayImage(context, imageData, grayImg) {
	var data_u32 = new Uint32Array(imageData.buffer);
    var i = size; //grayImg.cols * grayImg.rows;
    var pix = 0;
    var alpha = (0xff << 24);
    while(--i >= 0) {
       	pix = grayImg.data[i];
       	data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
    }
    context.putImageData(imageData, 0, 0); //???imageData.data
}

function detectKeypoints(image, corners, maxAllowed) {//var threshold = 10;
	//var border = 3;
	jsfeat.fast_corners.set_threshold(10);
	var count = jsfeat.fast_corners.detect(image, corners, 3);
	//var count = jsfeat.yape06.detect(image, corners, 17);

    // sort by score and reduce the count if needed
    if(count > maxAllowed) {
    	jsfeat.math.qsort(corners, 0, count - 1, function(a, b){return (b.score < a.score);});
    	count = maxAllowed;
    }
    /*
    // calculate dominant orientation for each keypoint
    for(var i = 0; i < count; i++) {
    	corners[i].angle = ic_angle(img, corners[i].x, corners[i].y);
    }
	*/
    return count;
}

function drawKeypoints(context, corners, count) {
    for (var i = 0; i < count; i++) {
		context.fillRect(corners[i].x, corners[i].y, 4, 4);
	}
}
		
// non zero bits count
function popcnt32(n) {
	n -= ((n >> 1) & 0x55555555);
	n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
	return (((n + (n >> 4))& 0xF0F0F0F)* 0x1010101) >> 24;
}

// naive brute-force matching. each on screen point is 
// compared to all pattern points to find the closest match
function matchPattern(ptnDescs, scnDescs) {
	//console.log("SCENE:" + scnDescs.rows + "PATTERN:" + ptnDescs.rows);
	var q_cnt = scnDescs.rows;
	var query_du8 = scnDescs.data;
	var query_u32 = scnDescs.buffer.i32; // cast to integer buffer
    var qd_off = 0;
    var qidx=0,lev=0,pidx=0,k=0;
    var num_matches = 0;

    for (qidx = 0; qidx < q_cnt; qidx++) {
        var best_dist = 256;
        var best_dist2 = 256;
        var best_idx = -1;
    //    var best_lev = -1;

    //  for(lev = 0; lev < num_train_levels; lev++) {
        //var lev_descr = ptnDescs[i];
        	var ld_cnt = ptnDescs.rows;
            var ld_i32 = ptnDescs.buffer.i32; // cast to integer buffer
            var ld_off = 0;

            for(pidx = 0; pidx < ld_cnt; pidx++) {
                var curr_d = 0;
                // our descriptor is 32 bytes so we have 8 Integers
                for(k=0; k < 8; ++k) {
                	curr_d += popcnt32( query_u32[qd_off+k]^ld_i32[ld_off+k] );
                }

                if(curr_d < best_dist) {
                	best_dist2 = best_dist;
                	best_dist = curr_d;
                    //best_lev = lev; 
                    best_idx = pidx;
                } else if(curr_d < best_dist2) {
                	best_dist2 = curr_d;
                }

                ld_off += 8; // next descriptor
            }
    //    }

        // filter out by some threshold\
        // var match_threshold = 48;
        /*if(best_dist < 48) {
            matches[num_matches].screen_idx = qidx;
        //    matches[num_matches].pattern_lev = best_lev;
            matches[num_matches].pattern_idx = best_idx;
            num_matches++;
        }*/
        // filter using the ratio between 2 closest matches
        if(best_dist < 0.8*best_dist2) {
            matches[num_matches].screen_idx = qidx;
            //    matches[num_matches].pattern_lev = best_lev;
            matches[num_matches].pattern_idx = best_idx;
            num_matches++;
        }

        qd_off += 8; // next query descriptor
    }
    return num_matches;
}

// estimate homography transform between matched points
var mm_kernel = new jsfeat.motion_model.homography2d();
function findTransform(matches, count) {
    //ransac params
    //var num_model_points = 4;
    //var reproj_threshold = 3;
    var ransac_param = new jsfeat.ransac_params_t(4, 3, 0.5, 0.99);

    var pattern_xy = [];
    var screen_xy = [];

    // construct correspondences
    for(var i = 0; i < count; ++i) {
        var m = matches[i];
        var s_kp = corners[m.screen_idx];
        var p_kp = ptnCorners[m.pattern_idx];
        pattern_xy[i] = {"x":p_kp.x, "y":p_kp.y};
        screen_xy[i] =  {"x":s_kp.x, "y":s_kp.y};
    }

    // estimate motion
    var ok = false;
    ok = jsfeat.motion_estimator.ransac(ransac_param, mm_kernel,
    	pattern_xy, screen_xy, count, homo3x3, match_mask, 1000);

    // extract good matches and re-estimate
    var good_cnt = 0;
    if(ok) {
        for(var i=0; i < count; ++i) {
            if(match_mask.data[i]) {
                pattern_xy[good_cnt].x = pattern_xy[i].x;
                pattern_xy[good_cnt].y = pattern_xy[i].y;
                screen_xy[good_cnt].x = screen_xy[i].x;
                screen_xy[good_cnt].y = screen_xy[i].y;
            	good_cnt++;
            }
        }

        // run kernel directly with inliers only
        mm_kernel.run(pattern_xy, screen_xy, homo3x3, good_cnt);
    } else {
        jsfeat.matmath.identity_3x3(homo3x3, 1.0);
    }

    return good_cnt;
}