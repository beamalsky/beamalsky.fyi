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

const HAND_SPEED = 10;
const FPS = 15;

var hand_width = 10;
var hand_height = 10;

var gameStarted = false; 
var selectedAlarm;

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
var globe;			//spinning globe

var messageField;		//the message display field
var alarmField;			//the alarm display field
var alarms = [];

var loadingInterval = 0;

//register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

//introText
introText = "It's Saturday January 13, 2018,\n\nand you're beginning your shift at the\n\nHawaii Emergency Management Agency.\n\n\nIt's a normal day, and time for\n\na routine missile drill.\n\n\nLet's run the test!\n\n\n\n\n\n\n\n\n\nUse the arrow keys to move.\n\nClick to start and select."

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

//endText
//var endText = "It's over!\n\nYou chose " + selectedAlarm + ".\n\nWow that was not right at all."

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

	//createjs.Touch.enable(stage);
	mainCanvas.style.backgroundColor = "#000000";

	messageField = new createjs.Text("Loading:", "bold 20px Arial", "#FFFFFF");
	messageField.maxWidth = 1000;
	messageField.textAlign = "center";
	messageField.textBaseline = "middle";
	messageField.x = canvas.width / 2;
	messageField.y = canvas.height / 2 - 250;

	globe = new createjs.Bitmap("globe.png");
	globe.scaleX = 0.4;
	globe.scaleY = 0.4;
	globe.x = canvas.width / 2 - 70;
	globe.y = 380;

	stage.addChild(messageField);
	//stage.addChild(globe);
	stage.update(); 	//update the stage to show text

	// begin loading content
	var assetsPath = "";
	manifest = [
		{id: "bgm", src: "the_buzzcocks_why_cant_i_touch_it.mp3"},
		//{id: "alert", src: "hawaiiAlert.png"},

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
	//clearInterval(loadingInterval);

	messageField.text = introText;
	stage.addChild(messageField);
	stage.addChild(globe);

	stage.update(); 	//update the stage to show text

	// start the music
	createjs.Sound.play("bgm", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4});

	watchGameStart();
}

function restart() {
		
	stage.removeAllChildren();

	messageField.text = introText;
	stage.addChild(messageField);
	stage.addChild(globe);

	stage.update();
	watchGameStart();
}

function watchGameStart() {
	//watch for clicks
	canvas.onclick = handleClick;
}

function handleClick() {
	
	canvas.onclick = null;
	
	if (!gameStarted) {
		//prevent extra clicks and hide text
		stage.removeChild(messageField);

		// TK sound to indicate the player is now on screen
		//createjs.Sound.play("click");

		GameStart();
		gameStarted = true;
	} else {
		//createjs.Sound.play("click");

		for (var i = 0; i < alarms.length; i++) {
			if (checkCollision(hand, alarms[i])) {
				selectedAlarm = alarms[i];
				endGame(selectedAlarm);
			}
		}
	}

}

//reset all game logic
function GameStart() {
	//hide anything on stage
	stage.removeAllChildren();
	mainCanvas.style.backgroundColor = "#ffffff";

	//create the player
	alive = true;
	hand = new createjs.Bitmap("hand.png");
	hand.scaleX = 0.05;
	hand.scaleY = 0.05;
	hand.regX = 15;
	hand.x = canvas.width / 2;
	hand.y = 600;

	//ensure stage is blank and add the alarms and hand
	stage.clear();

	createAlarm(alarm1, 0);
	createAlarm(alarm2, 40);
	createAlarm(alarm3, 80);
	createAlarm(alarm4, 120);
	createAlarm(alarm5, 160);
	createAlarm(alarm6, 200);
	createAlarm(alarm7, 240);
	createAlarm(alarm8, 280);
	createAlarm(alarm9, 320);
	createAlarm(alarm10, 360);

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

		//shaky hand!!
		hand.x += Math.random() * 20
		hand.x -= Math.random() * 20
		hand.y += Math.random() * 25
		hand.y -= Math.random() * 25

		// if (clickHeld) {
		// 	handleClick();
		// }

		canvas.onclick = handleClick;

		if (outOfBounds(hand)) {
			placeInBounds(hand);
		}

		for (var i = 0; i < alarms.length; i++) {
			if (checkCollision(hand, alarms[i])) {
				alarms[i].color = "#ff0000";
			} else {
				alarms[i].color = "#0645AD";
			}
		}

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

function createAlarm(alarmNum, yShift) {
	alarm = new createjs.Text(alarmNum, "bold 20px Times", "#0645AD");
	alarm.x = 40;
	alarm.y = canvas.height / 5 + yShift;
	stage.addChild(alarm);
	alarms.push(alarm);
}

function checkCollision(handElement, hitElement) {
	var leftBorder = hitElement.x;
	var rightBorder = hitElement.x + hitElement.getBounds().width;
	var topBorder = hitElement.y;
	var bottomBorder = hitElement.y + hitElement.getBounds().height;

	var handLeftBorder = handElement.x;
	var handRightBorder = handElement.x + hand_width;
	var handTopBorder = handElement.y;
	var handBottomBorder = handElement.y + hand_height;

	if((handLeftBorder<=rightBorder) && (handRightBorder >= leftBorder) && (handTopBorder <= bottomBorder) && (handBottomBorder >= topBorder)) {
		return hitElement;
	}
	return false;
}

function outOfBounds(h) {
	//is it visibly off screen?
	return h.x < -50 || h.x > canvas.width || h.y < -70 || h.y > canvas.height;
}

function placeInBounds(h) {
	//if its visual bounds are entirely off screen place it off screen on the other side
	if (h.x < -50) {
		h.x = canvas.width - 10;
	} else if (h.x > canvas.width) {
		h.x = -40;
	}

	if (h.y < -70) {
		h.y = canvas.height - 10;
	} else if (h.y > canvas.height) {
		h.y = -60;
	}
}

function destroyAlarm(b) {
	createjs.Tween.get(b, {}).to({scaleX:0, scaleY:0}, 300);
}

function endGame1() {

	messageField.y = canvas.height / 2 - 150;
	messageField.text = "Uh oh!\n\n\nYou chose\n\n" + selectedAlarm.text + ",\n\nwhich was really not right at all.\n\n\nThink you can do better for your country?\n\nClick to play again!";

}

function endGame2() {

	messageField.y = canvas.height / 2 - 150;
	messageField.text = "Nice job!\n\n\nYou chose\n\n" + selectedAlarm.text + "\n\nand ran a successful missile drill.\n\n\nReady for your next shift?\n\nClick to play again!";

}

function endGame3() {

	messageField.y = canvas.height / 2 - 250;

	alert = new createjs.Bitmap("hawaiiAlert.png");
	alert.scaleX = 0.15;
	alert.scaleY = 0.15;
	alert.x = canvas.width / 2 - 200;
	alert.y = 275;

	stage.addChild(alert);

	messageField.text = "Oh no!!!\n\n\nYou chose\n\n" + selectedAlarm.text + "\n\nand initiated a statewide nuclear panic.\n\n\n\n\n\n\n\n\n\nThe citizens of Hawaii know a new terror\n\nthey've never before seen.\n\n\n\nClick to play again.";

}

function endGame(a) {
	
	stage.removeAllChildren();
	stage.clear();
	gameStarted = false; 

	mainCanvas.style.backgroundColor = "#000000";

	switch(a) {
		case alarms[0]:
			endGame1();
			break;
		case alarms[1]:
			endGame1();
			break;
		case alarms[2]:
			endGame1();
			break;
		case alarms[3]:
			endGame1();
			break;
		case alarms[4]:
			endGame3();
			break;
		case alarms[5]:
			endGame1();
			break;
		case alarms[6]:
			endGame2();
			break;
		case alarms[7]:
			endGame1();
			break;
		case alarms[8]:
			endGame1();
			break;
		case alarms[9]:
			endGame1();
			break;
	}

	stage.addChild(messageField);

	watchGameStart();
}
