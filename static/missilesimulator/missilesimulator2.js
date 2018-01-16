window.addEventListener("load", init);

const KEYCODE_SPACE = 32;		//useful keycode
const KEYCODE_UP = 38;		//useful keycode
const KEYCODE_DOWN = 40
const KEYCODE_LEFT = 37;		//useful keycode
const KEYCODE_RIGHT = 39;		//useful keycode
const KEYCODE_W = 87;
const KEYCODE_A = 65;
const KEYCODE_S = 83;
const KEYCODE_D = 68;

const HAND_SPEED = 7;
const FPS = 20;


var manifest;           // used to register sounds for preloading
var preload;

var clickHeld;			//is the user holding a shoot command
var lfHeld;				//is the user holding a turn left command
var rtHeld;				//is the user holding a turn right command
var upHeld;				//is the user holding an up command
var dnHeld;			//is the user holding a down command

var canvas;			//Main canvas
var stage;			//Main display stage

var hand;			//the clicker

var messageField;		//the mssage display field

var loadingInterval = 0;

//register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

//introText
introText = "It's Saturday January 13, 2018,\n\nand you're beginning your shift at the\n\nHawaii Emergency Management Agency.\n\n\nIt's a normal day, and time for\n\na routine missile drill.\n\n\nLet's run the test!\n\n\n\nUse the arrow keys to move.\n\nClick to start and select."

function init() {
	if (!createjs.Sound.initializeDefaultPlugins()) {
		document.getElementById("error").style.display = "block";
		document.getElementById("content").style.display = "none";
		return;
	}

	if (createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry) {
		document.getElementById("mobile").style.display = "block";
		document.getElementById("content").style.display = "none";
		return;
	}

	canvas = document.getElementById("mainCanvas");
	stage = new createjs.Stage(canvas);

	mainCanvas.style.backgroundColor = "#000000";

	messageField = new createjs.Text("Loading:", "bold 20px Arial", "#FFFFFF");
	messageField.maxWidth = 1000;
	messageField.textAlign = "center";
	messageField.textBaseline = "middle";
	messageField.x = canvas.width / 2;
	messageField.y = canvas.height / 2 - 180;
	stage.addChild(messageField);
	stage.update(); 	//update the stage to show text

	// begin loading content
	var assetsPath = "";
	manifest = [
		{id: "bgm", src: "the_buzzcocks_why_cant_i_touch_it.mp3"},
	];

	//createjs.Sound.alternateExtensions = ["mp3"];
	preload = new createjs.LoadQueue(true, assetsPath);
	preload.installPlugin(createjs.Sound);
	preload.addEventListener("complete", doneLoading); // add an event listener for when load is completed
	preload.addEventListener("progress", updateLoading);
	preload.loadManifest(manifest);
}

function stop() {
	if (preload != null) {
		preload.close();
	}
	createjs.Sound.stop();
}

function updateLoading() {
	messageField.text = "Loading: " + (preload.progress * 100 | 0) + "%";
	stage.update();
}

function doneLoading(event) {
	clearInterval(loadingInterval);

	messageField.text = introText;

	// start the music
	createjs.Sound.play("bgm", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4});

	watchRestart();
}

function watchRestart() {
	//watch for clicks
	stage.addChild(messageField);
	stage.update(); 	//update the stage to show text
	canvas.onclick = handleClick;
}

function handleClick() {
	//prevent extra clicks and hide text
	canvas.onclick = null;
	stage.removeChild(messageField);

	// TK indicate the player is now on screen
	//createjs.Sound.play("begin");

	restart();
}

//reset all game logic
function restart() {
	//hide anything on stage and show the score
	stage.removeAllChildren();

	//create the player
	alive = true;
	hand = new createjs.Bitmap("hand.png");
	hand.scaleX = 0.05;
	hand.scaleY = 0.05;
	hand.x = canvas.width / 2;
	hand.y = canvas.height / 2;
	hand.setBounds(hand.regX,hand.regY,10,10);

	//ensure stage is blank and add the hand
	stage.clear();
	stage.addChild(hand);
	console.log(hand.getBounds());

	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", tick);

}

function tick() {

	//handle movement controls
	if (lfHeld) {
		hand.x -= HAND_SPEED;
	}
	if (rtHeld) {
		hand.x += HAND_SPEED;
	}
	if (upHeld) {
		hand.y -= HAND_SPEED;
	}
	if (dnHeld) {
		hand.y += HAND_SPEED;
	}

	//handle ship looping
	if (outOfBounds(hand, hand.getBounds())) {
		placeInBounds(hand, hand.getBounds());
	}

	stage.update();
}

function outOfBounds(o, bounds) {
	//is it visibly off screen
	return o.x < bounds * -2 || o.y < bounds * -2 || o.x > canvas.width + bounds * 2 || o.y > canvas.height + bounds * 2;
}

function placeInBounds(o, bounds) {
	//if its visual bounds are entirely off screen place it off screen on the other side
	if (o.x > canvas.width + bounds * 2) {
		o.x = bounds * -2;
	} else if (o.x < bounds * -2) {
		o.x = canvas.width + bounds * 2;
	}

	//if its visual bounds are entirely off screen place it off screen on the other side
	if (o.y > canvas.height + bounds * 2) {
		o.y = bounds * -2;
	} else if (o.y < bounds * -2) {
		o.y = canvas.height + bounds * 2;
	}
}

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
		case KEYCODE_SPACE:
			clickHeld = true;
			return false;
		case KEYCODE_A:
		case KEYCODE_LEFT:
			lfHeld = true;
			return false;
		case KEYCODE_D:
		case KEYCODE_RIGHT:
			rtHeld = true;
			return false;
		case KEYCODE_W:
		case KEYCODE_UP:
			upHeld = true;
			return false;
		case KEYCODE_S:
		case KEYCODE_DOWN:
			dnHeld = true;
			return false;
	}
}

function handleKeyUp(e) {
	//cross browser issues exist
	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
		case KEYCODE_SPACE:
			clickHeld = false;
			break;
		case KEYCODE_A:
		case KEYCODE_LEFT:
			lfHeld = false;
			break;
		case KEYCODE_D:
		case KEYCODE_RIGHT:
			rtHeld = false;
			break;
		case KEYCODE_W:
		case KEYCODE_UP:
			upHeld = false;
			break;
		case KEYCODE_S:
		case KEYCODE_DOWN:
			dnHeld = false;
	}
}
