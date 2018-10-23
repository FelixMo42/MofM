import Graphics from "./components/Graphics"

import Skill, { Skills } from "./Skill"
import Action, { Actions } from "./Action"

const Players = {}

export default class Player extends Graphics  {
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

    HP(hp) {
        if (hp) {
            if (typeof hp === 'object') {
                hp = Math.floor(Math.random() * (hp[1] - hp[0] + 1)) + hp[0]
            }

            this.hp += hp

            // TODO: max health + death
            // TODO: temp health
        }

        return this.hp
    }

    MP(mp) {
        if (mp) {
            if (typeof mp === 'object') {
                mp = Math.floor(Math.random() * (mp[1] - mp[0] + 1)) + mp[0]
            }

            this.mp += mp

            // TODO: max mp + 0 mp
            // TODO: temp mp
        }

        return this.mp
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

    Render(ctx) {
        ctx.beginPath();

        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.arc( (this.x + .5) * ctx.size, (this.y + .5) * ctx.size, ctx.size / 2 - 3, 0, 2 * Math.PI);
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
