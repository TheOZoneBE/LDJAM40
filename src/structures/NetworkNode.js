class NetworkNode {
    constructor(x, y, network){
        this.x = x;
        this.y = y;
        this.network = network;
        this.connections = [];
        this.dirs = [ 
            {
                x = 0,
                y = 1
            },{
                x = 0,
                y = -1
            },{
                x = 1,
                y = 0
            },{
                x = -1,
                y = 0
            }
        ];
        checkConnections();
    }
    
    checkConnections(){
        //look around to check connections
        this.dirs.forEach(dir => {
            var node = this.network.getNode(dir.x, dir.y)
            if (node){ 
                this.connections.push(node);
                this.node.addConnection(this);
            }
        })

    }

    addConnection(networkNode){
        this.connections.push(networkNode);
    }

    removeConnection(networkNode){
        this.connections = connections.splice(connections.indexOf(networkNode), 1);
    }

    getConnections(){
        return this.connections;
    }


}