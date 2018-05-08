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
        if (effect.func) {
            effect.func(this, effect, this.x, this.y);
        }
        if (this.player && effect.player) {
            if (effect.player.hp) {
                this.player.HP(effect.player.hp);
            }
            if (effect.player.mp) {
                this.player.MP(effect.player.mp);
            }
            if (effect.player.x || effect.player.y) {
                this.player.move(effect.player.x | 0, effect.player.y | 0);
            }
        }
    }
}
