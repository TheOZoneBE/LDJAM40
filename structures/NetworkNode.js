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
        dirs.forEach(function(dir){
            var node = network.getNode(dir.x, dir.y)
            if (node){ 
                connections.push(node);
                node.addConnection(this);
            }
        })

    }

    addConnection(networkNode){
        connections.push(networkNode);
    }


}