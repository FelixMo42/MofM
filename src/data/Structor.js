import Base from "../util/Base"

const Structors = {}

export default class Structor extends Base {
    constructor(params) {
        super(Structor)
        this.Setup(params)
    }

    // varibles

    name = "def"

    // accessors

    Tile(tile) {
        if (tile) {
            this.tile = tile
            tile.Structor(this)
        }
        return this.tile
    }

    Map() {
        return this.tile.Map()
    }

    // functions

    Affect(effect) {
        // TODO: affect stuff
    }
}

export { Structors }

// TODO: building and destroying
