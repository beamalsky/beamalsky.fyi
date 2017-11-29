window.addEventListener("load", init);

const BRICKS_WIDTH = 60;
const BRICKS_HEIGHT = 25;
const LEVEL_TIME = 6000;

var brick_across = 7;
var brick_down; 

var stage;
var score = 0;
var lives = 3;
var scoreText;
var bricks = [];
var brick_down;
var brickColor1;
var brickColor2;
var brickColor3;
var gameStarted = false;
var bgmStarted = false;
var nextSwitch = LEVEL_TIME;
var bgm;

const KEYCODE_LEFT = 37;
const KEYCODE_RIGHT = 39;
const SPACEBAR = 32;
var keyboardMoveLeft = false;
var keyboardMoveRight = false;

function init() {

	if(stage) {
		stage.enableDOMEvents(false);
		stage.removeAllChildren();
		stage.removeAllEventListeners();
		stage.clear();
	}

	stage = new createjs.Stage("demoCanvas");
	stage.enableDOMEvents(true);

	createjs.Touch.enable(stage);
	createjs.Ticker.setFPS(60);

	demoCanvas.style.backgroundColor = randomHex();

	createScoreText();
	addToScore(0);

	//load sounds

	createjs.Sound.registerSound("/blockgame/hit.wav", "hit1");
	createjs.Sound.registerSound("/blockgame/hit2.wav", "hit2");
	createjs.Sound.registerSound("/blockgame/blockGame.mp3", "bgm");

	//which block game?
	chooseGame();
}

function resetLevel() {
	if (bgm.playState === "playFinished") {
	//if (score >= 500) { to test win states
		winGame();
	} else {
		bricks = [];
		gameStarted = false;
		init();
	}
}

function chooseGame() {
	if (Boolean(Math.floor(Math.random() * 2))) {
		init1();
	} else {
		init2();
	}
}

function createScoreText() {
	scoreText = new createjs.Text("", "16px Arial", "#000000");
	scoreText.x = 9;			
	scoreText.y = stage.canvas.height - 25;

	scoreText2 = new createjs.Text("", "16px Arial", "#ffffff");
	scoreText2.x = 10;			
	scoreText2.y = stage.canvas.height - 26;

	stage.addChild(scoreText);
	stage.addChild(scoreText2);
}

function addToScore(points) {
	score += points;
	scoreText.text = `Score: ${score}  |  Lives: ${lives}`;
	scoreText2.text = `Score: ${score}  |  Lives: ${lives}`;
}

function winGame() {

	stage.enableDOMEvents(false);
	stage.removeAllChildren();
	stage.removeAllEventListeners();
	stage.clear();

	showWinText();
}

function showWinText() {
	winText2 = new createjs.Text(`You won!\n\nScore: ${score}`, "bold 40px Arial", "#FFFFFF");
	winText2.x = stage.canvas.width / 2;			
	winText2.y = stage.canvas.height / 2 - 100;
	winText2.textAlign = "center";

	winText = new createjs.Text(`You won!\n\nScore: ${score}`, "bold 40px Arial", "#000000");
	winText.x = stage.canvas.width / 2 - 1;			
	winText.y = stage.canvas.height / 2 - 101;
	winText.textAlign = "center";

	stage.addChild(winText);
	stage.addChild(winText2);
}

function loseLife() {
	lives--;
	scoreText.text = `Score: ${score}  |  Lives: ${lives}`;
	scoreText2.text = `Score: ${score}  |  Lives: ${lives}`;

	createjs.Sound.play("hit2");
	demoCanvas.style.backgroundColor = randomHex();

	gameStarted = false;

	if (lives <= 0) {
		loseGame();
	}
}

function loseGame() {
	lives = 3;
	score -= 1000;
	resetLevel();
}

function createBrick(x, y, c) {
	brick = new createjs.Shape();
	brick.graphics.beginFill(c).beginStroke('#FFFFFF');
	brick.graphics.drawRect(0, 0, BRICKS_WIDTH, BRICKS_HEIGHT);
	brick.graphics.endFill();

	brick.regX = BRICKS_WIDTH / 2;
	brick.regY = BRICKS_HEIGHT / 2;

	brick.x = x;
	brick.y = y;
    brick.setBounds(brick.regX,brick.regY,BRICKS_WIDTH,BRICKS_HEIGHT);
	stage.addChild(brick);

	bricks.push(brick);
}

function randomHex() {
	var hex = "#"
	var hexArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9","a","b","c","d","e","f"];
	for (i = 0; i < 6; i++) {
		var rand = hexArray[Math.floor(Math.random() * hexArray.length)]
		hex += rand
	}
	return hex;
}