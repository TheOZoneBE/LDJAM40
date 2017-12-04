import Destination from "./Destination.js";

export default class DestinationManager {
    constructor(network, renderer, zoneRenderer, carManager){
        this.network = network;
        this.renderer = renderer;
        this.destinations = new Map();
        this.destArray = []
        this.carManager = carManager;
        this.zoneRenderer = zoneRenderer;
        this.id = 0;
        //TODO debug
        var d1 = new Destination(network.getNode(0,0), 500, this);
        var d2 = new Destination(network.getNode(3,0), 500, this);
        this.destinations.set(0, d1, this);
        this.destinations.set(3, d2, this);
        this.renderer.addDestination(d1);
        this.renderer.addDestination(d2);
        this.destArray.push(d1);
        this.destArray.push(d2);
    }

    update(){
        //spawn new destinations

        for (let dest of this.destinations.values()){
            dest.update();
        }
    }

    getRandomDestination(destination){
        var rand = this.destArray[Math.floor(Math.random() * this.destArray.length)];
        while (rand ===  destination){
            rand = this.destArray[Math.floor(Math.random() * this.destArray.length)]
        }
        return rand;
    }

    nextId(){
        this.id++;
        return this.id
    }


}