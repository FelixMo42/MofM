import Base from "../component/Base"

const Actions = {}

const styles = {
    click: {
        // TODO: add cheak
        do: (map, sourcePos, targetPos, effect) => {
            map.Tile(targetPos).Affect(effect, sourcePos, targetPos)
        }
    },
    self: {
        do: (map, sourcePos, targetPos, effect) => {
            map.Tile(sourcePos).Affect(effect, targetPos, sourcePos)
        }
    }
}

export default class Action extends Base {
    constructor(params) {
        super(Actions)
        this.Setup(params)
    }

    name = "def"
    style = "click"
    effects = []
    cost = {}

    target = {
        Position() {
            return this.positon
        }
    }

    // accessors

    Player() {
        return this.player
    }

    Map() {
        return this.player.Map()
    }

    Position() {
        return this.player.Position()
    }

    // functions

    SetSources(effect) {
        effect.source = this
        effect.target = this.target
        if (effect.player) {
            effect.player.source = this
            effect.player.target = this.target
        }
        if (effect.item) {
            effect.item.source = this
            effect.item.target = this.target
        }
        if (effect.structor) {
            effect.structor.source = this
            effect.structor.target = this.target
        }
    }

    Setup(params) {
        super.Setup(params)

        for (var i = 0; i < this.effects.length; i++) {
            this.SetSources(this.effects[i])
        }
    }

    AddEffect(effect) {
        if (!effect.style) {
            effect.style = this.style
        }
        if (!effect.skill && this.skill) {
            effect.skill = this.skill
        }

        this.effects.push(effect)
    }

    Cheak(positon) {
        if (this.cost.hp) {
            if (this.cost.hp > this.player.HP()) {
                return false
            }
        }
        if (this.cost.mp) {
            if (this.cost.mp > this.player.MP()) {
                return false
            }
        }
        if (this.cost.moves) {
            for (var k in this.cost.moves) {
                if (this.cost.moves[k] > this.player.Moves(k)) {
                    return false
                }
            }
        }
        // TODO: cheak positon
        return true
    }

    Do(positon) {
        if (!this.Cheak(positon)) {
            return false
        }

        console.debug(this.player.name + " uses " + this.name + " on " + positon.x + ", " + positon.y)

        this.target.positon = positon

        this.player.Affect(this.cost)

        for (var i = 0; i < this.effects.length; i++) {
            styles[this.effects[i].style].do(
                this.player.Map(),
                this.player.Tile().Position(),
                positon,
                this.effects[i]
            )
        }

        return true
    }
}

export { Actions }

// TODO: balance system
