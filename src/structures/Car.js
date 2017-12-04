import RouteSolver from './../solver/RouteSolver.js'

export default class Car {
    
    constructor(network, startZone, endZone, id, spriteName){
        this.network = network;
        this.id = id;
        this.spriteName = spriteName;
        this.wait = 0;
        this.zone = startZone;
        this.zone.addCar(this);
        this.endZone = endZone;
        this.pathIndex = 0;
        this.path = null;
        this.calculatePath();
    }
    
    //gets called every time network changes
    calculatePath(){
        this.path = RouteSolver.shortestRoute(
            this.network, 
            this.zone.node.x, 
            this.zone.node.y, 
            this.endZone.node.x, 
            this.endZone.node.y
        );
        this.pathIndex = 0;
    }

    getNextZone(){
        //TODO if end return end zone
        if (path){
            if(this.zone.type === 'exit'){
                var dir = this.getNextDir();
                return this.getNextNode().getEntryZone(dir[0], dir[1]);
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
        
        this.pathIndex++;
        return this.path[this.pathIndex];
    }

    getNextDir(){
        var cur = this.path[this.pathIndex];
        var next = this.path[this.pathIndex + 1];
        return [next.x -cur.x,next.y - cur.y];
    }

    getZone(){
        return this.zone;
    }

    moveTo(newZone){
        this.zone.removeCar(this);
        this.zone = newZone;
        this.zone.addCar(this);
    }
}