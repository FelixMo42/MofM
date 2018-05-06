import React from 'react';
import PlayerHTML from './PlayerHTML';

import GlobKey from '../util/GlobKey';

import Action from './Action';

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

        this.html = <PlayerHTML player={this} key={GlobKey.getNewKey()}/>;
    }

    draw(ctx, x, y, s) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc( (x + .5) * s, (y + .5) * s, s / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    pos(x, y) {
        this.tile.player = false;
        this.x = x;
        this.y = y;
        this.tile = this.map.tiles[x][y];
        this.tile.player = this;

        new Action({player: this});
    }
}
