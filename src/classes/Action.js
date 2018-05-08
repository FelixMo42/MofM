const styles = {
    ball: {
        cheak: (obj, comp, x, y) => {
            return true; // TODO
        },
        do: (obj, comp, x, y) => {
            obj.affect(comp, x, y);
        }
    },
    line: {
        cheak: (obj, comp, x, y) => {
            return true; // TODO
        },
        do: (obj, comp, x, y) => {
            obj.affect(comp, x, y);
        }
    }
}

export default class Action {
    name = "def";

    skill = "";

    moves = {};

    components = [];

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
        this.components.push(obj);
    }

    effect(affect, x, y) {
        if (affect.target === "self") {
            this.player.tile.effect(affect);
        } else {
            this.player.map[x][y].effect(affect);
        }
    }

    cheak(x, y) {
        for (var i = 0; i < this.components.length; i++) {
            if ( styles[this.components[i].style].cheak(this.player.map, this.components[i], x, y) ) {
                return true;
            }
        }

        return false;
    }

    do(x, y) {
        if (!this.cheak(x, y)) { return false; }

        for (var i = 0; i < this.components.length; i++) {
            styles[this.components[i].style].do(this.player.map, this.components[i], x, y);
        }

        return true;
    }
}
