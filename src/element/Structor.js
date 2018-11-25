import Base from "../component/Base"

export const Structors = {}

export default class Structor extends Base {
    constructor(params) {
        super(Structors)
        this.Setup(params)
    }

    // varibles

    name = "def"

    walkable = true

    // accessors

    Tile(tile) {
        if (tile) {
            this.tile = tile
        }
        return this.tile
    }

    Map() {
        return this.tile.Map()
    }

    Walkable(mode) {
        // TODO: cheak mode
        return this.walkable
    }

    Position() {
        return this.tile.Position()
    }

    // functions

    Affect(effect) {
        // TODO: affect stuff
    }

    Draw(ctx) {
        var dif = .05
        var add = dif * ctx.size
        var size = ctx.size * (1 - dif * 2)
        var pos = this.Position()
        ctx.fillStyle = this.color
        ctx.fillRect(pos.x * ctx.size + add, pos.y * ctx.size + add, size, size)
    }
}

// TODO: building and destroying
