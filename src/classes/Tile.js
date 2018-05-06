export default class Tile {
    color = "#00FF00";

    /* functions */

    constructor(params) {
        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }
    }

    draw(ctx, x, y, s) {
        ctx.fillStyle = this.color;
        ctx.fillRect(x * s, y * s, s, s);
        ctx.fillStyle = "#000000";
        ctx.strokeRect(x * s, y * s, s, s);
    }

    affect(effect) {
        
    }
}
