import Base from "../component/Base"

const Structors = {}

export default class Structor extends Base {
    constructor(params) {
        super(Structor)
        this.Setup(params)
    }

    // varibles

    name = "def"

    walkable = true

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

    Walkable(mode) {
        // TODO: cheak mode
        return this.walkable
    }

    // functions

    Affect(effect) {
        // TODO: affect stuff
    }

    Render() {

    }
}

export { Structors }

// TODO: building and destroying
