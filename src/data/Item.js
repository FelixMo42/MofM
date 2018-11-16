import Base from "./components/Base"

const Items = {}

export default class Item extends Base {
    constructor(params) {
        super(Items)
        this.Setup(params)
    }

    // varibles

    name = "def"

    effects = []

    // accessors

    Tile(tile) {
        if (tile) {
            this.tile = tile
            tile.Item(this)
        }
        return this.tile
    }

    Map() {
        return this.tile.Map()
    }

    // functions

    Affect(effect) {
        if (effect.pickup) {
            this.Pickup(effect.source.Player())
        }

        // TODO: more affect stuff
    }

    Pickup(player) {
        this.tile.Item(false)
        delete this.tile
        this.player = player

        player.Equip(this, "gear", 1)

        return this
    }

    Putdown() {
        // TODO: put down stuff
    }

    Equip() {
        // TODO: no player error
        // TODO: no slot error

        // TODO: equip this
    }

    AddEffect(effect) {
        this.effects.push(effect)
    }
}

export { Items }
