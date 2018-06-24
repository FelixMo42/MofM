import Path from "../util/Path";

const styles = {
    ball: {
        cheak: (obj, comp, x, y) => {
            return Math.floor(Path.dist(obj.player.tile.x, obj.player.tile.y, x, y)) <= comp.range;
        },
        do: (obj, comp, x, y, data) => {
            if (!comp.area || comp.area === 0) {
                obj.affect(comp, x, y, data);
            } else {

            }
        },
        ui: (ctx, obj, comp, x, y) => {
            ctx.strokeStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc( (obj.player.tile.x + .5) * ctx.size, (obj.player.tile.y + .5) * ctx.size,comp.range * ctx.size - 2,0,2*Math.PI);
            ctx.stroke();

            ctx.strokeStyle = "#000000";
            ctx.beginPath();
            ctx.arc( (obj.player.tile.x + .5) * ctx.size, (obj.player.tile.y + .5) * ctx.size,comp.range * ctx.size,0,2*Math.PI);
            ctx.stroke();

            var area;
            if (!comp.area || comp.area === 0) {
                area = .5;
            } else {
                area = comp.area;
            }

            ctx.beginPath();
            ctx.arc( (x + .5) * ctx.size, (y + .5) * ctx.size, area * ctx.size, 0, 2 * Math.PI );
            ctx.arc( (x + .5) * ctx.size, (y + .5) * ctx.size, area * ctx.size - 4, 0, 2 * Math.PI );
            ctx.stroke();

            ctx.beginPath();
            if (Math.floor(Path.dist(obj.player.tile.x, obj.player.tile.y, x, y)) <= comp.range) {
                ctx.strokeStyle = "#00FF00";
            } else {
                ctx.strokeStyle = "#FF0000";
            }
            ctx.arc( (x + .5) * ctx.size, (y + .5) * ctx.size,area * ctx.size - 2,0,2*Math.PI);
            ctx.stroke();
        }
    },
    line: {
        cheak: (obj, comp, x, y) => {
            return true; // TODO
        },
        do: (obj, comp, x, y, data) => {
            obj.affect(comp, x, y, data);
        },
        ui: (ctx, obj, comp, x, y) => {
        }
    },
    click: {
        cheak: (obj, comp, x, y) => {
            return true;
        },
        do: (obj, comp, x, y, data) => {
            obj.affect(comp, x, y, data);
        },
        ui: (ctx, obj, comp, x, y) => {

        }
    },
}

export default class Action {
    name = "def";

    skill = "";

    moves = {};
    components = [];

    show = true;

    /* functions */

    constructor(params) {
        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }
    }

    addComponent(obj) {
        if (!obj.style) { obj.style = "ball"; }
        if (!obj.skill) { obj.skill = this.skill; }
        this.components.push(obj);
    }

    affect(effect, x, y, data) {
        if (effect.target === "self") {
            this.player.tile.affect(effect, x, y, data);
        } else {
            this.player.map[x][y].affect(effect, x, y, data);
        }
    }

    cheak(x, y, data) {
        for (var key in this.moves) {
            if (this.player.moves[key] < this.moves[key]) {
                return false;
            }
        }

        if (this.ui === "instant") { return true; }

        for (var i = 0; i < this.components.length; i++) {
            if ( !styles[this.components[i].style].cheak(this, this.components[i], x, y) ) {
                return false;
            }
        }

        return true;
    }

    do(x, y) {
        var data = {
            action: this,
            player: this.player
        };

        if (!this.cheak(x, y, data)) { return false; }

        for (var i = 0; i < this.components.length; i++) {
            styles[this.components[i].style].do(this, this.components[i], x, y, data);
        }

        for (var key in this.moves) {
            this.player.moves[key] -= this.moves[key]
            this.player.update()
        }

        if (this.draw) {
            this.player.stack.push((player) => {
                return this.draw(data, x, y, player, this);
            });
        }

        return true;
    }

    ui(ctx, x, y) {
        for (var i = 0; i < this.components.length; i++) {
            styles[this.components[i].style].ui(ctx, this, this.components[i], x, y);
        }
    }
}
