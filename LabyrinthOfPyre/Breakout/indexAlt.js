//misc variables
var screen = document.getElementById("screen");
var screenContext = screen.getContext("2d");
var fps = 60;
var codes = new Array();
var lastCode = null;
var konamiCode = ["w", "w", "s", "s",
				  "a", "d", "a", "d",
			      "b", "a", "Control"];
var gameOver = false;
var music = document.getElementById("music");
music.style.display = "none";
music.volume = 0.2;

//ball variables
var ballX, ballY, ballRad, ballXDelta, ballYDelta;

//paddle variables
var paddleX;
const paddleWidth = 250;
const paddleHeight = 25;
var mouseX, mouseY;

//brick variables
const brickWidth = 250;
const brickHeight = 50;
var bricks = generateBricks(6, 6);

window.onload = function() {
	//set screen variables
	screen.width = window.innerWidth;
	screen.height = window.innerHeight;
	screen.tabIndex = 1000;
	screen.style.outline = "none";

	//set ball variables
	ballX = screen.width / 2;
	ballY = screen.height / 2;
	ballRad = 20;
	ballXDelta = 9;
	ballYDelta = 9;

	//set paddle variables;
	paddleX = screen.width;

	//set update interval
	setInterval(update, 1000 / fps);

	//add mouse functionality
	screen.addEventListener('mousemove', movePaddle);

	screen.addEventListener("keydown", function(e) {
		music.play();
		
		if (konamiCode[codes.length] === e.key && lastCode != e.key) { //switch to breakout when player is a smartass
			codes.push(e.key);
			lastCode = e.key;
		}

		lastCode = null;
	});
}

function generateBricks(columns, rows) {
	let res = [];

	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			res.push([brickWidth * i, brickHeight * j + brickHeight * 2]);
		}
	}

	console.log(res.length);
	return res;
}

function drawBricks(brickArr) {
	for (let brick of brickArr) {
		colorRect(brick[0], brick[1], brickWidth - 2, brickHeight - 2, "blue");
	}
}

function brickCollision(brickArr) {
	for (let brick of brickArr) {
		if (((ballYDelta < 0) &&
			(ballY - ballRad <= brick[1] + brickHeight) &&
			(ballY + ballRad >= brick[1] + brickHeight) &&
			(ballX - ballRad >= brick[0] && ballX + ballRad <= brick[0] + brickWidth)) ||
			((ballYDelta > 0) &&
			(ballY + ballRad >= brick[1]) &&
			(ballY - ballRad <= brick[1]) &&
			(ballX - ballRad >= brick[0] && ballX + ballRad <= brick[0] + brickWidth))) {
			console.log(brick);
			return brick;
		}
	}
}

function moveBall() {
	if ((ballXDelta > 0 && ballX >= screen.width) ||
		(ballXDelta < 0 && ballX <= 0)) { //if ball hits a horizontal wall
		ballXDelta *= -1;
	}
	else if (ballYDelta < 0 && ballY <= 0) { //if ball hits the ceiling
		ballYDelta *= -1;
	}
	else if ((ballYDelta > 0) && 
			 (ballY + ballRad >= screen.height - paddleHeight) &&
			 (ballX >= paddleX) && (ballX <= paddleX + paddleWidth)) { //if ball hits the paddle
		ballXDelta = (ballX - (paddleX + paddleWidth / 2)) / 5;
		ballYDelta *= -1;
	}
	else if (ballYDelta > 0 && ballY >= screen.height) { //if ball hits floor
		gameOver = true;
	}
	else if (brickCollision(bricks)) { //if ball hits a brick
		if (brickCollision(bricks) != [0, 100]) {
			bricks.splice(bricks.indexOf(brickCollision(bricks)), 1);
		}
		else {
			bricks.shift();
		}

		if (bricks.length === 0) {gameOver = true;}

		ballYDelta *= -1;
	}

	ballX += ballXDelta;
	ballY += ballYDelta;
}

function movePaddle(event) {
	var rect = screen.getBoundingClientRect();
	var doc = document.documentElement;
	mouseX = event.clientX - rect.left - doc.scrollLeft;
	mouseY = event.clientY - rect.top - doc.scrollTop;

	paddleX = mouseX - paddleWidth / 2;
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, color) {
	screenContext.fillStyle = color;
	screenContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, color){
	screenContext.fillStyle = color;
	screenContext.beginPath();
	screenContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	screenContext.fill();
}

function colorText(topLeftX, topLeftY, text, color) {
	screenContext.fillStyle = color;
	screenContext.fillText(text, topLeftX, topLeftY);
}

function draw() {
	//draw background
	colorRect(0, 0, screen.width, screen.height, "black");

	//draw paddle
	colorRect(paddleX, screen.height - paddleHeight, paddleWidth, paddleHeight, "white");

	//draw debugging coordinates near mouse
	// colorText(mouseX + 50, mouseY + 50, mouseX + "," + mouseY, "red");

	//draw ball
	colorCircle(ballX, ballY, ballRad, "white");

	//draw bricks
	drawBricks(bricks);

	//draw game over
	if (gameOver) {

	}
}

function inputKonamiCode() {
	if (codes.length != konamiCode.length) {return false;}

	for (let i = 0; i < codes.length; i++) {
		if (codes[i] != konamiCode[i]) {return false;}
	}

	return true;
}

function update() {
	if (!gameOver) { //if game isn't over
		moveBall();
	}
	else {
		bricks = generateBricks(6, 6);
		ballX = screen.width / 2;
		ballY = screen.height / 2;
		ballXDelta = 9;
		ballYDelta = 9;
		gameOver = false;
	}

	draw();

	if (inputKonamiCode()) {
		window.location.href = "../Maze/index.html";
	}
}