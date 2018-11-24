import React from 'react'

import Base from "../component/Base"

const Skills = {}

export default class Skill extends Base {
    constructor(params) {
        super(Skills)
        this.Setup(params)
    }

    // varibles

    name = "def"

    xp = 0
    lv = 0

    // accessors

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

    Bonus(stat, b = 0) {
        if (stat) {
            b += this.player.Stat(stat)
        }
        b += this.player.Bonus("skill",this.id)
        return b
    }

    // functions

    Roll(stat) {
        return Math.floor(Math.random() * 20 + 1) + this.LV() + this.Bonus(stat)
    }

    // graphics

    Render() {
        return (
            <span key={this.key}>
                {this.name}: {this.LV()}
                { this.Bonus() !== 0 &&  " +" + this.Bonus() }
            </span>
        )
    }
}

export { Skills }

// TODO: skill tree
