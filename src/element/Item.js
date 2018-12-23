import Base from "../component/Base"

export default class Item extends Base {
    // varibles

    type = "def"

    size = 1
    equped = false

    range = 1
    area = 1
    style = "ball"
    dmg = [1, 1]

    effects = []
    action = []

    eq_bonus = {timer: -1}
    uq_bonus = {timer: -1}

    // accessors

    Tile(tile) {
        if (tile) {
            this.tile = tile
        } else if (this.tile && tile === false) {
            delete this.tile
        }
        return this.tile
    }

    Player() {
        return this.player
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
        console.debug(player.name + " picks up " + this.name)

        if (this.tile) {
            this.tile.Item(false)
        }
        this.player = player

        this.player.Bonus(this.uq_bonus, true)
        this.player.Equip(this, "gear")

        this.equped = false

        return this
    }

    Drop() {
        console.debug(this.player.name + " dropps " + this.name)

        // TODO: what if tile full?

        this.player.Bonus(this.eq_bonus, false)
        this.player.Bonus(this.uq_bonus, false)

        this.player.Unequip(this)
        this.player.Tile().Item(this)
    }

    Equip() {
        console.debug(this.player.name + " equips " + this.name)

        this.equped = true

        this.player.Unequip(this)
        this.player.Equip(this, this.slot)

        this.player.Bonus(this.eq_bonus, true)
    }

    Unequip() {
        console.debug(this.player.name + " unequips " + this.name)

        this.equped = false
        this.player.Bonus(this.eq_bonus, false)
        this.player.Unequip(this)
        this.player.Equip(this, "gear")
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
