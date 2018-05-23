import React from 'react';
import PlayerHTML from './PlayerHTML';

import GlobKey from '../util/GlobKey';
import Graphics from '../util/Graphics';

import Skill from './Skill';
import Action from './Action';

export default class Player extends Graphics {
    name = "def";

    stats = {
        int: 0, wil: 0, chr: 0,
        str: 0, con: 0, dex: 0
    };
    skills = {};
    actions = {};
    moves = {
        move: 5,
        main: 1,
        sub: 2
    };

    xp = 0;
    level = 1;

    hp = 100;
    mp = 100;
    hpMax = 100;
    mpMax = 100;
    hpRegen = 0;
    mpRegen = 0;

    gp = 0;
    equipment = {};

    bonuses = {};

    /* graphics */

    color = "#0000FF";
    stack = [];

    /* functions */

    constructor(params) {
        super(params);

        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }

        this.learn(new Skill({name: "dodge"}));
        this.learn(new Skill({name: "defence"}));

        this.update = () => {};
        this.html = <PlayerHTML player={this} key={GlobKey.getNewKey()}/>;
    }

    draw(ctx, x, y) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#black";
        ctx.arc( (x + .5) * ctx.size, (y + .5) * ctx.size, ctx.size / 2 - 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        if (this.stack[0]) {
            if (this.stack[0](this)) {
                this.stack.shift();
            }
        }
    }

    learn(action) {
        if (action instanceof Action) {
            if (action.skill && !this.skills[action.skill]) {
                this.skills[action.skill] = new Skill({name: action.skill, player: this});
            }
            action = Object.assign( Object.create( Object.getPrototypeOf(action)), action);
            action.player = this;
            this.actions[action.name] = action;
            this.update();
        } else if (action instanceof Skill) {
            action.player = this;
            this.skills[action.name] = action;
        }
    }

    pos(x, y) {
        if (this.map[x][y].player) {
            return false;
        }
        delete this.tile.player;
        this.x = x;
        this.y = y;
        this.tile = this.map[x][y];
        this.tile.player = this;
    }

    Gpos(x, y) {
        this.graphics.tile.graphics.player = undefined;
        this.graphics.tile = this.map[x][y];
        this.graphics.tile.graphics.player = this;
    }

    move(x, y) {
        this.pos(this.x + x, this.y + y);
    }

    HP(hp, aim = -1) {
        var pref = ""
        if (aim !== -1) {
            var dodge = this.skills.dodge.roll("dex");
            if (aim > dodge * 2) {
                pref = "crit: ";
                hp *= 2;
            }
            if (aim < dodge / 2) {
                this.tile.map.player.stack.push(() => {
                    this.tile.map.tag("dodge", "green", this.tile);
                    return true;
                });
                return;
            }
            if (aim < dodge) {
                pref = "half: ";
                hp /= 2;
            }
        }
        hp = Math.floor(hp);
        if (hp < 0) {
            hp = Math.min(hp + this.skills.defence.value(), 0);
            if (hp === 0) {
                this.tile.map.player.stack.push(() => {
                    this.tile.map.player.map.tag("block", "green", this.tile);
                    return true;
                });
                return;
            }
            this.tile.map.player.stack.push(() => {
                this.tile.map.player.map.tag(pref + hp + " hp", "red", this.tile);
                return true;
            });
        } else if (hp > 0) {
            this.tile.map.player.stack.push(() => {
                this.tile.map.tag(pref + "+" + hp + " hp", "green", this.tile);
                return true;
            });
        }
        this.hp += hp;
        if (this.hp <= 0) {
            this.die();
        }
        this.update();
    }

    MP(mp) {
        this.mp += mp;
        this.update();
    }

    die() {
        this.tile.map.removePlayer(this);
    }

    nextTurn() {
        this.moves = {
            move: 5,
            main: 1,
            sub: 2
        };
    }
}
