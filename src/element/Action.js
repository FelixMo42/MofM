import Base from "../component/Base"
import Vec2 from "../util/Vec2"

export const Actions = {}

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

    Setup(params) {
        super.Setup(params)

        for (var i = 0; i < this.effects.length; i++) {
            this.SetupEffect(this.effects[i])
        }
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

    SetData(effect) {
        effect.source = this
        effect.target = this.target

        if (!effect.skill && this.skill) {
            effect.skill = this.player.Skill(this.skill)
        }

        if (!effect.style) {
            effect.style = this.style
        }
        if (!effect.range) {
            effect.range = this.range
        }
        if (!effect.area) {
            effect.area = this.area
        }
        if (!effect.stat) {
            effect.stat = this.stat
        }
    }

    SetupEffect(effect) {
        this.SetData(effect)
        if (effect.player) {
            this.SetData(effect.player)
        }
        if (effect.item) {
            this.SetData(effect.item)
        }
        if (effect.structor) {
            this.SetData(effect.structor)
        }
    }

    AddEffect(effect) {
        this.effects.push(effect)
    }

    Cheak(target) {
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
        if (Math.floor(Vec2.dist(this.Position(), target)) > this.range) {
            return false
        }
        for (var i in this.effects) {
            if (!styles[this.effects[i].style].cheak(this.Map(), this.Position(), target, this.effects[i])) {
                return false
            }
        }
        if (this.cheak && !this.cheak(this, target)) {
            return false
        }
        return true
    }

    Do(target) {
        if (!this.Cheak(target)) {
            return false
        }

        console.debug(this.player.name + " uses " + this.name + " on " + target.x + ", " + target.y)

        this.target.positon = target

        this.player.Affect(this.cost)

        for (var i in this.effects) {
            styles[this.effects[i].style].do(this.Map(), this.Position(), target, this.effects[i])
        }

        return true
    }
}

// TODO: balance system
