class Network{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.network = [width*height];
    }

    inside(x, y){
        return x >= 0 && y >= 0 && x < width && y < height;
    }

    getNode(x, y){
        if (this.inside(x, y)){
            return this.network[x + y* width];
        }else {
            return null;
        }        
    }

    setNode(x, y, networkNode){
        this.network[x + y* width] = networkNode;
    }

    addRoad(x, y){
        var newNode = new NetworkNode(x, y, this);
        this.setNode(x, y, newNode);
    }
    
    removeRoad(x, y){
        var removeNode = this.getNode(x, y);
        var connections = removeNode.getConnections();
        this.setNode(x, y, null);
        connections.forEach(conn => {
            conn.removeConnection(removeNode);
        });
    }
}