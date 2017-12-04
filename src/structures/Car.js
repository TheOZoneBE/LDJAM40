import RouteSolver from './../solver/RouteSolver.js'

export default class Car {
    
    constructor(network, startDest, endDest, id, spriteName){
        this.network = network;
        this.id = id;
        this.spriteName = spriteName;
        this.wait = 0;
        this.zone = startDest;
        //this.zone.addCar(this);
        this.endDest = endDest;
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
            this.endDest.node.x, 
            this.endDest.node.y
        );
        this.pathIndex = this.path.length - 1;
    }

    updateWait(){
        this.wait++;
    }

    getNextZone(){
        //TODO if end return end zone
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