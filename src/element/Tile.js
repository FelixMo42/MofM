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
    color = "white"

    mp = 100

    effects = []

    walkable = true

    // accessors

    Map() {
        return this.map
    }

    Position() {
        return this.pos
    }

    Player(player) {
        if (player) {
            this.player = player
        } else if (this.player && player === false) {
            delete this.player
        }
        return this.player
    }

    Item(item) {
        if (item) {
            this.item = item
            item.Tile(this)
        } else if (this.item && item === false) {
            this.item.Tile(false)
            delete this.item
        }
        return this.item
    }

    Structor(structor) {
        if (structor) {
            structor.Tile(this)
            this.structor = structor
        } else if (this.structor && structor === false) {
            this.structor.Tile(false)
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

    Walkable(mode) {
        // TODO: cheak mode

        if (this.player) {
            return false
        }
        if (this.structor && !this.structor.Walkable(mode)) {
            return false
        }

        return this.walkable
    }

    // graphics

    Draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.pos.x * ctx.size, this.pos.y * ctx.size, ctx.size, ctx.size)
        ctx.strokeStyle = "black"
        ctx.strokeRect(this.pos.x * ctx.size, this.pos.y * ctx.size, ctx.size, ctx.size)
    }
}

export { Tiles }
