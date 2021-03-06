import React from 'react'
import Vec2 from '../util/Vec2'
import Controller from '../util/Controller'

import Base from "../component/Base"
import Interface from "../component/Interface"

import Tile from "./Tile"
import Player from "./Player"

function cheak(obj, start, end) {
    if (end) {
        return false
    } else if (!obj.prototype) {
        return true
    } else if (obj === false) {
        return true
    } else {
        return false
    }
}

class Node {
    sprite = {}
}

export default class Map extends Interface(Base) {
    constructor(params) {
        super(params)

        for (var x = 0; x < this.width; x++) {
            this[x] = this[x] || []
            for (var y = 0; y < this.height; y++) {
                this[x][y] = new Node()
                this[x][y].pos = new Vec2(x, y)
                this[x][y].map = this
                this[x][y].tile = new this.base({node: this[x][y]})
            }
        }
    }

    // varibles

    name = "def"

    log = []
    tiles = []
    players = []

    width = 10
    height = 10

    turn = 1

    base = Tile

    // accessors

    Node(pos) {
        if (pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height) {
            return this[pos.x][pos.y]
        }
    }

    Tile(pos) {
        if (pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height) {
            return this[pos.x][pos.y].tile
        }
    }

    Players() {
        return this.players
    }

    // creater functions

    SetPlayer(player, start, end) {
        if (player instanceof Player) {
            this.players.push(player)
            player.Tile(this.Tile(start))
        } else {
            Vec2.ForEach(start, end, (pos) => {
                this.SetPlayer(new player(), pos)
            })
        }
    }

    RemovePlayer(player) {
        if (player.Tile()) {
            player.Tile().Player(false)
            player.Tile(false)
        }
        for (var i = this.players.indexOf(player) + 1; i < this.players.length; i++) {
            this.players[i - 1] = this.players[i]
        }
        this.players = this.players.slice(0,-1)
        this.UpdateHTML()
    }

    SetItem(item, start, end) {
        if (cheak(item, start, end)) {
            this.Tile(start).Item(item)
        } else {
            end = end || start

            if (!item) {
                Vec2.ForEach(start, end, (pos) => {
                    this.SetItem(false, pos)
                })
            } else {
                Vec2.ForEach(start, end, (pos) => {
                    this.SetItem(new item(), pos)
                })
            }
        }
    }

    SetStructor(structor, start, end) {
        if (cheak(structor, start, end)) {
            this.Tile(start).Structor(structor)
        } else {
            end = end || start

            if (!structor) {
                Vec2.ForEach(start, end, (pos) => {
                    this.SetStructor(false, pos)
                })
            } else {
                Vec2.ForEach(start, end, (pos) => {
                    this.SetStructor(new structor(), pos)
                })
            }
        }
    }

    SetTile(tile, start, end) {
        if (cheak(tile, start, end)) {
            tile.node = this.Node(start)
            this.Node(start).tile = tile
        } else {
            end = end || start

            Vec2.ForEach(start, end, (pos) => {
                this.SetTile(new tile(), pos)
            })
        }
    }

    Log(source, text, color) {
        this.log.push({
            text: text,
            color: color,
            time: 1,
            pos: source.Position().Copy()
        })
    }

    // functions

    NextTurn() {
        if (this.players.length === 0) { return } // TODO: empty world bug
        var pos = this.turn % this.players.length
        if (pos === 0) {
            // TODO: tile mana spread
            // TODO: outher loop stuff?
        }
        this.turn += 1
        this.player = this.players[pos]
        this.player.Turn()
    }

    // graphics

    Draw(ctx) {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                //this[x][y].sprite.tile.Draw(ctx)
                this[x][y].tile.Draw(ctx)
            }
        }

        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (this[x][y].sprite.structor) {
                    this[x][y].sprite.structor.Draw(ctx, new Vec2(x, y))
                }
                if (this[x][y].sprite.item) {
                    this[x][y].sprite.item.sprite.Draw(ctx, new Vec2(x, y))
                }
                if (this[x][y].sprite.player) {
                    this[x][y].sprite.player.Draw(ctx, new Vec2(x, y))
                }
            }
        }

        Controller.DrawUI(ctx)

        for (var log of this.log) {
            ctx.fillStyle = log.color || "black"
            ctx.font = "30px Arial"
            ctx.fillText(log.text,
                (log.pos.x + .5) * ctx.size,
                log.pos.y * ctx.size
            )
            log.pos.y -= ctx.dt

            log.time -= ctx.dt
            if (log.time <= 0) {
                this.log.splice(this.log.indexOf(log), 1)
            }
        }
    }

    Render() {
        return (
            <div>
                {this.players.map((player, key) => player.html)}
            </div>
        )
    }

    OnMouseDown(pos) {
        Controller.OnMouseDown(pos)
    }

    OnMouseMoved(pos) {
        Controller.OnMouseMoved(pos)
    }

    OnKeyPress(key) {
        Controller.OnKeyPress(key)
    }
}
