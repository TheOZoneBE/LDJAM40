/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ZoneManager_js__ = __webpack_require__(5);


class NetworkNode {
    constructor(x, y, network){
        this.x = x;
        this.y = y;
        this.xOffset = 0;
        this.yOffset = 0;
        this.connections = new Set();
        this.network = network;
        this.level = 1;
        this.middleSprites = {
            1: 'small_middle',
            2: 'medium_middle',
            3: 'large_middle'
        };
        this.sprite = {
            mid: network.game.add.sprite(x* 64, y * 64, this.middleSprites[this.level]),
            1: null,
            2: null,
            3: null,
            4: null
        };
        network.group.add(this.sprite.mid);
        this.dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        this.conSprites = {
            1: {
                1: 'small_right',
                2: 'medium_right',
                3: 'large_right'
            },
            2: {
                1: 'small_down',
                2: 'medium_down',
                3: 'large_down'
            },
            3: {
                1: 'small_left',
                2: 'medium_left',
                3: 'large_left'
            },
            4: {
                1: 'small_up',
                2: 'medium_up',
                3: 'large_up'
            }            
        };
        this.zoneManager = new __WEBPACK_IMPORTED_MODULE_0__ZoneManager_js__["a" /* default */](this, network.zoneRenderer);
        this.checkConnections();
    }

    getIndex(x, y){
        return Math.abs(x)*(2 - x) + Math.abs(y)*(3 - y);
    }

    getDir(con){
        return [con.x -this.x,con.y - this.y];
    }
    
    checkConnections(){
        this.dirs.forEach(dir => {
            var node = this.network.getNode(this.x + dir[0], this.y + dir[1]);
            if (node){
                this.addConnection(node);
                node.addConnection(this);
            }
        });
    }

    addConnection(networkNode){
        this.connections.add(networkNode);
        var dir = this.getDir(networkNode);
        
        var con = this.network.game.add.sprite(
             this.x * 64 + this.xOffset, 
             this.y * 64 + this.yOffset, 
             this.conSprites[this.getIndex(dir[0], dir[1])][this.level]
        );
        this.network.group.add(con)
        this.sprite[this.getIndex(dir[0], dir[1])] = con;

        //UPDATE ZONES
        this.zoneManager.addConnection(networkNode);
    }

    removeConnection(networkNode){
        this.connections.delete(networkNode);
        var dir = this.getDir(networkNode);
        this.sprite[this.getIndex(dir[0], dir[1])].destroy();
        this.sprite[this.getIndex(dir[0], dir[1])] = null;

        //UPDATE ZONES
        this.zoneManager.removeConnection(networkNode);
    }   

    getConnections(){
        return this.connections;
    }

    upgrade(){
        if(this.level < 3){
            this.level++;
            this.sprite.mid.destroy();
            this.sprite.mid = this.network.game.add.sprite(
                this.x * 64 + this.xOffset, 
                this.y * 64 + this.yOffset,
                this.middleSprites[this.level]);
            this.network.group.add(this.sprite.mid);
            this.dirs.forEach(dir => {
                var index = this.getIndex(dir[0], dir[1]);
                if (this.sprite[index]){
                    this.sprite[index].destroy();
                    this.sprite[index] = this.network.game.add.sprite(
                        this.x * 64 + this.xOffset, 
                        this.y * 64 + this.yOffset, 
                        this.conSprites[index][this.level]);
                    this.network.group.add(this.sprite[index]);
                }
            });

            //UPDATE ZONES
            this.zoneManager.upgrade();
            return true;
        }        
        return false;
    }

    downgrade(){
        if (this.level > 1){
            this.level--;
            this.sprite.mid.destroy();
            this.sprite.mid = this.network.game.add.sprite(
                this.x * 64 + this.xOffset, 
                this.y * 64 + this.yOffset, 
                this.middleSprites[this.level]);
            this.network.group.add(this.sprite.mid);
            this.dirs.forEach(dir => {
                var index = this.getIndex(dir[0], dir[1]);
                if (this.sprite[index]){
                    this.sprite[index].destroy();
                    this.sprite[index] = this.network.game.add.sprite(
                        this.x * 64 + this.xOffset, 
                        this.y * 64 + this.yOffset, 
                        this.conSprites[index][this.level]);
                    this.network.group.add(this.sprite[index]);
                }
            });

            //UPDATE ZONES
            this.zoneManager.downgrade();
            return true;
        }
        return false;
    }

    setOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.sprite.mid.x = this.x * 64 + xOffset;
        this.sprite.mid.y = this.y * 64 + yOffset;
        for (var i = 1; i < 5; i++){
            if (this.sprite[i]){
                this.sprite[i].x = this.x * 64 + xOffset;
                this.sprite[i].y = this.y * 64 + yOffset;
            }
        }
    }

    getEntryZone(x, y){
        return this.zoneManager.entryMap[this.getIndex(x, y)];
    }

    getTurnZone(x, y){
        return this.zoneManager.turnMap[this.getIndex(x, y)];
    }

    getNextZone(zone){
        return this.zoneManager.zoneMap.get(zone);
    }

    destroy(){
        this.connections.forEach(con => {
            con.removeConnection(this);
        })
        this.sprite.mid.destroy()
        this.dirs.forEach(dir => {
            var index = this.getIndex(dir[0], dir[1])
            if (this.sprite[index]){
                this.sprite[index].destroy();
            }
        });

        //UPDATE ZONES
        this.zoneManager.destroy();
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = NetworkNode;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Car_js__ = __webpack_require__(2);


class Destination {
    constructor(x, y,node, spawnRate, manager){
        this.x = x;
        this.y = y;
        this.manager = manager;
        this.spawnRate = spawnRate;
        this.timer = spawnRate;
        this.carChoice = ['car1', 'car2', 'car3'];
        this.type = 'destination';
        this.cars = new Set();
    }

    update(){
        if (this.timer === 0){
            this.timer = this.spawnRate;
            this.spawnCar();
        }
        else {
            this.timer--;
        }
    }

    spawnCar(){
        var dest = this.manager.getRandomDestination(this);
        var car = new __WEBPACK_IMPORTED_MODULE_0__Car_js__["a" /* default */](
            this.manager.network, 
            this, dest, 
            this.manager.nextId(), 
            this.carChoice[Math.floor(Math.random() * this.carChoice.length)]);
        this.manager.carManager.addCar(car);
        this.cars.add(car);
    }

    //just act as zone
    addCar(car){
        this.manager.carManager.removeCar(car);
        this.manager.score++;
        if (this.spawnRate > 0) {
            this.spawnRate--;
        }
    }

    removeCar(car){
        this.cars.delete(car);
    }

    getScore(){
        return 1;
    }

    hasFreeSpace(){
        return true;
    }
    /*
    getNextZone(){
        return this.node.getNextZone(this);
    }*/

    getTurnZone(x, y){        
        if (this.node){
            return this.node.getTurnZone(x, y);    
        }else {
            return null;
        }
        
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Destination;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__solver_RouteSolver_js__ = __webpack_require__(7);


class Car {
    
    constructor(network, startDest, endDest, id, spriteName){
        this.network = network;
        this.id = id;
        this.spriteName = spriteName;
        this.wait = 0;
        this.startDest = startDest;
        this.zone = startDest;
        //this.zone.addCar(this);
        this.endDest = endDest;
        this.pathIndex = 0;
        this.path = null;
        this.calculatePath();
    }
    
    //gets called every time network changes
    calculatePath(){
        this.path = __WEBPACK_IMPORTED_MODULE_0__solver_RouteSolver_js__["a" /* default */].shortestRoute(
            this.network, 
            this.zone.x, 
            this.zone.y, 
            this.endDest.x, 
            this.endDest.y
        );
        if (this.path){
            this.pathIndex = this.path.length - 1;
        } 
        else {
            this.backToStart();
        }       
    }

    backToStart(){
        this.zone.removeCar(this);
        this.zone = this.startDest;
    }

    updateWait(){
        this.wait++;
    }

    getNextZone(){
        if (this.path){            
            if(this.zone.type === 'exit'){
                if (this.pathIndex  > 1){
                    var dir = this.getNextDir();
                    return this.getNextNode().getEntryZone(-dir[0], -dir[1]);
                }else {
                    return this.endDest;
                }
                
            }
            else if (this.zone.type === 'destination'){
                var dir = this.getNextDir();
                return this.zone.getTurnZone(dir[0], dir[1]);
            }
            else if (this.zone.type === 'turn') {
                var dir = this.getNextDir();
                return this.zone.getTurnZone(dir[0], dir[1]);
            }
            else {
                return this.zone.getNextZone();
            }
        }
        else {
            return null;
        }
        
    }

    getNextNode(){        
        this.pathIndex--;
        return this.path[this.pathIndex];
    }

    getNextDir(){
        var cur = this.path[this.pathIndex];
        var next = this.path[this.pathIndex - 1];
        return [next.x - cur.x, next.y -  cur.y];
    }

    getZone(){
        return this.zone;
    }

    moveTo(newZone){
        this.zone.removeCar(this);
        this.zone = newZone;
        this.zone.addCar(this);
        this.wait = 0;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Car;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__structures_Network_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__structures_NetworkNode_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__structures_Background_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__renderer_ZonesRenderer_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__renderer_DestinationRenderer_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__structures_DestinationManager_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__structures_Car_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__structures_CarManager_js__ = __webpack_require__(13);









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
var endBar;

var roadGroup, carGroup, UIGroup, destGroup, endGroup;

var zonesRenderer, destinationRenderer;
var destinationManager, carManager;

var music, addSound, remSound, upSound, downSound, alarmSound;
var textStyle, endStyle, btnStyle;
var carAmount, scoreAmount, upAmount;
var endText, endScore, endBottom;
var tryAgain;
var tryText;
var end = false;
var ups = 0;

function preload(){
	game.load.audio('music', 'src/assets/LDJAM40.ogg');
	game.load.audio('add_road_sound', 'src/assets/add_road.ogg');
	game.load.audio('remove_road_sound', 'src/assets/remove_road.ogg');
	game.load.audio('upgrade_road_sound', 'src/assets/upgrade_road.ogg');
	game.load.audio('downgrade_road_sound', 'src/assets/downgrade_road.ogg');
	game.load.audio('alarm_sound', 'src/assets/alarm.ogg');

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
	game.load.image('button', 'src/assets/button.png');

	textStyle = { font: "bold 32px Tahoma, Geneva, sans-serif", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
	endStyle = { font: "bold 128px Tahoma, Geneva, sans-serif", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
	btnStyle =  { font: "bold 64px Tahoma, Geneva, sans-serif", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
	
}

function create(){
	music = game.add.audio('music', 1,true);
	addSound = game.add.audio('add_road_sound', 0.5, false);
	remSound = game.add.audio('remove_road_sound', 0.5, false);
	upSound = game.add.audio('upgrade_road_sound', 0.5, false);
	downSound = game.add.audio('downgrade_road_sound', 0.5, false);
	alarmSound = game.add.audio('alarm_sound', 0.25 , false);

	
	music.play();

	
	roadGroup = game.add.group();
	//TODO update dest sprite
	destGroup = game.add.group();
	
	carGroup = game.add.group();
	UIGroup = game.add.group();
	endGroup = game.add.group();
	carManager = new __WEBPACK_IMPORTED_MODULE_7__structures_CarManager_js__["a" /* default */](alarmSound);
	background = new __WEBPACK_IMPORTED_MODULE_2__structures_Background_js__["a" /* default */](1280/64, 720/64, game, roadGroup, carManager);
	topBar = game.add.graphics(-2,-2);
	topBar.beginFill(0x7a8699);
	topBar.lineStyle(4, 0x6a7689, 1)
	topBar.lineTo(1282,-2);
	topBar.lineTo(1282,52);
	topBar.lineTo(52,52);
	topBar.lineTo(52,724);
	topBar.lineTo(-2,724);
	topBar.lineTo(-2,-2);
	topBar.endFill();
	UIGroup.add(topBar);

	add = game.add.button(1192,10, 'add_road',switchToAdd);
	add.fixedToCamera = true;
	add.smoothed = false;
	UIGroup.add(add);
	upgrade = game.add.button(1234,10, 'upgrade_road',switchToUpgrade);
	upgrade.fixedToCamera = true;
	upgrade.smoothed = false;
	upgrade.alpha= 0.5;
	UIGroup.add(upgrade);


	UIGroup.add(game.add.text(10,8, "Cars:", textStyle));
	UIGroup.add(game.add.text(250,8, "Score:", textStyle));
	UIGroup.add(game.add.text(510,8, "Upgrades:", textStyle));
	carAmount = game.add.text(110,8, "0", textStyle);
	scoreAmount = game.add.text(370,8, "0", textStyle);
	upAmount = game.add.text(700,8, "0", textStyle);
	UIGroup.add(carAmount);
	UIGroup.add(scoreAmount);
	UIGroup.add(upAmount);

	endBar = game.add.graphics(0,0);
	endBar.beginFill(0)
	endBar.lineTo(1280, 0);
	endBar.lineTo(1280,720);
	endBar.lineTo(0, 720);
	endBar.lineTo(0,0);
	endBar.endFill();
	endGroup.add(endBar);
	endBar.alpha = 0.75;
	//endBar.visible = false;
	endText = game.add.text(0,0, "GAME OVER", endStyle);
	endScore = game.add.text(0, 0, "0", endStyle);
	endBottom = game.add.text(0, 0, "cars reached their destination", textStyle);
	endText.setTextBounds(0, 50, 1280, 200);
	endScore.setTextBounds(0, 200, 1280, 200);
	endBottom.setTextBounds(0, 350, 1280, 100);
	//endText.visible = false;
	//endScore.visible = false;
	//endBottom.visible = false;
	endGroup.add(endText);
	endGroup.add(endScore);
	endGroup.add(endBottom);
	tryAgain = game.add.button(440,480, 'button', tryAgain);
	tryText = game.add.text(0,0, "AGAIN", btnStyle);
	tryText.setTextBounds(440,480,400,200);
	endGroup.add(tryAgain);
	endGroup.add(tryText);
	endGroup.visible = false;

	game.stage.backgroundColor = "#66AACC";
	/*
	game.world.setBounds(-320, -180, 1600, 900);
	game.camera.x = game.width/2;
	game.camera.y = game.height/2;
	game.input.mouse.mouseWheelCallback = mouseScroll;
	*/
	game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
	zonesRenderer = new __WEBPACK_IMPORTED_MODULE_3__renderer_ZonesRenderer_js__["a" /* default */](game, carGroup);
	network = new __WEBPACK_IMPORTED_MODULE_0__structures_Network_js__["a" /* default */](1280 / 64, 720/64, game, roadGroup, zonesRenderer);

	
	destinationRenderer = new __WEBPACK_IMPORTED_MODULE_4__renderer_DestinationRenderer_js__["a" /* default */](game, destGroup);	
	destinationManager = new __WEBPACK_IMPORTED_MODULE_5__structures_DestinationManager_js__["a" /* default */](network, destinationRenderer, carManager);

	mouseLeft = game.input.activePointer.leftButton;
	mouseRight = game.input.activePointer.rightButton;
	mouseMiddle = game.input.activePointer.middleButton;

	game.input.activePointer.leftButton.onUp.add(resetXY, this);
	game.input.activePointer.rightButton.onUp.add(resetXY, this);
	game.input.activePointer.middleButton.onUp.add(resetDrag, this);
	

	
}

var lastCarUpdate = (new Date).getTime()
var lastUp = 0;
function update(){
	if (!end){
	if (mouseLeft.isDown){
		if (game.input.y > 52){
			var x = Math.floor((game.input.x - xOffset) / 64);
			var y = Math.floor((game.input.y - yOffset)/ 64);
			if (addMode){
				if (!network.getNode(x, y)){
					var stat = network.addRoad(x, y);
					if(stat){
						carManager.networkUpdate();
						destinationManager.networkUpdate();
						addSound.play();
					}
				}
			}else {
				if (network.getNode(x, y) && (x != xLast || y != yLast)){
					if (ups > 0){
						var stat = network.upgradeRoad(x, y);
						if(stat){
							carManager.networkUpdate();
							destinationManager.networkUpdate();
							upSound.play()
							ups--;
						}
					}
					
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
					var temp = network.getNode(x, y)
					var stat = network.removeRoad(x, y);
					if(stat){
						carManager.networkUpdate();
						destinationManager.networkUpdate();
						remSound.play();
						ups += temp.level - 1;
					}
				}
			}else {
				if (network.getNode(x, y)&& (x != xLast || y != yLast)){
					var stat = network.downgradeRoad(x, y);
					if(stat){
						carManager.networkUpdate();
						destinationManager.networkUpdate();
						downSound.play();
						ups++;
					}
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
			zonesRenderer.setOffset(xOffset, yOffset);
			destinationRenderer.setOffset(xOffset, yOffset);

			xDragPrev = game.input.x;
			yDragPrev = game.input.y;
		}
	}
	
	var time = (new Date).getTime();
	if (time - lastCarUpdate > 500){
		lastCarUpdate = time;
		carManager.update();
		destinationManager.update();
		background.updateTints();
		carAmount.text = "" + carManager.cars.size;
		scoreAmount.text = "" + destinationManager.score;
		if (destinationManager.score - lastUp > 10){
			ups++;
			lastUp+=10
		}
		if(carManager.checkAlarm()){
			alarmSound.play();
		}

		upAmount.text = "" + ups;
	}
	if(carManager.checkEnd()){
		endGroup.visible = true
		end = true;
		endScore.text = "" + destinationManager.score;
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
	add.alpha = 1;
	upgrade.alpha = 0.5;
	addMode = true;
}

function switchToUpgrade(){
	add.alpha = 0.5;
	upgrade.alpha = 1;
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



function tryAgain(){
	xOffset = 0;
	yOffset = 0;
	endGroup.visible = false;
	network.reset();
	destinationManager.reset();
	carManager.reset();
	background.reset();
	end = false;
	ups = 0;
}

function render(){

}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NetworkNode_js__ = __webpack_require__(0);


class Network{
    constructor(width, height, game, group, zoneRenderer){
        this.width = width;
        this.height = height;
        this.game = game;
        this.group = group;
        this.zoneRenderer = zoneRenderer;
        this.network = [];
        this.xOffset = 0;
        this.yOffset = 0;
    }

    inside(x, y){
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    getNode(x, y){
        if (this.inside(x, y)){
            return this.network[x + y* this.width];
        }else {
            return null;
        }        
    }

    setNode(x, y, networkNode){
        this.network[x + y* this.width] = networkNode;
    }

    addRoad(x, y){
        if(this.inside(x, y)){
            var newNode = new __WEBPACK_IMPORTED_MODULE_0__NetworkNode_js__["a" /* default */](x, y, this);
            newNode.setOffset(this.xOffset, this.yOffset);
            this.setNode(x, y, newNode);
            return true;
        }
        return false
    }
    
    removeRoad(x, y){
        var removeNode = this.getNode(x, y);
        this.setNode(x, y, null);
        removeNode.destroy();
        return true;
    }

    upgradeRoad(x, y){
        return this.getNode(x, y).upgrade();
    }

    downgradeRoad(x ,y){
        return this.getNode(x, y).downgrade();
    }

    setNetworkOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        for (var i = 0; i < this.width; i++){
            for(var j = 0; j < this.height; j++){
                if (this.getNode(i, j)){
                    this.getNode(i, j).setOffset(xOffset, yOffset);
                }
            }
            
        }
    }

    reset(){
        this.xOffset =0;
        this.yOffset =0;
        this.network.forEach(node => {
            if (node){
                node.destroy();
            }            
        });
        this.network = [];
        this.zoneRenderer.reset();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Network;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Zone_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Destination_js__ = __webpack_require__(1);



class ZoneManager {
    constructor(node, zoneRenderer){
        this.node = node;
        this.zoneRenderer = zoneRenderer;
        this.level = 1;
        this.dirs = new Set();
        this.entryMap = [];
        this.turnMap = [];
        this.zoneMap = new Map();
    }

    getIndex(x, y){
        return Math.abs(x)*(2 - x) + Math.abs(y)*(3 - y);
    }

    getDir(con){
        return [con.x -this.node.x,con.y - this.node.y];
    }

    addConnection(networkNode){
        //get dir
        var dir = this.getDir(networkNode);
        this.dirs.add(this.getIndex(dir[0], dir[1]));
        this.regenerateZones();
    }

    removeConnection(networkNode){
        //get dir
        var dir = this.getDir(networkNode);
        this.dirs.delete(this.getIndex(dir[0], dir[1]));
        this.regenerateZones();
    }

    resetAllCars(){
        var cars = new Set();
        if (this.entryMap[1]){
            this.entryMap[1].cars.forEach(car =>{
                car.backToStart();
            });
        }
        if (this.entryMap[2]) {
            this.entryMap[2].cars.forEach(car =>{
                car.backToStart();
            });
        }
        if (this.entryMap[3]) {
            this.entryMap[3].cars.forEach(car =>{
                car.backToStart();
            });
        }
        if (this.entryMap[4]) {
            this.entryMap[4].cars.forEach(car =>{
                car.backToStart();
            });
        }

        if (this.turnMap[1]) {
            this.turnMap[1].cars.forEach(car =>{
                car.backToStart();
            });
        }
        if (this.turnMap[2]) {
            this.turnMap[2].cars.forEach(car =>{
                car.backToStart();
            });
        }
        if (this.turnMap[3]) {
            this.turnMap[3].cars.forEach(car =>{
                car.backToStart();
            });
        }
        if (this.turnMap[4]) {
            this.turnMap[4].cars.forEach(car =>{
                car.backToStart();
            });
        }

        for (let zone of this.zoneMap.values()){
            zone.cars.forEach(car => {
                car.backToStart();
            });
        }       
    }

    reset(){
        
        //first get all cars and put in temporary destination zone
        this.resetAllCars();
        
        this.destroy();

        //reset maps
        this.entryMap = [];
        this.turnMap = [];
        this.zoneMap = new Map();       
    }

    //PLS DONT LOOK!
    regenerateZones(){        
        this.reset();

        if (this.dirs.has(1)){
            if (this.level === 1){
                var entry = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 7, 3, 'normal', 1,this.zoneRenderer);
                this.entryMap[1] = entry;
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 6, 3, 'normal', 1,this.zoneRenderer);
                this.zoneMap.set(entry, next1);
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 5, 3, 'turn', 1,this.zoneRenderer);
                this.zoneMap.set(next1, turn);
                var next2 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 4,4, 'normal', 1,this.zoneRenderer);
                this.turnMap[1] = next2;
                var next3 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 5,4, 'normal', 1,this.zoneRenderer);
                this.zoneMap.set(next2, next3);
                var next4 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 6, 4, 'normal', 1,this.zoneRenderer);
                this.zoneMap.set(next3, next4);
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 7,4, 'exit', 1,this.zoneRenderer);
                this.zoneMap.set(next4, exit);
            }
            else if (this.level === 2){
                var entry = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 7, 2, 'normal',1, this.zoneRenderer);
                this.entryMap[1] = entry;
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 6, 2, 'turn', 1,this.zoneRenderer);
                this.zoneMap.set(entry, turn);
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](4, this.node, 4,4, 'normal', 1,this.zoneRenderer);
                this.turnMap[1] = next1;
                var next2 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 6,4, 'normal', 1,this.zoneRenderer);
                this.zoneMap.set(next1, next2);
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 7,4, 'exit', 1,this.zoneRenderer);
                this.zoneMap.set(next2, exit);
            }
            else { 
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](3, this.node, 7, 1, 'turn', 1,this.zoneRenderer);
                this.entryMap[1] = turn;
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](9, this.node, 4,4, 'normal', 1,this.zoneRenderer);
                this.turnMap[1] = next1;
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](3, this.node, 7,4, 'exit', 1,this.zoneRenderer);
                this.zoneMap.set(next1, exit);
            }
        }
        if (this.dirs.has(2)){
            if (this.level === 1){
                var entry = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 4, 7, 'normal', 2,this.zoneRenderer);
                this.entryMap[2] = entry;
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 4, 6, 'normal', 2,this.zoneRenderer);
                this.zoneMap.set(entry, next1);
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 4, 5, 'turn', 2,this.zoneRenderer);
                this.zoneMap.set(next1, turn);
                var next2 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 3,4, 'normal', 2,this.zoneRenderer);
                this.turnMap[2] = next2;
                var next3 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 3,5, 'normal', 2,this.zoneRenderer);
                this.zoneMap.set(next2, next3);
                var next4 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 3, 6, 'normal', 2,this.zoneRenderer);
                this.zoneMap.set(next3, next4);
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 3,7, 'exit', 2,this.zoneRenderer);
                this.zoneMap.set(next4, exit);
            }
            else if (this.level === 2){
                var entry = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 4, 7, 'normal',2, this.zoneRenderer);
                this.entryMap[2] = entry;
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 4, 6, 'turn', 2,this.zoneRenderer);
                this.zoneMap.set(entry, turn);
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](4, this.node, 2,4, 'normal', 2,this.zoneRenderer);
                this.turnMap[2] = next1;
                var next2 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 2,6, 'normal', 2,this.zoneRenderer);
                this.zoneMap.set(next1, next2);
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 2,7, 'exit', 2,this.zoneRenderer);
                this.zoneMap.set(next2, exit);
            }
            else {
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](3, this.node, 4, 7, 'turn', 2,this.zoneRenderer);
                this.entryMap[2] =turn;
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](9, this.node, 1,4, 'normal', 2,this.zoneRenderer);
                this.turnMap[2] = next1;
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](3, this.node, 1,7, 'exit', 2,this.zoneRenderer);
                this.zoneMap.set(next1, exit);
            }
        }
        if (this.dirs.has(3)){
            if (this.level === 1){
                var entry = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 0, 4, 'normal', 3,this.zoneRenderer);
                this.entryMap[3] = entry;
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 1, 4, 'normal', 3,this.zoneRenderer);
                this.zoneMap.set(entry, next1);
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 2, 4, 'turn', 3,this.zoneRenderer);
                this.zoneMap.set(next1, turn);
                var next2 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 3,3, 'normal', 3,this.zoneRenderer);
                this.turnMap[3] = next2;
                var next3 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 2,3, 'normal', 3,this.zoneRenderer);
                this.zoneMap.set(next2, next3);
                var next4 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 1, 3, 'normal', 3,this.zoneRenderer);
                this.zoneMap.set(next3, next4);
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 0,3, 'exit',3, this.zoneRenderer);
                this.zoneMap.set(next4, exit);
            }
            else if (this.level === 2){
                var entry = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 0, 4, 'normal',3, this.zoneRenderer);
                this.entryMap[3] = entry;
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 1, 4, 'turn', 3,this.zoneRenderer);
                this.zoneMap.set(entry, turn);
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](4, this.node, 2,2, 'normal', 3,this.zoneRenderer);
                this.turnMap[3] = next1;
                var next2 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 1,2, 'normal', 3,this.zoneRenderer);
                this.zoneMap.set(next1, next2);
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 0,2, 'exit', 3,this.zoneRenderer);
                this.zoneMap.set(next2, exit);
            }
            else {
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](3, this.node, 0, 4, 'turn', 3,this.zoneRenderer);
                this.entryMap[3] = turn;
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](9, this.node, 1,1, 'normal', 3,this.zoneRenderer);
                this.turnMap[3] = next1;
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](3, this.node, 0,1, 'exit', 3,this.zoneRenderer);
                this.zoneMap.set(next1, exit);
            }
        }
        if (this.dirs.has(4)){
            if (this.level === 1){
                var entry = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 3, 0, 'normal',4, this.zoneRenderer);
                this.entryMap[4] = entry;
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 3, 1, 'normal', 4,this.zoneRenderer);
                this.zoneMap.set(entry, next1);
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 3, 2, 'turn', 4,this.zoneRenderer);
                this.zoneMap.set(next1, turn);
                var next2 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 4,3, 'normal', 4,this.zoneRenderer);
                this.turnMap[4] = next2;
                var next3 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 4,2, 'normal', 4,this.zoneRenderer);
                this.zoneMap.set(next2, next3);
                var next4 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 4, 1, 'normal', 4,this.zoneRenderer);
                this.zoneMap.set(next3, next4);
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](1, this.node, 4,0, 'exit', 4,this.zoneRenderer);
                this.zoneMap.set(next4, exit);
            }
            else if (this.level === 2){
                var entry = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 2, 0, 'normal',4, this.zoneRenderer);
                this.entryMap[4] = entry;
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 2, 1, 'turn', 4,this.zoneRenderer);
                this.zoneMap.set(entry, turn);
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](4, this.node, 4,2, 'normal', 4,this.zoneRenderer);
                this.turnMap[4] = next1;
                var next2 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 4,1, 'normal', 4,this.zoneRenderer);
                this.zoneMap.set(next1, next2);
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](2, this.node, 4,0, 'exit', 4,this.zoneRenderer);
                this.zoneMap.set(next2, exit);
            }
            else {
                var turn = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](3, this.node, 1, 0, 'turn', 4,this.zoneRenderer);
                this.entryMap[4] = turn;
                var next1 = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](9, this.node, 4,1, 'normal', 4,this.zoneRenderer);
                this.turnMap[4] = next1;
                var exit = new __WEBPACK_IMPORTED_MODULE_0__Zone_js__["a" /* default */](3, this.node, 4,0, 'exit', 4,this.zoneRenderer);
                this.zoneMap.set(next1, exit);
            }
        }
    }

    upgrade(){
        this.level++;
        this.regenerateZones();
    }

    downgrade(){
        this.level--
        this.regenerateZones();
    }

    destroy(){
        //call all destroy on zoneRenderer
        if (this.entryMap[1]) this.entryMap[1].destroy();
        if (this.entryMap[2]) this.entryMap[2].destroy();
        if (this.entryMap[3]) this.entryMap[3].destroy();
        if (this.entryMap[4]) this.entryMap[4].destroy();

        if (this.turnMap[1]) this.turnMap[1].destroy();
        if (this.turnMap[2]) this.turnMap[2].destroy();
        if (this.turnMap[3]) this.turnMap[3].destroy();
        if (this.turnMap[4]) this.turnMap[4].destroy();

        for (let zone of this.zoneMap.values()){
            zone.destroy();
        }        
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ZoneManager;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Zone {
    //type =  turn, exit, destination, road: dest == turn?
    constructor(space, node, nodeX, nodeY, type, index, renderer){
        this.space = space;
        this.node = node;
        this.x = node.x;
        this.y = node.y;
        this.nodeX = nodeX;
        this.nodeY = nodeY;
        this.type = type;
        this.index = index;
        this.renderer = renderer;
        this.zoneRenderer = renderer.addZone(this);
        this.cars = new Set();
    }

    addCar(car){
        this.cars.add(car);
        this.zoneRenderer.addCar(car);
    }

    removeCar(car){
        this.cars.delete(car);
        this.zoneRenderer.removeCar(car);
    }

    getScore(){
        return (this.space - this.cars.size) / this.space;
    }

    hasFreeSpace(){
        return this.cars.size < this.space;
    }

    getNextZone(){
        return this.node.getNextZone(this);
    }

    getTurnZone(x, y){
        return this.node.getTurnZone(x, y);
    }
    
    destroy(){
        this.renderer.removeZone(this);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Zone;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class RouteSolver {
    static shortestRoute(network, startX, startY, endX, endY){
        //console.log("calculating route: " + startX + ", " + startY + "->" + endX + ", " + endY);
        if (!network.getNode(startX, startY) || !network.getNode(endX, endY)){
            return null;
        }
        var start = network.getNode(startX, startY);
        var goal =  network.getNode(endX, endY);

        // The set of nodes already evaluated
        var closedSet = new Set();
    
        // The set of currently discovered nodes that are not evaluated yet.
        // Initially, only the start node is known.
        var openSet = new Set();
        openSet.add(start);
    
        // For each node, which node it can most efficiently be reached from.
        // If a node can be reached from many nodes, cameFrom will eventually contain the
        // most efficient previous step.
        var cameFrom = new Map();
    
        // For each node, the cost of getting from the start node to that node.
        var gScore = new Map(); //map with default value of Infinity
    
        // The cost of going from start to start is zero.
        gScore.set(start, 0);
    
        // For each node, the total cost of getting from the start node to the goal
        // by passing by that node. That value is partly known, partly heuristic.
        var fScore = new Map(); //map with default value of Infinity
    
        // For the first node, that value is completely heuristic.
        fScore.set(start, this.estimateCost(start, goal));
    
        while (openSet.size != 0){
            var current = this.getLowest(fScore, openSet); //the node in openSet having the lowest fScore[] value
            if (current === goal){
                return this.reconstructPath(cameFrom, current);
            }                
    
            openSet.delete(current);
            closedSet.add(current);
    
            current.getConnections().forEach(neighbor => {
                if (closedSet.has(neighbor)){
                    return;		// Ignore the neighbor which is already evaluated.
                }

                if (!openSet.has(neighbor)){
                    // Discover a new node
                    openSet.add(neighbor);
                }
                
                // The distance from start to a neighbor
                //the "dist_between" function may vary as per the solution requirements.
                var tentative_gScore = gScore.get(current) + this.distBetween(current, neighbor);
                if (tentative_gScore >= gScore.get(neighbor)){
                    return;		// This is not a better path.
                }
                    

                // This path is the best until now. Record it!
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentative_gScore);
                fScore.set(neighbor, gScore[neighbor] + this.estimateCost(neighbor, goal)); 
            });
                
        }
    
        return null;
    }

    static distBetween(current, neighbor){        
        return -2 * neighbor.level + 9;
    }

    static getLowest(gscore, openSet){
        var min = -1;
        var minNode;
        openSet.forEach(open => {
            if (min === -1 || gscore[open] < min){
                min = gscore[open];
                minNode = open;
            }
        });
        return minNode;
    }

    static estimateCost(start, end){
        return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y -end.y, 2));
    }

    static reconstructPath(cameFrom, current){
        var totalPath = [current];
        while (cameFrom.has(current)){
            current = cameFrom.get(current);
            totalPath.push(current);
        }
        return totalPath;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RouteSolver;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Background{
    constructor(width, height, game, group, carManager){
        this.width = width;
        this.height = height;
        this.game = game;
        this.group = group;
        this.carManager = carManager;
        this.xOffset = 0;
        this.yOffset = 0;
        this.sprites = [];
        this.generate();
    }

    generate(){
        for(var i = 0; i < this.width; i++){
            for (var j = 0; j <this.height; j++){
                var sprite = this.game.add.sprite(i * 64, j * 64, 'background');
                this.group.add(sprite);
                this.sprites[i + j*this.width] = sprite;
            }
        }
    }

    updateTints(){
        var maxWait = [];
        this.carManager.cars.forEach(car => {
            var x = car.zone.x;
            var y = car.zone.y;
            var id = x + y*this.width;
            if(!maxWait[id] || maxWait[id] < car.wait){
                maxWait[id] = car.wait;
            }
        });
        for(var i = 0; i < this.width; i++){
            for (var j = 0; j <this.height; j++){
                var id = i + j*this.width;
                if (maxWait[id]){
                    var red = 8*maxWait[id];
                    var green = 255 - red;
                    var tint = (red * 256 * 256) + (green * 256);
                    this.sprites[id].tint = tint;
                }else {
                    this.sprites[id].tint = 0xffffff;
                }
                
            }
        }
        
    }

    setOffset(xOffset, yOffset){
        for(var i = 0; i < this.width; i++){
            for (var j = 0; j <this.height; j++){
                this.sprites[i + j*this.width].x = i * 64 + xOffset;
                this.sprites[i + j*this.width].y = j * 64 + yOffset;
            }
        }
    }

    reset(){
        this.updateTints();
        this.setOffset(0,0)
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Background;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ZoneRenderer_js__ = __webpack_require__(10);


class ZonesRenderer {
    constructor(game, group){
        this.game = game;
        this.group = group;
        this.zones = new Map();
        this.xOffset = 0;
        this.yOffset = 0;
    }

    setOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;

        //update sprites
        for(let zr of this.zones.values()){
            zr.setOffset(xOffset, yOffset);
        }
    }

    addZone(zone){
        var zr = new __WEBPACK_IMPORTED_MODULE_0__ZoneRenderer_js__["a" /* default */](zone, this.xOffset, this.yOffset, this.game, this.group);
        this.zones.set(zone, zr);
        return zr;
    }

    removeZone(zone){
        this.zones.get(zone).destroy();
    }

    reset(){
        this.xOffset = 0;
        this.yOffset = 0;
        this.zones.forEach(zone => {
            zone.destroy()
        });
        this.zones = new Map();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ZonesRenderer;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ZoneRenderer{
    constructor(zone, xOffset, yOffset, game, group){
        this.zone = zone;
        this.game = game;
        this.group = group;
        this.carIndex = new Map();
        this.carSprites = [];
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    getFirstIndex(){
        for (var i = 0; i < this.zone.space; i++){
            if (!this.carSprites[i]){
                return i;
            }
        }
    }

    addCar(car){
        var index = this.getFirstIndex();
        var intOffset = this.getCarOffset(index);
        this.carIndex.set(car, index);
        this.carSprites[index] = this.game.add.sprite(
            this.zone.node.x * 64 + (this.zone.nodeX + intOffset[0]) * 8 + this.xOffset,
            this.zone.node.y * 64 + (this.zone.nodeY + intOffset[1]) * 8 + this.yOffset,
            car.spriteName);
        this.group.add(this.carSprites[index]);
        //TODO rotation
    }

    removeCar(car){
        var index = this.carIndex.get(car);
        this.carIndex.delete(car);
        if(this.carSprites[index]){
            this.carSprites[index].destroy();
        }        
        this.carSprites[index] = null;
    }

    getCarRotation(){
        //TODO
    }

    //ALSO DONT LOOK :(
    getCarOffset(index){
        if (this.zone.index === 1){
            if (this.zone.space === 9){
                var xAdd = 2 - Math.floor(index / 3);
                var yAdd = 2 - (index % 3)
                return [xAdd, yAdd];

            }else if (this.zone.space === 4){
                var xAdd = 1 - Math.floor(index / 2);
                var yAdd = 1 - (index % 2)
                return [xAdd, yAdd];
            }
            else {
                var yAdd = this.zone.space - 1 - (index % this.zone.space)
                return [0, yAdd];
            }

        }
        else if (this.zone.index === 2){
            if (this.zone.space === 9){
                var xAdd = index % 3;
                var yAdd = 2 -  Math.floor(index / 3);
                return [xAdd, yAdd];

            }else if (this.zone.space === 4){
                var xAdd = index % 2;
                var yAdd = 1 - Math.floor(index / 2);
                return [xAdd, yAdd];
            }
            else {
                var xAdd = index % this.zone.space;
                return [xAdd, 0];
            }
        }
        else if (this.zone.index === 3){
            if (this.zone.space === 9){
                var xAdd = Math.floor(index / 3);
                var yAdd = index % 3
                return [xAdd, yAdd];

            }else if (this.zone.space === 4){
                var xAdd = Math.floor(index / 2);
                var yAdd = index % 2
                return [xAdd, yAdd];
            }
            else {
                var yAdd = index % this.zone.space
                return [0, yAdd];
            }
        }
        else {
            if (this.zone.space === 9){
                var xAdd = 2 - index % 3;
                var yAdd = Math.floor(index / 3);
                return [xAdd, yAdd];

            }else if (this.zone.space === 4){
                var xAdd = 1 - index % 2;
                var yAdd = Math.floor(index / 2);
                return [xAdd, yAdd];
            }
            else {
                var xAdd = this.zone.space - 1 -index % this.zone.space;
                return [xAdd, 0];
            }
        }
    }

    setOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        for(let index of this.carIndex.values()){
            var intOffset = this.getCarOffset(index);
            this.carSprites[index].x = this.zone.node.x * 64 + (this.zone.nodeX + intOffset[0]) * 8 + xOffset;
            this.carSprites[index].y = this.zone.node.y * 64 + (this.zone.nodeY + intOffset[1]) * 8 + yOffset;
        }
    }

    destroy(){
        for (let index of this.carIndex.values()){
            this.carSprites[index].destroy()
        }
        this.carIndex.clear();      
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ZoneRenderer;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class DestinationRenderer{
    constructor(game, group){
        this.game = game;
        this.group = group;
        this.xOffset = 0;
        this.yOffset = 0
        this.destinations = new Map();
    }

    setOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        for(let dest of this.destinations.entries()){
            dest[1].x = dest[0].x * 64 + xOffset;
            dest[1].y = dest[0].y * 64 + yOffset;
        }
    }

    addDestination(destination) {
        this.destinations.set(destination, this.game.add.sprite(
            destination.x * 64 + this.xOffset,
            destination.y * 64 + this.yOffset,
            'house'
        ))
        this.destinations.get(destination).alpha = 0.5;
        this.group.add(this.destinations.get(destination));
    }

    removeDestination(destination){
        this.destinations.get(destination).destroy();
        this.destinations.delete(destination);
    }

    reset(){
        this.xOffset = 0;
        this.yOffset = 0;
        for(let dest of this.destinations.keys()){
            this.removeDestination(dest);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DestinationRenderer;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Destination_js__ = __webpack_require__(1);


class DestinationManager {
    constructor(network, renderer, carManager){
        this.network = network;
        this.renderer = renderer;
        this.destinations = new Map();
        this.destArray = []
        this.carManager = carManager;
        this.maxTime = 100;
        this.time = 50 + Math.floor(Math.random() * (this.maxTime));
        this.id = 0;
        this.score = 0;
        this.init();        
    }

    init(){
        this.spawnDestination();
        this.spawnDestination();
    }

    networkUpdate(){
        this.destArray.forEach(dest => {
            dest.node = this.network.getNode(dest.x, dest.y);
        });
    }

    spawnDestination(){
        var x = Math.floor(Math.random() * this.network.width);
        var y = Math.floor(Math.random() * this.network.height);
        while (this.destinations.get(x + y * this.network.width)){
            x = Math.floor(Math.random() * this.network.width);
            y = Math.floor(Math.random() * this.network.height);
        }
        var dest = new __WEBPACK_IMPORTED_MODULE_0__Destination_js__["a" /* default */](x, y,this.network.getNode(x, y), 25, this);
        this.destinations.set(x + y * this.network.width, dest);
        this.renderer.addDestination(dest);
        this.destArray.push(dest);
    }

    update(){
        //spawn new destinations
        this.time--;
        if (this.time === 0){
            this.time = 25 + Math.floor(Math.random() * (this.maxTime - 25));
            this.spawnDestination();
        }

        for (let dest of this.destinations.values()){
            dest.update();
        }
    }

    getRandomDestination(destination){
        var rand = this.destArray[Math.floor(Math.random() * this.destArray.length)];
        while (rand ===  destination){
            rand = this.destArray[Math.floor(Math.random() * this.destArray.length)]
        }
        return rand;
    }

    nextId(){
        this.id++;
        return this.id
    }

    reset(){
        this.renderer.reset();
        this.destArray = [];
        this.destinations = new Map();
        this.id = 0;
        this.score = 0;
        this.time = 50 + Math.floor(Math.random() * (this.maxTime));
        this.init();
    }


}
/* harmony export (immutable) */ __webpack_exports__["a"] = DestinationManager;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__solver_CarMoveSolver_js__ = __webpack_require__(14);


class CarManager {
    constructor(alarm){
        this.cars = new Set();
    }

    update(){
        __WEBPACK_IMPORTED_MODULE_0__solver_CarMoveSolver_js__["a" /* default */].doCarMoves(this.network, this.cars);
        this.cars.forEach(car => {
            car.updateWait();
        });
    }

    networkUpdate(){
        this.cars.forEach(car => {
            car.calculatePath()
        })
    }

    checkEnd(){
        var ret = false
        this.cars.forEach(car => {
            if (car.wait > 30){
                ret = true;
            }
        });
        return ret;
    }

    checkAlarm(){
        var ret = false
        this.cars.forEach(car => {
            if (car.wait > 15){
                ret = true;
            }
        });
        return ret;
    }

    addCar(car){
        this.cars.add(car);
    }

    removeCar(car){
        this.cars.delete(car);
    }

    reset(){
        this.cars = new Set();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CarManager;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__structures_CarQueue_js__ = __webpack_require__(15);


class CarMoveSolver {
    static doCarMoves(network, cars){
        var carQueue = new __WEBPACK_IMPORTED_MODULE_0__structures_CarQueue_js__["a" /* default */]();
        cars.forEach(car => {
            carQueue.addCarMove(car, car.getNextZone());
        });
        var next = carQueue.getBestZone();
        while(next){
            //move car 
            var zone = next[0];
            var zoneCars = next[1];
            var car = this.getFirstCar(zoneCars);
            while (car && zone.hasFreeSpace()){                
                var from = car.getZone();
                car.moveTo(zone);
                carQueue.moveCar(car, from, car.getZone());
                car = this.getFirstCar(zoneCars);
            }
            next = carQueue.getBestZone();
        }

    }

    static getFirstCar(cars){
        var minId = -1;
        var minCar = null;
        cars.forEach(car => {
            if (!minCar || minId > car.id){
                minId =  car.id;
                minCar = car;
            }
        });
        return minCar;

    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CarMoveSolver;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class CarQueue {
    constructor(){
        this.carMap = new Map();
        this.scoreMap = new Map();
    }
    
    addCarMove(car, to){
        //add car to list in zoneMap with key to
        if(to){
            if (this.carMap.has(to)){
                this.carMap.get(to).add(car);
    
            }
            else {
                this.carMap.set(to, new Set([car]));
            }
            //update score in scoreMap with key to if not in
            if (!this.scoreMap.has(to)){
                this.scoreMap.set(to, to.getScore())
            }
        }
    }

    moveCar(car, from, to){
        this.carMap.get(to).delete(car);
        if (this.carMap.get(to).size == 0){
            this.carMap.delete(to);
            this.scoreMap.delete(to);
        }
        else {
            this.scoreMap.set(to, to.getScore());
        }        
        if (this.scoreMap.has(from)){
            this.scoreMap.set(from, from.getScore);
        }
    }


    getBestZone(){
        //return key, value of zoneMap with biggest score
        var max = 0;
        var bestZone = null;
        for(let zone of this.scoreMap.keys()){
            if (this.scoreMap.get(zone) === 1){
                bestZone = zone;
                break;
            }
            else if (this.scoreMap.get(zone) > max){
                max = this.scoreMap.get(zone);
                bestZone = zone;
            }
            
        }
        if(bestZone){
            return [bestZone, this.carMap.get(bestZone)];
        }  
        else {
            return null;
        }
        
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CarQueue;


/***/ })
/******/ ]);