const PADDLE_WIDTH = 75;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 9;
const FULL_X_SPEED = 10;
const PADDLE_SPEED = 15;

var paddle;
var ball;
var paddleColor;
var brickGrids = [];

function init1() {

	brick_down = 9;
	paddleColor = randomHex();
	brickColor1 = randomHex();

	createjs.Ticker.addEventListener("tick", tick1);

	createPaddle();
	createBall();
	
	createBrickGrid1(brick_across, brick_down);
	
	window.onkeyup = keyUpHandler;
	window.onkeydown = keyDownHandler;

	stage.on("stagemousemove", function(event) {
		paddle.x = stage.mouseX;
	});

	stage.on("stagemousedown", function(event) {
		startLevel1();
		nextSwitch = createjs.Ticker.getTime() + LEVEL_TIME;
	});
}

function startLevel1() {
	if(!gameStarted) {
		gameStarted = true;
		ball.xSpeed = 7;
		ball.ySpeed = 7;
		ball.up = true;
		ball.right = Boolean(Math.floor(Math.random() * 2));
	}

	if (!bgmStarted) {
		bgm = createjs.Sound.play("bgm");
		bgmStarted = true;
	}
}

function keyDownHandler(e) {
	switch(e.keyCode) {
		case KEYCODE_LEFT: keyboardMoveLeft = true; break;
		case KEYCODE_RIGHT: keyboardMoveRight = true; break;
		case SPACEBAR: startLevel1(); break;
	}
}

function keyUpHandler(e) {
	switch(e.keyCode) {
		case KEYCODE_LEFT: keyboardMoveLeft = false;
		case KEYCODE_RIGHT: keyboardMoveRight = false;
	}
}

function loseLife1() {

	loseLife();

	ball.xSpeed = 0;
	ball.ySpeed = 0;
	ball.x = paddle.x;
	ball.y = paddle.y - PADDLE_HEIGHT / 2 - BALL_RADIUS - 5;	
	
}

function tick1() {

	//keyboard movement
	if (keyboardMoveLeft) {
		paddle.x -= PADDLE_SPEED;
	}

	if (keyboardMoveRight) {
		paddle.x += PADDLE_SPEED;
	}

	//keep the paddle from moving through side walls
	if (paddle.x + PADDLE_WIDTH / 2 > stage.canvas.width - 10) {
		paddle.x = stage.canvas.width - PADDLE_WIDTH / 2 - 10;
	}

	if (paddle.x - PADDLE_WIDTH / 2 < 10) {
		paddle.x = PADDLE_WIDTH / 2 + 10;
	}

	//keep ball on paddle if the game hasn't started or is paused
	if (!gameStarted) {
		ball.x = paddle.x;
		ball.y = paddle.y - PADDLE_HEIGHT / 2 - BALL_RADIUS - 5;
		stage.update();
		return;
	}

	if (ball.up) {
		ball.y -= ball.ySpeed;
	} else {
		ball.y += ball.ySpeed;
	}

	if (ball.right) {
		ball.x += ball.xSpeed;
	} else {
		ball.x -= ball.xSpeed;
	}

	//check if ball hit paddle

	if(checkCollision(ball,paddle))
	{
		newBallXSpeedAfterCollision(ball,paddle);
	}

	//check if ball hit brick
	for (var i = 0; i < bricks.length; i++) {
		if (checkCollision(ball, bricks[i])) {
			addToScore(100);
			createjs.Sound.play("hit1");
			destroyBrick(bricks[i]);
			bricks.splice(i, 1);
			i--;
		}
	}

	//check if ball hit wall
	if (ball.x + BALL_RADIUS >= stage.canvas.width) {
		ball.x = stage.canvas.width - BALL_RADIUS;
		ball.right = false;
	}

	if (ball.x - BALL_RADIUS <= 0) {
		ball.x = BALL_RADIUS;
		ball.right = true;
	}

	if (ball.y - BALL_RADIUS <= 0) {
		ball.y = BALL_RADIUS;
		ball.up = false;
	}

	if (ball.y + BALL_RADIUS >= stage.canvas.height) {
		loseLife1();
	}

	//track ball
	ball.lastX = ball.x;
	ball.lastY = ball.y;

	if (createjs.Ticker.getTime() >= nextSwitch) {
		nextSwitch += LEVEL_TIME;
		resetLevel();
	}

	stage.update();
}

function checkCollision(ballElement,hitElement) {
	var leftBorder = (hitElement.x - hitElement.getBounds().width/2);
	var rightBorder = (hitElement.x + hitElement.getBounds().width/2);
	var topBorder = (hitElement.y - hitElement.getBounds().height/2);
	var bottomBorder = (hitElement.y + hitElement.getBounds().height/2);
	var previousBallLeftBorder = ballElement.lastX - BALL_RADIUS;
	var previousBallRightBorder = ballElement.lastX + BALL_RADIUS;
	var previousBallTopBorder = ballElement.lastY - BALL_RADIUS;
	var previousBallBottomBorder = ballElement.lastY + BALL_RADIUS;
	var ballLeftBorder = ballElement.x - BALL_RADIUS;
	var ballRightBorder = ballElement.x + BALL_RADIUS;
	var ballTopBorder = ballElement.y - BALL_RADIUS;
	var ballBottomBorder = ballElement.y + BALL_RADIUS;


	if((ballLeftBorder<=rightBorder) && (ballRightBorder >= leftBorder) && (ballTopBorder <= bottomBorder) && (ballBottomBorder >= topBorder))
	{


		if((ballTopBorder <= bottomBorder)&&(previousBallTopBorder > bottomBorder))
		{
			//Hit from the bottom
			ballElement.up = false;
			ballElement.y = bottomBorder + BALL_RADIUS;
		}

		if((ballBottomBorder >= topBorder)&&(previousBallBottomBorder<topBorder))
		{
			//Hit from the top
			ballElement.up = true;
			ballElement.y = topBorder - BALL_RADIUS;
		}
		if((ballLeftBorder<=rightBorder)&&(previousBallLeftBorder>rightBorder))
		{
			//Hit from the right
			ballElement.right = true;
			ballElement.x = rightBorder + BALL_RADIUS;
		}

		if((ballRightBorder >= leftBorder)&&(previousBallRightBorder < leftBorder))
		{
			//Hit from the left
			ballElement.right = false;
			ballElement.x = leftBorder - BALL_RADIUS;
		}

		ballElement.lastX = ballElement.x;
		ballElement.lastY = ballElement.y;
		return true;
	}
	return false;
}

function newBallXSpeedAfterCollision(ballElement,hitElement) {
	var startPoint = hitElement.x - hitElement.getBounds().width/2;
	var midPoint =  hitElement.x;
	var endPoint = hitElement.x + hitElement.getBounds().width/2;


	if(ballElement.x<midPoint)
	{
		ball.right = false;
		ball.xSpeed = FULL_X_SPEED - ((ballElement.x - startPoint)/(midPoint-startPoint)) * FULL_X_SPEED
	}
	else
	{
		ball.xSpeed = FULL_X_SPEED - ((endPoint - ballElement.x)/(endPoint-midPoint)) * FULL_X_SPEED
		ball.right = true;	
	}
}

function createBrickGrid1(l, w) {
	var x = Math.floor(Math.random() * 4)
	console.log(x);

	switch(x) {
		case 0: createBrickGrid1_0(l, w + 3); break;
		case 1: createBrickGrid1_1(l, w + 5); break; 
		case 2: createBrickGrid1_2(l, w); break; 
		case 3: createBrickGrid1_3(l, w + 5); break;
	}
}

function createBrickGrid1_0(l, w) {
	for (var i = 0; i < l; i++) {
		for (var j = 0; j < w; j++) {
			if (!(j % 2)) {
				createBrick(i * (BRICKS_WIDTH + 10) + 40, j * (BRICKS_HEIGHT + 5) + 20, brickColor1);
			}
		}
	}
}

function createBrickGrid1_1(l, w) {
	for (var i = 0; i < l; i++) {
		for (var j = 0; j < w; j++) {
			if (i % 2) {
				createBrick(i * (BRICKS_WIDTH + 10) + 40, j * (BRICKS_HEIGHT + 5) + 20, brickColor1);
			}
		}
	}
}

function createBrickGrid1_2(l, w) {
	for (var i = 0; i < l; i++) {
		for (var j = 0; j < w; j++) {
			if (!(i % 2)) {
				createBrick(i * (BRICKS_WIDTH + 10) + 40, j * (BRICKS_HEIGHT + 5) + 20, brickColor1);
			}
		}
	}
}

function createBrickGrid1_3(l, w) {
	for (var i = 0; i < l; i++) {
		for (var j = 0; j < w; j++) {
			if (!(j % 2)) {
				createBrick(i * (BRICKS_WIDTH + 10) + 40, j * (BRICKS_HEIGHT + 5) + 20, brickColor1);
			}
		}
	}

	for (var i = 0; i < l; i++) {
		for (var j = 0; j < w; j++) {
			if (i % 2) {
				createBrick(i * (BRICKS_WIDTH + 10) + 40, j * (BRICKS_HEIGHT + 5) + 20, brickColor1);
			}
		}
	}
}

function destroyBrick(b) {
	createjs.Tween.get(b, {}).to({scaleX:0, scaleY:0}, 300);
	setTimeout(removeBrickFromScreen, 500);
}

function removeBrickFromScreen(brick) {
	stage.removeChild(brick);
}

function createBall() {
	ball = new createjs.Shape();
	ball.graphics.beginFill(paddleColor).beginStroke('#FFFFFF').drawCircle(0, 0, BALL_RADIUS);
	
	ball.x = paddle.x;
	ball.y = paddle.y - PADDLE_HEIGHT/2 - BALL_RADIUS;
	stage.addChild(ball);

	ball.up = true;
	ball.right = true;
	ball.xSpeed = 0;
	ball.ySpeed = 0;
	ball.lastX = 0;
	ball.lastY = 0;
}

function createPaddle() {
	paddle = new createjs.Shape();
	paddle.graphics.beginFill(paddleColor).beginStroke('#FFFFFF').drawRect(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
	
	paddle.x = stage.canvas.width / 2 - PADDLE_WIDTH / 2;
	paddle.y = stage.canvas.height * .87;
    paddle.regX = PADDLE_WIDTH/2;
    paddle.regY = PADDLE_HEIGHT/2;
    paddle.setBounds(paddle.regX,paddle.regY,PADDLE_WIDTH,PADDLE_HEIGHT);
	
	stage.addChild(paddle);
}