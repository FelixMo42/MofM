import React from 'react'
import Controller from '../util/Controller'

import Base from "../component/Base"
import ManaPool from '../component/ManaPool'
import HealthPool from '../component/HealthPool'
import Interface from '../component/Interface'

import Skill, { Skills } from "./Skill"
import Action, { Actions } from "./Action"

import Draggable from 'react-draggable'
import Path from '../util/Path.js'

export const Players = {}

class Slot {
    amu = 0
    items = []

    constructor(name, max) {
        this.name = name
        this.max = max
    }

    add(item) {
        item.player.items[item] = this
        this.amu += item.size
        this.items.push(item)
    }

    remove(item) {
        for (var i = this.items.indexOf(item); i < this.items.length - 1; i++) {
            this.items[i] = this.items[i + 1]
        }
        delete this.items[this.items.length - 1]
    }

    render() {
        return (
            <div>
                { Object.keys(this.items).map((pos) => {
                    return (
                        <div key={this.items[pos].key}>
                            {this.items[pos].name}
                            {
                                this.items[pos].equped &&
                                <button onClick={() => {this.items[pos].Unequip()}}>U</button> ||
                                <button onClick={() => {this.items[pos].Equip()}}>E</button>
                            }
                            <button onClick={() => {this.items[pos].Drop()}}>D</button>
                        </div>
                    )
                }) }
            </div>
        )
    }
}

export default class Player extends Interface(HealthPool(ManaPool(Base))) {
    constructor(params) {
        super(Players)
        this.Setup(params)

        this.max_moves = {}
        for (var k in this.moves) {
            this.max_moves[k] = this.moves[k]
        }
    }

    // varibles

    name = "def"
    color = "blue"

    hp = 20
    mp = 20

    xp = 0
    lv = 1

    gp = 0

    items = {}
    gear = {
        hands: new Slot(2),
        chest: new Slot(1),
        head: new Slot(1),
        legs: new Slot(1),
        feet: new Slot(2),
        gear: new Slot(1000)
    }

    actions = {}
    skills = {}
    stats = {
        int: 0, wil: 0, chr: 0,
        str: 0, con: 0, dex: 0
    }
    moves = {
        move: 5,
        main: 1,
        sub: 2
    }

    effects = []
    bonuses = {
        stat: {},
        skill: {},
        action: {},
        list: []
    }

    controller = "robot"

    // accessors

    GP(gp) {
        if (gp) {
            this.gp += gp

            if (this.gp < 0) {
                this.gp = 0
            }
        }

        return this.gp
    }

    XP(xp) {
        if (xp) {
            this.xp += xp

            if (xp > 1000) { // TODO: get actulle number
                this.lv += 1

                // TODO: rest of lv up code
            }
        }

        return this.xp
    }

    LV() {
        return this.lv
    }

    Bonus(section, key = true) {
        // TODO: hash tables
        if (section instanceof Object && key) {
            section.active = true
            this.bonuses.list.push(section)
            if (!section.timer) {section.timer = 1}
            if (section.stat) {
                for (var stat in section.stat) {
                    if (!(stat in this.bonuses["stat"])) {
                        this.bonuses["stat"][stat] = 0
                    }
                    this.bonuses["stat"][stat] += section.stat[stat]
                }
            }
            if (section.skill) {
                for (var skill in section.skill) {
                    if (!(skill in this.bonuses["skill"])) {
                        this.bonuses["skill"][skill] = 0
                    }
                    this.bonuses["skill"][skill] += section.skill[skill]
                }
            }
            if (section.actions) {
                for (var action in section.skill) {
                    this.bonuses["action"][action.id] = action
                }
            }
        } else if (section instanceof Object && !key && section.active) {
            section.active = false

            if (section.stat) {
                for (var stat in section.stat) {
                    this.bonuses["stat"][stat] -= section.stat[stat]
                }
            }
            if (section.skill) {
                for (var skill in section.skill) {
                    this.bonuses["skill"][skill] -= section.skill[skill]
                }
            }
            if (section.actions) {
                for (var action in section.skill) {
                    // TODO: remove actions
                }
            }
            // TODO: remove from bonuses list
        } else {
            if (!key) {
                return this.bonuses[section]
            } else if (key in this.bonuses[section]) {
                return this.bonuses[section][key]
            } else {
                return 0
            }
        }
    }

    Stat(stat) {
        if ("stat/" + stat in this.bonuses) {
            return this.stats[stat] + this.Bonus("stat", stat)
        } else {
            return this.stats[stat]
        }
    }

    Actions() {
        return this.actions
    }

    Action(action) {
        if (action.id in this.actions) {
            return this.actions[action.id]
        } else {
            return false
        }
    }

    Skill(skill) {
        if (skill instanceof Skill) {
            skill = skill.id
        }

        if (!(skill in this.skills)) {
            this.skills[skill] = Skills[skill].Clone({player: this})
        }

        return this.skills[skill]
    }

    Tile(tile) {
        if (tile) {
            if (this.tile) {
                this.tile.Player(false)
            }
            this.tile = tile
            tile.Player(this)
        }
        return this.tile
    }

    Map() {
        return this.tile.Map()
    }

    Position(pos) {
        if (pos) {
            console.debug(this.name + " moves to " + pos.x + ", " + pos.y)
            this.Tile(this.Map().Tile(pos))
        }

        return this.tile.Position()
    }

    Moves(name, amu) {
        if (name) {
            if (amu) {
                this.moves[name] = Math.min(
                    Math.max(this.moves[name] + amu, 0),
                    this.max_moves[name]
                )
            }
            return this.moves[name]
        } else {
            return this.moves
        }
    }

    MaxMoves(name, amu) {
        if (name) {
            if (amu) {
                this.max_moves[name] = Math.max(this.max_moves[name] + amu, 0)
            }
            return this.max_moves[name]
        } else {
            return this.max_moves
        }
    }

    DR() {
        return this.Skill( Skills["defence"] ).Roll("con", 0)
    }

    Dodge() {
        return this.Skill( Skills["dodge"] ).Roll("dex")
    }

    // functions

    Turn() {
        this.stack = []
        this.turn = true
        console.debug(this.name + " starts their turn")

        // TODO: regen HP
        // TODO: regen MP, using dynamic system
        // TODO: cheak out effects
        // TODO: do ai stuff

        // regen moves
        for (var k in this.moves) {
            this.Moves(k, this.MaxMoves(k))
        }

        // AI
        if (this.controller === "robot") {
            if (this.target.HP() > 0) {
                var path = Path.find(this.Map(), this.Position(), this.target.Position())
                while (path.length > 0 && this.moves.move > 0) {
                    this.Action( Actions["move"] ).Do(path[0])
                    path.shift()
                }
                this.Action( Actions["punch"] ).Do(this.target.Position())
            }
            this.stack.push(() => {
                this.EndTurn()
                return true
            })
        } else if (this.controller === "player") {
            Controller.Action( this.Action( Actions["move"] ) )
        }

        this.UpdateHTML()
    }

    EndTurn() {
        console.debug(this.name + " ends their turn")
        this.turn = false
        this.UpdateHTML()
        this.Map().NextTurn()
    }

    Learn(action) {
        if (action instanceof Action) {
            action = action.id
        }

        if (!(action in this.actions)) {
            this.actions[action] = Actions[action].Clone({player: this})
        }

        return this.actions[action]
    }

    Die() {
        console.debug(this.name + " died")
        this.Map().RemovePlayer(this)
    }

    Affect(effect, sourcePos, targetPos) {
        var aim = undefined
        if (effect.skill) {
            aim = effect.skill.Roll(effect.stat)
        }
        if (effect.hp) {
            this.HP(effect.hp, aim)
        }
        if (effect.mp) {
            this.MP(effect.mp, aim)
        }
        if (effect.push) {
            this.Position(effect.target.Position()) // TODO: make it not teleportation
        }
        if (effect.moves) {
            for (var k in effect.moves) {
                this.Moves(k, effect.moves[k])
            }
        }
        // TODO: more affect stuff
    }

    Unequip(item) {
        this.items[item].remove(item)
        delete this.items[item]
        this.UpdateHTML()
    }

    Equip(item, slot) {
        var suc = this.gear[slot].add(item)
        this.UpdateHTML()
        return suc
    }

    // graphics

    stack = []

    Draw(ctx) {
        ctx.beginPath()

        ctx.fillStyle = this.color
        ctx.strokeStyle = "black"
        var pos = this.tile.Position()
        ctx.arc((pos.x + .5) * ctx.size, (pos.y + .5) * ctx.size, ctx.size / 2 - 3, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()

        if (this.stack[0]) {
            if (this.stack[0](this)) {
                this.stack.shift()
            }
        }
    }

    Render(state) {
        return (
            <Draggable defaultPosition={{x: 0, y: 0}} handle=".box" cancel="span" bounds="#Game">
                <div className="player box">
                    <span className="top cancel">
                        { this.name }
                    </span>
                    <hr />
                    { state.window === "info" ? this.RenderInfo() : "" }
                    { state.window === "gear" ? this.RenderGear() : "" }
                    { state.window === "skills" ? this.RenderSkills() : "" }
                    { state.window === "actions" ? this.RenderActions() : "" }
                    <hr />
                    <span onClick={()=>{state.window = "info"; this.UpdateHTML()}}>info </span>|
                    <span onClick={()=>{state.window = "gear"; this.UpdateHTML()}}> gear </span>|
                    <span onClick={()=>{state.window = "skills"; this.UpdateHTML()}}> skills </span>|
                    <span onClick={()=>{state.window = "actions"; this.UpdateHTML()}}> actions</span>
                </div>
            </Draggable>
        )
    }

    RenderInfo() {
        return (
            <span id="info">
                <span>HP: {this.hp} | MP: {this.mp}</span>
                <hr className="light" />
                <span>INT: {this.stats.int} | WIL: {this.stats.wil} | CHR: {this.stats.chr}</span><br />
                <span>STR: {this.stats.str} | CON: {this.stats.con} | DEX: {this.stats.dex}</span>
            </span>
        )
    }

    RenderGear() {
        return (
            <span>
                { Object.keys(this.gear).map((slot) => {
                    return <div key={slot}>- {slot}:{this.gear[slot].render()}</div>
                }) }
            </span>
        )
    }

    RenderSkills() {
        return (
            <span>
                { Object.values(this.skills).map((skill) => {
                    return skill.Render()
                }) }
            </span>
        )
    }

    RenderActions() {
        return (<span id="actions">
            <span>main: {this.moves.main} | move: {this.moves.move} | sub: {this.moves.sub}</span>
            <hr className="light"/>
            { Object.values(this.actions).map((action) =>
                <span key={action.key}>
                    {this.turn && this.controller === "player" ?
                        <input type="checkbox"
                            checked={Controller.Action() === action}
                            onChange={() => {Controller.Action(action)}}
                        />
                    :
                        "- "
                    }
                    {action.name}
                    <br />
                </span>
            ) }
        </span>)
    }
}

// TODO: hp regen system
// TODO: weapon equipment stuff
