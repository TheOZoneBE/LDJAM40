import CarMoveSolver from './../solver/CarMoveSolver.js';

export default class CarManager {
    constructor(alarm){
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

    checkEnd(){
        var ret = false
        this.cars.forEach(car => {
            if (car.wait > 30){
                ret = true;
            }
        });
        return ret;
    }

    checkAlarm(){
        var ret = false
        this.cars.forEach(car => {
            if (car.wait > 15){
                ret = true;
            }
        });
        return ret;
    }

    addCar(car){
        this.cars.add(car);
    }

    removeCar(car){
        this.cars.delete(car);
    }

    reset(){
        this.cars = new Set();
    }
}