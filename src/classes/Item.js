export default class Item {
    walkable = true;
    color = "#66FF66";
    size = 1;

    /* functions */

    constructor(params) {
        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }
    }

    draw(ctx, x, y) {
        var s = 4;
        ctx.fillStyle = this.color;
        ctx.fillRect(x * ctx.size + s, y * ctx.size + s, ctx.size - s * 2, ctx.size - s * 2);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(x * ctx.size + s, y * ctx.size + s, ctx.size - s * 2, ctx.size - s * 2);
    }

    pickup(player) {
        delete this.tile.item;
        player.gear.push(this);
        player.update();
    }
}
