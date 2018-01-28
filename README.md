# Bouncer
Project for Global game jam 2018, try to bounce the ball into the goal!
Play the game here! https://dinkieshy.github.io/Bouncer/

Using vectors and coordinates, the player can draw lines on the canvas. Doing so in the path of the ball will cause it to bounce, hopefully towards the goal!
The main issue is the use of the cosine rule to find the angle between the velocity vector and the vector of a line. Sometimes this causes the ball to reflect in the wrong direction, going *through* the line instead of bouncing off it
I can fix this by validating the paths before using them, but unfortunately time constraints and sleep deprivation are getting in the way. Here's hoping for the future!
