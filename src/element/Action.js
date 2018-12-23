import React from "react"

import Vec2 from "../util/Vec2"
import Controller from "../util/Controller"
import Value from "../util/Value"

import Base from "../component/Base"

// TODO: add line and cone to styles

const styles = {}

export default class Action extends Base {
    set effects(effects) {
        for (var i in effects) {
            this._effects.push(new effects[i]().Setup(this, this.target))
        }
    }

    set cheaks(cheaks) {
        for (var k in cheaks) {
            if (cheaks[k] instanceof Value) {
                cheaks[k].source = this
            }
        }
        this._cheaks = cheaks
    }

    _effects = []
    _cheaks = {}
    target = {}

    // accessors

    Player(player) {
        return this.player
    }

    Map() {
        return this.player.Map()
    }

    Position() {
        return this.player.Position()
    }

    static Styles(name) {
        if (name) {
            return styles[name]
        }
        return styles
    }

    // functions

    Get(cheak) {
        if (this._cheaks[cheak] instanceof Value) {
            return this._cheaks[cheak].Value()
        } else {
            return this._cheaks[cheak]
        }
    }

    Cheak(pos, effects) {
        if (this._cheaks.range) {
            if (Vec2.Dist(this.Position(), pos) > this.Get("range")) {
                return false
            }
            // TODO: fix range bugs
        }
        if (this._cheaks.walkable !== undefined) {
            if (this.Map().Tile(pos).Walkable() !== this.Get("walkable")) {
                return false
            }
        }
        for (var i in effects) {
            if (!effects[i].Cheak()) {
                return false
            }
        }
        return true
    }

    Do(pos) {
        this.target.Position = () => {
            return pos
        }

        var effects = [new this.cost().Setup(this, this.target)]

        for (var i in this._effects) {
            effects.push(this._effects[i])
        }

        if (!this.Cheak(pos, effects)) {
            console.debug(this.player.name + " failed to uses " + this.name + " on " + pos.x + ", " + pos.y)
            return false
        }

        console.debug(this.player.name + " uses " + this.name + " on " + pos.x + ", " + pos.y)

        for (i in effects) {
            effects[i].Do()
        }

        return true
    }

    // graphics

    DrawUI(ctx) {
        this.target.Position = () => {
            return ctx.mousePos
        }

        if (this._cheaks.range) {
            ctx.beginPath()
            ctx.fillStyle = "rgba(0, 0, 255, 0.5)"
            var pos = this.Position()
            var size = ctx.size * this.Get("range") * 2
            ctx.arc((pos.x + .5) * ctx.size, (pos.y + .5) * ctx.size, size / 2, 0, 2 * Math.PI)
            ctx.fill()
        }

        for (var i in this._effects) {
            this._effects[i].DrawUI(this, ctx, this.Cheak(
                ctx.mousePos, this._effects
            ))
        }
    }

    Render() {
        return (
            <span key={this.key}>
                {this.player.turn && this.player.controller === "player" ?
                    <input type="checkbox"
                        checked={Controller.Action() === this}
                        onChange={() => {Controller.Action(this)}}
                    />
                :
                    "- "
                }
                {this.itemType ?
                    this.name + " (" + this.item.name + ")"
                :
                    this.name
                }
                <br />
            </span>
        )
    }
}

Action.Style = class {
    static Register(name) {
        styles[name] = this
    }

    static Cheak(map, source, target, effect) {
        return true
    }

    static DrawUI(source, ctx, cheak, effect) {
        ctx.beginPath()
        if (cheak) {
            ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
        } else {
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
        }
        var pos = ctx.mousePos
        var size = ctx.size * (effect.area * 2 + 1)
        ctx.arc((pos.x + .5) * ctx.size, (pos.y + .5) * ctx.size, size / 2, 0, 2 * Math.PI)
        ctx.fill()
    }
}

export class ballStyle extends Action.Style {
    static Cheak(map, source, target, effect) {
        return super.Cheak(map, source, target, effect)
    }

    static Do(map, sourcePos, targetPos, effect) {
        map.Tile(targetPos).Affect(effect, sourcePos, targetPos)
        // TODO: implement area
    }
}
ballStyle.Register("ball")

export class clickStyle extends Action.Style {
    static Cheak(map, source, target, effect) {
        return super.Cheak(map, source, target, effect)
    }

    static Do(map, sourcePos, targetPos, effect) {
        map.Tile(targetPos).Affect(effect, sourcePos, targetPos)
    }
}
clickStyle.Register("click")

export class selfStyle extends Action.Style {
    static Cheak(map, source, target, effect) {
        return super.Cheak(map, source, target, effect)
    }

    static Do(map, sourcePos, targetPos, effect) {
        map.Tile(sourcePos).Affect(effect, targetPos, sourcePos)
    }
}
selfStyle.Register("self")

export class costStyle extends Action.Style {
    static Cheak(map, source, target, effect) {
        var player = map.Tile(source).Player()
        if (!super.Cheak(map, source, target, effect)) {
            return false
        }
        if (effect.hp) {
            if (effect.hp > player.HP()) {
                return false
            }
        }
        if (effect.mp) {
            if (effect.mp > player.MP()) {
                return false
            }
        }
        if (effect.moves) {
            for (var k in effect.moves) {
                if (effect.moves[k] < -player.Moves(k)) {
                    return false
                }
            }
        }
        return true
    }

    static Do(map, source, target, effect) {
        map.Tile(source).Player().Affect(effect)
    }
}
costStyle.Register("cost")

Action.Effect = class {
    style = ballStyle
    area = 0

    Setup(source, target) {
        this.source = source
        this.target = target
        if (this.skill) {
            this.skill = this.source.Player().Skill(this.skill)
        }
        // share data with subunits
        if (this.player) {
            this.SetData(this.player)
        }
        if (this.item) {
            this.SetData(this.item)
        }
        if (this.structor) {
            this.SetData(this.structor)
        }

        return this
    }

    SetData(effect) {
        // set data
        effect.source = this.source
        effect.target = this.target
        effect.skill = this.skill
        effect.style = this.style
        effect.range = this.range
        effect.area = this.area
        effect.stat = this.stat
        // source values
        for (var k in effect) {
            if (effect[k] instanceof Value) {
                effect[k].source = this.source
            }
        }
    }

    Cheak() {
        return this.style.Cheak(
            this.source.Map(),
            this.source.Position(),
            this.target.Position(),
            this
        )
    }

    Do() {
        return this.style.Do(
            this.source.Map(),
            this.source.Position(),
            this.target.Position(),
            this
        )
    }

    DrawUI(source, ctx, cheak) {
        return this.style.DrawUI(source, ctx, cheak, this)
    }
}

Action.Cost = class extends Action.Effect {
    style = costStyle
}

Action.Item = class extends Value {
    constructor(name, value) {
        super()
        this.name = name
        this.value = value || 0
    }

    Constant() {
        if (this.source.item.states[this.name] instanceof Value) {
            return this.source.states[this.name].Constant()
        } else {
            return true
        }
    }

    Value() {
        return this.Cheak(this.source.item.states[this.name]) + this.value
    }

    // TODO: value add cheak
}
// TODO: balance system
