import Base from "../component/Base"

const Items = {}

export default class Item extends Base {
    constructor(params) {
        super(Items)
        this.Setup(params)
    }

    // varibles

    name = "def"

    size = 1
    effects = []

    // accessors

    Tile(tile) {
        if (tile) {
            this.tile = tile
        } else if (this.tile && tile === false) {
            delete this.tile
        }
        return this.tile
    }

    Position() {
        return this.tile.Position()
    }

    Map() {
        return this.tile.Map()
    }

    // functions

    Affect(effect, sourcePos, targetPos) {
        if (effect.pickup) {
            this.Pickup(effect.source.Player())
        }

        // TODO: more affect stuff
    }

    Pickup(player) {
        this.tile.Item(false)
        this.player = player

        player.Equip(this, "gear", 1)

        return this
    }

    Drop() {
        // TODO: what if tile full?
        this.player.Unquip(this)
        this.player.Tile().Item(this)
    }

    Equip() {
        this.player.Unquip(this)
        this.player.Equip(this, this.slot, 1)
    }

    AddEffect(effect) {
        this.effects.push(effect)
    }

    // graphics

    Draw(ctx) {
        var dif = .3
        var add = dif * ctx.size
        var size = ctx.size * (1 - dif * 2)
        var pos = this.Position()
        ctx.fillStyle = this.color
        ctx.fillRect(pos.x * ctx.size + add, pos.y * ctx.size + add, size, size)
    }
}

export { Items }
