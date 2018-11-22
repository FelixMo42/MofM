import Base from "../component/Base"
import Vec2 from "../util/Vec2"

const Actions = {}

// TODO: add line and cone to styles

const styles = {
    ball: {
        cheak: (map, sourcePos, targetPos, effect) => {
            return Math.floor(Vec2.dist(sourcePos, targetPos)) <= effect.range
        },
        do: (map, sourcePos, targetPos, effect) => {
            map.Tile(targetPos).Affect(effect, sourcePos, targetPos) // TODO: implement area
        }
    },
    click: {
        cheak: (map, sourcePos, targetPos, effect) => {
            return true
        },
        do: (map, sourcePos, targetPos, effect) => {
            map.Tile(targetPos).Affect(effect, sourcePos, targetPos)
        }
    },
    self: {
        cheak: (map, sourcePos, targetPos, effect) => {
            return true
        },
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

    range = 1
    area = 1

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
        if (!effect.range) {
            effect.range = this.range
        }
        if (!effect.area) {
            effect.area = this.area
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
                if (this.cost.moves[k] < -this.player.Moves(k)) {
                    return false
                }
            }
        }
        if (Math.floor(Vec2.dist(this.Position(), positon)) > this.range) {
            return false
        }
        for (var i in this.effects) {
            if (!styles[this.effects[i].style].cheak(this.Map(), this.Position(), positon, this.effects[i])) {
                return false
            }
        }
        return true
    }

    Do(positon) {
        if (!this.Cheak(positon)) {
            return false
        }

        console.debug(this.player.name + " uses " + this.name + " on " + positon.x + ", " + positon.y)

        this.target.positon = positon

        this.player.Affect(this.cost)

        for (var i in this.effects) {
            styles[this.effects[i].style].do(this.Map(), this.Position(), positon, this.effects[i])
        }

        return true
    }
}

export { Actions }

// TODO: balance system
