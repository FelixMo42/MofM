import React from 'react'
import Controller from '../util/Controller'
import Draggable from 'react-draggable'
import Path from '../util/Path.js'

import Base from "../component/Base"
import ManaPool from '../component/ManaPool'
import HealthPool from '../component/HealthPool'
import Interface from '../component/Interface'

import Skill from "./Skill"
import Action from "./Action"

class Slot {
    amu = 0
    items = []

    constructor(name, max) {
        this.name = name
        this.max = max
    }

    add(item) {
        item.player._items[item] = this
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
                            {this.items[pos].equped ?
                                <button onClick={() => {this.items[pos].Unequip()}}>U</button>
                            :
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
    set actions(actions) {
        for (var i in actions) {
            var action = new actions[i]({player: this})
            if (action.itemType) {
                if (!(action.itemType in this._item_actions_ids)) {
                    this._item_actions_ids[action.itemType] = {}
                }
                this._item_actions_ids[action.itemType][action.id] = actions[i]
            } else {
                this._actions[actions[i].id] = action
            }
        }
    }

    set moves(moves) {
        for (var key in moves) {
            this._moves[key] = moves[key]
            this._max_moves[key] = moves[key]
        }
    }

    set links(links) {
        for (var i in links) {
            this._links[links[i].faction.id] = links[i]
        }
    }

    set items(items) {
        for (var i in items) {
            new items[i]().Pickup(this)
        }
    }

    set equiped(equiped) {
        for (var i in equiped) {
            new equiped[i]().Pickup(this).Equip()
        }
    }

    // varibles

    _actions = {}
    _item_actions = {}
    _item_actions_ids = {}
    _moves = {}
    _max_moves = {}
    _links = {}
    _items = {}

    color = "blue"
    controller = "robot"

    hp = 100
    mp = 100

    xp = 0
    lv = 1

    gp = 0
    gear = {
        hands: new Slot(2),
        chest: new Slot(1),
        head: new Slot(1),
        legs: new Slot(1),
        feet: new Slot(2),
        gear: new Slot(1000)
    }

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

    // accessors

    Link(faction) {
        if (this._links[faction.id]) {
            return this._links[faction.id].value
        } else {
            return 0
        }
    }

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
        /*if (section instanceof Object && key) {
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
        }*/
    }

    Stat(stat) {
        if ("stat/" + stat in this.bonuses) {
            return this.stats[stat] + this.Bonus("stat", stat)
        } else {
            return this.stats[stat]
        }
    }

    Actions() {
        return this._actions
    }

    Action(action) {
        if (action.id in this._actions) {
            return this._actions[action.id]
        } else {
            return false
        }
    }

    Skill(skill) {
        if (!(skill.id in this.skills)) {
            this.skills[skill.id] = new skill({player: this})
        }
        return this.skills[skill.id]
    }

    Tile(tile) {
        if (tile) {
            if (this.node) {
                this.node.tile.Player(false)
            } else {
                tile.node.sprite.player = this.sprite
            }
            this.node = tile.node
            tile.Player(this)
        }
        return this.tile
    }

    Map() {
        return this.node.map
    }

    Position(pos, params) {
        if (pos) {
            console.debug(this.name + " moves to " + pos.x + ", " + pos.y)


            if (params.stack) {
                var time = 1
                this.sprite.LogPosition()
                params.stack.push((player, ctx) => {
                    time -= ctx.dt
                    if (time < 0) {
                        this.sprite.SetPosition(pos)
                        return true
                    } else {
                        return false
                    }
                })
            } else {
                this.sprite.SetPosition(pos)
            }

            this.Tile(this.Map().Tile(pos))
        }

        return this.node.pos
    }

    Moves(name, amu) {
        if (name) {
            if (amu) {
                this._moves[name] = Math.min(
                    Math.max(this._moves[name] + amu, 0),
                    this._max_moves[name]
                )
            }
            return this._moves[name]
        } else {
            return this._moves
        }
    }

    MaxMoves(name, amu) {
        if (name) {
            if (amu) {
                this._max_moves[name] = Math.max(this._max_moves[name] + amu, 0)
            }
            return this._max_moves[name]
        } else {
            return this._max_moves
        }
    }

    DR() {
        return this.Skill( Skill.Get("Defence") ).Roll("con")
    }

    Dodge() {
        return this.Skill( Skill.Get("Dodge") ).Roll("dex")
    }

    // functions

    Turn() {
        this.stack = []
        this.turn = true
        console.debug(this.name + " starts their turn in " + this.controller + " mode")

        // TODO: regen HP
        // TODO: regen MP, using dynamic system
        // TODO: cheak out effects
        // TODO: do ai stuff

        // regen moves
        for (var k in this._moves) {
            this.Moves(k, this.MaxMoves(k))
        }

        // AI
        if (this.controller === "robot") {
            var target = this.Enemey()
            if (target) {
                if (target.HP() > 0) {
                    var path = Path.find(this.Map(), this.Position(), target.Position())
                    while (path.length > 0 && this._moves.move > 0) {
                        this.Action( Action.Get("Move") ).Do(path[0])
                        path.shift()
                    }
                    this.Action( Action.Get("Punch") ).Do(target.Position())
                }
            }
            this.stack.push(() => {
                this.EndTurn()
                return true
            })
        } else if (this.controller === "player") {
            Controller.Action( this.Action( Action.Get("Move") ) )
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
            this.actions[action] = new action({player: this})
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
            this.HP(effect.hp, {
                aim: aim,
                stack: effect.source.Player().stack
            })
        }
        if (effect.mp) {
            this.MP(effect.mp, {
                aim: aim
            })
        }
        if (effect.push) {
            this.Position(effect.target.Position(), {
                aim: aim,
                stack: effect.source.Player().stack
            })
            // TODO: make it not teleportation
        }
        if (effect.moves) {
            for (var k in effect.moves) {
                this.Moves(k, effect.moves[k])
            }
        }
        // TODO: more affect stuff
    }

    Relationship(player) {
        if (this._links[player.id]) {
            return this._links[player.id].value
        }
        var value = 0
        for (var id in this._links) {
            value += this._links[id].Relationship(player)
        }
        return value
    }

    Enemey() {
        var value = 0
        var players = this.Map().Players()
        var enemey
        for (var i in players) {
            var v = this.Relationship(players[i])
            if (value > v) {
                value = v
                enemey = players[i]
            }
        }
        return enemey
    }

    Unequip(item) {
        this._items[item].remove(item)
        delete this._item_actions[item.key]
        delete this._items[item]
        this.UpdateHTML()
    }

    Equip(item, slot) {
        var suc = this.gear[slot].add(item)
        if (this._item_actions_ids[item.type] && slot !== "gear") {
            this._item_actions[item.key] = {}
            for (var id in this._item_actions_ids[item.type]) {
                var action = new this._item_actions_ids[item.type][id]({
                    player: this,
                    item: item
                })
                this._item_actions[item.key][action.id] = action
            }
        }
        this.UpdateHTML()
        return suc
    }

    // graphics

    stack = []

    Draw(ctx, position) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.strokeStyle = "black"
        var pos = this.Position()
        ctx.arc(
            (pos.x + .5) * ctx.size,
            (pos.y + .5) * ctx.size,
            ctx.size / 2 - 3, 0, 2 * Math.PI
        )
        ctx.fill()
        ctx.stroke()

        if (this.stack[0]) {
            if (this.stack[0](this, ctx)) {
                this.stack.shift()
            }
        }
    }

    Render(state) {
        return (
            <Draggable handle=".box" cancel="span" bounds="#Game">
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
                { Object.values(this.skills).map((skill) => skill.Render()) }
            </span>
        )
    }

    RenderActions() {
        return (<span id="actions">
            <span>
                main: {this._moves.main} / {this._max_moves.main} |
                move: {this._moves.move} / {this._max_moves.move} |
                sub: {this._moves.sub} / {this._max_moves.sub}
            </span>
            <hr className="light"/>
            {Object.values(this._actions).map((action) =>
                action.itemType ? "" : action.Render()
            )}
            {Object.keys(this._item_actions).map((key) => {
                return Object.values(this._item_actions[key]).map((action) => {
                    return action.Render()
                })
            })}
            {/* Object.values(this.skills).map((skill) => {
                return Object.values(skill.Actions()).map((action) => "")
            }) */}
        </span>)
    }
}

// TODO: hp regen system
// TODO: weapon equipment stuff
