export default class Zone {
    //type =  turn, exit, destination, road: dest == turn?
    constructor(space, node, type){
        this.space = space;
        this.node = node;
        this.type = type;
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
        return this.cars.length / this.space;
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
}