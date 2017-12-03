import Network from "./structures/Network.js";
import NetworkNode from "./structures/NetworkNode.js";
import Background from "./structures/Background.js";

var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

var network;
var mouseLeft;
var mouseRight;
var mouseMiddle;

var add;
var upgrade;

var addMode = true;

var xLast, yLast;

var xOffset = 0;
var yOffset = 0;
var scrollScale = 1;
var xDragPrev, yDragPrev;
var start = true;
var background;
var topBar;

var gameGroup, UIGroup;

var zoneRenderer;

function preload(){
	game.load.image('small_middle', 'src/assets/small_middle.png');
	game.load.image('small_left', 'src/assets/small_left.png');
	game.load.image('small_right', 'src/assets/small_right.png');
	game.load.image('small_up', 'src/assets/small_up.png');
	game.load.image('small_down', 'src/assets/small_down.png');
	game.load.image('medium_middle', 'src/assets/medium_middle.png');
	game.load.image('medium_left', 'src/assets/medium_left.png');
	game.load.image('medium_right', 'src/assets/medium_right.png');
	game.load.image('medium_up', 'src/assets/medium_up.png');
	game.load.image('medium_down', 'src/assets/medium_down.png');
	game.load.image('large_middle', 'src/assets/large_middle.png');
	game.load.image('large_left', 'src/assets/large_left.png');
	game.load.image('large_right', 'src/assets/large_right.png');
	game.load.image('large_up', 'src/assets/large_up.png');
	game.load.image('large_down', 'src/assets/large_down.png');
	game.load.image('play', 'src/assets/play.png');
	game.load.image('pause', 'src/assets/pause.png');
	game.load.image('add_road', 'src/assets/add_road.png');
	game.load.image('upgrade_road', 'src/assets/upgrade_road.png');
	game.load.image('house', 'src/assets/house.png');
	game.load.image('car1', 'src/assets/car1.png');
	game.load.image('car2', 'src/assets/car2.png');
	game.load.image('car3', 'src/assets/car3.png');
	game.load.image('background', 'src/assets/background.png');
}

function create(){
	gameGroup = game.add.group();
	UIGroup = game.add.group();
	background = new Background(1280/64, 720/64, game, gameGroup);
	topBar = game.add.graphics(0,0);
	topBar.beginFill(0x7a8699);
	topBar.lineTo(1280,0);
	topBar.lineTo(1280,52);
	topBar.lineTo(0,52);
	topBar.lineTo(0,0);
	topBar.endFill();
	UIGroup.add(topBar);

	game.stage.backgroundColor = "#66AACC";
	/*
	game.world.setBounds(-320, -180, 1600, 900);
	game.camera.x = game.width/2;
	game.camera.y = game.height/2;
	game.input.mouse.mouseWheelCallback = mouseScroll;
	*/
	game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	zoneRenderer = new ZoneRenderer(gameGroup);
	network = new Network(1280 / 64, 720/64, game, gameGroup, zoneRenderer);

	mouseLeft = game.input.activePointer.leftButton;
	mouseRight = game.input.activePointer.rightButton;
	mouseMiddle = game.input.activePointer.middleButton;

	game.input.activePointer.leftButton.onUp.add(resetXY, this);
	game.input.activePointer.rightButton.onUp.add(resetXY, this);
	game.input.activePointer.middleButton.onUp.add(resetDrag, this);
	

	add = game.add.button(1192,10, 'add_road',switchToAdd);
	add.fixedToCamera = true;
	add.smoothed = false;
	UIGroup.add(add);
	upgrade = game.add.button(1234,10, 'upgrade_road',switchToUpgrade);
	upgrade.fixedToCamera = true;
	upgrade.smoothed = false;
	UIGroup.add(upgrade);
}

function update(){
	if (mouseLeft.isDown){
		if (game.input.y > 52){
			var x = Math.floor((game.input.x - xOffset) / 64);
			var y = Math.floor((game.input.y - yOffset)/ 64);
			if (addMode){
				if (!network.getNode(x, y)){
					network.addRoad(x, y);
				}
			}else {
				if (network.getNode(x, y) && (x != xLast || y != yLast)){
					network.upgradeRoad(x, y);
				}
			}
			xLast = x;
			yLast = y;
		}		
	}
	if (mouseRight.isDown){
		if (game.input.y > 52){
			var x = Math.floor((game.input.x - xOffset) / 64);
			var y = Math.floor((game.input.y - yOffset) / 64);
			if (addMode){
				if (network.getNode(x, y)){
					network.removeRoad(x, y);
				}
			}else {
				if (network.getNode(x, y)&& (x != xLast || y != yLast)){
					network.downgradeRoad(x, y);
				}
			}
			xLast =x;
			yLast =y;
		}		
	}
	if (mouseMiddle.isDown){
		if(start){
			xDragPrev = game.input.x;
			yDragPrev = game.input.y;
			start = false;
		}
		else {
			xOffset+= game.input.x - xDragPrev;
			yOffset+= game.input.y - yDragPrev;

			xOffset = Phaser.Math.clamp(xOffset, -320, 320);
			yOffset = Phaser.Math.clamp(yOffset, -180, 180);

			network.setNetworkOffset(xOffset, yOffset);
			background.setOffset(xOffset, yOffset);

			xDragPrev = game.input.x;
			yDragPrev = game.input.y;
		}
	}	
}

function resetXY(){
	xLast = -1;
	yLast = -1;
}

function resetDrag(){
	start = true;
}

function switchToAdd(){
	addMode = true;
}

function switchToUpgrade(){
	addMode = false;
}

function mouseScroll(event){
	if (game.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP){
		scrollScale+=0.05;
	}else {
		scrollScale-=0.05;
	}
	scrollScale = Phaser.Math.clamp(scrollScale, 0.8, 3)
	game.world.scale.set(scrollScale);
}

function render(){

}