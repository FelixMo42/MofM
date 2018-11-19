import React from 'react'
import Base from "../mixin/Base"

import Skill, { Skills } from "./Skill"
import Action, { Actions } from "./Action"

import ManaPool from '../mixin/ManaPool'
import HealthPool from '../mixin/HealthPool'

const Players = {}

export default class Player extends HealthPool(ManaPool(Base)) {
    constructor(params) {
        super(Players)
        this.Setup(params)
    }

    // varibles

    name = "def"
    color = "blue"

    hp = 20
    mp = 20

    xp = 0
    lv = 0

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
        move: 5,
        main: 1,
        sub: 2
    }

    effects = []
    bonuses = {
        stat: {},
        skill: {},
    }

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
            this.tile = tile
            tile.Player(this)
        }
        return this.tile
    }

    Map() {
        return this.tile.Map()
    }

    // functions

    Turn() {
        // TODO: regen HP
        // TODO: regen MP, using dynamic system
        // TODO: cheak out effects
        // TODO: do ai stuff
        this.tile.Map().NextTurn()
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
        // TODO: Make player die
    }

    Affect(effect) {
        if (effect.hp) {
            this.HP(effect.hp)
        }
        if (effect.mp) {
            this.MP(effect.mp)
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

    Draw(ctx) {
        ctx.beginPath();

        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        var x = (this.tile.x + .5) * ctx.size
        var y = (this.tile.y + .5) * ctx.size
        ctx.arc(x, y, ctx.size / 2 - 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        /*if (this.stack[0]) {
            if (this.stack[0](this)) {
                this.stack.shift();
            }
        }*/
    }
}

export { Players }

// TODO: hp regen system
// TODO: weapon equipment stuff
