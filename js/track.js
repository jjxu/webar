var curr_img_pyr, prev_img_pyr, prev_xy, curr_xy, point_status, point_count, track3x3;
var TPS = 16;
var prev_pt = [];
var curr_pt = [];
var track_count = 0;

function initTrack(imageData, corners, width, height) {
    track3x3 = new jsfeat.matrix_t(3, 3, jsfeat.F32C1_t);

    curr_img_pyr = new jsfeat.pyramid_t(3);
    prev_img_pyr = new jsfeat.pyramid_t(3);
    curr_img_pyr.allocate(width, height, jsfeat.U8_t|jsfeat.C1_t);
    prev_img_pyr.allocate(width, height, jsfeat.U8_t|jsfeat.C1_t);
    
    jsfeat.imgproc.grayscale(imageData, width, height, curr_img_pyr.data[0]);
    curr_img_pyr.build(curr_img_pyr.data[0], true);

    point_status = new Uint8Array(TPS);
    prev_xy = new Float32Array(TPS * 2);
    curr_xy = new Float32Array(TPS * 2);
    var i = 0, j = 0;
    while (i < TPS && j < corners.length) {
        if (selectWithDistance(i, corners[j])) {
            curr_xy[i << 1] = corners[j].x;
            curr_xy[(i << 1) + 1] = corners[j].y;
            prev_pt[i] = {'x':0, 'y':0};
            curr_pt[i] = {'x':0, 'y':0};
            i++;
        }
        j++;
    }
    point_count = i;
    
    console.log("init tracking");
    track_count = 0;
    return true;
}

function selectWithDistance(count, corner) {
    for (var i = 0; i < count; i++) {
        var xdist = curr_xy[i << 1] - corner.x;
        var ydist = curr_xy[(i << 1) + 1] - corner.y;
        var dist = Math.abs(xdist) + Math.abs(ydist); //Manhattan Distance
      //  var dist = Math.sqrt(xdist * xdist + ydist * ydist); //Euclidean Distance
        if (dist < 16)
            return false;
    }
    return true;
}

var homo_kernel = new jsfeat.motion_model.homography2d();
function tracking(imageData, context) {
    var _pt_xy = prev_xy;
    prev_xy = curr_xy;
    curr_xy = _pt_xy;
    var _pyr = prev_img_pyr;
    prev_img_pyr = curr_img_pyr;
    curr_img_pyr = _pyr;

    jsfeat.imgproc.grayscale(imageData, width, height, curr_img_pyr.data[0]);
    curr_img_pyr.build(curr_img_pyr.data[0], true);

    //var win_size = 20;
    //var max_iterations = 30;
    //var epsilon = 0.01;
    //var min_eigen = 0.001;
    jsfeat.optical_flow_lk.track(prev_img_pyr, curr_img_pyr, prev_xy, curr_xy, point_count, 20, 30, point_status, 0.01, 0.001);

    //prune_oflow_points
    var j = 0, i = 0;
    for(; i < point_count; i++) {
        if(point_status[i] == 1) {
            if(j < i) {
                curr_xy[j<<1] = curr_xy[i<<1];
                curr_xy[(j<<1) + 1] = curr_xy[(i<<1) + 1];
            }
            j++;
        }
    }
    point_count = j;
    //console.log(">>" + point_count);

    if (point_count >= 8) {
        track_count++;
         // construct correspondences
        for(i = 0, j = 0; i < (point_count << 1); i += 2, j++) {
            prev_pt[j].x = prev_xy[i];
            prev_pt[j].y = prev_xy[i + 1];
            curr_pt[j].x = curr_xy[i];
            curr_pt[j].y = curr_xy[i + 1];
            //prev_pt[i] = {'x':prev_xy[i << 1], 'y':prev_xy[(i << 1) + 1]};
            //curr_pt[i] = {'x':curr_xy[i << 1], 'y':curr_xy[(i << 1) + 1]};
        }

        homo_kernel.run(prev_pt, curr_pt, track3x3, point_count);
        /*
        arctx.fillStyle = "green";
        for (var i = 0; i < point_count; i++) {
            arctx.fillRect(curr_pt[i].x, curr_pt[i].y, 4, 4);
        }*/
    //    drawProgress(context);
    }
    return point_count;
}
