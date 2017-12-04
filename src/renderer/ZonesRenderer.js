import ZoneRenderer from './ZoneRenderer.js'

export default class ZonesRenderer {
    constructor(group){
        this.group = group;
        this.zones = new Map();
        this.xOffset = 0;
        this.yOffset = 0;
    }

    setOffset(xOffset, yOffset){
        this.xOffset = xOffset;
        this.yOffset = yOffset;

        //update sprites
        for(let zr of this.zones.values()){
            zr.setOffset(xOffset, yOffset);
        }
    }

    addZone(zone){
        var zr = new ZoneRenderer(zone);
        this.zones.set(zone, zr);
        return zr;
    }

    removeZone(zone){
        this.zones.get(zone).destroy();
    }
}