function fcfs(arr) {
	var result = arr.slice();
	return result;
}

function sstf(start, direction, arr) {
    var result = [];
    var ordered = arr.slice();
    ordered.sort(function (a, b) {
        return a.pos - b.pos;
    });
    var i=0;
    for (var index in arr) {
        if (start<ordered[index].pos)
        {
            break;
        }
        i++;
    }
    var prev = start;
    while (ordered.length!=0) {
        if (i<=0) {
            result.push(ordered[0]);
            ordered.splice(0,1);
        }
        else if (i>=ordered.length) {
            result.push(ordered[ordered.length-1]);
            ordered.splice(ordered.length-1,1);
            i--;
        }
        else if ((prev-ordered[i-1].pos)<=(ordered[i].pos-prev-direction)) {
            result.push(ordered[i-1]);
            prev = ordered[i-1].pos;
            ordered.splice(i-1,1);
            i--;
			direction = 0;
        }
        else {
            result.push(ordered[i]);
            prev = ordered[i].pos;
            ordered.splice(i,1);
			direction = 1;
        }
    }
    return result;
}

function scan(start, size, direction, arr) {
    var result = [];
    var ordered = arr.slice();
    ordered.sort(function (a, b) {
        return a.pos - b.pos;
    });
    var i=0;
    for (var index in arr) {
        if (start<ordered[index].pos+(0.1*(direction)))
        {
            break;
        }
        i++;
    }
    i+=direction;
    var prev = start;
    while (ordered.length!=0) {
        if (i<=0) {
            if (i==0) {
                result.push({
                    "index": -1,
                    "pos": 0
                })
                i--;
            }
            else {
                result.push(ordered[0]);
                ordered.splice(0,1);
            }
        }
        else if (i>=ordered.length) {
            if (i!=ordered.length+1) {
                result.push(ordered[ordered.length-1]);
                ordered.splice(ordered.length-1,1);
				if (!direction) i--;
            }
            else {
                result.push({
                    "index": -1,
                    "pos": size-1
                })
                i++;
            }
        }
        else { //if ((prev-ordered[i-1].pos)<(ordered[i].pos-prev)) 
            result.push(ordered[i-1]);
            prev = ordered[i-1].pos;
            ordered.splice(i-1,1);
            i += direction-1;
        }
/*        else {
            result.push(ordered[i]);
            prev = ordered[i].pos;
            ordered.splice(i,1);
        }*/
    }
    return result;
}

function cscan(start, size, direction, arr) {
    var result = [];
    var ordered = arr.slice();
    ordered.sort(function (a, b) {
        return a.pos - b.pos;
    });
    var i=0;
    for (var index in arr) {
        if (start<ordered[index].pos+(0.1*(direction)))
        {
            break;
        }
        i++;
    }
    i+=direction;
    var prev = start;
    while (ordered.length!=0) {
        if (i<=0) {
            if (i==0) {
                result.push({
                    "index": -1,
                    "pos": 0
                })
                if (!direction) i=ordered.length+1; else i--;
            }
            else {
                result.push(ordered[0]);
                ordered.splice(0,1);
            }
        }
        else if (i>=ordered.length) {
            if (i!=ordered.length+1) {
                result.push(ordered[ordered.length-1]);
                ordered.splice(ordered.length-1,1);
				if (!direction) i--;
            }
            else {
                result.push({
                    "index": -1,
                    "pos": size-1
                })
                if (direction) i=0; else i++;
            }
        }
        else { //if ((prev-ordered[i-1].pos)<(ordered[i].pos-prev)) 
            result.push(ordered[i-1]);
            prev = ordered[i-1].pos;
            ordered.splice(i-1,1);
            i += direction-1;
        }
/*        else {
            result.push(ordered[i]);
            prev = ordered[i].pos;
            ordered.splice(i,1);
        }*/
    }
    return result;
}

function look(start, size, direction, arr) {
    var result = [];
    var ordered = arr.slice();
    ordered.sort(function (a, b) {
        return a.pos - b.pos;
    });
    var i=0;
    for (var index in arr) {
        if (start<ordered[index].pos+(0.1*(direction)))
        {
            break;
        }
        i++;
    }
    i+=direction;
    var prev = start;
    while (ordered.length!=0) {
        if (i<=0) {
            result.push(ordered[0]);
            ordered.splice(0,1);
        }
        else if (i>=ordered.length) {
            result.push(ordered[ordered.length-1]);
            ordered.splice(ordered.length-1,1);
        }
        else { //if ((prev-ordered[i-1].pos)<(ordered[i].pos-prev)) 
            result.push(ordered[i-1]);
            prev = ordered[i-1].pos;
            ordered.splice(i-1,1);
            i += direction-1;
        }
/*        else {
            result.push(ordered[i]);
            prev = ordered[i].pos;
            ordered.splice(i,1);
        }*/
    }
    return result;
}

function clook(start, size, direction, arr) {
    var result = [];
    var ordered = arr.slice();
    ordered.sort(function (a, b) {
        return a.pos - b.pos;
    });
    var i=0;
    for (var index in arr) {
        if (start<ordered[index].pos+(0.1*(direction)))
        {
            break;
        }
        i++;
    }
    i+=direction;
    var prev = start;
    while (ordered.length!=0) {
        if (i<=0) {
            if (i==0) {
                result.push({
                    "index": -1,
                    "pos": prev
                })
				//ordered.splice(0,1);
				prev = ordered[ordered.length-1].pos;
                if (!direction) i=ordered.length+1; else i--;
            }
            else {
				prev = ordered[0].pos;
                result.push(ordered[0]);
                ordered.splice(0,1);
            }
        }
        else if (i>=ordered.length) {
            if (i!=ordered.length+1) {
				prev = ordered[ordered.length-1].pos;
                result.push(ordered[ordered.length-1]);
                ordered.splice(ordered.length-1,1);
				if (!direction) i--;
            }
            else {
                result.push({
                    "index": -1,
                    "pos": prev
                })
				//ordered.splice(ordered.length-1,1);
				prev = ordered[0].pos;
                if (direction) i=0; else i++;
            }
        }
        else { //if ((prev-ordered[i-1].pos)<(ordered[i].pos-prev)) 
            result.push(ordered[i-1]);
            prev = ordered[i-1].pos;
            ordered.splice(i-1,1);
            i += direction-1;
        }
/*        else {
            result.push(ordered[i]);
            prev = ordered[i].pos;
            ordered.splice(i,1);
        }*/
    }
    return result;
}

var algos = {
	fcfs: {
		name: 'First Come-First Serve (FCFS)',
		short_name: 'FCFS',
		func: function (track_start, track_size, track_direction, seek_queue) {
			return fcfs(seek_queue);
		}
	},
	
	sstf: {
		name: 'Shortest Seek Time First (SSTF)',
		short_name: 'SSTF',
		func: function (track_start, track_size, track_direction, seek_queue) {
            return sstf(track_start, track_direction, seek_queue);
		}
	},
	
	scan: {
		name: 'Elevator (SCAN)',
		short_name: 'SCAN',
		func: scan
	},
	
	cscan: {
		name: 'Circular SCAN (C-SCAN)',
		short_name: 'C-SCAN',
		func: cscan
	},
	
	look: {
		name: 'LOOK',
		short_name: 'LOOK',
		func: look
	},
	
	clook: {
		name: 'C-LOOK',
		short_name: 'C-LOOK',
		func: clook
	}
};