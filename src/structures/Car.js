import RouteSolver from './../solver/RouteSolver.js'

export default class Car {
    
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
        this.path = RouteSolver.shortestRoute(
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