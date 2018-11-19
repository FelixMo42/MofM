import Base from "../mixin/Base"

import Tile, { Tiles } from "./Tile"
import Player, { Players } from "./Player"
import Item, { Items } from "./Item"
import Structor, { Structors } from "./Structor"

const Maps = {}

export default class Map extends Base {
    constructor(params) {
        super(Maps)
        this.Setup(params)

        for (var x = 0; x < this.width; x++) {
            this.tiles[x] = []
            for (var y = 0; y < this.height; y++) {
                this.tiles[x][y] = this.base.Clone({x: x, y: y, map: this})
            }
        }

        if (this.players.length > 0) {
            this.player = this.players[0]
            this.NextTurn()
        } else {
            // TODO: empty world error?
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

    Tile(x, y) {
        // TODO: out of range

        return this.tiles[x][y]
    }

    // creater functions

    PutPlayer(player, x, y) {
        this.players.push(player)
        player.Tile(this.Tile(x, y))
    }

    SetPlayer(player, sx, sy, ex, ey) {
        if (player instanceof Player) {
            player = player.id
        }

        for (var x = Math.min(sx,ex); x < Math.max(sx,ex); x++) {
            for (var y = Math.min(sy,ey); x < Math.min(sy,ey); y++) {
                this.PutPlayer(Players[player].Clone(), x, y)
            }
        }
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

    PutTile(tile, x, y) {
        // TODO: put tile
    }

    SetTile(tile, sx, sy, ex, ey) {
        // TODO: set tile
    }

    // functions

    NextTurn() {
        var pos = this.turn % this.players.length
        if (pos === 0) {
            // TODO: tile mana spread
            // TODO: outher loop stuff?
        }
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
                //if (this.tiles[x][y].graphics.structor) {
                //    this.tiles[x][y].graphics.structor.Render(ctx)
                //}
                //if (this.tiles[x][y].graphics.item) {
                //    this.tiles[x][y].graphics.item.Render(ctx)
                //}
                if (this.tiles[x][y].Player()) {
                    this.tiles[x][y].Player().Draw(ctx)
                }
            }
        }
    }
}

export { Maps }
