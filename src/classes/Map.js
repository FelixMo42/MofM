import React from 'react';
import MapHTML from './MapHTML';

import Tile from "./Tile";
import Player from "./Player";

var x;
var y;

export default class Map {
    name = "def";

    width = 10;
    height = 10;

    tiles = {};
    players = [];

    turn = 0;

    /* functions */

    constructor(params) {
        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }

        for (x = 0; x < this.width; x++) {
            this.tiles[x] = {}
            for (y = 0; y < this.height; y++) {
                this.tiles[x][y] = new Tile();
            }
        }

        /* set up */
            var good = this.addPlayer(new Player({x: 0, y: 9}));
            var bad = this.addPlayer(new Player({x: 9, y: 0}));

            good.name = "Felix Moses";

            bad.color = "#FF0000";
            bad.name = "Vladimir Putin";
        /* end set up */

        this.html = <MapHTML map={this}/>;
    }

    addPlayer(player) {
        player.tile = this.tiles[player.x][player.y];
        player.map = this;
        this.tiles[player.x][player.y].player = player;
        this.players.push(player);
        return player;
    }

    onMouseDown(x, y) {
        this.players[this.turn].pos(x, y);
    }

    draw(ctx) {
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                this.tiles[x][y].draw(ctx, x, y, 60);
            }
        }

        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (this.tiles[x][y].player) {
                    this.tiles[x][y].player.draw(ctx, x, y, 60);
                }
            }
        }
    }
}
