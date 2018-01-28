var can;
var con;
var velocity = [Math.floor(Math.random()*5+1), Math.floor(Math.random()*5)];
//velocity = [20, 0];
var x = 0;
var y = 0;
var lastx=0;
var lasty=0;
var con2;
var can2;
var can3;
var con3;
var linesDrawn = [];
var isDown = false;
var lineStart = [0, 0];
var lineFinish = [0, 0];
var lines = [];
var pointsCovered = [];
var boost = false;
var goal = [];
var trailSettings = ["solid", '#000000', '0.2'];
var goalSettings = [true];

$(function(){
	console.log('init fired');
	can = $('#canvas1')[0];
	can2 = $('#canvas2')[0];
	can3 = $('#canvas3')[0];
	can.height = window.innerHeight*0.8-4;
	can.width = window.innerWidth-4;
	can2.height = window.innerHeight*0.8-4;
	can2.width = window.innerWidth-4;.8-4;
	can3.height = window.innerHeight*0.8-4;
	can3.width = window.innerWidth-4;
	con = can.getContext('2d');
	con2 = can2.getContext('2d');
	con3 = can3.getContext('2d');
	
	var trailColourForm = $('#trailColourForm')[0];
	console.log(trailColourForm.value);
	trailColourForm.onchange = function(){
		trailSettings[1] = trailColourForm.value;
	}
	
	var trailOpacityForm = $('#trailOpacityForm')[0];
	trailOpacityForm.onchange = function(){
		trailSettings[2] = trailOpacityForm.value;
		console.log(trailSettings[2]);
		con2.globalAlpha = trailSettings[2];
	}
	
	setInterval(drawBall, 15);
	
	goal = [(window.innerWidth-4)/2 + Math.floor(Math.random()*(window.innerWidth-4)/4), (window.innerHeight*0.8-4)/2 - Math.floor(Math.random()*(window.innerHeight*0.8-4)/4)]
	con3.beginPath();
	con3.arc(goal[0], goal[1], 10, 0, 2 * Math.PI);
	con3.fillStyle = 'rgba(0, 255, 0, 1)';
	con3.fill();
	con3.closePath();
	
	can.onmousedown = function(e){
		if(isDown){
			return;
		}
		lineStart[0] = e.x-this.offsetLeft;
		lineStart[1] = e.y-this.offsetTop;
		isDown = true;
	}
	
	can.touchstart = function(e){
		preventDefault();
		if(isDown){
			return;
		}
		lineStart[0] = e.x-this.offsetLeft;
		lineStart[1] = e.y-this.offsetTop;
		isDown = true;
	}

	can.touchend = function(e){
		preventDefault();
		if(!isDown){
			return;
		}
		isDown = false;
		lineFinish[0] = e.x-this.offsetLeft;
		lineFinish[1] = e.y-this.offsetTop;
		drawLine(lineStart, lineFinish);
	}
	
	can.onmouseup = function(e){
		if(!isDown){
			return;
		}
		isDown = false;
		lineFinish[0] = e.x-this.offsetLeft;
		lineFinish[1] = e.y-this.offsetTop;
		drawLine(lineStart, lineFinish);
	}
	
	can.onkeydown = function(event){
		console.log('space pressed');
		if(event.whice == 32){
			boost = true;
		}
	}
	
	can.onkeyup = function(event){
		if(event.which == 32){
			boost = false;
		}
	}

});

function drawLine(lineStart, lineFinish){
	var newLine;
	if(lineStart[0] <= lineFinish[0]){
		newLine = [lineFinish[0], lineFinish[1], lineStart[0], lineStart[1]];
	}
	else{
		newLine = [lineStart[0], lineStart[1], lineFinish[0], lineFinish[1]];
	}
	lines.push(newLine);
	con3.beginPath();
	con3.moveTo(lineStart[0], lineStart[1]);
	con3.lineTo(lineFinish[0], lineFinish[1]);
	con3.strokeStyle = '#FF0000';
	con3.stroke();
	con3.closePath();
	var grad = (lineFinish[1]-lineStart[1])/(lineFinish[0]-lineStart[0]);
	var angle = (-1)/Math.atan(grad);
	if(lineStart[0] >= lineFinish[0]){
		for(var i = lineFinish[0]; i < lineStart[0]; i++){
			pointsCovered.push([i, Math.abs(Math.floor(grad*i+lineStart[1])), angle]);
		}
	}
	else{
		for(var i = lineStart[0]; i < lineFinish[0]; i++){
			pointsCovered.push([i, Math.abs(Math.floor(grad*i+lineStart[1])), angle]);
		}
	}
	//console.log('line drawn');
	//for(var i = 0; i < pointsCovered.length; i ++){
	//	console.log(pointsCovered[i][0] + ", " + pointsCovered[i][1] + ". " + pointsCovered[i][2]);
	//}
}

function drawBall(){
	var distanceToGoal = Math.floor(Math.sqrt(Math.pow(x-goal[0], 2) + Math.pow(y-goal[1], 2)));
	//console.log('Distance to goal: ' + distanceToGoal);
	if(distanceToGoal < 10){
		alert('You win! You found the goal!');
		//if(localstorage)
		window.location.reload();
	}
	if(velocity[0] > 6 || boost){
		velocity[0]=6;
	}
	if(velocity[1] > 15 || boost){
		velocity[1]=15;
	}
	if(x >= window.innerWidth-4){
		//velocity[0]+=0.0125;
		velocity[0]=-velocity[0];
		x = window.innerWidth-4;
	}
	else if(x < 0){
		//velocity[0]+=0.0125;
		velocity[0]=-velocity[0];
		x=0;
	}
	if(y >= window.innerHeight*0.8-4){
		velocity[1]-=0.125;
		velocity[1]=-velocity[1];
		y = window.innerHeight*0.8-4;
	}
	else if(y < 0){
		y=0;
		velocity[1]=-velocity[1];
	}
	//if(y < (window.innerHeight*0.8-4)/2){
		velocity[1] += 0.125;
	//}
	//else{
	//	velocity[1] -= 0.025;
	//}
	con.save();
	con.globalCompositeOperation = 'destination-out';
	con.beginPath();
	con.arc(lastx, lasty, 11, 0, 2 * Math.PI, false);
	con.fill();
	con.restore();
	con2.beginPath();
	con2.moveTo(lastx, lasty);
	con2.lineTo(x, y);
	con2.strokeStyle = trailSettings[1];
	con2.stroke();
	con2.closePath();
	lastx=x;
	lasty=y;
	nextx = x + velocity[0];
	nexty = y + velocity[1];
	for(var i = 0; i < lines.length; i++){
		if(intersects(lines[i][0], lines[i][1], lines[i][2], lines[i][3], x, y, nextx, nexty)){
			console.log('Crossover!');
			var lineGrad = Math.abs(lines[i][1]-lines[i][3])/(lines[i][0]-lines[i][2]);
			var lineAngle = (-1)/Math.atan(lineGrad);
			console.log('Reflect with angle ' + lineAngle);
			//travelling +x and hits top of line, rotate 2pi+2theta
			//travelling -x and hits top of line, rotate 2pi-2theta
			//travelling +x and hits bottom of line, rotate 2pi-2theta
			//travelling -x and hits bottom of line, rotate 2pi+2theta
			var bounceAngle = findVectorAngle([velocity[0], velocity[1]], [lines[i][0]-lines[i][2], lines[i][1]-lines[i][3]]);
			// if(bounceAngle < Math.PI/4){
				// bounceAngle = Math.PI/2-bounceAngle;
			// }
			bounceAngle*=2;
			if(velocity[0] > 0){
				if(velocity[1] > 0){
					bounceAngle = 2*Math.PI - bounceAngle;
				}
				else{
					bounceAngle = 2*Math.PI + bounceAngle;
				}
			}
			else{
				if(velocity[1] <= 0){
					bounceAngle = 2*Math.PI + bounceAngle;
				}
				else{
					bounceAngle = 2*Math.PI - bounceAngle;
				}
			}
			for(var ii = 0; ii < 2; ii++){
				if(velocity[ii]>0){
					velocity[ii]++;
				}
				else{
					velocity[ii]--;
				}
			}
			var oldVel = velocity;
			//rotate anti-clockwise
			velocity[0] = oldVel[0]*Math.cos(bounceAngle)+(-1)*oldVel[1]*Math.sin(bounceAngle);
			velocity[1] = oldVel[0]*Math.sin(bounceAngle)+oldVel[1]*Math.cos(bounceAngle);
		}
	}
	x += velocity[0];
	y += velocity[1];
	con.beginPath();
	con.arc(x, y, 10, 0, Math.PI*2);
	con.fill();
	con.closePath();
};

function findVectorAngle(velocityVector, lineVector){
	var normalLineVector = [lineVector[0]*Math.cos(Math.PI/2)+(-1)*lineVector[1]*Math.sin(Math.PI/2), lineVector[0]*Math.sin(Math.PI/2)+lineVector[1]*Math.cos(Math.PI/2)];
	var dotProduct = velocityVector[0]*lineVector[0]+velocityVector[1]*lineVector[1];
	var vectorAMag = Math.sqrt(Math.pow(velocityVector[0], 2)+Math.pow(velocityVector[1], 2));
	var vectorBMag = Math.sqrt(Math.pow(lineVector[0], 2)+Math.pow(lineVector[1], 2));
	var cosTheta = dotProduct/(vectorAMag*vectorBMag);
	var theta = Math.acos(cosTheta);
	console.log('Angle: ' + theta);
	// if(theta < 0.71 || theta > -0.71 || theta < 2.4){
		// console.log('Throughbug found, changing angle');
		// theta -= Math.PI/2;
		// console.log('New angle: ' + theta);
	// }
	return theta;
}

function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};