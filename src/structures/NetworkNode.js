export default class NetworkNode {
    //TODO remov up,down left, right by set
    constructor(x, y, network){
        this.x = x;
        this.y = y;
        this.connections = new Set();
        this.network = network;
        this.sprite = network.game.add.sprite(x* 64, y * 64, 'circle');
        this.dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        this.checkConnections();
    }
    
    checkConnections(){
        this.dirs.forEach(dir => {
            var node = this.network.getNode(this.x + dir[0], this.y + dir[1]);
            if (node){
                this.connections.add(node);
                node.addConnection(this);
            }
        });
    }

    addConnection(networkNode){
        console.log(this.x + ", " + this.y + ": added: " + networkNode.x + ", " + networkNode.y);
        this.connections.add(networkNode);
    }

    removeConnection(networkNode){
        console.log(this.x + ", " + this.y + ": removed: " + networkNode.x + ", " + networkNode.y);
        this.connections.delete(networkNode);
    }

    getConnections(){
        return this.connections;
    }

    destroy(){
        this.connections.forEach(con => {
            con.removeConnection(this);
        })
        this.sprite.destroy()
    }

}