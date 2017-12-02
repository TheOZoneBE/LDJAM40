export default class NetworkNode {
    constructor(x, y, network){
        this.x = x;
        this.y = y;
        this.up = null;
        this.down = null;
        this.left = null;
        this.right = null;
        this.network = network;
        this.sprite = network.game.add.sprite(x* 64, y * 64, 'circle');
        //this.dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        this.checkConnections();
    }
    
    checkConnections(){
        //look around to check connections
        var node;
        //up
        node = this.network.getNode(this.x +1, this.y);
        if (node){
            this.up = node;
            node.setDown(this);
        }
        //down
        node = this.network.getNode(this.x -1, this.y);
        if (node){
            this.down =node;
            node.setUp(this);
        }
        //left
        node = this.network.getNode(this.x, this.y -1);
        if (node){
            this.left =node;
            node.setRight(this);
        }
        //right
        node = this.network.getNode(this.x , this.y + 1);
        if (node){
            this.right =node;
            node.setLeft(this);
        }

    }

    setUp(networkNode){
        this.up = networkNode;
    }

    setDown(networkNode){
        this.down = networkNode;
    }

    setLeft(networkNode){
        this.left = networkNode;
    }

    setRight(networkNode){
        this.right = networkNode;
    }

    destroy(){
        if (this.up){
            this.up.setDown(null);
        }
        if(this.down){
            this.down.setUp(null);
        }
        if(this.left){
            this.left.setRight(null);
        }
        if(this.right){
            this.right.setLeft(null);
        }
        this.sprite.destroy()
    }

    getUp(){
        return this.up;
    }

    getDown(){
        return this.down;
    }

    getLeft(){
        return this.left;
    }

    getRight(){
        return this.right;
    }


}