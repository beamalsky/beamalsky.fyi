var brickColors = [];
var brickid;
var destroy_count;

function init2() {
	
	brickColor1 = randomHex();
	brickColor2 = randomHex();
	brickColor3 = randomHex();
	brickColors = [brickColor1, brickColor2, brickColor3];

	createjs.Ticker.addEventListener("tick", tick2);
	stage.enableMouseOver(10);

	brick_down = 20
	createBrickGrid2(brick_across, brick_down);

	destroy_count = 0;

	stage.on("stagemousedown", function(event) {
		if (!bgmStarted) {
			bgm = createjs.Sound.play("bgm");
			bgmStarted = true;
		}
	});
}

function tick2() {
	if (createjs.Ticker.getTime() >= nextSwitch) {
		nextSwitch += LEVEL_TIME;
		resetLevel();
	}

	stage.update();
}

function createBrickGrid2(l, w) {
	for (var i = 0; i < l; i++)
	for (var j = 0; j < w; j++) {

		brick = new createjs.Shape();
		c = pickBrickColor(brickColors)
		brick.c = c;
		brick.i = bricks.length;
		brick.destroyed = false;

		brick.graphics.beginFill(c).beginStroke('#FFFFFF');
		brick.graphics.drawRect(0, 0, BRICKS_WIDTH, BRICKS_HEIGHT);
		brick.graphics.endFill();

		//destroy on mouse click
		brick.on("mousedown", function(event) {
			destroyBricks(this);
			destroy_count = 0;
		});

		brick.regX = BRICKS_WIDTH / 2;
		brick.regY = BRICKS_HEIGHT / 2;

		brick.x = i * (BRICKS_WIDTH + 10) + 40;
		brick.y = j * (BRICKS_HEIGHT + 5) + 20;
		brick.setBounds(brick.regX,brick.regY,BRICKS_WIDTH,BRICKS_HEIGHT);
		stage.addChild(brick);

		bricks.push(brick);
	}
}

function pickBrickColor(a) {
	var x = Math.floor(Math.random() * a.length)
	return a[x];
}

function destroyBricks(b) {

	destroyBrick(b);

	checkTop(b);
	checkBottom(b);
	checkRight(b);
	checkLeft(b);

	if (destroy_count === 1) {
		loseLife();
	} else {
		addToScore(destroy_count * 5);
		createjs.Sound.play("hit1");
	}
}

function destroyBrick(b) {
	createjs.Tween.get(b, {}).to({scaleX:0, scaleY:0}, 300);
	setTimeout(removeBrickFromScreen, 500);
	b.destroyed = true;
	destroy_count++;
}

function removeBrickFromScreen(brick) {
	stage.removeChild(brick);
}

function checkTop(b) {
	var top = bricks[b.i - 1];

	if (top && !top.destroyed && b.i > 0 && (b.i % brick_down) != 0 && b.c === top.c ) {
		destroyBricks(top);
		return true;
	} else {
		return false;
	}
}

function checkBottom(b) {
	var bottom = bricks[b.i + 1];

	if (bottom && !bottom.destroyed && b.i < bricks.length && ((b.i+1) % brick_down) != 0 && b.c === bottom.c) {
		destroyBricks(bottom);
		return true;
	} else {
		return false;
	}
}

function checkRight(b) {
	var right = bricks[b.i + brick_down];

	if (right && !right.destroyed && b.i < bricks.length - brick_down && b.c === right.c) {
		destroyBricks(right);
		return true;
	} else {
		return false;
	}
}

function checkLeft(b) {
	var left = bricks[b.i - brick_down];

	if (left && !left.destroyed && b.i > brick_down - 1 && b.c === left.c) {
		destroyBricks(left);
		return true;
	} else {
		return false;
	}
}