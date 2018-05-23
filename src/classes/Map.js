import React from 'react';
import MapHTML from './MapHTML';

import Path from "../util/Path"

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

    info = [];

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
                this[x][y] = new Tile({x: x, y: y, map: this});
            }
        }

        /* set up */
            var good = this.addPlayer(new Player({x: 0, y: 9}));
            var bad = this.addPlayer(new Player({x: 9, y: 0}));

            var punch = new Action({
                name: "punch",
                moves: {main: 1},
                skill: "hand-to-hand"
            });
            punch.addComponent({
                range: 1,
                target: "player",
                player: {
                    hp: -10,
                }
            });

            var block = new Action({
                name: "block",
                skill: "defence",
                moves: {main: 1},
                ui: "instant"
            });

            var move = new Action({name: "move",
                ui: (ctx, x, y) => {
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.beginPath();
                    ctx.arc( (x + .5) * ctx.size, (y + .5) * ctx.size, ctx.size / 2, 0, 2 * Math.PI );
                    ctx.stroke();
                },
                cheak: (x, y, data) => {
                    data.path = Path.find(this.player.tile.map, this.player.x, this.player.y, x, y).slice(0, data.player.moves.move);
                    return (data.path[0] !== undefined);
                },
                draw: (data, x, y, player, action) => {
                    if (data.i === undefined) {
                        data.i = 0;
                        data.rate = 5;
                    }

                    data.i += 1000 / 40;

                    if (data.i >= (1000 / data.rate)) {
                        this.player.update();
                        data.i -= 1000 / data.rate;
                        player.Gpos(data.path[0].x, data.path[0].y);
                        data.path.shift();
                    }

                    return !data.path[0];
                }
            });
            move.addComponent({
                style: "click",
                target: "self",
                func: (tile, effect, x, y, data) => {
                    data.player.tile.graphics.player = data.player;
                    data.player.pos(data.path[data.path.length - 1].x, data.path[data.path.length - 1].y);
                    data.player.moves.move -= data.path.length;
                    data.player.tile.graphics.player = false;
                }
            });

            setTimeout( () => {
                good.name = "Felix Moses";
                good.learn(move);
                good.learn(punch);
                good.learn(block);
                good.controller = "player";

                bad.name = "Vladimir Putin";
                bad.color = "#AA5555";
                bad.learn(move);
                bad.learn(punch);
                bad.controller = (player) => {
                    player.actions.move.do(good.x + 1, good.y - 1);
                    player.actions.punch.do(good.x, good.y);
                };

                this.player = bad;
                this.nextTurn();
            }, 1000);
        /* end set up */

        this.html = <MapHTML map={this}/>;
    }

    nextTurn() {
        this.player.turn = false;
        this.player.update();

        this.turn++;
        if (this.turn >= this.players.length) {
            this.turn = 0;
        }

        this.player = this.players[this.turn];

        if (this.player.controller === "player") {
            this.action = this.player.actions.move;
        } else {
            this.player.controller(this.player);
            this.player.stack.push(() => {
                this.nextTurn();
                return true;
            });
        }

        this.player.nextTurn();
        this.player.turn = true;
        this.player.update();
    }

    addPlayer(player) {
        player.tile = this[player.x][player.y];
        player.graphics.tile = this[player.x][player.y];
        player.map = this;
        this[player.x][player.y].player = player;
        this.players.push(player);
        return player;
    }

    removePlayer(player) {
        var index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
            player.graphics.tile.graphics.player = undefined;
            delete player.tile.player;
            this.nextTurn();
        }
    }

    onMouseDown(x, y) {
        if (this.player.controller !== "player" || this.player.stack.length !== 0) { return; }

        if (this.action.do(x, y)) {
            this.player.stack.push(() => {
                for (var t in this.player.moves) {
                    if (this.player.moves[t] !== 0) {
                        return true;
                    }
                }
                this.nextTurn();
                return true;
            });
        }
    }

    onMouseMoved(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    onKeyPress(key) {
        if (key === "Enter") {
            this.player.stack.push(() => {
                this.nextTurn();
                return true;
            });
        }
    }

    tag(text, color, tile) {
        this.info.push({text: text, color: color, x: tile.x + .5, y: tile.y, count: 0});
    }

    draw(ctx) {
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                this[x][y].draw(ctx, x, y);
            }
        }

        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (this[x][y].graphics.player) {
                    this[x][y].graphics.player.draw(ctx, x, y);
                }
            }
        }

        if (this.player && this.player.controller === "player") {
            this.action.ui(ctx, this.mouseX, this.mouseY);
        }

        for (var i = 0; i < this.info.length; i++) {
            ctx.strokeStyle = "black";
            ctx.strokeText(this.info[i].text, this.info[i].x * ctx.size, this.info[i].y * ctx.size);
            ctx.fillStyle = this.info[i].color;
            ctx.fillText(this.info[i].text, this.info[i].x * ctx.size, this.info[i].y * ctx.size);

            this.info[i].y -= 1 / 40  * 2;
            this.info[i].count += 1 / 40;
            if (this.info[i].count > 1) {
                this.info.splice(i, 1);
                i--;
            }
        }
    }

    setAction(action) {
        if (action.ui === "instant") {
            action.do(action.player.tile.x, action.player.tile.y);
        } else {
            this.action = action;
        }
        action.player.update();
    }
}
