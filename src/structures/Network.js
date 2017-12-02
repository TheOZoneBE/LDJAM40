import NetworkNode from "./NetworkNode.js";

export default class Network{
    constructor(width, height, game){
        this.width = width;
        this.height = height;
        this.game = game;
        this.network = [width*height];
    }

    inside(x, y){
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    getNode(x, y){
        if (this.inside(x, y)){
            return this.network[x + y* this.width];
        }else {
            return null;
        }        
    }

    setNode(x, y, networkNode){
        this.network[x + y* this.width] = networkNode;
    }

    addRoad(x, y){
        var newNode = new NetworkNode(x, y, this);
        this.setNode(x, y, newNode);
    }
    
    removeRoad(x, y){
        var removeNode = this.getNode(x, y);
        this.setNode(x, y, null);
        removeNode.destroy();
    }
}