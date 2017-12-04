export default class DestinationRenderer{
    constructor(game, group){
        this.game = game;
        this.group = group;
        this.xOffset = 0;
        this.yOffset = 0
        this.destinations = new Map();
    }

    setOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        for(let dest of this.destinations.entries()){
            dest[1].x = dest[0].node.x * 64 + xOffset;
            dest[1].y = dest[0].node.y * 64 + yOffset;
        }
    }

    addDestination(destination) {
        this.destinations.set(destination, this.game.add.sprite(
            destination.node.x * 64 + this.xOffset,
            destination.node.y * 64 + this.yOffset,
            'house'
        ))
        this.destinations.get(destination).alpha = 0.5;
        this.group.add(this.destinations.get(destination));
    }

    removeDestination(destination){
        this.destinations.get(destination).destroy();
        this.destinations.remove(destination);
    }
}