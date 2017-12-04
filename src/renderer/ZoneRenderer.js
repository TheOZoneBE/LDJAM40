export default class ZoneRenderer{
    constructor(zone, xOffset, yOffset, game, group){
        this.zone = zone;
        this.game = game;
        this.group = group;
        this.carIndex = new Map();
        this.carSprites = [];
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    getFirstIndex(){
        for (var i = 0; i < this.zone.space; i++){
            if (!this.carSprites[i]){
                return i;
            }
        }
    }

    addCar(car){
        var index = this.getFirstIndex();
        var intOffset = this.getCarOffset(index);
        this.carIndex.set(car, index);
        this.carSprites[index] = this.game.add.sprite(
            this.zone.node.x * 64 + (this.zone.nodeX + intOffset[0]) * 8 + this.xOffset,
            this.zone.node.y * 64 + (this.zone.nodeY + intOffset[1]) * 8 + this.yOffset,
            car.spriteName);
        this.group.add(this.carSprites[index]);
        //TODO rotation
    }

    removeCar(car){
        var index = this.carIndex.get(car);
        this.carIndex.delete(car);
        if(this.carSprites[index]){
            this.carSprites[index].destroy();
        }        
        this.carSprites[index] = null;
    }

    getCarRotation(){
        //TODO
    }

    //ALSO DONT LOOK :(
    getCarOffset(index){
        if (this.zone.index === 1){
            if (this.zone.space === 9){
                var xAdd = 2 - Math.floor(index / 3);
                var yAdd = 2 - (index % 3)
                return [xAdd, yAdd];

            }else if (this.zone.space === 4){
                var xAdd = 1 - Math.floor(index / 2);
                var yAdd = 1 - (index % 2)
                return [xAdd, yAdd];
            }
            else {
                var yAdd = this.zone.space - 1 - (index % this.zone.space)
                return [0, yAdd];
            }

        }
        else if (this.zone.index === 2){
            if (this.zone.space === 9){
                var xAdd = index % 3;
                var yAdd = 2 -  Math.floor(index / 3);
                return [xAdd, yAdd];

            }else if (this.zone.space === 4){
                var xAdd = index % 2;
                var yAdd = 1 - Math.floor(index / 2);
                return [xAdd, yAdd];
            }
            else {
                var xAdd = index % this.zone.space;
                return [xAdd, 0];
            }
        }
        else if (this.zone.index === 3){
            if (this.zone.space === 9){
                var xAdd = Math.floor(index / 3);
                var yAdd = index % 3
                return [xAdd, yAdd];

            }else if (this.zone.space === 4){
                var xAdd = Math.floor(index / 2);
                var yAdd = index % 2
                return [xAdd, yAdd];
            }
            else {
                var yAdd = index % this.zone.space
                return [0, yAdd];
            }
        }
        else {
            if (this.zone.space === 9){
                var xAdd = 2 - index % 3;
                var yAdd = Math.floor(index / 3);
                return [xAdd, yAdd];

            }else if (this.zone.space === 4){
                var xAdd = 1 - index % 2;
                var yAdd = Math.floor(index / 2);
                return [xAdd, yAdd];
            }
            else {
                var xAdd = this.zone.space - 1 -index % this.zone.space;
                return [xAdd, 0];
            }
        }
    }

    setOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        for(let index of this.carIndex.values()){
            var intOffset = this.getCarOffset(index);
            this.carSprites[index].x = this.zone.node.x * 64 + (this.zone.nodeX + intOffset[0]) * 8 + xOffset;
            this.carSprites[index].y = this.zone.node.y * 64 + (this.zone.nodeY + intOffset[1]) * 8 + yOffset;
        }
    }

    destroy(){
        for (let index of this.carIndex.values()){
            this.carSprites[index].destroy()
        }
        this.carIndex.clear();      
    }
}