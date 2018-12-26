import Base from "../component/Base"
import ManaPool from '../component/ManaPool'
import Interface from '../component/Interface'

export default class Tile extends Interface(ManaPool(Base)) {
    // varibles

    color = "white"

    mp = 100

    effects = []

    walkable = true

    // accessors

    Map() {
        return this.node.map
    }

    Position() {
        return this.node.pos
    }

    Node() {
        return this.node
    }

    Player(player) {
        if (player) {
            this.node.player = player
            //this.node.sprite.player = player.sprite
        } else if (this.node.player && player === false) {
            delete this.node.player
            //delete this.node.sprite.player
        }
        return this.node.player
    }

    Item(item) {
        if (item) {
            this.node.item = item
            this.node.sprite.item = item.sprite
            item.Tile(this)
        } else if (this.node.item && item === false) {
            this.node.item.Tile(false)
            delete this.node.item
            delete this.node.sprite.item
        }
        return this.node.item
    }

    Structor(structor) {
        if (structor) {
            structor.Tile(this)
            this.node.structor = structor
            this.node.sprite.structor = structor.sprite
        } else if (this.node.structor && structor === false) {
            this.node.structor.Tile(false)
            delete this.node.structor
            delete this.node.sprite.structor
        }
        return this.node.structor
    }

    // functions

    Affect(effect) {
        if (!effect.time || effect.time === 0) {
            if (effect.player && this.node.player) {
                this.node.player.Affect(effect.player)
            }
            if (effect.item && this.node.item) {
                this.node.item.Affect(effect.item)
            }
            if (effect.structor && this.node.structor) {
                this.node.structor.Affect(effect.structor)
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

        if (this.node.player) {
            return false
        }
        if (this.node.structor && !this.node.structor.Walkable(mode)) {
            return false
        }

        return this.walkable
    }

    // graphics

    Draw(ctx) {
        ctx.fillStyle = this.color
        ctx.fillRect(
            this.node.pos.x * ctx.size, this.node.pos.y * ctx.size,
            ctx.size, ctx.size
        )
        if (this.node.sprite.player) {
            ctx.strokeStyle = "black"
            ctx.strokeRect(
                this.node.pos.x * ctx.size, this.node.pos.y * ctx.size,
                ctx.size, ctx.size
            )
        }
    }
}
