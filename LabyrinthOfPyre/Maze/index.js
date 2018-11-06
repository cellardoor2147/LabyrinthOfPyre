//misc variables
var screen = document.getElementById("screen");
var screenContext = screen.getContext("2d");
var fps = 60;
var playerAnimCounter = 0;
var fireAnimCounter = 0;
var numSquares = 20;
var mouseX, mouseY;
var codes = new Array();
var lastCode = null;
var konamiCode = ["w", "w", "s", "s",
				  "a", "d", "a", "d",
			      "b", "a", "Control"];
const blockWidth = window.innerWidth / numSquares;
const blockHeight = window.innerHeight / numSquares;
var currentLevel = 0;

//sound variables
var music = document.getElementById("music");
music.style.display = "none";
music.volume = 0.2;
var pickup = document.getElementById("pickup");
pickup.style.display = "none";
pickup.volume = 0.2;
var music = document.getElementById("music");
music.style.display = "none";
music.volume = 0.2;
var open = document.getElementById("open");
open.style.display = "none";
open.volume = 0.2;
var climb = document.getElementById("climb");
climb.style.display = "none";
climb.volume = 1;
var shoot = document.getElementById("shoot");
shoot.style.display = "none";
shoot.volume = 0.2;
var hit = document.getElementById("hit");
hit.style.display = "none";
hit.volume = 0.2;

//player variables
var player = {x: 4 * screen.width, y: 3 * screen.height, 
			  width: blockWidth / 1.5, height: blockWidth / 1.5, 
			  speed: null, direction: "left", 
			  lastHori: "left", keyCount: 0};

var playerTexture = new Image();
playerTexture.src = "Assets/Images/Player/playerIdleRight.png";

//fire variables
var fire = {x: player.x, y: player.y, 
			  width: blockWidth / 1.5, height: blockWidth / 1.5, 
			  speed: null, direction: "left"};

var fireTexture = new Image();
fireTexture.src = "Assets/Images/Player/fire.png";

//enemies variables
var enemies = [
			//LEVEL ZERO
			[],

			//LEVEL ONE
			[],

			//LEVEL TWO
			[{x: blockWidth * 8, y: blockWidth * 10, width: blockWidth,
			  height: blockWidth, direction: "up", speed: 14, health: 1}],

			//LEVEL THREE
			[{x: blockWidth * 5, y: blockWidth * 2, width: blockWidth,
			  height: blockWidth, direction: "up", speed: 14, health: 1},
			  {x: blockWidth * 11, y: blockWidth * 7, width: blockWidth,
			  height: blockWidth, direction: "down", speed: 14, health: 1},
			  {x: blockWidth * 5, y: blockWidth * 10, width: blockWidth,
			  height: blockWidth, direction: "up", speed: 14, health: 1}],

			//LEVEL FOUR
			[{x: blockWidth * 4, y: blockWidth * 5, width: blockWidth,
			  height: blockWidth, direction: "left", speed: 14, health: 1},
			  {x: blockWidth * 15, y: blockWidth * 5, width: blockWidth,
			  height: blockWidth, direction: "left", speed: 7, health: 1}],

			//LEVEL FIVE
			[{x: blockWidth * 3, y: blockWidth * 5, width: blockWidth,
			  height: blockWidth, direction: "left", speed: 7, health: 1},
			  {x: blockWidth * 8, y: blockWidth * 5, width: blockWidth,
			  height: blockWidth, direction: "right", speed: 7, health: 1},
			  {x: blockWidth * 14, y: blockWidth * 5, width: blockWidth,
			  height: blockWidth, direction: "left", speed: 14, health: 1}],

			//LEVEL SIX
			[{x: blockWidth * 5, y: blockWidth * 3, width: blockWidth * 3,
			  height: blockWidth * 3, direction: "up", speed: 3.5, health: 3}]];

var enemiesTexture = new Image();
enemiesTexture.src = "Assets/Images/Enemy/enemyIdleRight.png"

//key variables
var keys = [
			//LEVEL ZERO
			[],

			//LEVEL ONE
			generateBlocks(5, 5, 5, 5, blockWidth / 2, blockHeight / 2),

			//LEVEL TWO
			generateBlocks(3, 10, 3, 10, blockWidth / 2, blockHeight / 2),

			//LEVEL THREE
			[],

			//LEVEL FOUR
			generateBlocks(3, 14, 3, 14, blockWidth / 2, blockHeight / 2),

			//LEVEL FIVE
			generateBlocks(3, 3, 3, 3, blockWidth / 2, blockHeight / 2).concat(
			generateBlocks(8, 3, 8, 3, blockWidth / 2, blockHeight / 2)).concat(
			generateBlocks(13, 3, 13, 3, blockWidth / 2, blockHeight / 2)),

			//LEVEL SIX
			[]];

var keyTexture = new Image();
keyTexture.src = "Assets/Images/Items/key.png";

//walls variables
var walls = [
			//LEVEL ZERO
			generateBlocks(0, 0, 0).concat( //left wall
			generateBlocks(numSquares - 1, 0)).concat( //right wall
			generateBlocks(0, 0, numSquares - 1, 0)).concat( //top wall
			generateBlocks(0, numSquares - 1)), //bottom wall

			//LEVEL ONE
			generateBlocks(0, 0, 0).concat( //left wall
			generateBlocks(numSquares - 1, 0)).concat( //right wall
			generateBlocks(0, 0, numSquares - 1, 0)).concat( //top wall
			generateBlocks(0, numSquares - 1)).concat( //bottom wall
			generateBlocks(13, 5, 13, 5)).concat(
			generateBlocks(15, 5, 18, 5)).concat(
			generateBlocks(13, 15, 18, 15)).concat(
			generateBlocks(13, 5, 13, 15)),

			//LEVEL TWO
			generateBlocks(0, 0, 0).concat( //left wall
			generateBlocks(numSquares - 1, 0)).concat( //right wall
			generateBlocks(0, 0, numSquares - 1, 0)).concat( //top wall
			generateBlocks(0, numSquares - 1)).concat( //bottom wall
			generateBlocks(15, 13, 15, 18)).concat(
			generateBlocks(16, 13, 16, 13)).concat(
			generateBlocks(18, 13, 18, 13)),

			//LEVEL THREE
			generateBlocks(0, 0, 0).concat( //left wall
			generateBlocks(numSquares - 1, 0)).concat( //right wall
			generateBlocks(0, 0, numSquares - 1, 0)).concat( //top wall
			generateBlocks(0, numSquares - 1)).concat( //bottom wall
			generateBlocks(3, 13, 18, 13)).concat(
			generateBlocks(1, 7, 13, 7)),

			//LEVEL FOUR
			generateBlocks(0, 0, 0).concat( //left wall
			generateBlocks(numSquares - 1, 0)).concat( //right wall
			generateBlocks(0, 0, numSquares - 1, 0)).concat( //top wall
			generateBlocks(0, numSquares - 1)).concat( //bottom wall
			generateBlocks(5, 1, 5, 5)).concat(
			generateBlocks(5, 5, 9, 5)).concat(
			generateBlocks(11, 5, 13, 5)).concat(
			generateBlocks(13, 5, 13, 15)).concat(
			generateBlocks(1, 15, 13, 15)),

			//LEVEL FIVE
			generateBlocks(0, 0, 0).concat( //left wall
			generateBlocks(numSquares - 1, 0)).concat( //right wall
			generateBlocks(0, 0, numSquares - 1, 0)).concat( //top wall
			generateBlocks(0, numSquares - 1)).concat( //bottom wall
			generateBlocks(5, 1, 5, 11)).concat(
			generateBlocks(10, 1, 10, 11)).concat(
			generateBlocks(5, 14, 5, 14)).concat(
			generateBlocks(7, 14, 18, 14)).concat(
			generateBlocks(5, 14, 5, 18)),

			//LEVEL SIX
			generateBlocks(0, 0, 0).concat( //left wall
			generateBlocks(numSquares - 1, 0)).concat( //right wall
			generateBlocks(0, 0, numSquares - 1, 0)).concat( //top wall
			generateBlocks(0, numSquares - 1)).concat( //bottom wall
			generateBlocks(0, 10, 0, 10))];

var wallTexture = new Image();
wallTexture.src = "Assets/Images/wall.png";

//locks variables
var locks = [
			//LEVEL ZERO
			[],

			//LEVEL ONE
			generateBlocks(14, 5, 14, 5),

			//LEVEL TWO
			generateBlocks(17, 13, 17, 13),

			//LEVEL THREE
			[],

			//LEVEL FOUR
			generateBlocks(10, 5, 10, 5),
			
			//LEVEL FIVE
			generateBlocks(6, 14, 6, 16),

			//LEVEL SIX
			[]];

var lockTexture = new Image();
lockTexture.src = "Assets/Images/lock.png";

//stairs variables
var stairs = [
			//LEVEL ZERO
			generateBlocks(3, 10, 3, 10),

			//LEVEL ONE
			generateBlocks(18, 10, 18, 10),

			//LEVEL TWO
			generateBlocks(17, 18, 17, 18),

			//LEVEL THREE
			generateBlocks(1, 3, 1, 3),

			//LEVEL FOUR
			generateBlocks(1, 17, 1, 17),

			//LEVEL FIVE
			generateBlocks(18, 17, 18 , 17),

			//LEVEL SIX
			generateBlocks(1, 10, 1, 10)];

var stairsTexture = new Image();
stairsTexture.src = "Assets/Images/stairs.png";

//floors variables
var floors = generateBlocks(numSquares, numSquares);
var floorTexture = new Image();
floorTexture.src = "Assets/Images/floor.png";

window.onload = function() {
	//set misc variables
	screen.width = window.innerWidth;
	screen.height = window.innerHeight;
	screen.tabIndex = 1000;
	screen.style.outline = "none";
	screen.addEventListener("keydown", function(e) { //add key functionality when down
		let moveKeys = ["w", "a", "s", "d", "Control"];

		if (moveKeys.indexOf(e.key.toLowerCase()) != -1) { //the player pressed a valid move key
			if (e.key.toLowerCase() === "a") {
				player.lastHori = "left";
				player.direction = "left";
			}
			else if (e.key.toLowerCase() === "d") {
				player.lastHori = "right";
				player.direction = "right";
			}
			else if (e.key.toLowerCase() === "w") {
				player.direction = "up";
			}
			else {
				player.direction = "down";
			}

			if (!player.speed) {player.speed = 7;}

			if (currentLevel != 0) {music.play();}
		}

		if (e.key === "Control" && !fire.speed) { //if player pressed the fire key
			if (player.direction === "left" || player.lastHori === "left") {
				fire.direction = "left";
			}
			else {
				fire.direction = "right";
			}
			
			fire.x = player.x;
			fire.y = player.y;
			fire.speed = 14;
			shoot.play();
		}

		if (konamiCode[codes.length] === e.key && lastCode != e.key) { //if the player is a smartass
			codes.push(e.key);
			lastCode = e.key;
		}

		lastCode = null;
	})
	screen.addEventListener("keyup", function(e) { //reset speed when up
		let moveKeys = ["w", "a", "s", "d", "Control"];

		if (e.key != "Control") {
			if (player.speed) {player.speed = null;}
		}
	})
	screen.addEventListener("mousemove", function() { //keep track of mouse position
		var rect = screen.getBoundingClientRect();
		var doc = document.documentElement;
		mouseX = event.clientX - rect.left - doc.scrollLeft;
		mouseY = event.clientY - rect.top - doc.scrollTop;
	});

	setInterval(update, 1000 / fps);
}

function generateBlocks(columns = numSquares, rows = numSquares, columnsEnd = numSquares, 
						rowsEnd = numSquares, width = blockWidth, height = blockHeight) {
	let res = new Array();

	if (columns === numSquares && rows === numSquares) { //fill entire board
		for (let i = 0; i < columns; i++) {
			for (let j = 0; j < rows; j++) {
				res.push({x: blockWidth * i, y: blockHeight * j, width: width, height: height,});
			}
		}
	}
	else { //make a specific stroke
		for (let i = columns; i <= columnsEnd; i++) {
			for (let j = rows; j <= rowsEnd; j++) {
				res.push({x: blockWidth * i, y: blockHeight * j, width: width, height: height});
			}
		}
	}

	return res;
}

function drawBlocks(blocks, texture) {
	for (let block of blocks) {
		screenContext.drawImage(texture, block.x, block.y, block.width, block.height);
	}
}

function drawPlayer() {
	if (player.speed) { //player is moving
		if (player.direction === "left" || player.lastHori === "left") {
			if (playerAnimCounter < 0.5) {
				playerTexture.src = "Assets/Images/Player/playerActionLeft.png";
			}
			else {
				playerTexture.src = "Assets/Images/Player/playerIdleLeft.png";
			}
		}
		else {
			if (playerAnimCounter < 0.5) {
				playerTexture.src = "Assets/Images/Player/playerActionRight.png";
			}
			else {
				playerTexture.src = "Assets/Images/Player/playerIdleRight.png";
			}
		}
	}
	else { //player is not moving
		if (player.direction === "left" || player.lastHori === "left") {
			playerTexture.src = "Assets/Images/Player/playerIdleLeft.png";
		}
		else {
			playerTexture.src = "Assets/Images/Player/playerIdleRight.png"
		}
	}

	screenContext.drawImage(playerTexture, player.x, player.y, player.width, player.width);
}

function drawFire() {
	if (fire.speed) { //fire is moving
		if (fireAnimCounter < 0.5) {
			fireTexture.src = "Assets/Images/Player/fire.png";
		}
		else {
			fireTexture.src = "Assets/Images/Player/fireAlt.png";
		}

		screenContext.drawImage(fireTexture, fire.x, fire.y, fire.width, fire.width);
	}
}

function drawEnemies() {
	for (let enemy of enemies[currentLevel]) {
		if (enemy.speed) { //enemy is moving
			if (enemy.direction === "left" ) {
				if (enemy.animCounter < 0.5) {
					enemiesTexture.src = "Assets/Images/Enemy/enemyActionLeft.png";
				}
				else {
					enemiesTexture.src = "Assets/Images/Enemy/enemyIdleLeft.png";
				}
			}
			else {
				if (enemy.animCounter < 0.5) {
					enemiesTexture.src = "Assets/Images/Enemy/enemyActionRight.png";
				}
				else {
					enemiesTexture.src = "Assets/Images/Enemy/enemyIdleRight.png";
				}
			}
		}
		else { //enemy is not moving
			if (enemy.direction === "left") {
				enemiesTexture.src = "Assets/Images/Enemy/enemyIdleLeft.png";
			}
			else {
				enemiesTexture.src = "Assets/Images/Enemy/enemyIdleRight.png"
			}
		}

		if (enemy.speed && enemy.animCounter < 1) { //enemy is moving
			enemy.animCounter += 4 / fps;
		}
		else {
			enemy.animCounter = 0;
		}

		screenContext.drawImage(enemiesTexture, enemy.x, enemy.y, enemy.width, enemy.width);
	}
}

function collision(entity1, entity2) {
	if (entity1.x < entity2.x + entity2.width &&
		entity1.x + entity1.width > entity2.x &&
		entity1.y < entity2.y + entity2.height &&
		entity1.y + entity1.height > entity2.y) {

		return true;
	}
}

function collisionList(entity, blocks) {
	for (let block of blocks) {
		if (collision(entity, block) &&
			((entity.direction === "up" &&
				entity.y > block.y) ||
			(entity.direction === "down" &&
				entity.y < block.y) ||
			(entity.direction === "left" &&
				entity.x > block.x) ||
			(entity.direction === "right" &&
				entity.x < block.x))) {
			return block;
		}
	}

	return null;
}

function movePlayer() {
	let dummy = {x: null, y: null, direction: null, 
				 width: player.width, height: player.height};

	if (player.direction === "up") {
		dummy.x = player.x;
		dummy.y = player.y - player.speed;
		dummy.direction = "up";
	}
	else if (player.direction === "down") {
		dummy.x = player.x;
		dummy.y = player.y + player.speed;
		dummy.direction = "down";
	}
	else if (player.direction === "left") {
		dummy.x = player.x - player.speed;
		dummy.y = player.y;
		dummy.direction = "left";
	}
	else {
		dummy.x = player.x + player.speed;
		dummy.y = player.y;
		dummy.direction = "right";
	}

	if (!collisionList(dummy, walls[currentLevel]) && !collisionList(dummy, locks[currentLevel]) && 
		!collisionList(dummy, stairs[currentLevel])) { //player hasn't collided with anything
		if (player.speed) { //player is moving
			if (player.direction === "left") {player.x -= player.speed;}
			else if (player.direction === "right") {player.x += player.speed;}
			else if (player.direction === "up") {player.y -= player.speed;}
			else {player.y += player.speed;}
		}
	}
	else if (collisionList(dummy, locks[currentLevel]) && player.keyCount > 0) { //player collided with a lock and has a key
		player.keyCount--;
		locks[currentLevel].splice(locks[currentLevel].indexOf(collisionList(dummy, locks[currentLevel])), 1);
		open.play();
	}
	else if (collisionList(dummy, stairs[currentLevel])) { //player collided with the stairs
		climb.play();
		fire.x = player.x;
		fire.y = player.y;
		fire.speed = null

		if (currentLevel === 6) {location.reload();}
		else {currentLevel++;}
	}
	else { //player collided with a wall
		player.speed = null;
	}

	if (collisionList(dummy, keys[currentLevel])) { //player collided with a key
		player.keyCount++;
		keys[currentLevel].splice(keys[currentLevel].indexOf(collisionList(dummy, keys[currentLevel])), 1);
		pickup.play();
	}

	if (collisionList(dummy, enemies[currentLevel])) { //player collided with an enemy
		hit.play();
		location.reload();
	}
}

function moveEnemies() {
	for (let enemy of enemies[currentLevel]) {
		if (!collisionList(enemy, walls[currentLevel]) && !collisionList(enemy, locks[currentLevel]) && 
			!collisionList(enemy, stairs[currentLevel])) { //enemy hasn't collided with anything
			if (enemy.speed) { //enemy is moving
				if (enemy.direction === "left") {enemy.x -= enemy.speed;}
				else if (enemy.direction === "right") {enemy.x += enemy.speed;}
				else if (enemy.direction === "up") {enemy.y -= enemy.speed;}
				else {enemy.y += enemy.speed;}
			}
		}
		else { //enemy collided with a wall
			if (enemy.direction === "left") {
				enemy.direction = "right";
			}
			else if (enemy.direction === "right") {
				enemy.direction = "left";
			}
			else if (enemy.direction === "up") {
				enemy.direction = "down";
			}
			else {
				enemy.direction = "up";
			}
		}
	}
}

function moveFire() {
	if (!collisionList(fire, walls[currentLevel]) && !collisionList(fire, locks[currentLevel]) && 
		!collisionList(fire, stairs[currentLevel]) && !collisionList(fire, enemies[currentLevel])) { //fire hasn't collided with anything
		if (fire.speed) { //fire is moving
			if (fire.direction === "left") {fire.x -= fire.speed;}
			else if (fire.direction === "right") {fire.x += fire.speed;}
		}
	}
	else { //fire collided with something
		if (collisionList(fire, enemies[currentLevel]) && fire.speed) { //fire collided with an enemy
			if (collisionList(fire, enemies[currentLevel]).health === 1) {
				enemies[currentLevel].splice(enemies[currentLevel].indexOf(collisionList(fire, enemies[currentLevel])), 1);
			}
			else {
				collisionList(fire, enemies[currentLevel]).health--;
			}
		}

		hit.play();
		fire.x = player.x;
		fire.y = player.y;
		fire.speed = null;
	}
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
	//draw floors
	drawBlocks(floors, floorTexture);

	//draw walls
	drawBlocks(walls[currentLevel], wallTexture);

	//draw locks
	drawBlocks(locks[currentLevel], lockTexture);

	//draw stairs
	drawBlocks(stairs[currentLevel], stairsTexture);

	//draw keys
	drawBlocks(keys[currentLevel], keyTexture);

	//draw player
	drawPlayer();

	//draw enemies
	drawEnemies();

	//draw fire
	drawFire();

	if (currentLevel === 0) { //draw title screen
		screenContext.font = "100px retro";
		screenContext.fillStyle = "red";
		screenContext.fillText("Labyrinth of Pyre", innerWidth / 4.5, innerHeight / 4);
	}

	//draw debugging coordinates near mouse
	// colorText(mouseX + 50, mouseY + 50, mouseX + "," + mouseY, "red");
}

function inputKonamiCode() {
	if (codes.length != konamiCode.length) {return false;}

	for (let i = 0; i < codes.length; i++) {
		if (codes[i] != konamiCode[i]) {return false;}
	}

	return true;
}

function update() {
	movePlayer();
	moveEnemies();
	moveFire();
	draw();

	if (player.speed && playerAnimCounter < 1) { //player is moving
		playerAnimCounter += 4 / fps;
	}
	else {
		playerAnimCounter = 0;
	}

	if (fire.speed && fireAnimCounter < 1) { //fire is moving
		fireAnimCounter += 4 / fps;
	}
	else {
		fireAnimCounter = 0;
	}

	if (inputKonamiCode()) {
		window.location.href = "../Breakout/indexAlt.html";
	}
}