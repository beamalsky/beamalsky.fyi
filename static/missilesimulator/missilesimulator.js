window.addEventListener("load", init);

function init() {

	canvas = document.getElementById("mainCanvas");
	stage = new createjs.Stage(canvas);
	stage.enableDOMEvents(true);

	createjs.Touch.enable(stage);
	createjs.Ticker.setFPS(60);

	createjs.Ticker.addEventListener("tick", tick);

	mainCanvas.style.backgroundColor = randomHex();

	createjs.Sound.registerSound("/missilesimulator/the_buzzcocks_why_cant_i_touch_it.mp3", "bgm");
	var bgm = createjs.Sound.play("bgm");
	console.log(bgm)

	//load sounds
	//createjs.Sound.registerSound("the_buzzcocks_why_cant_i_touch_it.mp3", "bgm");
	//var bgm = createjs.Sound.play("bgm");

	//loadSound();
}

function tick() {

	stage.update();

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