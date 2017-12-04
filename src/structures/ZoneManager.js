import Zone from './Zone.js';
import Destination from './Destination.js'

export default class ZoneManager {
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
                var entry = new Zone(1, this.node, 7, 3, 'normal', 1,this.zoneRenderer);
                this.entryMap[1] = entry;
                var next1 = new Zone(1, this.node, 6, 3, 'normal', 1,this.zoneRenderer);
                this.zoneMap.set(entry, next1);
                var turn = new Zone(1, this.node, 5, 3, 'turn', 1,this.zoneRenderer);
                this.zoneMap.set(next1, turn);
                var next2 = new Zone(1, this.node, 4,4, 'normal', 1,this.zoneRenderer);
                this.turnMap[1] = next2;
                var next3 = new Zone(1, this.node, 5,4, 'normal', 1,this.zoneRenderer);
                this.zoneMap.set(next2, next3);
                var next4 = new Zone(1, this.node, 6, 4, 'normal', 1,this.zoneRenderer);
                this.zoneMap.set(next3, next4);
                var exit = new Zone(1, this.node, 7,4, 'exit', 1,this.zoneRenderer);
                this.zoneMap.set(next4, exit);
            }
            else if (this.level === 2){
                var entry = new Zone(2, this.node, 7, 2, 'normal',1, this.zoneRenderer);
                this.entryMap[1] = entry;
                var turn = new Zone(2, this.node, 6, 2, 'turn', 1,this.zoneRenderer);
                this.zoneMap.set(entry, turn);
                var next1 = new Zone(4, this.node, 4,4, 'normal', 1,this.zoneRenderer);
                this.turnMap[1] = next1;
                var next2 = new Zone(2, this.node, 6,4, 'normal', 1,this.zoneRenderer);
                this.zoneMap.set(next1, next2);
                var exit = new Zone(2, this.node, 7,4, 'exit', 1,this.zoneRenderer);
                this.zoneMap.set(next2, exit);
            }
            else { 
                var turn = new Zone(3, this.node, 7, 1, 'turn', 1,this.zoneRenderer);
                this.entryMap[1] = turn;
                var next1 = new Zone(9, this.node, 4,4, 'normal', 1,this.zoneRenderer);
                this.turnMap[1] = next1;
                var exit = new Zone(3, this.node, 7,4, 'exit', 1,this.zoneRenderer);
                this.zoneMap.set(next1, exit);
            }
        }
        if (this.dirs.has(2)){
            if (this.level === 1){
                var entry = new Zone(1, this.node, 4, 7, 'normal', 2,this.zoneRenderer);
                this.entryMap[2] = entry;
                var next1 = new Zone(1, this.node, 4, 6, 'normal', 2,this.zoneRenderer);
                this.zoneMap.set(entry, next1);
                var turn = new Zone(1, this.node, 4, 5, 'turn', 2,this.zoneRenderer);
                this.zoneMap.set(next1, turn);
                var next2 = new Zone(1, this.node, 3,4, 'normal', 2,this.zoneRenderer);
                this.turnMap[2] = next2;
                var next3 = new Zone(1, this.node, 3,5, 'normal', 2,this.zoneRenderer);
                this.zoneMap.set(next2, next3);
                var next4 = new Zone(1, this.node, 3, 6, 'normal', 2,this.zoneRenderer);
                this.zoneMap.set(next3, next4);
                var exit = new Zone(1, this.node, 3,7, 'exit', 2,this.zoneRenderer);
                this.zoneMap.set(next4, exit);
            }
            else if (this.level === 2){
                var entry = new Zone(2, this.node, 4, 7, 'normal',2, this.zoneRenderer);
                this.entryMap[2] = entry;
                var turn = new Zone(2, this.node, 4, 6, 'turn', 2,this.zoneRenderer);
                this.zoneMap.set(entry, turn);
                var next1 = new Zone(4, this.node, 2,4, 'normal', 2,this.zoneRenderer);
                this.turnMap[2] = next1;
                var next2 = new Zone(2, this.node, 2,6, 'normal', 2,this.zoneRenderer);
                this.zoneMap.set(next1, next2);
                var exit = new Zone(2, this.node, 2,7, 'exit', 2,this.zoneRenderer);
                this.zoneMap.set(next2, exit);
            }
            else {
                var turn = new Zone(3, this.node, 4, 7, 'turn', 2,this.zoneRenderer);
                this.entryMap[2] =turn;
                var next1 = new Zone(9, this.node, 1,4, 'normal', 2,this.zoneRenderer);
                this.turnMap[2] = next1;
                var exit = new Zone(3, this.node, 1,7, 'exit', 2,this.zoneRenderer);
                this.zoneMap.set(next1, exit);
            }
        }
        if (this.dirs.has(3)){
            if (this.level === 1){
                var entry = new Zone(1, this.node, 0, 4, 'normal', 3,this.zoneRenderer);
                this.entryMap[3] = entry;
                var next1 = new Zone(1, this.node, 1, 4, 'normal', 3,this.zoneRenderer);
                this.zoneMap.set(entry, next1);
                var turn = new Zone(1, this.node, 2, 4, 'turn', 3,this.zoneRenderer);
                this.zoneMap.set(next1, turn);
                var next2 = new Zone(1, this.node, 3,3, 'normal', 3,this.zoneRenderer);
                this.turnMap[3] = next2;
                var next3 = new Zone(1, this.node, 2,3, 'normal', 3,this.zoneRenderer);
                this.zoneMap.set(next2, next3);
                var next4 = new Zone(1, this.node, 1, 3, 'normal', 3,this.zoneRenderer);
                this.zoneMap.set(next3, next4);
                var exit = new Zone(1, this.node, 0,3, 'exit',3, this.zoneRenderer);
                this.zoneMap.set(next4, exit);
            }
            else if (this.level === 2){
                var entry = new Zone(2, this.node, 0, 4, 'normal',3, this.zoneRenderer);
                this.entryMap[3] = entry;
                var turn = new Zone(2, this.node, 1, 4, 'turn', 3,this.zoneRenderer);
                this.zoneMap.set(entry, turn);
                var next1 = new Zone(4, this.node, 2,2, 'normal', 3,this.zoneRenderer);
                this.turnMap[3] = next1;
                var next2 = new Zone(2, this.node, 1,2, 'normal', 3,this.zoneRenderer);
                this.zoneMap.set(next1, next2);
                var exit = new Zone(2, this.node, 0,2, 'exit', 3,this.zoneRenderer);
                this.zoneMap.set(next2, exit);
            }
            else {
                var turn = new Zone(3, this.node, 0, 4, 'turn', 3,this.zoneRenderer);
                this.entryMap[3] = turn;
                var next1 = new Zone(9, this.node, 1,1, 'normal', 3,this.zoneRenderer);
                this.turnMap[3] = next1;
                var exit = new Zone(3, this.node, 0,1, 'exit', 3,this.zoneRenderer);
                this.zoneMap.set(next1, exit);
            }
        }
        if (this.dirs.has(4)){
            if (this.level === 1){
                var entry = new Zone(1, this.node, 3, 0, 'normal',4, this.zoneRenderer);
                this.entryMap[4] = entry;
                var next1 = new Zone(1, this.node, 3, 1, 'normal', 4,this.zoneRenderer);
                this.zoneMap.set(entry, next1);
                var turn = new Zone(1, this.node, 3, 2, 'turn', 4,this.zoneRenderer);
                this.zoneMap.set(next1, turn);
                var next2 = new Zone(1, this.node, 4,3, 'normal', 4,this.zoneRenderer);
                this.turnMap[4] = next2;
                var next3 = new Zone(1, this.node, 4,2, 'normal', 4,this.zoneRenderer);
                this.zoneMap.set(next2, next3);
                var next4 = new Zone(1, this.node, 4, 1, 'normal', 4,this.zoneRenderer);
                this.zoneMap.set(next3, next4);
                var exit = new Zone(1, this.node, 4,0, 'exit', 4,this.zoneRenderer);
                this.zoneMap.set(next4, exit);
            }
            else if (this.level === 2){
                var entry = new Zone(2, this.node, 2, 0, 'normal',4, this.zoneRenderer);
                this.entryMap[4] = entry;
                var turn = new Zone(2, this.node, 2, 1, 'turn', 4,this.zoneRenderer);
                this.zoneMap.set(entry, turn);
                var next1 = new Zone(4, this.node, 4,2, 'normal', 4,this.zoneRenderer);
                this.turnMap[4] = next1;
                var next2 = new Zone(2, this.node, 4,1, 'normal', 4,this.zoneRenderer);
                this.zoneMap.set(next1, next2);
                var exit = new Zone(2, this.node, 4,0, 'exit', 4,this.zoneRenderer);
                this.zoneMap.set(next2, exit);
            }
            else {
                var turn = new Zone(3, this.node, 1, 0, 'turn', 4,this.zoneRenderer);
                this.entryMap[4] = turn;
                var next1 = new Zone(9, this.node, 4,1, 'normal', 4,this.zoneRenderer);
                this.turnMap[4] = next1;
                var exit = new Zone(3, this.node, 4,0, 'exit', 4,this.zoneRenderer);
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