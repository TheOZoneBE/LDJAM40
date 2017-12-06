import Destination from "./Destination.js";

export default class DestinationManager {
    constructor(network, renderer, carManager){
        this.network = network;
        this.renderer = renderer;
        this.destinations = new Map();
        this.destArray = []
        this.carManager = carManager;
        this.maxTime = 90;
        this.time = 30 + Math.floor(Math.random() * (this.maxTime));
        this.id = 0;
        this.score = 0;
        this.init();        
    }

    init(){
        this.spawnDestination();
        this.spawnDestination();
    }

    networkUpdate(){
        this.destArray.forEach(dest => {
            dest.node = this.network.getNode(dest.x, dest.y);
        });
    }

    spawnDestination(){
        var x = Math.floor(Math.random() * this.network.width);
        var y = Math.floor(Math.random() * this.network.height);
        while (this.destinations.get(x + y * this.network.width)){
            x = Math.floor(Math.random() * this.network.width);
            y = Math.floor(Math.random() * this.network.height);
        }
        var dest = new Destination(x, y,this.network.getNode(x, y), 25, this);
        this.destinations.set(x + y * this.network.width, dest);
        this.renderer.addDestination(dest);
        this.destArray.push(dest);
        this.networkUpdate();
    }

    update(){
        //spawn new destinations
        this.time--;
        if (this.time === 0 && this.destArray.length < (this.network.width * this.network.height) / 3){
            this.time = 25 + Math.floor(Math.random() * (this.maxTime - 25));
            this.spawnDestination();
        }

        for (let dest of this.destinations.values()){
            dest.update();
        }
    }

    getRandomDestination(destination){
        var rand = this.destArray[Math.floor(Math.random() * this.destArray.length)];
        while (rand.x === destination.x && rand.y === destination.y){
            rand = this.destArray[Math.floor(Math.random() * this.destArray.length)]
        }
        return rand;
    }

    nextId(){
        this.id++;
        return this.id
    }

    reset(){
        this.renderer.reset();
        this.destArray = [];
        this.destinations = new Map();
        this.id = 0;
        this.score = 0;
        this.time = 50 + Math.floor(Math.random() * (this.maxTime));
        this.init();
    }


}