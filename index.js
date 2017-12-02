//Phaser
//import * as PIXI from "phaser-ce/build/custom/pixi.js";
//import * as p2 from "phaser-ce/build/custom/p2.js";
import * as Phaser from "./phaser/phaser.min.js";

import Network from "./structures/Network.js";


var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

var network = new Network(60,60);

function preload(){

}

function create(){

}

function update(){

}

function render(){

}


/*var worldScale;
var counter;

var keyLeft;
var keyRight;
var keySpace;

var tree;
var angle;
var scale;

var treeMap;
var growMap;
var toGrow;
var waters;

var leaves;
var treeNodes;
var waterGroup

var running;
var end;
var sprouting;
var leaf;

var play;
var sprout;

var music;
var plop;

function preload() {
	game.load.audio('background', 'background_song.ogg');
	game.load.audio('plop', 'water.ogg');
	game.load.image('ground','assets/ground.png' );
	game.load.image('lvl1','assets/level 1.png');
	game.load.image('lvl2', 'assets/level 2.png');
	game.load.image('lvl3', 'assets/level 3.png');
	game.load.image('tolvl2','assets/trans_to_lvl2.png');
	game.load.image('tolvl3','assets/trans_to_lvl3.png');
	game.load.image('water', 'assets/water.png');
	game.load.image('leaf', 'assets/leaf summer.png');
	game.load.image('play', 'assets/play_button.png');
	game.load.image('sprout', 'assets/sprout.png')
	
}

function create() {
	game.world.setBounds(0,0,4000,6000);
	worldScale = 1;
	counter = 0;
	
	keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	treeMap = [];
	growMap = [];
	waters = [];
	toGrow = [];
	
	scale = .5;
	angle = -Math.PI/2;
	
	running = false;
	end = false;
	sprouting = false;
	leaf = false;
	
	music = game.add.audio('background', 1,true);
	plop = game.add.audio('plop', 1, false);
	music.play();
	
	//adding lvl 1
	for (i =0; i < 10; i++){
		for (j = 0; j< 5; j++){
			game.add.image(0 + i*400,5850 -j*400, 'lvl1');
		}
	}
	//transition to lvl 2
	for (i = 0; i < 10; i++){
		game.add.image(0 + i * 400, 3850, 'tolvl2');
	}
	//adding lvl 2
	for (i =0; i < 10; i++){
		for (j = 0; j< 5; j++){
			game.add.image(0 + i*400,3450 -j*400, 'lvl2');
		}
	}
	//transition to lvl 3
	for (i = 0; i < 10; i++){
		game.add.image(0 + i * 400, 1450, 'tolvl3');
	}
	//adding lvl 3
	for (i =0; i < 10; i++){
		for (j = 0; j< 5; j++){
			game.add.image(0 + i*400,1050 -j*400, 'lvl3');
		}
	}
	//adding ground
	for (i = 0; i < 10; i++){
		game.add.image(0 + i *400,5850, 'ground');
	}
	
	treeNodes = game.add.group();
	leaves = game.add.group();
	waterGroup = game.add.group();
	tree = new TreeNode(2000,5850,scale, angle, 0x00c000 + 40 * 0x00ff00);
	
	for (i = 0; i< 500; i++){
		waters.push(new Water(Math.random()*4000,Math.random() * 5800));
	}
	
	play = game.add.button(200,200, 'play',play);
	play.anchor.setTo(0.5,0.5);
	play.fixedToCamera = true;
	sprout = game.add.button(200,400, 'sprout',sprout);
	sprout.anchor.setTo(0.5,0.5);
	sprout.fixedToCamera = true;
	
	game.camera.follow(tree.shape);	
}

function update() {
	if (running){
		if (counter % 15 == 0){
			temp = new TreeNode(tree.x, tree.y, tree.scale, toDegrees(Math.PI/2 + angle), tree.color);
			temp.setChild(tree);
			treeMap.push(tree);
			tree = temp;
			scale -= 0.01;
			tree.lightenColor();
			if (counter > 150) {
				leaf = true;
			}
		}
		tree.setScale(scale);
		counter++;
		
		if (leaf && counter % 60 == 0){
			treeMap[Math.round((Math.random()/2 + 0.5) *(treeMap.length - 4))].growLeaf(Math.random() < 0.5);
		}
		
		dx = Math.cos(angle);
		dy = Math.sin(angle);	
		tree.setX(tree.x += 2*dx);
		tree.setY(tree.y += 2*dy);
		
		if(keyLeft.isDown){
			angle-=0.025;
		}
		if (keyRight.isDown){
			angle+=0.025;
		}
		temp2Map = [];
		for (i = 0; i<waters.length; i++){		
			if(tree.pickedUp(waters[i])){
				scale += 0.05;
				waters[i].destroy();
				growMap.push(tree);
				plop.play();				
			}
			else {
				temp2Map.push(waters[i]);
			}					
		}		
		waters = temp2Map;
		
		tempMap = [];
		for (i = 0; i< growMap.length; i++){
			treeNode = growMap[i];
			if (treeNode.getChild()){
				tempMap.push(treeNode.getChild());
			}
			toGrow.push(treeNode);
		}
		growMap = tempMap;
		
		previous = sprouting;
		sprouting = false;
		for (i = 0; i< treeMap.length - 8; i++){
			if (tree.collides(treeMap[i])){
				if (previous){
					sprouting = true;
				}
				else {
					endGame();
				}				
			}		
		}
		
		while (toGrow.length > 0){
			toGrow[0].grow(0.05);
			toGrow.splice(0,1);
		}	
		
		if (scale < 0.1){
			endGame();
		}
		
		if(running){
			game.camera.follow(tree.shape);
		}		
	}
	else {
		if(end){			
			if (worldScale > .1){
				worldScale -= 0.01;
				game.world.scale.set(worldScale);
			}
			else {
				play.visible = true;
				sprout.visible = true;
			}			
			if (keySpace.isDown){
				if(play.visible){
					play.visible = false;
					sprout.visible = false;
				}
				else{
					play.visible = true;
					play.visible = true;
				}			
			}		
		}
		else {			
		}
	}	
}

function toDegrees(angle){
	return angle * (180 / Math.PI);
}

function endGame(){
	running = false;
	end = true;
	game.camera.unfollow()
	game.camera.focusOnXY(0,0);
	game.world.pivot.x = 0;
	game.world.pivot.y = 0;
	play.scale.x = 10;
	play.scale.y = 10;
	sprout.scale.x = 10;
	sprout.scale.y = 10;
}
function reset(){
	play.visible = false;
	sprout.visible = false;
	play.scale.x = 1;
	play.scale.y = 1;
	sprout.scale.x = 1;
	sprout.scale.y = 1;
	
	sprouting = false;
	running = true;
	end = false;
	worldScale = 1;
	game.world.scale.set(worldScale);
	scale = .5;
	treeMap = [];
	growMap = [];
	waters = [];
	toGrow = [];
	
	angle = -Math.PI/2;	
	counter = 0;
	leaf = false;
	treeNodes.destroy();
	leaves.destroy();
	waterGroup.destroy();
	treeNodes = game.add.group();
	leaves = game.add.group();
	waterGroup = game.add.group();
	tree = new TreeNode(2000,5850,scale, angle, 0x00c000 + 40 * 0x00ff00);
	for (i = 0; i< 500; i++){
		waters.push(new Water(Math.random()*4000,Math.random() * 5800));
	}
	game.camera.follow(tree.shape);
	play.bringToTop();
	sprout.bringToTop();
}

function play(){
	if (end){
		reset();
	}
	else {
		running = true;
		play.visible = false;
		sprout.visible = false;
	}
	
}

function sprout(){
	if (end){
		candidate = treeMap[Math.round(Math.random() * treeMap.length)];
		while(candidate.scale < .5){
			candidate = treeMap[Math.round(Math.random() * treeMap.length)];
		}
		tree = new TreeNode(candidate.x, candidate.y,0.5, candidate.angle, 0x00c000 + 40 * 0x00ff00);
		tree.setChild(candidate.getChild());
		play.visible = false;
		sprout.visible = false;
		play.scale.x = 1;
		play.scale.y = 1;
		sprout.scale.x = 1;
		sprout.scale.y = 1;
		
		running = true;
		end = false;
		worldScale = 1;
		game.world.scale.set(worldScale);
		scale = tree.scale;
		growMap = [];
		toGrow = [];
		
		angle = tree.angle;	
		counter = 0;
		leaf = false;
		game.camera.follow(tree.shape);
		sprouting = true;
	}
	else {
		running = true;
		play.visible = false;
		sprout.visible = false;
	}
}


function render(){
}
*/