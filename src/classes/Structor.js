export default class Structor {
    color = "green";

    walkable = false;

    /* functions */

    constructor(params) {
        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }
    }

    draw(ctx, x, y) {
        ctx.fillStyle = this.color;
        ctx.fillRect(x * ctx.size, y * ctx.size, ctx.size, ctx.size);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(x * ctx.size, y * ctx.size, ctx.size, ctx.size);
    }
}
