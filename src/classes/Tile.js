import Graphics from '../util/Graphics';

export default class Tile extends Graphics {
    color = "#00FF00";

    /* functions */

    constructor(params) {
        super(params);

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

    affect(effect, x, y, data) {
        if (effect.func) {
            effect.func(this, effect, x, y, data);
        }
        if (effect.player && this.player) {
            var aim = effect.player.skills[effect.skill].roll("dex");
            if (effect.player.hp) {
                this.player.HP(this.player.skills[effect.skill].value(effect.player.hp, "str"), aim);
            }
            if (effect.player.mp) {
                this.player.MP(this.player.skills[effect.skill].value(effect.player.mp, "str"), aim);
            }
            if (effect.player.x || effect.player.y) {
                this.player.move(effect.player.x | 0, effect.player.y | 0);
            }
            if (effect.player.bonuses) {
                effect.player.bonuses.forEach( (b) => {
                    this.player.bonus( Object.assign({}, b) );
                } );
            }
        }
        if (effect.item && this.item) {
            if (effect.item.pickup) {
                this.item.pickup(data.player)
            }
        }
    }

    walkable() {
        if ( this.player ) {
            return false;
        }
        if ( this.structor && !this.structor.walkable ) {
            return false;
        }
        if ( this.item && !this.item.walkable ) {
            return false;
        }
        return true;
    }
}
