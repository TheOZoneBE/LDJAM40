export default class CarQueue {
    constructor(){
        this.carMap = new Map();
        this.scoreMap = new Map();
    }
    
    addCarMove(car, to){
        //add car to list in zoneMap with key to
        if(to){
            if (this.carMap.has(to)){
                this.carMap.get(to).add(car);
    
            }
            else {
                this.carMap.set(to, new Set([car]));
            }
            //update score in scoreMap with key to if not in
            if (!this.scoreMap.has(to)){
                this.scoreMap.set(to, to.getScore())
            }
        }

    }

    moveCar(car, from, to){
        this.carMap.get(to).delete(car);
        if (this.carMap.get(to).size == 0){
            this.carMap.delete(to);
            this.scoreMap.delete(to);
        }
        else {
            this.scoreMap.set(to, to.getScore());
        }        
        if (this.scoreMap.has(from)){
            this.scoreMap.set(from, from.getScore());
        }
    }


    getBestZone(){
        //return key, value of zoneMap with biggest score
        var max = 0;
        var bestZone = null;
        for(let zone of this.scoreMap.keys()){
            if (this.scoreMap.get(zone) === 1){
                bestZone = zone;
                break;
            }
            else if (this.scoreMap.get(zone) > max){
                max = this.scoreMap.get(zone);
                bestZone = zone;
            }
            
        }
        if(bestZone){
            return [bestZone, this.carMap.get(bestZone)];
        }  
        else {
            return null;
        }
        
    }
}