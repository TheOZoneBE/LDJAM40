import ZoneManager from './ZoneManager.js';

export default class NetworkNode {
    constructor(x, y, network){
        this.x = x;
        this.y = y;
        this.xOffset = 0;
        this.yOffset = 0;
        this.connections = new Set();
        this.network = network;
        this.level = 1;
        this.middleSprites = {
            1: 'small_middle',
            2: 'medium_middle',
            3: 'large_middle'
        };
        this.sprite = {
            mid: network.game.add.sprite(x* 64, y * 64, this.middleSprites[this.level]),
            1: null,
            2: null,
            3: null,
            4: null
        };
        network.group.add(this.sprite.mid);
        this.dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        this.conSprites = {
            1: {
                1: 'small_right',
                2: 'medium_right',
                3: 'large_right'
            },
            2: {
                1: 'small_down',
                2: 'medium_down',
                3: 'large_down'
            },
            3: {
                1: 'small_left',
                2: 'medium_left',
                3: 'large_left'
            },
            4: {
                1: 'small_up',
                2: 'medium_up',
                3: 'large_up'
            }            
        };
        this.zoneManager = new ZoneManager(this, network.zoneRenderer);
        this.checkConnections();
    }

    getIndex(x, y){
        return Math.abs(x)*(2 - x) + Math.abs(y)*(3 - y);
    }

    getDir(con){
        return [con.x -this.x,con.y - this.y];
    }
    
    checkConnections(){
        this.dirs.forEach(dir => {
            var node = this.network.getNode(this.x + dir[0], this.y + dir[1]);
            if (node){
                this.addConnection(node);
                node.addConnection(this);
            }
        });
    }

    addConnection(networkNode){
        console.log(this.x + ", " + this.y + ": added: " + networkNode.x + ", " + networkNode.y);
        this.connections.add(networkNode);
        var dir = this.getDir(networkNode);
        
        var con = this.network.game.add.sprite(
             this.x * 64 + this.xOffset, 
             this.y * 64 + this.yOffset, 
             this.conSprites[this.getIndex(dir[0], dir[1])][this.level]
        );
        this.network.group.add(con)
        this.sprite[this.getIndex(dir[0], dir[1])] = con;

        //UPDATE ZONES
        this.zoneManager.addConnection(networkNode);
    }

    removeConnection(networkNode){
        console.log(this.x + ", " + this.y + ": removed: " + networkNode.x + ", " + networkNode.y);
        this.connections.delete(networkNode);
        var dir = this.getDir(networkNode);
        this.sprite[this.getIndex(dir[0], dir[1])].destroy();
        this.sprite[this.getIndex(dir[0], dir[1])] = null;

        //UPDATE ZONES
        this.zoneManager.removeConnection(networkNode);
    }   

    getConnections(){
        return this.connections;
    }

    upgrade(){
        if(this.level < 3){
            this.level++;
            this.sprite.mid.destroy();
            this.sprite.mid = this.network.game.add.sprite(
                this.x * 64 + this.xOffset, 
                this.y * 64 + this.yOffset,
                this.middleSprites[this.level]);
            this.network.group.add(this.sprite.mid);
            this.dirs.forEach(dir => {
                var index = this.getIndex(dir[0], dir[1]);
                if (this.sprite[index]){
                    this.sprite[index].destroy();
                    this.sprite[index] = this.network.game.add.sprite(
                        this.x * 64 + this.xOffset, 
                        this.y * 64 + this.yOffset, 
                        this.conSprites[index][this.level]);
                    this.network.group.add(this.sprite[index]);
                }
            });

            //UPDATE ZONES
            this.zoneManager.upgrade();
        }        
    }

    downgrade(){
        if (this.level > 1){
            this.level--;
            this.sprite.mid.destroy();
            this.sprite.mid = this.network.game.add.sprite(
                this.x * 64 + this.xOffset, 
                this.y * 64 + this.yOffset, 
                this.middleSprites[this.level]);
            this.network.group.add(this.sprite.mid);
            this.dirs.forEach(dir => {
                var index = this.getIndex(dir[0], dir[1]);
                if (this.sprite[index]){
                    this.sprite[index].destroy();
                    this.sprite[index] = this.network.game.add.sprite(
                        this.x * 64 + this.xOffset, 
                        this.y * 64 + this.yOffset, 
                        this.conSprites[index][this.level]);
                    this.network.group.add(this.sprite[index]);
                }
            });

            //UPDATE ZONES
            this.zoneManager.downgrade();
        }
    }

    setOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.sprite.mid.x = this.x * 64 + xOffset;
        this.sprite.mid.y = this.y * 64 + yOffset;
        for (var i = 1; i < 5; i++){
            if (this.sprite[i]){
                this.sprite[i].x = this.x * 64 + xOffset;
                this.sprite[i].y = this.y * 64 + yOffset;
            }
        }
    }

    getEntryZone(x, y){
        return this.zoneManager.entryMap[this.getIndex(x, y)];
    }

    getTurnZone(x, y){
        return this.zoneManager.turnMap[this.getIndex(x, y)];
    }

    getNextZone(zone){
        return this.zoneManager.zoneMap.get(zone);
    }

    destroy(){
        this.connections.forEach(con => {
            con.removeConnection(this);
        })
        this.sprite.mid.destroy()
        this.dirs.forEach(dir => {
            var index = this.getIndex(dir[0], dir[1])
            if (this.sprite[index]){
                this.sprite[index].destroy();
            }
        });

        //UPDATE ZONES
        this.zoneManager.destroy();
    }

}