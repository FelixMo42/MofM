import React from 'react'
import Vec2 from '../util/Vec2'
import Controller from '../util/Controller'

import Base from "../component/Base"
import Interface from "../component/Interface"

import Tile, { Tiles } from "./Tile"
import Player, { Players } from "./Player"
import Item, { Items } from "./Item"
import Structor, { Structors } from "./Structor"

const Maps = {}

export default class Map extends Interface(Base) {
    constructor(params) {
        super(Maps)
        this.Setup(params)

        for (var x = 0; x < this.width; x++) {
            this.tiles[x] = []
            for (var y = 0; y < this.height; y++) {
                this.tiles[x][y] = this.base.Clone({pos: new Vec2(x, y), map: this})
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

    base = new Tile()

    // accessors

    Tile(pos) {
        if (pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height) {
            return this.tiles[pos.x][pos.y]
        }
    }

    // creater functions

    PutPlayer(player, pos) {
        this.players.push(player)
        player.Tile(this.Tile(pos))
    }

    SetPlayer(player, start, end) {
        if (player instanceof Player) {
            player = player.id
        }

        for (var x = Math.min(start.x, end.x); x < Math.max(start.x, end.x); x++) {
            for (var y = Math.min(start.y, end.y); x < Math.min(start.y, end.y); y++) {
                this.PutPlayer(Players[player].Clone(), x, y)
            }
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

    PutItem(item, x, y) {
        item.Tile(this.Tile(x, y))
    }

    SetItem(item, sx, sy, ex, ey) {
        if (item instanceof Item) {
            item = item.id
        }

        ex = ex || sx
        ey = ey || sy

        for (var x = Math.min(sx,ex); x <= Math.max(sx,ex); x++) {
            for (var y = Math.min(sy,ey) - 1; y <= Math.max(sy,ey); y++) {
                this.PutItem(Items[item].Clone(), x, y)
            }
        }
    }

    PutStructor(structor, x, y) {
        structor.Tile(this.Tile(x, y))
    }

    SetStructor(structor, sx, sy, ex, ey) {
        if (structor instanceof Structor) {
            structor = structor.id
        }

        for (var x = Math.min(sx,ex); x < Math.max(sx,ex); x++) {
            for (var y = Math.min(sy,ey); x < Math.min(sy,ey); y++) {
                this.PutStructor(Structors[structor].Clone(), x, y)
            }
        }
    }

    PutTile(tile, pos) {
        var old = this.Tile(pos)
        for (var k in tile) {
            old[k] = tile[k]
        }
    }

    SetTile(tile, start, end) {
        if (tile instanceof Tile) {
            tile = tile.id
        }
        Vec2.forEach(start, end, (pos) => {
            this.PutTile(Tiles[tile].Clone(), pos)
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
                this.tiles[x][y].Render(ctx)
            }
        }

        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                if (this.tiles[x][y].structor) {
                    this.tiles[x][y].structor.Render(ctx)
                }
                if (this.tiles[x][y].item) {
                    this.tiles[x][y].item.Render(ctx)
                }
                if (this.tiles[x][y].Player()) {
                    this.tiles[x][y].Player().Draw(ctx)
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

export { Maps }
