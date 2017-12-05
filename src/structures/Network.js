import NetworkNode from "./NetworkNode.js";

export default class Network{
    constructor(width, height, game, group, zoneRenderer){
        this.width = width;
        this.height = height;
        this.game = game;
        this.group = group;
        this.zoneRenderer = zoneRenderer;
        this.network = [];
        this.xOffset = 0;
        this.yOffset = 0;
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
        if(this.inside(x, y)){
            var newNode = new NetworkNode(x, y, this);
            newNode.setOffset(this.xOffset, this.yOffset);
            this.setNode(x, y, newNode);
            return true;
        }
        return false
    }
    
    removeRoad(x, y){
        var removeNode = this.getNode(x, y);
        this.setNode(x, y, null);
        removeNode.destroy();
        return true;
    }

    upgradeRoad(x, y){
        return this.getNode(x, y).upgrade();
    }

    downgradeRoad(x ,y){
        return this.getNode(x, y).downgrade();
    }

    setNetworkOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        for (var i = 0; i < this.width; i++){
            for(var j = 0; j < this.height; j++){
                if (this.getNode(i, j)){
                    this.getNode(i, j).setOffset(xOffset, yOffset);
                }
            }
            
        }
    }

    reset(){
        this.xOffset =0;
        this.yOffset =0;
        this.network.forEach(node => {
            if (node){
                node.destroy();
            }            
        });
        this.network = [];
        this.zoneRenderer.reset();
    }
}