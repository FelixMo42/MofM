import Base from "../component/Base"
import ManaPool from '../component/ManaPool'

const Tiles = {}

export default class Tile extends ManaPool(Base) {
    constructor(params) {
        super(Tiles)
        this.Setup(params)
    }

    // varibles

    name = "def"
    color = "white";

    mp = 100

    effects = []

    // accessors

    Map() {
        return this.map
    }

    Player(player) {
        if (player) {
            this.player = player
        } else if (player === false) {
            delete this.player
        }
        return this.player
    }

    Item(item) {
        if (item) {
            this.item = item
        } else if (item === false) {
            delete this.item
        }
        return this.item
    }

    Structor(structor) {
        if (structor) {
            this.structor = structor
        } else if (structor === false) {
            delete this.structor
        }
        return this.structor
    }

    // functions

    Affect(effect) {
        if (!effect.time || effect.time === 0) {
            if (effect.player && this.player) {
                this.player.Affect(effect.player)
            }
            if (effect.item && this.item) {
                this.item.Affect(effect.item)
            }
            if (effect.structor && this.structor) {
                this.structor.Affect(effect.structor)
            }
            // TODO: stuff that effects tile
        } else {
            // TODO: triggers and things like that
            this.effects.push(effect)
        }
    }

    Update() {
        // TODO: spread mp
        // TODO: cheak effects
    }

    // graphics

    Render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * ctx.size, this.y * ctx.size, ctx.size, ctx.size);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(this.x * ctx.size, this.y * ctx.size, ctx.size, ctx.size);
    }
}

export { Tiles }
