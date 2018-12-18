import React from "react"
import Vec2 from "../util/Vec2"
import Controller from "../util/Controller"

import Base from "../component/Base"

// TODO: add line and cone to styles

const styles = {}

export default class Action extends Base {
    effects = []

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

    Do(pos) {
        var target = {
            Position() {
                return pos
            }
        }

        var effects = [new this.cost(this, target).Setup(this, target)]

        for (var i in this.effects) {
            effects.push(new this.effects[i]().Setup(this, target))
        }

        for (i in effects) {
            if (!effects[i].Cheak()) {
                console.debug(this.player.name + " failed to uses " + this.name + " on " + pos.x + ", " + pos.y)
                return false
            }
        }

        console.debug(this.player.name + " uses " + this.name + " on " + pos.x + ", " + pos.y)

        for (i in effects) {
            effects[i].Do()
        }

        return true
    }

    // graphics

    Render() {
        return (
            <span key={this.key}>
                { this.player.turn && this.player.controller === "player" ?
                    this.RenderCheakBox()
                :
                    "- "
                }
                {this.name}
                <br />
            </span>
        )
    }

    RenderCheakBox() {
        return <input type="checkbox"
            checked={Controller.Action() === this}
            onChange={() => {Controller.Action(this)}}
        />
    }
}

Action.Style = class {
    static Register(name) {
        styles[name] = this
    }

    static Cheak(map, source, target, effect) {
        if (effect.range) {
            if (Math.floor(Vec2.Dist(source, target)) > effect.range) {
                return false
            }
        }
        if (effect.walkable !== undefined) {
            if (map.Tile(target).Walkable() !== effect.walkable) {
                return false
            }
        }
        return true
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
        effect.source = this.source
        effect.target = this.target
        effect.skill = this.skill
        effect.style = this.style
        effect.range = this.range
        effect.area = this.area
        effect.stat = this.stat
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
}

Action.Cost = class extends Action.Effect {
    style = costStyle
}
// TODO: balance system
