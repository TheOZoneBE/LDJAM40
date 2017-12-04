import CarMoveSolver from './../solver/CarMoveSolver.js';

export default class CarManager {
    constructor(network)){
        this.network = network;
        this.cars = new Set();
    }

    update(){
        CarMoveSolver.doCarMoves(network, cars);
        this.cars.forEach(car => {
            car.updateWait();
        });
    }

    addCar(car){
        this.cars.add(car);
    }

    removeCar(car){
        this.cars.remove(car);
    }
}