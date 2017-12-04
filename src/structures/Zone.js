export default class Zone {
    //type =  turn, exit, destination, road: dest == turn?
    constructor(space, node, nodeX, nodeY, type, index, renderer){
        this.space = space;
        this.node = node;
        this.nodeX = nodeX;
        this.nodeY = nodeY;
        this.type = type;
        this.index = index;
        this.renderer = renderer;
        this.renderer.addZone(this);
        this.cars = new Set();
    }

    addCar(car){
        this.cars.add(car);
        //TODO render code
    }

    removeCar(car){
        this.cars.delete(car);
        //TODO render code;
    }

    getScore(){
        return this.cars.size / this.space;
    }

    hasFreeSpace(){
        return this.space > 0;
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