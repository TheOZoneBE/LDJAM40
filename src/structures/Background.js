export default class Background{
    constructor(width, height, game, group){
        this.width = width;
        this.height = height;
        this.game = game;
        this.group = group;
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

    setOffset(xOffset, yOffset){
        for(var i = 0; i < this.width; i++){
            for (var j = 0; j <this.height; j++){
                this.sprites[i + j*this.width].x = i * 64 + xOffset;
                this.sprites[i + j*this.width].y = j * 64 + yOffset;
            }
        }
    }
}