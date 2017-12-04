import CarMoveSolver from './../solver/CarMoveSolver.js';

export default class CarManager {
    constructor(network){
        this.network = network;
        this.cars = new Set();
    }

    update(){
        CarMoveSolver.doCarMoves(this.network, this.cars);
        this.cars.forEach(car => {
            car.updateWait();
        });
    }

    networkUpdate(){
        this.cars.forEach(car => {
            car.calculatePath()
        })
    }

    addCar(car){
        this.cars.add(car);
    }

    removeCar(car){
        this.cars.delete(car);
    }
}