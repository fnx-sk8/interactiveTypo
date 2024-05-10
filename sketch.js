let font;
let points = [];
let xSpeed = 1; // Horizontal speed
let ySpeed = 1; // Vertical speed
let xDirection = 1; // Horizontal direction
let yDirection = 1; // Vertical direction
let isGrayscale = false; // Track whether text is in grayscale mode
let cannon;
let cannonballs = [];
let timerStarted = false; // Track whether the timer has started
let startTime; // Variable to store the start time
let elapsedTime = 0; // Elapsed time since the timer started
let lastPlayerTime = 0; // Store the time of the last player
let lowestTime = Infinity; // Store the lowest time, initialized as infinity initially
let restartButton; // Button to restart the game
let restartClicked = false; // Track whether the restart button has been clicked

function preload() {
  font = loadFont("Jersey_10/Jersey10-Regular.ttf");
}

function setup() {
  createCanvas(600, 400);
  points = font.textToPoints("EF", 50, 200, 300);
  
  // Initialize cannon
  cannon = createVector(width - 50, height - 50);
  
  // Create restart button
  restartButton = createButton('Restart Game');
  restartButton.position(width - restartButton.width - 10, 10);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function draw() {
  background(30); // Set background color to light black
  
  // Draw ellipses for each point with grayscale or color fill
  for (let i = 0; i < points.length; i++) {
    if (isGrayscale) {
      let gray = random(255);
      fill(gray); // Set random grayscale color
    } else {
      let r = random(255);
      let g = random(255);
      let b = random(255);
      fill(r, g, b); // Set random fill color
    }
    let x = points[i].x;
    let y = points[i].y;
    ellipse(x, y, 10, 7);
    
    // Update position with slower speed and direction
    points[i].x += xSpeed * xDirection;
    points[i].y += ySpeed * yDirection;
    
    // Check for collision with edges
    if (points[i].x < 0 || points[i].x > width || points[i].y < 0 || points[i].y > height) {
      // Toggle between grayscale and color modes
      isGrayscale = !isGrayscale;
      // Reverse directions to keep text within canvas
      xDirection *= -1;
      yDirection *= -1;
    }
  }
  
  // Draw cannon
  fill(255);
  rect(cannon.x, cannon.y, 50, 20);
  
  // Control cannon direction with mouse
  let angle = atan2(mouseY - cannon.y, mouseX - cannon.x);
  push();
  translate(cannon.x, cannon.y);
  rotate(angle);
  rect(0, -10, 50, 20);
  pop();
  
  // Update and display cannonballs
  for (let i = cannonballs.length - 1; i >= 0; i--) {
    cannonballs[i].update();
    cannonballs[i].display();
    // Check for collisions with text points
    let toRemove = []; // Array to store indices of points to remove
    for (let j = 0; j < points.length; j++) {
      if (dist(cannonballs[i].pos.x, cannonballs[i].pos.y, points[j].x, points[j].y) < 10) {
        toRemove.push(j);
      }
    }
    // Remove points outside the loop
    for (let j = toRemove.length - 1; j >= 0; j--) {
      points.splice(toRemove[j], 1);
    }
    if (cannonballs[i].offscreen()) {
      cannonballs.splice(i, 1);
    }
  }
  
  // Check if all points are destroyed and stop timer
  if (points.length === 0 && timerStarted) {
    elapsedTime = millis() - startTime;
    lastPlayerTime = elapsedTime; // Store the time of the last player
    
    // Update lowest time if the current time is lower
    if (elapsedTime < lowestTime) {
      lowestTime = elapsedTime;
    }
    
    timerStarted = false;
    restartButton.show();
  }
  
  // Display timer if started
  if (timerStarted) {
    // Update elapsed time only if timer has started
    elapsedTime = millis() - startTime;
    
    textSize(16);
    fill(255);
    textAlign(LEFT);
    text("Time: " + (elapsedTime / 1000).toFixed(2) + "s", 10, 20);
  }
  
  // Always display lowest time
  textSize(16);
  fill(255);
  textAlign(LEFT);
  text("Lowest time: " + (lowestTime / 1000).toFixed(2) + "s", 10, 60);
  
  // Display previous time of last player
  textSize(16);
  fill(255);
  textAlign(LEFT);
  text("Previous time: " + (lastPlayerTime / 1000).toFixed(2) + "s", 10, 40);
}

function Cannonball(x, y, angle) {
  this.pos = createVector(x, y);
  this.vel = p5.Vector.fromAngle(angle); // Velocity based on angle
  this.vel.mult(5); // Set speed
  
  this.update = function() {
    this.pos.add(this.vel);
  }
  
  this.display = function() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
  
  this.offscreen = function() {
    return (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
  }
}

function mousePressed() {
  fireCannon();
}

function keyTyped() {
  if (key === ' ') {
    fireCannon();
  }
}

function fireCannon() {
  // Check if there are remaining points to shoot at
  if (points.length > 0) {
    let angle = atan2(mouseY - cannon.y, mouseX - cannon.x);
    let cannonball = new Cannonball(cannon.x + 25, cannon.y, angle);
    cannonballs.push(cannonball);
    
    // Start timer on first click
    if (!timerStarted) {
      timerStarted = true;
      startTime = millis();
    }
  }
}

function restartGame() {
  points = font.textToPoints("EF", 50, 200, 300);
  restartButton.hide();
  // Set restartClicked to true when the restart button is clicked
  restartClicked = true;
}

function mouseReleased() {
  // Reset timerStarted flag only when the mouse is clicked again after restart
  if (restartClicked) {
    timerStarted = false;
    restartClicked = false; // Reset the restartClicked flag
  }
}
