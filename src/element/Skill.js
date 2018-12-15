import React from 'react'

import Base from "../component/Base"

import Action from "./Action"

export const Skills = {}

export default class Skill extends Base {
    constructor(params) {
        super(params)
        this.actions = this.actions || []
    }

    static Action(action) {
        this.__proto__.actions = this.__proto__.actions || {}
        this.__proto__.actions[action.id] = action
    }

    // varibles

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
        b += this.player.Bonus("skill", this.id)
        return b
    }

    Action(action) {
        if (action) {
            if (action instanceof Action) {
                action = action.id
            }
            return this.actions[action]
        }
        return this.actions
    }

    // functions

    Roll(stat, die = 20) {
        return Math.floor(Math.random() * (die - 1) + 1) + this.LV() + this.Bonus(stat)
    }

    // graphics

    Render() {
        return (
            <span key={this.key}>
                {this.name}: {this.LV()}
                {this.Bonus() !== 0 &&  " +" + this.Bonus()}
                <br />
            </span>
        )
    }
}

// TODO: skill tree
