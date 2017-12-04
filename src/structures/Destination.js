import Car from './Car.js';

export default class Destination {
    constructor(node, spawnRate, manager){
        this.node = node;
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
        var car = new Car(
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
        return this.node.getTurnZone(x, y);
    }
    
    destroy(){
        this.renderer.removeZone(this);
    }
}