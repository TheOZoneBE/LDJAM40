export default class Background{
    constructor(width, height, game, group, carManager){
        this.width = width;
        this.height = height;
        this.game = game;
        this.group = group;
        this.carManager = carManager;
        this.xOffset = 0;
        this.yOffset = 0;
        this.sprites = [];
        this.generate();
    }

    generate(){
        for(var i = 0; i < this.width; i++){
            for (var j = 0; j <this.height; j++){
                var sprite = this.game.add.sprite(i * 64, j * 64, 'background');
                this.group.add(sprite);
                this.sprites[i + j*this.width] = sprite;
            }
        }
    }

    updateTints(){
        var maxWait = [];
        this.carManager.cars.forEach(car => {
            var x = car.zone.x;
            var y = car.zone.y;
            var id = x + y*this.width;
            if(!maxWait[id] || maxWait[id] < car.wait){
                maxWait[id] = car.wait;
            }
        });
        for(var i = 0; i < this.width; i++){
            for (var j = 0; j <this.height; j++){
                var id = i + j*this.width;
                if (maxWait[id]){
                    var red = 8*maxWait[id];
                    var green = 255 - red;
                    var tint = (red * 256 * 256) + (green * 256);
                    this.sprites[id].tint = tint;
                }else {
                    this.sprites[id].tint = 0xffffff;
                }
                
            }
        }
        
    }

    setOffset(xOffset, yOffset){
        for(var i = 0; i < this.width; i++){
            for (var j = 0; j <this.height; j++){
                this.sprites[i + j*this.width].x = i * 64 + xOffset;
                this.sprites[i + j*this.width].y = j * 64 + yOffset;
            }
        }
    }

    reset(){
        this.updateTints();
        this.setOffset(0,0)
    }
}