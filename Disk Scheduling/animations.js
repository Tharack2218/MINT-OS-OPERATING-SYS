var anim_time = 0;
var anim_paused = true;
var anim_data = null;
var anim_min_canvas_height = 480;

var anim_track_size, anim_track_start, anim_seek_queue;

var anim_speed = 40;

var anim_colors = [
    'red',
    'orange',
    'green',
    'blue',
    'indigo',
    'violet'
];

function animSetConfig(config) {
    anim_track_size = config.trackSize;
    anim_track_start = config.trackStart;
    anim_track_direction = config.direction;
    anim_seek_queue = config.seekQueue;
	
    anim_data = [];
    
	anim_total_length = 0;
	
    var color_index = 0;
    for (var i in config.algorithms) {
        var algo_id = config.algorithms[i];
        
		var algo_info = algos[algo_id];
		
        var processed_queue = algo_info.func(anim_track_start, anim_track_size, anim_track_direction, anim_seek_queue);
        if (processed_queue != null) {
			var total_seek_distance = 0;
			var total_jump_distance = 0;
			
			var prev_pos = anim_track_start;
			var prev_minus = false;
			
			for (var j in processed_queue) {
				var distance = Math.abs(processed_queue[j].pos - prev_pos);
				
				if (processed_queue[j].index == -1 && prev_minus) {
					total_jump_distance += distance;
				}
				else {
					total_seek_distance += distance;
				}
				
				prev_minus = (processed_queue[j].index == -1);
				prev_pos = processed_queue[j].pos;
			}
			
			if (total_seek_distance > anim_total_length) {
				anim_total_length = total_seek_distance;
			}
			
            anim_data.push({
                id: algo_id,
                info: algo_info,
                queue: processed_queue,
                color: anim_colors[color_index++],
				total_seek_distance: total_seek_distance,
				total_jump_distance: total_jump_distance
            });  
        }
    }
	
	return anim_total_length;
}

function animSetTimeStep(timeStep) {
    animSetTime(timeStep / anim_speed);
}

function animSetTime(time) {
    anim_time = time;
}

function animSetPaused(paused) {
    anim_paused = paused;
}

function animInit() {
	window.requestAnimationFrame(update)
}

function update(cur_time_ms) {
    var w = animCanvas.width;
    var h = animCanvas.height;
    var cur_time = cur_time_ms / 1000;

    var dt = null;
    if (last_time) {
        dt = cur_time - last_time;
    } else {
        dt = 1 / 60;
    }

    context.clearRect(0, 0, w, h);
	
    render(anim_time, dt, w, h);

    if (!anim_paused) {
		// Update animation progress slider steps
        // Step X = anim_time * anim_speed
        updateAnimProgressSliderValue(parseInt(anim_time * anim_speed));
        
        // Force auto-scroll if not paused
        handleAutoScrollCanvas(true);
		
        anim_time += dt;
    }
    
    // Execute auto-scroll if required
    handleAutoScrollCanvas();
    
    last_time = cur_time;

    window.requestAnimationFrame(update);
}

//
//
//
function render(t, dt, canvas_width, canvas_height) {
    var draw_tasks = [];
	
    var radius_initial = 4;
    var padding = 20;
    var line_y = padding * 3.5;
    var new_canvas_height = 480;
    var segment_width = (canvas_width - 2 * padding) / (anim_track_size - 1);
	
	pushStyle(draw_tasks, 'black');
	
	pushRect(draw_tasks, 0, 0, canvas_width, canvas_height);
	
	// draw frametime counter
	pushFont(draw_tasks, '11px Courier New');
	pushTextAlign(draw_tasks, 'left');
	pushTextBaseline(draw_tasks, 'top');
	pushText(draw_tasks, round(dt * 1000, 2) + "ms", 0, 0);
	
	var legend_x = padding;
	var legend_y = padding;
	
    pushTextBaseline(draw_tasks, 'middle');
	
	for (var i in anim_data) {
		var algo_data = anim_data[i];
		
		if (i == 4) {
			legend_x = padding;
			legend_y += 30;
			line_y += 30;
		}
		
		pushStyle(draw_tasks, algo_data.color);
		pushRect(draw_tasks, legend_x, legend_y, 8, 8, 'fill');
		
		legend_x += 8 + 4;
		
		var str = algo_data.info.short_name;
		str += ' (';
		str += algo_data.total_seek_distance;
		
		if (algo_data.total_jump_distance > 0) {
			str += ', ';
			str += algo_data.total_jump_distance;
		}
		
		str += ')';
		
		pushStyle(draw_tasks, 'black');
		pushText(draw_tasks, str, legend_x, legend_y + 4);
		
		legend_x += 128;
	}
	
	// draw main track line
    pushLine(draw_tasks, padding, line_y, canvas_width - padding, line_y);
	
    pushTextAlign(draw_tasks, 'center');
	pushTextBaseline(draw_tasks, 'bottom');
	
    for (var track_index = 0; track_index < anim_track_size; track_index++) {
        var notch_x = padding + track_index * segment_width;
		
		var is_in_queue = false;
		for (var i in anim_seek_queue) {
			if (anim_seek_queue[i].pos == track_index) {
				is_in_queue = true;
				break;
			}
		}
		
		// draw index for relevant track positions
		if (track_index == 0 || track_index == (anim_track_size - 1) || is_in_queue) {
			pushText(draw_tasks, track_index.toString(), notch_x, line_y - padding / 2 - 2);
		}
		
		// draw track notch
		pushLine(draw_tasks, notch_x, line_y - padding * 0.4, notch_x, line_y + padding * 0.4);
    }
	
	var start_x = padding + anim_track_start * segment_width;
	var start_y = line_y + padding;
	
	pushCircle(draw_tasks, start_x, start_y, radius_initial, 'fill');
	
	var progress = t * anim_speed;
	
    for (var algo_index in anim_data) {
        var node_y = start_y;
        
        var prev_node_pos = anim_track_start;
        
        var prev_x = start_x;
        var prev_y = node_y;
            
        var radius_incr = 2;
        var radius = radius_initial;
        
        var algo_data = anim_data[algo_index];
        
		var prev_minus = false;
		
		var total_full_distance = 0;
		
        for (var i in algo_data.queue) {
			if (total_full_distance > progress) {
				break;
			}
			
			var item = algo_data.queue[i];
			var distance = Math.abs(item.pos - prev_node_pos);
			var sign = Math.sign(item.pos - prev_node_pos);
			
			var is_horizontal = (item.index == -1 && prev_minus);
			
			var partial_distance = progress - total_full_distance;
			if (partial_distance < 0) {
				partial_distance = 0;
			}
			else if (partial_distance > distance) {
				partial_distance = distance;
			}
			
			if (is_horizontal) {
				partial_distance = distance;
			}
				
            node_y += 0.15 * segment_width * partial_distance;
            
            if (node_y > new_canvas_height) {
				new_canvas_height = node_y;
			}
            
            if (prev_node_pos == item.pos && !is_horizontal) {
                radius += radius_incr;
            }
            else {
                radius = radius_initial;
            }
            
            var node_x = padding + (prev_node_pos + sign * partial_distance) * segment_width;
            
			pushStyle(draw_tasks, algo_data.color);
			
			if (is_horizontal) {
				node_y = prev_y;
				
				pushLineDash(draw_tasks, [5, 5]);
			}
			else {
				pushLineDash(draw_tasks, []);
			}
			
			if (prev_node_pos != item.pos) {
				pushLine(draw_tasks, prev_x, prev_y, node_x, node_y);
			}
			
			if (!is_horizontal || prev_node_pos != item.pos) {
				pushLineDash(draw_tasks, []);
				
				if (partial_distance < distance) {
					var needle_size = 10;
					pushNeedle(draw_tasks, node_x - needle_size / 2, node_y, needle_size, needle_size, 'fill');
				}
				else {
					pushCircle(draw_tasks, node_x, node_y, radius);
				}
			}
			
			if (!is_horizontal) {
				total_full_distance += distance;
			}
			
            prev_node_pos = item.pos;
			
			prev_minus = (item.index == -1);
            
            prev_x = node_x;
            prev_y = node_y;
        }
    }
    
    if (new_canvas_height > anim_min_canvas_height) {
        animCanvas.height = new_canvas_height + 50;
    } else {
        animCanvas.height = anim_min_canvas_height;
    }
	
	for (var i in draw_tasks) {
		var task = draw_tasks[i];
		
		switch (task.type) {
			case 'style': {
				context.strokeStyle = task.style;
				context.fillStyle = task.style;
				
				break;
			}
			
			case 'text': {
				context.fillText(task.text, task.x, task.y);
				
				break;
			}
			
			case 'align': {
				context.textAlign = task.align;
				
				break;
			}
			
			case 'baseline': {
				context.textBaseline = task.baseline;
				
				break;
			}
			
			case 'font': {
				context.font = task.font;
				
				break;
			}
			
			case 'circle': {
				context.beginPath();
				context.ellipse(task.x, task.y, task.radius, task.radius, 0, 0, 2 * Math.PI);
				
				if (task.mode == 'fill') {
					context.fill();
				}
				else {
					context.stroke();
				}
				
				break;
			}
			
			case 'line': {
				context.beginPath();
				context.moveTo(task.ax, task.ay);
				context.lineTo(task.bx, task.by);
	
				if (task.mode == 'fill') {
					context.fill();
				}
				else {
					context.stroke();
				}
				
				break;
			}
			
			case 'line_dash': {
				context.setLineDash(task.segments);
				
				break;
			}
			
			case 'rect': {
				if (task.mode == 'fill') {
					context.fillRect(task.x, task.y, task.w, task.h);
				}
				else {
					context.strokeRect(task.x, task.y, task.w, task.h);
				}
				
				break;
			}
			
			case 'needle': {
				context.beginPath();
				context.moveTo(task.x + task.w / 2, task.y);
				context.lineTo(task.x + task.w, task.y + task.h);
				context.lineTo(task.x, task.y + task.h);
				context.closePath();
				
				if (task.mode == 'fill') {
					context.fill();
				}
				else {
					context.stroke();
				}
				
				break;
			}
		}
	}
}

function pushStyle(draw_tasks, style) {
	draw_tasks.push({
		type: 'style',
		style: style
	});
}

function pushText(draw_tasks, text, x, y) {
	draw_tasks.push({
		type: 'text',
		x: x,
		y: y,
		text: text
	});
}

function pushTextAlign(draw_tasks, align) {
	draw_tasks.push({
		type: 'align',
		align: align
	});
}

function pushTextBaseline(draw_tasks, baseline) {
	draw_tasks.push({
		type: 'baseline',
		baseline: baseline
	});
}

function pushFont(draw_tasks, font) {
	draw_tasks.push({
		type: 'font',
		font: font
	});
}

function pushCircle(draw_tasks, x, y, radius, mode) {
	draw_tasks.push({
		type: 'circle',
		mode: mode,
		x: x,
		y: y,
		radius: radius
	});
}

function pushLine(draw_tasks, ax, ay, bx, by) {
	draw_tasks.push({
		type: 'line',
		ax: ax,
		ay: ay,
		bx: bx,
		by: by
	});
}

function pushLineDash(draw_tasks, segments) {
	draw_tasks.push({
		type: 'line_dash',
		segments: segments
	});
}

function pushRect(draw_tasks, x, y, w, h, mode) {
	draw_tasks.push({
		type: 'rect',
		mode: mode,
		x: x,
		y: y,
		w: w,
		h: h
	});
}

function pushNeedle(draw_tasks, x, y, w, h, mode) {
	draw_tasks.push({
		type: 'needle',
		mode: mode,
		x: x,
		y: y,
		w: w,
		h: h
	});
}