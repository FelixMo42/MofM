import React from 'react';
import MapHTML from './MapHTML';

import Tile from "./Tile";
import Player from "./Player";
import Action from "./Action";

var x;
var y;

export default class Map {
    name = "def";

    width = 10;
    height = 10;

    tiles = {};
    players = [];

    turn = -1;

    /* functions */

    constructor(params) {
        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }

        for (x = 0; x < this.width; x++) {
            this[x] = {}
            for (y = 0; y < this.height; y++) {
                this[x][y] = new Tile({x: x, y: y});
            }
        }

        /* set up */
            var good = this.addPlayer(new Player({x: 0, y: 9}));
            var bad = this.addPlayer(new Player({x: 9, y: 0}));

            var punch = new Action({name: "punch"});
            var block = new Action({name: "block"});
            var move = new Action({name: "move"});
            move.addComponent({
                target: "self",
                func: function(tile, effect, x, y) {
                    // TODO: pathfinding
                }
            })

            setTimeout( () => {
                good.name = "Felix Moses";
                good.learn(punch);
                good.learn(block);
                good.learn(move);

                bad.color = "#FF0000";
                bad.name = "Vladimir Putin";
                bad.learn(punch);

                this.nextTurn();
            }, 1000);
        /* end set up */

        this.html = <MapHTML map={this}/>;
    }

    nextTurn() {
        this.turn++;
        if (this.turn === this.players.length) {
            this.turn = 0;
        }
        this.player = this.players[this.turn];
        this.action = this.player.actions.move;
    }

    addPlayer(player) {
        player.tile = this[player.x][player.y];
        player.map = this;
        this[player.x][player.y].player = player;
        this.players.push(player);
        return player;
    }

    onMouseDown(x, y) {
        if (this.action.do(x, y)) {
            // succses
        } else {
            // failed
        }
    }

    draw(ctx) {
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                this[x][y].draw(ctx, x, y, 60);
            }
        }

        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (this[x][y].player) {
                    this[x][y].player.draw(ctx, x, y, 60);
                }
            }
        }
    }
}
