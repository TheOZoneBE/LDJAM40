export default class Car {
    
    constructor(network, startX, startY, endX, endY){
        this.network = network;
        this.x = startX;
        this.y = startY;
        this.endX = endX;
        this.endY = endY;
        this.wait = 0;
        this.calculatePath();
    }
    
    update(){
        if (path){
            //move over path

        }
        this.wait++;
    }
    
    //gets called every time network changes
    calculatePath(){
        this.path = RouteSolver.shortestRoute(this.network, this.x, this.y, this.endX, this.endY);
    }
}