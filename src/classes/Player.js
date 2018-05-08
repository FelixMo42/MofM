import React from 'react';
import PlayerHTML from './PlayerHTML';

import GlobKey from '../util/GlobKey';

export default class Player {
    name = "def";

    stats = {
        int: 0, wil: 0, chr: 0,
        str: 0, con: 0, dex: 0
    };
    skills = {};
    actions = {};
    moves = {
        "move": 5,
        "main": 1,
        "sub": 2
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

    /* functions */

    constructor(params) {
        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }

        this.update = () => {};
        this.html = <PlayerHTML player={this} key={GlobKey.getNewKey()}/>;
    }

    draw(ctx, x, y, s) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc( (x + .5) * s, (y + .5) * s, s / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    learn(action) {
        action = Object.assign( Object.create( Object.getPrototypeOf(action)), action);
        action.player = this;
        this.actions[action.name] = action;
        this.update();
    }

    pos(x, y) {
        if (this.map[x][y].player) {
            return false;
        }
        this.tile.player = false;
        this.x = x;
        this.y = y;
        this.tile = this.map[x][y];
        this.tile.player = this;
    }

    move(x, y) {
        this.pos(this.x + x, this.y + y);
    }

    HP(hp) {
        this.hp += hp;
        this.update();
    }

    MP(mp) {
        this.mp += mp;
        this.update();
    }
}
