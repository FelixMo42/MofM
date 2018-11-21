import React from 'react'
import Vec2 from '../util/Vec2'

import Base from "../component/Base"
import ManaPool from '../component/ManaPool'
import HealthPool from '../component/HealthPool'
import Interface from '../component/Interface'
import Graphics from '../component/Graphics'

import Skill, { Skills } from "./Skill"
import Action, { Actions } from "./Action"

import Draggable from 'react-draggable'
import Path from '../util/Path.js'

const Players = {}

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
    gear = {
        hands: [],
        chest: [],
        head: [],
        legs: [],
        feet: [],
        gear: []
    }
    slots = {
        hands: 2,
        chest: 1,
        head: 1,
        legs: 1,
        feet: 2,
        gear: 1000
    }

    actions = {}
    skills = {}
    stats = {
        int: 0, wil: 0, chr: 0,
        str: 0, con: 0, dex: 0
    }
    moves = {
        move: 2,
        main: 1,
        sub: 2
    }

    effects = []
    bonuses = {
        stat: {},
        skill: {},
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

    Bonus(section, key) {
        if (!key) {
            return this.bonuses[section]
        } else if (key in this.bonuses[section])  {
            return this.bonuses[section][key]
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

    Skills() {
        return this.skills
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

    // functions

    Turn() {
        this.stack = []
        // TODO: regen HP
        // TODO: regen MP, using dynamic system
        // TODO: cheak out effects
        // TODO: do ai stuff

        // regen moves
        for (var k in this.moves) {
            this.moves[k] = this.max_moves[k]
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
            this.stack.push(() => {this.Map().NextTurn()})
        }
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
        if (effect.hp) {
            this.HP(effect.hp)
        }
        if (effect.mp) {
            this.MP(effect.mp)
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

    Equip(item, slot, size) {
        // TODO: unequipe

        if (this.gear[slot].length + size <= this.slots[slot]) {
            for (var i = 0; i < size; i++) {
                this.gear[slot].push(item)
            }
            return true
        } else {
            return false
        }
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
        return <span>gear</span>
    }

    RenderSkills() {
        return <span>skills</span>
    }

    RenderActions() {
        return (<span id="actions">
            <span>main: {this.moves.main} | move: {this.moves.move} | sub: {this.moves.sub}</span>
        </span>)
    }
}

export { Players }

// TODO: hp regen system
// TODO: weapon equipment stuff
