import React from 'react'
import Vec2 from '../util/Vec2'
import Controller from '../util/Controller'

import Base from "../component/Base"
import Interface from "../component/Interface"

import Tile from "./Tile"
import Player from "./Player"
import Item from "./Item"
import Structor from "./Structor"

export default class Map extends Interface(Base) {
    constructor(params) {
        super(params)

        for (var x = 0; x < this.width; x++) {
            this[x] = this[x] || []
            for (var y = 0; y < this.height; y++) {
                this[x][y] = {
                    pos: new Vec2(x, y),
                    map: this
                }
                this[x][y].tile = new this.base({node: this[x][y]})
            }
        }
    }

    // varibles

    name = "def"

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
        return this.Node(pos).tile
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
        if (item instanceof Item) {
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
        if (structor instanceof Structor || structor === false) {
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
        if (tile instanceof Tile) {
            tile.node = this.Node(start)
            this.Node(start).tile = tile
        } else {
            end = end || start

            Vec2.ForEach(start, end, (pos) => {
                this.SetTile(new tile(), pos)
            })
        }
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
                this[x][y].tile.Draw(ctx)
            }
        }

        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (this[x][y].structor) {
                    this[x][y].structor.Draw(ctx)
                }
                if (this[x][y].item) {
                    this[x][y].item.Draw(ctx)
                }
                if (this[x][y].player) {
                    this[x][y].player.Draw(ctx)
                }
            }
        }
    }

    Render() {
        return (
            <div>
                { this.players.map((player, key) => player.html) }
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
