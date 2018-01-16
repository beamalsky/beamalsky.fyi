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

var gameStarted = false; 

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

var messageField;		//the message display field
var alarmField;			//the alarm display field

var loadingInterval = 0;

//register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

//introText
introText = "It's Saturday January 13, 2018,\n\nand you're beginning your shift at the\n\nHawaii Emergency Management Agency.\n\n\nIt's a normal day, and time for\n\na routine missile drill.\n\n\nLet's run the test!\n\n\n\nUse the arrow keys to move.\n\nClick to start and select."

//alarmText
alarm1 = "BMD False Alarm";
alarm2 = "Amber Alert (CAE) - Kauai County Only";
alarm3 = "Amber Alert (CAE) Statewide";
alarm4 = "TEST Message";
alarm5 = "PACOM (CDW) - STATE ONLY";
alarm6 = "Tsunami Warning (CEM) - STATE ONLY";
alarm7 = "DRILL - PACOM (CDW) - STATE ONLY";
alarm8 = "Landslide - Hanna Road Closure";
alarm9 = "Amber Alert DEMO TEST";
alarm10 = "High Surf Warning North Shores";

function init() {
	if (!createjs.Sound.initializeDefaultPlugins()) {
		document.getElementById("error").style.display = "block";
		document.getElementById("content").style.display = "none";
		return;
	}

	// if (createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isBlackberry) {
	// 	document.getElementById("mobile").style.display = "block";
	// 	document.getElementById("content").style.display = "none";

	// 	return;
	// }

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
		{id: "click", src: "click.wav"},

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
	
	canvas.onclick = null;
	
	if (!gameStarted) {
		//prevent extra clicks and hide text
		stage.removeChild(messageField);

		// TK sound to indicate the player is now on screen
		//createjs.Sound.play("click");

		restart();
		gameStarted = true;
	} else {
		console.log("you clicked once the game started!");
		createjs.Sound.play("click");
	}

}

//reset all game logic
function restart() {
	//hide anything on stage and show the score
	stage.removeAllChildren();
	mainCanvas.style.backgroundColor = "#ffffff";

	//create the player
	alive = true;
	hand = new createjs.Bitmap("hand.png");
	hand.scaleX = 0.05;
	hand.scaleY = 0.05;
	hand.x = canvas.width / 2;
	hand.y = canvas.height / 2;
	hand.setBounds(hand.regX,hand.regY,10,10);

	//create alarm text1
	alarmField1 = new createjs.Text(alarm1, "bold 20px Times", "#0645AD");
	alarmField1.x = 40;
	alarmField1.y = canvas.height / 5;

	//create alarm text2
	alarmField2 = new createjs.Text(alarm2, "bold 20px Times", "#0645AD");
	alarmField2.x = 40;
	alarmField2.y = canvas.height / 5 + 40;

	//create alarm text3
	alarmField3 = new createjs.Text(alarm3, "bold 20px Times", "#0645AD");
	alarmField3.x = 40;
	alarmField3.y = canvas.height / 5 + 80;

	//create alarm text4
	alarmField4 = new createjs.Text(alarm4, "bold 20px Times", "#0645AD");
	alarmField4.x = 40;
	alarmField4.y = canvas.height / 5 + 120;

	//create alarm text5
	alarmField5 = new createjs.Text(alarm5, "bold 20px Times", "#0645AD");
	alarmField5.x = 40;
	alarmField5.y = canvas.height / 5 + 160;

	//create alarm text6
	alarmField6 = new createjs.Text(alarm6, "bold 20px Times", "#0645AD");
	alarmField6.x = 40;
	alarmField6.y = canvas.height / 5 + 200;

	//create alarm text7
	alarmField7 = new createjs.Text(alarm7, "bold 20px Times", "#0645AD");
	alarmField7.x = 40;
	alarmField7.y = canvas.height / 5 + 240;

	//create alarm text8
	alarmField8 = new createjs.Text(alarm8, "bold 20px Times", "#0645AD");
	alarmField8.x = 40;
	alarmField8.y = canvas.height / 5 + 280;

	//create alarm text9
	alarmField9 = new createjs.Text(alarm9, "bold 20px Times", "#0645AD");
	alarmField9.x = 40;
	alarmField9.y = canvas.height / 5 + 320;

	//create alarm text10
	alarmField10 = new createjs.Text(alarm10, "bold 20px Times", "#0645AD");
	alarmField10.x = 40;
	alarmField10.y = canvas.height / 5 + 360;

	//ensure stage is blank and add the hand
	stage.clear();
	stage.addChild(alarmField1);
	stage.addChild(alarmField2);
	stage.addChild(alarmField3);
	stage.addChild(alarmField4);
	stage.addChild(alarmField5);
	stage.addChild(alarmField6);
	stage.addChild(alarmField7);
	stage.addChild(alarmField8);
	stage.addChild(alarmField9);
	stage.addChild(alarmField10);
	stage.addChild(hand);
	stage.update(); 	//update the stage to show text

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

	hand.x += Math.random() * 15
	hand.x -= Math.random() * 15
	hand.y += Math.random() * 20
	hand.y -= Math.random() * 20

	canvas.onclick = handleClick;

	//check if hand hits wall TK

	stage.update();
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
