var velocity = [Math.floor(Math.random()*5+1), Math.floor(Math.random()*5)]; //Random velocity
//Velocity stored as an array of [speed in x direction, speed in y direction]
var x = 0; //Start position set to (0, 0). (This is the top-left corner)
var y = 0;
var lastx=0;
var lasty=0;
//3 canvases are used. One for the ball, another for the trail and a third for the lines and goal
//This is because the ball needs to be erased, meaning it must be on a separate canvas
//The trail's opacity must also be changed independently from everything else, meaning it also needs it's own canvas
var can;
var con;
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
var ballColourForm;
var goalColourForm;
var lineColourForm;
var trailColourForm;
var trailOpacityForm;

$(function(){ //init function. The page will break if Jquery can't find the HTML elements
	//To counter this, any operations that require HTML elements aren't performed until the HTML has loaded
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
	
	ballColourForm = $('#ballColourForm')[0];
	lineColourForm = $('#lineColourForm')[0];
	goalColourForm = $('#goalColourForm')[0];
	trailColourForm = $('#trailColourForm')[0];
	trailOpacityForm = $('#trailOpacityForm')[0];
	
	goalColourForm.value = '#00FF00';
	ballColourForm.value = '#000000';
	lineColourForm.value = '#FF0000';
	
	if(localStorage){
		goalColourForm.value = JSON.parse(localStorage.getItem("goalColour"));
		trailSettings[1] = JSON.parse(localStorage.getItem('trailColour'));
		trailColourForm.value = trailSettings[1];
		trailSettings[2] = JSON.parse(localStorage.getItem('trailOpacity'));
		trailOpacityForm.value = trailSettings[2];
		ballColourForm.value = JSON.parse(localStorage.getItem('ballColour'));
		lineColourForm.value = JSON.parse(localStorage.getItem('lineColour'));
	}
	
	lineColourForm.onchange = function(){
		localStorage.setItem('lineColour', JSON.stringify(lineColourForm.value));
	}
	
	ballColourForm.onchange = function(){
		localStorage.setItem('ballColour', JSON.stringify(ballColourForm.value));
	}
	
	goalColourForm.onchange = function(){
		localStorage.setItem("goalColour", JSON.stringify(goalColourForm.value));
		con3.beginPath();
		con3.arc(goal[0], goal[1], 10, 0, 2 * Math.PI);
		con3.fillStyle = goalColourForm.value;
		con3.fill();
		con3.closePath();
	}
	
	console.log(trailColourForm.value);
	trailColourForm.onchange = function(){
		trailSettings[1] = trailColourForm.value;
		localStorage.setItem('trailColour', JSON.stringify(trailSettings[1]));
	}
	
	
	trailOpacityForm.onchange = function(){
		trailSettings[2] = trailOpacityForm.value;
		localStorage.setItem('trailOpacity', JSON.stringify(trailSettings[2]));
	}
	
	setInterval(drawBall, 15); //This command makes the entire game work. Every [15] milliseconds, run the script to advance a time period
	//[15] can be substituted for a smaller number to 'speed up time'
	
	goal = [(window.innerWidth-4)/2 + Math.floor(Math.random()*(window.innerWidth-4)/4), (window.innerHeight*0.8-4)/2 - Math.floor(Math.random()*(window.innerHeight*0.8-4)/4)]
	//the position of the goal is random in the top right quarter of the screen
	con3.beginPath();
	con3.arc(goal[0], goal[1], 10, 0, 2 * Math.PI);
	con3.fillStyle = goalColourForm.value;
	con3.fill();
	con3.closePath();
	
	//Adding event listeners to draw lines on the canvas
	
	can.onmousedown = function(e){
		if(isDown){
			return;
		}
		lineStart[0] = e.x-this.offsetLeft;
		lineStart[1] = e.y-this.offsetTop;
		isDown = true;
	}
	
	can.touchstart = function(){
		event.preventDefault();
		if(isDown){
			return;
		}
		lineStart[0] = e.x-this.offsetLeft;
		lineStart[1] = e.y-this.offsetTop;
		isDown = true;
	}

	can.touchend = function(){
		event.preventDefault();
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
		if(event.which == 32){
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
		//If the line is drawn left to right
		if(lineStart[1] <= lineFinish[1]){
			//if the line is drawn top to bottom
			newLine = [lineFinish[0], lineFinish[1], lineStart[0], lineStart[1]];
		}
		else{
			//if the line is drawn bottom to top
			newLine = [lineFinish[0], lineStart[1], lineStart[0], lineFinish[1]];
		}
	}
	else{
		newLine = [lineStart[0], lineStart[1], lineFinish[0], lineFinish[1]];
	}
	lines.push(newLine);
	con3.beginPath();
	con3.moveTo(lineStart[0], lineStart[1]);
	con3.lineTo(lineFinish[0], lineFinish[1]);
	con3.strokeStyle = lineColourForm.value;
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
		alert('You win! That\'s numberwang!');
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
	velocity[1] += 0.125; 							//Apply acceleration due to gravity
	
	con.clearRect(0, 0, window.innerWidth-1, window.innerHeight*0.8-4);	//Clear the canvas to draw the ball in it's new location
	 									//I can just clear the entire canvas as the ball is on
										//a separate canvas to lines, the goal and the trail
	//con.save();
	//con.globalCompositeOperation = 'destination-out';
	//con.beginPath();
	//con.arc(lastx, lasty, 11, 0, 2 * Math.PI, false);
	//con.fill();
	//con.restore();
	con2.beginPath();							//Draw the trail from the ball's last position to the
	con2.moveTo(lastx, lasty);						//ball's current position
	con2.lineTo(x, y);
	con2.strokeStyle = trailSettings[1];					//Getting settings from an array to be up to date with
	con2.globalAlpha = trailSettings[2];					//settings from the local storage
	con2.stroke();
	con2.closePath();
	lastx=x;								//Store the current position as the last position ready
	lasty=y;								//for the next iteration
	nextx = x + velocity[0];
	nexty = y + velocity[1];
										//Go through each line the user's drawn and check if
										//the line between the ball's current and next position
										//crosses over any
	for(var i = 0; i < lines.length; i++){
		if(intersects(lines[i][0], lines[i][1], lines[i][2], lines[i][3], x, y, nextx, nexty)){
			var lineGrad = Math.abs(lines[i][1]-lines[i][3])/(lines[i][0]-lines[i][2]);
			var lineAngle = (-1)/Math.atan(lineGrad);
			console.log('Reflect with angle ' + lineAngle);
										//travelling +x and hits top of line, rotate 2pi+2theta
										//travelling -x and hits top of line, rotate 2pi-2theta
										//travelling +x and hits bottom of line, rotate 2pi-2theta
										//travelling -x and hits bottom of line, rotate 2pi+2theta
			var bounceAngle = findVectorAngle([velocity[0], velocity[1]], [lines[i][0]-lines[i][2], lines[i][1]-lines[i][3]]);
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
	x += velocity[0];							//Move the ball once the velocity has been updated
	y += velocity[1];							//Uses v = u + at from kinematics
	con.beginPath();							//Then draw the ball in it's new location
	con.arc(x, y, 10, 0, Math.PI*2);
	con.fillStyle = ballColourForm.value;
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
